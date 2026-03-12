CREATE TABLE case_history (
  id              BIGSERIAL PRIMARY KEY,
  receipt_number  VARCHAR(13) NOT NULL REFERENCES cases(receipt_number),
  status          TEXT NOT NULL,
  description     TEXT,
  checked_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_history_receipt ON case_history(receipt_number);
CREATE INDEX idx_history_checked_at ON case_history(checked_at);
