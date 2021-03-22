import { Ball } from "./ball";
import { rand, randRange } from "./utils";

export class Render {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  private readonly width = 640;
  private readonly height = 480;

  private readonly gridStep = 10;

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
      this.drawInfluence();
      this.drawBalls();
      requestAnimationFrame(tick);
    };
    tick();
  }

  private drawInfluence() {
    this.ctx.fillStyle = "indianred";
    for (let x = 0; x < this.width; x += this.gridStep) {
      for (let y = 0; y < this.height; y += this.gridStep) {
        const inf = this.calcInfluence(x, y);
        if (inf) {
          this.ctx.beginPath();
          this.ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }
  }

  private calcInfluence(x: number, y: number) {
    const influence = this.balls.reduce((prev, curr) => {
      const xx = (x - curr.x) ** 2;
      const yy = (y - curr.y) ** 2;
      return curr.radius ** 2 / (xx + yy) + prev;
    }, 0);
    return influence >= 1;
  }

  private drawGrid() {
    this.ctx.fillStyle = "#263339";
    for (let x = 0; x < this.width; x += this.gridStep) {
      this.ctx.fillRect(x, 0, 1, this.height);
    }
    for (let y = 0; y < this.height; y += this.gridStep) {
      this.ctx.fillRect(0, y, this.width, 1);
    }
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
