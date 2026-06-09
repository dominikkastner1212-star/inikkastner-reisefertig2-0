create table if not exists saved_places (
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null references places(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, place_id)
);

alter table saved_places enable row level security;

drop policy if exists "Users can read own saved places" on saved_places;
create policy "Users can read own saved places" on saved_places for select using (user_id = auth.uid());

drop policy if exists "Users can insert own saved places" on saved_places;
create policy "Users can insert own saved places" on saved_places for insert with check (user_id = auth.uid());

drop policy if exists "Users can delete own saved places" on saved_places;
create policy "Users can delete own saved places" on saved_places for delete using (user_id = auth.uid());
