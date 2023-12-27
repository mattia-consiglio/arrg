// const shipsArray = [
// 	{

//		id: 0 // 0 always assigned to the player
// 		x: 100,
// 		y: 100,
// 		level: 1,
// 		attackedBy: [],
// 		attacking: ''
// 	},
// 	{
// 		type: 'bot',
// 		id: 1,
// 		x: 100,
// 		y: 100,
// 		level: 1,
// 		attackedBy: [],
// 		attacking: ''
// 	}
// ]
export const morningRounds = 3
export const nightRounds = 2
export const dayRounds = morningRounds + nightRounds
export const maxRoundsWithoutWater = Math.floor(1 * dayRounds) // numero massimo di turni in cui l'eqipaggio può sopravvivere senza bere. Se viene superato il giocatore ha perso.
export const maxRoundsWithoutFood = Math.floor(3 * dayRounds) // numero massimo di turni in cui l'eqipaggio può sopravvivere senza mangiare. Se viene superato il giocatore ha perso.
export const hpRapairOnPlaceRate = 0.4
export const shipMotionBaseTime = 1000 //in millisecondi

export const templateResources = {
	gold: 0, //moneta di scambio del gioco
	rhum: 0, //oggetto di scambio nei porti amici
	food: 0, //commericiabile nei porti amici. Richiesta per a sopravvivenza dell'equipaggio
	water: 0,
}

export const shipsTemplate = [
	{
		level: 1,
		hp: 100, //hp decrementabile se si subiscono danni
		maxHp: 100, // hp massimo
		cannonPower: 15, //danno per colpo di cannone
		cannonAmount: 2, //il numero di cannoni influenza quante cannonate si possono sparare per turno
		maxStorage: 50, // il totale di risorse accumulabili nella stiva
		crew: 3, // equipaggio a bordo della nave, ognigiorno richiede delle risorse per sopravvivere
		xpNeeded: 0, //xp richiesto poter sbloccare la nave di livello x
		xpGiven: 50, // xp dato dalla distruzione della nave di livello x
		autoStartAttack: false, // per le navi bot, se iniziano ad attaccare il giocatore automaticamente se si trova nel loro raggio di attacco
		autoFollow: false, // per le navi bot, se continueranno a seguire il giocatore una volta cominciato l'attacco
		motionRange: 2, // raggio di movimento della nave in celle
		attackRange: 2, // raggio di attacco della nave in celle
		speed: 1, // velocità di animizione della nave
		sprites: {
			player: {
				up: 'Up_playership.png',
				left: 'Left_playership.png',
				down: 'Down_playership.png',
				right: 'Right_playership.png',
			},
			bot: {
				up: '',
				left: '',
				down: '',
				right: '',
			},
		},
	},
	{
		level: 2,
		hp: 200,
		maxHp: 200,
		cannonPower: 20,
		cannonAmount: 3,
		maxStorage: 100,
		crew: 6,
		xpNeeded: 300,
		xpGiven: 100,
		autoStartAttack: false,
		autoFollow: false,
		motionRange: 3,
		attackRange: 2,
		speed: 1.5,
		sprites: {
			player: {
				up: 'Up_playership.png',
				left: 'Left_playership.png',
				down: 'Down_playership.png',
				right: 'Right_playership.png',
			},
			bot: {
				up: '',
				left: '',
				down: '',
				right: '',
			},
		},
	},
	{
		level: 3,
		hp: 350,
		maxHp: 350,
		cannonPower: 25,
		cannonAmount: 4,
		maxStorage: 175,
		crew: 11,
		xpNeeded: 1100,
		xpGiven: 100,
		autoStartAttack: false,
		autoFollow: false,
		motionRange: 4,
		attackRange: 3,
		speed: 2,
		sprites: {
			player: {
				up: 'Up_playership.png',
				left: 'Left_playership.png',
				down: 'Down_playership.png',
				right: 'Right_playership.png',
			},
			bot: {
				up: '',
				left: '',
				down: '',
				right: '',
			},
		},
	},
	{
		level: 4,
		hp: 600,
		maxHp: 600,
		cannonPower: 30,
		cannonAmount: 5,
		maxStorage: 300,
		crew: 18,
		xpNeeded: 2850,
		xpGiven: 100,
		autoStartAttack: true,
		autoFollow: false,
		motionRange: 5,
		attackRange: 4,
		speed: 2.5,
		sprites: {
			player: {
				up: 'Up_playership.png',
				left: 'Left_playership.png',
				down: 'Down_playership.png',
				right: 'Right_playership.png',
			},
			bot: {
				up: '',
				left: '',
				down: '',
				right: '',
			},
		},
	},
	{
		level: 5,
		hp: 2000,
		maxHp: 2000,
		cannonPower: 40,
		cannonAmount: 7,
		maxStorage: 1000,
		crew: 60,
		xpNeeded: 6450,
		xpGiven: 1000,
		autoStartAttack: true,
		autoFollow: true,
		motionRange: 6,
		attackRange: 5,
		speed: 3,
		sprites: {
			player: {
				up: 'Up_playership.png',
				left: 'Left_playership.png',
				down: 'Down_playership.png',
				right: 'Right_playership.png',
			},
			bot: {
				up: '',
				left: '',
				down: '',
				right: '',
			},
		},
	},
	{
		level: 6,
		hp: 3800,
		maxHp: 3800,
		cannonPower: 50,
		cannonAmount: 8,
		maxStorage: 1900,
		crew: 114,
		xpNeeded: 12900,
		xpGiven: 1900,
		autoStartAttack: true,
		autoFollow: true,
		motionRange: 7,
		attackRange: 6,
		speed: 3.5,
		sprites: {
			player: {
				up: 'Up_playership.png',
				left: 'Left_playership.png',
				down: 'Down_playership.png',
				right: 'Right_playership.png',
			},
			bot: {
				up: '',
				left: '',
				down: '',
				right: '',
			},
		},
	},
	{
		level: 7,
		hp: 7500,
		maxHp: 7500,
		cannonPower: 60,
		cannonAmount: 7,
		maxStorage: 3750,
		crew: 23,
		xpNeeded: 43300,
		xpGiven: 3750,
		autoStartAttack: true,
		autoFollow: true,
		motionRange: 8,
		attackRange: 7,
		speed: 4,
		sprites: {
			player: {
				up: 'Up_playership.png',
				left: 'Left_playership.png',
				down: 'Down_playership.png',
				right: 'Right_playership.png',
			},
			bot: {
				up: '',
				left: '',
				down: '',
				right: '',
			},
		},
	},
	{
		level: 8,
		hp: 15000,
		maxHp: 15000,
		cannonPower: 70,
		cannonAmount: 8,
		maxStorage: 7500,
		crew: 450,
		xpNeeded: 110800,
		xpGiven: 7500,
		autoStartAttack: true,
		autoFollow: true,
		motionRange: 9,
		attackRange: 8,
		speed: 4.5,
		sprites: {
			player: {
				up: 'Up_playership.png',
				left: 'Left_playership.png',
				down: 'Down_playership.png',
				right: 'Right_playership.png',
			},
			bot: {
				up: '',
				left: '',
				down: '',
				right: '',
			},
		},
	},
	{
		level: 9,
		hp: 3000,
		maxHp: 30000,
		cannonPower: 70,
		cannonAmount: 8,
		maxStorage: 15000,
		crew: 900,
		xpNeeded: 260800,
		xpGiven: 15000,
		autoStartAttack: true,
		autoFollow: true,
		motionRange: 9,
		attackRange: 8,
		speed: 5,
		sprites: {
			player: {
				up: 'Up_playership.png',
				left: 'Left_playership.png',
				down: 'Down_playership.png',
				right: 'Right_playership.png',
			},
			bot: {
				up: '',
				left: '',
				down: '',
				right: '',
			},
		},
	},
	{
		level: 10,
		hp: 60000,
		maxHp: 60000,
		cannonPower: 70,
		cannonAmount: 8,
		maxStorage: 300000,
		crew: 1800,
		xpNeeded: 590800,
		xpGiven: 300000,
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
				up: '',
				left: '',
				down: '',
				right: '',
			},
		},
	},
]
export const shipsArray = []
