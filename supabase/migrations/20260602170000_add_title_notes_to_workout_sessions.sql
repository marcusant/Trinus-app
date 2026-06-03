-- Resumo do treino (estilo Hevy): título editável + notas/descrição da sessão.
alter table public.workout_sessions
  add column if not exists title text,
  add column if not exists notes text;

comment on column public.workout_sessions.title is 'Título do treino dado pelo aluno no ecrã de resumo (ex.: "Push Power"). Nullable.';
comment on column public.workout_sessions.notes is 'Descrição/notas do treino escritas pelo aluno no ecrã de resumo. Nullable.';
