let oscillator;

function initSound() {
    // Initialize the oscillator
    oscillator = new Tone.Oscillator({
        type: 'sine',
        frequency: 440,
        volume: -12
    }).toDestination();
}

function toggleOscillator() {
    if (oscillator.state === 'stopped') {
        oscillator.start();
    } else {
        oscillator.stop();
    }
}