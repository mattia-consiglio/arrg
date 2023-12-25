import { shipsTemplate, templateResources } from './shipsModule.js'
// import { cellWidth } from './main.js'
export class Ship {
	static DOMShipWrap
	static DOMShipImg
	id
	type
	level
	hp
	cannonPower
	cannonAmount
	resources = templateResources
	maxStorage
	crew
	xpNeeded
	xpGiven
	autoStartAttack
	autoFollow
	attackRange
	motionRange
	speed
	static sprites
	posX
	posY
	direction = 'right'

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
			xpNeeded,
			xpGiven,
			autoStartAttack,
			autoFollow,
			motionRange,
			speed,
			sprites,
		} = this.getShipTemplateByLevel(this.level)
		this.hp = hp
		this.maxHp = maxHp
		this.cannonPower = cannonPower
		this.cannonAmount = cannonAmount
		this.maxStorage = maxStorage
		this.crew = crew
		this.xpNeeded = xpNeeded
		this.xpGiven = xpGiven
		this.autoStartAttack = autoStartAttack
		this.autoFollow = autoFollow
		this.motionRange = motionRange
		this.speed = speed
		this.sprites = sprites[this.type]

		this.id = id
		this.DOMShipWrap = document.createElement('div')
		this.DOMShipWrap.id = id
		this.DOMShipWrap.classList.add('ship')
		this.DOMShipImg = document.createElement('img')
		this.DOMShipImg.classList.add('shipImg')
		this.DOMShipWrap.appendChild(this.DOMShipImg)
		const cell = this.getinitalSpawnCell(ports)
		console.log(cell)

		this.setShipPosition(cell)
		this.updateShipImageDirection()
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
		console.log(cell)
		const targetX = cell.getAttribute('data-row')
		const targetY = cell.getAttribute('data-col')

		this.DOMShipWrap.style.animation = 'none'

		if (this.DOMShipWrap) {
			this.DOMShipWrap.remove()
		}
		cell.appendChild(this.DOMShipWrap)
		this.posX = targetX
		this.posY = targetY
	}

	getinitalSpawnCell(ports) {
		/**
		 * DA FARE:
		 * controllo del tipo di nave
		 * controllare se ci sono porti liberi e il tipo
		 */
		const xInitial = 24
		const yInitial = 26
		this.posX = xInitial
		this.posX = yInitial
		const cell = document.querySelector(`div[data-row="${xInitial}"][data-col="${yInitial}"]`)
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

	mouvementPossible(targetX, targetY) {
		return this.motionRange >= this.calculateDistance(targetX, targetY)
	}

	animateMouveShip(destinationCell) {
		let currentShipX = this.DOMShipWrap.parentElement.offsetTop
		let currentShipY = this.DOMShipWrap.parentElement.offsetLeft
		let xDestination = destinationCell.offsetTop
		let yDestination = destinationCell.offsetLeft
		console.log(xDestination - currentShipX)
		console.log(yDestination - currentShipY)
		let animationDuration = 0.5 * this.calculateDistance(xDestination, yDestination)

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

		this.DOMShipWrap.animate(translAnimation, animOp)
		setTimeout(() => {
			this.setShipPosition(destinationCell)
			this.DOMShipWrap.animate({ transform: `translate(0px,0px)` }, animOp2)
		}, animationDuration)
	}

	updateShipImageDirection() {
		switch (this.direction) {
			case 'right':
				this.DOMShipImg.src = '../assets/sprites/' + this.sprites.right
				this.DOMShipImg.style.transform = 'translate(-62px, -130px)'

				break
			case 'left':
				this.DOMShipImg.src = '../assets/sprites/' + this.sprites.left
				this.DOMShipImg.style.transform = 'translate(-70px, -130px)'
				break
			case 'up':
				this.DOMShipImg.src = '../assets/sprites/' + this.sprites.up
				this.DOMShipImg.style.transform = 'translate(-66px, -150px)'
				break
			case 'down':
				this.DOMShipImg.src = '../assets/sprites/' + this.sprites.down
				this.DOMShipImg.style.transform = 'translate(-65px, -150px)'
				break
			default:
				console.log('Errore: direzione non valida')
				break
		}
		this.DOMShipWrap.appendChild(this.DOMShipImg)
	}
}
