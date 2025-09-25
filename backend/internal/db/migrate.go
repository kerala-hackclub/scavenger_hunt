package db

import (
    "context"
    "embed"
    "fmt"
    "strings"

    "github.com/jackc/pgx/v5/pgxpool"
)

//go:embed migrations/*.sql
var migrationsFS embed.FS

func RunMigrations(ctx context.Context, pool *pgxpool.Pool) error {
    entries, err := migrationsFS.ReadDir("migrations")
    if err != nil {
        return fmt.Errorf("read migrations: %w", err)
    }
    // Run in lexical order
    for _, e := range entries {
        if e.IsDir() { continue }
        name := e.Name()
        if !strings.HasSuffix(name, ".sql") { continue }
        sqlBytes, err := migrationsFS.ReadFile("migrations/" + name)
        if err != nil { return fmt.Errorf("read %s: %w", name, err) }
        if _, err := pool.Exec(ctx, string(sqlBytes)); err != nil {
            return fmt.Errorf("exec %s: %w", name, err)
        }
    }
    return nil
}

