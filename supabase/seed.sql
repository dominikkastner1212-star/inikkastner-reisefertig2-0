insert into trips (id, title, dates, region, days, distance_km, stops, checklist_done, checklist_total, budget, spent)
values
  ('alpen', 'Alpenüberquerung', '24. Mai - 02. Juni 2026', 'Bayern, Tirol, Kärnten', 9, 850, 12, 8, 12, 820, 612.45),
  ('toskana', 'Toskana langsam', '14. Juli - 25. Juli 2026', 'Gardasee, Lucca, Siena', 12, 1180, 9, 4, 14, 1240, 185.20)
on conflict (id) do update set
  title = excluded.title,
  dates = excluded.dates,
  region = excluded.region,
  days = excluded.days,
  distance_km = excluded.distance_km,
  stops = excluded.stops,
  checklist_done = excluded.checklist_done,
  checklist_total = excluded.checklist_total,
  budget = excluded.budget,
  spent = excluded.spent;

insert into places (id, name, location, price, rating, tags, amenities, description)
values
  ('seecamping-mentl', 'Seecamping Mentl', 'Pressegger See, Kärnten, Österreich', 32, 4.8, array['Stellplatz', 'See', 'WLAN'], array['Strom', 'Wasser', 'Entsorgung', 'WLAN', 'Dusche', 'Hunde erlaubt'], 'Ruhig gelegener Stellplatz direkt am Pressegger See mit traumhaftem Bergblick und direktem Zugang zum See.'),
  ('camping-wolfgangsee', 'Camping Wolfgangsee', 'St. Gilgen, Österreich', 39, 4.6, array['Berge', 'Badestelle', 'Familie'], array['Strom', 'Wasser', 'WLAN', 'Restaurant'], 'Kompakter Platz am Wasser mit kurzen Wegen, Brötchenservice und guter Anbindung.'),
  ('camping-viechtl', 'Camping Viechtl', 'Telfs, Tirol', 28, 4.5, array['Ruhig', 'Bergblick'], array['Strom', 'Wasser', 'Entsorgung'], 'Minimaler, sehr gepflegter Platz für eine entspannte Nacht zwischen zwei Etappen.')
on conflict (id) do update set
  name = excluded.name,
  location = excluded.location,
  price = excluded.price,
  rating = excluded.rating,
  tags = excluded.tags,
  amenities = excluded.amenities,
  description = excluded.description;

insert into pack_items (id, trip_id, label, category, done, priority)
values
  ('strom', 'alpen', 'Stromkabel', 'Wohnmobil', true, 'hoch'),
  ('auffahr', 'alpen', 'Auffahrkeile', 'Wohnmobil', false, 'normal'),
  ('gas', 'alpen', 'Gasflasche', 'Wohnmobil', false, 'hoch'),
  ('wasser', 'alpen', 'Wasserschlauch', 'Wohnmobil', true, 'normal'),
  ('jacke', 'alpen', 'Fleecejacke', 'Kleidung', true, 'normal'),
  ('pass', 'alpen', 'Ausweise', 'Dokumente', false, 'hoch'),
  ('kaffee', 'alpen', 'Espressokocher', 'Kueche', true, 'normal')
on conflict (id) do update set
  trip_id = excluded.trip_id,
  label = excluded.label,
  category = excluded.category,
  done = excluded.done,
  priority = excluded.priority;

insert into cost_items (trip_id, label, amount, color)
values
  ('alpen', 'Stellplätze', 260, '#55764d'),
  ('alpen', 'Lebensmittel', 98.30, '#d6bf99'),
  ('alpen', 'Aktivitäten', 54.10, '#9fbd93'),
  ('alpen', 'Sprit', 199.05, '#8b9088'),
  ('alpen', 'Sonstiges', 61, '#cbd9bd')
on conflict (trip_id, label) do update set
  amount = excluded.amount,
  color = excluded.color;

insert into vehicles (name, plate, mileage, range, water, wastewater, battery, next_service)
values ('Sunlight T67', 'EI DU 2027', '28.904 km', '430 km', 80, 25, 92, 'in 2.300 km')
on conflict (plate) do update set
  name = excluded.name,
  mileage = excluded.mileage,
  range = excluded.range,
  water = excluded.water,
  wastewater = excluded.wastewater,
  battery = excluded.battery,
  next_service = excluded.next_service;
