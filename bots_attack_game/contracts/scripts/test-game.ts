// Script that interacts with a Greeter contract
import { BaseContract, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import assert from "node:assert";

type BotLocationsArray = [
  [number, number, number, number, number],
  [number, number, number, number, number],
  [number, number, number, number, number],
  [number, number, number, number, number],
  [number, number, number, number, number]
];

// Address of the contract to interact with
const CONTRACT_ADDRESS = process.env.GAME_CONTRACT_ADDRESS;

async function main() {
  if (!CONTRACT_ADDRESS)
    throw "⛔️ Provide address of the contract to interact with!";
  console.log(`Running script to interact with contract ${CONTRACT_ADDRESS}`);

  // Get the first signer
  const [signer1, signer2] = await ethers.getSigners();
  let tx;
  const gameID = 1;

  // Get the contract factory and deploy
  const gameFactory = await ethers.getContractFactory("BotsAttack");
  const contractPlayer1 = gameFactory.connect(signer1).attach(CONTRACT_ADDRESS);
  const contractPlayer2 = gameFactory.connect(signer2).attach(CONTRACT_ADDRESS);

  // player 1 starts a new game
  tx = await contractPlayer1.startGame();
  await tx.wait();

  // player 2 joins
  tx = await contractPlayer2.startGame();
  await tx.wait();

  tx = await contractPlayer1.getGameState(gameID);
  console.log("GAME STATE TX1:", tx);

  // player 1 places bots
  const botLocations: BotLocationsArray = [
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 0, 0, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
  ];

  tx = await contractPlayer1.placeBots(gameID, botLocations);
  await tx.wait();
  console.log("PLACE BOTS TX1 OK");

  const botLocations2: BotLocationsArray = [
    [0, 1, 1, 0, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0],
  ];

  tx = await contractPlayer2.placeBots(gameID, botLocations2);
  await tx.wait();
  console.log("PLACE BOTS TX2 OK");

  const player1Attacks = [
    { row: 0, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 0 },
    { row: 2, col: 0 },
    { row: 2, col: 1 },
  ];
  const player2Attacks = [
    { row: 0, col: 2 },
    { row: 2, col: 0 },
    { row: 2, col: 3 },
    { row: 3, col: 1 },
    { row: 4, col: 2 },
  ];

  for (let i = 0; i < player1Attacks.length; i++) {
    await attack(
      player1Attacks[i].row,
      player1Attacks[i].col,
      contractPlayer1,
      signer1,
      gameID
    );
    await attack(
      player2Attacks[i].row,
      player2Attacks[i].col,
      contractPlayer2,
      signer2,
      gameID
    );
  }

  const log = await contractPlayer1.getPlayerBoards(signer1.address, gameID);
  console.log("Player 1 boards:", log);

  const log2 = await contractPlayer1.getPlayerBoards(signer1.address, gameID);
  console.log("Player 2 boards:", log2);

  const log3 = await contractPlayer1.getGameState(gameID);
  console.log("Final Game state:", log3);

  assert(log3[4], "Game isn't over");
  assert(log3[5] == signer2.address, "Player 2 didn't win");
}

async function attack(
  x: number,
  y: number,
  contract: BaseContract & Omit<Contract, keyof BaseContract>,
  signer: Signer,
  gameID: number
) {
  const attackX = x;
  const attackY = y;

  console.log(`Attacking ${attackX}, ${attackY}`);
  let tx = await contract.tryHackingBot(signer, gameID, attackX, attackY);
  await tx.wait();
  console.log("ATTACK TX OK");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
