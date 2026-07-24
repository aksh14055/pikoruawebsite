import { permanentRedirect } from "next/navigation";

export default function AiRootPage() {
  permanentRedirect("/ai/facts.json");
}
