import { randPolygons } from "../utils/geometry.js";
import { save, load, clear } from "../utils/storage.js";

export default class AppRoot extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="controls">
        <button id="create">Создать</button>
        <button id="save">Сохранить</button>
        <button id="reset">Сбросить</button>
      </div>
      <div class="buffer-zone"></div>
      <div class="workspace-wrapper"></div>
    `;

    const buffer = document.createElement("buffer-zone");
    this.querySelector(".buffer-zone").append(buffer);

    const workspace = document.createElement("workspace-canvas");
    this.querySelector(".workspace-wrapper").append(workspace);
    this.querySelector("#create").addEventListener("click", () => {
      randPolygons().forEach((svg) => buffer.addPolygon(svg));
    });

    this.querySelector("#save").addEventListener("click", () => {
      save(workspace.getPolygonsJSON());
      alert("Состояние сохранено в localStorage 📦");
    });

    this.querySelector("#reset").addEventListener("click", () => {
      if (confirm("Очистить localStorage и перезагрузить страницу?")) {
        clear();
        location.reload();
      }
    });

    window.addEventListener("DOMContentLoaded", () => {
      load().forEach((poly) => workspace.addPolygonFromJSON(poly));
    });
  }
}

customElements.define("app-root", AppRoot);
