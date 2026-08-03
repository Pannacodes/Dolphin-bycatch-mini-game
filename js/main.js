//* ============================================================
//* GLOBAL DOM ELEMENTS
//* ============================================================
//* I select and store all the HTML elements that my game will
//* interact with. By saving them in variables once at the start,
//* I avoid searching the DOM multiple times, making the code
//* cleaner, easier to read, and more efficient.
//* ============================================================

//* ---------- SCREENS ----------
// The game has three different screens:
// 1. Start Screen
// 2. Game Screen
// 3. Game Over Screen
// The screens will show or hide depending on the current game state.

const startScreenNode = document.querySelector("#start-screen");
const gameScreenNode = document.querySelector("#game-screen");
const gameOverScreenNode = document.querySelector("#game-over-screen");

//* ---------- BUTTONS ----------
// These buttons allow the player to control the game.
// The Start button begins a new game.
// The Restart button starts a new game after losing.

const startBtnNode = document.querySelector("#start-btn");
const restartBtnNode = document.querySelector("#restart-btn");

//* ---------- GAME AREA ----------
// The game box is the main play area.
// The dolphin, fish, and fishnets will all be added inside
// this container while the game is running.

const gameBoxNode = document.querySelector("#game-box");

//* ---------- SCORE DISPLAY ----------
// scoreValueNode updates during gameplay whenever the player
// catches a fish.
// finalScoreValueNode shows the player's final score on the
// Game Over screen.

const scoreValueNode = document.querySelector("#score-value");
const finalScoreValueNode = document.querySelector("#final-score-value");

//* ============================================================
//* GLOBAL GAME VARIABLES
//* They describe the current "state" of the game at any moment.
//* They start as null/empty because the game hasn't started yet.
//* ============================================================

let gameIntervalId = null; // the main game loop interval
let fishSpawnIntervalId = null; // spawns a new fish every X ms
let netSpawnIntervalId = null; // spawns a new fishnet every X ms

let playerObj = null; // add near the top with your other globals
let fishArr = []; // all Fish currently on screen
let netsArr = []; // all Fishnets currently on screen

//* ============================================================
//* GAME SETUP / TEARDOWN
//* ============================================================

function startGame() {
  startScreenNode.style.display = "none";
  gameScreenNode.style.display = "flex";
  gameOverScreenNode.style.dsplay = "none"; // <- when restarting

  playerObj = new dolphin();

  gameIntervalId = setInterval(gameLoop, Math.floor(1000 / 60)); // main loop (runs ~60 times per second)
  fishSpawnIntervalId = setInterval(addNewFish, 1200);
  netSpawnIntervalId = setInterval(addNewNet, 2200);
}

//* ============================================================
//* SPAWNING ENTITIES
//* ============================================================

function addNewFish() {
  let randomPosY = Math.random() * (gameBoxNode.offsetHeight - 40); // pick a random vertical position within the game box

  let fishObj = new Fish(randomPosY);
  fishArr.push(fishObj);
}

function addNewNet() {
  let randomPosY = Math.random() * (gameBoxNode.offsetHeight - 60)

  let netObj = new Fishnet(randomPosY)
  netsArr.push(netObj)
}


//* ============================================================
//* DESPAWNING ENTITIES (cleanup once they exit the screen)
//* ============================================================
function checkFishDespawn() {
  if (fishArr.length === 0) return;
  if (fishArr[0].x <= 0 - fishArr[0].width) {
    fishArr[0].node.remove();
    fishArr.splice(0, 1);
  }
}

function checkNetDespawn() {
  if (netsArr.length === 0) {
    return
  }
 
  if (netsArr[0].x <= (0 - netsArr[0].width)) {
    netsArr[0].node.remove()
    netsArr.splice(0, 1)
  }
}


//* ============================================================
//* MAIN GAME LOOP
//* This function runs ~60 times per second while the game is active.
//* ============================================================
function gameLoop() {
  fishArr.forEach((fishObj) => fishObj.automaticMovementLeft());
  netsArr.forEach((netObj) => netObj.automaticMovementLeft())
  checkFishDespawn();
  checkNetDespawn();
  
}

//* ============================================================
//* EVENT LISTENERS
//* ============================================================
startBtnNode.addEventListener("click", startGame);

window.addEventListener("keydown", (event) => {
  if (!playerObj) {
    return; // ignore key presses when there's no active dolphin (e.g. on the start screen)
  }

  event.preventDefault(); // stops the arrow keys from scrolling the page

  if (event.key === "ArrowUp") {
    playerObj.moveUp();
  } else if (event.key === "ArrowDown") {
    playerObj.moveDown();
  }
});
