import { useAccount } from "wagmi";
import { readGameContract, writeGameContract } from "./utils/wagmi-config";
import { useEffect, useState } from "react";
import { ZERO_ADDRESS } from "./utils/constants";
import BattleshipBoard from "./components/NewBoard";
import type { BoardState, GameState, GameStatus } from "./utils/types";

export function Game() {
  const [gameStatus, setGameStatus] = useState<GameStatus>(null);
  const [playerBoard, setPlayerBoard] = useState<GameState | null>(null);
  const [opponentBoard, setOpponentBoard] = useState<GameState | null>(null);
  const [gameID, setGameID] = useState<bigint | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    async function handleInit() {
      await getPlayerGames();
    }
    handleInit();
  }, []);

  useEffect(() => {
    function combineBoards(playerBoard: BoardState, previousHits: BoardState): GameState {
      const combinedBoard = playerBoard.map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          const cell2 = previousHits[rowIndex][colIndex];
          if(cell2 === 0 || cell2 === 0n){
            return cell;
          }
          return cell2;
        });
      });
      return { board: combinedBoard };
    }
    async function getBoardData(){
    if(gameStatus === 'players-turn' || gameStatus === 'opponents-turn' || gameStatus === 'win' || gameStatus === 'loss'){
      const boardData = await readGameContract('getPlayerBoards', [address, gameID]);
      if(!Array.isArray(boardData) || boardData.length !== 3){
        console.log("Invalid response from getPlayerBoards");
        return;
      }
      const playerBoard = boardData[0];
      const previousHackAttemps = boardData[1];
      const previousHits = boardData[2];
      const combinedBoard = combineBoards(playerBoard, previousHits);
      setPlayerBoard(combinedBoard);
      setOpponentBoard({ board: previousHackAttemps });
    }
  }

  getBoardData();
}, [gameStatus, address, gameID]);

  async function getPlayerGames() {
    const playerGames = await readGameContract("getPlayerGames", [address]);
    if (!Array.isArray(playerGames)) {
      console.log("Invalid response from getPlayerGames");
      return;
    }
    if (playerGames.length === 0) {
      console.log("No games found for player");
      setGameStatus(null);
      return;
    }
    const latestGame = playerGames[playerGames.length - 1];
    setGameID(latestGame);
    const gameStatus = await readGameContract("getGameState", [latestGame]);
    if (!Array.isArray(gameStatus) || gameStatus.length !== 10) {
      console.log("Invalid response from getGameState");
      return;
    }
    const isPlayerOne = gameStatus[0] === address;
    if (gameStatus[1] === ZERO_ADDRESS) {
      setGameStatus("waiting-for-match");
    } else if ((isPlayerOne && gameStatus[2] === false) || (!isPlayerOne && gameStatus[3] === false)) {
        setGameStatus("board-not-set");
    } else if ((isPlayerOne && gameStatus[3] === false) || (!isPlayerOne && gameStatus[2] === false)) {
        setGameStatus("opponent-board-not-set");
    } else if (gameStatus[4] === true && gameStatus[5] !== ZERO_ADDRESS) {
      if (gameStatus[5] === address) {
        setGameStatus("win");
      } else {
        setGameStatus("loss");
      }
    } else {
      const playerOneTurn = gameStatus[9] === true;
      const isPlayerTurn = playerOneTurn ? isPlayerOne : !isPlayerOne;
      setGameStatus(isPlayerTurn ? "players-turn" : "opponents-turn");
    }
  }

  async function handleStartGame() {
    await writeGameContract("startGame", []);
    getPlayerGames();
  }

  return (
    <div>
      <div className="info-bar">
      
      {gameStatus === null ? (<>
      <button className="button" onClick={handleStartGame}>Start Game</button>
        <p>No active game found</p>
      </>) : (
        <>
        <p><span className="label">Game ID:{" "}</span>{gameID?.toString()}</p>
        </>
      )}
      <p>
        <span className="label">Status:{" "}</span>
        {gameStatus === "waiting-for-match" && <span>Waiting for opponent...</span>}
      {gameStatus === "waiting-for-match" && <span>Waiting for opponent...</span>}
      {gameStatus === "board-not-set" && <span>Set your board!</span>}
      {gameStatus === "opponent-board-not-set" && (
        <span>Opponent is setting their board...</span>
      )}
      {gameStatus === "players-turn" && <span>Your turn!</span>}
      {gameStatus === "opponents-turn" && <span>Waiting for opponent...</span>}
      {gameStatus === "win" && <span>🎉 You won!</span>}
      {gameStatus === "loss" && <span>🫤 You lost.</span>}
      </p>
      {gameStatus === "win" || gameStatus === "loss" && (
        <button className="button" onClick={handleStartGame}>Start New Game</button>
      )}
      <button className="button" onClick={getPlayerGames}>Refresh</button>
      </div>
      <div className="boards-container">
        <BattleshipBoard
          boardState={playerBoard}
          gameID={gameID}
          gameStatus={gameStatus}
          getPlayerGames={getPlayerGames}
        />
        {(gameStatus === 'players-turn' || gameStatus === 'opponents-turn' || gameStatus === 'win' || gameStatus === 'loss') && (
        <BattleshipBoard
          boardState={opponentBoard}
          gameID={gameID}
          gameStatus={gameStatus}
          getPlayerGames={getPlayerGames}
          isOpponentBoard
        />
        )}
      </div>
    </div>
  );
}
