"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Person, GPType } from "../data/people-types";

const TYPE_COLORS: Record<GPType, string> = {
  Scientist: "#5fbcd3",
  Engineer:  "#f4a261",
  Merchant:  "#e9c46a",
  Artist:    "#e76f51",
  Writer:    "#b497d6",
  Musician:  "#c49bf0",
  General:   "#d62828",
  Admiral:   "#1d4ed8",
  Prophet:   "#f9e79f",
};

function FocusOnSelection({ selected }: { selected: Person | null }) {
  const map = useMap();
  useEffect(() => {
    if (!selected) return;
    const pts: [number, number][] = [];
    if (selected.birth) pts.push(selected.birth.coords);
    if (selected.work)  pts.push(selected.work.coords);
    if (selected.death) pts.push(selected.death.coords);
    if (pts.length === 0) return;
    if (pts.length === 1) map.flyTo(pts[0], 5, { duration: 0.8 });
    else map.flyToBounds(pts, { padding: [80, 80], duration: 0.8, maxZoom: 6 });
  }, [selected, map]);
  return null;
}

interface Props {
  people: Person[];
  selected: Person | null;
  onSelect: (p: Person) => void;
}

export default function Map({ people, selected, onSelect }: Props) {
  return (
    <MapContainer
      center={[30, 20]}
      zoom={2}
      worldCopyJump
      style={{ width: "100%", height: "100vh" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openstreetmap.org">OSM</a>'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      />
      {people.map((p) => {
        const color = TYPE_COLORS[p.type];
        const isSel = selected?.name === p.name;
        return (
          <>
            {p.birth && (
              <CircleMarker
                key={`${p.name}-birth`}
                center={p.birth.coords}
                radius={isSel ? 8 : 5}
                pathOptions={{ color, fillColor: color, fillOpacity: 0, weight: 2 }}
                eventHandlers={{ click: () => onSelect(p) }}
              >
                <Tooltip>{p.name} — born {p.birth.name}</Tooltip>
              </CircleMarker>
            )}
            {p.work && (
              <CircleMarker
                key={`${p.name}-work`}
                center={p.work.coords}
                radius={isSel ? 9 : 6}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.85, weight: 1 }}
                eventHandlers={{ click: () => onSelect(p) }}
              >
                <Tooltip>{p.name} — {p.work.name}</Tooltip>
              </CircleMarker>
            )}
            {p.death && (
              <CircleMarker
                key={`${p.name}-death`}
                center={p.death.coords}
                radius={isSel ? 7 : 4}
                pathOptions={{ color, fillColor: "#111", fillOpacity: 0.9, weight: 2 }}
                eventHandlers={{ click: () => onSelect(p) }}
              >
                <Tooltip>{p.name} — died {p.death.name}</Tooltip>
              </CircleMarker>
            )}
            {isSel && p.birth && p.work && (
              <Polyline positions={[p.birth.coords, p.work.coords]}
                pathOptions={{ color, dashArray: "4 6", weight: 2, opacity: 0.7 }} />
            )}
            {isSel && p.work && p.death && (
              <Polyline positions={[p.work.coords, p.death.coords]}
                pathOptions={{ color, dashArray: "4 6", weight: 2, opacity: 0.7 }} />
            )}
            {isSel && !p.work && p.birth && p.death && (
              <Polyline positions={[p.birth.coords, p.death.coords]}
                pathOptions={{ color, dashArray: "4 6", weight: 2, opacity: 0.7 }} />
            )}
          </>
        );
      })}
      <FocusOnSelection selected={selected} />
    </MapContainer>
  );
}
