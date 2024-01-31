import {Shape, shapes} from './shapes.js';

document.addEventListener("DOMContentLoaded", function () {

    //we get the canvas canvas
    const gameCanvas = document.getElementById("game-canvas");
    const ctx = gameCanvas.getContext("2d");

    //the basic settings
    const gridSize = 9;
    const cellSize = gameCanvas.width / gridSize;
    const canvasWidth = gameCanvas.width;
    const borderWidth = 1;
    const shapeScale = 0.5;
    let randomShapes = generateNewRandomShapes();
    let isDragging = false;
    let selectedShape = null;
    let dragOffsetX, dragOffsetY;
    let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
    let isPlacementPossible = false;



    //we draw the grid with this function (a 9x9 grid) and we stylise some 3x3 boxes
    function drawGrid() {
        // Custom color for the boxes
        ctx.fillStyle = '#E7EAEF';
        ctx.fillRect(cellSize * 3, 0, cellSize * 3, cellSize * 3);
        ctx.fillRect(0, cellSize * 3, cellSize * 3, cellSize * 3);
        ctx.fillRect(cellSize * 6, cellSize * 3, cellSize * 3, cellSize * 3)
        ctx.fillRect(cellSize * 3, cellSize * 6, cellSize * 3, cellSize * 3)

        // We draw the big border of the grid
        ctx.strokeStyle = "black";
        ctx.lineWidth = borderWidth + 0.5;
        const halfBorder = borderWidth / 2;
        ctx.strokeRect(halfBorder, halfBorder, gameCanvas.width - borderWidth, gameCanvas.width - borderWidth);

        for (let i = 1; i < gridSize; i++) {
            //this is also for styling, we want to evidentiate the 3x3 boxes with a black border instead of a grey one
            if (i % 3 === 0) {
                ctx.strokeStyle = "black";
                ctx.lineWidth = borderWidth;
            } else {
                ctx.strokeStyle = "#C0C6D4";
                ctx.lineWidth = 0.5;
            }
            //horizontal lines
            const y = i * cellSize;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(gameCanvas.width, y);
            ctx.stroke()

            //vertical lines
            const x = i * cellSize;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, gameCanvas.width);
            ctx.stroke();
        }

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                // Check if the cell is occupied
                if (grid[i][j]) {
                    ctx.fillStyle = "#3564C3"; // Set the color for occupied cells
                    ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = borderWidth;
                    ctx.strokeRect(j * cellSize, i*cellSize, cellSize, cellSize);
                }
            }
        }
        
        if (isDragging && selectedShape && isPlacementPossible) {

            selectedShape.cells.forEach(cell => {
                const { cellX, cellY } = canvasToGridCoordinates(selectedShape.x + cell.col * cellSize, selectedShape.y + cell.row * cellSize);

                // Mark the cells with gray to indicate the possible position of the shape
                ctx.fillStyle = "#BCBAC5";
                ctx.strokeStyle = "white";
                ctx.lineWidth = 0.5;
                ctx.fillRect(cellX * cellSize, cellY * cellSize, cellSize, cellSize);
                ctx.strokeRect(cellX * cellSize, cellY * cellSize, cellSize, cellSize);
            });
        }
    }

    function generateNewRandomShapes() {
        return [generateRandomShape(shapeScale), generateRandomShape(shapeScale), generateRandomShape(shapeScale)];
    }

    function canvasToGridCoordinates(x, y) {
        const cellX = Math.floor(x / cellSize);
        const cellY = Math.floor(y / cellSize);
    
        return { cellX, cellY };
    }

    //We call this function to generate the 3 random shapes, we can instatiate them with a custom scale, eg. 0.5 but we have a default value of 1 
    function generateRandomShape(scale = 1) {
        const randomIndex = Math.floor(Math.random() * shapes.length);
        let randomShape = shapes[randomIndex];
        let scaleShape = new Shape(randomShape.cells, scale);
        return scaleShape;
    }

    //We call this function to determine the right position for the 3 random shapes when they are generated so that they are placed at the bottom of the grid
    //and that they are centered horizontally and vertically also 
    function positionAndDrawShapes(shapes) {
        // Clear the canvas
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    
        // Redraw the grid
        drawGrid();
    
        shapes.forEach((shape, index) => {
            // Calculate the size of the shape
            if (shape !== selectedShape && shape) {
            const shapeWidth = calculateShapeWidth(shape);
            const shapeHeight = calculateShapeHeight(shape);
    
            // Calculate starting coordinates for each shape
            const startX = (index % 3) * cellSize * 3 + (cellSize * 3 - shapeWidth) / 2; // Center horizontally 
            const startY = Math.floor(index / 3) * cellSize * 3 + (cellSize * 3 - shapeHeight) / 2 + canvasWidth; // Center vertically 
    
            shape.x = startX;
            shape.y = startY;
            shape.initialX = startX;
            shape.initialY = startY;

            drawCustomShape(shape, startX, startY)
            }
        });
    }
    
    //Function called when the player clicks and drags a shape, also adds spacing to the cells and changes the scale 
    function positionAndDrawSelectedShape(shape) {

        const disconnectedSpacing = 8;
       
        // Draw the selected shape at the calculated position
        drawCustomShape(shape, shape.x, shape.y, disconnectedSpacing, 0.75);
    }
    
    //function which computes the width of the shape
    function calculateShapeWidth(shape) {
        const scaledCellSize = cellSize * shape.scale;
        // Calculate the width based on the cells in the shape
        return shape.cells.reduce((maxX, cell) => Math.max(maxX, (cell.col + 1) * scaledCellSize), 0);
    }
    
    //function which computes the height of the shape
    function calculateShapeHeight(shape) {
        const scaledCellSize = cellSize * shape.scale;
        // Calculate the height based on the cells in the shape
        return shape.cells.reduce((maxY, cell) => Math.max(maxY, (cell.row + 1) * scaledCellSize), 0);
    }

    //function which draws the shapes
    function drawCustomShape(shape, x, y, disconnectedSpacing = 0, scale = shape.scale) {
        const scaledCellSize = cellSize * scale;
        ctx.fillStyle = "#3564C3";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;

        shape.cells.forEach(cell => {
            const cellX = x + cell.col * scaledCellSize + disconnectedSpacing * cell.col;
            const cellY = y + cell.row * scaledCellSize + disconnectedSpacing * cell.row;
            
            ctx.fillRect(cellX + borderWidth, cellY + borderWidth, scaledCellSize, scaledCellSize);
            ctx.strokeRect(cellX + borderWidth, cellY + borderWidth, scaledCellSize, scaledCellSize);

        });
    }

    //function which checks if the mouse is over a shape
    function isCursorOverShape(shape, mouseX, mouseY) {
        if (shape){
        const startX = shape.x;
        const startY = shape.y;
        const endX = startX + calculateShapeWidth(shape);
        const endY = startY + calculateShapeHeight(shape);
    
        return (
            mouseX >= startX &&
            mouseX <= endX &&
            mouseY >= startY &&
            mouseY <= endY
        );
        }
    }

    //function which is called when a shape is clicked 
    gameCanvas.addEventListener("mousedown", function (event) {
        const mouseX = event.clientX - gameCanvas.getBoundingClientRect().left;
        const mouseY = event.clientY - gameCanvas.getBoundingClientRect().top;

        // Check if the cursor is over any of the shapes
        selectedShape = randomShapes.find(shape => isCursorOverShape(shape, mouseX, mouseY));

        if (selectedShape) {
            isDragging = true;
            
            // Calculate the offset between the mouse and the top-left corner of the shape
            dragOffsetX = mouseX - selectedShape.x;
            dragOffsetY = mouseY - selectedShape.y;
        }
    });

    //function which is called when the mouse is down on a shape and the user wants to move the shape
    gameCanvas.addEventListener("mousemove", function (event) {

        const mouseX = event.clientX - gameCanvas.getBoundingClientRect().left;
        const mouseY = event.clientY - gameCanvas.getBoundingClientRect().top;

        const isCursorOverAnyShape = randomShapes.some(shape => isCursorOverShape(shape, mouseX, mouseY));
        gameCanvas.style.cursor = isCursorOverAnyShape ? "pointer" : "default";

        if (isDragging && selectedShape) {
    
            // Update the position of the selected shape based on the mouse movement
            selectedShape.x = mouseX - dragOffsetX;
            selectedShape.y = mouseY - dragOffsetY;
    
            // Ensure the shape stays within the canvas bounds
            selectedShape.x = Math.max(0, Math.min(selectedShape.x, gameCanvas.width - calculateShapeWidth(selectedShape)));
            selectedShape.y = Math.max(0, Math.min(selectedShape.y, gameCanvas.height - calculateShapeHeight(selectedShape)));
    
            isPlacementPossible = canPlaceShapeAtPosition(selectedShape, selectedShape.x, selectedShape.y);

            // Clear the canvas and redraw the grid with the new shape position
            redrawCanvas();
    
        }
    });

    //function which is called when the user releases the mouse
    gameCanvas.addEventListener("mouseup", function () {
        if (isDragging && selectedShape) {
            // Attempt to place the selected shape on the grid
            const placementSuccessful = placeShapeOnGrid(selectedShape);
    
            // If placement is successful, update the canvas
            if (placementSuccessful) {
                checkForCompletes();
                randomShapes[randomShapes.indexOf(selectedShape)] = null;
                isDragging = false;
                selectedShape = null;
                if (randomShapes.every(shape => shape === null)) {
                    // Generate three new random shapes
                    randomShapes = generateNewRandomShapes();}
                    redrawCanvas();
            } else { //If placement failed, update the canvas
                selectedShape.x = selectedShape.initialX;
                selectedShape.y = selectedShape.initialY;
                isDragging = false;
                selectedShape = null;
                redrawCanvas();
            }
        }
    });

    function isCellWithinGridBounds(cellX, cellY) {
        return cellX >= 0 && cellX < gridSize && cellY >= 0 && cellY < gridSize;
    }

    function isCellAvailable(cellX, cellY) {
        return !grid[cellY][cellX];
    }

    function canPlaceShapeAtPosition(shape, x, y) {
    for (const cell of shape.cells) {
        const { cellX, cellY } = canvasToGridCoordinates(x + cell.col * cellSize, y + cell.row * cellSize);

        // Check if the cell is within the grid bounds and if the cell is available
        if (!isCellWithinGridBounds(cellX, cellY) || !isCellAvailable(cellX, cellY)) {
            return false;
        }
    }

    return true;
}

    function placeShapeOnGrid(shape) {
        let canPlace = true;
    
        // Check if all cells of the shape can be placed
        for (const cell of shape.cells) {
            const { cellX, cellY } = canvasToGridCoordinates(shape.x + cell.col * cellSize, shape.y + cell.row * cellSize);

            // Check if the cell is within the grid bounds and if the cell is available
            if (!isCellWithinGridBounds(cellX, cellY) || !isCellAvailable(cellX, cellY)) {
                // Cell is not within the grid bounds or not available, deny placement
                canPlace = false;
                break;
            }
        }
    
        // If all cells are available, update the grid and indicate successful placement
        if (canPlace) {
            updateGrid(shape);
        }
    
        return canPlace;
    }

    function getCompletedRows() {
        const completedRows = [];
    
        for (let i = 0; i < gridSize; i++) {
            const rowShapes = grid[i].filter(cell => cell !== null);
    
            if (rowShapes.length === gridSize) {
                completedRows.push(i);
            }
        }
    
        return completedRows;
    }

    function getCompletedColumns() {
        const completedColumns = [];
    
        for (let j = 0; j < gridSize; j++) {
            const columnShapes = grid.map(row => row[j]).filter(cell => cell !== null);
    
            if (columnShapes.length === gridSize) {
                completedColumns.push(j);
            }
        }
    
        return completedColumns;
    }

    function getCompletedBoxes() {
        const completedBoxes = [];
    
        // Iterate over the 9 possible 3x3 boxes
        for (let startRow = 0; startRow < 9; startRow += 3) {
            for (let startColumn = 0; startColumn < 9; startColumn += 3) {
                const boxOccupied = grid
                    .slice(startRow, startRow + 3)
                    .flatMap(row => row.slice(startColumn, startColumn + 3))
                    .every(cell => cell !== null);
    
                if (boxOccupied) {
                    completedBoxes.push({ startRow, startColumn });
                }
            }
        }
    
        return completedBoxes;
    }

    function handleCompletedRows(completedRows) {
        completedRows.forEach(rowIndex => {
            grid[rowIndex].fill(null);
        });
    }
    
    function handleCompletedColumns(completedColumns) {
        completedColumns.forEach(columnIndex => {
            grid.forEach(row => (row[columnIndex] = null));
        });
    }
    
    function handleCompletedBoxes(completedBoxes) {
        completedBoxes.forEach(box => {
            for (let i = box.startRow; i < box.startRow + 3; i++) {
                for (let j = box.startColumn; j < box.startColumn + 3; j++) {
                    grid[i][j] = null;
                }
            }
        });
    }

    function checkForCompletes() {
        const completedRows = getCompletedRows();
        const completedColumns = getCompletedColumns();
        const completedBoxes = getCompletedBoxes();
    
        // Handle the completed rows, columns, and boxes (e.g., clear them)
        handleCompletedRows(completedRows);
        handleCompletedColumns(completedColumns);
        handleCompletedBoxes(completedBoxes);
    
        // Redraw the grid after handling completes
        redrawCanvas();
    }

    
    function updateGrid(shape) {
        shape.cells.forEach(cell => {
            const cellX = Math.floor((shape.x + cell.col * cellSize) / cellSize);
            const cellY = Math.floor((shape.y + cell.row * cellSize) / cellSize);
    
            // Mark the cell as occupied by the placed shape
            grid[cellY][cellX] = shape;
        });
        console.log(grid)
    }
    


    //function which redraws the canvas 
    function redrawCanvas() {
        // Clear the canvas
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Redraw the grid
        drawGrid();

        positionAndDrawShapes(randomShapes)
        // Redraw the shapes
        if (isDragging && selectedShape){
            positionAndDrawSelectedShape(selectedShape)
        }
    }

    redrawCanvas();
    
});