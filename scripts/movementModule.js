export const movementMethod = function () {
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
            if (
                cellTop < viewportBottom &&
                cellBottom > viewportTop &&
                cellLeft < viewportRight &&
                cellRight > viewportLeft
            ) {
                visibleCells.push(cell)
            }
        })
        console.log(visibleCells)
        return visibleCells
    }
    getVisibleCells()
}