const gameEl = document.getElementById('game')
const ships = {}
const genarateMap = (rows, cols) => {
	const map = document.createElement('div')
	map.classList.add('map')
	for (let i = 0; i < rows; i++) {
		//adding row to gameEl
		const row = document.createElement('div')
		row.classList.add('row')

		for (let j = 0; j < cols; j++) {
			//adding cell to row
			const cell = document.createElement('div')
			cell.classList.add('cell')
			cell.setAttribute('data-row', i)
			cell.setAttribute('data-col', j)
			row.appendChild(cell)
		}
		map.appendChild(row)
	}
	gameEl.appendChild(map)
}
genarateMap(41, 41)

const muoveMap = direction => {
	console.log(direction)
	const map = document.querySelector('.map')
	const transform = window.getComputedStyle(map).transform
	// Estrarre i valori di traslazione (x, y)
	const matrix = new DOMMatrixReadOnly(transform)
	let x = matrix.m41
	let y = matrix.m42
	const amount = 100

	// Aggiornare x o y in base alla direzione
	switch (direction) {
		case 'up':
			y -= amount
			break
		case 'down':
			y += amount
			break
		case 'left':
			x -= amount
			break
		case 'right':
			x += amount
			break
		default:
			console.log('Direzione non valida')
	}

	// Applicare il nuovo valore di traslazione
	map.style.transform = `translate(${x}px, ${y}px)`
	const offsets = map.getBoundingClientRect()
	var top = offsets.top
	var left = offsets.left
	console.log(top, left)
}

document.addEventListener('keydown', e => {
	if (e.key === 'ArrowUp') {
		muoveMap('up')
	}
	if (e.key === 'ArrowDown') {
		muoveMap('down')
	}
	if (e.key === 'ArrowLeft') {
		muoveMap('left')
	}
	if (e.key === 'ArrowRight') {
		muoveMap('right')
	}
})
