"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ComposableMap, Geographies, Geography, ZoomableGroup, Marker, Sphere, Graticule,
} from "react-simple-maps";
import type { Wonder, WonderCategory } from "../data/wonders";
import { WONDER_CATEGORY_COLORS } from "../data/wonders";

const WORLD_TOPO = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

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
  wonders: Wonder[];
  selected: Wonder | null;
  onSelect: (w: Wonder) => void;
  /** Click on a city shared by >1 wonder (Paris, New York, London, …). */
  onClusterClick?: (wonders: Wonder[], anchor: { x: number; y: number }, placeLabel: string) => void;
  /** Bumped by the parent when a list pick should fly the map to `selected`. */
  focusKey: number;
}

// our data is [lat, lng]; react-simple-maps expects [lng, lat]
const toLngLat = (c: [number, number]): [number, number] => [c[1], c[0]];

// SVG path for a pie slice of `frac` (0..1) of a circle radius r, from the top
// clockwise. Used on city clusters to show the share of wonders visited.
const piePath = (r: number, frac: number): string => {
  const a0 = -Math.PI / 2;
  const a1 = a0 + frac * 2 * Math.PI;
  const x0 = r * Math.cos(a0), y0 = r * Math.sin(a0);
  const x1 = r * Math.cos(a1), y1 = r * Math.sin(a1);
  const large = frac > 0.5 ? 1 : 0;
  return `M 0 0 L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
};

export default function WonderMap({ wonders, selected, onSelect, onClusterClick, focusKey }: Props) {
  const [proj, setProj] = useState<ProjName>("geoNaturalEarth1");
  const [center, setCenter] = useState<[number, number]>([10, 20]);
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState<[number, number, number]>([-10, -20, 0]);
  const [globeScale, setGlobeScale] = useState(220);
  const dragRef = useRef<{ x: number; y: number; r0: [number, number, number] } | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Non-passive wheel listener so we can preventDefault() globe zooming.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (proj !== "geoOrthographic") return;
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      setGlobeScale((s) => Math.min(2400, Math.max(140, s * factor)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [proj]);

  // Fly to the selected wonder ONLY when the parent bumps focusKey (i.e. the
  // user picked it from the list). Clicking a marker on the map selects without
  // moving the camera, so zooming in and clicking around no longer snaps back.
  useEffect(() => {
    if (focusKey === 0) return; // initial mount — don't move
    if (!selected?.location) return;
    const [lng, lat] = toLngLat(selected.location.coords);
    if (proj === "geoOrthographic") {
      setRotate([-lng, -lat, 0]);
    } else {
      setCenter([lng, lat]);
      setZoom((z) => Math.max(z, 4)); // zoom in to at least 4, never out
    }
    // selected/proj intentionally omitted — only a focusKey bump should refocus
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusKey]);

  const projectionConfig: any =
    proj === "geoOrthographic" ? { rotate, scale: globeScale } :
    proj === "geoMercator"     ? { scale: 130 } :
    { scale: 160 };

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", height: "100%", background: "#0a1118" }}>
      <div style={{
        position: "absolute", top: 12, left: 12, zIndex: 10,
        background: "rgba(15,20,25,0.92)", border: "1px solid #324155",
        borderRadius: 8, padding: "6px 10px", display: "flex", gap: 6, alignItems: "center",
        flexWrap: "wrap", maxWidth: "calc(100% - 24px)",
        fontSize: 12, color: "#9aa9bc"
      }}>
        <span>Projection:</span>
        {PROJECTIONS.map((p) => (
          <button key={p.value}
            onClick={() => { setProj(p.value); setZoom(1); setCenter([10, 20]); setGlobeScale(220); }}
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
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", background: "#0a1118", display: "block" }}
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
        {proj === "geoOrthographic" && (
          <>
            <Sphere id="wonder-sphere" stroke="#3a5570" strokeWidth={0.8} fill="#0e2742" />
            <Graticule stroke="#1e3a52" strokeWidth={0.4} />
          </>
        )}

        {proj === "geoOrthographic" ? (
          <WonderContents wonders={wonders} selected={selected} onSelect={onSelect}
            onClusterClick={onClusterClick} focusKey={focusKey} zoom={1} globeRotate={rotate} />
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
            <WonderContents wonders={wonders} selected={selected} onSelect={onSelect}
              onClusterClick={onClusterClick} focusKey={focusKey} zoom={zoom} />
          </ZoomableGroup>
        )}
      </ComposableMap>

      {proj === "geoOrthographic" && (
        <div style={{
          position: "absolute", top: 56, left: 14, fontSize: 11, zIndex: 5,
          color: "#9aa9bc", background: "rgba(15,20,25,0.85)",
          padding: "4px 10px", borderRadius: 6, border: "1px solid #324155",
        }}>Drag to rotate · scroll to zoom</div>
      )}
    </div>
  );
}

function WonderContents({ wonders, selected, onSelect, onClusterClick, zoom, globeRotate }:
    Props & { zoom: number; globeRotate?: [number, number, number] }) {
  // Counter-scale so markers stay screen-sized as the map zooms in.
  const k = 1 / Math.max(0.5, zoom);

  // Group wonders by their place label so clicking any marker in a city that
  // holds several (Paris, New York, London, Moscow, Rome…) opens the whole set.
  const cityGroups = React.useMemo(() => {
    const m = new globalThis.Map<string, Wonder[]>();
    for (const w of wonders) {
      if (!w.location) continue;
      const key = w.location.name;
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(w);
    }
    return m;
  }, [wonders]);

  const handleClick = (w: Wonder, ev: React.MouseEvent) => {
    const group = (w.location && cityGroups.get(w.location.name)) || [w];
    if (group.length > 1 && onClusterClick) {
      onClusterClick(group, { x: ev.clientX, y: ev.clientY }, w.location!.name);
    } else {
      onSelect(w);
    }
  };

  // Hemisphere visibility for the orthographic globe (see Map.tsx for the math).
  const isVisibleOnGlobe = (() => {
    if (!globeRotate) return () => true;
    const toRad = Math.PI / 180;
    const cLng = -globeRotate[0] * toRad;
    const cLat = -globeRotate[1] * toRad;
    const cosCLat = Math.cos(cLat), sinCLat = Math.sin(cLat);
    return (coords: [number, number]) => {
      const lat = coords[0] * toRad, lng = coords[1] * toRad;
      const cosC = sinCLat * Math.sin(lat) + cosCLat * Math.cos(lat) * Math.cos(lng - cLng);
      return cosC > 0;
    };
  })();

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

      {/* Single-wonder cities: one marker each. Multi-wonder cities collapse
          into the cluster markers rendered below. */}
      {wonders.map((w) => {
        if (!w.location) return null;                          // orbital / virtual — no marker
        if ((cityGroups.get(w.location.name)?.length ?? 1) > 1) return null;
        if (!isVisibleOnGlobe(w.location.coords)) return null; // back of the globe
        const color = WONDER_CATEGORY_COLORS[w.category];
        const isSel = selected?.name === w.name;
        const r = (isSel ? 7 : 5) * k;
        const HIT = 12 * k;
        // A mapped wonder you still can't visit (mythical — may never have
        // existed). Orbital/virtual ones have no location and aren't drawn.
        const cantVisit = w.status === "mythical";
        // Status ring: red = mythical (can't visit), yellow = altered from the
        // original (reconstructed or ruined), none = still the original.
        const statusRing =
          w.status === "mythical" ? "#e03b3b" :
          (w.status === "reconstructed" || w.status === "ruined") ? "#f5c518" : null;
        // Dotted ring = an "issue" (mythical=red, reconstructed/ruined=yellow);
        // the glyph fill carries visited; a dashed white ring marks selection.
        const rings: { color: string; dotted?: boolean; dashed?: boolean }[] = [];
        if (statusRing)  rings.push({ color: statusRing, dotted: true });
        if (isSel)       rings.push({ color: "#ffffff", dashed: true });
        const tip = `${w.name} — ${w.category} wonder · ${w.status}` +
          (w.visited ? " · visited" : " · not visited") + (cantVisit ? " · can't be visited" : "");

        return (
          <Marker key={`${w.category}:${w.name}`} coordinates={toLngLat(w.location.coords)}
            onClick={(ev: any) => handleClick(w, ev)}>
            <circle r={HIT} fill="transparent" style={{ cursor: "pointer" }} />
            <WonderGlyph color={color} r={r} k={k} visited={!!w.visited} />
            {rings.map((ring, i) => (
              <circle key={i} r={(r + 3.5 + i * 3) * k} fill="none" stroke={ring.color}
                strokeWidth={(ring.dashed ? 1.2 : 1.6) * k} strokeOpacity={0.95}
                strokeLinecap={ring.dotted ? "round" : undefined}
                strokeDasharray={ring.dotted ? `${0.5 * k} ${2.2 * k}` : ring.dashed ? `${2 * k} ${2 * k}` : undefined}
                style={{ pointerEvents: "none" }} />
            ))}
            <title>{tip}</title>
          </Marker>
        );
      })}

      {/* Multi-wonder cities: a single cluster marker (count inside), opening
          the city list on click. Colored by the city's dominant category;
          a white ring marks a city where every wonder is visited. */}
      {[...cityGroups.entries()].filter(([, ws]) => ws.length > 1).map(([city, ws]) => {
        const lat = ws.reduce((s, w) => s + w.location!.coords[0], 0) / ws.length;
        const lng = ws.reduce((s, w) => s + w.location!.coords[1], 0) / ws.length;
        const coords: [number, number] = [lat, lng];
        if (!isVisibleOnGlobe(coords)) return null;
        const total = ws.length;
        const catCount = new globalThis.Map<WonderCategory, number>();
        for (const w of ws) catCount.set(w.category, (catCount.get(w.category) ?? 0) + 1);
        const dom = [...catCount.entries()].sort((a, b) => b[1] - a[1])[0][0];
        const color = WONDER_CATEGORY_COLORS[dom];
        const visitedCount = ws.filter((w) => w.visited).length;
        const visitedFrac = visitedCount / total;
        const hasCantVisit = ws.some((w) => w.status === "mythical");
        const hasAltered = ws.some((w) => w.status === "reconstructed" || w.status === "ruined");
        const isSelHere = !!selected && ws.some((w) => w.name === selected.name);
        const r = (6 + 2.2 * Math.sqrt(total)) * k;
        return (
          <Marker key={`city:${city}`} coordinates={toLngLat(coords)}
            onClick={(ev: any) => onClusterClick && onClusterClick(ws, { x: ev.clientX, y: ev.clientY }, city)}>
            <circle r={r + 6 * k} fill="transparent" style={{ cursor: "pointer", pointerEvents: "all" }} />
            {/* Pie: the filled wedge is the share of the city's wonders visited. */}
            <circle r={r} fill="#0e1620" stroke={color} strokeWidth={2 * k}
              style={{ cursor: "pointer", pointerEvents: "all" }} />
            {visitedFrac >= 1 ? (
              <circle r={r} fill={color} fillOpacity={0.95} style={{ pointerEvents: "none" }} />
            ) : visitedFrac > 0 ? (
              <path d={piePath(r, visitedFrac)} fill={color} fillOpacity={0.95} style={{ pointerEvents: "none" }} />
            ) : null}
            {hasCantVisit ? (
              <circle r={r + 3 * k} fill="none" stroke="#e03b3b" strokeWidth={1.6 * k}
                strokeLinecap="round" strokeDasharray={`${0.5 * k} ${2.2 * k}`}
                strokeOpacity={0.95} style={{ pointerEvents: "none" }} />
            ) : hasAltered ? (
              <circle r={r + 3 * k} fill="none" stroke="#f5c518" strokeWidth={1.6 * k}
                strokeLinecap="round" strokeDasharray={`${0.5 * k} ${2.2 * k}`}
                strokeOpacity={0.95} style={{ pointerEvents: "none" }} />
            ) : null}
            {isSelHere && (
              <circle r={r + 6 * k} fill="none" stroke="#fff" strokeWidth={1.2 * k}
                strokeDasharray={`${2 * k} ${2 * k}`} style={{ pointerEvents: "none" }} />
            )}
            <text textAnchor="middle" dy="0.35em"
              style={{ pointerEvents: "none", fill: "#fff", fontSize: 9.5 * k, fontWeight: 700,
                       paintOrder: "stroke", stroke: "#0a1118", strokeWidth: 2.5 * k }}>
              {total}
            </text>
            <title>{`${city} — ${total} wonders · ${visitedCount} visited`}</title>
          </Marker>
        );
      })}
    </>
  );
}

// Fill encodes whether you've visited it: a filled disc if visited, an empty
// (hollow) circle if not. Real-world status is shown by the ring color around
// the glyph (yellow = reconstructed/ruined, red = mythical), not the fill.
function WonderGlyph({ color, r, k, visited }: {
  color: string; r: number; k: number; visited: boolean;
}) {
  const noPe = { pointerEvents: "none" as const };
  return (
    <circle r={r} fill={visited ? color : "transparent"} fillOpacity={visited ? 0.95 : 1}
      stroke={color} strokeWidth={(visited ? 1 : 2) * k} style={noPe} />
  );
}
