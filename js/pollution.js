class Pollution {

  constructor(randomPosY) {
    this.node = document.createElement("img")
    this.node.src = "../images/bottle.png"
    this.node.alt = "Pollution"

    gameBoxNode.append(this.node)

    this.x = gameBoxNode.offsetWidth
    this.y = randomPosY
    this.height = 40
    this.width = 30
    this.speed = 3

    this.node.style.position = "absolute"
    this.node.style.left = `${this.x}px`
    this.node.style.top = `${this.y}px`
    this.node.style.height = `${this.height}px`
    this.node.style.width = `${this.width}px`
  }

  automaticMovementLeft() {
    this.x -= this.speed
    this.node.style.left = `${this.x}px`
  }
}