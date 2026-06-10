"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Place, Trip } from "@/lib/types";

type LeafletMap = {
  remove: () => void;
  fitBounds: (bounds: unknown, options?: unknown) => void;
};

type LeafletApi = {
  map: (element: HTMLElement, options: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, options: Record<string, unknown>) => { addTo: (map: LeafletMap) => void };
  marker: (coords: [number, number], options?: Record<string, unknown>) => { addTo: (map: LeafletMap) => { bindPopup: (text: string) => void } };
  polyline: (coords: Array<[number, number]>, options: Record<string, unknown>) => { addTo: (map: LeafletMap) => void };
  latLngBounds: (coords: Array<[number, number]>) => unknown;
  divIcon: (options: Record<string, unknown>) => unknown;
  control: { zoom: (options: Record<string, unknown>) => { addTo: (map: LeafletMap) => void } };
};

declare global {
  interface Window {
    L?: LeafletApi;
  }
}

const fallbackStops = [
  { name: "München", lat: 48.137, lng: 11.575 },
  { name: "Achensee", lat: 47.438, lng: 11.705 },
  { name: "Großglockner", lat: 47.074, lng: 12.694 },
  { name: "Pressegger See", lat: 46.623, lng: 13.441 }
];

const placeCoords: Record<string, [number, number]> = {
  "seecamping-mentl": [46.623, 13.441],
  "camping-wolfgangsee": [47.756, 13.375],
  "camping-viechtl": [47.307, 11.074]
};

export function LeafletRouteMap({ trip, places }: { trip?: Trip; places: Place[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [loaded, setLoaded] = useState(false);

  const stops = useMemo(() => {
    const savedStops = places
      .map((place) => {
        const coords = placeCoords[place.id];
        return coords ? { name: place.name, lat: coords[0], lng: coords[1] } : null;
      })
      .filter(Boolean) as typeof fallbackStops;

    return savedStops.length >= 2 ? savedStops : fallbackStops;
  }, [places]);

  useEffect(() => {
    if (!loaded || !ref.current || !window.L || mapRef.current) return;

    const map = window.L.map(ref.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false
    });
    mapRef.current = map;

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18
    }).addTo(map);
    window.L.control.zoom({ position: "bottomright" }).addTo(map);

    const coords = stops.map((stop) => [stop.lat, stop.lng] as [number, number]);

    window.L.polyline(coords, {
      color: "#2B5A3C",
      weight: 5,
      opacity: 0.9,
      dashArray: "1 10",
      lineCap: "round"
    }).addTo(map);

    stops.forEach((stop, index) => {
      const icon = window.L?.divIcon({
        className: "rf-map-pin",
        html: `<span>${index + 1}</span>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });
      window.L?.marker([stop.lat, stop.lng], { icon }).addTo(map).bindPopup(stop.name);
    });

    map.fitBounds(window.L.latLngBounds(coords), { padding: [30, 30] });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [loaded, stops]);

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-forest-700/10 bg-linen shadow-soft">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" strategy="afterInteractive" onLoad={() => setLoaded(true)} />
      <div ref={ref} className="h-[32rem] w-full bg-forest-50" />
      <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-[1.65rem] bg-linen/92 p-4 shadow-soft backdrop-blur">
        <h1 className="text-xl font-semibold text-forest-900">{trip?.title ?? "Neue Route"}</h1>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-forest-900/65">
          <span>{trip?.days ?? 0} Tage</span>
          <span>{trip?.distanceKm ?? 0} km</span>
          <span>{trip?.stops ?? stops.length} Stopps</span>
        </div>
        <p className="mt-4 text-sm leading-6 text-forest-900/65">
          Route mit echten Kartenkacheln, gespeicherten Stellplätzen und einer planbaren Etappenlinie.
        </p>
      </div>
    </div>
  );
}
