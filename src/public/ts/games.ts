type PlayerInfo = {
  name: string;
  score: number;
};

// ---------- Tic Tac Toe ----------

type TttCellValue = "X" | "O" | null;

class TicTacToe {
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

  private aiMove(): void {
    const available = this.board
      .map((v, i) => ({ v, i }))
      .filter((cell) => cell.v === null)
      .map((cell) => cell.i);
    if (available.length === 0) return;

    const choice = available[Math.floor(Math.random() * available.length)];
    this.board[choice] = "O";
    const cell = this.boardElement?.querySelector<HTMLButtonElement>(
      `.ttt-cell[data-index="${choice}"]`
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

  private checkWinner(): TttCellValue {
    for (const [a, b, c] of this.winningLines) {
      const value = this.board[a];
      if (value && value === this.board[b] && value === this.board[c]) {
        return value;
      }
    }
    return null;
  }

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
}

// ---------- Initialiser ----------

function initGames(): void {
  if (document.getElementById("ttt-board")) {
    // eslint-disable-next-line no-new
    new TicTacToe();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initGames();
});

