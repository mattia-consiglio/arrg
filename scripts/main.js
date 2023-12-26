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
import { Ship } from './ShipClass.js'
import { setFriendlyShoreCell, shopMenu, listenerOpenShopMenu } from './shopModule.js'

const gameEl = document.getElementById('game')
// la larghezza di una cella
export const cellWidth = 100

//variabili comuni a tutti i metodi per tracciare il mouse
let mouseX
let mouseY

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

const ports = []

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
	let x = cella.getAttribute(`data-row`)
	let y = cella.getAttribute(`data-col`)
	const balloon = document.createElement('div')

	const removeBalloon = function () {
		balloon.remove()
	}

	const defineCellType = function (analyzedCell) {
		const contenutoCella = analyzedCell.children
		let classeContenutoCella
		if (contenutoCella.length > 0) {
			classeContenutoCella = contenutoCella[0].className
			return classeContenutoCella
		} else {
			if (analyzedCell.classList.length > 1) {
				return analyzedCell.classList[1] + " " + analyzedCell.classList[2]
			} else {
				return "Acqua"
			}
		}
	}

	if (document.getElementById('mouse-balloon')) {
		document.getElementById('mouse-balloon').remove()
	}

	// Creazione del balloon
	balloon.id = 'mouse-balloon'
	balloon.style.left = `${mouseX - 60}px`
	balloon.style.top = `${mouseY - 60}px`
	const xIcon = document.createElement('div')
	xIcon.innerHTML = `<i class="far fa-times-circle" style="color: #cc0000;"></i>`
	xIcon.onclick = removeBalloon
	const headerBalloon = document.createElement('div')
	headerBalloon.classList.add('balloon-header')
	const pHeader = document.createElement('p')
	pHeader.textContent = `[ info cellaX(${x})Y(${y}) ] --`
	headerBalloon.appendChild(pHeader)
	headerBalloon.appendChild(xIcon)

	const pMidBalloon = document.createElement('p')
	pMidBalloon.style.margin = '8px'
	pMidBalloon.innerText = `Distanza casella: [${player.calculateDistance(
		x,
		y
	)}]\nTipo: [Acqua] \n Movimento possibile [${player.mouvementPossible(x, y)}]\n`

	const divFooter = document.createElement('div')
	const buttonMuoviti = document.createElement('p')
	buttonMuoviti.innerText = '[VAI QUI]'
	buttonMuoviti.onclick = function () {
		player.mouveShip(cell, x, y, balloon)
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

const spawnPort = (cell, orientation) => {
	const port = document.createElement('div')
	port.classList.add('Porto')
	port.classList.add(orientation)
	port.innerHTML = `<img src="../assets/sprites/shore.png" alt="shore">`
	cell.appendChild(port)
}

const generateMap = (rows, cols) => {
	const map = document.createElement('div')
	map.classList.add('map')
	const halfWidth = Math.floor(cols / 2) - 1
	const halfHeight = Math.floor(cols / 2) - 1
	let portoNemicoCasuale
	for (let i = 0; i < rows; i++) {
		const row = document.createElement('div')
		row.classList.add('row')

		for (let j = 0; j < cols; j++) {
			const cell = document.createElement('div')
			cell.classList.add('cell')
			cell.setAttribute('data-row', i)
			cell.setAttribute('data-col', j)

			if (i === 0 && j === halfWidth) {
				spawnPort(cell, 'nord')
			}
			if (i === rows - 1 && j === halfWidth) {
				spawnPort(cell, 'sud')
			}
			if (j === 0 && i === halfHeight) {
				spawnPort(cell, 'ovest')
			}
			if (j === cols - 1 && i === halfHeight) {
				spawnPort(cell, 'est')
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

//inizilizza il gioco

generateMap(40, 40)

document.getElementById('up').onclick = () => mouveMap('down')
document.getElementById('down').onclick = () => mouveMap('up')
document.getElementById('left').onclick = () => mouveMap('right')
document.getElementById('right').onclick = () => mouveMap('left')

const player = new Ship({ type: 'player', ports })
