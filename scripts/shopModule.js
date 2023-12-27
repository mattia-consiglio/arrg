export const shopMenu = function (initialGold, initialRhum, initialFood) {
	const divWrapper = document.createElement('div')
	divWrapper.classList.add('shop-wrapper')
	const divMenuShop = document.createElement('div')
	divMenuShop.classList.add('shop')
	divWrapper.appendChild(divMenuShop)

	const colorDirezioneDelta = function (delta) {
		if (delta > 0) {
			return 'green'
		}
		if (delta < 0) {
			return 'red'
		}
		return 'white'
	}

	const deltaColorResource = function (startRisorsa, actualRisorsa) {
		if (startRisorsa < actualRisorsa) {
			return 'green'
		}
		if (startRisorsa > actualRisorsa) {
			return 'red'
		}
		return 'white'
	}

	let currentGold = initialGold
	let currentRhum = initialRhum
	let currentFood = initialFood

	let deltaGoldTotale = 0
	let deltaRhum = 0
	let deltaFood = 0

	const h1MenuShop = document.createElement('h1')
	h1MenuShop.textContent = '⚓☠ COMMERCIO ☠⚓'

	const xIcon = document.createElement('div')
	xIcon.innerHTML = `<i class="far fa-times-circle" style="color: #cc0000;"></i>`
	xIcon.onclick = function () {
		divMenuShop.remove()
	}

	const headerShopMenu = document.createElement('div')
	headerShopMenu.classList.add('shop-header')

	headerShopMenu.appendChild(h1MenuShop)
	headerShopMenu.appendChild(xIcon)

	divMenuShop.appendChild(headerShopMenu)

	const tableCommercio = document.createElement('div')
	tableCommercio.classList.add('table-wrap')
	tableCommercio.innerHTML = `<table id="tableCommercio">
    <tbody>
    <tr><td></td><td></td><td>In stiva:</td><td></td></tr>
    <tr>
    <td><p class="ResourcePTag">Rhum</p></td>
    <td><p class="button minus" onclick="decreaseRhum()">-</p></td>
    <td><p class="resourceValue" id="resourceValueRhum"> [ <span style="color: ${deltaColorResource(
			initialRhum,
			currentRhum + deltaRhum
		)}">${currentRhum + deltaRhum}</span> ] </p></td>
    <td><p class="button plus" onclick="increaseRhum()">+</p></td>
</tr>
<tr>
    <td><p class="ResourcePTag">Cibo</p></td>
    <td><p class="button minus" onclick="decreaseFood()">-</p></td>
    <td><p class="resourceValue" id="resourceValueFood"> [ <span style="color: ${deltaColorResource(
			initialFood,
			currentFood + deltaFood
		)}">${currentFood + deltaFood}</span> ] </p></td>
    <td><p class="button plus" onclick="increaseFood()">+</p></td>
</tr>
    <tbody>
    <tr><td></td><td></td><td>Gold: [ ${currentGold} ] </td><td></td></tr>
    <tr>
    </tbody>
    </table>`

	divMenuShop.appendChild(tableCommercio)

	const shopFooter = document.createElement('div')
	shopFooter.classList.add('shop-footer')

	const cancelButton = document.createElement('div')
	cancelButton.textContent = 'Annulla'

	divMenuShop.appendChild(cancelButton)

	const repairButton = document.createElement('div')
	const acceptButton = document.createElement('div')
	const reparationsRange = document.createElement('input')
	acceptButton.classList.add('btn')
	repairButton.classList.add('btn')
	cancelButton.classList.add('btn')

	reparationsRange.type = 'range'

	acceptButton.innerHTML = `Accetta [<span style="color: ${colorDirezioneDelta(
		deltaGoldTotale
	)}"> ${deltaGoldTotale}</span> <i class="fas fa-coins" style="color: #fac229;"></i> ]`

	repairButton.innerHTML = `Ripara [<span style="color: ${colorDirezioneDelta(
		deltaGoldTotale
	)}"> ${deltaGoldTotale}</span> <i class="fas fa-hammer" style="color: #800000;"></i> ]`

	const divBottomRight = document.createElement('div')
	divBottomRight.classList.add('bottom-right')

	divBottomRight.appendChild(reparationsRange)
	divBottomRight.appendChild(repairButton)
	divBottomRight.appendChild(acceptButton)
	shopFooter.appendChild(cancelButton)
	shopFooter.appendChild(divBottomRight)
	divMenuShop.appendChild(shopFooter)

	function decreaseRhum() {
		console.log('Hello')
	}

	function increaseRhum() {
		console.log('Hello')
	}

	function decreaseFood() {
		console.log('Hello')
	}

	function increaseFood() {
		console.log('Hello')
	}

	return divWrapper
}
