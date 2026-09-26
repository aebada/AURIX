"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { PartnerLocation } from "@/lib/gold-service/types";

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

type LeafletMap = {
  remove: () => void;
  setView: (latlng: [number, number], zoom: number) => void;
  fitBounds: (bounds: unknown, opts?: { padding?: [number, number]; maxZoom?: number }) => void;
  invalidateSize: () => void;
};

type LeafletMarker = {
  on: (event: string, fn: () => void) => void;
  bindPopup: (html: string) => LeafletMarker;
  addTo: (map: LeafletMap) => LeafletMarker;
  remove: () => void;
};

type LeafletNs = {
  map: (el: HTMLElement) => LeafletMap;
  tileLayer: (
    url: string,
    opts?: { attribution?: string; maxZoom?: number },
  ) => { addTo: (map: LeafletMap) => void };
  marker: (latlng: [number, number]) => LeafletMarker;
  latLngBounds: (latlngs: [number, number][]) => unknown;
  Icon: {
    Default: {
      prototype: Record<string, unknown>;
      mergeOptions: (o: Record<string, string>) => void;
    };
  };
};

declare global {
  interface Window {
    L?: LeafletNs;
  }
}

let leafletPromise: Promise<LeafletNs> | null = null;

function loadLeaflet(): Promise<LeafletNs> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("no window"));
  }
  if (window.L) return Promise.resolve(window.L);
  if (leafletPromise) return leafletPromise;

  leafletPromise = new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }

    const finish = () => {
      if (window.L) {
        delete window.L.Icon.Default.prototype._getIconUrl;
        window.L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
        resolve(window.L);
      } else {
        reject(new Error("Leaflet failed to load"));
      }
    };

    const existing = document.querySelector(
      `script[src="${LEAFLET_JS}"]`,
    ) as HTMLScriptElement | null;
    if (existing) {
      if (window.L) finish();
      else existing.addEventListener("load", finish);
      return;
    }

    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = finish;
    script.onerror = () => reject(new Error("Leaflet script error"));
    document.head.appendChild(script);
  });

  return leafletPromise;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function PartnerMap({
  locations,
  selectedId,
  onSelect,
  className,
}: {
  locations: PartnerLocation[];
  selectedId?: string | null;
  onSelect?: (loc: PartnerLocation) => void;
  className?: string;
}) {
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, LeafletMarker>>(new Map());
  const onSelectRef = useRef(onSelect);
  const [ready, setReady] = useState(false);
  const reactId = useId().replace(/:/g, "");

  onSelectRef.current = onSelect;

  const pinned = useMemo(
    () =>
      locations.filter(
        (l): l is PartnerLocation & { lat: number; lng: number } =>
          l.lat != null && l.lng != null,
      ),
    [locations],
  );

  const pinKey = pinned.map((l) => `${l.id}:${l.lat}:${l.lng}`).join("|");

  useEffect(() => {
    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapElRef.current || mapRef.current) return;
        const map = L.map(mapElRef.current);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(map);
        map.setView([25.0, 45.0], 4);
        mapRef.current = map;
        // Leaflet needs a tick after CSS/layout to size correctly
        requestAnimationFrame(() => {
          map.invalidateSize();
          if (!cancelled) setReady(true);
        });
      })
      .catch(() => {
        /* list view still works */
      });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current.clear();
      setReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const L = typeof window !== "undefined" ? window.L : undefined;
    if (!ready || !map || !L) return;

    markersRef.current.forEach((m) => {
      try {
        m.remove();
      } catch {
        /* ignore */
      }
    });
    markersRef.current.clear();

    if (pinned.length === 0) {
      map.setView([25.0, 45.0], 4);
      return;
    }

    const latlngs: [number, number][] = [];
    for (const loc of pinned) {
      const marker = L.marker([loc.lat, loc.lng]);
      marker.bindPopup(
        `<strong>${escapeHtml(loc.name)}</strong><br/>${escapeHtml(loc.city)}, ${escapeHtml(loc.country)}`,
      );
      marker.on("click", () => onSelectRef.current?.(loc));
      marker.addTo(map);
      markersRef.current.set(loc.id, marker);
      latlngs.push([loc.lat, loc.lng]);
    }

    if (latlngs.length === 1) {
      map.setView(latlngs[0], 12);
    } else {
      map.fitBounds(L.latLngBounds(latlngs), { padding: [28, 28], maxZoom: 12 });
    }

    map.invalidateSize();
  }, [ready, pinKey, pinned]);

  useEffect(() => {
    if (!ready || !selectedId) return;
    const loc = pinned.find((l) => l.id === selectedId);
    const marker = loc ? markersRef.current.get(loc.id) : undefined;
    if (loc && marker && mapRef.current) {
      mapRef.current.setView([loc.lat, loc.lng], 13);
    }
  }, [ready, selectedId, pinned]);

  return (
    <div className={className ?? "relative h-full min-h-[320px] w-full"}>
      <div
        id={`partner-map-${reactId}`}
        ref={mapElRef}
        className="absolute inset-0 z-0 h-full w-full [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full"
        role="img"
        aria-label={`Map with ${pinned.length} partner locations`}
      />
      {pinned.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[var(--color-surface)]/80 p-6 text-center text-sm text-muted">
          No pinned coordinates in this filter yet.
        </div>
      )}
    </div>
  );
}
