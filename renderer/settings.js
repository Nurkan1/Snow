// Settings window controller
const sliders = {
  density: document.getElementById('density'),
  speed: document.getElementById('speed'),
  size: document.getElementById('size'),
  wind: document.getElementById('wind'),
  opacity: document.getElementById('opacity')
};

const valueDisplays = {
  density: document.getElementById('density-value'),
  speed: document.getElementById('speed-value'),
  size: document.getElementById('size-value'),
  wind: document.getElementById('wind-value'),
  opacity: document.getElementById('opacity-value')
};

// Update value display and send to main process
function updateSetting(name, value) {
  valueDisplays[name].textContent = value;
  
  const settings = {};
  settings[name] = parseFloat(value);
  window.snowAPI.updateSettings(settings);
}

// Add event listeners to all sliders
Object.keys(sliders).forEach(name => {
  sliders[name].addEventListener('input', (e) => {
    updateSetting(name, e.target.value);
  });
});

// Load settings from main process
window.snowAPI.onLoadSettings((settings) => {
  Object.keys(settings).forEach(name => {
    if (sliders[name]) {
      sliders[name].value = settings[name];
      valueDisplays[name].textContent = settings[name];
    }
  });
});

// Close button
document.getElementById('close-btn').addEventListener('click', () => {
  window.snowAPI.closeSettings();
});

// Quit button
document.getElementById('quit-btn').addEventListener('click', () => {
  window.snowAPI.quitApp();
});

// Pause button
const pauseBtn = document.getElementById('pause-btn');
let isPaused = false;

pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseBtn.classList.toggle('paused', isPaused);
  pauseBtn.textContent = isPaused ? '▶ Resume Snow' : '⏸ Pause Snow';
  window.snowAPI.updateSettings({ paused: isPaused });
});

// Update pause button state when loading settings
window.snowAPI.onLoadSettings((settings) => {
  if (settings.paused !== undefined) {
    isPaused = settings.paused;
    pauseBtn.classList.toggle('paused', isPaused);
    pauseBtn.textContent = isPaused ? '▶ Resume Snow' : '⏸ Pause Snow';
  }
});
