import { useState } from "react";
import GameDashboard from "./ui/components/dashboard/game-dashboard";
import { LandingPage } from "./ui/components/landing/landing-page";

function App() {
  const [entered, setEntered] = useState(false);

  if (!entered) return <LandingPage onEnter={() => setEntered(true)} />;

  return <GameDashboard />;
}

export default App;
