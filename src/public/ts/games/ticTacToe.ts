export type PlayerInfo = {
  name: string;
  score: number;
};

type TttCellValue = "X" | "O" | null;

// Fully playable Tic Tac Toe game encapsulated in a class.
export class TicTacToe {
  private board: TttCellValue[] = Array(9).fill(null);

  private readonly winningLines: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  private player: PlayerInfo = { name: "", score: 0 };

  private isPlayerTurn = true;

  private started = false;

  private boardElement: HTMLElement | null;

  private nameInput: HTMLInputElement | null;

  private startButton: HTMLButtonElement | null;

  private resetButton: HTMLButtonElement | null;

  private playerDisplay: HTMLElement | null;

  private scoreDisplay: HTMLElement | null;

  constructor() {
    this.boardElement = document.getElementById("ttt-board");
    this.nameInput = document.getElementById("ttt-player-name") as HTMLInputElement | null;
    this.startButton = document.getElementById("ttt-start") as HTMLButtonElement | null;
    this.resetButton = document.getElementById("ttt-reset") as HTMLButtonElement | null;
    this.playerDisplay = document.getElementById("ttt-player-display");
    this.scoreDisplay = document.getElementById("ttt-score");

    this.initialiseBoard();
    this.attachEvents();
    this.updateScoreDisplay();
  }

  // Create the clickable 3×3 grid.
  private initialiseBoard(): void {
    if (!this.boardElement) return;
    this.boardElement.innerHTML = "";
    for (let i = 0; i < 9; i += 1) {
      const cell = document.createElement("button");
      cell.className = "ttt-cell";
      cell.dataset.index = String(i);
      cell.type = "button";
      this.boardElement.appendChild(cell);
    }
  }

  private attachEvents(): void {
    this.boardElement?.addEventListener("click", (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const cell = target.closest<HTMLButtonElement>(".ttt-cell");
      if (!cell) return;
      this.handleCellClick(cell);
    });

    this.startButton?.addEventListener("click", () => this.start());

    // Allow pressing Enter in the name field to start immediately.
    this.nameInput?.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.start();
      }
    });
    this.resetButton?.addEventListener("click", () => this.resetBoard());
  }

  // Player must enter name before starting.
  private start(): void {
    const name = this.nameInput?.value.trim();
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

  private handleCellClick(cell: HTMLButtonElement): void {
    if (!this.started || !this.isPlayerTurn) return;
    const index = Number(cell.dataset.index);
    if (Number.isNaN(index) || this.board[index] !== null) return;

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
  private aiMove(): void {
    const available = this.board
      .map((v, i) => ({ v, i }))
      .filter((cell) => cell.v === null)
      .map((cell) => cell.i);
    if (available.length === 0) return;

    // Use minimax to find the best move
    const bestMove = this.getBestMove();
    this.board[bestMove] = "O";
    const cell = this.boardElement?.querySelector<HTMLButtonElement>(
      `.ttt-cell[data-index="${bestMove}"]`
    );
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
  private getBestMove(): number {
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
  private minimax(board: TttCellValue[], depth: number, isMaximizing: boolean): number {
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
    } else {
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
  private checkWinnerForBoard(board: TttCellValue[]): TttCellValue {
    for (const [a, b, c] of this.winningLines) {
      const value = board[a];
      if (value && value === board[b] && value === board[c]) {
        return value;
      }
    }
    return null;
  }

  private checkWinner(): TttCellValue {
    for (const [a, b, c] of this.winningLines) {
      const value = this.board[a];
      if (value && value === this.board[b] && value === this.board[c]) {
        return value;
      }
    }
    return null;
  }

  // Visually highlight the winning line.
  private highlightWinningLine(): void {
    if (!this.boardElement) return;
    for (const [a, b, c] of this.winningLines) {
      const values: [TttCellValue, TttCellValue, TttCellValue] = [
        this.board[a],
        this.board[b],
        this.board[c]
      ];
      if (values[0] && values[0] === values[1] && values[1] === values[2]) {
        const indices = [a, b, c];
        indices.forEach((index) => {
          const cell = this.boardElement?.querySelector<HTMLButtonElement>(
            `.ttt-cell[data-index="${index}"]`
          );
          if (cell) {
            cell.classList.add("ttt-cell--winning");
          }
        });
        break;
      }
    }
  }

  // Reset only the board – scores stay in memory.
  private resetBoard(): void {
    this.board = Array(9).fill(null);
    this.isPlayerTurn = true;
    if (!this.boardElement) return;
    const cells = this.boardElement.querySelectorAll<HTMLButtonElement>(".ttt-cell");
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("ttt-cell--winning");
    });
  }

  private updateScoreDisplay(): void {
    if (this.scoreDisplay) {
      this.scoreDisplay.textContent = String(this.player.score);
    }
    this.playerDisplayText(this.player.name || "—");
  }

  private playerDisplayText(text: string): void {
    if (this.playerDisplay) {
      this.playerDisplay.textContent = text;
    }
  }

  // Save player score to server
  private async savePlayerScore(): Promise<void> {
    if (!this.player.name || this.player.score === 0) return;

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
    } catch (error) {
      console.error("Error saving player score:", error);
      // Silently fail - don't interrupt game experience
    }
  }
}


