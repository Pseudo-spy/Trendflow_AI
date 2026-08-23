-- P3 -> shared Supabase contract.
-- P1/database owner should review before applying to the shared schema.
-- If the table already exists, add missing columns instead of recreating it.

create table if not exists public.risk_predictions (
    supplier_id text primary key,
    risk_score double precision not null check (risk_score >= 0 and risk_score <= 1),
    risk_level text not null check (risk_level in ('LOW','MEDIUM','HIGH')),
    delivery_risk double precision not null check (delivery_risk >= 0 and delivery_risk <= 1),
    quality_risk double precision not null check (quality_risk >= 0 and quality_risk <= 1),
    prediction_date date not null,
    model_version text not null,
    generated_at timestamptz not null
);

create index if not exists idx_risk_predictions_level on public.risk_predictions (risk_level);
create index if not exists idx_risk_predictions_date on public.risk_predictions (prediction_date);
