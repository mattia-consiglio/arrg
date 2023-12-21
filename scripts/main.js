const gameEl = document.getElementById('game')
const ships = {}
const amount = 100

//variabili comuni a tutti i metodi per tracciare il mouse
let mouseX
let mouseY

//variabili per la playership 
let playerX
let playerY
let playerGraphic = document.createElement("img")
playerGraphic.src = "../assets/sprites/Ship.png"
playerGraphic.style.transform = "translate(-26%, -50%)";
const playerShip = document.createElement("div")
playerShip.style.height = "100px"
playerShip.style.width = "100px"
playerShip.id = "player"
playerShip.style.position = "absolute"
playerShip.style.transition = "top 0.5s, left 0.5s;"
playerShip.style.border = "1px solid red"
playerShip.appendChild(playerGraphic)
let playerShipSpeed = 2
//////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('mousemove', function (event) {
	mouseX = event.clientX
	mouseY = event.clientY
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Metodo per ottenere le caselle visibili a schermo. Solo gli 
//elementi grafici di questa cella vengono animati, gli altri vengono messi in hidden. Funzione da usare in futuro
const getVisibleCells = () => {
	const visibleCells = []
	const map = document.querySelector('.map')
	const cells = map.querySelectorAll('.cell')

	// Calcola i confini della finestra
	const viewportTop = window.scrollY
	const viewportLeft = window.scrollX
	const viewportBottom = viewportTop + window.innerHeight
	const viewportRight = viewportLeft + window.innerWidth

	cells.forEach(cell => {
		const cellRect = cell.getBoundingClientRect()
		const cellTop = cellRect.top + window.scrollY
		const cellLeft = cellRect.left + window.scrollX
		const cellBottom = cellTop + cellRect.height
		const cellRight = cellLeft + cellRect.width

		// Verifica se la cella è visibile all'interno della finestra
		if (cellTop < viewportBottom && cellBottom > viewportTop &&
			cellLeft < viewportRight && cellRight > viewportLeft) {
			visibleCells.push(cell)
		}
	});
	return visibleCells
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const templateDiFaiQualcosaConXeYdellaCella = function (i, j) {
	console.log(`Cell: X ${i}, Y ${j}`)
	// La i è la X, la j è la Y
}

const popUpSchermo = function (messaggio) {
	const divMessaggio = document.createElement("div")
	const pMessaggio = document.createElement("p")
	pMessaggio.textContent = messaggio
	const buttonClose = document.createElement("p")
	buttonClose.innerText = "[CHIUDI]"
	buttonClose.onclick = function () {
		divMessaggio.remove()
	}
	divMessaggio.appendChild(pMessaggio)
	divMessaggio.appendChild(buttonClose)

	divMessaggio.style.display = "fixed"
	divMessaggio.style.top = "50%"
	divMessaggio.style.left = "50%"
	divMessaggio.transform = `translate(-50%, -50%)`

	console.log(messaggio)
	document.getElementsByTagName("body")[0].appendChild(divMessaggio)
}


const popUpBaloon = function (i, j, cell) {

	const removeBalloon = function () {
		balloon.remove()
	}

	const spostaPlayer = function (x, y) {
		balloon.remove()
		//if tuttocorretto
		setPlayerPosition(i, j)
	}
	if (document.getElementById("mouse-balloon")) {
		balloon.remove()
	}
	// Creazione del balloon
	const balloon = document.createElement('div')
	balloon.id = 'mouse-balloon'
	balloon.style.position = 'fixed'
	balloon.style.left = `${mouseX - 60}px`
	balloon.style.top = `${mouseY - 60}px`
	balloon.style.padding = `20px`
	balloon.style.backgroundColor = "black"
	balloon.style.color = "White"
	balloon.style.borderColor = "red"
	balloon.style.border = "3px"
	balloon.style.display = "flex"
	balloon.style.flexDirection = "column"
	balloon.style.maxWidth = "280px"
	const xIcon = document.createElement("div")
	xIcon.innerHTML = `<i class="far fa-times-circle" style="color: #cc0000;"></i>`
	xIcon.onclick = removeBalloon
	const headerBalloon = document.createElement("div")
	headerBalloon.style.display = "flex"
	headerBalloon.style.justifyContent = "space-between"
	const pHeader = document.createElement("p")
	pHeader.textContent = `[ info cellaX(${i})Y(${j}) ] --`
	headerBalloon.appendChild(pHeader)
	headerBalloon.appendChild(xIcon)

	const pMidBalloon = document.createElement("p")
	pMidBalloon.style.margin = "8px"
	pMidBalloon.innerText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque tempora soluta dolorem a molestias voluptas eos, doloribus sequi facere sint debitis quis laudantium necessitatibus voluptate porro quos assumenda! Assumenda, vitae."

	const divFooter = document.createElement("div")
	const buttonMuoviti = document.createElement("p")
	buttonMuoviti.innerText = "[VAI QUI]"
	buttonMuoviti.onclick = function () {
		spostaPlayer(i, j);
	}
	divFooter.appendChild(buttonMuoviti)

	balloon.appendChild(headerBalloon)
	balloon.appendChild(pMidBalloon)
	balloon.appendChild(divFooter)

	document.body.appendChild(balloon);
	// Impostazione del timeout per rimuovere il balloon dopo 30 secondi
	setTimeout(function () {
		if (balloon) {
			balloon.remove()
		}
	}, 30000)
}


const generateMap = (rows, cols) => {
	const map = document.createElement('div');
	map.classList.add('map');
	for (let i = 0; i < rows; i++) {
		const row = document.createElement('div');
		row.classList.add('row');

		for (let j = 0; j < cols; j++) {
			const cell = document.createElement('div');
			cell.classList.add('cell');
			cell.setAttribute('data-row', i);
			cell.setAttribute('data-col', j);

			// Aggiungi un listener di eventi con una funzione chiusura
			cell.addEventListener('click', (function (i, j) {
				return function () {
					//templateDiFaiQualcosaConXeYdellaCella(i, j)
					popUpBaloon(i, j, cell)
				};
			})(i, j))

			row.appendChild(cell)
		}
		map.appendChild(row)
	}
	gameEl.appendChild(map)
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getMapRelativeGaps = () => {
	const map = document.querySelector('.map')
	const offsets = map.getBoundingClientRect()

	const windowHeight = window.innerHeight
	const windowWidth = window.innerWidth
	return {
		top: offsets.top,
		left: offsets.left,
		bottom: windowHeight - offsets.bottom,
		right: windowWidth - offsets.right,
	}
}

const muoveMap = direction => {
	console.log(direction)

	const gaps = getMapRelativeGaps()
	// if (
	// 	gaps.top + amount > 100 ||
	// 	gaps.bottom + amount > 100 ||
	// 	gaps.left + amount > 100 ||
	// 	gaps.right + amount > 100
	// ) {
	// 	console.log('Non è possibile muovere la mappa')
	// 	return
	// }
	const map = document.querySelector('.map')
	const transform = window.getComputedStyle(map).transform
	// Estrarre i valori di traslazione (x, y)
	const matrix = new DOMMatrixReadOnly(transform)
	let x = matrix.m41
	let y = matrix.m42

	// Aggiornare x o y in base alla direzione
	switch (direction) {
		case 'up':
			if (gaps.bottom + amount < 100) {
				y -= amount
			}
			break
		case 'down':
			if (gaps.top + amount < 100) {
				y += amount
			}
			break
		case 'left':
			if (gaps.right + amount < 100) {
				x -= amount
			}
			break
		case 'right':
			if (gaps.left + amount < 100) {
				x += amount
			}

			break
		default:
			console.log('Direzione non valida')
	}

	// Applicare il nuovo valore di traslazione
	map.style.transform = `translate(${x}px, ${y}px)`
	setTimeout(getMapRelativeGaps, 200)
}

document.addEventListener('keydown', e => {
	if (e.key === 'ArrowUp') {
		muoveMap('up')
	}
	if (e.key === 'ArrowDown') {
		muoveMap('down')
	}
	if (e.key === 'ArrowLeft') {
		muoveMap('left')
	}
	if (e.key === 'ArrowRight') {
		muoveMap('right')
	}
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const setPlayerPosition = function (targetX, targetY, playerX, playerY) {
	if (!playerX || !playerY) {
		document.querySelector((`[data-row="${targetX}"][data-col="${targetY}"]`)).appendChild(playerShip)

		document.getElementById("player").top = 100
		document.getElementById("player").left = 100

		playerX = targetX
		playerY = targetY
	} else {
		document.getElementById("player").remove()
		document.querySelector((`[data-row="${targetX}"][data-col="${targetY}"]`)).appendChild(playerShip)

		playerX = targetX
		playerY = targetY
	}
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
generateMap(40, 40)

setPlayerPosition(24, 24)
setPlayerPosition(24, 26)
