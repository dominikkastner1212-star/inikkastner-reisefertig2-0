import { costs, packItems, places, trips, vehicle } from "@/data/mock";
import { getUserSupabase } from "@/lib/auth";
import type { CostItem, PackItem, Place, Trip } from "@/lib/types";

type TripRow = {
  id: string;
  title: string;
  dates: string;
  region: string;
  days: number;
  distance_km: number;
  stops: number;
  checklist_done: number;
  checklist_total: number;
  budget: number;
  spent: number;
};

type PlaceRow = {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  tags: string[];
  amenities: string[];
  description: string;
};

type PackItemRow = {
  id: string;
  label: string;
  category: PackItem["category"];
  done: boolean;
  priority: PackItem["priority"];
};

type CostItemRow = {
  label: string;
  amount: number;
  color: string;
};

type VehicleRow = {
  name: string;
  plate: string;
  mileage: string;
  range: string;
  water: number;
  wastewater: number;
  battery: number;
  next_service: string;
};

export async function getTrips(): Promise<Trip[]> {
  const { client } = await getUserSupabase();
  if (!client) return trips;

  const { data, error } = await client.from("trips").select("*").order("created_at", { ascending: true });
  if (error || !data?.length) return trips;

  return (data as TripRow[]).map((trip) => ({
    id: trip.id,
    title: trip.title,
    dates: trip.dates,
    region: trip.region,
    days: trip.days,
    distanceKm: trip.distance_km,
    stops: trip.stops,
    checklistDone: trip.checklist_done,
    checklistTotal: trip.checklist_total,
    budget: Number(trip.budget),
    spent: Number(trip.spent)
  }));
}

export async function getPlaces(): Promise<Place[]> {
  const { client } = await getUserSupabase();
  if (!client) return places;

  const { data, error } = await client.from("places").select("*").order("created_at", { ascending: true });
  if (error || !data?.length) return places;

  return (data as PlaceRow[]).map((place) => ({
    ...place,
    price: Number(place.price),
    rating: Number(place.rating)
  }));
}

export async function getPlace(id: string): Promise<Place | undefined> {
  const allPlaces = await getPlaces();
  return allPlaces.find((place) => place.id === id);
}

export async function getPackItems(): Promise<PackItem[]> {
  const { client } = await getUserSupabase();
  if (!client) return packItems;

  const { data, error } = await client.from("pack_items").select("id,label,category,done,priority").order("created_at", { ascending: true });
  if (error || !data?.length) return packItems;

  return data as PackItemRow[];
}

export async function getCosts(): Promise<CostItem[]> {
  const { client } = await getUserSupabase();
  if (!client) return costs;

  const { data, error } = await client.from("cost_items").select("label,amount,color").order("created_at", { ascending: true });
  if (error || !data?.length) return costs;

  return (data as CostItemRow[]).map((item) => ({ ...item, amount: Number(item.amount) }));
}

export async function getVehicle(): Promise<typeof vehicle> {
  const { client } = await getUserSupabase();
  if (!client) return vehicle;

  const { data, error } = await client.from("vehicles").select("*").order("created_at", { ascending: true }).limit(1).maybeSingle();
  if (error || !data) return vehicle;

  const row = data as VehicleRow;

  return {
    name: row.name,
    plate: row.plate,
    mileage: row.mileage,
    range: row.range,
    water: row.water,
    wastewater: row.wastewater,
    battery: row.battery,
    nextService: row.next_service
  };
}
