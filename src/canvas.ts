import { Ball } from "./ball";
import { rand, randRange } from "./utils";

export class Render {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  private readonly width = 640;
  private readonly height = 480;

  private readonly gridStep = 14;
  private readonly gridHalfStep = 7;

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
        this.ctx.strokeRect(x, y, this.gridStep, this.gridStep);
        const lb = this.calcInfluence(x, y + this.gridStep);
        const rb = this.calcInfluence(x + this.gridStep, y + this.gridStep);
        const rt = this.calcInfluence(x + this.gridStep, y);
        const lt = this.calcInfluence(x, y);
        let configuration = 0;
        if (lb) {
          configuration | 0b0001;
          this.ctx.beginPath();
          this.ctx.arc(x, y + this.gridStep, 2, 0, Math.PI * 2);
          this.ctx.fill();
        }
        if (rb) {
          configuration | 0b0010;
          this.ctx.beginPath();
          this.ctx.arc(x + this.gridStep, y + this.gridStep, 2, 0, Math.PI * 2);
          this.ctx.fill();
        }
        if (rt) {
          configuration | 0b0100;
          this.ctx.beginPath();
          this.ctx.arc(x + this.gridStep, y, 2, 0, Math.PI * 2);
          this.ctx.fill();
        }
        if (lt) {
          configuration | 0b1000;
          this.ctx.beginPath();
          this.ctx.arc(x, y, 2, 0, Math.PI * 2);
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
