const gameEl = document.getElementById('game')
const ships = {}
const amount = 100

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
	// if (
	// 	gaps.top + amount > 100 ||
	// 	gaps.bottom + amount > 100 ||
	// 	gaps.left + amount > 100 ||
	// 	gaps.right + amount > 100
	// ) {
	// 	console.log('Non è possibile muovere la mappa')
	// 	return
	// }
	const map = document.querySelector('.map')
	const transform = window.getComputedStyle(map).transform
	// Estrarre i valori di traslazione (x, y)
	const matrix = new DOMMatrixReadOnly(transform)
	let x = matrix.m41
	let y = matrix.m42

	// Aggiornare x o y in base alla direzione
	switch (direction) {
		case 'up':
			if (gaps.bottom + amount < 100) {
				y -= amount
			}
			break
		case 'down':
			if (gaps.top + amount < 100) {
				y += amount
			}
			break
		case 'left':
			if (gaps.right + amount < 100) {
				x -= amount
			}
			break
		case 'right':
			if (gaps.left + amount < 100) {
				x += amount
			}

			break
		default:
			console.log('Direzione non valida')
	}

	// Applicare il nuovo valore di traslazione
	map.style.transform = `translate(${x}px, ${y}px)`
	setTimeout(getMapRelativeGaps, 200)
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
