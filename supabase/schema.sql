-- Alpha Focus cloud sync. Run once in Supabase, SQL Editor.
-- One JSONB blob per user per store. RLS locks every row to its owner.

create table if not exists public.user_state (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  store_key  text        not null,
  data       jsonb       not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, store_key)
);

alter table public.user_state enable row level security;

-- Owner-only access for all operations.
drop policy if exists "user_state_owner" on public.user_state;
create policy "user_state_owner" on public.user_state
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Keep updated_at fresh on write for last-write-wins ordering.
create or replace function public.touch_user_state()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_touch_user_state on public.user_state;
create trigger trg_touch_user_state
  before update on public.user_state
  for each row execute function public.touch_user_state();
