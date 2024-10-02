let oscillators = [];
let lfo;
let lfo_lfo;
let noise;
let noiseFilter;
let pitchShifter;
let phaser;

function initSound() {
  const notes = ["F3", "C4", "Ab4", "Bb4"];

  // Initialize the oscillators for each note
  oscillators = notes.map(
    (note) =>
      new Tone.Oscillator({
        type: "sine",
        frequency: Tone.Frequency(note).toFrequency(),
        volume: -12,
      })
  );

  // Initialize noise
  noise = new Tone.Noise("brown");
  noise.volume.value = -24; // Adjust volume as needed

  // Initialize low-pass filter

  noiseFilter = new Tone.Filter({
    type: "lowpass",
    frequency: 400, // Initial cutoff frequency
    rolloff: -12,
  });

  lfo = new Tone.LFO(1.7, 300, 400).connect(noiseFilter.frequency);
  lfo_lfo = new Tone.LFO(1.2, 0.1, 3.0).connect(lfo.frequency);

//   lfo_lfo.connect(oscillators[0].volume);

  // Connect noise to filter
  noise.connect(noiseFilter);

  phaser = new Tone.Phaser({
    frequency: 0.2,
    octaves: 2,
    baseFrequency: 1000,
  }).toDestination();

  // Initialize PitchShifter
  //   pitchShifter = new Tone.PitchShift({
  //     pitch: 0, // Initial pitch shift value
  //   }).toDestination();

  // Connect oscillators and noise to PitchShifter
  oscillators.forEach((osc) => osc.connect(phaser));
  noiseFilter.connect(phaser);

  // lfo = new Tone.LFO(10, 100, 400).connect(oscillators[0].frequency);
}

function toggleOscillator() {
  if (oscillators[0].state === "stopped") {
    oscillators.forEach((osc) => osc.start());
    noise.start(); // Start noise
    lfo_lfo.start();
    lfo.start();
  } else {
    oscillators.forEach((osc) => osc.stop());
    noise.stop(); // Stop noise
  }
}

function setNoiseLevel(level) {
  noise.volume.value = level;
}

function setFilterFrequency(frequency) {
  noiseFilter.frequency.value = frequency;
}

function setPitchShift(x) {
  phaser.baseFrequency = x;
}
