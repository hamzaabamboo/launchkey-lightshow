import * as midi from "midi";

export const initializeOutput = () => {
  // Set up a new output.
  const output = new midi.Output();

  // Count the available output ports.
  const ports = output.getPortCount();

  const portNo = [...Array(ports)]
    .map((_, i) => i)
    .find((p) => output.getPortName(p).includes("Launchkey InControl"));

  // Open the first available output port.
  output.openPort(portNo);
  console.log("Opened Output Port", portNo);
  // Close the port when done.
  process.on("exit", () => {
    console.log("Closed Output Port");
    output.closePort();
  });
  return output;
};

export const initializeInput = (name: string) => {
  // Set up a new output.
  const input = new midi.Input();

  // Count the available output ports.
  const ports = input.getPortCount();

  const portNo = [...Array(ports)]
    .map((_, i) => i)
    .find((p) => input.getPortName(p).includes(name));

  // Open the first available output port.
  input.ignoreTypes(false, false, false);

  input.openPort(portNo);

  console.log("Opened Input Port", portNo);
  // Close the port when done.
  process.on("exit", () => {
    console.log("Closed Input Port");
    input.closePort();
  });
  return input;
};
