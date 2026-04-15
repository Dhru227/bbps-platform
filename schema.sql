CREATE TABLE IF NOT EXISTS bou_registry (
    bou_id          VARCHAR(20) PRIMARY KEY,
    bou_name        VARCHAR(100) NOT NULL,
    bou_endpoint    VARCHAR(255) NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS biller_registry (
    biller_id           VARCHAR(14) PRIMARY KEY,
    biller_name         VARCHAR(100) NOT NULL,
    category            VARCHAR(50) NOT NULL,
    biller_endpoint     VARCHAR(255),
    assigned_bou_id     VARCHAR(20) REFERENCES bou_registry(bou_id),
    status              VARCHAR(20) DEFAULT 'PENDING',
    created_at          TIMESTAMP DEFAULT NOW(),
    activated_at        TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bou_biller_mapping (
    mapping_id      SERIAL PRIMARY KEY,
    biller_id       VARCHAR(14) REFERENCES biller_registry(biller_id),
    bou_id          VARCHAR(20) REFERENCES bou_registry(bou_id),
    mapped_at       TIMESTAMP DEFAULT NOW(),
    confirmed_at    TIMESTAMP,
    is_active       BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS onboarding_sessions (
    session_id      VARCHAR(36) PRIMARY KEY,
    biller_id       VARCHAR(14),
    stage           VARCHAR(50),
    chat_history    JSONB,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);