import { Metadata } from "next";
import App from "./components/App";
import CONTROLS from "./data/controls.json";
import DEFAULT_PATTERNS from "./data/patterns.json";

export const metadata: Metadata = {
  title: "Ma Che Vuoi",
  description: "Interactive hand gesture drawing application"
};

export default function Home() {
  return <App initialControls={CONTROLS} initialPatterns={DEFAULT_PATTERNS} />;
}
