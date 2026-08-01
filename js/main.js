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
