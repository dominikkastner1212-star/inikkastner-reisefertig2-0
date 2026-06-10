"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearSessionCookies, getAccessToken, getCurrentUser, getUserSupabase, setSessionCookies } from "@/lib/auth";
import { createSupabaseWithToken, supabase } from "@/lib/supabase";
import { costs, packItems, trips, vehicle } from "@/data/mock";
import type { PackItem } from "@/lib/types";

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getNumber(formData: FormData, key: string, fallback = 0) {
  const value = Number(getText(formData, key).replace(",", "."));
  return Number.isFinite(value) ? value : fallback;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 42);
}

export async function createTrip(formData: FormData) {
  const { client, user } = await getUserSupabase();
  if (!client || !user) return;

  const title = getText(formData, "title");
  if (!title) return;

  const budget = getNumber(formData, "budget", 600);
  const days = getNumber(formData, "days", 7);
  const distanceKm = getNumber(formData, "distanceKm", 300);
  const stops = getNumber(formData, "stops", 4);
  const id = `${slugify(title)}-${Date.now().toString(36)}`;

  await client.from("trips").insert({
    id,
    user_id: user.id,
    title,
    dates: getText(formData, "dates") || "Noch offen",
    region: getText(formData, "region") || "Route offen",
    days,
    distance_km: distanceKm,
    stops,
    checklist_done: 0,
    checklist_total: 0,
    budget,
    spent: 0
  });

  revalidatePath("/reisen");
  revalidatePath("/dashboard");
  revalidatePath("/routenplaner");
  revalidatePath("/kosten");
}

export async function updateTrip(formData: FormData) {
  const { client } = await getUserSupabase();
  if (!client) return;

  const id = getText(formData, "id");
  const title = getText(formData, "title");
  if (!id || !title) return;

  await client
    .from("trips")
    .update({
      title,
      dates: getText(formData, "dates") || "Noch offen",
      region: getText(formData, "region") || "Route offen",
      days: getNumber(formData, "days", 7),
      distance_km: getNumber(formData, "distanceKm", 300),
      stops: getNumber(formData, "stops", 4),
      budget: getNumber(formData, "budget", 600)
    })
    .eq("id", id);

  revalidatePath("/reisen");
  revalidatePath("/dashboard");
  revalidatePath("/routenplaner");
  revalidatePath("/kosten");
}

export async function deleteTrip(formData: FormData) {
  const { client } = await getUserSupabase();
  if (!client) return;

  const id = getText(formData, "id");
  if (!id) return;

  await client.from("trips").delete().eq("id", id);

  revalidatePath("/reisen");
  revalidatePath("/dashboard");
  revalidatePath("/packlisten");
  revalidatePath("/kosten");
}

export async function inviteTripMember(formData: FormData) {
  const { client, user } = await getUserSupabase();
  if (!client || !user) return;

  const tripId = getText(formData, "tripId");
  const email = getText(formData, "email").toLowerCase();
  const role = getText(formData, "role") || "editor";
  if (!tripId || !email) return;

  await client.from("trip_members").upsert(
    {
      trip_id: tripId,
      email,
      role,
      invited_by: user.id
    },
    { onConflict: "trip_id,email" }
  );

  revalidatePath(`/reisen/${tripId}`);
}

export async function createTripInviteLink(formData: FormData) {
  const { client, user } = await getUserSupabase();
  if (!client || !user) return;

  const tripId = getText(formData, "tripId");
  const role = getText(formData, "role") || "editor";
  if (!tripId) return;

  const { data, error } = await client
    .from("trip_invites")
    .insert({
      trip_id: tripId,
      role,
      created_by: user.id
    })
    .select("token")
    .single();

  revalidatePath(`/reisen/${tripId}`);

  if (error || !data?.token) {
    redirect(`/reisen/${tripId}?invite=fehlgeschlagen`);
  }

  redirect(`/reisen/${tripId}?invite=${data.token}`);
}

export async function acceptTripInvite(formData: FormData) {
  const token = getText(formData, "token");
  if (!token) redirect("/dashboard");

  const next = `/einladung/${token}`;
  const user = await getCurrentUser();
  const accessToken = await getAccessToken();

  if (!user || !accessToken) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  const client = createSupabaseWithToken(accessToken);
  if (!client) redirect("/login?message=supabase-fehlt");

  const { data, error } = await client.rpc("accept_trip_invite", { invite_token: token });
  if (error || !data) {
    redirect(`${next}?message=ungueltig`);
  }

  const tripId = String(data);
  revalidatePath("/reisen");
  revalidatePath(`/reisen/${tripId}`);
  redirect(`/reisen/${tripId}`);
}

export async function removeTripMember(formData: FormData) {
  const { client } = await getUserSupabase();
  if (!client) return;

  const tripId = getText(formData, "tripId");
  const memberId = getNumber(formData, "memberId");
  if (!tripId || !memberId) return;

  await client.from("trip_members").delete().eq("id", memberId);

  revalidatePath(`/reisen/${tripId}`);
}

export async function togglePackItem(formData: FormData) {
  const { client } = await getUserSupabase();
  if (!client) return;

  const id = getText(formData, "id");
  const done = getText(formData, "done") === "true";
  if (!id) return;

  await client.from("pack_items").update({ done: !done }).eq("id", id);

  revalidatePath("/packlisten");
  revalidatePath("/dashboard");
}

export async function createPackItem(formData: FormData) {
  const { client, user } = await getUserSupabase();
  if (!client || !user) return;

  const label = getText(formData, "label");
  if (!label) return;

  const category = getText(formData, "category") as PackItem["category"];
  const priority = getText(formData, "priority") as PackItem["priority"];

  await client.from("pack_items").insert({
    id: `${slugify(label)}-${Date.now().toString(36)}`,
    user_id: user.id,
    trip_id: getText(formData, "tripId") || null,
    label,
    category: category || "Wohnmobil",
    done: false,
    priority: priority || "normal"
  });

  revalidatePath("/packlisten");
}

export async function createCost(formData: FormData) {
  const { client, user } = await getUserSupabase();
  if (!client || !user) return;

  const label = getText(formData, "label");
  if (!label) return;

  await client.from("cost_items").upsert(
    {
      user_id: user.id,
      trip_id: getText(formData, "tripId") || "alpen",
      label,
      amount: getNumber(formData, "amount"),
      color: getText(formData, "color") || "#55764d"
    },
    { onConflict: "user_id,trip_id,label" }
  );

  revalidatePath("/kosten");
}

export async function updateVehicle(formData: FormData) {
  const { client, user } = await getUserSupabase();
  if (!client || !user) return;

  const payload = {
    user_id: user.id,
    name: getText(formData, "name") || "Wohnmobil",
    plate: getText(formData, "plate") || `RF-${user.id.slice(0, 6)}`,
    mileage: getText(formData, "mileage") || "0 km",
    range: getText(formData, "range") || "0 km",
    water: getNumber(formData, "water"),
    wastewater: getNumber(formData, "wastewater"),
    battery: getNumber(formData, "battery"),
    next_service: getText(formData, "nextService") || "Noch offen"
  };

  const { data } = await client.from("vehicles").select("id").eq("user_id", user.id).limit(1).maybeSingle();

  if (data?.id) {
    await client.from("vehicles").update(payload).eq("id", data.id);
  } else {
    await client.from("vehicles").insert(payload);
  }

  revalidatePath("/fahrzeug");
}

export async function toggleSavedPlace(formData: FormData) {
  const { client, user } = await getUserSupabase();
  if (!client || !user) return;

  const placeId = getText(formData, "placeId");
  const saved = getText(formData, "saved") === "true";
  if (!placeId) return;

  if (saved) {
    await client.from("saved_places").delete().eq("place_id", placeId);
  } else {
    await client.from("saved_places").insert({
      user_id: user.id,
      place_id: placeId
    });
  }

  revalidatePath("/dashboard");
  revalidatePath(`/stellplaetze/${placeId}`);
}

export async function signIn(formData: FormData) {
  if (!supabase) redirect("/login?message=supabase-fehlt");

  const email = getText(formData, "email");
  const password = getText(formData, "password");
  const next = getText(formData, "next") || "/dashboard";
  const safeNext = next.startsWith("/") ? next : "/dashboard";

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) redirect(`/login?message=login-fehlgeschlagen&next=${encodeURIComponent(safeNext)}`);

  await setSessionCookies(data.session);
  await seedUserData(data.session.user.id, data.session.access_token);
  redirect(safeNext);
}

export async function signUp(formData: FormData) {
  if (!supabase) redirect("/login?message=supabase-fehlt");

  const email = getText(formData, "email");
  const password = getText(formData, "password");
  const next = getText(formData, "next") || "/dashboard";
  const safeNext = next.startsWith("/") ? next : "/dashboard";

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) redirect(`/login?message=registrierung-fehlgeschlagen&next=${encodeURIComponent(safeNext)}`);

  if (data.session) {
    await setSessionCookies(data.session);
    await seedUserData(data.session.user.id, data.session.access_token);
    redirect(safeNext);
  }

  redirect(`/login?message=bitte-email-bestaetigen&next=${encodeURIComponent(safeNext)}`);
}

export async function signOut() {
  await clearSessionCookies();
  redirect("/login");
}

async function seedUserData(userId: string, accessToken: string) {
  const { createSupabaseWithToken } = await import("@/lib/supabase");
  const client = createSupabaseWithToken(accessToken);
  if (!client) return;

  const { count } = await client.from("trips").select("id", { count: "exact", head: true });
  if (count && count > 0) return;

  const suffix = userId.slice(0, 8);
  const tripIdMap = new Map(trips.map((trip) => [trip.id, `${trip.id}-${suffix}`]));

  await client.from("trips").insert(
    trips.map((trip) => ({
      id: tripIdMap.get(trip.id),
      user_id: userId,
      title: trip.title,
      dates: trip.dates,
      region: trip.region,
      days: trip.days,
      distance_km: trip.distanceKm,
      stops: trip.stops,
      checklist_done: trip.checklistDone,
      checklist_total: trip.checklistTotal,
      budget: trip.budget,
      spent: trip.spent
    }))
  );

  await client.from("pack_items").insert(
    packItems.map((item) => ({
      id: `${item.id}-${suffix}`,
      user_id: userId,
      trip_id: tripIdMap.get("alpen"),
      label: item.label,
      category: item.category,
      done: item.done,
      priority: item.priority
    }))
  );

  await client.from("cost_items").insert(
    costs.map((item) => ({
      user_id: userId,
      trip_id: tripIdMap.get("alpen"),
      label: item.label,
      amount: item.amount,
      color: item.color
    }))
  );

  await client.from("vehicles").insert({
    user_id: userId,
    name: vehicle.name,
    plate: `${vehicle.plate}-${suffix}`,
    mileage: vehicle.mileage,
    range: vehicle.range,
    water: vehicle.water,
    wastewater: vehicle.wastewater,
    battery: vehicle.battery,
    next_service: vehicle.nextService
  });
}
