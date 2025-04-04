import { GameProvider } from "./context/GameContext";
import GameMap from "./components/Map";
import PlayerStats from "./components/PlayerStats";
import DayCycle from "./components/DayCycle";
import ShopButton from "./components/ShopButton";
import HpBar from "./components/HpBar";
import "./App.css";

function App() {
	return (
		<GameProvider>
			<div className="app">
				<DayCycle />
				<PlayerStats />
				<ShopButton />
				<HpBar />
				<GameMap />
			</div>
		</GameProvider>
	);
}

export default App;
