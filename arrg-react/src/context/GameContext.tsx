import {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from "react";
import { MapCell, Port, Position, Resources } from "../types";
import { COL_COUNT, ROW_COUNT, TEMPLATE_RESOURCES } from "../config/gameConfig";
import { randomInt } from "../utils/gameUtils";

interface GameContextType {
	mapCells: MapCell[];
	ports: Port[];
	playerPosition: Position;
	playerResources: Resources;
	playerLevel: number;
	playerHp: number;
	playerMaxHp: number;
	isDragging: boolean;
	isShipMoving: boolean;
	setIsDragging: (isDragging: boolean) => void;
	setIsShipMoving: (isMoving: boolean) => void;
	movePlayer: (x: number, y: number) => void;
	updatePlayerResources: (resources: Partial<Resources>) => void;
	spawnPort: (
		x: number,
		y: number,
		direction: Port["direction"],
		ownedByPlayer: boolean,
	) => void;
	initGame: () => void;
	updatePlayerLevel: (level: number) => void;
	updatePlayerHp: (hp: number) => void;
	updatePlayerMaxHp: (maxHp: number) => void;
	placePlayerInFriendlyPort: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
	const context = useContext(GameContext);
	if (!context) {
		throw new Error("useGameContext must be used within a GameProvider");
	}
	return context;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
	const [mapCells, setMapCells] = useState<MapCell[]>([]);
	const [ports, setPorts] = useState<Port[]>([]);
	const [playerPosition, setPlayerPosition] = useState<Position>({
		x: 0,
		y: 0,
	});
	const [playerResources, setPlayerResources] = useState<Resources>({
		...TEMPLATE_RESOURCES,
	});
	const [playerLevel, setPlayerLevel] = useState(1);
	const [playerHp, setPlayerHp] = useState(100);
	const [playerMaxHp, setPlayerMaxHp] = useState(100);
	const [isDragging, setIsDragging] = useState(false);
	const [isShipMoving, setIsShipMoving] = useState(false);

	// Funzione per posizionare il giocatore in un porto amico
	const placePlayerInFriendlyPort = () => {
		const friendlyPort = ports.find((port) => port.owner === "player");
		if (friendlyPort && friendlyPort.interactionCells.length > 0) {
			// Prendiamo una cella di interazione in posizione centrale se possibile
			const cellIndex = Math.floor(friendlyPort.interactionCells.length / 2);
			const initialCell = friendlyPort.interactionCells[cellIndex];
			setPlayerPosition({ x: initialCell.x, y: initialCell.y });
			console.log("Nave spawnata nel porto amico alle coordinate:", initialCell);
		} else {
			console.warn("Nessun porto amico trovato per lo spawn della nave");
		}
	};

	const initGame = () => {
		// Initialize map
		const newMapCells: MapCell[] = [];
		for (let y = 0; y < ROW_COUNT; y++) {
			for (let x = 0; x < COL_COUNT; x++) {
				newMapCells.push({ x, y });
			}
		}
		setMapCells(newMapCells);

		// Creiamo un array temporaneo per i porti
		const newPorts: Port[] = [];
		
		// Spawn ports
		const halfWidth = Math.floor(COL_COUNT / 2) - 1;
		const halfHeight = Math.floor(ROW_COUNT / 2) - 1;
		const playerPortDirection = randomInt(4);

		// Assicuriamoci che ci sia sempre un porto amico
		const guaranteedPlayerPort = playerPortDirection === 4 ? 0 : playerPortDirection;
		
		const port1 = spawnPortInternal(halfWidth, 0, "nord", guaranteedPlayerPort === 0);
		const port2 = spawnPortInternal(COL_COUNT - 1, halfHeight, "est", guaranteedPlayerPort === 1);
		const port3 = spawnPortInternal(halfWidth, ROW_COUNT - 1, "sud", guaranteedPlayerPort === 2);
		const port4 = spawnPortInternal(0, halfHeight, "ovest", guaranteedPlayerPort === 3);
		
		newPorts.push(port1, port2, port3, port4);
		
		// Aggiorniamo lo stato con tutti i porti
		setPorts(newPorts);
		
		// Aggiorniamo le celle con le informazioni dei porti
		updateMapCellsWithPorts(newMapCells, newPorts);
		
		// Posiziona il giocatore in un porto amico dopo che i porti sono stati creati
		const friendlyPort = newPorts.find(port => port.owner === "player");
		if (friendlyPort && friendlyPort.interactionCells.length > 0) {
			const cellIndex = Math.floor(friendlyPort.interactionCells.length / 2);
			const initialCell = friendlyPort.interactionCells[cellIndex];
			setPlayerPosition({ x: initialCell.x, y: initialCell.y });
		}
	};

	// Crea un porto senza aggiornare lo stato per evitare problemi di sincronizzazione
	const spawnPortInternal = (
		x: number,
		y: number,
		direction: Port["direction"],
		ownedByPlayer: boolean,
	): Port => {
		const portObj: Port = {
			direction,
			owner: ownedByPlayer ? "player" : "bot",
			interactionCells: [],
			deadZones: [],
		};

		let minX = 0, maxX = 0, minY = 0, maxY = 0;
		let deadZones: Position[] = [];

		if (direction === "nord" || direction === "sud") {
			minX = x - 2;
			maxX = x + 1 + 2;
		}
		if (direction === "nord") {
			minY = 0;
			maxY = y + 1 + 2;
			deadZones = [
				{ x: x + 1, y: 0 },
				{ x, y: 1 },
				{ x: x + 1, y: 1 },
			];
		}
		if (direction === "sud") {
			minY = y - 1 - 2;
			maxY = y;
			deadZones = [
				{ x, y: y - 1 },
				{ x: x + 1, y: y - 1 },
				{ x: x + 1, y },
			];
		}

		if (direction === "est" || direction === "ovest") {
			minY = y - 2;
			maxY = y + 1 + 2;
		}

		if (direction === "ovest") {
			minX = 0;
			maxX = x + 1 + 2;
			deadZones = [
				{ x: 1, y },
				{ x, y: y + 1 },
				{ x: 1, y: y + 1 },
			];
		}
		if (direction === "est") {
			minX = x - 1 - 2;
			maxX = x;
			deadZones = [
				{ x: x - 1, y },
				{ x, y: y + 1 },
				{ x: x - 1, y: y + 1 },
			];
		}

		// Add port spawn coordinates
		deadZones.push({ x, y });
		portObj.deadZones = deadZones;

		// Mark cells as interactive
		const interactionCells: Position[] = [];
		for (
			let cy = Math.max(0, minY);
			cy <= Math.min(ROW_COUNT - 1, maxY);
			cy++
		) {
			for (
				let cx = Math.max(0, minX);
				cx <= Math.min(COL_COUNT - 1, maxX);
				cx++
			) {
				if (!deadZones.some((dz) => dz.x === cx && dz.y === cy)) {
					interactionCells.push({ x: cx, y: cy });
				}
			}
		}
		portObj.interactionCells = interactionCells;
		
		return portObj;
	};
	
	// Aggiorna le celle della mappa con le informazioni dei porti
	const updateMapCellsWithPorts = (mapCells: MapCell[], ports: Port[]) => {
		const updatedCells = mapCells.map(cell => {
			let updatedCell = { ...cell };
			
			for (const port of ports) {
				// Is cell a dead zone?
				const isDeadZone = port.deadZones.some(
					(dz) => dz.x === cell.x && dz.y === cell.y
				);

				// Is cell an interaction cell?
				const isInteraction = port.interactionCells.some(
					(ic) => ic.x === cell.x && ic.y === cell.y
				);

				// Update cell properties
				if (isDeadZone) {
					updatedCell = { 
						...updatedCell, 
						isDeadZone: true, 
						interactive: false,
						type: "Porto",
						direction: port.direction 
					};
				}

				if (isInteraction) {
					updatedCell = {
						...updatedCell,
						interactive: true,
						isMolo: true,
						isAmichevole: port.owner === "player",
						isNemico: port.owner === "bot",
					};
				}
			}
			
			return updatedCell;
		});
		
		setMapCells(updatedCells);
	};

	const spawnPort = (
		x: number,
		y: number,
		direction: Port["direction"],
		ownedByPlayer: boolean,
	) => {
		const newPort = spawnPortInternal(x, y, direction, ownedByPlayer);
		
		setPorts(prevPorts => {
			const newPorts = [...prevPorts, newPort];
			// Aggiorna le celle della mappa con tutti i porti
			updateMapCellsWithPorts(mapCells, newPorts);
			return newPorts;
		});
	};

	const movePlayer = (x: number, y: number) => {
		setPlayerPosition({ x, y });
	};

	const updatePlayerResources = (resources: Partial<Resources>) => {
		setPlayerResources((prev) => ({ ...prev, ...resources }));
	};

	const updatePlayerLevel = (level: number) => {
		setPlayerLevel(level);
	};

	const updatePlayerHp = (hp: number) => {
		setPlayerHp(hp);
	};

	const updatePlayerMaxHp = (maxHp: number) => {
		setPlayerMaxHp(maxHp);
	};

	useEffect(() => {
		initGame();
	}, []);

	return (
		<GameContext.Provider
			value={{
				mapCells,
				ports,
				playerPosition,
				playerResources,
				playerLevel,
				playerHp,
				playerMaxHp,
				isDragging,
				isShipMoving,
				setIsDragging,
				setIsShipMoving,
				movePlayer,
				updatePlayerResources,
				spawnPort,
				initGame,
				updatePlayerLevel,
				updatePlayerHp,
				updatePlayerMaxHp,
				placePlayerInFriendlyPort,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};
