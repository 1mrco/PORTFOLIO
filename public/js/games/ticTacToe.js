// Fully playable Tic Tac Toe game encapsulated in a class.
export class TicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
        this.winningLines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        this.player = { name: "", score: 0 };
        this.isPlayerTurn = true;
        this.started = false;
        this.boardElement = document.getElementById("ttt-board");
        this.nameInput = document.getElementById("ttt-player-name");
        this.startButton = document.getElementById("ttt-start");
        this.resetButton = document.getElementById("ttt-reset");
        this.playerDisplay = document.getElementById("ttt-player-display");
        this.scoreDisplay = document.getElementById("ttt-score");
        this.initialiseBoard();
        this.attachEvents();
        this.updateScoreDisplay();
    }
    // Create the clickable 3×3 grid.
    initialiseBoard() {
        if (!this.boardElement)
            return;
        this.boardElement.innerHTML = "";
        for (let i = 0; i < 9; i += 1) {
            const cell = document.createElement("button");
            cell.className = "ttt-cell";
            cell.dataset.index = String(i);
            cell.type = "button";
            this.boardElement.appendChild(cell);
        }
    }
    attachEvents() {
        var _a, _b, _c, _d;
        (_a = this.boardElement) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (event) => {
            const target = event.target;
            const cell = target.closest(".ttt-cell");
            if (!cell)
                return;
            this.handleCellClick(cell);
        });
        (_b = this.startButton) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => this.start());
        // Allow pressing Enter in the name field to start immediately.
        (_c = this.nameInput) === null || _c === void 0 ? void 0 : _c.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.start();
            }
        });
        (_d = this.resetButton) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => this.resetBoard());
    }
    // Player must enter name before starting.
    start() {
        var _a;
        const name = (_a = this.nameInput) === null || _a === void 0 ? void 0 : _a.value.trim();
        if (!name) {
            window.alert("Please enter your name before starting Tic Tac Toe.");
            return;
        }
        this.player.name = name;
        this.started = true;
        this.isPlayerTurn = true;
        this.playerDisplayText(this.player.name);
        this.resetBoard();
    }
    handleCellClick(cell) {
        if (!this.started || !this.isPlayerTurn)
            return;
        const index = Number(cell.dataset.index);
        if (Number.isNaN(index) || this.board[index] !== null)
            return;
        // Human player is "X"
        this.board[index] = "X";
        cell.textContent = "X";
        const winner = this.checkWinner();
        if (winner) {
            if (winner === "X") {
                // Increment in-memory score on win.
                this.player.score += 1;
                this.updateScoreDisplay();
                // Save score to server
                this.savePlayerScore();
            }
            this.highlightWinningLine();
            window.setTimeout(() => this.resetBoard(), 700);
            return;
        }
        if (this.board.every((v) => v !== null)) {
            // Draw – just reset the board after a short delay.
            window.setTimeout(() => this.resetBoard(), 500);
            return;
        }
        this.isPlayerTurn = false;
        window.setTimeout(() => this.aiMove(), 400);
    }
    // Intelligent AI using minimax algorithm for optimal play.
    aiMove() {
        var _a;
        const available = this.board
            .map((v, i) => ({ v, i }))
            .filter((cell) => cell.v === null)
            .map((cell) => cell.i);
        if (available.length === 0)
            return;
        // Use minimax to find the best move
        const bestMove = this.getBestMove();
        this.board[bestMove] = "O";
        const cell = (_a = this.boardElement) === null || _a === void 0 ? void 0 : _a.querySelector(`.ttt-cell[data-index="${bestMove}"]`);
        if (cell) {
            cell.textContent = "O";
        }
        const winner = this.checkWinner();
        if (winner) {
            if (winner === "X") {
                this.player.score += 1;
                this.updateScoreDisplay();
            }
            this.highlightWinningLine();
            window.setTimeout(() => this.resetBoard(), 700);
            return;
        }
        this.isPlayerTurn = true;
    }
    // Get the best move using minimax algorithm
    getBestMove() {
        let bestScore = -Infinity;
        let bestMove = -1;
        // Try all available moves and find the best one
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === null) {
                // Create a copy of the board for evaluation
                const boardCopy = [...this.board];
                // Make the move on the copy
                boardCopy[i] = "O";
                // Evaluate the move
                const score = this.minimax(boardCopy, 0, false);
                // Update best move if this is better
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        // Fallback to first available move (shouldn't happen)
        return bestMove >= 0 ? bestMove : this.board.findIndex((cell) => cell === null);
    }
    // Minimax algorithm: returns the best score for the current board state
    // depth: current depth in the game tree
    // isMaximizing: true if it's AI's turn (O), false if it's player's turn (X)
    minimax(board, depth, isMaximizing) {
        // Check for terminal states
        const winner = this.checkWinnerForBoard(board);
        if (winner === "O") {
            // AI wins
            return 10 - depth; // Prefer winning in fewer moves
        }
        if (winner === "X") {
            // Player wins
            return depth - 10; // Prefer losing in more moves (if unavoidable)
        }
        if (board.every((cell) => cell !== null)) {
            // Draw
            return 0;
        }
        if (isMaximizing) {
            // AI's turn - maximize score
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    // Create a copy for this branch
                    const boardCopy = [...board];
                    boardCopy[i] = "O";
                    const score = this.minimax(boardCopy, depth + 1, false);
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        }
        else {
            // Player's turn - minimize score
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    // Create a copy for this branch
                    const boardCopy = [...board];
                    boardCopy[i] = "X";
                    const score = this.minimax(boardCopy, depth + 1, true);
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
    // Check winner for a given board state (used by minimax)
    checkWinnerForBoard(board) {
        for (const [a, b, c] of this.winningLines) {
            const value = board[a];
            if (value && value === board[b] && value === board[c]) {
                return value;
            }
        }
        return null;
    }
    checkWinner() {
        for (const [a, b, c] of this.winningLines) {
            const value = this.board[a];
            if (value && value === this.board[b] && value === this.board[c]) {
                return value;
            }
        }
        return null;
    }
    // Visually highlight the winning line.
    highlightWinningLine() {
        if (!this.boardElement)
            return;
        for (const [a, b, c] of this.winningLines) {
            const values = [
                this.board[a],
                this.board[b],
                this.board[c]
            ];
            if (values[0] && values[0] === values[1] && values[1] === values[2]) {
                const indices = [a, b, c];
                indices.forEach((index) => {
                    var _a;
                    const cell = (_a = this.boardElement) === null || _a === void 0 ? void 0 : _a.querySelector(`.ttt-cell[data-index="${index}"]`);
                    if (cell) {
                        cell.classList.add("ttt-cell--winning");
                    }
                });
                break;
            }
        }
    }
    // Reset only the board – scores stay in memory.
    resetBoard() {
        this.board = Array(9).fill(null);
        this.isPlayerTurn = true;
        if (!this.boardElement)
            return;
        const cells = this.boardElement.querySelectorAll(".ttt-cell");
        cells.forEach((cell) => {
            cell.textContent = "";
            cell.classList.remove("ttt-cell--winning");
        });
    }
    updateScoreDisplay() {
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = String(this.player.score);
        }
        this.playerDisplayText(this.player.name || "—");
    }
    playerDisplayText(text) {
        if (this.playerDisplay) {
            this.playerDisplay.textContent = text;
        }
    }
    // Save player score to server
    async savePlayerScore() {
        if (!this.player.name || this.player.score === 0)
            return;
        try {
            const response = await fetch("/api/players", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: this.player.name,
                    game: "Tic Tac Toe",
                    score: this.player.score,
                }),
            });
            if (!response.ok) {
                console.error("Failed to save player score");
            }
        }
        catch (error) {
            console.error("Error saving player score:", error);
            // Silently fail - don't interrupt game experience
        }
    }
}
