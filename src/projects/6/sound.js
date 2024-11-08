class Bass {
  constructor() {
    this.filter = new Tone.Filter({
      type: "lowpass",
      frequency: 200,
      rolloff: -24,
    }).toDestination();

    this.distortion = new Tone.Distortion({
      distortion: 0.3,
      wet: 1.0,
    }).connect(this.filter);

    this.oscillator = new Tone.Oscillator({
      type: "sine",
      frequency: "F1",
      volume: -10,
    }).connect(this.distortion);
  }

  start() {
    this.oscillator.start();
  }

  stop() {
    this.oscillator.stop();
  }
}

const bass = new Bass();

function startSound() {
  Tone.start();
  bass.start();
}

function stopSound() {
  bass.stop();
}
