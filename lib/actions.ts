"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
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
  if (!supabase) return;

  const title = getText(formData, "title");
  if (!title) return;

  const budget = getNumber(formData, "budget", 600);
  const days = getNumber(formData, "days", 7);
  const distanceKm = getNumber(formData, "distanceKm", 300);
  const stops = getNumber(formData, "stops", 4);
  const id = `${slugify(title)}-${Date.now().toString(36)}`;

  await supabase.from("trips").insert({
    id,
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

export async function togglePackItem(formData: FormData) {
  if (!supabase) return;

  const id = getText(formData, "id");
  const done = getText(formData, "done") === "true";
  if (!id) return;

  await supabase.from("pack_items").update({ done: !done }).eq("id", id);

  revalidatePath("/packlisten");
  revalidatePath("/dashboard");
}

export async function createPackItem(formData: FormData) {
  if (!supabase) return;

  const label = getText(formData, "label");
  if (!label) return;

  const category = getText(formData, "category") as PackItem["category"];
  const priority = getText(formData, "priority") as PackItem["priority"];

  await supabase.from("pack_items").insert({
    id: `${slugify(label)}-${Date.now().toString(36)}`,
    trip_id: "alpen",
    label,
    category: category || "Wohnmobil",
    done: false,
    priority: priority || "normal"
  });

  revalidatePath("/packlisten");
}

export async function createCost(formData: FormData) {
  if (!supabase) return;

  const label = getText(formData, "label");
  if (!label) return;

  await supabase.from("cost_items").upsert(
    {
      trip_id: getText(formData, "tripId") || "alpen",
      label,
      amount: getNumber(formData, "amount"),
      color: getText(formData, "color") || "#55764d"
    },
    { onConflict: "trip_id,label" }
  );

  revalidatePath("/kosten");
}
