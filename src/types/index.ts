export interface Resources {
	xp: number
	gold: number
	rhum: number
	water: number
	food: number
}

export interface ShipTemplate {
	level: number
	hp: number
	maxHp: number
	cannonPower: number
	cannonAmount: number
	maxStorage: number
	crew: number
	motionRange: number
	attackRange: number
	speed: number
	sprites: {
		player: string[]
		bot: string[]
	}
}

export interface Port {
	direction: 'nord' | 'sud' | 'est' | 'ovest'
	owner: 'player' | 'bot'
	interactionCells: { x: number; y: number }[]
	deadZones: { x: number; y: number }[]
}

export interface MapCell {
	x: number
	y: number
	type?: string
	direction?: 'nord' | 'sud' | 'est' | 'ovest'
	hasShip?: boolean
	hasBarrel?: boolean
	interactive?: boolean
	isDeadZone?: boolean
	isMolo?: boolean
	isAmichevole?: boolean
	isNemico?: boolean
}

export interface Position {
	x: number
	y: number
}

export type ShipType = 'player' | 'bot'
export type Direction = 'up' | 'down' | 'left' | 'right'

export interface GameContextType {
	mapCells: MapCell[]
	ports: Port[]
	playerPosition: Position
	playerResources: Resources
	playerLevel: number
	playerHp: number
	playerMaxHp: number
	isDragging: boolean
	setIsDragging: (isDragging: boolean) => void
	movePlayer: (x: number, y: number) => void
	updatePlayerResources: (resources: Partial<Resources>) => void
	spawnPort: (x: number, y: number, direction: Port['direction'], ownedByPlayer: boolean) => void
	initGame: () => void
	updatePlayerLevel: (level: number) => void
	updatePlayerHp: (hp: number) => void
	updatePlayerMaxHp: (maxHp: number) => void
	placePlayerInFriendlyPort: () => void
}
