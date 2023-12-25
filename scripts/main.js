import {
	shipsTemplate,
	shipsArray,
	morningRounds,
	nightRounds,
	dayRounds,
	maxRoundsWithoutWater,
	maxRoundsWithoutFood,
	hpRapairOnPlaceRate,
	shipMotionBaseTime,
} from './shipsModule.js'

const gameEl = document.getElementById('game')
const ships = {}
// la larghezza di una cella
const cellWidth = 100

//variabili comuni a tutti i metodi per tracciare il mouse
let mouseX
let mouseY

//variabili per la playership
let playerX
let playerY
let playerDirection = 'sinistra' //senza questi dati il metodo setPlayerPosition si rompe. Non corrispondono all'effettiva posizione iniziale, aggiornare nel caso si aggiorni la posizione iniziale
let playerGraphic = document.createElement('img')
playerGraphic.id = 'playerGraphic'
const playerShip = document.createElement('div')
playerShip.id = 'player'
playerShip.classList.add('barca')
playerShip.appendChild(playerGraphic)
let playerShipSpeed = 3
////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('mousemove', function (event) {
	mouseX = event.clientX
	mouseY = event.clientY
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////

const updatePlayerDirectionGraphic = function (direzione) {
	console.log("Prova")
	switch (direzione) {
		case "destra":
			playerGraphic.src = "../assets/sprites/Right_playership.png"
			playerGraphic.style.transform = "translate(-62px, -130px)";

			break;
		case "sinistra":
			playerGraphic.src = "../assets/sprites/Left_playership.png"
			playerGraphic.style.transform = "translate(-70px, -130px)";
			break;
		case "su":
			playerGraphic.src = "../assets/sprites/Up_playership.png"
			playerGraphic.style.transform = "translate(-66px, -150px)";
			break;
		case "giu":
			playerGraphic.src = "../assets/sprites/Down_playership.png"
			playerGraphic.style.transform = "translate(-65px, -150px)"
			break;
		default:
			console.log('Errore ridirezionamento')
			break
	}
	playerShip.appendChild(playerGraphic)
}
updatePlayerDirectionGraphic(playerDirection)


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
const templateDoSomethingWithXandYofCell = function (x, y) {
	console.log(`Cell: X ${x}, Y ${y}`)
	// La i è la X, la j è la Y
}

const popUpScreen = function (messagge) {
	const divMessaggio = document.createElement('div')
	const pMessaggio = document.createElement('p')
	pMessaggio.textContent = messagge
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

	document.getElementsByTagName('body')[0].appendChild(divMessaggio)
}

const popUpBaloon = function (cell) {
	let cella = document.createElement('div')
	cella = cell
	let i = cella.getAttribute(`data-row`)
	let j = cella.getAttribute(`data-col`)

	const removeBalloon = function () {
		balloon.remove()
	}

	const calculateDistance = function (x, y) {
		return parseInt(Math.sqrt(Math.pow(x - playerX, 2) + Math.pow(y - playerY, 2)))
	}

	const animateMouveShipPlayer = function (destinationCell) {
		const player = document.getElementById('player')
		let currentPlayerX = playerShip.parentElement.offsetTop
		let currentPlayerY = playerShip.parentElement.offsetLeft
		let xDestinazione = destinationCell.offsetTop
		let yDestinazione = destinationCell.offsetLeft
		console.log(xDestinazione - currentPlayerX)
		console.log(yDestinazione - currentPlayerY)
		let durataAnimazione = 0.5 * calculateDistance(xDestinazione, yDestinazione)

		if (Math.abs(xDestinazione - currentPlayerX) > Math.abs(yDestinazione - currentPlayerY)) {
			if (xDestinazione - currentPlayerX > 0) {
				playerDirection = "giu"
			}
			if (xDestinazione - currentPlayerX < 0) {
				playerDirection = "su"
			}
		} else {
			if (yDestinazione - currentPlayerY > 0) {
				playerDirection = "destra"
			} else {
				playerDirection = "sinistra"
			}
		}
		updatePlayerDirectionGraphic(playerDirection)

		let translAnimation = [
			{ transform: `translate( ${yDestinazione - currentPlayerY}px, ${xDestinazione - currentPlayerX}px)` }
		]

		let animOp = {
			duration: durataAnimazione,
			fill: 'forwards'
		}

		let animOp2 = {
			duration: 0,
			fill: 'forwards'
		}

		let animationObj = playerShip.animate(translAnimation, animOp)
		setTimeout(() => {
			setPlayerPosition(destinationCell)
			let animationObj2 = playerShip.animate({ transform: `translate(0px,0px)` }, animOp2)

		}, durataAnimazione);


	}

	const mouvementPossible = function (x, y) {
		if (playerShipSpeed >= calculateDistance(x, y)) {
			return true
		} else {
			return false
		}
	}

	const mouvePlayer = function (cell, x, y) {
		balloon.remove()
		if (mouvementPossible(x, y)) {

			animateMouveShipPlayer(cella)
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
	pHeader.textContent = `[ info cellaX(${i})Y(${j}) ] --`
	headerBalloon.appendChild(pHeader)
	headerBalloon.appendChild(xIcon)

	const pMidBalloon = document.createElement('p')
	pMidBalloon.style.margin = '8px'
	pMidBalloon.innerText = `Distanza casella: [${calculateDistance(
		i,
		j
	)}]\nTipo: [Acqua] \n Movimento possibile [${mouvementPossible(i, j)}]\n`

	const divFooter = document.createElement('div')
	const buttonMuoviti = document.createElement('p')
	buttonMuoviti.innerText = '[VAI QUI]'
	buttonMuoviti.onclick = function () {
		mouvePlayer(cella, i, j)
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

const spownPort = (cell, orientation) => {
	const port = document.createElement('div')
	port.classList.add('port')
	port.classList.add(orientation)
	port.innerHTML = `<img src="../assets/sprites/shore.png" alt="shore">`
	cell.appendChild(port)
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
				spownPort(cell, 'north')
			}
			if (i === rows - 1 && j === halfWidth) {
				spownPort(cell, 'south')
			}
			if (j === 0 && i === halfHeight) {
				spownPort(cell, 'west')
			}
			if (j === cols - 1 && i === halfHeight) {
				spownPort(cell, 'east')
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

const mouveMap = direction => {
	const gaps = getMapRelativeGaps()
	const map = document.querySelector('.map')
	const transform = window.getComputedStyle(map).transform
	// Estrarre i valori di traslazione (x, y)
	const matrix = new DOMMatrixReadOnly(transform)
	let x = matrix.m41
	let y = matrix.m42

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
	map.style.transform = `translate(${x}px, ${y}px)`
}

document.addEventListener('keydown', e => {
	if (e.key === 'ArrowUp') {
		mouveMap('down')
	}
	if (e.key === 'ArrowDown') {
		mouveMap('up')
	}
	if (e.key === 'ArrowLeft') {
		mouveMap('right')
	}
	if (e.key === 'ArrowRight') {
		mouveMap('left')
	}
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const setPlayerPosition = function (cell) {
	let targetX = cell.getAttribute('data-row')
	let targetY = cell.getAttribute('data-col')

	playerShip.style.animation = "none"

	if (!document.getElementById('player')) {
		document.querySelector(`[data-row="${targetX}"][data-col="${targetY}"]`).appendChild(playerShip)

		document.getElementById('player').top = cellWidth
		document.getElementById('player').left = cellWidth

		playerX = targetX
		playerY = targetY
	} else {
		document.getElementById('player').remove()
		document.querySelector(`[data-row="${targetX}"][data-col="${targetY}"]`).appendChild(playerShip)

		playerX = targetX
		playerY = targetY
	}

}

const getinitalSpawnCell = function (xInitial, yInitial) {
	let cell = document.querySelector(`div [data-row="${xInitial}"][data-col="${yInitial}"]`)
	return cell
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//inizilizza il gioco

generateMap(40, 40)

document.getElementById('up').onclick = () => mouveMap('down')
document.getElementById('down').onclick = () => mouveMap('up')
document.getElementById('left').onclick = () => mouveMap('right')
document.getElementById('right').onclick = () => mouveMap('left')

const InitialCell = getinitalSpawnCell(24, 26)

setPlayerPosition(InitialCell)
