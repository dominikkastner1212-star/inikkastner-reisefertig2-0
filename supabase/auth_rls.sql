alter table trips add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table pack_items add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table cost_items add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table vehicles add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table trips enable row level security;
alter table pack_items enable row level security;
alter table cost_items enable row level security;
alter table vehicles enable row level security;
alter table places enable row level security;

drop policy if exists "Users can read own trips" on trips;
create policy "Users can read own trips" on trips for select using (user_id = auth.uid());

drop policy if exists "Users can insert own trips" on trips;
create policy "Users can insert own trips" on trips for insert with check (user_id = auth.uid());

drop policy if exists "Users can update own trips" on trips;
create policy "Users can update own trips" on trips for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users can delete own trips" on trips;
create policy "Users can delete own trips" on trips for delete using (user_id = auth.uid());

drop policy if exists "Users can read own pack items" on pack_items;
create policy "Users can read own pack items" on pack_items for select using (user_id = auth.uid());

drop policy if exists "Users can insert own pack items" on pack_items;
create policy "Users can insert own pack items" on pack_items for insert with check (user_id = auth.uid());

drop policy if exists "Users can update own pack items" on pack_items;
create policy "Users can update own pack items" on pack_items for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users can delete own pack items" on pack_items;
create policy "Users can delete own pack items" on pack_items for delete using (user_id = auth.uid());

drop policy if exists "Users can read own cost items" on cost_items;
create policy "Users can read own cost items" on cost_items for select using (user_id = auth.uid());

drop policy if exists "Users can insert own cost items" on cost_items;
create policy "Users can insert own cost items" on cost_items for insert with check (user_id = auth.uid());

drop policy if exists "Users can update own cost items" on cost_items;
create policy "Users can update own cost items" on cost_items for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users can delete own cost items" on cost_items;
create policy "Users can delete own cost items" on cost_items for delete using (user_id = auth.uid());

drop policy if exists "Users can read own vehicles" on vehicles;
create policy "Users can read own vehicles" on vehicles for select using (user_id = auth.uid());

drop policy if exists "Users can insert own vehicles" on vehicles;
create policy "Users can insert own vehicles" on vehicles for insert with check (user_id = auth.uid());

drop policy if exists "Users can update own vehicles" on vehicles;
create policy "Users can update own vehicles" on vehicles for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Everyone can read places" on places;
create policy "Everyone can read places" on places for select using (true);

alter table cost_items drop constraint if exists cost_items_trip_label_unique;
create unique index if not exists cost_items_user_trip_label_unique on cost_items (user_id, trip_id, label);
