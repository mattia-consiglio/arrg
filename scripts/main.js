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
	const mapComuptedStyle = window.getComputedStyle(map)
	const mapWidth = mapComuptedStyle.getPropertyValue('transform')
	console.log(mapWidth)
}

document.addEventListener('keyup', e => {
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
