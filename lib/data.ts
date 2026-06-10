import { costs, packItems, places, trips, vehicle } from "@/data/mock";
import { getUserSupabase } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
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
  trip_id: string | null;
  label: string;
  category: PackItem["category"];
  done: boolean;
  priority: PackItem["priority"];
};

type CostItemRow = {
  trip_id: string | null;
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

export async function getTrip(id: string): Promise<Trip | undefined> {
  const allTrips = await getTrips();
  return allTrips.find((trip) => trip.id === id);
}

export async function getPlaces(): Promise<Place[]> {
  if (!supabase) return places;

  const { data, error } = await supabase.from("places").select("*").order("created_at", { ascending: true });
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

export async function getSavedPlaceIds(): Promise<string[]> {
  const { client } = await getUserSupabase();
  if (!client) return [];

  const { data, error } = await client.from("saved_places").select("place_id").order("created_at", { ascending: true });
  if (error || !data?.length) return [];

  return data.map((item) => item.place_id as string);
}

export async function getSavedPlaces(): Promise<Place[]> {
  const [allPlaces, savedPlaceIds] = await Promise.all([getPlaces(), getSavedPlaceIds()]);
  return allPlaces.filter((place) => savedPlaceIds.includes(place.id));
}

export async function getIsPlaceSaved(placeId: string): Promise<boolean> {
  const savedPlaceIds = await getSavedPlaceIds();
  return savedPlaceIds.includes(placeId);
}

export async function getPackItems(tripId?: string): Promise<PackItem[]> {
  const { client } = await getUserSupabase();
  if (!client) return packItems;

  let query = client.from("pack_items").select("id,trip_id,label,category,done,priority").order("created_at", { ascending: true });
  if (tripId) query = query.eq("trip_id", tripId);

  const { data, error } = await query;
  if (error) return tripId ? [] : packItems;
  if (!data?.length) return tripId ? [] : packItems;

  return (data as PackItemRow[]).map((item) => ({
    id: item.id,
    tripId: item.trip_id,
    label: item.label,
    category: item.category,
    done: item.done,
    priority: item.priority
  }));
}

export async function getCosts(tripId?: string): Promise<CostItem[]> {
  const { client } = await getUserSupabase();
  if (!client) return costs;

  let query = client.from("cost_items").select("trip_id,label,amount,color").order("created_at", { ascending: true });
  if (tripId) query = query.eq("trip_id", tripId);

  const { data, error } = await query;
  if (error) return tripId ? [] : costs;
  if (!data?.length) return tripId ? [] : costs;

  return (data as CostItemRow[]).map((item) => ({ tripId: item.trip_id, label: item.label, amount: Number(item.amount), color: item.color }));
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
