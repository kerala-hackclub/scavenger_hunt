package server

import (
    "context"
    "log"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/jackc/pgx/v5/pgxpool"
    "github.com/redis/go-redis/v9"

    "scavenger/internal/config"
)

type App struct {
    Router      *gin.Engine
    DB          *pgxpool.Pool
    RedisClient *redis.Client
    Config      config.Config
}

func Run() {
    cfg := config.Load()

    var dbpool *pgxpool.Pool
    var rdb *redis.Client

    if !cfg.DevNoExternals {
        // Database
        pool, err := pgxpool.New(context.Background(), cfg.DatabaseURL)
        if err != nil {
            log.Fatalf("failed to create db pool: %v", err)
        }
        ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
        defer cancel()
        if err := pool.Ping(ctx); err != nil {
            log.Fatalf("failed to ping db: %v", err)
        }
        dbpool = pool

        // Redis
        r := redis.NewClient(&redis.Options{Addr: cfg.RedisAddr})
        if err := r.Ping(context.Background()).Err(); err != nil {
            log.Fatalf("failed to ping redis: %v", err)
        }
        rdb = r
    } else {
        log.Println("[DEV] DEV_NO_EXTERNALS=true -> skipping DB/Redis connections")
    }

    gin.SetMode(gin.ReleaseMode)
    router := gin.New()
    router.Use(gin.Recovery())
    router.Use(corsMiddleware(cfg.AllowCorsOrigin))

    app := &App{
        Router:      router,
        DB:          dbpool,
        RedisClient: rdb,
        Config:      cfg,
    }

    app.registerRoutes()

    log.Printf("listening on %s", cfg.ServerAddr)
    if err := http.ListenAndServe(cfg.ServerAddr, router); err != nil {
        log.Fatalf("server error: %v", err)
    }
}

func corsMiddleware(allowOrigin string) gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Header("Access-Control-Allow-Origin", allowOrigin)
        c.Header("Access-Control-Allow-Credentials", "true")
        c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
        if c.Request.Method == http.MethodOptions {
            c.AbortWithStatus(http.StatusNoContent)
            return
        }
        c.Next()
    }
}

