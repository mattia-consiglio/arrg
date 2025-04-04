import { useGameContext } from "../context/GameContext";
import "../styles/HpBar.css";

const HpBar: React.FC = () => {
  const { playerHp, playerMaxHp, playerLevel } = useGameContext();
  
  // Calcola la percentuale di HP rimasta
  const hpPercentage = (playerHp / playerMaxHp) * 100;
  
  // Determina il colore della barra HP in base alla percentuale
  const getHpBarColor = () => {
    if (hpPercentage > 60) return "#27ae60"; // Verde
    if (hpPercentage > 30) return "#f39c12"; // Giallo
    return "#e74c3c"; // Rosso
  };

  return (
    <div className="hp-bar-container">
      <div className="hp-bar-shield">
        <i className="fas fa-shield-alt"></i>
      </div>
      <div className="hp-bar-wrapper">
        <div className="hp-bar-level">LV{playerLevel}</div>
        <div className="hp-bar-background">
          <div 
            className="hp-bar-fill" 
            style={{ 
              width: `${hpPercentage}%`,
              backgroundColor: getHpBarColor()
            }}
          />
          <div className="hp-bar-text">
            {playerHp} / {playerMaxHp}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HpBar; 