class Shape {
    constructor(cells, scale = 1) {
        this.cells = cells;
        this.scale = scale;
        this.x = 0; 
        this.y = 0;
        this.initialX = 0;
        this.initialY = 0;
        this.clickable = true;
    }
}

const shapes = [
    new Shape([{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 0 }, { row: 1, col: 1 }]),
    new Shape([{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }]),
    new Shape([{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }]),
    new Shape([{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 }]),
    new Shape([{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 0, col: 0 }]),
    new Shape([{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 0, col: 1 }]),
    new Shape([{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 2 }]),
    new Shape([{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 0 }]),
    new Shape([{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 0, col: 0 }]),
    new Shape([{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 0, col: 2 }]),
    new Shape([{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 0 }, { row: 2, col: 0}]),
    new Shape([{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2}]),
    new Shape([{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 1, col: 2 }, { row: 0, col: 2}]),
    new Shape([{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 1, col: 0 }, { row: 0, col: 0}]),
    new Shape([{ row: 0, col: 0 }]),
    new Shape([{ row: 0, col: 0 }, { row: 1, col: 0 }]),
    new Shape([{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }]),
    new Shape([{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 3, col: 0 }]),
    new Shape([{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 3, col: 0 }, { row: 4, col: 0 }]),
    new Shape([{ row: 0, col: 0 }, { row: 0, col: 1 }]),
    new Shape([{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }]),
    new Shape([{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }]),
    new Shape([{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }]),
    new Shape([{ row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 2, col: 1 }]),
    new Shape([{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }]),
    new Shape([{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 1, col: 1 }]),
    new Shape([{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }, { row: 1, col: 1 }, { row: 1, col: 0 }]),
    new Shape([{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }, { row: 1, col: 0 }]),
    new Shape([{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 1 }]),
    new Shape([{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 0, col: 1 }]),
    new Shape([{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }]),
    new Shape([{ row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 }]),
    new Shape([{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 1 }]),
    new Shape([{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 1 }]),
    new Shape([{ row: 0, col: 0 }, { row: 1, col: 1 },]),
    new Shape([{ row: 0, col: 2 }, { row: 1, col: 1 },]),
    new Shape([{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }, { row: 2, col: 0 }, { row: 2, col: 2 }]),
    new Shape([{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }, { row: 0, col: 0 }, { row: 0, col: 2 }]),
    new Shape([{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 0 }, { row: 1, col: 2 }]),
    new Shape([{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 0, col: 0 }, { row: 0, col: 2 }]),
    new Shape([{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 0, col: 1 }, { row: 2, col: 1 }]),
    new Shape([{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }, { row: 0, col: 0 }, { row: 2, col: 0 }]),
    new Shape([{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 0, col: 1 }, ]),
    new Shape([{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }, { row: 0, col: 0 }, ]),
    new Shape([{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 2, col: 1 }, ]),
    new Shape([{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }, { row: 2, col: 0 }, ]),
];

export {Shape, shapes};