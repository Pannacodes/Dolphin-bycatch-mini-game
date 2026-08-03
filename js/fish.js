class Fish {

  constructor(randomPosY) {
    this.node = document.createElement("img")
    this.node.src = "../images/fish1.gif"
    this.node.alt = "Fish"

    gameBoxNode.append(this.node)

    this.x = gameBoxNode.offsetWidth
    this.y = randomPosY
    this.height = 20
    this.width = 40
    this.speed = 2

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