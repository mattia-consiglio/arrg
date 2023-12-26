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

export const shopMenu = function () {
    const divMenuShop = document.createElement("div")
    console.log("Hello")
    return divMenuShop
}
