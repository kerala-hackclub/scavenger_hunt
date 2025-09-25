package server

import (
    "context"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "scavenger/internal/auth"
    "scavenger/internal/db"
    "scavenger/internal/rate"
)

func (a *App) registerRoutes() {
    a.Router.GET("/healthz", func(c *gin.Context) { c.JSON(200, gin.H{"ok": true}) })

    // Run migrations on startup endpoint (temporary helper for dev)
    a.Router.POST("/admin/run-migrations", func(c *gin.Context) {
        if a.DB == nil {
            c.JSON(http.StatusServiceUnavailable, gin.H{"error": "database unavailable in dev mode"})
            return
        }
        if err := db.RunMigrations(context.Background(), a.DB); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        c.JSON(200, gin.H{"migrated": true})
    })

    api := a.Router.Group("/api")
    {
        api.GET("/ping", func(c *gin.Context) { c.JSON(200, gin.H{"message": "pong"}) })

        // Auth: POST /api/auth/login
        api.POST("/auth/login", func(c *gin.Context) {
            type req struct{ Username, Password string }
            var r req
            if err := c.ShouldBindJSON(&r); err != nil {
                c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
                return
            }
            // Rate limit login by IP
            limiter := rate.New(a.RedisClient)
            ip := c.ClientIP()
            allow, _ := limiter.Allow(c, rate.Key("login", ip), a.Config.LoginRateLimitN, a.Config.LoginRateWindow)
            if !allow {
                c.JSON(http.StatusTooManyRequests, gin.H{"error": "too many attempts"})
                return
            }
            // DEV mode fallback: accept any non-empty creds, issue player token
            // TODO: replace with real DB validation when users table is wired
            if a.DB == nil {
                if r.Username == "" || r.Password == "" {
                    c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
                    return
                }
                tok, _ := auth.GenerateToken(a.Config.JWTSecret, 1, r.Username, "player", 24*time.Hour)
                a.setAuthCookie(c, tok)
                c.JSON(200, gin.H{"ok": true})
                return
            }
            // Placeholder until DB auth is implemented
            c.JSON(http.StatusNotImplemented, gin.H{"error": "auth not implemented yet"})
        })

        // Protected example
        protected := api.Group("")
        protected.Use(a.authMiddleware())
        protected.GET("/me", func(c *gin.Context) {
            c.JSON(200, gin.H{
                "user_id":  c.GetInt64("user_id"),
                "username": c.GetString("username"),
                "role":     c.GetString("role"),
            })
        })
    }
}

