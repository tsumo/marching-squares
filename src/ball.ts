import { V2, v2 } from "./vector2";

export class Ball {
  private readonly width: number;
  private readonly height: number;
  readonly radius: number;
  readonly speed: number;
  x: number;
  y: number;
  angle: number;

  constructor(
    width: number,
    height: number,
    x: number,
    y: number,
    radius: number,
    speed: number,
    angle: number
  ) {
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.speed = speed;
    this.x = x;
    this.y = y;
    this.angle = angle;
  }

  update() {
    const { x, y } = this;
    const dx = Math.cos(this.angle) * this.speed;
    const dy = Math.sin(this.angle) * this.speed;
    const v = v2.fromAngle(this.angle);
    let r: V2 | null = null;
    if (y + dy > this.height) {
      r = v2.reflect(v, [1, 0]);
    }
    if (y + dy < 0) {
      r = v2.reflect(v, [-1, 0]);
    }
    if (x + dx > this.width) {
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
}
