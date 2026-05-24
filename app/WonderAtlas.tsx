"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { WONDERS, WONDER_CATEGORY_COLORS } from "../data/wonders";
import type { Wonder, WonderCategory, WonderStatus, GameId } from "../data/wonders";
import ModeTabs, { type Mode } from "./ModeTabs";

const WonderMap = dynamic(() => import("./WonderMap"), { ssr: false });

const CATEGORIES: WonderCategory[] = ["World", "National", "Natural", "Unused"];
const STATUSES: WonderStatus[] = ["original", "reconstructed", "ruined", "mythical"];
const GAMES: GameId[] = ["V", "VI"];

const STATUS_LABEL: Record<WonderStatus, string> = {
  original: "Original", reconstructed: "Reconstructed", ruined: "Ruined", mythical: "Mythical",
};
const GAME_LABEL: Record<GameId, string> = { V: "Civ V", VI: "Civ VI" };
const gamesLabel = (g?: GameId[]) => (g ?? []).map((x) => GAME_LABEL[x]).join(" & ");

const clickable = (onActivate: (e: any) => void) => ({
  role: "button" as const,
  tabIndex: 0,
  onClick: onActivate,
  onKeyDown: (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onActivate(e); }
  },
});

export default function WonderAtlas({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  const [activeCats, setActiveCats] = useState<Set<WonderCategory>>(new Set(CATEGORIES));
  const [activeStatuses, setActiveStatuses] = useState<Set<WonderStatus>>(new Set(STATUSES));
  const [activeGames, setActiveGames] = useState<Set<GameId>>(new Set(GAMES));
  const [visitedOnly, setVisitedOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Wonder | null>(null);

  const filtered = useMemo(() => {
    return WONDERS.filter((w) => {
      if (!activeCats.has(w.category)) return false;
      if (!activeStatuses.has(w.status)) return false;
      if (!(w.games ?? []).some((g) => activeGames.has(g))) return false;
      if (visitedOnly && !w.visited) return false;
      if (search && !w.name.toLowerCase().includes(search.toLowerCase())
                 && !(w.location?.name.toLowerCase().includes(search.toLowerCase()))
                 && !(w.civ?.toLowerCase().includes(search.toLowerCase()))) return false;
      return true;
    });
  }, [activeCats, activeStatuses, activeGames, visitedOnly, search]);

  // Drop the selection if the current filters hide it, so the detail pane and
  // map focus never point at a wonder that isn't in the visible result set.
  useEffect(() => {
    if (selected && !filtered.some((w) => w.name === selected.name)) setSelected(null);
  }, [filtered, selected]);

  const stats = useMemo(() => {
    const total = WONDERS.length;
    const visited = WONDERS.filter((w) => w.visited).length;
    const byCat = CATEGORIES.map((c) => ({ c, n: WONDERS.filter((w) => w.category === c).length }));
    return { total, visited, byCat };
  }, []);

  const isolate = <T,>(set: Set<T>, setter: (s: Set<T>) => void, all: T[], value: T, ev: React.MouseEvent) => {
    if (ev.shiftKey) {
      const next = new Set(set);
      if (next.has(value)) next.delete(value); else next.add(value);
      setter(next.size === 0 ? new Set(all) : next);
      return;
    }
    const isSolo = set.size === 1 && set.has(value);
    setter(isSolo ? new Set(all) : new Set([value]));
  };

  const dirty = activeCats.size !== CATEGORIES.length || activeStatuses.size !== STATUSES.length
    || activeGames.size !== GAMES.length || visitedOnly || search || selected;

  return (
    <div className="app">
      <aside className="sidebar">
        <ModeTabs mode={mode} setMode={setMode} />
        <h1>Civ V <span>Wonders</span> Atlas</h1>
        <div className="sub">
          {stats.total} wonders of Civilization V &amp; VI, pinned to the real places that inspired
          them. {stats.byCat.map((b) => `${b.n} ${b.c}`).join(" · ")}. {stats.visited} visited.
        </div>

        {dirty && (
          <button
            onClick={() => {
              setActiveCats(new Set(CATEGORIES));
              setActiveStatuses(new Set(STATUSES));
              setActiveGames(new Set(GAMES));
              setVisitedOnly(false);
              setSearch("");
              setSelected(null);
            }}
            style={{
              marginBottom: 14, padding: "6px 10px",
              background: "transparent", border: "1px solid var(--accent)",
              color: "var(--accent)", borderRadius: 6, cursor: "pointer",
              fontSize: 12, width: "100%",
            }}>
            ↺ Reset filters &amp; selection
          </button>
        )}

        <div className="filter-group">
          <h3>Category</h3>
          <div className="chip-row">
            {CATEGORIES.map((c) => {
              const on = activeCats.has(c);
              return (
                <div key={c}
                  className={`chip ${on ? "active" : ""}`}
                  aria-pressed={on}
                  title="Click to isolate · shift-click to add/remove"
                  style={on ? { background: WONDER_CATEGORY_COLORS[c], borderColor: WONDER_CATEGORY_COLORS[c], color: "#11161d" } : undefined}
                  {...clickable((e) => isolate(activeCats, setActiveCats, CATEGORIES, c, e))}>
                  {c}
                </div>
              );
            })}
          </div>
        </div>

        <div className="filter-group">
          <h3>Game</h3>
          <div className="chip-row">
            {GAMES.map((g) => (
              <div key={g}
                className={`chip ${activeGames.has(g) ? "active" : ""}`}
                aria-pressed={activeGames.has(g)}
                title="Click to isolate · shift-click to add/remove"
                {...clickable((e) => isolate(activeGames, setActiveGames, GAMES, g, e))}>
                {GAME_LABEL[g]}
              </div>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>Status</h3>
          <div className="chip-row">
            {STATUSES.map((s) => (
              <div key={s}
                className={`chip ${activeStatuses.has(s) ? "active" : ""}`}
                aria-pressed={activeStatuses.has(s)}
                title="Click to isolate · shift-click to add/remove"
                {...clickable((e) => isolate(activeStatuses, setActiveStatuses, STATUSES, s, e))}>
                {STATUS_LABEL[s]}
              </div>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>Visited</h3>
          <div
            className={`chip ${visitedOnly ? "active" : ""}`}
            aria-pressed={visitedOnly}
            {...clickable(() => setVisitedOnly((v) => !v))}>
            {visitedOnly ? "✓ Visited only" : "Show visited only"}
          </div>
        </div>

        <div className="filter-group">
          <h3>Search</h3>
          <input className="search" placeholder="Pyramids, Paris, China..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="results">
          <div className="count">{filtered.length} matching</div>
          {filtered.map((w) => (
            <div key={`${w.category}:${w.name}`}
              className={`result ${selected?.name === w.name ? "selected" : ""}`}
              aria-label={`Show details for ${w.name}`}
              {...clickable(() => setSelected(w))}>
              <div className="dot" style={{ background: WONDER_CATEGORY_COLORS[w.category] }} />
              <div>{w.name}{" "}
                <span style={{ color: "var(--muted)", fontSize: 11 }}>
                  · {w.location?.name ?? w.civ ?? w.status} · {gamesLabel(w.games)}
                </span>
              </div>
              <div className="yr">{w.visited ? "✓" : ""}</div>
            </div>
          ))}
        </div>
      </aside>

      <main className="map-wrap">
        <WonderMap wonders={filtered} selected={selected} onSelect={setSelected} />

        <div className="legend">
          <div>Markers — colored by category</div>
          {CATEGORIES.map((c) => (
            <div className="row" key={c}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: WONDER_CATEGORY_COLORS[c], display: "inline-block" }} />
              {c}
            </div>
          ))}
          <div style={{ height: 1, background: "var(--line)", margin: "6px 0" }} />
          <div className="row"><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#9aa9bc", display: "inline-block" }} /> Original (solid)</div>
          <div className="row"><span style={{ width: 10, height: 10, borderRadius: "50%", border: "1.5px dashed #9aa9bc", display: "inline-block" }} /> Reconstructed</div>
          <div className="row"><span style={{ width: 10, height: 10, borderRadius: "50%", border: "1.5px solid #9aa9bc", display: "inline-block" }} /> Ruined (hollow)</div>
          <div className="row"><span style={{ width: 10, height: 10, borderRadius: "50%", border: "1.5px dotted #9aa9bc", display: "inline-block" }} /> Mythical</div>
          <div className="row"><span style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid #fff", display: "inline-block" }} /> Visited</div>
          <div style={{ color: "var(--muted)", fontSize: 11, marginTop: 4 }}>Orbital &amp; virtual wonders aren&apos;t mapped.</div>
        </div>
      </main>

      <aside className="detail">
        {!selected && (
          <div className="empty" style={{ marginBottom: 12 }}>Click a marker or list row to see details.</div>
        )}
        {selected && (
          <>
            <h2>{selected.name}</h2>
            <div className="meta">
              <span style={{ color: WONDER_CATEGORY_COLORS[selected.category] }}>{selected.category}</span>
              {selected.era ? ` · ${selected.era}` : ""}
              {selected.civ ? ` · ${selected.civ}` : ""}
              {" · "}{STATUS_LABEL[selected.status]}
              {" · "}{gamesLabel(selected.games)}
            </div>
            {selected.visited && (
              <div style={{
                display: "inline-block", marginBottom: 12, padding: "2px 10px", borderRadius: 999,
                background: "rgba(255,255,255,0.08)", border: "1px solid #fff", color: "#fff", fontSize: 12,
              }}>✓ Visited</div>
            )}
            <div className="blurb">{selected.blurb}</div>

            <div className="label">Location</div>
            {selected.location ? (
              <div className="place-row">
                <span className="dot" style={{ background: WONDER_CATEGORY_COLORS[selected.category] }} />
                <span>{selected.location.name}
                  <span style={{ color: "var(--muted)", fontSize: 11 }}>
                    {" "}· {selected.location.coords[0].toFixed(2)}, {selected.location.coords[1].toFixed(2)}
                  </span>
                </span>
              </div>
            ) : (
              <div className="place-row" style={{ color: "var(--muted)" }}>
                {selected.note ?? "No real-world location."}
              </div>
            )}

            {selected.note && selected.location && (
              <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 6 }}>{selected.note}</div>
            )}
          </>
        )}

        <div style={{ height: 1, background: "var(--line)", margin: "18px 0" }} />
        <div className="label" style={{ marginBottom: 6 }}>Showing</div>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>
          {filtered.length} of {stats.total} wonders ·{" "}
          {filtered.filter((w) => w.visited).length} visited ·{" "}
          {filtered.filter((w) => !w.location).length} not mapped
        </div>
      </aside>
    </div>
  );
}
