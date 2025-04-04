import { useEffect, useRef, useState } from "react";
import { useGameContext } from "../context/GameContext";
import { CELL_WIDTH, COL_COUNT, ROW_COUNT } from "../config/gameConfig";
import { isTouchDevice } from "../utils/gameUtils";
import MapCell from "./MapCell";
import Ship from "./Ship";
import "../styles/Map.css";

const GameMap = () => {
	const { isDragging, setIsDragging, playerPosition, enemyShips } = useGameContext();
	const mapRef = useRef<HTMLDivElement>(null);
	const [mapTransform, setMapTransform] = useState({ x: 0, y: 0 });
	const [dragState, setDragState] = useState({
		initialMouseX: 0,
		initialMouseY: 0,
		initialX: 0,
		initialY: 0,
	});
	// Tracciamo se c'è stato un vero movimento durante il trascinamento
	const [hasActuallyMoved, setHasActuallyMoved] = useState(false);

	// Map boundaries
	const maxMapX = CELL_WIDTH;
	const maxMapY = CELL_WIDTH * 2;
	const minMapX = Math.min(
		CELL_WIDTH / 2,
		window.innerWidth - ROW_COUNT * CELL_WIDTH - CELL_WIDTH / 2,
	);
	const minMapY = Math.min(
		CELL_WIDTH / 2,
		window.innerHeight - COL_COUNT * CELL_WIDTH - CELL_WIDTH / 2,
	);

	// Center view on player
	useEffect(() => {
		if (playerPosition.x !== 0 || playerPosition.y !== 0) {
			moveViewportOverPlayer();
		}
	}, [playerPosition]);

	const moveViewportOverPlayer = () => {
		const transX = Math.min(
			maxMapX,
			Math.max(
				-(playerPosition.x * CELL_WIDTH - window.innerWidth / 2),
				minMapX,
			),
		);
		const transY = Math.min(
			maxMapY,
			Math.max(
				-(playerPosition.y * CELL_WIDTH - window.innerHeight / 2),
				minMapY,
			),
		);

		setMapTransform({ x: transX, y: transY });
	};

	const moveMap = (direction: "up" | "down" | "left" | "right") => {
		let { x, y } = mapTransform;

		switch (direction) {
			case "up":
				y -= CELL_WIDTH;
				break;
			case "down":
				y += CELL_WIDTH;
				break;
			case "left":
				x -= CELL_WIDTH;
				break;
			case "right":
				x += CELL_WIDTH;
				break;
		}

		x = Math.min(maxMapX, Math.max(x, minMapX));
		y = Math.min(maxMapY, Math.max(y, minMapY));

		setMapTransform({ x, y });
	};

	const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
		setIsDragging(true);
		setHasActuallyMoved(false);

		let clientX: number, clientY: number;

		if ("touches" in e) {
			if (e.touches.length > 0) {
				clientX = e.touches[0].clientX;
				clientY = e.touches[0].clientY;
			} else {
				return;
			}
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		setDragState({
			initialMouseX: clientX,
			initialMouseY: clientY,
			initialX: mapTransform.x,
			initialY: mapTransform.y,
		});
	};

	const onDrag = (e: MouseEvent | TouchEvent) => {
		if (!isDragging) return;

		let clientX: number, clientY: number;

		if ("touches" in e) {
			if (e.touches.length > 0) {
				clientX = e.touches[0].clientX;
				clientY = e.touches[0].clientY;
			} else {
				return;
			}
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		const deltaX = clientX - dragState.initialMouseX;
		const deltaY = clientY - dragState.initialMouseY;
		
		// Considera il movimento effettivo solo se il delta è significativo
		if (Math.abs(deltaX) >
		 5 || Math.abs(deltaY) > 5) {
			setHasActuallyMoved(true);
		}

		const finalX = Math.min(
			maxMapX,
			Math.max(dragState.initialX + deltaX, minMapX),
		);
		const finalY = Math.min(
			maxMapY,
			Math.max(dragState.initialY + deltaY, minMapY),
		);

		setMapTransform({ x: finalX, y: finalY });
	};

	const endDrag = () => {
		if (!hasActuallyMoved) {
			// Se non c'è stato movimento effettivo, resetta subito isDragging per permettere il click
			setIsDragging(false);
		} else {
			// Altrimenti usa il timeout per evitare click accidentali dopo il trascinamento
			setTimeout(() => {
				setIsDragging(false);
			}, 10);
		}
	};

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => onDrag(e);
		const handleTouchMove = (e: TouchEvent) => onDrag(e);
		const handleMouseUp = () => endDrag();
		const handleTouchEnd = () => endDrag();

		if (isDragging) {
			window.addEventListener("mousemove", handleMouseMove);
			window.addEventListener("mouseup", handleMouseUp);

			if (isTouchDevice()) {
				window.addEventListener("touchmove", handleTouchMove);
				window.addEventListener("touchend", handleTouchEnd);
			}
		}

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);

			if (isTouchDevice()) {
				window.removeEventListener("touchmove", handleTouchMove);
				window.removeEventListener("touchend", handleTouchEnd);
			}
		};
	}, [isDragging, dragState]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowUp" || e.key === "w") {
				moveMap("down");
			}
			if (e.key === "ArrowDown" || e.key === "s") {
				moveMap("up");
			}
			if (e.key === "ArrowLeft" || e.key === "a") {
				moveMap("right");
			}
			if (e.key === "ArrowRight" || e.key === "d") {
				moveMap("left");
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [mapTransform]);

	// Handler per i controlli di movimento
	const handleControlKeyDown = (direction: "up" | "down" | "left" | "right") => (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			moveMap(direction);
		}
	};

	return (
		<div id="game" className="game-container">
			<div
				className="map"
				ref={mapRef}
				style={{
					transform: `translate(${mapTransform.x}px, ${mapTransform.y}px)`,
					transition: isDragging ? "none" : "200ms",
				}}
				onMouseDown={startDrag}
				onTouchStart={startDrag}
			>
				{Array.from({ length: ROW_COUNT }).map((_, rowIndex) => (
					<div key={`row-${rowIndex}`} className="row">
						{Array.from({ length: COL_COUNT }).map((_, colIndex) => (
							<MapCell
								key={`cell-${rowIndex}-${colIndex}`}
								x={colIndex}
								y={rowIndex}
							/>
						))}
					</div>
				))}

				<Ship type="player" x={playerPosition.x} y={playerPosition.y} />
				
				{enemyShips.map((ship) => (
					<Ship 
						key={`enemy-ship-${ship.id}`}
						type="bot"
						x={ship.position.x}
						y={ship.position.y}
						level={ship.level}
						hp={ship.hp}
						maxHp={ship.maxHp}
					/>
				))}
			</div>

			<div id="controls">
				<div 
					id="up" 
					onClick={() => moveMap("down")}
					onKeyDown={handleControlKeyDown("down")}
					tabIndex={0}
					role="button"
					aria-label="Move up"
				>
					<i className="fas fa-chevron-up" />
				</div>
				<div 
					id="down" 
					onClick={() => moveMap("up")}
					onKeyDown={handleControlKeyDown("up")}
					tabIndex={0}
					role="button"
					aria-label="Move down"
				>
					<i className="fas fa-chevron-down" />
				</div>
				<div 
					id="left" 
					onClick={() => moveMap("right")}
					onKeyDown={handleControlKeyDown("right")}
					tabIndex={0}
					role="button"
					aria-label="Move left"
				>
					<i className="fas fa-chevron-left" />
				</div>
				<div 
					id="right" 
					onClick={() => moveMap("left")}
					onKeyDown={handleControlKeyDown("left")}
					tabIndex={0}
					role="button"
					aria-label="Move right"
				>
					<i className="fas fa-chevron-right" />
				</div>
			</div>
		</div>
	);
};

export default GameMap;
