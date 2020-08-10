import { cloneDeep } from "lodash";

export const pads = [
  [40, 41, 42, 43, 48, 49, 50, 51],
  [36, 37, 38, 39, 44, 45, 46, 47],
];

const baseFrame = [...Array(pads.length)].map((_, i) =>
  Array(pads[i].length).fill(0),
);

export const merge = (arr: number[][][]) => {
  return arr.reduce((p, c) => {
    let a = [...p];
    for (let i = 0; i < p.length; i++) {
      for (let j = 0; j < p[i].length; j++) {
        a[i][j] = c[i][j] || p[i][j];
      }
    }
    return a;
  }, cloneDeep(baseFrame));
};

export const loopAnimation = (speed: number, reverse = false) => (
  f: number,
  color = 3,
): number[][] => {
  const nFrame = Math.floor((f * speed) / 10);
  const seq = reverse
    ? [15, 14, 13, 12, 11, 10, 9, 8, 0, 1, 2, 3, 4, 5, 6, 7]
    : [0, 1, 2, 3, 4, 5, 6, 7, 15, 14, 13, 12, 11, 10, 9, 8];
  const n =
    (nFrame % seq.length) - 1 < 0 ? seq.length - 1 : (nFrame % seq.length) - 1;
  let res = cloneDeep(baseFrame);
  res[Math.floor(seq[n] / pads[0].length)][seq[n] % pads[0].length] = 0;
  res[Math.floor(seq[n + 1 >= seq.length ? 0 : n + 1] / pads[0].length)][
    seq[n + 1 >= seq.length ? 0 : n + 1] % pads[0].length
  ] = color;
  return res;
};

export const render = (arr: number[][], output: any) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      output.sendMessage([159, pads[i][j], arr[i][j]]);
    }
  }
};

export const bounce = (speed: number, row: number, reverse = false) => (
  f: number,
  color = 3,
): number[][] => {
  const nFrame = Math.floor((f * speed) / 10);
  const seq = reverse
    ? [7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6]
    : [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1];
  const n =
    (nFrame % seq.length) - 1 < 0 ? seq.length - 1 : (nFrame % seq.length) - 1;
  let res = cloneDeep(baseFrame);
  res[row][seq[n % seq.length]] = 0;
  res[row][seq[n >= seq.length ? 0 : n]] = color;
  return res;
};
