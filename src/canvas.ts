import { Ball } from "./ball";
import { rand, randRange } from "./utils";

export class Render {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  balls: Ball[] = [];

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    canvas.width = 640;
    canvas.height = 480;
    this.ctx.strokeStyle = "salmon";

    for (let i = 0; i < 10; ++i) {
      this.balls.push(
        new Ball(
          canvas.width,
          canvas.height,
          rand(canvas.width),
          rand(canvas.height),
          randRange(30, 50),
          randRange(1, 2),
          rand(Math.PI * 2)
        )
      );
    }

    const tick = () => {
      this.clear();
      this.updateBalls();
      this.drawBalls();
      requestAnimationFrame(tick);
    };
    tick();
  }

  private updateBalls() {
    this.balls.forEach((ball) => ball.update());
  }

  private drawBalls() {
    this.balls.forEach((ball) => {
      this.ctx.beginPath();
      this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      this.ctx.stroke();
    });
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
