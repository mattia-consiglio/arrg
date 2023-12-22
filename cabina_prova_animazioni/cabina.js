let playerX = 2400
let playerY = 2600

const playerShip = document.getElementById("barca5")

const calcolaDistanza = function (targetX, targetY) {
    return Math.round(Math.sqrt(Math.pow(targetX - playerX, 2) + Math.pow(targetY - playerY, 2)))
}

const animaSpostaShipPlayer = function (x, y) {
    let durataAnimazione = 0.5 * calcolaDistanza(x, y)
    let animazioneShipPlayer = `
    @keyframes animazioneSpostaShipPlayer {
        0%, 100% { 
            transform: translate(0,0); 
        }
        99.99% {
            transform: translate(${playerX - x}px,${playerY - y}px); 
            }
    }`
    playerShip.style.animation = `animazioneSpostaShipPlayer ${durataAnimazione} ease-in-out forwards`;

    let stileUsaeGetta = document.createElement('style');
    stileUsaeGetta.innerHTML = ``
    stileUsaeGetta.id = "stileusaegetta"
    stileUsaeGetta.innerHTML = animazioneShipPlayer
    console.log(stileUsaeGetta)
    document.head.appendChild(stileUsaeGetta)

    // Rimozione dell'animazione e dello stile una volta terminata
    playerShip.addEventListener('animationend', function () {
        console.log(stileUsaeGetta)

        playerShip.style.animation = ''
        if (document.getElementById("stileusaegetta")) {
            document.getElementById("stileusaegetta").remove()
        }
    })
}


animaSpostaShipPlayer(2800, 3200)