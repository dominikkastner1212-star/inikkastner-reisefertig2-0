import type { CostItem, PackItem, Place, Trip } from "@/lib/types";

export const trips: Trip[] = [
  {
    id: "alpen",
    title: "Alpenüberquerung",
    dates: "24. Mai - 02. Juni 2026",
    region: "Bayern, Tirol, Kärnten",
    days: 9,
    distanceKm: 850,
    stops: 12,
    checklistDone: 8,
    checklistTotal: 12,
    budget: 820,
    spent: 612.45
  },
  {
    id: "toskana",
    title: "Toskana langsam",
    dates: "14. Juli - 25. Juli 2026",
    region: "Gardasee, Lucca, Siena",
    days: 12,
    distanceKm: 1180,
    stops: 9,
    checklistDone: 4,
    checklistTotal: 14,
    budget: 1240,
    spent: 185.2
  }
];

export const places: Place[] = [
  {
    id: "seecamping-mentl",
    name: "Seecamping Mentl",
    location: "Pressegger See, Kärnten, Österreich",
    price: 32,
    rating: 4.8,
    tags: ["Stellplatz", "See", "WLAN"],
    amenities: ["Strom", "Wasser", "Entsorgung", "WLAN", "Dusche", "Hunde erlaubt"],
    description:
      "Ruhig gelegener Stellplatz direkt am Pressegger See mit traumhaftem Bergblick und direktem Zugang zum See."
  },
  {
    id: "camping-wolfgangsee",
    name: "Camping Wolfgangsee",
    location: "St. Gilgen, Österreich",
    price: 39,
    rating: 4.6,
    tags: ["Berge", "Badestelle", "Familie"],
    amenities: ["Strom", "Wasser", "WLAN", "Restaurant"],
    description: "Kompakter Platz am Wasser mit kurzen Wegen, Brötchenservice und guter Anbindung."
  },
  {
    id: "camping-viechtl",
    name: "Camping Viechtl",
    location: "Telfs, Tirol",
    price: 28,
    rating: 4.5,
    tags: ["Ruhig", "Bergblick"],
    amenities: ["Strom", "Wasser", "Entsorgung"],
    description: "Minimaler, sehr gepflegter Platz für eine entspannte Nacht zwischen zwei Etappen."
  }
];

export const packItems: PackItem[] = [
  { id: "strom", label: "Stromkabel", category: "Wohnmobil", done: true, priority: "hoch" },
  { id: "auffahr", label: "Auffahrkeile", category: "Wohnmobil", done: false, priority: "normal" },
  { id: "gas", label: "Gasflasche", category: "Wohnmobil", done: false, priority: "hoch" },
  { id: "wasser", label: "Wasserschlauch", category: "Wohnmobil", done: true, priority: "normal" },
  { id: "jacke", label: "Fleecejacke", category: "Kleidung", done: true, priority: "normal" },
  { id: "pass", label: "Ausweise", category: "Dokumente", done: false, priority: "hoch" },
  { id: "kaffee", label: "Espressokocher", category: "Kueche", done: true, priority: "normal" }
];

export const costs: CostItem[] = [
  { label: "Stellplätze", amount: 260, color: "#55764d" },
  { label: "Lebensmittel", amount: 98.3, color: "#d6bf99" },
  { label: "Aktivitäten", amount: 54.1, color: "#9fbd93" },
  { label: "Sprit", amount: 199.05, color: "#8b9088" },
  { label: "Sonstiges", amount: 61, color: "#cbd9bd" }
];

export const vehicle = {
  name: "Sunlight T67",
  plate: "EI DU 2027",
  mileage: "28.904 km",
  range: "430 km",
  water: 80,
  wastewater: 25,
  battery: 92,
  nextService: "in 2.300 km"
};
