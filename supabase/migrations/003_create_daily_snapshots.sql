CREATE TABLE daily_snapshots (
  id              BIGSERIAL PRIMARY KEY,
  snapshot_date   DATE NOT NULL,
  form_type       VARCHAR(10) NOT NULL,
  service_center  VARCHAR(10) NOT NULL,
  receipt_block   VARCHAR(13),
  receipt_month   VARCHAR(7),
  status          TEXT NOT NULL,
  case_count      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(snapshot_date, form_type, service_center, receipt_block, receipt_month, status)
);

CREATE INDEX idx_snapshots_lookup ON daily_snapshots(form_type, service_center, snapshot_date);
