create table if not exists trips (
  id text primary key,
  title text not null,
  dates text not null,
  region text not null,
  days integer not null,
  distance_km integer not null,
  stops integer not null,
  checklist_done integer not null default 0,
  checklist_total integer not null default 0,
  budget numeric(10, 2) not null default 0,
  spent numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists places (
  id text primary key,
  name text not null,
  location text not null,
  price numeric(10, 2) not null,
  rating numeric(2, 1) not null,
  tags text[] not null default '{}',
  amenities text[] not null default '{}',
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists pack_items (
  id text primary key,
  trip_id text references trips(id) on delete cascade,
  label text not null,
  category text not null,
  done boolean not null default false,
  priority text not null default 'normal',
  created_at timestamptz not null default now()
);

create table if not exists cost_items (
  id bigint generated always as identity primary key,
  trip_id text references trips(id) on delete cascade,
  label text not null,
  amount numeric(10, 2) not null,
  color text not null default '#55764d',
  created_at timestamptz not null default now(),
  constraint cost_items_trip_label_unique unique (trip_id, label)
);

create table if not exists vehicles (
  id bigint generated always as identity primary key,
  name text not null,
  plate text not null unique,
  mileage text not null,
  range text not null,
  water integer not null,
  wastewater integer not null,
  battery integer not null,
  next_service text not null,
  created_at timestamptz not null default now()
);
