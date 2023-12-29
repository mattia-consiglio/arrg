import { PlayerShip } from './ShipClass.js'
import { player } from './main.js'

export const movementMethod = function (x, y, shipSpeed) {

    const cellToReset = document.querySelectorAll(".mouvable")
    cellToReset.forEach(function (cell) {
        cell.classList.remove("mouvable")

        for (let i = player.posX - player.speed; i <= player.posX + player.speed; i++) {
            for (let j = player.posY - player.speed; j <= player.posY + player.speed; j++) {
                if (Math.abs(player.posX - i) + Math.abs(player.posY - j) <= player.speed) {
                    const currentCell = document.querySelector(`.cell[data-col="${i}"][data-row="${j}"]`)
                    currentCell.classList.add('mouvable')
                }
            }
        }

    });

}