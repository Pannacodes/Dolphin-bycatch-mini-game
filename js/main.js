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
const videoNode = document.querySelector("#pollution-video");

//* ---------- BUTTONS ----------
// These buttons allow the player to control the game.
// The Start button begins a new game.
// The Restart button starts a new game after losing.

const startBtnNode = document.querySelector("#start-btn");
const restartBtnNode = document.querySelector("#restart-btn");

//* ---------- GAME AREA ----------
// The game box is the main play area.
// The dolphin, fish, and pollution will all be added inside
// this container while the game is running.

const gameBoxNode = document.querySelector("#game-box");
const livesNode = document.querySelector("#lives");

//* ---------- SCORE DISPLAY ----------
// scoreValueNode updates during gameplay whenever the player
// catches a fish.
// finalScoreValueNode shows the player's final score on the
// Game Over screen.

const scoreValueNode = document.querySelector("#score-value");
const finalScoreValueNode = document.querySelector("#final-score-value");

//* ---------- SOUND ----------
const splashSoundNode = document.querySelector("#splash-sound");
const dolphinSoundNode = document.querySelector("#dolphin-sound");
const happyDolphinNode = document.querySelector("#dolphin-happy");
const gameMusicNode = document.querySelector("#game-music");
const soundToggleNode = document.querySelector("#sound-toggle");

gameMusicNode.volume = 0.6;
splashSoundNode.volume = 0.2;
dolphinSoundNode.volume = 0.4;
happyDolphinNode.volume = 0.2;

//* ============================================================
//* GLOBAL GAME VARIABLES
//* They describe the current "state" of the game at any moment.
//* They start as null/empty because the game hasn't started yet.
//* ============================================================

let gameIntervalId = null; // the main game loop interval
let fishSpawnIntervalId = null; // spawns a new fish every X ms
let pollutionSpawnIntervalId = null; // spawns a new pollution every X ms
let mantaSpawnIntervalId = null;

let playerObj = null; // the Dolphin instance - null until game starts

let fishArr = []; // all Fish currently on screen
let pollutionArr = []; // all pollution currently on screen
let mantaArr = [];
let score = 0; // how many fish the player has caught
const maxLives = 2; // starting lives
let lives = maxLives; // current dolphin lives

let isMuted = false;

let bgOffsetX = 0; // how far (in px) the background has scrolled so far
const bgScrollSpeed = 1; // how many px the background moves left per frame - tweak this to speed up/slow down the current

//* ============================================================
//* GAME SETUP / TEARDOWN
//* ============================================================

function startGame() {
  lives = maxLives;
  updateLivesDisplay();

  startScreenNode.style.display = "none";
  gameScreenNode.style.display = "flex";
  gameOverScreenNode.style.display = "none"; // <- when restarting

  splashSoundNode.currentTime = 0;
  splashSoundNode.play();

  dolphinSoundNode.currentTime = 0;
  dolphinSoundNode.play();

  gameMusicNode.currentTime = 0;
  gameMusicNode.play();

  playerObj = new Dolphin();

  gameIntervalId = setInterval(gameLoop, Math.floor(1000 / 60)); // main loop (runs ~60 times per second)
  fishSpawnIntervalId = setInterval(addNewFish, 1200);
  pollutionSpawnIntervalId = setInterval(addNewPollution, 2200);
  mantaSpawnIntervalId = setInterval(addNewManta, 10000);
}

function gameOver() {
  gameMusicNode.pause();
  gameMusicNode.currentTime = 0;
  // 1. switches screens
  gameScreenNode.style.display = "none";
  gameOverScreenNode.style.display = "flex";

  // 2. shows the final score on the game over screen
  finalScoreValueNode.textContent = score;

  // 3. stops all intervals - very important, otherwise the game
  //    keeps running invisibly in the background after game over
  clearInterval(gameIntervalId);
  clearInterval(fishSpawnIntervalId);
  clearInterval(pollutionSpawnIntervalId);
  clearInterval(mantaSpawnIntervalId);
}

function restartGame() {
  // Removes the existing dolphin from the DOM
  if (playerObj) {
    playerObj.node.remove();
  }
  videoNode.src = videoNode.src;
  // 1. clears every entity from the DOM
  //    (if we don't do this, old fish/pollution images stay stuck on screen)
  fishArr.forEach((fishObj) => fishObj.node.remove());
  pollutionArr.forEach((pollutionObj) => pollutionObj.node.remove());
  mantaArr.forEach((mantaObj) => mantaObj.node.remove());

  // 2. clears every entity from my JS tracking structures
  playerObj = null;
  fishArr = [];
  pollutionArr = [];
  mantaArr = [];

  // 3. resets score
  score = 0;
  updateScoreDisplay();

  // 4. resets the background scroll position (not required for it to work,
  //    just keeps the number from growing forever across many restarts)
  bgOffsetX = 0;
  gameBoxNode.style.backgroundPositionX = "0px";

  // 5. start a brand new game
  startGame();
}

//* ============================================================
//* SPAWNING ENTITIES
//* ============================================================

function addNewFish() {
  let randomPosY = Math.random() * (gameBoxNode.offsetHeight - 40); // picks a random vertical position within the game box
  let isFast = score >= 5 && Math.random() < 0.3;

  let fishObj = new Fish(randomPosY, isFast);
  fishArr.push(fishObj);
}

function addNewPollution() {
  let randomPosY = Math.random() * (gameBoxNode.offsetHeight - 60);

  let pollutionObj = new Pollution(randomPosY);
  pollutionArr.push(pollutionObj);
}

function addNewManta() {
  let mantaObj = new Manta();
  mantaArr.push(mantaObj);
}

//* ============================================================
//* DESPAWNING ENTITIES (cleanup once they exit the screen)
//* ============================================================
function checkFishDespawn() {
  fishArr.forEach((fish, index) => {
    if (fish.x < -fish.width) {
      fish.node.remove();
      fishArr.splice(index, 1);
    }
  });
}

function checkPollutionDespawn() {
  pollutionArr.forEach((pollutionObj, index) => {
    if (pollutionObj.x < -pollutionObj.width) {
      pollutionObj.node.remove();
      pollutionArr.splice(index, 1);
    }
  });
}

function checkMantaDespawn() {
  mantaArr.forEach((mantaObj, index) => {
    // Going left
    if (mantaObj.direction === "left" && mantaObj.x <= -mantaObj.width) {
      mantaObj.node.remove();
      mantaArr.splice(index, 1);
    }

    // Going right
    else if (
      mantaObj.direction === "right" &&
      mantaObj.x >= window.innerWidth
    ) {
      mantaObj.node.remove();
      mantaArr.splice(index, 1);
    }
  });
}

//* ============================================================
//* COLLISIONS
//* ============================================================

// Generic rectangle-overlap check, reused for BOTH fish and pollution.
// Works on any object that has .x, .y, .width, .height
function checkCollision(element1, element2) {
  return (
    element1.x < element2.x + element2.width &&
    element1.x + element1.width > element2.x &&
    element1.y < element2.y + element2.height &&
    element1.y + element1.height > element2.y
  ); // true if the two rectangles overlap, false otherwise
}

function checkCollisionPlayerFish() {
  // I loop backwards-safe by collecting indexes to remove,
  // since splicing an array while forEach-ing it can skip elements
  fishArr.forEach((fishObj, index) => {
    if (checkCollision(playerObj, fishObj)) {
      if (fishObj.isFast) {
        happyDolphinNode.currentTime = 0;
        happyDolphinNode.play();
      }
      // 1. remove the caught fish from the DOM
      fishObj.node.remove();
      // 2. remove it from the tracking array
      fishArr.splice(index, 1);
      // 3. reward the player
      score += fishObj.points;
      updateScoreDisplay();
    }
  });
}

function checkCollisionPlayerPollution() {
  pollutionArr.forEach((pollutionObj, index) => {
    if (checkCollision(playerObj, pollutionObj)) {
      // play splash sound
      splashSoundNode.currentTime = 0;
      splashSoundNode.play();

      // remove pollution from the DOM
      pollutionObj.node.remove();

      // removey pollution from the array
      pollutionArr.splice(index, 1);

      // removes one life
      loseLife();
    }
  });
}

function updateScoreDisplay() {
  scoreValueNode.textContent = score;
}

function updateLivesDisplay() {
  // remove existing hearts first
  livesNode.innerHTML = "";
  // creates one heart image for every remaining life
  for (let i = 0; i < lives; i++) {
    const heartImg = document.createElement("img");

    heartImg.src = "./images/heart.png";
    heartImg.classList.add("heart");
    heartImg.alt = "little red pixelated heart";

    livesNode.append(heartImg);
  }
}

function loseLife() {
  lives--;

  updateLivesDisplay();

  if (lives <= 0) {
    gameOver();
  }
}

//* ============================================================
//* BACKGROUND SCROLL
//* ============================================================
function scrollBackground() {
  // move the "starting point" of the background image further left
  bgOffsetX -= bgScrollSpeed;

  // Because the CSS has background-repeat: repeat-x, the browser
  // keeps redrawing copies of the image to fill the box no matter
  // how far left bgOffsetX goes - so this alone creates an endless
  // loop. We never need to check "did it reach the end?" or reset
  // it back to 0; the tiling handles that for us automatically.
  gameBoxNode.style.backgroundPositionX = `${bgOffsetX}px`;
}

//* ============================================================
//* SOUND TOGGLE
//* ============================================================

function toggleSound() {
  isMuted = !isMuted;

  splashSoundNode.muted = isMuted;
  dolphinSoundNode.muted = isMuted;
  happyDolphinNode.muted = isMuted;
  gameMusicNode.muted = isMuted;

  if (isMuted) {
    soundToggleNode.src = "./images/sound-off.png";
    soundToggleNode.alt = "Sound off";
  } else {
    soundToggleNode.src = "./images/sound-on.png";
    soundToggleNode.alt = "Sound on";
  }
}

//* ============================================================
//* MAIN GAME LOOP
//* This function runs ~60 times per second while the game is active.
//* ============================================================
function gameLoop() {
  scrollBackground();
  fishArr.forEach((fishObj) => fishObj.automaticMovementLeft());
  pollutionArr.forEach((pollutionObj) => pollutionObj.automaticMovementLeft());
  mantaArr.forEach((mantaObj) => mantaObj.automaticMovement());
  checkCollisionPlayerFish();
  checkCollisionPlayerPollution();
  checkFishDespawn();
  checkPollutionDespawn();
  checkMantaDespawn();
}

//* ============================================================
//* EVENT LISTENERS
//* ============================================================
startBtnNode.addEventListener("click", startGame);
restartBtnNode.addEventListener("click", restartGame);
soundToggleNode.addEventListener("click", toggleSound);

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
