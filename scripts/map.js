import { isTouchDevice, gameEl, player } from './main.js'

const cellWidth = 100
const rowCount = 40
const colCount = 40

// Variabili per tracciare lo stato del drag-and-drop
let isDragging = false
let initialMouseX, initialMouseY
let initialX, initialY
const maxMapX = cellWidth
const maxMapY = cellWidth * 2
let minMapX, minMapY
const mapArray = []

const map = document.createElement('div')

const generateMap = (rows, cols) => {
	map.classList.add('map')

	let portoNemicoCasuale
	for (let i = 0; i < rows; i++) {
		const row = document.createElement('div')
		row.classList.add('row')

		for (let j = 0; j < cols; j++) {
			const cell = document.createElement('div')
			cell.classList.add('cell')
			cell.dataset.row = i
			cell.dataset.col = j

			mapArray.push({ x: j, y: i })

			row.appendChild(cell)
		}
		map.appendChild(row)
	}
	gameEl.appendChild(map)
}

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
const startDrag = e => {
	isDragging = true

	// Controlla se l'evento è di tipo touch
	if (e.type === 'touchstart') {
		// Assicurati che ci sia almeno un tocco
		if (e.touches.length > 0) {
			initialMouseX = e.touches[0].clientX
			initialMouseY = e.touches[0].clientY
		}
	} else {
		// Altrimenti, usa le coordinate del mouse
		initialMouseX = e.clientX
		initialMouseY = e.clientY
	}

	const matrix = new DOMMatrixReadOnly(window.getComputedStyle(map).transform)
	initialX = matrix.m41
	initialY = matrix.m42

	// Aggiungi questi event listener nel tuo metodo startDrag

	//aggiungo i touch listerner solo se il il dipositivo è abilitato al touch
	if (e.type === 'touchstart') {
		window.addEventListener('touchmove', onDrag)
		window.addEventListener('touchend', endDrag)
	}

	//aggiunngo gli evnt listeter per il mose perché anche un dipositivo touch può avere un input mouse
	window.addEventListener('mousemove', onDrag)
	window.addEventListener('mouseup', endDrag)
}

// Funzione per aggiornare la posizione dell'elemento
const onDrag = e => {
	if (!isDragging) return

	let clientX, clientY

	// Controlla se l'evento è di tipo touch
	if (e.type === 'touchmove') {
		// Assicurati che ci sia almeno un tocco
		if (e.touches.length > 0) {
			clientX = e.touches[0].clientX
			clientY = e.touches[0].clientY
		}
	} else {
		// Altrimenti, usa le coordinate del mouse
		clientX = e.clientX
		clientY = e.clientY
	}

	// Calcola la differenza tra le coordinate correnti e quelle iniziali
	let deltaX = clientX - initialMouseX
	let deltaY = clientY - initialMouseY

	// Calcola le nuove posizioni
	let finalX = initialX + deltaX
	let finalY = initialY + deltaY

	// Limita la posizione alle dimensioni della mappa
	finalX = Math.min(maxMapX, Math.max(finalX, minMapX))
	finalY = Math.min(maxMapY, Math.max(finalY, minMapY))

	// Aggiorna la trasformazione CSS per spostare la mappa
	map.style.transform = `translate(${finalX}px, ${finalY}px)`
}

// Funzione per terminare il trascinamento
const endDrag = () => {
	isDragging = false
	if (isTouchDevice()) {
		window.removeEventListener('touchmove', onDrag)
		window.removeEventListener('touchend', endDrag)
	}
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

const moveViewportOverPlayer = () => {
	const traslViewBoxX = Math.min(
		maxMapX,
		Math.max(-(player.posX * 100 - window.innerWidth / 2), minMapX)
	)
	const traslViewBoxY = Math.min(
		maxMapY,
		Math.max(-(player.posY * 100 - window.innerHeight / 2), minMapY)
	)
	map.style.transform = `translate(${traslViewBoxX}px, ${traslViewBoxY}px)`
	map.style.transition = '200ms'
}

document.getElementById('up').onclick = () => mouveMap('down')
document.getElementById('down').onclick = () => mouveMap('up')
document.getElementById('left').onclick = () => mouveMap('right')
document.getElementById('right').onclick = () => mouveMap('left')

// Aggiungi event listener per il drag-and-drop
map.addEventListener('touchstart', startDrag)

map.addEventListener('mousedown', startDrag)

export {
	cellWidth,
	rowCount,
	colCount,
	map,
	setMapMinXY,
	generateMap,
	moveViewportOverPlayer,
	mapArray,
}
