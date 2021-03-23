import { Render } from "./src/render";

const init = () => {
  const canvas = document.getElementById("c");
  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }
  const ctx = canvas.getContext("2d");
  if (ctx === null) {
    return;
  }
  const render = new Render(canvas, ctx);
};

init();
