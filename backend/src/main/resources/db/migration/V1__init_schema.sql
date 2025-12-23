-- V1__init_schema.sql
-- Initial schema for FinTrack: categories, merchants, expenses

-- Categories: e.g. Bills, Food, Grocery, Rent, Laundry, Salary, etc.
CREATE TABLE IF NOT EXISTS category (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Merchants / Places / Sources:
-- e.g. 'Tesco Express', 'Tesco Superstore', 'Sainsbury''s', 'Online'
CREATE TABLE IF NOT EXISTS merchant (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL UNIQUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Expenses: each individual transaction
CREATE TABLE IF NOT EXISTS expense (
    id              BIGSERIAL PRIMARY KEY,
    txn_date        DATE           NOT NULL,
    item TEXT NOT NULL,
    amount          NUMERIC(12,2)  NOT NULL,

    -- Links to category and merchant (both optional for flexibility)
    category_id     BIGINT         REFERENCES category(id),
    merchant_id     BIGINT         REFERENCES merchant(id),

    -- How you paid: 'CASH', 'CARD', 'BANK_TRANSFER', 'PAYPAL'
    payment_method  VARCHAR(30)    NOT NULL,

    -- Who paid: e.g. 'parth', 'jay'
    paid_by         VARCHAR(50)    NOT NULL,

    -- CREDIT = money coming in (income)
    -- DEBIT  = money going out (expense)
    entry_type      VARCHAR(10)    NOT NULL,

    notes           TEXT,
    created_at      TIMESTAMP      NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_expense_entry_type
        CHECK (entry_type IN ('CREDIT', 'DEBIT')),

    CONSTRAINT chk_expense_payment_method
        CHECK (payment_method IN ('CASH', 'CARD', 'BANK_TRANSFER', 'PAYPAL'))
);

-- Helpful indexes for faster queries later
CREATE INDEX IF NOT EXISTS idx_expense_date
    ON expense (txn_date);

CREATE INDEX IF NOT EXISTS idx_expense_category
    ON expense (category_id);

CREATE INDEX IF NOT EXISTS idx_expense_merchant
    ON expense (merchant_id);
