-- Core tables
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'player',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cards (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    short_clue TEXT NOT NULL,
    full_clue TEXT NOT NULL,
    hints JSONB NOT NULL DEFAULT '[]',
    solution_hash TEXT NOT NULL,
    points INT NOT NULL DEFAULT 0,
    hidden BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ NULL,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS solves (
    id BIGSERIAL PRIMARY KEY,
    card_id BIGINT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    solved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    points_awarded INT NOT NULL
);

CREATE INDEX IF NOT EXISTS solves_card_id_idx ON solves(card_id);
CREATE INDEX IF NOT EXISTS solves_user_id_idx ON solves(user_id);

CREATE TABLE IF NOT EXISTS submissions (
    id BIGSERIAL PRIMARY KEY,
    card_id BIGINT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attempt_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    ip TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS submissions_card_user_time_idx ON submissions(card_id, user_id, timestamp DESC);

CREATE TABLE IF NOT EXISTS credential_seeds (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Seed an admin user placeholder (password: to be set manually)
INSERT INTO users (username, password_hash, role)
VALUES ('admin', '$2a$12$replace_me_with_real_bcrypt_hash', 'admin')
ON CONFLICT (username) DO NOTHING;

