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
  const gridCheckbox = document.querySelector('input[name="grid"]');
  const ballsCheckbox = document.querySelector('input[name="balls"]');
  const metaballsCheckbox = document.querySelector('input[name="metaballs"]');
  const smoothingCheckbox = document.querySelector('input[name="smoothing"]');
  if (
    !(gridCheckbox instanceof HTMLInputElement) ||
    !(ballsCheckbox instanceof HTMLInputElement) ||
    !(metaballsCheckbox instanceof HTMLInputElement) ||
    !(smoothingCheckbox instanceof HTMLInputElement)
  ) {
    return;
  }
  const render = new Render(canvas, ctx);
  const onCheckboxClick = () => {
    render.config.grid = gridCheckbox.checked;
    render.config.balls = ballsCheckbox.checked;
    render.config.metaballs = metaballsCheckbox.checked;
    render.config.smoothing = smoothingCheckbox.checked;
  };
  gridCheckbox.onclick = onCheckboxClick;
  ballsCheckbox.onclick = onCheckboxClick;
  metaballsCheckbox.onclick = onCheckboxClick;
  smoothingCheckbox.onclick = onCheckboxClick;
};

init();
