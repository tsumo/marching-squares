import { Ball } from "./ball";
import { rand, randRange } from "./utils";

const colors = {
  grid: "#263339",
  ball: "salmon",
  influence: "indianred",
};

type LineCoefs = [number, number, number, number];

const lines: Record<string, LineCoefs> = {
  leftBottom: [0, 0.5, 0.5, 1],
  rightBottom: [1, 0.5, 0.5, 1],
  rightTop: [0.5, 0, 1, 0.5],
  leftTop: [0.5, 0, 0, 0.5],
  horizontal: [0, 0.5, 1, 0.5],
  vertical: [0.5, 0, 0.5, 1],
};

const configurationsLUT: Record<number, LineCoefs[]> = {
  0b0000: [],
  0b0001: [lines.leftBottom],
  0b0010: [lines.rightBottom],
  0b0011: [lines.horizontal],
  0b0100: [lines.rightTop],
  0b0101: [lines.leftTop, lines.rightBottom],
  0b0110: [lines.vertical],
  0b0111: [lines.leftTop],
  0b1000: [lines.leftTop],
  0b1001: [lines.vertical],
  0b1010: [lines.rightTop, lines.leftBottom],
  0b1011: [lines.rightTop],
  0b1100: [lines.horizontal],
  0b1101: [lines.rightBottom],
  0b1110: [lines.leftBottom],
  0b1111: [],
};

export class Render {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  private readonly width = 640;
  private readonly height = 480;

  private readonly gridStep = 8;
  private readonly widthCells: number;
  private readonly heightCells: number;

  private readonly balls: Ball[] = [];

  private influences: number[][] = [];
  private configurations: number[][] = [];

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    canvas.width = this.width;
    canvas.height = this.height;
    this.widthCells = Math.ceil(this.width / this.gridStep);
    this.heightCells = Math.ceil(this.height / this.gridStep);

    for (let x = 0; x <= this.widthCells; x++) {
      const column: number[] = Array(this.heightCells);
      column.fill(0);
      this.influences.push(column);
    }

    for (let x = 0; x <= this.widthCells; x++) {
      const column: number[] = Array(this.heightCells);
      column.fill(0b0000);
      this.configurations.push(column);
    }

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
      this.calcConfigurations();
      this.drawGrid();
      this.drawConfigurations();
      this.drawBalls();
      requestAnimationFrame(tick);
    };
    tick();
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  private updateBalls() {
    this.balls.forEach((ball) => ball.update());
  }

  private drawGrid() {
    this.ctx.fillStyle = colors.grid;
    for (let x = 0; x < this.width; x += this.gridStep) {
      this.ctx.fillRect(x, 0, 1, this.height);
    }
    for (let y = 0; y < this.height; y += this.gridStep) {
      this.ctx.fillRect(0, y, this.width, 1);
    }
  }

  private calcConfigurations() {
    for (let x = 0; x <= this.widthCells; x++) {
      for (let y = 0; y <= this.heightCells; y++) {
        const influence = this.balls.reduce((prev, curr) => {
          const xx = (x * this.gridStep - curr.x) ** 2;
          const yy = (y * this.gridStep - curr.y) ** 2;
          return curr.radius ** 2 / (xx + yy) + prev;
        }, 0);
        this.influences[x][y] = influence;
      }
    }
    for (let i = 0; i < this.widthCells; i++) {
      for (let j = 0; j < this.heightCells; j++) {
        let c = 0b0000;
        if (this.influences[i][j] >= 1) {
          c = c | 0b1000;
        }
        if (this.influences[i + 1][j] >= 1) {
          c = c | 0b0100;
        }
        if (this.influences[i][j + 1] >= 1) {
          c = c | 0b0001;
        }
        if (this.influences[i + 1][j + 1] >= 1) {
          c = c | 0b0010;
        }
        this.configurations[i][j] = c;
      }
    }
  }

  private drawConfigurations() {
    const s = this.gridStep;
    this.ctx.strokeStyle = colors.influence;
    const draw = (
      i: number,
      j: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) => {
      const is = i * s;
      const js = j * s;
      this.ctx.beginPath();
      this.ctx.moveTo(x1 + is, y1 + js);
      this.ctx.lineTo(x2 + is, y2 + js);
      this.ctx.stroke();
    };
    for (let i = 0; i < this.configurations.length; i++) {
      for (let j = 0; j < this.configurations[i].length; j++) {
        const configuration = this.configurations[i][j];
        configurationsLUT[configuration].forEach((coefs) =>
          draw(i, j, coefs[0] * s, coefs[1] * s, coefs[2] * s, coefs[3] * s)
        );
      }
    }
  }

  private drawBalls() {
    this.ctx.strokeStyle = colors.ball;
    this.balls.forEach((ball) => {
      this.ctx.beginPath();
      this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      this.ctx.stroke();
    });
  }
}
