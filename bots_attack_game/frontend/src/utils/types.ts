export type CellState = 0n | 0 | 1n | 1 | 2n | 2 | 3n | 3;
export type BoardState = CellState[][];

export interface Ship {
  id: number;
  row: number;
  col: number;
}

export interface GameState {
  board: BoardState;
  ships?: Ship[];
}

export type GameStatus = null | "waiting-for-match" | "board-not-set" | "opponent-board-not-set" | "players-turn" | "opponents-turn" | "win" | "loss";
