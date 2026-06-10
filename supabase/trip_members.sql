create table if not exists trip_members (
  id bigint generated always as identity primary key,
  trip_id text not null references trips(id) on delete cascade,
  email text not null,
  role text not null default 'editor' check (role in ('editor', 'viewer')),
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create unique index if not exists trip_members_trip_email_unique on trip_members (trip_id, email);

create or replace function public.can_access_trip(target_trip_id text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from trips t
    where t.id = target_trip_id
      and (
        t.user_id = auth.uid()
        or exists (
          select 1
          from trip_members tm
          where tm.trip_id = t.id
            and lower(tm.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        )
      )
  );
$$;

create or replace function public.can_edit_trip(target_trip_id text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from trips t
    where t.id = target_trip_id
      and (
        t.user_id = auth.uid()
        or exists (
          select 1
          from trip_members tm
          where tm.trip_id = t.id
            and tm.role = 'editor'
            and lower(tm.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        )
      )
  );
$$;

create or replace function public.can_manage_trip(target_trip_id text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from trips t
    where t.id = target_trip_id
      and t.user_id = auth.uid()
  );
$$;

alter table trip_members enable row level security;

drop policy if exists "Users can read own trips" on trips;
drop policy if exists "Users can read accessible trips" on trips;
create policy "Users can read accessible trips" on trips for select using (public.can_access_trip(id));

drop policy if exists "Users can insert own trips" on trips;
create policy "Users can insert own trips" on trips for insert with check (user_id = auth.uid());

drop policy if exists "Users can update own trips" on trips;
drop policy if exists "Users can update editable trips" on trips;
create policy "Users can update editable trips" on trips for update using (public.can_edit_trip(id)) with check (public.can_edit_trip(id));

drop policy if exists "Users can delete own trips" on trips;
drop policy if exists "Owners can delete trips" on trips;
create policy "Owners can delete trips" on trips for delete using (user_id = auth.uid());

drop policy if exists "Users can read own pack items" on pack_items;
drop policy if exists "Users can read accessible pack items" on pack_items;
create policy "Users can read accessible pack items" on pack_items for select using (trip_id is null or public.can_access_trip(trip_id));

drop policy if exists "Users can insert own pack items" on pack_items;
drop policy if exists "Users can insert editable pack items" on pack_items;
create policy "Users can insert editable pack items" on pack_items for insert with check (user_id = auth.uid() and (trip_id is null or public.can_edit_trip(trip_id)));

drop policy if exists "Users can update own pack items" on pack_items;
drop policy if exists "Users can update editable pack items" on pack_items;
create policy "Users can update editable pack items" on pack_items for update using (trip_id is null or public.can_edit_trip(trip_id)) with check (trip_id is null or public.can_edit_trip(trip_id));

drop policy if exists "Users can delete own pack items" on pack_items;
drop policy if exists "Users can delete editable pack items" on pack_items;
create policy "Users can delete editable pack items" on pack_items for delete using (trip_id is null or public.can_edit_trip(trip_id));

drop policy if exists "Users can read own cost items" on cost_items;
drop policy if exists "Users can read accessible cost items" on cost_items;
create policy "Users can read accessible cost items" on cost_items for select using (trip_id is null or public.can_access_trip(trip_id));

drop policy if exists "Users can insert own cost items" on cost_items;
drop policy if exists "Users can insert editable cost items" on cost_items;
create policy "Users can insert editable cost items" on cost_items for insert with check (user_id = auth.uid() and (trip_id is null or public.can_edit_trip(trip_id)));

drop policy if exists "Users can update own cost items" on cost_items;
drop policy if exists "Users can update editable cost items" on cost_items;
create policy "Users can update editable cost items" on cost_items for update using (trip_id is null or public.can_edit_trip(trip_id)) with check (trip_id is null or public.can_edit_trip(trip_id));

drop policy if exists "Users can delete own cost items" on cost_items;
drop policy if exists "Users can delete editable cost items" on cost_items;
create policy "Users can delete editable cost items" on cost_items for delete using (trip_id is null or public.can_edit_trip(trip_id));

drop policy if exists "Users can read trip members" on trip_members;
create policy "Users can read trip members" on trip_members for select using (public.can_access_trip(trip_id));

drop policy if exists "Owners can invite trip members" on trip_members;
create policy "Owners can invite trip members" on trip_members for insert with check (public.can_manage_trip(trip_id));

drop policy if exists "Owners can remove trip members" on trip_members;
create policy "Owners can remove trip members" on trip_members for delete using (public.can_manage_trip(trip_id));
