package config

import (
    "log"
    "os"
    "strconv"
    "strings"
    "time"
)

type Config struct {
    DatabaseURL           string
    RedisAddr             string
    JWTSecret             string
    ServerAddr            string
    SubmissionRateLimitN  int
    SubmissionRateWindow  time.Duration
    LoginRateLimitN       int
    LoginRateWindow       time.Duration
    AllowCorsOrigin       string
    DevNoExternals        bool
}

func getenv(key, def string) string {
    v := os.Getenv(key)
    if v == "" {
        return def
    }
    return v
}

func atoiDefault(s string, def int) int {
    if s == "" {
        return def
    }
    n, err := strconv.Atoi(s)
    if err != nil {
        return def
    }
    return n
}

func getbool(key string, def bool) bool {
    v := os.Getenv(key)
    if v == "" {
        return def
    }
    switch strings.ToLower(strings.TrimSpace(v)) {
    case "1", "true", "yes", "y", "on":
        return true
    case "0", "false", "no", "n", "off":
        return false
    default:
        return def
    }
}

func Load() Config {
    c := Config{
        DatabaseURL:          getenv("DATABASE_URL", "postgres://scavenger:scavenger@localhost:5432/scavenger?sslmode=disable"),
        RedisAddr:            getenv("REDIS_ADDR", "127.0.0.1:6379"),
        JWTSecret:            getenv("JWT_SECRET", "dev_super_secret_change_me"),
        ServerAddr:           getenv("SERVER_ADDR", ":8080"),
        SubmissionRateLimitN: atoiDefault(getenv("SUBMISSION_RATE_LIMIT_N", "5"), 5),
        LoginRateLimitN:      atoiDefault(getenv("LOGIN_RATE_LIMIT_N", "10"), 10),
        AllowCorsOrigin:      getenv("ALLOW_CORS_ORIGIN", "*"),
        DevNoExternals:       getbool("DEV_NO_EXTERNALS", false),
    }

    // Windows as minutes by default
    subWindowMinutes := atoiDefault(getenv("SUBMISSION_RATE_WINDOW_MIN", "10"), 10)
    loginWindowMinutes := atoiDefault(getenv("LOGIN_RATE_WINDOW_MIN", "5"), 5)
    c.SubmissionRateWindow = time.Duration(subWindowMinutes) * time.Minute
    c.LoginRateWindow = time.Duration(loginWindowMinutes) * time.Minute

    if c.JWTSecret == "dev_super_secret_change_me" {
        log.Println("[WARN] Using default JWT secret; set JWT_SECRET in production")
    }
    return c
}

