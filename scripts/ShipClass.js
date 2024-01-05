import {
	shipsTemplate,
	templateResources,
	shipsArray,
	shipsExtractionChanches,
	shipMotionBaseTime,
} from './shipsModule.js'
import { rowCount, colCount } from './map.js'
import { player, ports, getDOMCell } from './main.js'
import Barrel from './Barrel.js'
let idCount = 0

const delay = milliseconds => {
	return new Promise(resolve => {
		setTimeout(resolve, milliseconds)
	})
}

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
	inMotion = false
	attackTarget = null
	attackedBy = []

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
		this.getAttackRangeCells()
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
		if (this.type !== "player") {
			this.DOMShipWrap.classList.add('bot')
			this.handleShipTriggerAttackDblclickBound = this.triggerAttack.bind(this)
			this.handleShipSelectClickBound = this.selectShip.bind(this)
			this.DOMShipWrap.parentElement.addEventListener(
				'dblclick',
				this.handleShipTriggerAttackDblclickBound
			)
			this.DOMShipWrap.parentElement.addEventListener('click', this.handleShipSelectClickBound)
		}
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
				const DOMPortCell = getDOMCell(portCell.x, portCell.y)
				if (
					shipsArray.findIndex(ship => {
						return ship.posX === portCell.x && ship.posY === portCell.y
					}) === -1 &&
					DOMPortCell.querySelector('.barrel') === null
				) {
					freeCells.push(portCell)
				}
			})
		}

		if (freeCells.length === 0) return
		const spawnCell = freeCells[Math.floor(Math.random() * freeCells.length)]

		const xInitial = spawnCell.x
		const yInitial = spawnCell.y
		this.posX = xInitial
		this.posY = yInitial
		const cell = getDOMCell(xInitial, yInitial)
		return cell
	}

	mouveShip(cell) {
		if (this.mouvementPossible() && this.inMotion === false) {
			this.inMotion = true
			this.animateMouveShip(cell)
		}
	}

	calculateDistance(x, y) {
		return parseInt(Math.sqrt(Math.pow(x - this.posX, 2) + Math.pow(y - this.posY, 2)))
	}

	mouvementPossible() {
		return this.motionRangeCells.length > 0
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
			this.inMotion = false
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

	resetMotionAndAttackCells() {
		// console.log(this.motionRangeCells)
		if (this.type === 'player') {
			this.motionRangeCells.forEach(cell => {
				const cellDOM = getDOMCell(cell.x, cell.y)
				cellDOM.classList.remove('mouvable')
				// Rimuovi l'event listener 'click' da ogni cella
				cellDOM.removeEventListener('click', this.handleCellMotionClickBound)
			})
			this.attackRangeCells.forEach(cell => {
				const cellDOM = getDOMCell(cell.x, cell.y)
				cellDOM.classList.remove('canattack')
			})
		}
	}

	// Funzione handler che verrà utilizzata per aggiungere e rimuovere l'event listener
	handleCellMotionClick(event) {
		this.mouveShip(event.target)
		this.resetMotionAndAttackCells()
	}

	getMotionCellRange() {
		this.getCellRange('motion')
	}

	getAttackRangeCells() {
		this.getCellRange('attack')
	}

	isInAttackRange(target) {
		return (
			this.attackRangeCells.findIndex(
				coordinate => coordinate.x === target.posX && coordinate.y === target.posY
			) !== -1
		)
	}

	getCellRange(rageType) {
		const range = rageType === 'motion' ? this.motionRange : this.attackRange

		if (rageType === 'motion') {
			this.motionRangeCells.length = 0
		}
		if (rageType === 'attack') {
			this.attackRangeCells.length = 0
		}

		for (let i = this.posX - range; i <= this.posX + range; i++) {
			for (let j = this.posY - range; j <= this.posY + range; j++) {
				if (Math.abs(this.posX - i) + Math.abs(this.posY - j) <= range) {
					const cell = getDOMCell(i, j)

					//setting conditions
					const baseExclusion =
						!cell ||
						cell.dataset.interactive === 'false' ||
						(parseInt(cell.dataset.col) === this.posX && parseInt(cell.dataset.row) === this.posY)
					const hasShip = cell
						? cell.querySelector('.ship') !== null || cell.querySelector('.barrel')
						: false
					const exclusionCondition =
						rageType === 'attack' ? baseExclusion : baseExclusion || hasShip
					if (this.type === 'bot') {
						//prevent bot ships from going to ports owned by player
						if (exclusionCondition || cell.classList.contains('amico')) continue
					} else {
						if (exclusionCondition) continue
					}

					if (rageType === 'motion') {
						this.motionRangeCells.push({ x: i, y: j })
					}
					if (rageType === 'attack') {
						this.attackRangeCells.push({ x: i, y: j })
					}
					if (this.type === 'player') {
						if (rageType === 'motion') {
							cell.classList.add('mouvable')
							cell.addEventListener('click', this.handleCellMotionClickBound)
						} else {
							cell.classList.add('canattack')
						}
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

		const min = this.level === 1 && this.type === 'player' ? this.hp : this.hp / 2
		const max = this.hp * 2

		this.resources.gold = Math.floor(Math.random() * (max - min) + min)
	}

	runRecovery() {
		// Cerca il porto più vicino
		let pointer = -1;
		let minDistance = 1000//milioni
		for (let i = 0; i < ports.length; i++) {
			let distance = this.calculateDistance(ports[i].posX, ports[i].posY)
			if (distance < minDistance) {
				pointer = i
				minDistance = distance
			}
		}

		// Sposta la nave verso il porto più vicino
		if (pointer !== -1) {
			const directionToPort = this.getDirectionTo(ports[pointer].posX, ports[pointer].posY)
			const moveTo = this.getMoveTowards(directionToPort)
			if (moveTo) {
				const targetCell = document.querySelector(
					`.cell[data-col="${moveTo.x}"][data-row="${moveTo.y}"]`
				)
				if (targetCell.classList[1] !== 'deadzone') {
					this.mouveShip(targetCell)
				} else {
					this.reparationMethod()
				}
			}
		}
	}

	async startAttack(target) {
		if (this.isInAttackRange(target) && target.hp > 0 && this.hp > 0) {
			if (this.type !== 'player') {
				if (this.hp < this.maxHp / 100 * 40) {
					this.stopAttack()
					this.runRecovery()
				}
			}
			this.attackTarget = target
		}
		for (let i = 0; i < this.cannonAmount; i++) {
			if (this.attackTarget === null) return
			if (!this.isInAttackRange(target)) return
			if (target.hp === 0) {
				target.lose()
			}
			const newHp = target.hp - this.cannonPower < 0 ? 0 : target.hp - this.cannonPower
			target.hp = newHp
			target.updateHpBar()
			if (newHp === 0) {
				target.lose()
				return
			}

			await delay(500)
		}
		await delay(1000)
		this.startAttack(target)
	}

	stopAttack(target) {
		this.attackTarget = null
	}

	sumResurces(target = this) {
		let sum = 0
		for (const key in target.resources) {
			if (Object.hasOwnProperty.call(target.resources, key)) {
				const element = target.resources[key]
				if (key === 'gold') continue
				sum += element
			}
		}
		return sum
	}
}

class PlayerShip extends Ship {
	xpNeeded
	constructor() {
		super({ type: 'player', level: 1, id: 0 })
		this.setXpNeeded()
		this.DOMShipWrap.classList.add('player')
		this.updateResourcesVisual()
	}

	setXpNeeded() {
		const shipTemplate = this.getShipTemplateByLevel(this.level + 1)
		if (shipTemplate) {
			this.xpNeeded = shipTemplate.xpNeeded
		} else {
			this.xpNeeded = this.getShipTemplateByLevel(this.level).xpNeeded
		}
	}

	updateLevel() {
		if (xp >= this.xpNeeded) {
			this.level++
			this.setXpNeeded()
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
			this.updateShipImageDirection()
			this.updateLevelText()
			this.updateHpBar()
			this.resetMotionAndAttackCells()
			this.getMotionCellRange()
			this.getAttackRangeCells()
			this.updateResourcesVisual()
		}
	}

	updateResourcesVisual() {
		for (const [key, value] of Object.entries(this.resources)) {
			const element = document.getElementById(key)
			element.innerText = value
		}
		const element = document.getElementById('xp')
		element.innerText = this.xp + '/' + this.xpNeeded
	}

	/**
	 * Thing to d when the payer loses
	 */
	lose() {
		this.stopAttack()
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
		this.handleShipTriggerAttackDblclickBound = this.triggerAttack.bind(this)
		this.handleShipSelectClickBound = this.selectShip.bind(this)
		this.DOMShipWrap.parentElement.addEventListener(
			'dblclick',
			this.handleShipTriggerAttackDblclickBound
		)
		this.DOMShipWrap.parentElement.addEventListener('click', this.handleShipSelectClickBound)
	}

	selectShip(event) {
		if (event.type === 'dblclick') {
			this.DOMShipWrap.classList.add('selected')
			return
		}
		if (!event.target.children[0].classList.contains('selected')) {
			const previusSelectedShips = document.querySelectorAll('.ship.selected.bot')
			if (previusSelectedShips.length) {
				previusSelectedShips.forEach(ship => ship.classList.remove('selected'))
			}
		}
		if (
			player.attackRangeCells.find(
				coordinate => coordinate.x === this.posX && coordinate.y === this.posY
			)
		) {
			this.DOMShipWrap.classList.toggle('selected')
		}
	}

	triggerAttack(event) {
		this.selectShip(event)
		player.startAttack(this)
		if (this.isInAttackRange(player)) {
			this.startAttack(player)
		}
	}

	static extractLevel() {
		const playerLevel = shipsArray[0].level
		const chaches = shipsExtractionChanches[playerLevel]
		const expandedChaches = shipsTemplate.flatMap((shipTemplate, index) =>
			Array(chaches[index]).fill(shipTemplate)
		)
		return expandedChaches[Math.floor(Math.random() * expandedChaches.length)].level
	}

	reparationMethod() {
		let initialHp = this.hp

		if (this.hp < this.maxHp) {
			if ((this.maxHp - this.hp) / 10 <= this.gold) {
				this.hp += (this.maxHp - this.hp) / 10
				this.gold -= (this.maxHp - this.hp) / 10
			} else {
				this.hp += this.gold
				this.gold = 0
			}
		}
		if (this.hp > initialHp) {
			this.greenBlink()
		}
	}

	greenBlink() {
		let startTime = null
		const blink = (timestamp) => {
			if (!startTime) startTime = timestamp
			const elapsed = timestamp - startTime

			// Calcola e applica l'opacità
			let opacity = Math.abs(Math.sin(elapsed / 200)); // Ciclo di animazione ogni 200 ms
			this.style.backgroundColor = `rgba(0, 255, 0, ${opacity})`; // Verde con opacità variabile

			if (elapsed < 400) { // Durata totale dell'animazione: 0.4 secondi
				requestAnimationFrame(blink);
			} else {
				this.style.backgroundColor = ''; // Resetta lo stile di background
			}
		}

		requestAnimationFrame(blink);
	}

	/**
	 * Da fare:
	 * aggiungere un obbiettivo di cella da raggiungere (magari oltre al metà della mappa)
	 * la cella obittivo deve ovviamnte non essere quelle deelle deadzones dei porti
	 * per calcolare quale cella scegliereper muoversi ordinare in mod ascendente le celle col metodo calculateDistance
	 * in modo da calcolare la distanza tra la cella in motionRangeCells e quella obiettivo
	 * muovere la nave nella cella alla prima posizione [0] dell'array ordinato
	 */

	makeChoice() {
		if (this.hp > (this.maxHp / 2)) {
			if (this.attackTarget) {
				// Se attackTarget è > 0, si muove verso il giocatore
				if (this.calculateDistance(player.posX, player.posY) > this.attackRange) {
					const directionToPlayer = this.getDirectionTo(player.posX, player.posY)
					const moveTo = this.getMoveTowards(directionToPlayer)
					if (moveTo) {
						const targetCell = document.querySelector(`.cell[data-col="${moveTo.x}"][data-row="${moveTo.y}"]`)
						//Insegue il player solo una volta su due per dare fiato al player che scappa
						if (Math.random() < 0.5) {
							this.moveShip(targetCell)
						}
					}
				}
			} else {
				// Si muove casualmente
				const moveTo = this.motionRangeCells[Math.floor(Math.random() * this.motionRangeCells.length)]
				const targetCell = document.querySelector(`.cell[data-col="${moveTo.x}"][data-row="${moveTo.y}"]`)
				this.mouveShip(targetCell)
			}
		} else {
			this.runRecovery()
		}
	}

	getDirectionTo(targetX, targetY) {
		// Restituisce la direzione verso un target specificato
		const deltaX = targetX - this.posX
		const deltaY = targetY - this.posY
		const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
		return { x: deltaX / length, y: deltaY / length }
	}

	getMoveTowards(direction) {
		// Calcola la cella verso cui muoversi in base alla direzione
		let bestMove = null
		let minDistance = 1000//milioni
		for (let cell of this.motionRangeCells) {
			let distance = this.calculateDistance(cell.x, cell.y);
			if (distance < minDistance && distance <= this.motionRange) {
				minDistance = distance
				bestMove = cell
			}
		}
		return bestMove
	}

	getDirectionTo(targetX, targetY) {
		// Restituisce la direzione verso un target specificato
		const deltaX = targetX - this.posX;
		const deltaY = targetY - this.posY;
		// Normalizza la direzione
		const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		return { x: deltaX / length, y: deltaY / length };
	}

	getMoveTowards(direction) {
		// Calcola la cella verso cui muoversi in base alla direzione
		let bestMove = null;
		let minDistance = Infinity;
		for (let cell of this.motionRangeCells) {
			let distance = this.calculateDistance(cell.x, cell.y);
			if (distance < minDistance && distance <= this.motionRange) {
				minDistance = distance;
				bestMove = cell;
			}
		}
		return bestMove;
	}

	openBarrelInterface() { }

	spawnBarrel() {
		const cell = document.querySelector(`.cell[data-col="${this.posX}"][data-row="${this.posY}"]`)
		const barrelImg = document.createElement('img')
		barrelImg.src = '../assets/sprites/Barrel.png'
		barrelImg.classList.add('barrel')
		cell.appendChild(barrelImg)
		barrelImg.parentElement.addEventListener('click', this.openBarrelInterface)
	}

	lose() {
		this.stopAttack()
		player.xp += this.xpGiven
		if (this.sumResurces(this) + this.sumResurces(player) > player.maxStorage) {
			player.resources.gold += this.resources.gold
			new Barrel(this)
		} else {
			for (const key in player.resources) {
				if (Object.hasOwnProperty.call(player.resources, key)) {
					player.resources[key] = player.resources[key] + this.resources[key]
				}
			}
		}
		player.updateResourcesVisual()
		player.updateLevel()
		this.DOMShipWrap.parentElement.removeEventListener(
			'dblclick',
			this.handleShipTriggerAttackDblclickBound
		)
		this.DOMShipWrap.parentElement.removeEventListener('click', this.handleShipSelectClickBound)
		this.DOMShipWrap.remove()
		shipsArray.splice(
			shipsArray.findIndex(ship => ship.id === this.id),
			1
		)
	}
}

export { PlayerShip, BotShip }
