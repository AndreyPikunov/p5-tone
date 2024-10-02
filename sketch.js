function setup() {
    createCanvas(800, 600);
    background(200);
    // Initialize sound
    initSound();
}

function draw() {
    // Your drawing code here
}

function mousePressed() {
    // Example interaction: toggle oscillator on mouse press
    toggleOscillator();
}