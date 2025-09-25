package server

import (
    "net/http"
    "strings"
    "time"

    "github.com/gin-gonic/gin"
    "scavenger/internal/auth"
)

const authCookieName = "scavenger_jwt"

func (a *App) authMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := ""
        // Prefer cookie
        if cookie, err := c.Cookie(authCookieName); err == nil && cookie != "" {
            token = cookie
        }
        // Fallback to Authorization header
        if token == "" {
            hdr := c.GetHeader("Authorization")
            if strings.HasPrefix(strings.ToLower(hdr), "bearer ") {
                token = strings.TrimSpace(hdr[7:])
            }
        }
        if token == "" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing auth"})
            return
        }
        claims, err := auth.ParseToken(a.Config.JWTSecret, token)
        if err != nil {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
            return
        }
        c.Set("user_id", claims.UserID)
        c.Set("username", claims.Username)
        c.Set("role", claims.Role)
        c.Next()
    }
}

func (a *App) setAuthCookie(c *gin.Context, token string) {
    // httpOnly cookie, JS cannot read; still allow Authorization header usage if needed
    c.SetCookie(authCookieName, token, int((24*time.Hour).Seconds()), "/", "", false, true)
}

func requireAdmin() gin.HandlerFunc {
    return func(c *gin.Context) {
        role, _ := c.Get("role")
        if roleStr, ok := role.(string); !ok || roleStr != "admin" {
            c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "admin only"})
            return
        }
        c.Next()
    }
}

