//* ============================================================
//* FISH (collectible)
//* Two variants spawn: a slow +1 fish and, once score >= 5,
//* a chance of a faster +2 fish. Moves right-to-left automatically.
//* ============================================================

class Fish {
  constructor(randomPosY, isFast) {
    this.node = document.createElement("img");
    this.node.alt = "Fish";
    this.isFast = isFast;
    if (isFast) {
      this.node.src = "./images/fish2.gif";
      this.speed = 5;
      this.points = 2;
    } else {
      this.node.src = "./images/fish1.gif";
      this.speed = 2;
      this.points = 1;
    }

    gameBoxNode.append(this.node);

    this.x = gameBoxNode.offsetWidth;
    this.y = randomPosY;
    this.height = 20;
    this.width = 40;

    this.node.style.position = "absolute";
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.y}px`;
    this.node.style.height = `${this.height}px`;
    this.node.style.width = `${this.width}px`;
  }

  automaticMovementLeft() {
    this.x -= this.speed;
    this.node.style.left = `${this.x}px`;
  }
}
