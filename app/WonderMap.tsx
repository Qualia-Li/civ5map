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

// Stroke-only arc from angle a0 to a1 (radians) at radius r. Used to draw the
// part-solid / part-dotted border that shows a city's share of "issue" wonders.
const arcPath = (r: number, a0: number, a1: number): string => {
  const x0 = r * Math.cos(a0), y0 = r * Math.sin(a0);
  const x1 = r * Math.cos(a1), y1 = r * Math.sin(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
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

      {/* One marker per place (single wonder or whole city), three independent
          channels:
            color  = category (dominant)
            fill   = share of the city's wonders you've visited  (pie wedge)
            border = share that are "issues" (reconstructed/ruined/mythical):
                     solid arc for originals, dotted arc for issues
          Selection is a soft halo behind the glyph — never a border. */}
      {[...cityGroups.entries()].map(([place, ws]) => {
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
        const issueCount = ws.filter((w) => w.status !== "original").length;
        const visitedFrac = visitedCount / total;
        const issueFrac = issueCount / total;
        const isSelHere = !!selected && ws.some((w) => w.name === selected.name);
        const r = (3.5 + 2 * Math.sqrt(total)) * k;
        const rFill = r - 2 * k;                  // inset so the border stays visible over fill
        const HIT = r + 6 * k;
        const SW = 1.8 * k;                       // constant border width
        const dots = `${0.5 * k} ${2.2 * k}`;     // dotted = issue
        const a0 = -Math.PI / 2;
        const aSplit = a0 + (1 - issueFrac) * 2 * Math.PI; // solid → dotted boundary
        const tip = total > 1
          ? `${place} — ${total} wonders · ${visitedCount} visited${issueCount ? ` · ${issueCount} with issues` : ""}`
          : `${ws[0].name} — ${ws[0].category} · ${ws[0].status}${ws[0].visited ? " · visited" : ""}`;

        return (
          <Marker key={`place:${place}`} coordinates={toLngLat(coords)}
            onClick={(ev: any) => {
              if (total > 1) onClusterClick?.(ws, { x: ev.clientX, y: ev.clientY }, place);
              else onSelect(ws[0]);
            }}>
            <circle r={HIT} fill="transparent" style={{ cursor: "pointer", pointerEvents: "all" }} />

            {/* Selection = a soft white glow/shadow (never an extra border). Every
                shape below is centered on the marker origin, so shadow, fill,
                border and number stay perfectly concentric. */}
            <g style={isSelHere ? { filter: `drop-shadow(0 0 ${(4 * k).toFixed(2)}px #ffffff) drop-shadow(0 0 ${(2 * k).toFixed(2)}px #ffffff)` } : undefined}>
            {/* fill = visited share (inset so the border ring stays visible) */}
            {visitedFrac >= 1 ? (
              <circle r={rFill} fill={color} fillOpacity={0.95} style={{ pointerEvents: "none" }} />
            ) : visitedFrac > 0 ? (
              <path d={piePath(rFill, visitedFrac)} fill={color} fillOpacity={0.95} style={{ pointerEvents: "none" }} />
            ) : null}

            {/* border = issue share: solid arc (original) + dotted arc (issue) */}
            {issueFrac <= 0 ? (
              <circle r={r} fill="none" stroke={color} strokeWidth={SW} style={{ pointerEvents: "none" }} />
            ) : issueFrac >= 1 ? (
              <circle r={r} fill="none" stroke={color} strokeWidth={SW} strokeLinecap="round"
                strokeDasharray={dots} style={{ pointerEvents: "none" }} />
            ) : (
              <>
                <path d={arcPath(r, a0, aSplit)} fill="none" stroke={color} strokeWidth={SW}
                  style={{ pointerEvents: "none" }} />
                <path d={arcPath(r, aSplit, a0 + 2 * Math.PI)} fill="none" stroke={color} strokeWidth={SW}
                  strokeLinecap="round" strokeDasharray={dots} style={{ pointerEvents: "none" }} />
              </>
            )}

            {total > 1 && (
              <text textAnchor="middle" dominantBaseline="central"
                style={{ pointerEvents: "none", fill: "#fff", fontSize: r * 1.05, fontWeight: 700,
                         paintOrder: "stroke", stroke: "#0a1118", strokeWidth: 1.4 * k }}>
                {total}
              </text>
            )}
            </g>
            <title>{tip}</title>
          </Marker>
        );
      })}
    </>
  );
}
