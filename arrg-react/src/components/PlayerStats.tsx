import { useGameContext } from "../context/GameContext";
import "../styles/PlayerStats.css";

const PlayerStats: React.FC = () => {
	const { playerResources, playerLevel } = useGameContext();

	return (
		<div id="playerStats">
			<div className="stat">
				<img src="/sprites/XP_icon.png" alt="XP" />
				<span id="xp">{`${playerResources.xp}/${playerLevel * 100}`}</span>
			</div>
			<div className="stat">
				<img src="/sprites/Gold_icon.png" alt="Gold" />
				<span id="gold">{playerResources.gold}</span>
			</div>
			<div className="stat">
				<img src="/sprites/Rhum_icon.png" alt="Rhum" />
				<span id="rhum">{playerResources.rhum}</span>
			</div>
			<div className="stat">
				<img src="/sprites/Water_icon.png" alt="Water" />
				<span id="water">{playerResources.water}</span>
			</div>
			<div className="stat">
				<img src="/sprites/Fish_icon.png" alt="Food" />
				<span id="food">{playerResources.food}</span>
			</div>
		</div>
	);
};

export default PlayerStats;
