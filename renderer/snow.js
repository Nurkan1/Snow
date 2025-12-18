// Snow animation engine
const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');

// Settings (will be updated from main process)
let settings = {
  density: 150,
  speed: 2,
  size: 3,
  wind: 0,
  opacity: 0.8,
  paused: false
};

// Snowflake array
let snowflakes = [];

// Resize canvas to fill screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Snowflake class
class Snowflake {
  constructor() {
    this.reset();
    // Start at random Y position for initial population
    this.y = Math.random() * canvas.height;
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = -10;
    this.baseSize = (Math.random() * 2 + 1) * settings.size;
    this.size = this.baseSize;
    this.speedY = (Math.random() * 1 + 0.5) * settings.speed;
    this.speedX = 0;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.02 + 0.01;
    this.wobbleAmplitude = Math.random() * 2 + 1;
  }

  update() {
    // Wobble effect for natural movement
    this.wobble += this.wobbleSpeed;
    const wobbleX = Math.sin(this.wobble) * this.wobbleAmplitude;
    
    // Apply wind and wobble
    this.speedX = settings.wind * 0.5 + wobbleX * 0.3;
    
    // Update position
    this.x += this.speedX;
    this.y += this.speedY;

    // Reset if out of bounds
    if (this.y > canvas.height + 10) {
      this.reset();
    }
    
    // Wrap horizontally
    if (this.x > canvas.width + 50) {
      this.x = -10;
    } else if (this.x < -50) {
      this.x = canvas.width + 10;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * settings.opacity})`;
    ctx.fill();
    
    // Add subtle glow effect for larger snowflakes
    if (this.size > 3) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * settings.opacity * 0.2})`;
      ctx.fill();
    }
  }
}

// Initialize snowflakes
function initSnowflakes() {
  snowflakes = [];
  for (let i = 0; i < settings.density; i++) {
    snowflakes.push(new Snowflake());
  }
}

// Update snowflake count when density changes
function updateSnowflakeCount() {
  const diff = settings.density - snowflakes.length;
  
  if (diff > 0) {
    // Add more snowflakes
    for (let i = 0; i < diff; i++) {
      snowflakes.push(new Snowflake());
    }
  } else if (diff < 0) {
    // Remove excess snowflakes
    snowflakes.splice(settings.density);
  }
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (!settings.paused) {
    snowflakes.forEach(flake => {
      flake.update();
      flake.draw();
    });
  } else {
    // When paused, just draw without updating positions
    snowflakes.forEach(flake => {
      flake.draw();
    });
  }
  
  requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
  resizeCanvas();
});

// Listen for settings updates from main process
window.snowAPI.onUpdateSettings((newSettings) => {
  const oldDensity = settings.density;
  settings = { ...settings, ...newSettings };
  
  // Update snowflake sizes
  snowflakes.forEach(flake => {
    flake.baseSize = (Math.random() * 2 + 1) * settings.size;
    flake.size = flake.baseSize;
    flake.speedY = (Math.random() * 1 + 0.5) * settings.speed;
  });
  
  // Update count if density changed
  if (settings.density !== oldDensity) {
    updateSnowflakeCount();
  }
});

// Initialize
resizeCanvas();
initSnowflakes();
animate();
