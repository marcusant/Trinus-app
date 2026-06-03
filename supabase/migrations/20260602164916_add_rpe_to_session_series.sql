-- Adiciona PSE/RPE (Rate of Perceived Exertion) por série, estilo Hevy.
-- Escala 6.0 .. 10.0 (passos de 0.5). Nullable: nem toda a série tem PSE registado.
alter table public.session_series
  add column if not exists rpe numeric(3,1);

comment on column public.session_series.rpe is 'PSE/RPE (esforço percebido) da série — escala 6.0 a 10.0, nullable.';
