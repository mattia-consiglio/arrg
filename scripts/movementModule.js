import { PlayerShip } from './ShipClass.js'
import { player } from './main.js'

export const movementMethod = function () {
    const resetCells = function () {
        console.log('reset cells')
        const cellToReset = document.querySelectorAll('.mouvable')
        cellToReset.forEach(function (cell) {
            cell.classList.remove('mouvable')
            cell.removeEventListener('click', handleCellClick)
        })
    }

    function handleCellClick() {
        player.mouveShip(this)
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
                        cell.addEventListener('click', handleCellClick, { once: true })
                    }
                }
            }
        }
        return cells
    }

    const arrayDaPulire = getCellsInRange(player.posX, player.posY, player.speed)
    //resetCells()
}