//* ============================================================
//* MANTA RAY (background decoration, non-interactive)
//* Spawns every 10s from a random edge and drifts across the
//* screen behind the game box. Purely visual - no collisions.
//* ============================================================

class Manta {
  constructor() {
    this.node = document.createElement("img");

    this.node.src = "./images/manta.gif";
    this.node.alt = "Manta ray";

    document.querySelector("#manta-layer").append(this.node);

    this.width = 200;
    this.height = 80;

    this.node.style.position = "absolute";
    this.node.style.width = `${this.width}px`;
    this.node.style.height = `${this.height}px`;

    // random height
    this.y = Math.random() * 70;
    this.node.style.top = `${this.y}%`;

    // random direction
    this.direction = Math.random() < 0.5 ? "right" : "left";

    if (this.direction === "right") {
      this.x = -this.width;
      this.speed = 2;

      // your gif faces left, so flip it
      this.node.style.transform = "scaleX(-1)";
    } else {
      this.x = window.innerWidth;
      this.speed = 2;
    }

    this.node.style.left = `${this.x}px`;
  }

  automaticMovement() {
    if (this.direction === "right") {
      this.x += this.speed;
    } else {
      this.x -= this.speed;
    }

    this.node.style.left = `${this.x}px`;
  }
}
