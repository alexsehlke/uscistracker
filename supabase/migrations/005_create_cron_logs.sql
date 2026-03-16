CREATE TABLE cron_logs (
  id          SERIAL PRIMARY KEY,
  job         VARCHAR(30) NOT NULL,       -- 'scan' or 'test-traffic'
  ran_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_ms INTEGER,
  result      JSONB NOT NULL,             -- full response payload
  success     BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_cron_logs_job_ran_at ON cron_logs (job, ran_at DESC);
