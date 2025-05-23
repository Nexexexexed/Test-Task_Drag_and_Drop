export default class WorkspaceCanvas extends HTMLElement {
  connectedCallback() {
    // базовые стили самого <workspace-canvas>
    Object.assign(this.style, {
      position: "relative",
      background: "#fff",
      overflow: "hidden",
      display: "block",
      flex: "1 1 auto",
      minHeight: "500px",
    });

    this.scale = 1;
    this.offset = { x: 0, y: 0 }; // смещение камеры в px

    this.innerHTML = `
      <ruler-scale axis="x"></ruler-scale>
      <div class="viewport" style="position:absolute;top:30px;left:30px;right:0;bottom:0;overflow:hidden;background:#fefefe;"></div>
      <ruler-scale axis="y" style="width:30px;height:100%;position:absolute;top:30px;left:0;"></ruler-scale>
    `;
    this.viewport = this.querySelector(".viewport");
    this.rulers = this.querySelectorAll("ruler-scale");

    // Создаем внутренний контейнер, который будем масштабировать и смещать
    this.content = document.createElement("div");
    Object.assign(this.content.style, {
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      transformOrigin: "0 0",
    });
    this.viewport.append(this.content);

    // Drag & Drop для viewport (теперь принимаем полигоны в this.content)
    this.viewport.addEventListener("dragover", (e) => e.preventDefault());

    this.viewport.addEventListener("drop", (e) => {
      e.preventDefault();
      const data = e.dataTransfer.getData("text/plain");
      if (!data) return;

      // Если перетаскивается существующий полигон из рабочей зоны
      const draggedPoly = document.querySelector("[dragging]");
      if (draggedPoly && draggedPoly.parentElement === this.content) {
        const rect = this.content.getBoundingClientRect();
        // Учитываем масштаб и смещение
        const contentX = (e.clientX - rect.left - this.offset.x) / this.scale;
        const contentY = (e.clientY - rect.top - this.offset.y) / this.scale;
        // Обновляем позицию
        draggedPoly.style.left = `${contentX}px`;
        draggedPoly.style.top = `${contentY}px`;
        draggedPoly.removeAttribute("dragging");
        return;
      }

      // Если полигон из буферной зоны — создаем новый
      const poly = document.createElement("poly-item");
      poly.setAttribute("source", data);
      poly.innerHTML = `<svg viewBox="0 0 100 100" width="80" height="80">${atob(data)}</svg>`;
      poly.style.position = "absolute";

      // ... (расчет координат)
      this.content.append(poly);
    });

    this.addEventListener("wheel", (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault(); // Добавить preventDefault()
      const dir = Math.sign(e.deltaY);
      this.scale = Math.max(0.2, Math.min(4, this.scale - dir * 0.1));
      this.applyTransform();
    });

    // Панорамирование мышью — сдвигаем offset и применяем трансформацию this.content
    let panning = false,
      start;
    this.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return; // Только ЛКМ
      if (!e.altKey) return; // Или другая клавиша-модификатор (например, пробел)
      panning = true;
      start = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener("pointermove", (e) => {
      if (!panning) return;
      this.offset.x += e.clientX - start.x;
      this.offset.y += e.clientY - start.y;
      start = { x: e.clientX, y: e.clientY };
      this.applyTransform();
    });
    window.addEventListener("pointerup", () => (panning = false));

    requestAnimationFrame(() => this.applyTransform());
  }

  applyTransform() {
    // Применяем трансформацию к content (не viewport!)
    this.content.style.transform = `translate(${this.offset.x}px,${this.offset.y}px) scale(${this.scale})`;
    this.rulers.forEach(
      (r) => typeof r.update === "function" && r.update(this.scale, this.offset)
    );
  }

  // API для <app-root>
  getPolygonsJSON() {
    return [...this.content.children].map((p) => p.toJSON());
  }

  addPolygonFromJSON(data) {
    const El = window.customElements.get("poly-item");
    const poly = El.fromJSON(data);
    this.content.append(poly);
  }
}

customElements.define("workspace-canvas", WorkspaceCanvas);
