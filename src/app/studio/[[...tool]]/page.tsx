import type { Metadata } from "next";
import StudioWrapper from "./StudioWrapper";

export const metadata: Metadata = {
  title: "PIKORUA Studio",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <StudioWrapper />;
}
