let defaultColor;
let grainTexture;
let time = 0;
let modules = [];
let activeModule = null;
let soundStarted = false;

// Add synthesizer instances
let bass;
let pad;

// Initialize audio
function initAudio() {
  bass = new Bass();
  pad = new Pad();
  Tone.start();
}

class Module {
  constructor(x, y, w, h, type) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
    this.value = 0;
    this.targetValue = 0;
    this.isHovered = false;
    this.pulsePhase = random(TWO_PI);
    this.meshOffset = 0;
  }

  contains(px, py) {
    return (
      px > this.x - this.w / 2 &&
      px < this.x + this.w / 2 &&
      py > this.y - this.h / 2 &&
      py < this.y + this.h / 2
    );
  }

  update() {
    this.value = lerp(this.value, this.targetValue, 0.1);
    this.meshOffset += this.isHovered ? 0.02 : 0.005;
  }

  display() {
    push();
    translate(this.x, this.y);

    // Panel frame with hover effect
    stroke(defaultColor);
    strokeWeight(2);
    noFill();
    if (this.isHovered) {
      stroke(60, 60, 55, 220);
      strokeWeight(3);
    }
    rect(-this.w / 2, -this.h / 2, this.w, this.h, 3);

    switch (this.type) {
      case "mesh":
        this.drawMesh();
        break;
      case "circle":
        this.drawCircle();
        break;
      case "control":
        this.drawControl();
        break;
      case "knob":
        this.drawKnobs();
        break;
    }
    pop();
  }

  drawMesh() {
    stroke(defaultColor);
    strokeWeight(0.5);
    let spacing = 5;

    // Animated mesh with offset
    for (let i = -this.w / 2 + spacing; i < this.w / 2; i += spacing) {
      let yOffset = sin(i * 0.1 + this.meshOffset) * 2;
      line(i, -this.h / 2 + 5 + yOffset, i, this.h / 2 - 5 + yOffset);
    }
    for (let j = -this.h / 2 + spacing; j < this.h / 2; j += spacing) {
      let xOffset = cos(j * 0.1 + this.meshOffset) * 2;
      line(-this.w / 2 + 5 + xOffset, j, this.w / 2 - 5 + xOffset, j);
    }
  }

  drawCircle() {
    // Pulsing central circle
    let pulseSize = sin(this.pulsePhase + time * 2) * 5;
    let mainSize = 30 + pulseSize * (this.isHovered ? 2 : 1);

    // Outer rings
    for (let i = 3; i > 0; i--) {
      let alpha = map(i, 0, 3, 50, 150);
      stroke(defaultColor[0], defaultColor[1], defaultColor[2], alpha);
      circle(0, 0, mainSize + i * 10 + pulseSize);
    }

    // Main circle
    stroke(defaultColor);
    strokeWeight(2);
    circle(0, 0, mainSize);
  }

  drawControl() {
    // Animated slider
    let sliderPos = map(this.value, 0, 1, -this.w / 4, this.w / 4);

    // Track
    line(-this.w / 4, 0, this.w / 4, 0);

    // Slider handle with glow effect
    if (this.isHovered) {
      noFill();
      stroke(defaultColor[0], defaultColor[1], defaultColor[2], 100);
      circle(sliderPos, 0, 12);
    }
    fill(245, 242, 235);
    stroke(defaultColor);
    circle(sliderPos, 0, 8);

    // Tick marks
    for (let i = -20; i <= 20; i += 10) {
      line(i, -10, i, -5);
    }
  }

  drawKnobs() {
    // Two rotating knobs
    for (let i = -1; i <= 1; i += 2) {
      let x = i * 15;
      let rotation = this.value * TWO_PI;

      // Knob base
      circle(x, 0, 20);

      // Knob indicator
      push();
      translate(x, 0);
      rotate(rotation);
      line(0, 0, 0, -8);
      pop();

      // Optional: add glow effect when hovered
      if (this.isHovered) {
        noFill();
        stroke(defaultColor[0], defaultColor[1], defaultColor[2], 50);
        circle(x, 0, 24);
      }
    }
  }
}

function setup() {
  createCanvas(600, 600);
  defaultColor = color(40, 40, 35, 220);

  // Create grain texture
  grainTexture = createGraphics(width, height);
  createGrainTexture();

  // Initialize modules
  let moduleSize = { w: 80, h: 50 };

  // Top row
  modules.push(new Module(-120, -90, moduleSize.w, moduleSize.h, "mesh"));
  modules.push(new Module(0, -90, moduleSize.w, moduleSize.h, "circle"));
  modules.push(new Module(120, -90, moduleSize.w, moduleSize.h, "mesh"));

  // Middle row
  modules.push(new Module(-120, 0, moduleSize.w, moduleSize.h, "control"));
  modules.push(new Module(0, 0, moduleSize.w, moduleSize.h, "knob"));
  modules.push(new Module(120, 0, moduleSize.w, moduleSize.h, "control"));

  // Bottom row
  modules.push(new Module(-120, 90, moduleSize.w, moduleSize.h, "mesh"));
  modules.push(new Module(0, 90, moduleSize.w, moduleSize.h, "mesh"));
  modules.push(new Module(120, 90, moduleSize.w, moduleSize.h, "mesh"));
}

function draw() {
  background(245, 242, 235);

  // Draw grid
  drawGrid();

  // Update and draw all modules
  push();
  translate(width / 2, height / 2);

  // Draw frame
  drawFrame();

  // Update mouse interaction
  let mouseXRelative = mouseX - width / 2;
  let mouseYRelative = mouseY - height / 2;

  // Update and display modules
  modules.forEach((module) => {
    module.isHovered = module.contains(mouseXRelative, mouseYRelative);
    module.update();
    module.display();
  });

  pop();

  // Apply grain texture
  image(grainTexture, 0, 0);

  // Update time for animations
  time += 0.02;
}

function mouseDragged() {
  let mouseXRelative = mouseX - width / 2;
  let mouseYRelative = mouseY - height / 2;

  modules.forEach((module, index) => {
    if (module.contains(mouseXRelative, mouseYRelative)) {
      let deltaY = pmouseY - mouseY;
      module.targetValue = constrain(module.targetValue + deltaY * 0.01, 0, 1);

      // Map controls to synthesizer parameters
      switch (index) {
        case 3: // Left control
          bass.filter.frequency.value = map(
            module.targetValue,
            0,
            1,
            100,
            1000
          );
          break;
        case 4: // Center knobs
          bass.oscillator.volume.value = map(module.targetValue, 0, 1, -40, 0);
          pad.oscillators.forEach((osc) => {
            osc.oscillator.volume.value = map(
              module.targetValue,
              0,
              1,
              -60,
              -20
            );
          });
          break;
        case 5: // Right control
          bass.distortion.wet.value = module.targetValue;
          pad.reverb.wet.value = module.targetValue;
          break;
      }
    }
  });
}

function drawFrame() {
  noFill();
  stroke(defaultColor);
  strokeWeight(2);

  // Main frame
  rect(-150, -120, 300, 240, 5);

  // Side panels with subtle animation
  let sideOffset = sin(time) * 2;
  rect(-190, -80 + sideOffset, 30, 160, 5);
  rect(160, -80 - sideOffset, 30, 160, 5);
}

function drawGrid() {
  stroke(180, 180, 180, 40);
  strokeWeight(0.5);

  for (let x = 0; x < width; x += 20) {
    line(x, 0, x, height);
  }

  for (let y = 0; y < height; y += 20) {
    line(0, y, width, y);
  }
}

function createGrainTexture() {
  grainTexture.loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let noise = random(255);
      let alpha = random(10);
      grainTexture.set(x, y, color(noise, alpha));
    }
  }
  grainTexture.updatePixels();
  grainTexture.filter(BLUR, 0.5);
}

function mousePressed() {
  if (!soundStarted) {
    initAudio();
    bass.start();
    pad.start();
    soundStarted = true;
  }
  //   } else {
  //     bass.stop();
  //     pad.stop();
  //     soundStarted = false;
  //   }
}
