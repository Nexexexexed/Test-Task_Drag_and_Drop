export default class PolygonItem extends HTMLElement {
  connectedCallback() {
    this.draggable = true;
    this.style.cursor = "grab";
    this.style.userSelect = "none";
    this.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", this.getAttribute("source"));
      this.setAttribute("dragging", "true"); // Маркер
      this.style.opacity = "0.4";
    });

    this.addEventListener("dragend", () => {
      this.removeAttribute("dragging"); // Удалить маркер
      this.style.opacity = "1";
    });
  }

  /** Возвращает JSON с вершинами (для сохранения) */
  toJSON() {
    const polygon = this.querySelector("polygon,polyline");
    return {
      tag: polygon.tagName,
      points: [...polygon.points].map((p) => [p.x, p.y]),
      x: parseFloat(this.style.left ?? 0),
      y: parseFloat(this.style.top ?? 0),
    };
  }

  /** Восстанавливает polygon по JSON */
  static fromJSON(data) {
    const el = document.createElement("poly-item");
    // Добавить SVG-обертку с размерами
    el.innerHTML = `
    <svg viewBox="0 0 100 100" width="80" height="80">
      <${data.tag} points="${data.points.map((p) => p.join(",")).join(" ")}" />
    </svg>
  `;
    el.style.position = "absolute";
    el.style.left = `${data.x}px`;
    el.style.top = `${data.y}px`;
    return el;
  }
}

customElements.define("poly-item", PolygonItem);
