"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ComposableMap, Geographies, Geography, ZoomableGroup, Marker, Line, Sphere, Graticule,
} from "react-simple-maps";
import type { Person, GPType } from "../data/people-types";

const WORLD_TOPO = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

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
}

// our data is [lat, lng]; react-simple-maps expects [lng, lat]
const toLngLat = (c: [number, number]): [number, number] => [c[1], c[0]];

export default function Map({ people, selected, onSelect }: Props) {
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
        <Sphere id="sphere" stroke="#324155" strokeWidth={0.5} fill="#0e1620" />
        <Graticule stroke="#1e2a3a" strokeWidth={0.4} />

        {proj === "geoOrthographic" ? (
          <MapContents people={people} selected={selected} onSelect={onSelect} zoom={1} />
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
            <MapContents people={people} selected={selected} onSelect={onSelect} zoom={zoom} />
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

function MapContents({ people, selected, onSelect, zoom }: Props & { zoom: number }) {
  // Counter-scale so markers/lines stay screen-sized as the map zooms in.
  const k = 1 / Math.max(0.5, zoom);
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
              strokeWidth={0.4}
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

      {people.map((p) => {
        const color = TYPE_COLORS[p.type];
        const isSel = selected?.name === p.name;
        return (
          <React.Fragment key={`${p.type}:${p.name}`}>
            {p.birth && (
              <Marker coordinates={toLngLat(p.birth.coords)} onClick={() => onSelect(p)}>
                <circle r={(isSel ? 5 : 3.2) * k} fill="none" stroke={color}
                  strokeWidth={(isSel ? 2 : 1.4) * k} style={{ cursor: "pointer" }} />
                <title>{p.name} — born {p.birth.name}</title>
              </Marker>
            )}
            {p.work && (
              <Marker coordinates={toLngLat(p.work.coords)} onClick={() => onSelect(p)}>
                <circle r={(isSel ? 5.5 : 3.5) * k} fill={color} fillOpacity={0.9}
                  stroke={isSel ? "#fff" : "none"} strokeWidth={(isSel ? 1 : 0) * k}
                  style={{ cursor: "pointer" }} />
                <title>{p.name} — {p.work.name}</title>
              </Marker>
            )}
            {p.death && (
              <Marker coordinates={toLngLat(p.death.coords)} onClick={() => onSelect(p)}>
                <circle r={(isSel ? 4.5 : 2.8) * k} fill="#0a1118" stroke={color}
                  strokeWidth={(isSel ? 2 : 1.4) * k} style={{ cursor: "pointer" }} />
                <title>{p.name} — died {p.death.name}</title>
              </Marker>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}
