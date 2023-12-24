const gameEl = document.getElementById('game')
const ships = {}
// la larghezza di una cella
const cellWidth = 100

//variabili comuni a tutti i metodi per tracciare il mouse
let mouseX
let mouseY

//variabili per la playership
let playerX = 24 //senza dati iniziali il metodo setPlayerPosition si rompe. Non corrispondono all'effettiva posizione iniziale, aggiornare nel caso si aggiorni la posizione iniziale
let playerY = 26 //senza dati iniziali il metodo setPlayerPosition si rompe. Non corrispondono all'effettiva posizione iniziale, aggiornare nel caso si aggiorni la posizione iniziale
let playerDirection = "giu" //senza questi dati il metodo setPlayerPosition si rompe. Non corrispondono all'effettiva posizione iniziale, aggiornare nel caso si aggiorni la posizione iniziale
let playerGraphic = document.createElement("img")
playerGraphic.id = "playerGraphic"
const playerShip = document.createElement("div")
playerShip.style.height = "96px"
playerShip.style.width = "96px"
playerShip.id = "player"
playerShip.classList.add("barca")
playerShip.style.position = "absolute"
playerShip.style.transition = "top 0.5s, left 0.5s;"
playerShip.style.border = "1px solid green"
playerShip.appendChild(playerGraphic)
let playerShipSpeed = 40
////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////

const aggiornaPlayerDirectionGraphic = function () {
	playerShip.innerHTML = ``
	switch (playerDirection) {
		case "destra":
			playerGraphic.src = "../assets/sprites/Right_playership.png"
			playerGraphic.style.transform = "translate(-28%, -50%)";

			break;
		case "sinistra":
			playerGraphic.src = "../assets/sprites/Left_playership.png"
			playerGraphic.style.transform = "translate(-31%, -50%)";
			break;
		case "su":
			playerGraphic.src = "../assets/sprites/Up_playership.png"
			playerGraphic.style.transform = "translate(-30%, -61%)";
			break;
		case "giu":
			playerGraphic.src = "../assets/sprites/Down_playership.png"
			playerGraphic.style.transform = "translate(-30%, -61%)";
			break;
		default:
			console.log("Errore ridirezionamento")
			break;
	}
	playerShip.appendChild(playerGraphic)
}

aggiornaPlayerDirectionGraphic()

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Metodo per ottenere le caselle visibili a schermo. Solo gli 
//elementi grafici di questa cella vengono animati, gli altri vengono messi in hidden. Funzione da usare in futuro
const getVisibleCells = () => {
	const visibleCells = []
	const map = document.querySelector('.map')
	const cells = map.querySelectorAll('.cell')

	// Calcola i confini della finestra
	const viewportTop = window.scrollY
	const viewportLeft = window.scrollX
	const viewportBottom = viewportTop + window.innerHeight
	const viewportRight = viewportLeft + window.innerWidth

	cells.forEach(cell => {
		const cellRect = cell.getBoundingClientRect()
		const cellTop = cellRect.top + window.scrollY
		const cellLeft = cellRect.left + window.scrollX
		const cellBottom = cellTop + cellRect.height
		const cellRight = cellLeft + cellRect.width

		// Verifica se la cella è visibile all'interno della finestra
		if (
			cellTop < viewportBottom &&
			cellBottom > viewportTop &&
			cellLeft < viewportRight &&
			cellRight > viewportLeft
		) {
			visibleCells.push(cell)
		}
	})
	return visibleCells
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const templateDiFaiQualcosaConXeYdellaCella = function (i, j) {
	console.log(`Cell: X ${i}, Y ${j}`)
	// La i è la X, la j è la Y
}

const popUpSchermo = function (messaggio) {
	const divMessaggio = document.createElement('div')
	const pMessaggio = document.createElement('p')
	pMessaggio.textContent = messaggio
	const buttonClose = document.createElement('p')
	buttonClose.innerText = '[CHIUDI]'
	buttonClose.onclick = function () {
		divMessaggio.remove()
	}
	divMessaggio.appendChild(pMessaggio)
	divMessaggio.appendChild(buttonClose)

	divMessaggio.style.display = 'fixed'
	divMessaggio.style.top = '50%'
	divMessaggio.style.left = '50%'
	divMessaggio.transform = `translate(-50%, -50%)`

	document.getElementsByTagName("body")[0].appendChild(divMessaggio)
}

const popUpBaloon = function (cell) {
	const cella = document.createElement("div")
	cella.innerHTML = cell
	let i = cella.getAttribute(`data-row`)
	let j = cella.getAttribute(`data-col`)

	const removeBalloon = function () {
		balloon.remove()
	}

	const calcolaDistanza = function (x, y) {
		console.log(Math.sqrt(Math.pow(x - playerX, 2) + Math.pow(y - playerY, 2)))
		return Math.round(Math.sqrt(Math.pow(x - playerX, 2) + Math.pow(y - playerY, 2)))
	}

	const animaSpostaShipPlayer = function (x, y) {
		let durataAnimazione = 0.5 * calcolaDistanza(x, y)
		let animazioneShipPlayer = `<style id="animazioneUsaeGetta">
		@keyframes animazioneSpostaShipPlayer {
			0%, 100% { 
				transform: translate(0,0); 
			}
			99.99% {
				transform: translate(${(playerX - x) * 100}px,${(playerY - y) * 100}px); 
				}
		}</style>`
		console.log(animazioneShipPlayer)
		let stileUsaeGetta = document.createElement('style');
		stileUsaeGetta.innerHTML = ``
		stileUsaeGetta.id = "stileusaegetta"
		stileUsaeGetta.innerHTML = animazioneShipPlayer
		document.head.appendChild(stileUsaeGetta)

		playerGraphic.style.animation = ``;
		console.log(playerGraphic.style.animation)
		playerGraphic.style.animation = `animazioneSpostaShipPlayer ${durataAnimazione}s ease-in-out forwards`;
		console.log(playerGraphic.style.animation)
	}


	const movimentoPossibile = function (x, y) {
		if (playerShipSpeed >= calcolaDistanza(x, y)) {
			return true
		} else {
			return false
		}
	}

	const spostaPlayer = function (cella, x, y) {
		balloon.remove()
		if (movimentoPossibile(x, y)) {
			animaSpostaShipPlayer(x, y)
			setPlayerPosition(cella)

			setTimeout(function () {
			}, 0.5 * calcolaDistanza(x, y))
		}
	}
	if (document.getElementById('mouse-balloon')) {
		document.getElementById('mouse-balloon').remove()
	}

	// Creazione del balloon
	const balloon = document.createElement('div')
	balloon.id = 'mouse-balloon'
	balloon.style.position = 'fixed'
	balloon.style.left = `${mouseX - 60}px`
	balloon.style.top = `${mouseY - 60}px`
	balloon.style.padding = `20px`
	balloon.style.backgroundColor = 'black'
	balloon.style.color = 'White'
	balloon.style.borderColor = 'red'
	balloon.style.border = '3px'
	balloon.style.display = 'flex'
	balloon.style.flexDirection = 'column'
	balloon.style.maxWidth = '280px'
	const xIcon = document.createElement('div')
	xIcon.innerHTML = `<i class="far fa-times-circle" style="color: #cc0000;"></i>`
	xIcon.onclick = removeBalloon
	const headerBalloon = document.createElement('div')
	headerBalloon.style.display = 'flex'
	headerBalloon.style.justifyContent = 'space-between'
	const pHeader = document.createElement('p')
	pHeader.textContent = `[ info cellaX(${cella.getAttribute(`data-row`)})Y(${cella.getAttribute(`data-col`)}) ] --`
	headerBalloon.appendChild(pHeader)
	headerBalloon.appendChild(xIcon)

	const pMidBalloon = document.createElement("p")
	pMidBalloon.style.margin = "8px"
	pMidBalloon.innerText = `Distanza casella: [${calcolaDistanza(i, j)}]\nTipo: [Acqua] \n Movimento possibile [${movimentoPossibile(i, j)}]\n`

	const divFooter = document.createElement('div')
	const buttonMuoviti = document.createElement('p')
	buttonMuoviti.innerText = '[VAI QUI]'
	buttonMuoviti.onclick = function () {
		spostaPlayer(i, j)
	}
	divFooter.appendChild(buttonMuoviti)

	balloon.appendChild(headerBalloon)
	balloon.appendChild(pMidBalloon)
	balloon.appendChild(divFooter)
	document.body.appendChild(balloon)
	// Impostazione del timeout per rimuovere il balloon dopo 30 secondi
	setTimeout(function () {
		if (balloon) {
			balloon.remove()
		}
	}, 30000)
}

const spownShore = (cell, orientation) => {
	const shore = document.createElement('div')
	shore.classList.add('shore')
	shore.classList.add(orientation)
	shore.innerHTML = `<img src="../assets/sprites/shore.png" alt="shore">`
	cell.appendChild(shore)
}

const generateMap = (rows, cols) => {
	const map = document.createElement('div')
	map.classList.add('map')
	const halfWidth = Math.floor(cols / 2) - 1
	const halfHeight = Math.floor(cols / 2) - 1
	for (let i = 0; i < rows; i++) {
		const row = document.createElement('div')
		row.classList.add('row')

		for (let j = 0; j < cols; j++) {
			const cell = document.createElement('div')
			cell.classList.add('cell')
			cell.setAttribute('data-row', i)
			cell.setAttribute('data-col', j)

			if (i === 0 && j === halfWidth) {
				spownShore(cell, 'north')
			}
			if (i === rows - 1 && j === halfWidth) {
				spownShore(cell, 'south')
			}
			if (j === 0 && i === halfHeight) {
				spownShore(cell, 'west')
			}
			if (j === cols - 1 && i === halfHeight) {
				spownShore(cell, 'east')
			}

			// Aggiungi un listener di eventi con una funzione chiusura
			cell.addEventListener(
				'click',
				(function (event, i, j) {
					return function () {
						//templateDiFaiQualcosaConXeYdellaCella(i, j)
						popUpBaloon(cell)
					}
				})(i, j)
			)

			row.appendChild(cell)
		}
		map.appendChild(row)
	}
	gameEl.appendChild(map)
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getMapRelativeGaps = () => {
	const map = document.querySelector('.map')
	const offsets = map.getBoundingClientRect()

	const windowHeight = window.innerHeight
	const windowWidth = window.innerWidth
	return {
		top: offsets.top,
		left: offsets.left,
		bottom: windowHeight - offsets.bottom,
		right: windowWidth - offsets.right,
	}
}

const muoveMap = direction => {
	console.log(direction)

	const gaps = getMapRelativeGaps()
	const map = document.querySelector('.map')
	const transform = window.getComputedStyle(map).transform
	// Estrarre i valori di traslazione (x, y)
	const matrix = new DOMMatrixReadOnly(transform)
	let x = matrix.m41
	let y = matrix.m42

	// Salva la trasformazione isometrica come stringa
	const isometricTransform = 'rotateX(50deg) rotateZ(45deg)';

	// Aggiornare x o y in base alla direzione
	switch (direction) {
		case 'up':
			if (gaps.bottom + cellWidth < cellWidth) {
				y -= cellWidth
			}
			break
		case 'down':
			if (gaps.top + cellWidth < cellWidth) {
				y += cellWidth
			}
			break
		case 'left':
			if (gaps.right + cellWidth < cellWidth) {
				x -= cellWidth
			}
			break
		case 'right':
			if (gaps.left + cellWidth < cellWidth) {
				x += cellWidth
			}

			break
		default:
			console.log('Direzione non valida')
	}

	// Applicare il nuovo valore di traslazione
	map.style.transform = `${isometricTransform}, translate(${x}px, ${y}px)`;
}

document.addEventListener('keydown', e => {
	if (e.key === 'ArrowUp') {
		muoveMap('down')
	}
	if (e.key === 'ArrowDown') {
		muoveMap('up')
	}
	if (e.key === 'ArrowLeft') {
		muoveMap('right')
	}
	if (e.key === 'ArrowRight') {
		muoveMap('left')
	}
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const setPlayerPosition = function (cell) {
	let targetX = cell.getAttribute("data-row")
	let targetY = cell.getAttribute("data-col")
	if (!playerX || !playerY) {
		document.querySelector(`[data-row="${targetX}"][data-col="${targetY}"]`).appendChild(playerShip)

		document.getElementById('player').top = cellWidth
		document.getElementById('player').left = cellWidth

		playerX = targetX
		playerY = targetY
	} else {
		//document.getElementById('player').remove()
		document.querySelector(`[data-row="${targetX}"][data-col="${targetY}"]`).appendChild(playerShip)

		playerX = targetX
		playerY = targetY
	}
}

const getCellaInizialeSpawn = function (xIniziale, yIniziale) {
	let cella = document.querySelector(`div [data-row="${xIniziale}"][data-col="${yIniziale}"]`)
	console.log(cella.getAttribute("data-row"))
	return cella
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

generateMap(40, 40)

const cellaIniziale = getCellaInizialeSpawn(24, 26)

setPlayerPosition(cellaIniziale)
