class Pad {
  constructor() {
    this.distortion = new Tone.Distortion({
      distortion: 0.01,
      wet: 0,
    });

    this.lowPassFilter = new Tone.Filter({
      type: "lowpass",
      frequency: 500,
      rolloff: -24,
    }).toDestination();

    this.highPassFilter = new Tone.Filter({
      type: "highpass",
      frequency: 400,
      rolloff: -24,
    }).connect(this.lowPassFilter);

    // this.distortion.connect(this.highPassFilter);

    this.reverb = new Tone.Reverb({
      decay: 5,
      wet: 0.3,
      preDelay: 0.1,
    }).toDestination();

    this.lowPassFilter.disconnect();
    this.lowPassFilter.connect(this.reverb);

    let notes = ["A4", "E5", "C5"];

    this.oscillators = notes.flatMap((note) => {
      return [-10, 0, 10].map((baseDetune, i) => {
        const detuneLfo = new Tone.LFO({
          frequency: 0.1 + i * 0.05,
          min: -5,
          max: 5,
        });

        const volumeLfo = new Tone.LFO({
          frequency: 0.01,
          min: 5,
          max: 10,
        });

        const osc = new Tone.Oscillator({
          type: "sine",
          frequency: note,
          detune: baseDetune,
          volume: -40,
        }).connect(this.highPassFilter);
        // .connect(this.distortion);

        detuneLfo.connect(osc.detune);
        // volumeLfo.connect(detuneLfo.frequency);

        return {
          oscillator: osc,
          detuneLfo: detuneLfo,
          volumeLfo: volumeLfo,
        };
      });
    });
  }

  start() {
    this.oscillators.forEach(({ oscillator, detuneLfo, volumeLfo }) => {
      oscillator.start();
      detuneLfo.start();
      volumeLfo.start();
    });
  }

  stop() {
    this.oscillators.forEach(({ oscillator, detuneLfo, volumeLfo }) => {
      oscillator.stop();
      detuneLfo.stop();
      volumeLfo.stop();
    });
  }
}
