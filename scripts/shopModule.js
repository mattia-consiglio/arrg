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

export const shopMenu = function (initialResources) {
    const shopMenuRes = { ...initialResources }

    const divWrapper = document.createElement('div')
    divWrapper.classList.add('shop-wrapper')
    const divMenuShop = document.createElement('div')
    divMenuShop.classList.add('shop')
    divWrapper.appendChild(divMenuShop)

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
    const table = document.createElement("table")
    const tBody = document.createElement("tbody")
    const tdVuoto = document.createElement("td")
    const tr1 = document.createElement("tr")
    tr1.appendChild(tdVuoto)
    tr1.appendChild(tdVuoto)
    const tdInstiva = document.createElement("td")
    const pInStiva = document.createElement("p")
    pInStiva.textContent = "In stiva:"
    tdInstiva.appendChild(pInStiva)
    tr1.appendChild(tdInstiva)
    tr1.appendChild(tdVuoto)
    tBody.appendChild(tr1)

    Object.entries(shopMenuRes).forEach(([resourceName, resourceValue]) => {
        const newTr = document.createElement("tr")
        const tdResourceName = document.createElement("td")
        const pResourceName = document.createElement("p")
        pResourceName.textContent = `${resourceName}:`
        tdResourceName.appendChild(pResourceName)
        const tdMinusButton = document.createElement("td")
        const pMinusButton = document.createElement("p")
        pMinusButton.textContent = "-"
        tdMinusButton.appendChild(pMinusButton)
        const tdResourceValue = document.createElement("td")
        const pResourceValue = document.createElement("p")
        pResourceValue.textContent = `[ ${resourceValue} ]`
        tdResourceValue.appendChild(pResourceValue)
        const tdPlusButton = document.createElement("td")
        const pPlusButton = document.createElement("p")
        pPlusButton.textContent = "+"
        tdPlusButton.appendChild(pPlusButton)
        newTr.appendChild(tdResourceName)
        newTr.appendChild(tdMinusButton)
        newTr.appendChild(tdResourceValue)
        newTr.appendChild(tdPlusButton)

        tBody.append(newTr)
    })

    const lastTr = document.createElement("tr")
    lastTr.appendChild(tdVuoto)
    lastTr.appendChild(tdVuoto)
    const tdGoldIn = document.createElement("td")
    const pGoldIn = document.createElement("p")
    pGoldIn.innerText = `Gold: [ ${shopMenuRes.gold} ]`
    tdGoldIn.appendChild(pGoldIn)
    lastTr.appendChild(tdGoldIn)
    lastTr.appendChild(tdVuoto)
    tBody.appendChild(lastTr)
    tableCommercio.appendChild(tBody)


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
        initialResources.gold - shopMenuRes.gold
    )}"> ${initialResources.gold - shopMenuRes.gold}</span> <i class="fas fa-coins" style="color: #fac229;"></i> ]`


    repairButton.innerHTML = `Ripara [<span style="color: ${colorDirezioneDelta(
        initialResources.gold - shopMenuRes.gold
    )}"> ${initialResources.gold - shopMenuRes.gold}</span> <i class="fas fa-hammer" style="color: #800000;"></i> ]`

    const divBottomRight = document.createElement('div')
    divBottomRight.classList.add('bottom-right')

    divBottomRight.appendChild(reparationsRange)
    divBottomRight.appendChild(repairButton)
    divBottomRight.appendChild(acceptButton)
    shopFooter.appendChild(cancelButton)
    shopFooter.appendChild(divBottomRight)
    divMenuShop.appendChild(shopFooter)

    return divWrapper
}
