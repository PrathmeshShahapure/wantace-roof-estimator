CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Admin users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Estimator questions
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    label TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    unit VARCHAR(50),
    required BOOLEAN NOT NULL DEFAULT true,
    min_value NUMERIC,
    max_value NUMERIC,
    active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- Options belonging to questions
CREATE TABLE question_options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    value VARCHAR(100) NOT NULL,
    label TEXT NOT NULL,
    rate_per_sqft NUMERIC,
    multiplier NUMERIC,
    tear_off_per_sqft NUMERIC,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- Global estimator settings
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value NUMERIC NOT NULL
);

-- Customer leads
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    config_version INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    answers JSONB NOT NULL,
    estimate_low NUMERIC NOT NULL,
    estimate_high NUMERIC NOT NULL
);