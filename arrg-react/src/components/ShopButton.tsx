import { useState, useEffect } from "react";
import { useGameContext } from "../context/GameContext";
import "../styles/ShopButton.css";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "water" | "food" | "rhum" | "repair";
  img: string;
}

const shopItems: ShopItem[] = [
  {
    id: "water",
    name: "Acqua",
    description: "Riempi la tua riserva d'acqua",
    price: 10,
    type: "water",
    img: "/sprites/Water_icon.png"
  },
  {
    id: "food",
    name: "Cibo",
    description: "Rifornisci la cambusa",
    price: 15,
    type: "food",
    img: "/sprites/Fish_icon.png"
  },
  {
    id: "rhum",
    name: "Rhum",
    description: "Alza il morale dell'equipaggio",
    price: 20,
    type: "rhum",
    img: "/sprites/Rhum_icon.png"
  },
  {
    id: "repair",
    name: "Riparazioni",
    description: "Ripara la tua nave",
    price: 30,
    type: "repair",
    img: "/sprites/Repair_icon.png"
  }
];

const ShopButton: React.FC = () => {
  const { playerPosition, mapCells, playerResources, updatePlayerResources, playerHp, playerMaxHp, updatePlayerHp } = useGameContext();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string, isError: boolean } | null>(null);

  // Controlla se il giocatore è in un porto amico
  const isInFriendlyPort = () => {
    const currentCell = mapCells.find(
      cell => cell.x === playerPosition.x && cell.y === playerPosition.y
    );
    
    return currentCell?.isMolo && currentCell?.isAmichevole;
  };

  const openShop = () => {
    setIsShopOpen(true);
  };

  const closeShop = () => {
    setIsShopOpen(false);
    setNotification(null);
  };

  const handleBuyItem = (item: ShopItem) => {
    // Controlla se il giocatore ha abbastanza oro
    if (playerResources.gold < item.price) {
      setNotification({
        message: "Non hai abbastanza oro!",
        isError: true
      });
      return;
    }

    // Variabili da utilizzare nei case
    let newHp: number;

    // Aggiorna le risorse in base all'oggetto acquistato
    switch (item.type) {
      case "water":
        updatePlayerResources({
          gold: playerResources.gold - item.price,
          water: playerResources.water + 30
        });
        break;
      case "food":
        updatePlayerResources({
          gold: playerResources.gold - item.price,
          food: playerResources.food + 25
        });
        break;
      case "rhum":
        updatePlayerResources({
          gold: playerResources.gold - item.price,
          rhum: playerResources.rhum + 20
        });
        break;
      case "repair":
        // Riparazione della nave (ripristina HP)
        if (playerHp >= playerMaxHp) {
          setNotification({
            message: "La tua nave è già in perfette condizioni!",
            isError: true
          });
          return;
        }
        
        newHp = Math.min(playerHp + 50, playerMaxHp);
        updatePlayerHp(newHp);
        updatePlayerResources({
          gold: playerResources.gold - item.price
        });
        break;
    }

    setNotification({
      message: `Hai acquistato ${item.name}!`,
      isError: false
    });
  };

  // Rimuovi la notifica dopo 3 secondi
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Mostra il bottone solo se il giocatore è in un porto amico
  if (!isInFriendlyPort()) {
    return null;
  }

  return (
    <>
      <div className="shop-button" onClick={openShop}>
        <i className="fas fa-shopping-cart"></i>
        <span>Shop</span>
      </div>

      {isShopOpen && (
        <div className="shop-modal">
          <div className="shop-modal-content">
            <div className="shop-header">
              <h2>Porto Amico - Shop</h2>
              <div className="player-gold">
                <i className="fas fa-coins" style={{ color: "gold", marginRight: "5px" }}></i>
                <span>{playerResources.gold} oro</span>
              </div>
              <button className="close-button" onClick={closeShop}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {notification && (
              <div className={`shop-notification ${notification.isError ? 'error' : 'success'}`}>
                {notification.message}
              </div>
            )}
            
            <div className="shop-items">
              {shopItems.map((item) => (
                <div className="shop-item" key={item.id}>
                  <img src={item.img} alt={item.name} />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <button 
                      onClick={() => handleBuyItem(item)}
                      disabled={playerResources.gold < item.price}
                      className={playerResources.gold < item.price ? "disabled" : ""}
                    >
                      Compra ({item.price} oro)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopButton; 