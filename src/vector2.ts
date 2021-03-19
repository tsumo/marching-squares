export type V2 = [number, number];

export const v2 = {
  scale: (a: V2, n: number): V2 => [a[0] * n, a[1] * n],

  sub: (a: V2, b: V2): V2 => [a[0] - b[0], a[1] - b[1]],

  dot: (a: V2, b: V2): number => a[0] * b[0] + a[1] * b[1],

  reflect: (a: V2, norm: V2): V2 => {
    const d = v2.scale(norm, v2.dot(a, norm));
    return v2.sub(v2.scale(d, 2), a);
  },

  fromAngle: (n: number): V2 => [Math.cos(n), Math.sin(n)],

  toAngle: (a: V2): number => Math.atan2(a[1], a[0]),
};
