const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Breathing exercise definitions with steps and durations (seconds) and instructions
const exercises = {
  diaphragmatic: {
    name: "Diaphragmatic Breathing",
    steps: [
      { action: "Inhale deeply through your nose", duration: 4 },
      { action: "Hold your breath", duration: 2 },
      { action: "Exhale slowly through pursed lips", duration: 6 },
      { action: "Hold your breath", duration: 2 }
    ],
    cycles: 6,
    instructions: [
      "Sit or lie down comfortably with one hand on your chest and the other on your belly.",
      "Inhale deeply through your nose, allowing your belly to rise while keeping your chest still.",
      "Exhale slowly through pursed lips, feeling your belly fall.",
      "Repeat for 5-10 minutes daily."
    ]
  },
  box: {
    name: "Box Breathing",
    steps: [
      { action: "Inhale slowly through your nose", duration: 4 },
      { action: "Hold your breath", duration: 4 },
      { action: "Exhale slowly through your mouth", duration: 4 },
      { action: "Hold your breath", duration: 4 }
    ],
    cycles: 4,
    instructions: [
      "Inhale slowly through your nose for a count of 4 seconds.",
      "Hold your breath for 4 seconds.",
      "Exhale slowly through your mouth for 4 seconds.",
      "Hold your breath again for 4 seconds.",
      "Repeat this cycle 4-5 times."
    ]
  },
  pursed: {
    name: "Pursed Lip Breathing",
    steps: [
      { action: "Inhale slowly through your nose", duration: 2 },
      { action: "Exhale slowly through pursed lips", duration: 4 }
    ],
    cycles: 8,
    instructions: [
      "Inhale slowly through your nose for 2 seconds.",
      "Purse your lips as if you’re going to whistle.",
      "Exhale slowly and gently through pursed lips for 4 seconds.",
      "Repeat for several minutes."
    ]
  },
  alternateNostril: {
    name: "Alternate Nostril Breathing",
    steps: [
      { action: "Close right nostril and inhale through left", duration: 4 },
      { action: "Close left nostril and exhale through right", duration: 4 },
      { action: "Inhale through right nostril", duration: 4 },
      { action: "Close right nostril and exhale through left", duration: 4 }
    ],
    cycles: 5,
    instructions: [
      "Sit comfortably with your spine straight.",
      "Use your right thumb to close your right nostril.",
      "Inhale deeply through your left nostril.",
      "Close your left nostril with your ring finger and release your right nostril.",
      "Exhale slowly through your right nostril.",
      "Inhale through your right nostril, then close it and exhale through your left nostril.",
      "Repeat this cycle for 5-10 minutes."
    ]
  },
  fourSevenEight: {
    name: "4-7-8 Breathing",
    steps: [
      { action: "Exhale completely through your mouth", duration: 4 },
      { action: "Inhale quietly through your nose", duration: 4 },
      { action: "Hold your breath", duration: 7 },
      { action: "Exhale completely through your mouth", duration: 8 }
    ],
    cycles: 4,
    instructions: [
      "Exhale completely through your mouth, making a whoosh sound.",
      "Close your mouth and inhale quietly through your nose for 4 seconds.",
      "Hold your breath for 7 seconds.",
      "Exhale completely through your mouth for 8 seconds, making a whoosh sound.",
      "Repeat the cycle 4 times initially, then increase as comfortable."
    ]
  },
  resonant: {
    name: "Resonant Breathing",
    steps: [
      { action: "Inhale slowly and deeply through your nose", duration: 6 },
      { action: "Exhale slowly through your nose", duration: 6 }
    ],
    cycles: 10,
    instructions: [
      "Sit or lie down comfortably.",
      "Inhale slowly and deeply through your nose for about 5-6 seconds.",
      "Exhale slowly through your nose for about 5-6 seconds.",
      "Maintain a steady rhythm of about 5-7 breaths per minute.",
      "Practice for 10-20 minutes daily."
    ]
  }
};

// Elements for live guide
const liveExerciseName = document.getElementById('live-exercise-name');
const liveTimer = document.getElementById('live-timer');
const liveAction = document.getElementById('live-action');
const liveInstruction = document.getElementById('live-instruction');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const howToTitle = document.getElementById('how-to-title');
const howToSteps = document.getElementById('how-to-steps');

let currentExercise = null;
let currentCycle = 0;
let currentStepIndex = 0;
let timer = null;
let timeLeft = 0;
let isRunning = false;

// Format seconds to MM:SS or SS
function formatTime(seconds) {
  return seconds < 10 ? `0${seconds}` : seconds;
}

// Update the live guide display
function updateDisplay() {
  liveTimer.textContent = formatTime(timeLeft);
  if(currentExercise) {
    liveAction.textContent = currentExercise.steps[currentStepIndex].action;
    liveInstruction.textContent = `Cycle ${currentCycle + 1} of ${currentExercise.cycles}`;
  } else {
    liveAction.textContent = "Waiting for selection...";
    liveTimer.textContent = "00";
    liveInstruction.textContent = "Select an exercise card above to see the live breathing guide.";
  }
}

// Timer tick function
function tick() {
  if(timeLeft > 0) {
    timeLeft--;
    updateDisplay();
  } else {
    // Step finished, move to next step or cycle
    currentStepIndex++;
    if(currentStepIndex >= currentExercise.steps.length) {
      currentCycle++;
      if(currentCycle >= currentExercise.cycles) {
        // Finished all cycles
        stopTimer();
        liveAction.textContent = "Exercise complete! Well done.";
        liveInstruction.textContent = "Select another exercise or restart.";
        liveTimer.textContent = "00";
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = false;
        return;
      } else {
        currentStepIndex = 0;
      }
    }
    timeLeft = currentExercise.steps[currentStepIndex].duration;
    updateDisplay();
  }
}

// Start the timer
function startTimer() {
  if(!currentExercise) return;
  if(isRunning) return;
  if(timeLeft === 0) {
    currentCycle = 0;
    currentStepIndex = 0;
    timeLeft = currentExercise.steps[0].duration;
  }
  isRunning = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  resetBtn.disabled = false;
  updateDisplay();
  timer = setInterval(tick, 1000);
}

// Pause the timer
function pauseTimer() {
  if(!isRunning) return;
  isRunning = false;
  clearInterval(timer);
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = false;
}

// Stop and reset the timer
function resetTimer() {
  isRunning = false;
  clearInterval(timer);
  if(currentExercise) {
    currentCycle = 0;
    currentStepIndex = 0;
    timeLeft = 0;
    updateDisplay();
  }
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
}

// Stop timer helper
function stopTimer() {
  isRunning = false;
  clearInterval(timer);
}

// Render instructions for selected exercise
function renderInstructions(instructions) {
  howToSteps.innerHTML = '';
  if(instructions && instructions.length > 0) {
    instructions.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      howToSteps.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'No instructions available.';
    howToSteps.appendChild(li);
  }
}

// Select an exercise
function selectExercise(key) {
  if(!exercises[key]) return;
  currentExercise = exercises[key];
  currentCycle = 0;
  currentStepIndex = 0;
  timeLeft = 0;
  isRunning = false;
  clearInterval(timer);
  liveExerciseName.textContent = currentExercise.name;
  liveAction.textContent = "Ready to start";
  liveTimer.textContent = "00";
  liveInstruction.textContent = `This exercise has ${currentExercise.cycles} cycle${currentExercise.cycles > 1 ? 's' : ''}. Press Start to begin.`;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
  startBtn.focus();
  // Update aria-pressed for all cards
  document.querySelectorAll('#exercises article').forEach(card => {
    card.setAttribute('aria-pressed', card.getAttribute('data-exercise') === key ? 'true' : 'false');
  });
  // Render instructions for selected exercise
  renderInstructions(currentExercise.instructions);
}

// Add event listeners to exercise cards
document.querySelectorAll('#exercises article').forEach(card => {
  card.addEventListener('click', () => {
    selectExercise(card.getAttribute('data-exercise'));
    window.scrollTo({ top: document.getElementById('live-guide-section').offsetTop - 20, behavior: 'smooth' });
  });
  card.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectExercise(card.getAttribute('data-exercise'));
      window.scrollTo({ top: document.getElementById('live-guide-section').offsetTop - 20, behavior: 'smooth' });
    }
  });
});

// Button event listeners
startBtn.addEventListener('click', () => {
  startTimer();
});
pauseBtn.addEventListener('click', () => {
  pauseTimer();
});
resetBtn.addEventListener('click', () => {
  resetTimer();
});