import { useEffect, useState } from "react";
import "../styles/DayCycle.css";

const DayCycle: React.FC = () => {
	const [dayPercentage, setDayPercentage] = useState(-45);

	useEffect(() => {
		// Durata totale di un ciclo completo da -45 a +45
		const cycleDuration = 300000; // 5 minuti per completare un ciclo
		
		const startTime = Date.now();
		
		const updateDayTime = () => {
			const currentTime = Date.now();
			const elapsedMs = (currentTime - startTime) % cycleDuration;
			
			// Calcolo della percentuale da -45 a +45
			// Una volta raggiunto +45, si salta a -45
			const percentage = -45 + (elapsedMs / cycleDuration) * 90;
			
			// Usiamo il modulo per assicurarci che il valore resti nell'intervallo desiderato
			// Se percentage > 45, riporta il valore a -45 + la parte eccedente
			const normalizedPercentage = percentage > 45 
				? -45 + (percentage - 45) % 90 
				: percentage;
				
			setDayPercentage(normalizedPercentage);
		};

		// Aggiorna immediatamente
		updateDayTime();

		// Aggiorna ogni secondo
		const interval = setInterval(updateDayTime, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="daycicle">
			<div id="semicicle">
				<div
					className="imgwrap"
					style={{ "--perc": dayPercentage } as React.CSSProperties}
				>
					<img src={dayPercentage < 0 ? "/sprites/Sun.png" : "/sprites/Moon.png"} alt={dayPercentage < 0 ? "sun" : "moon"} />
				</div>
			</div>
		</div>
	);
};

export default DayCycle;
