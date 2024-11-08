const bass = new Bass();
const pad = new Pad();

function startSound() {
  Tone.start();
  bass.start();
  pad.start();
}

function stopSound() {
  bass.stop();
  pad.stop();
}
