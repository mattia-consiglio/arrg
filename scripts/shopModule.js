import { player } from './main.js'
export const setFriendlyShoreCell = function () {
    let portoAlleato = Math.floor(Math.random() * 4);

    const moloPositions = [
        [{ row: 18, col: 39 }, { row: 18, col: 38 }, { row: 18, col: 37 }, { row: 19, col: 37 }, { row: 20, col: 37 }, { row: 21, col: 37 }, { row: 21, col: 38 }, { row: 21, col: 39 }],
        [{ row: 0, col: 18 }, { row: 1, col: 18 }, { row: 2, col: 18 }, { row: 2, col: 19 }, { row: 2, col: 20 }, { row: 2, col: 21 }, { row: 1, col: 21 }, { row: 0, col: 21 }],
        [{ row: 18, col: 0 }, { row: 18, col: 1 }, { row: 18, col: 2 }, { row: 19, col: 2 }, { row: 20, col: 2 }, { row: 21, col: 2 }, { row: 21, col: 1 }, { row: 21, col: 0 }],
        [{ row: 39, col: 18 }, { row: 38, col: 18 }, { row: 37, col: 18 }, { row: 37, col: 19 }, { row: 37, col: 20 }, { row: 37, col: 21 }, { row: 38, col: 21 }, { row: 39, col: 21 }]
    ];

    moloPositions.forEach((positions, index) => {
        positions.forEach(pos => {
            const selector = `div[data-row="${pos.row}"][data-col="${pos.col}"]`;
            document.querySelector(selector).classList.add("Molo");

            if (index === portoAlleato) {
                document.querySelector(selector).classList.add("amichevole");
            } else {
                document.querySelector(selector).classList.add("nemico");
            }
        });
    });
};

export const shopMenu = function (initialGold, initialRhum, initialFood) {
    const divMenuShop = document.createElement("div")

    const colorDirezioneDelta = function (delta) {
        if (delta > 0) {
            return "green"
        }
        if (delta < 0) {
            return "red"
        }
        return "white"
    }

    const deltaColorResource = function (startRisorsa, actualRisorsa) {
        if (startRisorsa < actualRisorsa) {
            return "green"
        }
        if (startRisorsa > actualRisorsa) {
            return "red"
        }
        return "white"
    }


    let currentGold = initialGold
    let currentRhum = initialRhum
    let currentFood = initialFood

    let deltaGoldTotale = 0
    let deltaRhum = 0
    let deltaFood = 0

    const h1MenuShop = document.createElement("h1")
    h1MenuShop.textContent = "⚓☠ COMMERCIO ☠⚓"
    h1MenuShop.style.color = "white"
    h1MenuShop.style.fontSize = "3em"
    h1MenuShop.style.fontFamily = 'Barletta'

    const xIcon = document.createElement("div")
    xIcon.innerHTML = `<i class="far fa-times-circle" style="color: #cc0000;"></i>`
    xIcon.style.fontSize = "1.5rem"
    xIcon.style.cursor = "pointer"
    xIcon.onclick = function () {
        divMenuShop.remove()
    }

    const headerShopMenu = document.createElement("div")
    headerShopMenu.style.display = "flex"
    headerShopMenu.style.justifyContent = "space-between"

    headerShopMenu.appendChild(h1MenuShop)
    headerShopMenu.appendChild(xIcon)

    divMenuShop.appendChild(headerShopMenu)

    const tableCommercio = document.createElement("div")
    tableCommercio.style.color = "white"
    tableCommercio.innerHTML = `<table id="tableCommercio">
    <tbody>
    <tr><td></td><td></td><td>In stiva:</td><td></td></tr>
    <tr>
    <td><p class="ResourcePTag">Rhum</p></td>
    <td><p class="button minus" onclick="decreaseRhum()">-</p></td>
    <td><p class="resourceValue" id="resourceValueRhum"> [ <span style="color: ${deltaColorResource(initialRhum, (currentRhum + deltaRhum))}">${currentRhum + deltaRhum}</span> ] </p></td>
    <td><p class="button plus" onclick="increaseRhum()">+</p></td>
</tr>
<tr>
    <td><p class="ResourcePTag">Cibo</p></td>
    <td><p class="button minus" onclick="decreaseFood()">-</p></td>
    <td><p class="resourceValue" id="resourceValueFood"> [ <span style="color: ${deltaColorResource(initialFood, (currentFood + deltaFood))}">${currentFood + deltaFood}</span> ] </p></td>
    <td><p class="button plus" onclick="increaseFood()">+</p></td>
</tr>
    <tbody>
    <tr><td></td><td></td><td>Gold: [ ${currentGold} ] </td><td></td></tr>
    <tr>
    </tbody>
    </table>`

    divMenuShop.appendChild(tableCommercio)

    const cancelButton = document.createElement("div")
    cancelButton.style.position = "absolute"
    cancelButton.style.left = "4%"
    cancelButton.style.bottom = "4%"
    cancelButton.textContent = "Annulla"
    cancelButton.style.padding = "1% 2.5%"
    cancelButton.style.border = "2px solid white"
    cancelButton.style.color = "white"
    cancelButton.style.backgroundColor = "black"
    cancelButton.style.fontSize = "1.2em"
    cancelButton.style.cursor = "pointer"
    divMenuShop.appendChild(cancelButton)

    const repairButton = document.createElement("div")
    const acceptButton = document.createElement("div")
    const reparationsRange = document.createElement("input")

    reparationsRange.type = "range"

    acceptButton.innerHTML = `Accetta [<span style="color: ${colorDirezioneDelta(deltaGoldTotale)}"> ${deltaGoldTotale}</span> <i class="fas fa-coins" style="color: #fac229;"></i> ]`
    acceptButton.style.color = "white"
    acceptButton.style.fontSize = "1.2em"
    acceptButton.style.border = "2px solid white"
    acceptButton.style.padding = "1% 2.5%"
    acceptButton.style.whiteSpace = "nowrap"
    acceptButton.style.minWidth = "220px"
    acceptButton.style.textAlign = "center"
    acceptButton.style.minHeight = "2rem"
    acceptButton.style.lineHeight = "3rem"
    acceptButton.style.cursor = "pointer"

    repairButton.innerHTML = `Ripara [<span style="color: ${colorDirezioneDelta(deltaGoldTotale)}"> ${deltaGoldTotale}</span> <i class="fas fa-hammer" style="color: #800000;"></i> ]`
    repairButton.style.color = "white"
    repairButton.style.fontSize = "1.2em"
    repairButton.style.border = "2px solid white"
    repairButton.style.padding = "1% 2.5%"
    repairButton.style.whiteSpace = "nowrap"
    repairButton.style.minWidth = "220px"
    repairButton.style.textAlign = "center"
    repairButton.style.minHeight = "2rem"
    repairButton.style.lineHeight = "3rem"
    repairButton.style.cursor = "pointer"

    const divBottomRight = document.createElement("div")
    divBottomRight.style.position = "absolute"
    divBottomRight.style.bottom = "4%"
    divBottomRight.style.right = "4%"
    divBottomRight.style.display = "flex"
    divBottomRight.style.flexDirection = "column"
    divBottomRight.style.justifyContent = "right"

    divBottomRight.appendChild(reparationsRange)
    divBottomRight.appendChild(repairButton)
    divBottomRight.appendChild(acceptButton)
    divMenuShop.appendChild(divBottomRight)

    divMenuShop.style.margin = "6%"
    divMenuShop.style.position = "absolute"
    divMenuShop.style.top = "50%"
    divMenuShop.style.left = "50%"
    divMenuShop.style.transform = "translate(-60%,-80%)"
    divMenuShop.style.backgroundColor = "black"
    divMenuShop.style.padding = "3%"
    divMenuShop.style.zIndex = 3
    divMenuShop.style.width = "60vw"
    divMenuShop.style.height = "60vh"

    function decreaseRhum() {
        console.log("Hello")
    }

    function increaseRhum() {
        console.log("Hello")
    }

    function decreaseFood() {
        console.log("Hello")
    }

    function increaseFood() {
        console.log("Hello")
    }

    return divMenuShop
}


