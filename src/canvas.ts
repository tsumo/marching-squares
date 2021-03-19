import { Ball } from "./ball";
import { rand, randRange } from "./utils";

export class Render {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  private readonly width = 640;
  private readonly height = 480;

  private readonly gridStep = 10;
  private readonly gridHalfStep = 5;

  balls: Ball[] = [];

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    canvas.width = this.width;
    canvas.height = this.height;

    for (let i = 0; i < 10; ++i) {
      this.balls.push(
        new Ball(
          this.width,
          this.height,
          rand(this.width),
          rand(this.height),
          randRange(30, 50),
          randRange(1, 2),
          rand(Math.PI * 2)
        )
      );
    }

    const tick = () => {
      this.clear();
      this.updateBalls();
      this.drawGrid();
      this.drawBalls();
      requestAnimationFrame(tick);
    };
    tick();
  }

  private drawGrid() {
    this.ctx.strokeStyle = "#263339";
    this.ctx.fillStyle = "indianred";
    for (let x = 0; x < this.width; x += this.gridStep) {
      for (let y = 0; y < this.height; y += this.gridStep) {
        if (this.calcInfluence(x + this.gridHalfStep, y + this.gridHalfStep)) {
          this.ctx.fillRect(x, y, 20, 20);
        }
        this.ctx.strokeRect(x, y, this.gridStep, this.gridStep);
      }
    }
  }

  private calcInfluence(x: number, y: number) {
    const influence = this.balls.reduce((prev, curr) => {
      const xx = (x + this.gridHalfStep - curr.x) ** 2;
      const yy = (y + this.gridHalfStep - curr.y) ** 2;
      return curr.radius ** 2 / (xx + yy) + prev;
    }, 0);
    return influence >= 1;
  }

  private updateBalls() {
    this.balls.forEach((ball) => ball.update());
  }

  private drawBalls() {
    this.ctx.strokeStyle = "salmon";
    this.balls.forEach((ball) => {
      this.ctx.beginPath();
      this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      this.ctx.stroke();
    });
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
