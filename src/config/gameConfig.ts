import { Resources, ShipTemplate } from '../types'

export const CELL_WIDTH = 100
export const ROW_COUNT = 40
export const COL_COUNT = 40
export const PORT_RANGE = 2
export const SHIP_MOTION_BASE_TIME = 1000
export const MAX_BOT_SHIPS_COUNT = 5

export const TEMPLATE_RESOURCES: Resources = {
	xp: 0,
	gold: 0,
	rhum: 0,
	water: 0,
	food: 0,
}

export const SHIPS_TEMPLATE: ShipTemplate[] = [
	{
		level: 1,
		hp: 100,
		maxHp: 100,
		cannonPower: 10,
		cannonAmount: 1,
		maxStorage: 10,
		crew: 5,
		motionRange: 3,
		attackRange: 2,
		speed: 1,
		sprites: {
			player: [
				'/sprites/Left_playership.png',
				'/sprites/Right_playership.png',
				'/sprites/Up_playership.png',
				'/sprites/Down_playership.png',
			],
			bot: [
				'/sprites/Left_botship_lvl1.png',
				'/sprites/Left_botship_lvl1.png',
				'/sprites/Left_botship_lvl1.png',
				'/sprites/Left_botship_lvl1.png',
			],
		},
	},
	{
		level: 2,
		hp: 150,
		maxHp: 150,
		cannonPower: 15,
		cannonAmount: 2,
		maxStorage: 15,
		crew: 8,
		motionRange: 4,
		attackRange: 3,
		speed: 1.2,
		sprites: {
			player: [
				'/sprites/Left_playership.png',
				'/sprites/Right_playership.png',
				'/sprites/Up_playership.png',
				'/sprites/Down_playership.png',
			],
			bot: [
				'/sprites/Left_botship_lvl1.png',
				'/sprites/Left_botship_lvl1.png',
				'/sprites/Left_botship_lvl1.png',
				'/sprites/Left_botship_lvl1.png',
			],
		},
	},
	{
		level: 3,
		hp: 200,
		maxHp: 200,
		cannonPower: 20,
		cannonAmount: 3,
		maxStorage: 20,
		crew: 12,
		motionRange: 5,
		attackRange: 4,
		speed: 1.4,
		sprites: {
			player: [
				'/sprites/Left_playership.png',
				'/sprites/Right_playership.png',
				'/sprites/Up_playership.png',
				'/sprites/Down_playership.png',
			],
			bot: [
				'/sprites/Left_botship_lvl1.png',
				'/sprites/Left_botship_lvl1.png',
				'/sprites/Left_botship_lvl1.png',
				'/sprites/Left_botship_lvl1.png',
			],
		},
	},
]

export const SHIPS_EXTRACTION_CHANCES = [70, 25, 5]
