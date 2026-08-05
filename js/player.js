class Dolphin {
  constructor() {
    this.node = document.createElement("img");
    this.node.src = "./images/dolphin.gif";
    this.node.alt = "Dolphin";

    gameBoxNode.append(this.node);

    this.x = 60;
    this.y = 160;
    this.height = 70;
    this.width = 110;

    this.border = this.node.style.position = "absolute";
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.y}px`;
    this.node.style.height = `${this.height}px`;
    this.node.style.width = `${this.width}px`;
  }

  moveUp() {
    if (this.y <= 0) return;
    this.y -= 20;
    this.node.style.top = `${this.y}px`;
  }

  moveDown() {
    if (this.y + this.height >= gameBoxNode.offsetHeight) return;
    this.y += 20;
    this.node.style.top = `${this.y}px`;
  }
}
