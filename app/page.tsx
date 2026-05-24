"use client";

import { useState } from "react";
import PeopleAtlas from "./PeopleAtlas";
import WonderAtlas from "./WonderAtlas";
import type { Mode } from "./ModeTabs";

export default function Page() {
  const [mode, setMode] = useState<Mode>("people");
  return mode === "people"
    ? <PeopleAtlas mode={mode} setMode={setMode} />
    : <WonderAtlas mode={mode} setMode={setMode} />;
}
