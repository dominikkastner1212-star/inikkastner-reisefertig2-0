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
  const [interactive, setInteractive] = useState(false);

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
    if (!interactive || !loaded || !ref.current || !window.L || mapRef.current) return;

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
  }, [interactive, loaded, stops]);

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-forest-700/10 bg-linen shadow-soft">
      {interactive ? (
        <>
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" strategy="lazyOnload" onLoad={() => setLoaded(true)} />
          <div ref={ref} className="h-[32rem] w-full bg-forest-50" />
        </>
      ) : (
        <FastRoutePreview stops={stops} onLoadMap={() => setInteractive(true)} />
      )}
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

function FastRoutePreview({ stops, onLoadMap }: { stops: typeof fallbackStops; onLoadMap: () => void }) {
  return (
    <div className="map-grid relative h-[32rem] overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 380 520" fill="none" aria-hidden="true">
        <path d="M70 110 C130 122, 104 184, 174 214 C238 242, 176 322, 258 354 C316 378, 282 436, 326 466" stroke="#2B5A3C" strokeWidth="6" strokeLinecap="round" strokeDasharray="2 12" />
        <path d="M20 400 C80 358, 130 410, 184 368 C244 320, 306 346, 380 300" stroke="#A8C0A1" strokeWidth="80" strokeLinecap="round" opacity=".28" />
        <path d="M0 190 C90 124, 122 176, 210 116 C288 62, 322 98, 390 48" stroke="#D6C2A6" strokeWidth="90" strokeLinecap="round" opacity=".2" />
      </svg>
      {stops.slice(0, 4).map((stop, index) => {
        const positions = ["left-[18%] top-[18%]", "left-[34%] top-[38%]", "right-[28%] top-[56%]", "right-[12%] bottom-[14%]"];
        return (
          <span key={stop.name} className={`absolute ${positions[index]} grid h-9 w-9 place-items-center rounded-full bg-forest-700 text-xs font-bold text-linen ring-4 ring-linen/75`}>
            {index + 1}
          </span>
        );
      })}
      <button
        onClick={onLoadMap}
        className="pressable absolute right-4 top-4 rounded-2xl bg-linen/90 px-4 py-3 text-xs font-semibold text-forest-900 shadow-soft"
      >
        Interaktive Karte laden
      </button>
    </div>
  );
}
