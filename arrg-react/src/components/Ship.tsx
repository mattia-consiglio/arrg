import { useEffect, useState } from "react";
import type { ShipType } from "../types";
import { useGameContext } from "../context/GameContext";
import { SHIPS_TEMPLATE } from "../config/gameConfig";
import "../styles/Ship.css";

interface ShipProps {
	type: ShipType;
	x: number;
	y: number;
	level?: number;
	hp?: number;
	maxHp?: number;
}

type ShipDirection = "left" | "right" | "up" | "down";

const Ship: React.FC<ShipProps> = ({ type, x, y, level = 1, hp, maxHp }) => {
	const { playerLevel, playerHp, setIsShipMoving } = useGameContext();
	const [prevPosition, setPrevPosition] = useState({ x, y });
	const [animating, setAnimating] = useState(false);
	
	// Per l'animazione di transizione
	const [displayPosition, setDisplayPosition] = useState({ x, y });
	
	// Per ora iniziamo con direzione fissa, ma poi calcola in base al movimento
	const [direction, setDirection] = useState<ShipDirection>("left");
	const [inMotion, setInMotion] = useState(false);

	// Get actual level, hp and maxHp based on ship type
	const actualLevel = type === "player" ? playerLevel : level;
	const actualHp = type === "player" ? playerHp : hp ?? 100;
	const shipTemplate = SHIPS_TEMPLATE.find(
		(ship) => ship.level === actualLevel,
	);
	const actualMaxHp =
		type === "player" ? shipTemplate?.maxHp ?? 100 : maxHp ?? 100;

	// Calculate HP percentage for the HP bar
	const hpPercentage = (actualHp / actualMaxHp) * 100;

	// Determine HP bar color
	const getHpBarClass = () => {
		if (hpPercentage > 50) return "green";
		if (hpPercentage > 20) return "yellow";
		return "red";
	};

	// Get the correct sprite based on direction
	const getSprite = () => {
		if (!shipTemplate) return "";

		const sprites = shipTemplate.sprites[type];

		switch (direction) {
			case "left":
				return sprites[0];
			case "right":
				return sprites[1];
			case "up":
				return sprites[2];
			case "down":
				return sprites[3];
			default:
				return sprites[0];
		}
	};

	// Determina la direzione in base al movimento
	useEffect(() => {
		if (x !== prevPosition.x || y !== prevPosition.y) {
			// Avvia immediatamente lo stato di movimento
			setIsShipMoving(true);
			setAnimating(true);
			setInMotion(true);
			
			// Determina la direzione in base a dove sta andando la nave
			if (x > prevPosition.x) {
				setDirection("right");
			} else if (x < prevPosition.x) {
				setDirection("left");
			} else if (y > prevPosition.y) {
				setDirection("down");
			} else if (y < prevPosition.y) {
				setDirection("up");
			}

			// Animazione di movimento tra celle - ridotta durata per maggiore reattività
			const animationDuration = 300; // ms - ridotto da 500ms per maggiore reattività
			const steps = 15; // ridotto da 20 per maggiore performance
			const interval = animationDuration / steps;
			
			// Avvio immediato dell'animazione con primo frame
			setDisplayPosition({
				x: prevPosition.x + (x - prevPosition.x) * 0.1, // avvio immediato con 10% di movimento
				y: prevPosition.y + (y - prevPosition.y) * 0.1
			});
			
			let step = 1; // iniziamo da 1 perché abbiamo già fatto il primo step
			const animate = setInterval(() => {
				step++;
				const progress = step / steps;
				
				// Animazione con piccolo effetto ease-out per rallentare alla fine
				const easeOutProgress = 1 - Math.pow(1 - progress, 2);
				
				setDisplayPosition({
					x: prevPosition.x + (x - prevPosition.x) * easeOutProgress,
					y: prevPosition.y + (y - prevPosition.y) * easeOutProgress
				});
				
				if (step >= steps) {
					clearInterval(animate);
					// Assicuriamoci che la posizione finale sia esattamente quella desiderata
					setDisplayPosition({ x, y });
					setAnimating(false);
					setPrevPosition({ x, y });
					// Dopo che il movimento è terminato, riabilita l'interazione
					setTimeout(() => {
						setIsShipMoving(false);
					}, 50); // piccolo ritardo per assicurarsi che l'UI sia aggiornata
				}
			}, interval);
			
			// Dopo che il movimento è completo, mantieni l'effetto di oscillazione per un po'
			const timer = setTimeout(() => {
				setInMotion(false);
			}, animationDuration + 100);

			return () => {
				clearInterval(animate);
				clearTimeout(timer);
				// Assicurati che isShipMoving sia impostato a false se il componente viene smontato
				setIsShipMoving(false);
			};
		}
	}, [x, y, prevPosition, setIsShipMoving]);

	// Al primo render, inizializza la posizione precedente
	useEffect(() => {
		setPrevPosition({ x, y });
		setDisplayPosition({ x, y });
	}, []);

	return (
		<div
			className={`ship ${type} ${animating ? "moving" : ""}`}
			style={{
				left: `${displayPosition.x * 100}px`,
				top: `${displayPosition.y * 100}px`,
				animation: inMotion ? "ship-motion 0.6s" : "none", // durata ridotta per maggiore reattività
				transition: "none"
			}}
		>
			<h2 className="level-text">{`LVL ${actualLevel}`}</h2>

			<div
				className={`hpBar ${getHpBarClass()}`}
				style={{ "--hp": `${hpPercentage}%` } as React.CSSProperties}
			/>

			<img className="shipImg" src={getSprite()} alt={`${type} ship`} />
		</div>
	);
};

export default Ship;
