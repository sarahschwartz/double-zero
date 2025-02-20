import {
  BoardState,
  CellState,
  GameState,
  Ship,
} from "./types";
import { writeGameContract } from "./wagmi-config";

export const moveShipOnBoard = (oldShip: Ship, newShip: Ship, board: BoardState) => {
  const newBoard = board.map((row) => [...row]);
  newBoard[oldShip.row][oldShip.col] = 0n;
  newBoard[newShip.row][newShip.col] = 1n;
  return newBoard;
};

export const placeShipOnBoard = (ship: Ship, board: BoardState) => {
  const newBoard = board.map((row) => [...row]);
  newBoard[ship.row][ship.col] = 1n;
  return newBoard;
};

export const handleSubmitBoard = async (
  e: React.MouseEvent,
  gameID: bigint | null,
  playerAddress: `0x${string}`,
  gameState: GameState,
  getPlayerGames: () => void
) => {
  e.preventDefault();
  if (!gameID) {
    console.log("No game ID");
    return;
  }
  try{
    await writeGameContract("placeBots", [gameID, playerAddress, gameState.board]);
    getPlayerGames();
  } catch (errr){
    alert("Error placing bots. Please try again.");
    console.log("ERROR:", errr);
  }
};

export const getCellContent = (state: CellState) => {
  const normalized = state.toString();
  switch (normalized) {
    case "1":
      return "🤖";
    case "2":
      return "🔥";
    case "3":
      return " 🟦";
    default:
      return null;
  }
};
