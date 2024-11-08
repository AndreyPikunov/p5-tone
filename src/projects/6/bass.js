class Bass {
  constructor() {
    this.filter = new Tone.Filter({
      type: "lowpass",
      frequency: 300,
      rolloff: -24,
    }).toDestination();

    this.distortion = new Tone.Distortion({
      distortion: 0.5   ,
      wet: 0.5,
    }).connect(this.filter);

    this.oscillator = new Tone.Oscillator({
      type: "sine",
      frequency: "A1",
      volume: -5,
    }).connect(this.distortion);
  }

  start() {
    this.oscillator.start();
  }

  stop() {
    this.oscillator.stop();
  }
}