//* ============================================================
//* POLLUTION (obstacle)
//* Floats right-to-left with a slight rotation + sine-wave bob
//* to feel more "adrift" than the fish. Costs a life on contact.
//* ============================================================

class Pollution {

  constructor(randomPosY) {
    this.node = document.createElement("img")
    this.node.src = "./images/bottle.png"
    this.node.alt = "Pollution"

    gameBoxNode.append(this.node)

    this.x = gameBoxNode.offsetWidth
    this.y = randomPosY
    this.height = 40
    this.width = 30
    this.speed = 3
    this.angle = Math.random() * 30 - 15;
    this.bobTime = Math.random() * Math.PI * 2;


    this.node.style.position = "absolute"
    this.node.style.left = `${this.x}px`
    this.node.style.top = `${this.y}px`
    this.node.style.height = `${this.height}px`
    this.node.style.width = `${this.width}px`
  }

  automaticMovementLeft() {
    this.x -= this.speed
    this.node.style.left = `${this.x}px`
    this.bobTime += 0.05; // increases the bobbing timer
    let bobOffset = Math.sin(this.bobTime) * 5; // calculates vertical movement using sine wave
    this.node.style.transform = 
    `rotate(${this.angle}deg) translateY(${bobOffset}px)`;
  }
}