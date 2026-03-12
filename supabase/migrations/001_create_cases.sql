CREATE TABLE cases (
  id              BIGSERIAL PRIMARY KEY,
  receipt_number  VARCHAR(13) NOT NULL UNIQUE,
  form_type       VARCHAR(10) NOT NULL,
  service_center  VARCHAR(10) NOT NULL,
  status          TEXT NOT NULL,
  description     TEXT,
  receipt_date    DATE,
  modified_date   TIMESTAMPTZ,
  last_checked    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cases_form_center ON cases(form_type, service_center);
CREATE INDEX idx_cases_form_center_status ON cases(form_type, service_center, status);
CREATE INDEX idx_cases_receipt_prefix ON cases(receipt_number varchar_pattern_ops);
CREATE INDEX idx_cases_modified_date ON cases(modified_date);
CREATE INDEX idx_cases_receipt_date ON cases(receipt_date);
