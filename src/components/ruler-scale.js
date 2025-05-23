export default class RulerScale extends HTMLElement {
  static get observedAttributes() {
    return ["axis"];
  }

  connectedCallback() {
    this.axis = this.getAttribute("axis") ?? "x";
    this.canvas = document.createElement("canvas");
    this.append(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.update(1, { x: 0, y: 0 });
  }

  update(scale, offset) {
    const size = this.axis === "x" ? this.offsetWidth : this.offsetHeight;
    this.canvas.width = this.axis === "x" ? size : 30;
    this.canvas.height = this.axis === "x" ? 30 : size;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.strokeStyle = "#889";
    ctx.lineWidth = 1;

    const step = 50 * scale;
    const count = Math.ceil(size / step) + 1;
    for (let i = 0; i < count; i += 1) {
      const pos = i * step - ((this.axis === "x" ? offset.x : offset.y) % step);
      ctx.beginPath();
      if (this.axis === "x") {
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, 15);
        ctx.fillText(i, pos + 2, 28);
      } else {
        ctx.moveTo(15, pos);
        ctx.lineTo(0, pos);
        ctx.fillText(i, 18, pos - 2);
      }
      ctx.stroke();
    }
  }
}

customElements.define("ruler-scale", RulerScale);
