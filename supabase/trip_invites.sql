create table if not exists public.trip_invites (
  id bigint generated always as identity primary key,
  trip_id text not null references public.trips(id) on delete cascade,
  token uuid not null default gen_random_uuid(),
  role text not null default 'editor' check (role in ('editor', 'viewer')),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '14 days'),
  revoked_at timestamptz
);

create unique index if not exists trip_invites_token_unique on public.trip_invites (token);
create index if not exists trip_invites_trip_id_idx on public.trip_invites (trip_id);

alter table public.trip_invites enable row level security;

drop policy if exists "Owners can read trip invites" on public.trip_invites;
create policy "Owners can read trip invites"
on public.trip_invites for select
using (public.can_manage_trip(trip_id));

drop policy if exists "Owners can create trip invites" on public.trip_invites;
create policy "Owners can create trip invites"
on public.trip_invites for insert
with check (created_by = auth.uid() and public.can_manage_trip(trip_id));

drop policy if exists "Owners can delete trip invites" on public.trip_invites;
create policy "Owners can delete trip invites"
on public.trip_invites for delete
using (public.can_manage_trip(trip_id));

create or replace function public.accept_trip_invite(invite_token uuid)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  invite_record record;
  invitee_email text;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  invitee_email := lower(coalesce(auth.jwt() ->> 'email', ''));

  if invitee_email = '' then
    raise exception 'missing_email' using errcode = '22023';
  end if;

  select trip_id, role, created_by
  into invite_record
  from public.trip_invites
  where token = invite_token
    and revoked_at is null
    and expires_at > now();

  if not found then
    raise exception 'invite_not_found' using errcode = 'P0002';
  end if;

  insert into public.trip_members (trip_id, email, role, invited_by)
  values (invite_record.trip_id, invitee_email, invite_record.role, invite_record.created_by)
  on conflict (trip_id, email)
  do update set
    role = excluded.role,
    invited_by = excluded.invited_by;

  return invite_record.trip_id;
end;
$$;

grant select, insert, delete on public.trip_invites to authenticated;
grant usage, select on sequence public.trip_invites_id_seq to authenticated;

revoke all on function public.accept_trip_invite(uuid) from public;
revoke all on function public.accept_trip_invite(uuid) from anon;
grant execute on function public.accept_trip_invite(uuid) to authenticated;
