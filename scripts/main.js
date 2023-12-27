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
import { setFriendlyShoreCell, shopMenu } from './shopModule.js'

const gameEl = document.getElementById('game')
// la larghezza di una cella
export const cellWidth = 100
export const rowCount = 40
export const colCount = 40
const portRange = 2

const ports = []

// Variabili per tracciare lo stato del drag-and-drop
let isDragging = false
let initialMouseX, initialMouseY
let initialX, initialY
const maxMapX = cellWidth / 2
const maxMapY = cellWidth / 2
let minMapX, minMapY

const map = document.createElement('div')

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
document.getElementById('shopButton').onclick = function () {
	player.resources.gold += 250
	document
		.getElementsByTagName('body')[0]
		.appendChild(shopMenu(player.resources.gold, player.resources.rhum, player.resources.food))
}

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
	let x = cell.getAttribute(`data-col`)
	let y = cell.getAttribute(`data-row`)
	const balloon = document.createElement('div')

	const removeBalloon = function () {
		console.log('X')
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
				return analyzedCell.classList[1] + ' ' + analyzedCell.classList[2]
			} else {
				return 'Acqua'
			}
		}
	}

	if (document.getElementById('mouse-balloon')) {
		document.getElementById('mouse-balloon').remove()
	}
	// Creazione del balloon
	balloon.id = 'mouse-balloon'

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
	)}]\nTipo: [${defineCellType(cell)}] \n Movimento possibile [${player.mouvementPossible(x, y)}]\n`

	const divFooter = document.createElement('div')
	const buttonMuoviti = document.createElement('p')
	buttonMuoviti.innerText = '[VAI QUI]'
	buttonMuoviti.onclick = function () {
		player.mouveShip(cell, x, y, balloon)
	}
	buttonMuoviti.style.cursor = 'pointer'
	divFooter.appendChild(buttonMuoviti)

	balloon.appendChild(headerBalloon)
	balloon.appendChild(pMidBalloon)
	balloon.appendChild(divFooter)
	cell.appendChild(balloon)
	balloon.style.left = `${0}px`
	balloon.style.top = `${(balloon.offsetHeight / 2) * -1}px`
	// Impostazione del timeout per rimuovere il balloon dopo 30 secondi
	// setTimeout(function () {
	// 	if (balloon) {
	// 		balloon.remove()
	// 	}
	// }, 30000)
}

const spawnPort = (x, y, direction, ownedByPlayer) => {
	const portObj = {
		direction,
		owner: ownedByPlayer ? 'player' : 'bot',
		interactionCells: [],
	}
	const cell = document.querySelector(`.cell[data-col="${x}"][data-row="${y}"]`)
	const port = document.createElement('div')
	port.classList.add('Porto')
	port.classList.add(direction)
	port.innerHTML = `<img src="../assets/sprites/shore.png" alt="shore">`
	cell.appendChild(port)

	let minX, maxX, minY, maxY
	let deadZones = [] //celle in cui non agginger la classe Molo

	if (direction === 'nord' || direction === 'sud') {
		minX = x - portRange
		maxX = x + 1 + portRange
	}
	if (direction === 'nord') {
		minY = 0
		maxY = y + 1 + portRange
		deadZones = [
			{ x: x + 1, y: 0 },
			{ x, y: 1 },
			{ x: x + 1, y: 1 },
		]
	}
	if (direction === 'sud') {
		minY = y - 1 - portRange
		maxY = y
		deadZones = [
			{ x, y: y - 1 },
			{ x: x + 1, y: y - 1 },
			{ x: x + 1, y },
		]
	}

	if (direction === 'est' || direction === 'ovest') {
		minY = y - portRange
		maxY = y + 1 + portRange
	}

	if (direction === 'ovest') {
		minX = 0
		maxX = x + 1 + portRange
		deadZones = [
			{ x: 1, y: y },
			{ x: 0, y: y + 1 },
			{ x: 1, y: y + 1 },
		]
	}
	if (direction === 'est') {
		minX = x - 1 - portRange
		maxX = x
		deadZones = [
			{ x: x - 1, y },
			{ x, y: y + 1 },
			{ x: x - 1, y: y + 1 },
		]
	}
	deadZones.push({ x, y })

	for (let y = minY; y <= maxY; y++) {
		for (let x = minX; x <= maxX; x++) {
			if (deadZones.find(coordinate => coordinate.x === x && coordinate.y === y)) {
				continue
			}
			portObj.interactionCells.push({ x, y })
			const cell = document.querySelector(`.cell[data-col="${x}"][data-row="${y}"]`)

			cell.classList.add('Molo') // aggiungo la classe Mol le tutte le celle di interazione con il porto
			if (ownedByPlayer) {
				cell.classList.add('amichevole')
			} else {
				cell.classList.add('nemico')
			}
		}
	}
	ports.push(portObj)
}

const spawnPorts = () => {
	const halfWidth = Math.floor(colCount / 2) - 1
	const halfHeight = Math.floor(rowCount / 2) - 1
	let portoAlleato = Math.floor(Math.random() * 4)

	spawnPort(halfWidth, 0, 'nord', portoAlleato === 0)
	spawnPort(colCount - 1, halfHeight, 'est', portoAlleato === 1)
	spawnPort(halfWidth, rowCount - 1, 'sud', portoAlleato === 2)
	spawnPort(0, halfHeight, 'ovest', portoAlleato === 3)
}

const generateMap = (rows, cols) => {
	map.classList.add('map')

	let portoNemicoCasuale
	for (let i = 0; i < rows; i++) {
		const row = document.createElement('div')
		row.classList.add('row')

		for (let j = 0; j < cols; j++) {
			const cell = document.createElement('div')
			cell.classList.add('cell')
			cell.setAttribute('data-row', i)
			cell.setAttribute('data-col', j)

			row.appendChild(cell)
		}
		map.appendChild(row)
	}
	gameEl.appendChild(map)
	spawnPorts()
	// setFriendlyShoreCell()
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const setMapMinXY = () => {
	minMapX = Math.min(cellWidth / 2, window.innerWidth - map.offsetWidth - cellWidth / 2)
	minMapY = Math.min(cellWidth / 2, window.innerHeight - map.offsetHeight - cellWidth / 2)
}

const mouveMap = direction => {
	const map = document.querySelector('.map')
	const transform = window.getComputedStyle(map).transform
	// Estrarre i valori di traslazione (x, y)
	const matrix = new DOMMatrixReadOnly(transform)
	let x = matrix.m41
	let y = matrix.m42

	// Aggiornare x o y in base alla direzione
	switch (direction) {
		case 'up':
			y -= cellWidth
			break
		case 'down':
			y += cellWidth

			break
		case 'left':
			x -= cellWidth
			break
		case 'right':
			x += cellWidth
			break
		default:
			console.log('Direzione non valida')
	}

	x = Math.min(maxMapX, Math.max(x, minMapX))
	y = Math.min(maxMapY, Math.max(y, minMapY))

	// Applicare il nuovo valore di traslazione
	map.style.transform = `translate(${x}px, ${y}px)`
}

// Funzione per iniziare il trascinamento
function startDrag(e) {
	isDragging = true
	initialMouseX = e.clientX
	initialMouseY = e.clientY
	const matrix = new DOMMatrixReadOnly(window.getComputedStyle(map).transform)
	initialX = matrix.m41
	initialY = matrix.m42
	// Aggiungi questi event listener nel tuo metodo startDrag
	window.addEventListener('mousemove', onDrag)
	window.addEventListener('mouseup', endDrag)
}

// Funzione per aggiornare la posizione dell'elemento
function onDrag(e) {
	if (!isDragging) return
	let deltaX = e.clientX - initialMouseX
	let deltaY = e.clientY - initialMouseY

	let finalX = initialX + deltaX
	let finalY = initialY + deltaY

	finalX = Math.min(maxMapX, Math.max(finalX, minMapX))
	finalY = Math.min(maxMapY, Math.max(finalY, minMapY))

	// console.log({ finalX, finalY })
	map.style.transform = `translate(${finalX}px, ${finalY}px)`
}

// Funzione per terminare il trascinamento
function endDrag() {
	isDragging = false

	window.removeEventListener('mousemove', onDrag)
	window.removeEventListener('mouseup', endDrag)
}

document.addEventListener('keydown', e => {
	if (e.key === 'ArrowUp' || e.key === 'w') {
		mouveMap('down')
	}
	if (e.key === 'ArrowDown' || e.key === 's') {
		mouveMap('up')
	}
	if (e.key === 'ArrowLeft' || e.key === 'a') {
		mouveMap('right')
	}
	if (e.key === 'ArrowRight' || e.key === 'd') {
		mouveMap('left')
	}
})

let wasDragged = false
const dragThreshold = 10 // Soglia in pixel per considerare un movimento come trascinamento

//eseguire la funzioni solo se il mouse non è stato trascinato per più del dragThreshold
document.addEventListener('mousedown', function (e) {
	wasDragged = false
	const startX = e.clientX
	const startY = e.clientY

	function onMouseMove(e) {
		if (
			Math.abs(e.clientX - startX) > dragThreshold ||
			Math.abs(e.clientY - startY) > dragThreshold
		) {
			wasDragged = true
			document.removeEventListener('mousemove', onMouseMove)
		}
	}

	document.addEventListener('mousemove', onMouseMove)

	document.addEventListener(
		'mouseup',
		function () {
			document.removeEventListener('mousemove', onMouseMove)
			if (!wasDragged) {
				// cliccato ma non tracinato

				console.log()
				if (
					!e.target.closest('#mouse-balloon') &&
					!e.target.closest('#playerStats') &&
					!e.target.closest('#controls')
				) {
					const cell = e.target.closest('.cell')
					popUpBaloon(cell)
				}
			}
		},
		{ once: true }
	)
})

//inizilizza il gioco

generateMap(rowCount, colCount)
setMapMinXY()
window.addEventListener('resize', () => {
	setMapMinXY()
})

document.getElementById('up').onclick = () => mouveMap('down')
document.getElementById('down').onclick = () => mouveMap('up')
document.getElementById('left').onclick = () => mouveMap('right')
document.getElementById('right').onclick = () => mouveMap('left')

export const player = new Ship({ type: 'player', ports })

// Aggiungi event listener per il drag-and-drop
map.addEventListener('mousedown', startDrag)
