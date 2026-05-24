"use client";

export type Mode = "people" | "wonders";

const TABS: { value: Mode; label: string }[] = [
  { value: "people",  label: "Great People" },
  { value: "wonders", label: "Wonders" },
];

export default function ModeTabs({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
      {TABS.map((t) => (
        <button key={t.value}
          onClick={() => setMode(t.value)}
          aria-pressed={mode === t.value}
          style={{
            flex: 1, padding: "7px 10px", borderRadius: 6, cursor: "pointer",
            fontSize: 13, fontWeight: mode === t.value ? 600 : 400,
            background: mode === t.value ? "var(--accent)" : "transparent",
            color: mode === t.value ? "#1a1300" : "var(--muted)",
            border: "1px solid " + (mode === t.value ? "var(--accent)" : "var(--line)"),
          }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
