"use strict";
class TicTacToe {
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
        this.board[index] = "X";
        cell.textContent = "X";
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
        if (this.board.every((v) => v !== null)) {
            window.setTimeout(() => this.resetBoard(), 500);
            return;
        }
        this.isPlayerTurn = false;
        window.setTimeout(() => this.aiMove(), 400);
    }
    aiMove() {
        var _a;
        const available = this.board
            .map((v, i) => ({ v, i }))
            .filter((cell) => cell.v === null)
            .map((cell) => cell.i);
        if (available.length === 0)
            return;
        const choice = available[Math.floor(Math.random() * available.length)];
        this.board[choice] = "O";
        const cell = (_a = this.boardElement) === null || _a === void 0 ? void 0 : _a.querySelector(`.ttt-cell[data-index="${choice}"]`);
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
    checkWinner() {
        for (const [a, b, c] of this.winningLines) {
            const value = this.board[a];
            if (value && value === this.board[b] && value === this.board[c]) {
                return value;
            }
        }
        return null;
    }
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
}
// ---------- Initialiser ----------
function initGames() {
    if (document.getElementById("ttt-board")) {
        // eslint-disable-next-line no-new
        new TicTacToe();
    }
}
document.addEventListener("DOMContentLoaded", () => {
    initGames();
});
