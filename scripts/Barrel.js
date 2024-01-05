import { getDOMCell, player } from './main.js'
import { templateResourcesItaTranstation } from './shipsModule.js'
const barrels = []

class Barell {
	maxTimer = 1000 * 60 * 5
	timer = this.maxTimer
	intervalID = null
	mainWarapper
	content
	isOpened = false
	barrelInterfaceOpen = false
	tmpResorces
	index = 100

	constructor(botShip) {
		const { posX, posY, resources, id } = botShip
		this.id = id
		this.posX = posX
		this.posY = posY
		this.resources = resources
		console.log(document)
		const cell = getDOMCell(this.posX, this.posY)
		const barrelImg = document.createElement('img')
		barrelImg.src = '../assets/sprites/Barrel.png'
		barrelImg.classList.add('barrel')
		cell.appendChild(barrelImg)
		this.handleOpenInterfaceBound = this.openInterface.bind(this)
		barrelImg.parentElement.addEventListener('click', this.handleOpenInterfaceBound)
		delete this.resources.gold
		barrels.push({ ...this.resources, id: this.id })
		this.intervalID = setInterval(() => {
			this.updateTimer()
		}, 1000)
	}

	updateResource(resource, value) {
		this.resources[resource] = value
		const totalAvailableSpace = player.maxStorage - player.sumResurces()
		const availableSpace = parseInt(document.getElementById('availableSpace').innerText)
		console.log(availableSpace)

		for (const key in this.resources) {
			if (Object.hasOwnProperty.call(this.resources, key)) {
				const rangeInput = document.getElementById('range-' + key)
				const rangeValue = parseInt(rangeInput.value)
				const max = availableSpace + rangeValue

				rangeInput.max = max
				console.log(rangeInput.max)
			}
		}
	}

	openInterface() {
		this.mainWarapper = document.createElement('div')
		this.mainWarapper.classList.add('barrel-wrapper')
		this.content = document.createElement('div')
		this.content.classList.add('content')
		this.content.dataset.id = this.id
		this.barrelInterfaceOpen = true

		const barrelSum = player.sumResurces(this)
		const avilableSpace = player.maxStorage - player.sumResurces()
		const diff = Math.abs(barrelSum - avilableSpace)

		const main =
			barrelSum > avilableSpace
				? `
		<p>Sulla tua nave hai a solo <b>${avilableSpace}</b> slot liberi; il barile occupa <b>${barrelSum}</b>.</p>
		<p>Puoi prendere parte delle risorse del barile e abandonare le restanti, oppure andare a un porto amico e vendere le risorse per liberare <b>${diff}</b> slot</p>
		`
				: `
		<p>Sulla tua nave hai sufficienti slot per tutte le risorse nel barile. Dopo l'apertura ${
			diff === 1 ? 'rimarrà' : 'rimarranno'
		} ${diff} solt liberi.</p>
				`

		this.content.innerHTML = `
		<div class="header">
			<h1>Vuoi aprire il barile?</h1>
			<h2>Una volta aperto, affonderà.<br>Non aspettare troppo, mancano <span id="timer-${this.id}"></span> per affondare da solo</h2>
		</div>
		<div class="main">
		${main}
		</div>
		<div class="footer">
			<div class="btn" id="openBarrel">Apri</div>
			<div class="btn" id="closeBarrel">Apri più tardi</div>
		</div>
		`

		this.mainWarapper.appendChild(this.content)
		document.getElementsByTagName('body')[0].appendChild(this.mainWarapper)

		document.getElementById('openBarrel').addEventListener('click', () => {
			this.content.remove()
			this.content = document.createElement('div')
			this.content.classList.add('content')
			this.mainWarapper.appendChild(this.content)

			this.deleteBarrel()
			let availableSpace = player.maxStorage - player.sumResurces()
			const header = `<div class="header"><h1>Barile</h1><h2 >Slot rimanenti in stiva <b id="availableSpace">${availableSpace}</b></h2></div>`
			const main = document.createElement('div')
			main.classList.add('main')
			const footer = `<div class="footer"><div class="btn" id="confirm">Conferma</div></div>`
			this.content.insertAdjacentHTML('beforeEnd', header)
			const availableSpaceHTML = document.getElementById('availableSpace')

			for (const resourceName in this.resources) {
				if (Object.hasOwnProperty.call(this.resources, resourceName)) {
					console.log(availableSpace)
					const resourceValue = this.resources[resourceName]
					const translatedResourceName = templateResourcesItaTranstation[resourceName]
					console.log(translatedResourceName, resourceValue)
					const row = document.createElement('div')
					row.classList.add('row')
					const row1 = document.createElement('div')
					row1.classList.add('row')
					const row2 = document.createElement('div')
					row2.classList.add('row')

					let currentValue = 0

					const resourceCol = document.createElement('div')
					resourceCol.innerText = translatedResourceName

					const plusBtn = document.createElement('div')
					plusBtn.innerText = '+'

					const valueHTML = document.createElement('div')
					valueHTML.innerText = `[${currentValue}]`

					const minusBtn = document.createElement('div')
					minusBtn.innerText = '-'

					const rangeInput = document.createElement('input')
					rangeInput.type = 'range'
					rangeInput.value = 0
					rangeInput.nin = 0
					rangeInput.max = availableSpace
					rangeInput.id = 'range-' + resourceName

					plusBtn.addEventListener('click', () => {
						const value = availableSpace > 0 ? currentValue + 1 : currentValue

						const delta = currentValue - value
						currentValue = value
						rangeInput.value = currentValue
						valueHTML.innerText = `[${currentValue}]`
						availableSpace += delta
						availableSpaceHTML.innerText = availableSpace
						this.updateResource(resourceName, value)
					})

					minusBtn.addEventListener('click', () => {
						// console.log('minus')
						// console.log(availableSpace)

						const value = currentValue > 0 ? currentValue - 1 : currentValue
						const delta = currentValue - value
						currentValue = value
						rangeInput.value = currentValue
						valueHTML.innerText = `[${currentValue}]`
						availableSpace += delta
						availableSpaceHTML.innerText = availableSpace
						this.updateResource(resourceName, value)
					})

					rangeInput.addEventListener('input', e => {
						// console.log('range')
						// console.log(availableSpace)
						const value = parseInt(e.target.value, 10)
						const delta = currentValue - value
						currentValue = value
						valueHTML.innerText = `[${currentValue}]`
						availableSpace += delta
						availableSpaceHTML.innerText = availableSpace
						this.updateResource(resourceName, value)
					})

					row.appendChild(row1)
					row.appendChild(row2)

					row1.appendChild(resourceCol)
					row1.appendChild(plusBtn)
					row1.appendChild(valueHTML)
					row1.appendChild(minusBtn)

					row2.appendChild(rangeInput)

					main.appendChild(row)
				}
			}

			// Object.entries(this.resources).forEach(([resourceName, resourceValue]) => {
			// 	// const resourceValue = this.resources[resourceName]

			// })

			this.content.appendChild(main)

			this.content.insertAdjacentHTML('beforeEnd', footer)

			document.getElementById('confirm').addEventListener('click', () => {
				this.closeInterface()
			})
		})

		document.getElementById('closeBarrel').addEventListener('click', () => {
			this.closeInterface()
		})
	}

	closeInterface() {
		if (this.barrelInterfaceOpen) {
			this.barrelInterfaceOpen = false
			this.mainWarapper.remove()
		}
	}

	deleteBarrel() {
		clearInterval(this.intervalID)
		this.intervalID = null
		const barrel = getDOMCell(this.posX, this.posY).querySelector('.barrel')
		barrel.remove()
	}

	updateTimer() {
		this.timer -= 1000
		if (this.timer <= 0) {
			this.closeInterface()
			this.deleteBarrel()
		}
		const text = document.getElementById('timer-' + this.id)
		const cell = getDOMCell(this.posX, this.posY)
		if (text) {
			const totalSeconds = Math.floor(this.timer / 1000)
			const minutes = Math.floor(totalSeconds / 60)
			const seconds = totalSeconds - minutes * 60
			text.innerText = `${minutes}m ${seconds}s`
		}
		cell.style.setProperty('--perc', (this.timer / this.maxTimer) * 100 + '%')
	}
}

export default Barell
