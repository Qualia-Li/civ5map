"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ComposableMap, Geographies, Geography, ZoomableGroup, Marker, Line, Sphere, Graticule,
} from "react-simple-maps";
import type { Person, GPType } from "../data/people-types";

const WORLD_TOPO = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";
// Natural Earth 50m admin-1 — only covers the world's largest countries
// (China, India, Russia, USA, Canada, Brazil, Australia, Indonesia, South Africa).
// Smaller countries don't get state lines at 50m; using 10m would be 40 MB.
const ADMIN1_GEOJSON =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_1_states_provinces_lakes.geojson";

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

type ProjName =
  | "geoNaturalEarth1"
  | "geoEqualEarth"
  | "geoAzimuthalEqualArea"
  | "geoMercator"
  | "geoOrthographic";

const PROJECTIONS: { value: ProjName; label: string }[] = [
  { value: "geoNaturalEarth1",       label: "Natural Earth" },
  { value: "geoEqualEarth",          label: "Equal Earth" },
  { value: "geoAzimuthalEqualArea",  label: "Azimuthal" },
  { value: "geoOrthographic",        label: "Globe" },
  { value: "geoMercator",            label: "Mercator" },
];

interface Props {
  people: Person[];
  selected: Person | null;
  onSelect: (p: Person) => void;
  /** Called when a click lands on a coord shared by >1 person. */
  onClusterClick?: (candidates: Person[], anchor: { x: number; y: number }, placeLabel: string) => void;
}

const coordKey = (c: [number, number]) => `${c[0].toFixed(2)},${c[1].toFixed(2)}`;

// our data is [lat, lng]; react-simple-maps expects [lng, lat]
const toLngLat = (c: [number, number]): [number, number] => [c[1], c[0]];

export default function Map({ people, selected, onSelect, onClusterClick }: Props) {
  const [proj, setProj] = useState<ProjName>("geoNaturalEarth1");
  const [center, setCenter] = useState<[number, number]>([10, 20]);
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState<[number, number, number]>([-10, -20, 0]);
  const dragRef = useRef<{ x: number; y: number; r0: [number, number, number] } | null>(null);

  useEffect(() => {
    if (!selected) return;
    const pts: [number, number][] = [];
    if (selected.birth) pts.push(toLngLat(selected.birth.coords));
    if (selected.work)  pts.push(toLngLat(selected.work.coords));
    if (selected.death) pts.push(toLngLat(selected.death.coords));
    if (pts.length === 0) return;
    const lng = pts.reduce((s, p) => s + p[0], 0) / pts.length;
    const lat = pts.reduce((s, p) => s + p[1], 0) / pts.length;
    if (proj === "geoOrthographic") {
      setRotate([-lng, -lat, 0]);
    } else {
      setCenter([lng, lat]);
      // span of the person's points; tighter span -> closer zoom
      const lngs = pts.map(p => p[0]);
      const lats = pts.map(p => p[1]);
      const span = Math.max(
        Math.max(...lngs) - Math.min(...lngs),
        Math.max(...lats) - Math.min(...lats),
        2 // floor so single-point lives don't slam to max zoom
      );
      const z = Math.min(32, Math.max(2.4, 80 / span));
      setZoom(z);
    }
  }, [selected, proj]);

  const projectionConfig: any =
    proj === "geoOrthographic" ? { rotate, scale: 220 } :
    proj === "geoMercator"     ? { scale: 130 } :
    { scale: 160 };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", background: "#0a1118" }}>
      <div style={{
        position: "absolute", top: 12, left: 12, zIndex: 10,
        background: "rgba(15,20,25,0.92)", border: "1px solid #324155",
        borderRadius: 8, padding: "6px 10px", display: "flex", gap: 6, alignItems: "center",
        fontSize: 12, color: "#9aa9bc"
      }}>
        <span>Projection:</span>
        {PROJECTIONS.map((p) => (
          <button key={p.value}
            onClick={() => { setProj(p.value); setZoom(1); setCenter([10, 20]); }}
            style={{
              padding: "3px 8px", borderRadius: 999, cursor: "pointer",
              background: proj === p.value ? "#d4a85a" : "transparent",
              color: proj === p.value ? "#1a1300" : "#e8eef5",
              border: "1px solid " + (proj === p.value ? "#d4a85a" : "#324155"),
              fontSize: 11, fontWeight: proj === p.value ? 600 : 400,
            }}>{p.label}</button>
        ))}
      </div>

      <ComposableMap
        key={proj}
        projection={proj}
        projectionConfig={projectionConfig}
        width={1200}
        height={700}
        style={{ width: "100%", height: "100%", background: "#0a1118" }}
        onMouseDown={(e: React.MouseEvent) => {
          if (proj !== "geoOrthographic") return;
          dragRef.current = { x: e.clientX, y: e.clientY, r0: rotate };
        }}
        onMouseMove={(e: React.MouseEvent) => {
          if (!dragRef.current) return;
          const dx = e.clientX - dragRef.current.x;
          const dy = e.clientY - dragRef.current.y;
          setRotate([dragRef.current.r0[0] + dx * 0.4, dragRef.current.r0[1] - dy * 0.4, 0]);
        }}
        onMouseUp={() => { dragRef.current = null; }}
        onMouseLeave={() => { dragRef.current = null; }}
      >
        {/* Globe view: keep the sphere outline so it reads as a planet.
            Flat projections: skip it (no random rectangle in the ocean). */}
        {proj === "geoOrthographic" && (
          <>
            <Sphere id="sphere" stroke="#324155" strokeWidth={0.5} fill="#0e1620" />
            <Graticule stroke="#1e2a3a" strokeWidth={0.4} />
          </>
        )}

        {proj === "geoOrthographic" ? (
          <MapContents people={people} selected={selected} onSelect={onSelect}
            onClusterClick={onClusterClick} zoom={1} />
        ) : (
          <ZoomableGroup
            center={center}
            zoom={zoom}
            onMoveEnd={({ coordinates, zoom: z }) => {
              setCenter(coordinates as [number, number]);
              setZoom(z);
            }}
            minZoom={0.8}
            maxZoom={64}
            translateExtent={[[-200, -200], [1400, 900]]}
          >
            <MapContents people={people} selected={selected} onSelect={onSelect}
              onClusterClick={onClusterClick} zoom={zoom} />
          </ZoomableGroup>
        )}
      </ComposableMap>

      {proj === "geoOrthographic" && (
        <div style={{
          position: "absolute", bottom: 60, left: 14, fontSize: 11,
          color: "#9aa9bc", background: "rgba(15,20,25,0.85)",
          padding: "4px 10px", borderRadius: 6, border: "1px solid #324155",
        }}>Drag the globe to rotate</div>
      )}
    </div>
  );
}

function MapContents({ people, selected, onSelect, onClusterClick, zoom }: Props & { zoom: number }) {
  // Counter-scale so markers/lines stay screen-sized as the map zooms in.
  const k = 1 / Math.max(0.5, zoom);
  // Only fetch + render subdivisions once we're zoomed past the world view.
  const showAdmin1 = zoom >= 2.2;

  // Group people by coord so a click on a shared spot (e.g. Luoyang) can
  // resolve to a list instead of an arbitrary single person.
  const buckets = React.useMemo(() => {
    const m = new globalThis.Map<string, { coords: [number, number]; placeLabel: string; people: Person[] }>();
    const add = (place: { name: string; coords: [number, number] } | undefined, p: Person) => {
      if (!place) return;
      const key = coordKey(place.coords);
      if (!m.has(key)) m.set(key, { coords: place.coords, placeLabel: place.name, people: [] });
      const b = m.get(key)!;
      if (!b.people.includes(p)) b.people.push(p);
    };
    for (const p of people) { add(p.birth, p); add(p.work, p); add(p.death, p); }
    return m;
  }, [people]);

  const handleClick = (place: { name: string; coords: [number, number] }, p: Person, ev: React.MouseEvent) => {
    const bucket = buckets.get(coordKey(place.coords));
    const list = bucket ? bucket.people : [p];
    if (onClusterClick) {
      onClusterClick(list, { x: ev.clientX, y: ev.clientY }, place.name);
    } else {
      onSelect(p);
    }
  };

  return (
    <>
      <Geographies geography={WORLD_TOPO}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#1b232e"
              stroke="#324155"
              strokeWidth={0.5}
              vectorEffect="non-scaling-stroke"
              style={{
                default: { outline: "none" },
                hover:   { fill: "#243042", outline: "none" },
                pressed: { outline: "none" },
              }}
            />
          ))
        }
      </Geographies>

      {showAdmin1 && (
        <Geographies geography={ADMIN1_GEOJSON}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="transparent"
                stroke="#3d5572"
                strokeWidth={0.35}
                strokeOpacity={Math.min(1, (zoom - 2.2) / 2)}
                vectorEffect="non-scaling-stroke"
                style={{
                  default: { outline: "none", pointerEvents: "none" },
                  hover:   { outline: "none", pointerEvents: "none" },
                  pressed: { outline: "none", pointerEvents: "none" },
                }}
              />
            ))
          }
        </Geographies>
      )}

      {selected && selected.birth && selected.work && (
        <Line from={toLngLat(selected.birth.coords)} to={toLngLat(selected.work.coords)}
          stroke={TYPE_COLORS[selected.type]} strokeWidth={1.5 * k} strokeDasharray={`${3 * k} ${4 * k}`} />
      )}
      {selected && selected.work && selected.death && (
        <Line from={toLngLat(selected.work.coords)} to={toLngLat(selected.death.coords)}
          stroke={TYPE_COLORS[selected.type]} strokeWidth={1.5 * k} strokeDasharray={`${3 * k} ${4 * k}`} />
      )}
      {selected && !selected.work && selected.birth && selected.death && (
        <Line from={toLngLat(selected.birth.coords)} to={toLngLat(selected.death.coords)}
          stroke={TYPE_COLORS[selected.type]} strokeWidth={1.5 * k} strokeDasharray={`${3 * k} ${4 * k}`} />
      )}

      {/* Halo for spots that aggregate multiple people — the more there are,
          the bigger the ring. The dominant Great-Person type colors the halo. */}
      {[...buckets.values()].filter((b) => b.people.length >= 2).map((b) => {
        const counts = new globalThis.Map<string, number>();
        for (const p of b.people) counts.set(p.type, (counts.get(p.type) ?? 0) + 1);
        const dom = [...counts.entries()].sort((a, c) => c[1] - a[1])[0][0];
        const color = TYPE_COLORS[dom as GPType];
        const r = (4 + 2.6 * Math.sqrt(b.people.length)) * k;
        return (
          <Marker key={`halo:${coordKey(b.coords)}`} coordinates={toLngLat(b.coords)}
            onClick={(ev: any) => {
              if (onClusterClick) onClusterClick(b.people, { x: ev.clientX, y: ev.clientY }, b.placeLabel);
            }}>
            <circle r={r} fill={color} fillOpacity={0.08}
              stroke={color} strokeOpacity={0.55} strokeWidth={1.2 * k}
              style={{ cursor: "pointer", pointerEvents: "all" }} />
            <text y={-r - 4 * k} textAnchor="middle"
              style={{ pointerEvents: "none", fill: color, fontSize: 10 * k, fontWeight: 600,
                       paintOrder: "stroke", stroke: "#0a1118", strokeWidth: 2 * k }}>
              {b.people.length}
            </text>
          </Marker>
        );
      })}

      {people.map((p) => {
        const color = TYPE_COLORS[p.type];
        const isSel = selected?.name === p.name;
        // Merge per-person markers that share a coord — if someone was born
        // AND died at Carthage we draw one marker, not two stacked. Stage
        // priority: work > birth > death (a working/career marker is the
        // most prominent, dark-center "died" marker is least). The tooltip
        // for a merged marker lists every life stage that overlapped here.
        type Stage = "birth" | "work" | "death";
        const stageRank: Record<Stage, number> = { work: 0, birth: 1, death: 2 };
        const perCoord = new globalThis.Map<string, { coords: [number,number]; place: { name: string; coords: [number,number] }; stages: Stage[] }>();
        const push = (stage: Stage, place?: { name: string; coords: [number,number] }) => {
          if (!place) return;
          const key = coordKey(place.coords);
          if (!perCoord.has(key)) perCoord.set(key, { coords: place.coords, place, stages: [] });
          perCoord.get(key)!.stages.push(stage);
        };
        push("birth", p.birth); push("work", p.work); push("death", p.death);

        return (
          <React.Fragment key={`${p.type}:${p.name}`}>
            {[...perCoord.values()].map((entry) => {
              entry.stages.sort((a, b) => stageRank[a] - stageRank[b]);
              const primary = entry.stages[0];
              const tip = `${p.name} — ${entry.stages.map((s) =>
                s === "birth" ? `born ${entry.place.name}` :
                s === "work"  ? entry.place.name :
                                `died ${entry.place.name}`
              ).join(" · ")}`;
              // Marker geometry: visible radius + larger invisible hit area
              // for easier clicking. (Markers stay screen-sized via 1/zoom.)
              const HIT = 11 * k; // pointer target radius
              if (primary === "work") {
                return (
                  <Marker key={`${p.name}-${coordKey(entry.coords)}`}
                    coordinates={toLngLat(entry.coords)}
                    onClick={(ev: any) => handleClick(entry.place, p, ev)}>
                    <circle r={HIT} fill="transparent" style={{ cursor: "pointer" }} />
                    <circle r={(isSel ? 8 : 5.5) * k} fill={color} fillOpacity={0.9}
                      stroke={isSel ? "#fff" : "none"} strokeWidth={(isSel ? 1.4 : 0) * k}
                      style={{ pointerEvents: "none" }} />
                    <title>{tip}</title>
                  </Marker>
                );
              }
              if (primary === "birth") {
                return (
                  <Marker key={`${p.name}-${coordKey(entry.coords)}`}
                    coordinates={toLngLat(entry.coords)}
                    onClick={(ev: any) => handleClick(entry.place, p, ev)}>
                    <circle r={HIT} fill="transparent" style={{ cursor: "pointer" }} />
                    <circle r={(isSel ? 7.5 : 5) * k} fill="none" stroke={color}
                      strokeWidth={(isSel ? 2.6 : 2) * k} style={{ pointerEvents: "none" }} />
                    <title>{tip}</title>
                  </Marker>
                );
              }
              return (
                <Marker key={`${p.name}-${coordKey(entry.coords)}`}
                  coordinates={toLngLat(entry.coords)}
                  onClick={(ev: any) => handleClick(entry.place, p, ev)}>
                  <circle r={HIT} fill="transparent" style={{ cursor: "pointer" }} />
                  <circle r={(isSel ? 6.5 : 4.5) * k} fill="#0a1118" stroke={color}
                    strokeWidth={(isSel ? 2.6 : 2) * k} style={{ pointerEvents: "none" }} />
                  <title>{tip}</title>
                </Marker>
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
}
