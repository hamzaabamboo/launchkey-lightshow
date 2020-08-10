import { initializeInput, initializeOutput } from "./lib";
import { render } from "./animations";
import { sleep } from "./utils";
import { mainScene, leftRight, rainbow } from "./scenes";
import { getConfig } from "./controls";

let play = true;

let n = 0;
let midiData: { [key: number]: { [ctrl: number]: number } } = {};
let sceneIdx = 0;
const scene = [mainScene, leftRight, rainbow];
const main = async () => {
  const output = initializeOutput();

  // Send a MIDI message.\
  output.sendMessage([159, 12, 127]);
  output.sendMessage([159, 13, 0]);
  output.sendMessage([159, 14, 0]);
  output.sendMessage([159, 15, 0]);
  output.sendMessage([191, 0, 0]);
  console.log("Initialized");

  output.sendMessage([
    191,
    104,
    (sceneIdx - 1 < 0 ? scene.length - 1 : sceneIdx - 1) % 127,
  ]);
  output.sendMessage([191, 105, ((sceneIdx + 1) % scene.length) % 127]);

  const input = initializeInput("Launchkey MIDI");
  const controls = initializeInput("Launchkey InControl");
  input.on("message", (deltaTime: string, message: number[]) => {
    const [chan, btn, val] = message;

    switch (btn) {
      case 104:
        if (chan === 191 && val === 127)
          sceneIdx = sceneIdx - 1 < 0 ? scene.length - 1 : sceneIdx - 1;
        output.sendMessage([
          191,
          104,
          (sceneIdx - 1 < 0 ? scene.length - 1 : sceneIdx - 1) % 127,
        ]);
        output.sendMessage([191, 105, ((sceneIdx + 1) % scene.length) % 127]);
        break;
      case 105:
        if (chan === 191 && val === 127)
          sceneIdx = (sceneIdx + 1) % scene.length;
        output.sendMessage([
          191,
          104,
          (sceneIdx - 1 < 0 ? scene.length - 1 : sceneIdx - 1) % 127,
        ]);
        output.sendMessage([191, 105, ((sceneIdx + 1) % scene.length) % 127]);
        break;
      default:
        if (!(chan in midiData)) midiData[chan] = {};
        midiData[chan][btn] = val;
        break;
    }
  });

  controls.on("message", (deltaTime: string, message: number[]) => {
    const [chan, btn, val] = message;
    switch (btn) {
      case 115:
        play = true;
        break;
      case 114:
        play = false;
        break;
      default:
        console.log(chan, btn);
        break;
    }
  });

  output.sendMessage([191, 104, 0]);
  while (true) {
    const { fps } = getConfig(midiData);
    if (play) {
      const arr = scene[sceneIdx](midiData)(n++);
      render(arr, output);
    }
    await sleep(1000 / fps);
  }
};

main();
