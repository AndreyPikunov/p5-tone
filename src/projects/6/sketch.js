let soundStarted = false;

let noiseAmplitude = 0.0;
let noiseOctaves = 2;
let noiseFalloff = 0.5;
let noiseFrequency = 0.05;

function setup() {
  createCanvas(256, 256);
}

function draw() {
  background(200);

  const N = 100; // Number of frames to show before/after current frame
  const graphHeight = 100; // Height of the curve
  const centerY = height / 2; // Center the graph vertically

  noiseDetail(noiseOctaves, noiseFalloff);

  // Draw the timeline
  stroke("black");
  strokeWeight(1);
  // line(0, centerY, width, centerY);
  // line(0, centerY - graphHeight, width, centerY - graphHeight);
  // Draw the noise curve
  strokeWeight(2);
  noFill();
  beginShape();
  for (let offset = -N; offset <= N; offset++) {
    let x = map(offset, -N, N, 0, width);

    let noiseValue = noise(noiseFrequency * (frameCount + offset));
    let y = centerY - noiseValue * graphHeight + centerY / 2;
    vertex(x, y);
  }
  endShape();

  // Draw current frame indicator
  strokeWeight(10);
  stroke("black");
  noiseAmplitude = noise(noiseFrequency * frameCount);
  let currentY = centerY - noiseAmplitude * graphHeight + centerY / 2;
  point(width / 2, currentY);

  bass.oscillator.volume.value = map(noiseAmplitude, 0, 1, -60, 0.0);
}

function mousePressed() {
  if (!soundStarted) {
    startSound();
    soundStarted = true;
  } else {
    stopSound();
    soundStarted = false;
  }
}

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }
