import { Position } from '../types'

/**
 * Generates a random integer between 0 (inclusive) and max (exclusive)
 */
export const randomInt = (max: number): number => {
	return Math.floor(Math.random() * max)
}

/**
 * Calculates the distance between two points
 */
export const calculateDistance = (from: Position, to: Position): number => {
	return Math.floor(Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)))
}

/**
 * Checks if the device supports touch events
 */
export const isTouchDevice = (): boolean => {
	return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * Creates a delay promise
 */
export const delay = (milliseconds: number): Promise<void> => {
	return new Promise(resolve => {
		setTimeout(resolve, milliseconds)
	})
}
