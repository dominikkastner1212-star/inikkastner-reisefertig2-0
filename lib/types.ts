export type Trip = {
  id: string;
  title: string;
  dates: string;
  region: string;
  days: number;
  distanceKm: number;
  stops: number;
  checklistDone: number;
  checklistTotal: number;
  budget: number;
  spent: number;
};

export type Place = {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  tags: string[];
  amenities: string[];
  description: string;
};

export type PackItem = {
  id: string;
  tripId?: string | null;
  label: string;
  category: "Wohnmobil" | "Kleidung" | "Kueche" | "Dokumente";
  done: boolean;
  priority: "normal" | "hoch";
};

export type CostItem = {
  tripId?: string | null;
  label: string;
  amount: number;
  color: string;
};
