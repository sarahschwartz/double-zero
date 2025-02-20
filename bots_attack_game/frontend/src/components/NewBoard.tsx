import React, { useEffect, useState } from "react";
import type { Ship, GameState, GameStatus } from "../utils/types";
import {
  moveShipOnBoard,
  handleSubmitBoard,
  placeShipOnBoard,
  getCellContent,
} from "../utils/board";
import { TOTAL_BOTS } from "../utils/constants";
import { Labels } from "./Labels";
import { writeGameContract } from "../utils/wagmi-config";
import { useAccount } from "wagmi";

interface BoardProps {
  boardState: GameState | null;
  gameID: bigint | null;
  gameStatus: GameStatus;
  getPlayerGames: () => void;
  isOpponentBoard?: boolean;
}

const BattleshipBoard = ({ boardState, gameID, gameStatus, getPlayerGames, isOpponentBoard }: BoardProps) => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(TOTAL_BOTS)
      .fill(null)
      .map(() => Array(TOTAL_BOTS).fill(0n)),
    ships: [],
  });

  useEffect(() => {
    if (boardState) {
      setGameState(boardState);
    }
  }, [boardState]);
  
  const [draggedShipId, setDraggedShipId] = useState<number | null>(null);
  const { address } = useAccount();
  const canDrag = !isOpponentBoard && gameStatus === "board-not-set";
  const remainingShips = gameState && gameState.ships ? TOTAL_BOTS - gameState.ships.length : 0;

  const onCellClick = async (row: number, col: number) => {
    switch (gameStatus) {
      case 'players-turn':
        if(!isOpponentBoard) return;
        await handleAttackingClick(row, col);
        break;
      case "board-not-set":
        handlePlacementClick(row, col);
        break;
      default:
    };
  }

  async function handleAttackingClick(row: number, col: number) {
    await writeGameContract("tryHackingBot", [address, gameID, row, col]);
    getPlayerGames();
  }

  const handlePlacementClick = (row: number, col: number) => {
    if (gameState.ships!.length >= TOTAL_BOTS) return;
  
    const newShip: Ship = {
      id: Date.now(),
      row: row,
      col: col,
    };
    setGameState((prevState) => ({
      board: placeShipOnBoard(newShip, gameState.board),
      ships: [...prevState.ships!, newShip],
    }));
  };

  const onDragStart = (_e: React.DragEvent, shipId: number) => {
    if (!canDrag) return;
    setDraggedShipId(shipId);
  };

  const onDragOver = (e: React.DragEvent) => {
    if (!canDrag) return;
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, row: number, col: number) => {
    if (!canDrag) return;
    e.preventDefault();
    if (draggedShipId === null) return;

    const ship = gameState.ships!.find((s) => s.id === draggedShipId);
    if (!ship) return;

    setGameState((prevState) => {
      // Create updated ship with new position
      const updatedShip = { ...ship, startRow: row, startCol: col };
      // Place the ship in its new position
      const newBoard = moveShipOnBoard(ship, updatedShip, gameState.board);
      // Update the ships array
      const updatedShips = prevState.ships!.map((s) =>
        s.id === draggedShipId ? updatedShip : s
      );
      return {
        board: newBoard,
        ships: updatedShips,
      };
    });

    setDraggedShipId(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
    <h2 className="board-title">{isOpponentBoard ? "Target Board" : "Your Fleet"}</h2>
    <div>

      <div className="outer-board-container">
        <Labels xLabels />
        <div className="outer-board">
          <Labels />
          <div className="board">
            {gameState && gameState.board.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const ship = gameState.ships ? gameState.ships.find((s) => {
                  if(s.row === rowIndex && s.col === colIndex) return true;
                  return false;
                }) : false;

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => onCellClick(rowIndex, colIndex)}
                    onDragOver={onDragOver}
                    onDrop={(e) => onDrop(e, rowIndex, colIndex)}
                    className={`cell ${cell === 1n ? "bot-placed" : ""} ${
                      cell === 2n ? "cell-hit" : ""
                    } ${cell === 3n ? "cell-miss" : ""}`}
                    draggable={ship ? true : false}
                    onDragStart={ship ? (e) => onDragStart(e, ship.id) : undefined}
                  >
                    {getCellContent(cell)}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {address && !isOpponentBoard && gameState && gameStatus === "board-not-set" && (
        <div style={{ marginTop: "10px" }}>
          <span className="label">Remaining Bots:{" "}</span>{remainingShips}
          {remainingShips === 0 && (
            <div>
              <button className="button" onClick={(e) => handleSubmitBoard(e, gameID, address, gameState, getPlayerGames)}>
                Submit Board
              </button>
            </div>
          )}
          <div>
      </div>
        </div>
      )}

    </div>
    </div>
  );
};

export default BattleshipBoard;
