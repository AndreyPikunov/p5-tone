let noiseSlider;
let pitchSlider;
let started = false;

function setup() {
    createCanvas(300, 300);
    background(200);
    
    // Initialize sound
    initSound();

    // Create a slider for controlling noise level
    noiseSlider = createSlider(-48, 0, -24, 1);
    noiseSlider.position(width / 3, height / 3);
    noiseSlider.size(width / 3);

    // Create a slider for controlling pitch shift
    pitchSlider = createSlider(0, 1000, 1000); // -24 to 24 semitones (2 octaves down to 2 octaves up)
    pitchSlider.position(width / 3, height / 3 * 2);
    pitchSlider.size(width / 3);

    // Create a label for the slider
    // noiseLabel = createP('Noise Level:');
    // noiseLabel.position(noiseSlider.x, noiseSlider.y - 20);
    // noiseLabel.style('font-size', '16px');
}

function draw() {
    // Your existing drawing code here

    let noiseLevel = noiseSlider.value();
    setNoiseLevel(noiseLevel);

    let pitchShift = pitchSlider.value();
    setPitchShift(pitchShift);

    // console.log("LFO Value:", lfo.value);
    // console.log("LFO_LFO Value:", lfo_lfo.value);
    // console.log(oscillators[0].volume.value);
    // console.log(oscillators[0].frequency.value);

    // Update the displayed noise level
    // fill(0);
    // textSize(16);
    // text(`${noiseLevel} dB`, noiseSlider.x * 2 + noiseSlider.width, noiseSlider.y + 15);
}

function mousePressed() {
    // Example interaction: toggle oscillator on mouse press
    if (!started) {
        toggleOscillator();
        started = true;
        // console.log("Oscillator Volume:", oscillators[0].volume.value);
    }
}