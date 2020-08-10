import { loopAnimation, merge, bounce } from "./animations";
import { getConfig } from "./controls";

export const mainScene = (midiData: any) => (f: number) => {
  const { speed, colors } = getConfig(midiData);
  return merge([
    loopAnimation(speed)(f, colors[0]),
    loopAnimation(speed, true)(f, colors[1]),
  ]);
};

export const leftRight = (midiData: any) => (f: number) => {
  const { speed, colors } = getConfig(midiData);
  return merge([
    bounce(speed, 1)(f, colors[0]),
    bounce(speed, 0, true)(f, colors[1]),
  ]);
};

export const rainbow = (midiData: any) => (f: number) => {
  const { speed, colors } = getConfig(midiData);
  return merge(
    Array(16)
      .fill(undefined)
      .map((_, i) =>
        loopAnimation(speed)(f + i * 10, colors[i % colors.length]),
      ),
  );
};
