package rate

import (
    "context"
    "fmt"
    "sync"
    "time"

    "github.com/redis/go-redis/v9"
)

type Limiter struct {
    redis *redis.Client
    local *localLimiter
}

type localEntry struct {
    count     int
    expiresAt time.Time
}

type localLimiter struct {
    mu     sync.Mutex
    values map[string]localEntry
}

func New(rdb *redis.Client) *Limiter {
    l := &Limiter{redis: rdb}
    if rdb == nil {
        l.local = &localLimiter{values: make(map[string]localEntry)}
    }
    return l
}

func (l *Limiter) Allow(ctx context.Context, key string, n int, window time.Duration) (bool, int) {
    if l.redis != nil {
        // Use Redis INCR with TTL
        cnt, err := l.redis.Incr(ctx, key).Result()
        if err != nil {
            // Fail open on Redis error
            return true, int(cnt)
        }
        if cnt == 1 {
            l.redis.PExpire(ctx, key, window)
        }
        return cnt <= int64(n), int(cnt)
    }
    // Local fallback
    l.local.mu.Lock()
    defer l.local.mu.Unlock()
    now := time.Now()
    e, ok := l.local.values[key]
    if !ok || now.After(e.expiresAt) {
        e = localEntry{count: 0, expiresAt: now.Add(window)}
    }
    e.count++
    l.local.values[key] = e
    return e.count <= n, e.count
}

func Key(parts ...string) string {
    // naive join; ensure low collision risk
    return fmt.Sprint(parts)
}

