CREATE TABLE scan_progress (
  id              SERIAL PRIMARY KEY,
  service_center  VARCHAR(10) NOT NULL,
  form_type       VARCHAR(10) NOT NULL,
  last_receipt    VARCHAR(13) NOT NULL,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(service_center, form_type)
);
