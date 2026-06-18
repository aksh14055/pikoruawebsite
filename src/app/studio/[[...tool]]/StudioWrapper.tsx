"use client";

import dynamic from "next/dynamic";

// `ssr: false` is only valid inside a Client Component (Next.js App Router rule)
const StudioClient = dynamic(() => import("./StudioClient"), { ssr: false });

export default function StudioWrapper() {
  return <StudioClient />;
}
