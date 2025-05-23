export default class BufferZone extends HTMLElement {
  connectedCallback() {
    this.style.display = "flex";
    this.style.gap = "0.5rem";
    this.style.flexWrap = "wrap";
    this.style.padding = "0.5rem";
    this.style.minHeight = "120px";
    this.style.borderBottom = "1px dashed var(--ui-border)";
  }

  addPolygon(svgString) {
    const poly = document.createElement("poly-item");
    const wrapped = `<svg viewBox="0 0 100 100" width="80" height="80">${svgString}</svg>`;
    poly.setAttribute("source", btoa(svgString));
    poly.innerHTML = wrapped;

    this.append(poly);
  }
}

customElements.define("buffer-zone", BufferZone);
