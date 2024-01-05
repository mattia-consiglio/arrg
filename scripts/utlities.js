const randomInt = (max, min = 0) => {
	return Math.floor(Math.random() * (max - min) + min)
}

const getDOMCell = (x, y) => {
	return document.querySelector(`.cell[data-col="${x}"][data-row="${y}"]`)
}

export { randomInt, getDOMCell }
