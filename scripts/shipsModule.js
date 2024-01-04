let timeDayElapsed = 0
const dayDuration = 1000 * 60 * 10 //10 minuti
const daytimeDuration = (dayDuration / 5) * 3
const nighttimeDuration = (dayDuration / 5) * 2

let daysWithoutWater = 0
let daysWithoutFood = 0
const maxDaysWithoutWater = 1 // numero massimo di gionni in cui l'eqipaggio può sopravvivere senza bere. Se viene superato il giocatore ha perso.
const maxDaysWithoutFood = 3 // numero massimo di turni in cui l'eqipaggio può sopravvivere senza mangiare. Se viene superato il giocatore ha perso.
const hpRapairOnPlaceRate = 0.4
const shipMotionBaseTime = 950 //in millisecondi

const templateResources = {
	gold: 0, //moneta di scambio del gioco
	rhum: 0, //oggetto di scambio nei porti amici
	food: 0, //commericiabile nei porti amici. Richiesta per a sopravvivenza dell'equipaggio
	water: 0,
}

const templateResourcesItaTranstation = {
	gold: 'oro',
	rhum: 'rum',
	food: 'cibo',
	water: 'acqua',
}

const shipsExtractionChanches = {
	1: [19, 17, 16, 13, 11, 9, 7, 4, 3, 1],
	2: [17, 16, 14, 12, 10, 10, 8, 7, 4, 2],
	3: [14, 14, 12, 11, 9, 12, 10, 8, 6, 4],
	4: [13, 13, 11, 10, 8, 13, 11, 9, 7, 5],
	5: [13, 11, 10, 9, 7, 14, 12, 10, 8, 6],
	6: [11, 10, 9, 8, 6, 16, 13, 11, 9, 7],
	7: [10, 9, 8, 7, 5, 17, 14, 12, 10, 8],
	8: [9, 8, 7, 6, 4, 18, 15, 13, 11, 9],
	9: [8, 7, 5, 5, 2, 20, 17, 14, 12, 10],
	10: [7, 6, 5, 4, 2, 21, 18, 15, 12, 10],
}

const maxBotShipsCount = 15

const shipsTemplate = [
	{
		level: 1,
		hp: 100, // hp decrementabile se si subiscono danni
		maxHp: 100, // hp massimo
		cannonPower: 15, // danno per colpo di cannone
		cannonAmount: 2, // il numero di cannoni influenza quante cannonate si possono sparare per turno
		maxStorage: 70, // il totale di risorse accumulabili nella stiva
		crew: 3, // equipaggio a bordo della nave, ogni giorno richiede delle risorse per sopravvivere
		xpNeeded: 0, // xp richiesto per poter sbloccare la nave di livello x
		xpGiven: 50, // xp dato dalla distruzione della nave di livello x
		autoStartAttack: false, // per le navi bot, se iniziano ad attaccare il giocatore automaticamente se si trova nel loro raggio di attacco
		autoFollow: false, // per le navi bot, se continueranno a seguire il giocatore una volta cominciato l'attacco
		motionRange: 2, // raggio di movimento della nave in celle
		attackRange: 2, // raggio di attacco della nave in celle
		speed: 1.0, // velocità di animazione della nave
		sprites: {
			player: {
				up: 'Up_playership.png',
				left: 'Left_playership.png',
				down: 'Down_playership.png',
				right: 'Right_playership.png',
			},
			bot: {
				up: 'Left_botship_lvl1.png',
				left: 'Left_botship_lvl1.png',
				down: 'Left_botship_lvl1.png',
				right: 'Left_botship_lvl1.png',
			},
		},
	},
	{
		level: 2,
		hp: 120,
		maxHp: 120,
		cannonPower: 18,
		cannonAmount: 3,
		maxStorage: 84,
		crew: 3,
		xpNeeded: 250,
		xpGiven: 60,
		autoStartAttack: false,
		autoFollow: false,
		motionRange: 2,
		attackRange: 1,
		speed: 1.5,
		sprites: {
			player: {
				up: 'Up_playership.png',
				left: 'Left_playership.png',
				down: 'Down_playership.png',
				right: 'Right_playership.png',
			},
			bot: {
				up: 'Left_botship_lvl1.png',
				left: 'Left_botship_lvl1.png',
				down: 'Left_botship_lvl1.png',
				right: 'Left_botship_lvl1.png',
			},
		},
	},
	{
		level: 3,
		hp: 156,
		maxHp: 156,
		cannonPower: 21,
		cannonAmount: 4,
		maxStorage: 109,
		crew: 4,
		xpNeeded: 610,
		xpGiven: 78,
		autoStartAttack: false,
		autoFollow: false,
		motionRange: 3,
		attackRange: 2,
		speed: 2.0,
		sprites: {
			player: {
				up: 'Up_playership.png',
				left: 'Left_playership.png',
				down: 'Down_playership.png',
				right: 'Right_playership.png',
			},
			bot: {
				up: 'Left_botship_lvl1.png',
				left: 'Left_botship_lvl1.png',
				down: 'Left_botship_lvl1.png',
				right: 'Left_botship_lvl1.png',
			},
		},
	},
	{
		level: 4,
		hp: 218,
		maxHp: 218,
		cannonPower: 25,
		cannonAmount: 5,
		maxStorage: 153,
		crew: 5,
		xpNeeded: 1156,
		xpGiven: 109,
		autoStartAttack: true,
		autoFollow: false,
		motionRange: 4,
		attackRange: 3,
		speed: 2.5,
		sprites: {
			player: {
				up: 'Up_playership.png',
				left: 'Left_playership.png',
				down: 'Down_playership.png',
				right: 'Right_playership.png',
			},
			bot: {
				up: 'Left_botship_lvl1.png',
				left: 'Left_botship_lvl1.png',
				down: 'Left_botship_lvl1.png',
				right: 'Left_botship_lvl1.png',
			},
		},
	},
	{
		level: 5,
		hp: 328,
		maxHp: 328,
		cannonPower: 31,
		cannonAmount: 6,
		maxStorage: 230,
		crew: 8,
		xpNeeded: 2028,
		xpGiven: 164,
		autoStartAttack: true,
		autoFollow: true,
		motionRange: 5,
		attackRange: 4,
		speed: 3.0,
		sprites: {
			player: {
				up: 'Up_playership.png',
				left: 'Left_playership.png',
				down: 'Down_playership.png',
				right: 'Right_playership.png',
			},
			bot: {
				up: 'Left_botship_lvl1.png',
				left: 'Left_botship_lvl1.png',
				down: 'Left_botship_lvl1.png',
				right: 'Left_botship_lvl1.png',
			},
		},
	},
	{
		level: 6,
		hp: 524,
		maxHp: 524,
		cannonPower: 37,
		cannonAmount: 7,
		maxStorage: 367,
		crew: 13,
		xpNeeded: 3504,
		xpGiven: 262,
		autoStartAttack: true,
		autoFollow: true,
		motionRange: 6,
		attackRange: 5,
		speed: 3.5,
		sprites: {
			player: {
				up: 'Up_playership.png',
				left: 'Left_playership.png',
				down: 'Down_playership.png',
				right: 'Right_playership.png',
			},
			bot: {
				up: 'Left_botship_lvl1.png',
				left: 'Left_botship_lvl1.png',
				down: 'Left_botship_lvl1.png',
				right: 'Left_botship_lvl1.png',
			},
		},
	},
	{
		level: 7,
		hp: 891,
		maxHp: 891,
		cannonPower: 44,
		cannonAmount: 8,
		maxStorage: 624,
		crew: 22,
		xpNeeded: 6124,
		xpGiven: 446,
		autoStartAttack: true,
		autoFollow: true,
		motionRange: 7,
		attackRange: 6,
		speed: 4.0,
		sprites: {
			player: {
				up: 'Up_playership.png',
				left: 'Left_playership.png',
				down: 'Down_playership.png',
				right: 'Right_playership.png',
			},
			bot: {
				up: 'Left_botship_lvl1.png',
				left: 'Left_botship_lvl1.png',
				down: 'Left_botship_lvl1.png',
				right: 'Left_botship_lvl1.png',
			},
		},
	},
	{
		level: 8,
		hp: 1604,
		maxHp: 1604,
		cannonPower: 53,
		cannonAmount: 9,
		maxStorage: 1123,
		crew: 39,
		xpNeeded: 11030,
		xpGiven: 802,
		autoStartAttack: true,
		autoFollow: true,
		motionRange: 8,
		attackRange: 7,
		speed: 4.5,
		sprites: {
			player: {
				up: 'Up_playership.png',
				left: 'Left_playership.png',
				down: 'Down_playership.png',
				right: 'Right_playership.png',
			},
			bot: {
				up: 'Left_botship_lvl1.png',
				left: 'Left_botship_lvl1.png',
				down: 'Left_botship_lvl1.png',
				right: 'Left_botship_lvl1.png',
			},
		},
	},
	{
		level: 9,
		hp: 3047,
		maxHp: 3047,
		cannonPower: 64,
		cannonAmount: 10,
		maxStorage: 2133,
		crew: 75,
		xpNeeded: 20654,
		xpGiven: 1524,
		autoStartAttack: true,
		autoFollow: true,
		motionRange: 9,
		attackRange: 8,
		speed: 5.0,
		sprites: {
			player: {
				up: 'Up_playership.png',
				left: 'Left_playership.png',
				down: 'Down_playership.png',
				right: 'Right_playership.png',
			},
			bot: {
				up: 'Left_botship_lvl1.png',
				left: 'Left_botship_lvl1.png',
				down: 'Left_botship_lvl1.png',
				right: 'Left_botship_lvl1.png',
			},
		},
	},
	{
		level: 10,
		hp: 6095,
		maxHp: 6095,
		cannonPower: 77,
		cannonAmount: 12,
		maxStorage: 4266,
		crew: 150,
		xpNeeded: 40466,
		xpGiven: 3048,
		autoStartAttack: true,
		autoFollow: true,
		motionRange: 10,
		attackRange: 9,
		speed: 5.5,
		sprites: {
			player: {
				up: 'Up_playership.png',
				left: 'Left_playership.png',
				down: 'Down_playership.png',
				right: 'Right_playership.png',
			},
			bot: {
				up: 'Left_botship_lvl1.png',
				left: 'Left_botship_lvl1.png',
				down: 'Left_botship_lvl1.png',
				right: 'Left_botship_lvl1.png',
			},
		},
	},
]

const shipsArray = []

export {
	timeDayElapsed,
	dayDuration,
	daytimeDuration,
	nighttimeDuration,
	maxDaysWithoutWater,
	maxDaysWithoutFood,
	daysWithoutWater,
	daysWithoutFood,
	shipMotionBaseTime,
	templateResources,
	templateResourcesItaTranstation,
	shipsExtractionChanches,
	maxBotShipsCount,
	shipsTemplate,
	shipsArray,
	hpRapairOnPlaceRate,
}
