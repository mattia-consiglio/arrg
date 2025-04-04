import { useGameContext } from "../context/GameContext";
import { calculateDistance } from "../utils/gameUtils";
import "../styles/MapCell.css";

interface MapCellProps {
	x: number;
	y: number;
}

const MapCell: React.FC<MapCellProps> = ({ x, y }) => {
	const { mapCells, playerPosition, movePlayer, isDragging, isShipMoving, ports } = useGameContext();

	// Find the current cell data
	const cellData = mapCells.find((cell) => cell.x === x && cell.y === y);

	// Calculate CSS classes for the cell
	const getCellClasses = () => {
		const classes = ["cell"];

		if (cellData?.isDeadZone) {
			classes.push("deadzone");
		}

		if (cellData?.isMolo) {
			classes.push("Molo");

			if (cellData.isAmichevole) {
				classes.push("amichevole");
			}

			if (cellData.isNemico) {
				classes.push("nemico");
			}
		}

		// Aggiungi classi per la cella corrente del giocatore e le celle raggiungibili
		if (playerPosition.x === x && playerPosition.y === y) {
			classes.push("current");
		} else if (isMovementPossible()) {
			classes.push("reachable");
		}

		// Aggiungi classe se la nave è in movimento
		if (isShipMoving) {
			classes.push("disabled");
		}

		return classes.join(" ");
	};

	// Determina se questa è la cella dove dovrebbe essere mostrata l'immagine del molo
	const isPrimaryDeadZoneCell = () => {
		if (!cellData?.isDeadZone || !cellData.direction) return false;
		
		// Cerca il porto corrispondente
		const port = ports.find(p => 
			p.deadZones.some(dz => dz.x === x && dz.y === y) && 
			p.direction === cellData.direction
		);
		
		if (!port) return false;
		
		// Identifica la cella principale per ogni direzione
		// In base alla direzione, scegli la cella appropriata tra le deadzone
		if (cellData.direction === "nord") {
			// Per direzione nord, la cella principale è quella in alto a sinistra
			const targetCell = port.deadZones.find(dz => 
				dz.x === Math.min(...port.deadZones.map(z => z.x)) && 
				dz.y === Math.min(...port.deadZones.map(z => z.y))
			);
			return targetCell?.x === x && targetCell?.y === y;
		} 
		else if (cellData.direction === "sud") {
			// Per direzione sud, la cella principale è quella in basso a sinistra
			const targetCell = port.deadZones.find(dz => 
				dz.x === Math.min(...port.deadZones.map(z => z.x)) && 
				dz.y === Math.max(...port.deadZones.map(z => z.y))
			);
			return targetCell?.x === x && targetCell?.y === y;
		} 
		else if (cellData.direction === "est") {
			// Per direzione est, la cella principale è quella in alto a destra
			const targetCell = port.deadZones.find(dz => 
				dz.x === Math.max(...port.deadZones.map(z => z.x)) && 
				dz.y === Math.min(...port.deadZones.map(z => z.y))
			);
			return targetCell?.x === x && targetCell?.y === y;
		} 
		else if (cellData.direction === "ovest") {
			// Per direzione ovest, la cella principale è quella in alto a sinistra
			const targetCell = port.deadZones.find(dz => 
				dz.x === Math.min(...port.deadZones.map(z => z.x)) && 
				dz.y === Math.min(...port.deadZones.map(z => z.y))
			);
			return targetCell?.x === x && targetCell?.y === y;
		}
		
		return false;
	};

	const distance = calculateDistance(
		{ x: playerPosition.x, y: playerPosition.y },
		{ x, y },
	);

	const isMovementPossible = () => {
		// Non consentire il movimento nelle celle deadzone
		if (cellData?.isDeadZone) {
			return false;
		}
		
		// In a real implementation, check motionRange from player level
		// For now, use a simple distance check (assuming motion range of 3)
		return distance <= 3;
	};

	const handleCellClick = () => {
		// Se la mappa è in fase di trascinamento attivo o la nave è in movimento, non fare nulla
		if (isDragging || isShipMoving) return;
		
		if (isMovementPossible()) {
			movePlayer(x, y);
		}
	};

	// Accessibilità per i click handlers
	const handleKeyPress = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			handleCellClick();
		}
	};

	return (
		<div
			className={getCellClasses()}
			data-row={y}
			data-col={x}
			onClick={handleCellClick}
			onKeyDown={handleKeyPress}
			tabIndex={0}
			role="button"
			aria-label={`Cell at position ${x},${y}`}
			aria-disabled={isShipMoving}
		>
			{/* Se questa è la cella principale, mostra l'immagine espansa */}
			{isPrimaryDeadZoneCell() && cellData?.direction && (
				<div className={`Porto espanso ${cellData.direction}`}>
					<img src="/sprites/shore.png" alt="shore" />
				</div>
			)}
			
			{/* Mostra le immagini normali solo per celle che NON sono deadzone */}
			{cellData?.type === "Porto" && cellData.direction && !cellData.isDeadZone && (
				<div className={`Porto ${cellData.direction}`}>
					<img src="/sprites/shore.png" alt="shore" />
				</div>
			)}
		</div>
	);
};

export default MapCell;
