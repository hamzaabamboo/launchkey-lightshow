export const getConfig = (midiData: {
  [key: number]: { [ctrl: number]: number };
}) => {
  return {
    speed: Math.floor((5 * (midiData[191]?.[7] ?? 127 / 5)) / 127),
    color: Math.floor((midiData[191]?.[21] ?? 10) / 10) * 10,
    colors: [21, 22, 23, 24, 25, 26, 27, 28].map(
      (c) => Math.floor((midiData[191]?.[c] ?? 10) / 10) * 10,
    ),
    fps: Math.floor((midiData[191]?.[48] ?? 120) / 2) + 1,
  };
};
