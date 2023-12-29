import {
	shipsTemplate,
	templateResources,
	shipsArray,
	shipsExtractionChanches,
} from './shipsModule.js'
import { rowCount, colCount } from './map.js'
let idCount = 0
let botCount = 0
class Ship {
	static DOMShipWrap
	static DOMShipImg
	static hpBar
	static levelText
	id
	type
	level
	hp
	cannonPower
	cannonAmount
	resources = templateResources
	maxStorage
	crew
	xp = 0

	autoStartAttack

	attackRange
	motionRange
	speed
	static sprites
	posX
	posY
	direction = 'left'
	attackRangeCells = []

	constructor({ type, level = 1, id = 0, ports = [] }) {
		if (type !== 'player' && type !== 'bot') return console.log('Wrong Ship type')
		this.type = type
		this.level = level
		const {
			hp,
			maxHp,
			cannonPower,
			cannonAmount,
			maxStorage,
			crew,
			motionRange,
			attackRange,
			speed,
			sprites,
		} = this.getShipTemplateByLevel(this.level)
		this.hp = hp
		this.maxHp = maxHp
		this.cannonPower = cannonPower
		this.cannonAmount = cannonAmount
		this.maxStorage = maxStorage
		this.crew = crew
		this.motionRange = motionRange
		this.attackRange = attackRange
		this.speed = speed
		this.sprites = sprites[this.type]

		//creating ship wapper
		this.id = id
		this.DOMShipWrap = document.createElement('div')

		this.levelText = document.createElement('h2')
		this.levelText.classList.add('level-text')
		this.DOMShipWrap.appendChild(this.levelText)
		this.updateLevelText()

		//adding hp bar
		this.hpBar = document.createElement('div')
		this.hpBar.classList.add('hpBar')
		this.DOMShipWrap.appendChild(this.hpBar)
		this.updateHpBar()

		//adding ship
		this.DOMShipWrap.id = id
		this.DOMShipWrap.classList.add('ship')
		this.DOMShipImg = document.createElement('img')
		this.DOMShipImg.classList.add('shipImg')
		this.DOMShipWrap.appendChild(this.DOMShipImg)
		const cell = this.setInitalSpawnCell(ports)

		this.setShipPosition(cell)
		this.updateShipImageDirection()
	}

	updateLevelText() {
		this.levelText.innerText = `LVL ${this.level}`
	}

	updateHpBar() {
		const perc = (this.hp / this.maxHp) * 100
		console.log
		this.hpBar.classList.remove('green')
		this.hpBar.classList.remove('yellow')
		this.hpBar.classList.remove('red')
		if (perc > 50) {
			this.hpBar.classList.add('green')
		} else if (perc > 20) {
			this.hpBar.classList.add('yellow')
		} else {
			this.hpBar.classList.add('red')
		}
		this.hpBar.style.setProperty('--hp', perc + '%')
	}

	/**
	 * Returns the ship template object based on the level provided
	 *
	 * @param {number} level
	 * @returns object
	 */
	getShipTemplateByLevel(level) {
		return shipsTemplate.find(ship => ship.level === level)
	}

	setShipPosition(cell) {
		const targetX = parseInt(cell.getAttribute('data-col'))
		const targetY = parseInt(cell.getAttribute('data-row'))
		this.DOMShipWrap.style.animation = 'none'

		if (this.DOMShipWrap) {
			this.DOMShipWrap.remove()
		}
		cell.appendChild(this.DOMShipWrap)
		this.posY = targetY
		this.posX = targetX
		this.calculateAttackRangeCells()
	}

	setInitalSpawnCell(ports) {
		const filteredPorts = ports.filter(port => port.owner === this.type)
		let spawnPortIndex = 0
		if (filteredPorts.length > 1) {
			spawnPortIndex = Math.floor(Math.random() * filteredPorts.length)
		}
		const freeCells = []
		if (this.type === 'player') {
			freeCells.push(...filteredPorts[spawnPortIndex].interactionCells)
		} else {
			// mi assiucuro di creare un array di estrazione con le sole celle libere
			filteredPorts[spawnPortIndex].interactionCells.forEach(portCell => {
				if (
					shipsArray.findIndex(ship => ship.posX === portCell.x && ship.posY === portCell.y) > -1
				) {
					freeCells.push(portCell)
				}
			})
		}

		const spawnCell = freeCells[Math.floor(Math.random() * freeCells.length)]

		const xInitial = spawnCell.x
		const yInitial = spawnCell.y
		this.posX = xInitial
		this.posY = yInitial
		const cell = document.querySelector(`.cell[data-row="${yInitial}"][data-col="${xInitial}"]`)
		return cell
	}

	mouveShip(cell, x, y, balloon) {
		balloon.remove()
		if (this.mouvementPossible(x, y)) {
			this.animateMouveShip(cell)
		}
	}

	calculateDistance(x, y) {
		return parseInt(Math.sqrt(Math.pow(x - this.posX, 2) + Math.pow(y - this.posY, 2)))
	}

	calculateAttackRangeCells() {
		this.attackRangeCells.length = 0
		const minX = Math.max(0, this.posX - this.attackRange)
		const maxX = Math.min(colCount - 1, this.posX + this.attackRange)
		const minY = Math.max(0, this.posY - this.attackRange)
		const maxY = Math.min(rowCount - 1, this.posY + this.attackRange)

		for (let y = minY; y <= maxY; y++) {
			for (let x = minX; x <= maxX; x++) {
				if (x === this.posX && y === this.posY) {
					continue
				}
				this.attackRangeCells.push({ x, y })
			}
		}
	}

	mouvementPossible(targetX, targetY) {
		return this.motionRange >= this.calculateDistance(targetX, targetY)
	}

	animateMouveShip(destinationCell) {
		if (destinationCell.classList[2] === 'amichevole') {
			document.getElementById('shopButton').style.visibility = 'visible'
		} else {
			document.getElementById('shopButton').style.visibility = 'hidden'
		}

		let currentShipX = this.DOMShipWrap.parentElement.offsetTop
		let currentShipY = this.DOMShipWrap.parentElement.offsetLeft
		let xDestination = destinationCell.offsetTop
		let yDestination = destinationCell.offsetLeft

		let animationDuration = 0.4 * this.calculateDistance(xDestination, yDestination)

		if (Math.abs(xDestination - currentShipX) > Math.abs(yDestination - currentShipY)) {
			if (xDestination - currentShipX > 0) {
				this.direction = 'down'
			}
			if (xDestination - currentShipX < 0) {
				this.direction = 'up'
			}
		} else {
			if (yDestination - currentShipY > 0) {
				this.direction = 'right'
			} else {
				this.direction = 'left'
			}
		}
		this.updateShipImageDirection()

		let translAnimation = [
			{
				transform: `translate( ${yDestination - currentShipY}px, ${xDestination - currentShipX}px)`,
			},
		]

		let animOp = {
			duration: animationDuration,
			fill: 'forwards',
		}

		let animOp2 = {
			duration: 0,
			fill: 'forwards',
		}

		const animation = this.DOMShipWrap.animate(translAnimation, animOp)
		animation.onfinish = () => {
			this.setShipPosition(destinationCell)
			this.DOMShipWrap.animate({ transform: `translate(0px,0px)` }, animOp2)
		}
	}

	updateShipImageDirection() {
		this.DOMShipImg.classList.remove('right')
		this.DOMShipImg.classList.remove('left')
		this.DOMShipImg.classList.remove('up')
		this.DOMShipImg.classList.remove('down')
		switch (this.direction) {
			case 'right':
				this.DOMShipImg.src = '../assets/sprites/' + this.sprites.right
				this.DOMShipImg.classList.add('right')

				break
			case 'left':
				this.DOMShipImg.src = '../assets/sprites/' + this.sprites.left
				this.DOMShipImg.classList.add('left')

				break
			case 'up':
				this.DOMShipImg.src = '../assets/sprites/' + this.sprites.up
				this.DOMShipImg.classList.add('up')
				break
			case 'down':
				this.DOMShipImg.src = '../assets/sprites/' + this.sprites.down
				this.DOMShipImg.classList.add('down')
				break
			default:
				console.log('Errore: direzione non valida')
				break
		}
	}
}

export class PlayerShip extends Ship {
	xpNeeded
	constructor({ type, level = 1, id = 0, ports = [] }) {
		super({ type: 'player', level, id, ports })
		const shipTemplate = this.getShipTemplateByLevel(this.level + 1)
		if (shipTemplate) {
			this.xpNeeded = shipTemplate.xpNeeded
		} else {
			this.xpNeeded = this.getShipTemplateByLevel(this.level).xpNeeded
		}
	}
}

export class BotShip extends Ship {
	xpGiven
	autoFollow
	autoStartAttack
	constructor({ type, ports = [] }) {
		idCount++
		const { xpGiven, autoStartAttack, autoFollow } = this.getShipTemplateByLevel(this.level)
		this.xpGiven = xpGiven
		this.autoStartAttack = autoStartAttack
		this.autoFollow = autoFollow
		const etractedLevel = extractLevel()
		super({ type: 'bot', level: etractedLevel, id: idCount + 1, ports })
		botCount++
	}

	extractLevel() {
		const playerLevel = shipsArray[0].level
		const chaches = shipsExtractionChanches[playerLevel]
		const expandedChaches = shipsTemplate.flatMap((shipTemplate, index) =>
			Array(chaches[index]).fill(shipTemplate)
		)
		return expandedChaches[Math.floor(Math.random() * expandedChaches.length)].level
	}
}
