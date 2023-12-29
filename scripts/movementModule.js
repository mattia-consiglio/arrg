import { PlayerShip } from './ShipClass.js'
import { player } from './main.js'

export const movementMethod = function () {
	const resetCells = function () {
		const cellToReset = document.querySelectorAll('.mouvable')
		cellToReset.forEach(function (cell) {
			cell.classList.remove('mouvable')
			// Rimuovi l'event listener 'click' da ogni cella
			cell.removeEventListener('click', handleCellClick)
		})
	}

	// Funzione handler che verrà utilizzata per aggiungere e rimuovere l'event listener
	function handleCellClick() {
		player.mouveShip(this) // 'this' fa riferimento all'elemento su cui è stato fatto clic
		resetCells()
	}

	function getCellsInRange(x, y, movement) {
		let cells = []
		movement++
		for (let i = x - movement; i <= x + movement; i++) {
			for (let j = y - movement; j <= y + movement; j++) {
				if (Math.abs(x - i) + Math.abs(y - j) <= movement) {
					const cell = document.querySelector(`.cell[data-col="${i}"][data-row="${j}"]`)
					if (cell) {
						cell.classList.add('mouvable')
						cells.push(cell)
						cell.addEventListener('click', handleCellClick)
					}
				}
			}
		}
		return cells
	}

	const arrayDaPulire = getCellsInRange(player.posX, player.posY, player.speed)
	//resetCells()
}
