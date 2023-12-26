import { shipsTemplate, templateResources } from './shipsModule.js'
export class Ship {
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
	motionRange
	attackRange
	speed
	sprites
	x
	y

	constructor(type, level = 1) {
		this.type = type
		this.level = level
	}

	getShipTemplateByLevel(level) {
		return shipsTemplate.find(ship => ship.level === level)
	}
}

new Ship('player', 2)
