"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ALL_PEOPLE } from "../data";
import type { Person, GPType, Era } from "../data/people-types";

const Map = dynamic(() => import("./Map"), { ssr: false });

const TYPES: GPType[] = ["Scientist","Engineer","Merchant","Writer","Artist","Musician","General","Admiral","Prophet"];
const ERAS: Era[] = ["Ancient","Classical","Medieval","Renaissance","Industrial","Modern"];

const TYPE_COLORS: Record<GPType, string> = {
  Scientist: "#5fbcd3", Engineer: "#f4a261", Merchant: "#e9c46a",
  Artist: "#e76f51", Writer: "#b497d6", Musician: "#c49bf0",
  General: "#d62828", Admiral: "#1d4ed8", Prophet: "#f9e79f",
};

function fmtYear(y?: number) {
  if (y === undefined) return "?";
  if (y < 0) return `${-y} BCE`;
  return `${y} CE`;
}

export default function Page() {
  const [activeTypes, setActiveTypes] = useState<Set<GPType>>(new Set(TYPES));
  const [activeEras, setActiveEras] = useState<Set<Era>>(new Set(ERAS));
  const [civQuery, setCivQuery] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Person | null>(null);

  const civs = useMemo(() => {
    const s = new Set<string>();
    ALL_PEOPLE.forEach((p) => s.add(p.civ));
    return [...s].sort();
  }, []);

  const filtered = useMemo(() => {
    return ALL_PEOPLE.filter((p) => {
      if (!activeTypes.has(p.type)) return false;
      if (!activeEras.has(p.era)) return false;
      if (civQuery && !p.civ.toLowerCase().includes(civQuery.toLowerCase())
                   && !p.country.toLowerCase().includes(civQuery.toLowerCase())) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [activeTypes, activeEras, civQuery, search]);

  const toggle = <T,>(set: Set<T>, setter: (s: Set<T>) => void, value: T) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value); else next.add(value);
    setter(next);
  };

  // Timeline (-2700 to 2025)
  const T_MIN = -2700, T_MAX = 2025;
  const tickYears = [-2500, -2000, -1500, -1000, -500, 0, 500, 1000, 1500, 2000];
  const yearToPct = (y: number) => ((y - T_MIN) / (T_MAX - T_MIN)) * 100;

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>Civ V <span>Great People</span> Atlas</h1>
        <div className="sub">{ALL_PEOPLE.length} historical figures from Civilization V's Great Person name pools — grouped by type, era, and civilization.</div>

        <div className="filter-group">
          <h3>Great Person Type</h3>
          <div className="chip-row">
            {TYPES.map((t) => (
              <div key={t}
                className={`chip type ${activeTypes.has(t) ? "active" : ""}`}
                data-type={t}
                onClick={() => toggle(activeTypes, setActiveTypes, t)}>
                {t}
              </div>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>Era</h3>
          <div className="chip-row">
            {ERAS.map((e) => (
              <div key={e}
                className={`chip ${activeEras.has(e) ? "active" : ""}`}
                onClick={() => toggle(activeEras, setActiveEras, e)}>
                {e}
              </div>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>Civilization / Country</h3>
          <input className="search" placeholder="e.g. China, Greece, France..."
            value={civQuery} onChange={(e) => setCivQuery(e.target.value)}
            list="civ-list" />
          <datalist id="civ-list">
            {civs.map((c) => <option key={c} value={c} />)}
          </datalist>
        </div>

        <div className="filter-group">
          <h3>Search by Name</h3>
          <input className="search" placeholder="Newton, Tesla, Sun Tzu..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="results">
          <div className="count">{filtered.length} matching</div>
          {filtered.slice(0, 200).map((p) => (
            <div key={`${p.type}:${p.name}`}
              className={`result ${selected?.name === p.name ? "selected" : ""}`}
              onClick={() => setSelected(p)}>
              <div className="dot" style={{ background: TYPE_COLORS[p.type] }} />
              <div>{p.name} <span style={{ color: "var(--muted)", fontSize: 11 }}>· {p.civ}</span></div>
              <div className="yr">{fmtYear(p.born)}</div>
            </div>
          ))}
          {filtered.length > 200 && (
            <div className="count">… and {filtered.length - 200} more — refine filters.</div>
          )}
        </div>
      </aside>

      <main className="map-wrap">
        <Map people={filtered} selected={selected} onSelect={setSelected} />

        <div className="legend">
          <div>Map markers</div>
          <div className="row"><span className="ring" /> Born</div>
          <div className="row"><span className="ring filled" /> Worked / lived</div>
          <div className="row"><span className="ring filled" style={{ background: "#111" }} /> Died</div>
        </div>

        <div className="timeline">
          <div>Timeline · {filtered.length} people · birth year</div>
          <div className="timeline-track">
            <div className="timeline-axis" />
            {tickYears.map((y) => (
              <div key={y} className="timeline-tick" style={{ left: `${yearToPct(y)}%` }}>
                <div className="bar" />
                <div className="lbl">{y < 0 ? `${-y} BCE` : y}</div>
              </div>
            ))}
            {filtered.filter(p => p.born !== undefined).map((p) => (
              <div key={`tl-${p.type}:${p.name}`}
                className="timeline-marker"
                title={`${p.name} (${fmtYear(p.born)})`}
                style={{ left: `${yearToPct(p.born!)}%`, background: TYPE_COLORS[p.type],
                         outline: selected?.name === p.name ? "2px solid #fff" : undefined }}
                onClick={() => setSelected(p)} />
            ))}
          </div>
        </div>
      </main>

      <aside className="detail">
        {!selected && (
          <div className="empty">Click a marker on the map, a name in the list, or a dot on the timeline to see details — birthplace, where they worked, where they died, and what they made.</div>
        )}
        {selected && (
          <>
            <h2>{selected.name}</h2>
            <div className="meta">
              <span style={{ color: TYPE_COLORS[selected.type] }}>{selected.type}</span>
              {" · "}{selected.civ}
              {" · "}{selected.era}
              {" · "}{fmtYear(selected.born)} – {fmtYear(selected.died)}
            </div>
            <div className="blurb">{selected.blurb}</div>

            <div className="label">Born</div>
            {selected.birth ? (
              <div className="place-row">
                <span className="dot" style={{ background: TYPE_COLORS[selected.type], border: "2px solid #fff" }} />
                <span>{selected.birth.name}</span>
              </div>
            ) : <div className="place-row" style={{ color: "var(--muted)" }}>—</div>}

            <div className="label" style={{ marginTop: 8 }}>Worked</div>
            {selected.work ? (
              <div className="place-row">
                <span className="dot" style={{ background: TYPE_COLORS[selected.type] }} />
                <span>{selected.work.name}</span>
              </div>
            ) : <div className="place-row" style={{ color: "var(--muted)" }}>—</div>}

            <div className="label" style={{ marginTop: 8 }}>Died</div>
            {selected.death ? (
              <div className="place-row">
                <span className="dot" style={{ background: "#111", border: `2px solid ${TYPE_COLORS[selected.type]}` }} />
                <span>{selected.death.name}</span>
              </div>
            ) : <div className="place-row" style={{ color: "var(--muted)" }}>—</div>}

            <div className="label" style={{ marginTop: 16 }}>Notable Works / Products</div>
            <ul className="works">
              {selected.works.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </>
        )}
      </aside>
    </div>
  );
}
