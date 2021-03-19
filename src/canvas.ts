import { V2, v2 } from "./vector2";

export class Render {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  x = 100;
  y = 100;
  speed = 3.1;
  angle = 0.1;
  radius = 10;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    canvas.width = 640;
    canvas.height = 480;
    this.ctx.strokeStyle = "salmon";
    const tick = () => {
      this.update();
      this.render();
      requestAnimationFrame(tick);
    };
    tick();
  }

  render() {
    this.clear();
    this.drawCircle();
  }

  private update() {
    const { x, y } = this;
    const dx = Math.cos(this.angle) * this.speed;
    const dy = Math.sin(this.angle) * this.speed;
    const v = v2.fromAngle(this.angle);
    let r: V2 | null = null;
    if (y + dy > this.canvas.height) {
      r = v2.reflect(v, [1, 0]);
    }
    if (y + dy < 0) {
      r = v2.reflect(v, [-1, 0]);
    }
    if (x + dx > this.canvas.width) {
      r = v2.reflect(v, [0, -1]);
    }
    if (x + dx < 0) {
      r = v2.reflect(v, [0, 1]);
    }
    if (r !== null) {
      const newAngle = v2.toAngle(r);
      this.angle = newAngle;
    } else {
      this.x += dx;
      this.y += dy;
    }
  }

  private drawCircle() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
