import {
	shipsTemplate,
	templateResources,
	shipsArray,
	shipsExtractionChanches,
	shipMotionBaseTime,
} from './shipsModule.js'
import { rowCount, colCount } from './map.js'
import { player, ports } from './main.js'
let idCount = 0
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
	resources = { ...templateResources }
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
	motionRangeCells = []
	handleCellMotionClickBound

	constructor({ type, level = 1, id = 0 }) {
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
		const cell = this.setInitalSpawnCell()

		this.setShipPosition(cell)
		this.updateShipImageDirection()
		this.handleCellMotionClickBound = this.handleCellMotionClick.bind(this)

		this.getMotionCellRange()
		this.resourcesRandomizer()
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
		this.getAttackRangeCells()
		this.getMotionCellRange()
	}

	setInitalSpawnCell() {
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
					shipsArray.findIndex(ship => {
						return ship.posX === portCell.x && ship.posY === portCell.y
					}) === -1
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

	mouveShip(cell) {
		if (this.mouvementPossible()) {
			this.animateMouveShip(cell)
		}
	}

	calculateDistance(x, y) {
		return parseInt(Math.sqrt(Math.pow(x - this.posX, 2) + Math.pow(y - this.posY, 2)))
	}

	mouvementPossible() {
		return this.motionRangeCells.length > 0
	}
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

		let animationDuration =
			(shipMotionBaseTime *
				this.calculateDistance(destinationCell.dataset.col, destinationCell.dataset.row)) /
			this.speed

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

	resetMotionCells() {
		this.motionRangeCells.forEach(cell => {
			const cellDOM = document.querySelector(`.cell[data-col="${cell.x}"][data-row="${cell.y}"]`)

			if (this.type === 'player') {
				cellDOM.classList.remove('mouvable')
				// Rimuovi l'event listener 'click' da ogni cella
				cellDOM.removeEventListener('click', this.handleCellMotionClickBound)
			}
		})

		//empty movementRangeCells
		this.motionRangeCells.length = 0
	}

	// Funzione handler che verrà utilizzata per aggiungere e rimuovere l'event listener
	handleCellMotionClick(event) {
		this.mouveShip(event.target)
		this.resetMotionCells()
	}

	getMotionCellRange() {
		this.getCellRange('motion')
	}

	getAttackRangeCells() {
		this.getCellRange('attack')
	}

	getCellRange(rageType) {
		const range = rageType === 'motion' ? this.motionRange : this.attackRange

		for (let i = this.posX - range; i <= this.posX + range; i++) {
			for (let j = this.posY - range; j <= this.posY + range; j++) {
				if (Math.abs(this.posX - i) + Math.abs(this.posY - j) <= range) {
					const cell = document.querySelector(`.cell[data-col="${i}"][data-row="${j}"]`)

					//setting conditions
					const baseExclusion = !cell || cell.dataset.interactive === false
					const hasShip = cell ? cell.querySelector('.ship') !== null : false
					const exclusionCondition =
						rageType === 'attack' ? baseExclusion : baseExclusion || hasShip
					if (exclusionCondition) continue

					if (rageType === 'motion') {
						this.motionRangeCells.push({ x: i, y: j })
					}
					if (rageType === 'attack') {
						this.attackRangeCells.push({ x: i, y: j })
					}
					if (this.type === 'player' && rageType === 'motion') {
						cell.classList.add('mouvable')
						cell.addEventListener('click', this.handleCellMotionClickBound)
					}
				}
			}
		}
	}

	resourcesRandomizer() {
		const extractionPool = []
		for (const key in this.resources) {
			if (key === 'gold') continue
			extractionPool.push(key)
		}
		for (let i = 0; i < this.maxStorage; i++) {
			this.resources[extractionPool[Math.floor(Math.random() * extractionPool.length)]]++
		}

		const min = this.hp / 2
		const max = this.hp * 2

		this.resources.gold = Math.floor(Math.random() * (max - min) + min)
	}
}

class PlayerShip extends Ship {
	xpNeeded
	constructor() {
		super({ type: 'player', level: 1, id: 0 })
		const shipTemplate = this.getShipTemplateByLevel(this.level + 1)
		if (shipTemplate) {
			this.xpNeeded = shipTemplate.xpNeeded
		} else {
			this.xpNeeded = this.getShipTemplateByLevel(this.level).xpNeeded
		}
		this.DOMShipWrap.classList.add('player')
		this.updateResourcesVisual()
	}

	updateResourcesVisual() {
		for (const [key, value] of Object.entries(this.resources)) {
			const element = document.getElementById(key)
			element.innerText = value
		}
		const element = document.getElementById('xp')
		element.innerText = this.xp + '/' + this.xpNeeded
	}
}

class BotShip extends Ship {
	xpGiven
	autoFollow
	autoStartAttack
	constructor() {
		super({ type: 'bot', level: BotShip.extractLevel(), id: idCount + 1 })

		idCount++
		const { xpGiven, autoStartAttack, autoFollow } = this.getShipTemplateByLevel(this.level)
		this.xpGiven = xpGiven
		this.autoStartAttack = autoStartAttack
		this.autoFollow = autoFollow
		this.DOMShipWrap.classList.add('bot')
	}

	static extractLevel() {
		const playerLevel = shipsArray[0].level
		const chaches = shipsExtractionChanches[playerLevel]
		const expandedChaches = shipsTemplate.flatMap((shipTemplate, index) =>
			Array(chaches[index]).fill(shipTemplate)
		)
		return expandedChaches[Math.floor(Math.random() * expandedChaches.length)].level
	}
}

export { PlayerShip, BotShip }
