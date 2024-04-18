import {Shape, shapes} from './shapes.js';

class BlockudokuGame {
    constructor() {
        this.gameCanvas = document.getElementById("game-canvas");
        this.ctx = this.gameCanvas.getContext("2d");
        this.gridSize = 9;
        this.cellSize = this.gameCanvas.width / this.gridSize;
        this.canvasWidth = this.gameCanvas.width;
        this.borderWidth = 1;
        this.shapeScale = 0.5;
        this.randomShapes = this.generateNewRandomShapes();
        this.isDragging = false;
        this.selectedShape = null;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.grid = Array.from({ length: this.gridSize }, () => Array(this.gridSize).fill(null));
        this.isPlacementPossible = false;
        this.totalScore = 0;
        this.gameOver = false;
        this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;

        this.setupDailyReset();
        this.setupEventListeners();
        this.redrawCanvas();
        this.updateScore(this.totalScore);
        this.updateBestScoreDisplay();
    }

    //This function handles the main abilities of the user (hold the click down, release the click, move)
    setupEventListeners() {
        this.gameCanvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        this.gameCanvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
        this.gameCanvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    }

    //This function makes sure the best score resets after 1 day
    setupDailyReset() {
        setInterval(() => {
            const now = new Date();
            if (now.getHours() === 0 && now.getMinutes() === 0) {
                // Reset the best score to 0
                this.bestScore = 0;
                // Update the best score in localStorage
                localStorage.setItem('bestScore', this.bestScore.toString());
                // Update the displayed best score in your game interface
                this.updateBestScoreDisplay();
            }
        }, 60000); // Check every minute
    }

    updateBestScore(score) {
        if (score > this.bestScore) {
            this.bestScore = score;
            // Update the best score in localStorage
            localStorage.setItem('bestScore', this.bestScore.toString());
            // Update the displayed best score in your game interface
            this.updateBestScoreDisplay();
        }
    }

    updateBestScoreDisplay() {
        let bestScore = document.getElementById('best-score');
        bestScore.textContent = this.bestScore;
    }

    //This function returns an array of 3 randomly generated shapes
    generateNewRandomShapes() {
        return [this.generateRandomShape(this.shapeScale), this.generateRandomShape(this.shapeScale), this.generateRandomShape(this.shapeScale)];
    }

    //This function is used to generate a random shape and adjust the scale to our needs
    generateRandomShape(scale = 1) {
        const randomIndex = Math.floor(Math.random() * shapes.length);
        return new Shape(shapes[randomIndex].cells, scale);
    }

    //This function has 3 main task: draw the grid, draw the placed shapes, draw the possibilities of selected shape
    drawGrid(ctx = this.ctx, cellSize = this.cellSize, gameCanvas = this.gameCanvas) {
        const borderWidth= this.borderWidth;
        const grid = this.grid;
        const gridSize = this.gridSize
        

        // Custom color for 4 of the 9 3x3 boxes
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


        // We use this is to fill the occupied cells
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j]) {
                    ctx.fillStyle = "#3564C3"; //the color of the occupied cells
                    ctx.strokeStyle = "black"; 
                    ctx.lineWidth = borderWidth;
                    ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                    ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
                }
            }
        }
        

        // We use this to mark the cells with gray to indicate the possible position of the shape
        if (this.isDragging && this.selectedShape && this.isPlacementPossible) {

            this.selectedShape.cells.forEach(cell => {
                const { cellX, cellY } = this.canvasToGridCoordinates(this.selectedShape.x + cell.col * cellSize, this.selectedShape.y + cell.row * cellSize);
                
                ctx.fillStyle = "#BCBAC5";
                ctx.strokeStyle = "white";
                ctx.lineWidth = 0.5;
                ctx.fillRect(cellX * cellSize, cellY * cellSize, cellSize, cellSize);
                ctx.strokeRect(cellX * cellSize, cellY * cellSize, cellSize, cellSize);
            });
        }

        // We use this to highlight cells for potential clearance
    if (this.isDragging && this.selectedShape && this.isPlacementPossible) {
        // Clone the grid to simulate the placement of the selected shape
        const tempGrid = this.grid.map(row => [...row]);

        // Simulate placing the selected shape on the temporary grid
        this.selectedShape.cells.forEach(cell => {
            const { cellX, cellY } = this.canvasToGridCoordinates(this.selectedShape.x + cell.col * cellSize, this.selectedShape.y + cell.row * cellSize);

            tempGrid[cellY][cellX] = this.selectedShape;
        });

        // Check for completed rows, columns, and boxes on the temporary grid
        const completedRows = this.getCompletedRows(tempGrid);
        const completedColumns = this.getCompletedColumns(tempGrid);
        const completedBoxes = this.getCompletedBoxes(tempGrid);

        // Highlight cells in completed rows, columns, and boxes
        completedRows.forEach(rowIndex => {
            tempGrid[rowIndex].forEach((cell, columnIndex) => {
                ctx.fillStyle = "rgba(97, 150, 255, 0.5)";
                ctx.fillRect(columnIndex * cellSize, rowIndex * cellSize, cellSize, cellSize);
            });
        });

        completedColumns.forEach(columnIndex => {
            tempGrid.forEach((row, rowIndex) => {
                const cell = row[columnIndex];
                ctx.fillStyle = "rgba(97, 150, 255, 0.5)"; 
                ctx.fillRect(columnIndex * cellSize, rowIndex * cellSize, cellSize, cellSize);
            });
        });

        completedBoxes.forEach(box => {
            for (let i = box.startRow; i < box.startRow + 3; i++) {
                for (let j = box.startColumn; j < box.startColumn + 3; j++) {
                    const cell = tempGrid[i][j];
                    ctx.fillStyle = "rgba(97, 150, 255, 0.5)"; 
                    ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                }
            }
        });
    }
    }

    // We use this function convert the position of the shape on the canvas to a position on the grid
    canvasToGridCoordinates(x, y) {
        const cellX = Math.floor(x / this.cellSize);
        const cellY = Math.floor(y / this.cellSize);
    
        return { cellX, cellY };
    }

    //We call this function to determine the right position for the 3 random shapes when they are generated so that they are placed at the bottom of the grid
    //and that they are centered horizontally and vertically also 
    positionAndDrawShapes(shapes) {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvasWidth, this.gameCanvas.height);
    
        // Redraw the grid
        this.drawGrid();
    
        shapes.forEach((shape, index) => {
            // Calculate the size of the shape
            if (shape !== this.selectedShape && shape) {
            const shapeWidth = this.calculateShapeWidth(shape);
            const shapeHeight = this.calculateShapeHeight(shape);
    
            // Calculate starting coordinates for each shape
            const startX = (index % 3) * this.cellSize * 3 + (this.cellSize * 3 - shapeWidth) / 2; // Center horizontally 
            const startY = Math.floor(index / 3) * this.cellSize * 3 + (this.cellSize * 3 - shapeHeight) / 2 + this.canvasWidth; // Center vertically 
    
            shape.x = startX;
            shape.y = startY;
            shape.initialX = startX;
            shape.initialY = startY;

            this.drawCustomShape(shape, startX, startY)
            }
        });
    }

    //Function called when the player clicks and drags a shape, also adds spacing to the cells and changes the scale 
    positionAndDrawSelectedShape(shape) {

        const disconnectedSpacing = 8;
       
        // Draw the selected shape at the calculated position
        this.drawCustomShape(shape, shape.x, shape.y, disconnectedSpacing, 0.75);
    }

    //Function which computes the width of the shape
    calculateShapeWidth(shape) {
        const scaledCellSize = this.cellSize * shape.scale;
        // Calculate the width based on the cells in the shape
        return shape.cells.reduce((maxX, cell) => Math.max(maxX, (cell.col + 1) * scaledCellSize), 0);
    }
    
    //Function which computes the height of the shape
    calculateShapeHeight(shape) {
        const scaledCellSize = this.cellSize * shape.scale;
        // Calculate the height based on the cells in the shape
        return shape.cells.reduce((maxY, cell) => Math.max(maxY, (cell.row + 1) * scaledCellSize), 0);
    }

    //We call this function to draw the shapes
    drawCustomShape(shape, x, y, disconnectedSpacing = 0, scale = shape.scale) {
        const scaledCellSize = this.cellSize * scale;
        this.ctx.fillStyle = shape.clickable ? "#3564C3" : "#627AB1" ;
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 1;

        shape.cells.forEach(cell => {
            const cellX = x + cell.col * scaledCellSize + disconnectedSpacing * cell.col;
            const cellY = y + cell.row * scaledCellSize + disconnectedSpacing * cell.row;
            
            this.ctx.fillRect(cellX + this.borderWidth, cellY + this.borderWidth, scaledCellSize, scaledCellSize);
            this.ctx.strokeRect(cellX + this.borderWidth, cellY + this.borderWidth, scaledCellSize, scaledCellSize);

        });
    }

    //We call this function to check if the mouse is over a shape
    isCursorOverShape(shape, mouseX, mouseY) {
        if (shape && shape.clickable){
        const startX = shape.x;
        const startY = shape.y;
        const endX = startX + this.calculateShapeWidth(shape);
        const endY = startY + this.calculateShapeHeight(shape);
    
        return (
            mouseX >= startX &&
            mouseX <= endX &&
            mouseY >= startY &&
            mouseY <= endY
        );
        }
    }

    //We call this function when the user clicks and selects one of the 3 shapes
    handleMouseDown = (event) => {
        const mouseX = event.clientX - this.gameCanvas.getBoundingClientRect().left;
        const mouseY = event.clientY - this.gameCanvas.getBoundingClientRect().top;

        // Check if the cursor is over any of the shapes
        this.selectedShape = this.randomShapes.find(shape => this.isCursorOverShape(shape, mouseX, mouseY));

        if (this.selectedShape) {
            this.isDragging = true;
            
            // Calculate the offset between the mouse and the top-left corner of the shape
            this.dragOffsetX = mouseX - this.selectedShape.x;
            this.dragOffsetY = mouseY - this.selectedShape.y;
        }
    };

    // We call this function when a user moves the cursor and it has 2 tasks (stylise the cursor and move the shape)
    handleMouseMove = (event) => {
        const mouseX = event.clientX - this.gameCanvas.getBoundingClientRect().left;
        const mouseY = event.clientY - this.gameCanvas.getBoundingClientRect().top;

        const isCursorOverAnyShape = this.randomShapes.some(shape => this.isCursorOverShape(shape, mouseX, mouseY));
         
        // Stylise the cursor if it's over a shape
        this.gameCanvas.style.cursor = isCursorOverAnyShape ? "pointer" : "default";

        if (this.isDragging && this.selectedShape) {
            // Update the position of the selected shape based on the mouse movement
            this.selectedShape.x = mouseX - this.dragOffsetX;
            this.selectedShape.y = mouseY - this.dragOffsetY;
 
            this.isPlacementPossible = this.canPlaceShapeAtPosition(this.selectedShape, this.selectedShape.x, this.selectedShape.y);

            // Clear the canvas and redraw the grid with the new shape position
            this.redrawCanvas();
        }
    };

    // Function which is called when the user releases the mouse
    handleMouseUp = () => {
        if (this.isDragging && this.selectedShape) {

            // Attempt to place the selected shape on the grid
            const placementSuccessful = this.placeShapeOnGrid(this.selectedShape);

            // If placement is successful, update the canvas
            if (placementSuccessful) {
                this.checkForCompletes();
                this.randomShapes[this.randomShapes.indexOf(this.selectedShape)] = null;
                this.randomShapes.map(x=> this.checkGridAvailability(x));
                this.isDragging = false;
                this.selectedShape = null;
                if (this.randomShapes.every(shape => shape === null)) {
                    // Generate three new random shapes
                    this.randomShapes = this.generateNewRandomShapes();
                }
                if (this.randomShapes.filter(x => x && x.clickable === true).length === 0){
                    this.gameOver = true;
                }
                this.redrawCanvas();
            } else { // If placement failed, update the canvas and put the shape at the initial place
                this.selectedShape.x = this.selectedShape.initialX;
                this.selectedShape.y = this.selectedShape.initialY;
                this.isDragging = false;
                this.selectedShape = null;
                this.redrawCanvas();
            }
        }
    };

    

    //We call this function to check if one of the cells of the dragged shape is out of bounds
    isCellWithinGridBounds(cellX, cellY) {
        return cellX >= 0 && cellX < this.gridSize && cellY >= 0 && cellY < this.gridSize;
    }

    //We call this function to check if one of the cells under the dragged shape is available
    isCellAvailable(cellX, cellY) {
        return !this.grid[cellY][cellX];
    }

    //We call this function to check if the dragged shape can be placed at its current position
    canPlaceShapeAtPosition(shape, x, y) {
        for (const cell of shape.cells) {
            const { cellX, cellY } = this.canvasToGridCoordinates(x + cell.col * this.cellSize, y + cell.row * this.cellSize);
    
            // Check if the cell is within the grid bounds and if the cell is available
            if (!this.isCellWithinGridBounds(cellX, cellY) || !this.isCellAvailable(cellX, cellY)) {
                return false;
            }
        }
    
        return true;
    }

    //We call this function to try and place the shape on the grid
    placeShapeOnGrid(shape) {
        let canPlace = true;
    
        // Check if all cells of the shape can be placed
        for (const cell of shape.cells) {
            const { cellX, cellY } = this.canvasToGridCoordinates(shape.x + cell.col * this.cellSize, shape.y + cell.row * this.cellSize);

            // Check if the cell is within the grid bounds and if the cell is available
            if (!this.isCellWithinGridBounds(cellX, cellY) || !this.isCellAvailable(cellX, cellY)) {
                // Cell is not within the grid bounds or not available, deny placement
                canPlace = false;
                break;
            }
        }
    
        // If all cells are available, update the grid and indicate successful placement
        if (canPlace) {
            this.updateGrid(shape);
        }
    
        return canPlace;
    }

    //We call this function to check if any of the rows has been completely filled
    getCompletedRows(grid = this.grid) {
        const completedRows = [];
    
        for (let i = 0; i < this.gridSize; i++) {
            const rowShapes = grid[i].filter(cell => cell !== null);
    
            if (rowShapes.length === this.gridSize) {
                completedRows.push(i);
            }
        }
    
        return completedRows;
    }

    //We call this function to check if any of the columns has been completely filled
    getCompletedColumns(grid = this.grid) {
        const completedColumns = [];
    
        for (let j = 0; j < this.gridSize; j++) {
            const columnShapes = grid.map(row => row[j]).filter(cell => cell !== null);
    
            if (columnShapes.length === this.gridSize) {
                completedColumns.push(j);
            }
        }
    
        return completedColumns;
    }

    //We call this function to check if any of the 3x3 boxes has been completely filled
    getCompletedBoxes(grid = this.grid) {
        const completedBoxes = [];
    
        // Iterate over the 9 possible 3x3 boxes
        for (let startRow = 0; startRow < this.gridSize; startRow += 3) {
            for (let startColumn = 0; startColumn < this.gridSize; startColumn += 3) {
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

    //We call this function to break the completed rows
    handleCompletedRows(completedRows) {
        completedRows.forEach(rowIndex => {
            this.grid[rowIndex].fill(null);
        });
    }
    
    //We call this function to break the completed columns
    handleCompletedColumns(completedColumns) {
        completedColumns.forEach(columnIndex => {
            this.grid.forEach(row => (row[columnIndex] = null));
        });
    }
    
    //We call this function to break the completed 3x3 boxes
    handleCompletedBoxes(completedBoxes) {
        completedBoxes.forEach(box => {
            for (let i = box.startRow; i < box.startRow + 3; i++) {
                for (let j = box.startColumn; j < box.startColumn + 3; j++) {
                    this.grid[i][j] = null;
                }
            }
        });
    }

    animateClearedCells(cells) {
        const animationDuration = 500; // Duration of the animation in milliseconds
        const startTime = performance.now();

        const animate = () => {
            const elapsedTime = performance.now() - startTime;
            const progress = Math.min(elapsedTime / animationDuration, 1);

            // Clear the canvas before drawing
            this.ctx.clearRect(0, 0, this.canvasWidth, this.gameCanvas.height);

            // Redraw the grid
            this.drawGrid();

            // Redraw the shapes
            this.positionAndDrawShapes(this.randomShapes);

            // Draw cleared cells with animation
            cells.forEach(cell => {
                const cellX = cell.col * this.cellSize;
                const cellY = cell.row * this.cellSize;
                const size = this.cellSize * (1 - progress); // Reduce size gradually
                
                this.ctx.fillStyle = "#000000"; // White color for disappearing cells
                this.ctx.fillRect(cellX, cellY, size, size);
            });
            // Continue animation if not finished
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
            
        };

        // Start the animation
        animate();
        console.log("1. Se animeaza")
    }

    //We call this function to manage all 3 possibilities of breaking (columns, rows, boxes)
    checkForCompletes() {
        const completedRows = this.getCompletedRows();
        const completedColumns = this.getCompletedColumns();
        const completedBoxes = this.getCompletedBoxes();

        const scoreIncrement = (completedColumns.length * this.gridSize * 2) + (completedRows.length * this.gridSize * 2) + (completedBoxes.length * this.gridSize * 2) + this.selectedShape.cells.length;

        this.updateScore(scoreIncrement);

        if (completedColumns.length > 0 || completedRows.length > 0 || completedBoxes.length > 0) {
            // Get all completed cells for animation
            const completedCells = [...completedRows, ...completedColumns.map(col => ({ row: 0, col })), ...completedBoxes.flatMap(box => {
                const cells = [];
                for (let i = box.startRow; i < box.startRow + 3; i++) {
                    for (let j = box.startColumn; j < box.startColumn + 3; j++) {
                        cells.push({ row: i, col: j });
                    }
                }
                return cells;
            })];
            // Animate cleared cells
            this.animateClearedCells(completedCells);
            console.log("2. S-a terminat animatia")
        }

        //we call this function only when we clear a line or a box, this animates the points we get 
        if (completedColumns.length > 0 || completedRows.length > 0 || completedBoxes.length > 0){
        this.handleScoreIncrementAnimation(scoreIncrement, this.gameCanvas.width/2, this.gameCanvas.width/2 );
        }
        
        // Handle the completed rows, columns, and boxes (e.g., clear them)
        this.handleCompletedRows(completedRows);
        this.handleCompletedColumns(completedColumns);
        this.handleCompletedBoxes(completedBoxes);
        console.log("3. S-au sters celulele")
    }

    //We call this function to show the points you get when you clear someting (e.g., column, row, box)
    handleScoreIncrementAnimation(points, x, y) {
        let startTime = performance.now();
        let animationDuration = 1000; // Duration of the animation in milliseconds
        let opacity = 1;
        let that = this;
    
        function animate() {
            const elapsedTime = performance.now() - startTime;
            const progress = Math.min(elapsedTime / animationDuration, 1); // Ensure progress does not exceed 1
    
            // Update position (e.g., move upward)
            y -= 1 * progress; // Adjust speed as needed
    
            // Update opacity (e.g., fade out)
            opacity = 1 - progress;
    
            // Redraw the canvas with the updated score increment text
            that.redrawCanvasWithScoreIncrement(points, x, y, opacity);
    
            // Continue the animation if not finished
            if (progress < 1) {
                requestAnimationFrame(animate);

            }
        }
    
        // Start the animation
        animate();
    }
    
    // We call this function to redraw the Canvas for every frame of the animation
    redrawCanvasWithScoreIncrement(points, x, y, opacity) {
        let ctx = this.ctx;
        // Clear the canvas
        ctx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    
        // Redraw the grid
        this.drawGrid();
    
        // Redraw the shapes
        this.positionAndDrawShapes(this.randomShapes)
    
        // Draw the score increment text
        ctx.fillStyle = `rgba(193,58, 6, ${opacity})`;
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`+${points}`, x, y);
    }
    
    // We call this function to animate the score bar (e.g. from 0 you get 4 points so it's animated the sequence between them 0 - 1 - 2 - 3 - 4)
    animateScore(initialScore, targetScore, duration = 200) {
        const startTime = performance.now();
        const scoreDisplay = document.getElementById('score');

        function updateScore(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentScore = Math.round(initialScore + (targetScore - initialScore) * progress);

            if (scoreDisplay) {
                scoreDisplay.textContent = currentScore;
            }

            if (progress < 1) {
                requestAnimationFrame(updateScore);
            }
        }

        requestAnimationFrame(updateScore);
    }

    //We call this function to update the Score Bar
    updateScore(scoreIncrement) {
        const initialScore = this.totalScore;
        const targetScore = initialScore + scoreIncrement;
        this.animateScore(initialScore, targetScore);
        this.totalScore = targetScore;
        this.updateBestScore(targetScore);
    }


    //We check if a shape is placeable on the grid or not
    checkGridAvailability(shape) {
        if (shape) {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.canPlaceShapeAtPosition(shape, col * this.cellSize, row * this.cellSize)) {
                    shape.clickable = true;
                    return true; // The shape can be placed at this position
                }
            }
        }
        shape.clickable = false;
    }
    }

    //We call this function to fill the empty cells
    updateGrid(shape) {
        shape.cells.forEach(cell => {
            const cellX = Math.floor((shape.x + cell.col * this.cellSize) / this.cellSize);
            const cellY = Math.floor((shape.y + cell.row * this.cellSize) / this.cellSize);
    
            // Mark the cell as occupied by the placed shape
            this.grid[cellY][cellX] = shape;
        });
    }

    //function which redraws the canvas 
    redrawCanvas() {
        //check the availability of the shapes when redrawing
        this.randomShapes.map(x=> this.checkGridAvailability(x));
        if (!this.gameOver){
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvasWidth, this.gameCanvas.height);

        // Redraw the grid
        this.drawGrid();

        this.positionAndDrawShapes(this.randomShapes)
        // Redraw the shapes
        if (this.isDragging && this.selectedShape){
            this.positionAndDrawSelectedShape(this.selectedShape)
        }}else{
            this.drawGameOver();
        }
    }

    //We call this function to show the game over screen
    drawGameOver() {
        
        let finalScore = document.getElementById('final-score');
        finalScore.textContent = this.totalScore;

        let gameContainer = document.getElementById('game-container');
        let gameOverContainer = document.getElementById('gameover-container');
        gameContainer.style.display = 'none';
        gameOverContainer.style.display = 'flex';
        
        let miniatureGrid = document.getElementById('miniature-grid');
        let ctx = miniatureGrid.getContext("2d");
        let cellSize = miniatureGrid.width / this.gridSize;
        
        this.drawGrid(ctx, cellSize, miniatureGrid)
        let button = document.getElementById('new-game');
        button.addEventListener('click', () => this.restartGame())
        
    }

    //We call this function to start a new game
    restartGame() {
        let gameContainer = document.getElementById('game-container');
        let gameOverContainer = document.getElementById('gameover-container');
        gameContainer.style.display = 'block';
        gameOverContainer.style.display = 'none';
        // Reset game state
        this.grid = Array.from({ length: this.gridSize }, () => Array(this.gridSize).fill(null));
        this.randomShapes = this.generateNewRandomShapes();
        this.isDragging = false;
        this.selectedShape = null;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.isPlacementPossible = false;
        this.totalScore = 0;
        this.gameOver = false;

        // Clear the canvas and redraw
        this.ctx.clearRect(0, 0, this.canvasWidth, this.gameCanvas.height);
        this.redrawCanvas();
        this.updateScore(this.totalScore);
    }

}

document.addEventListener("DOMContentLoaded", function () {

    const game = new BlockudokuGame();
});