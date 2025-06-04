const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth * 0.9; // Use 90% of the window width
canvas.height = window.innerHeight * 0.9; // Use 90% of the window height

// Array to hold the particles
let particles = [];

// Mouse position object
const mouse = {
    x: null,
    y: null,
    radius: 150 // Area of attraction
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle class
class Particle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
        };
        this.radius = radius;
        this.color = color;
        this.mass = 1;
        this.isClicked = false;
        this.maxLife = Math.random() * 80 + 70; // Lifetime for glitter effect, e.g., 70-150 frames
        this.life = this.maxLife;
        this.opacity = 1;
    }

    // Method to draw a particle
    draw() {
        ctx.save(); // Save current context state
        ctx.globalAlpha = this.opacity;

        // Main particle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Inner twinkle/highlight
        const highlightRadius = this.radius / 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, highlightRadius, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // White highlight, semi-transparent
        ctx.fill();

        ctx.restore(); // Restore context state (especially globalAlpha)
        ctx.closePath(); // Though not strictly necessary after fill, good practice
    }

    // Method to update particle position
    update() {
        // Glitter effect: manage life and opacity
        this.life--;
        if (this.life <= 0) {
            this.life = this.maxLife; // Reset life
            // Optionally, slightly change color or radius upon "respawn" for more dynamism
            // this.color = `hsl(${Math.random() * 360}, 70%, 70%)`;
        }
        // Make opacity pulsate: sin wave for smooth flicker
        this.opacity = Math.abs(Math.sin((this.life / this.maxLife) * Math.PI * 2));


        // Wall collision (bounce)
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y;
        }

        // Apply gravity
        this.velocity.y += 0.05; // Simple gravity effect

        // Mouse attraction
        if (mouse.x && mouse.y && this.isClicked) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) { // If within attraction radius
                if (distance < 5) { // If very close to the mouse
                    // Snap to mouse position or stop moving
                    this.x = mouse.x;
                    this.y = mouse.y;
                    this.velocity.x = 0;
                    this.velocity.y = 0;
                } else {
                    // Stronger attraction force directly towards the mouse
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const attractionForce = 2; // Increased force
                    this.velocity.x = forceDirectionX * attractionForce;
                    this.velocity.y = forceDirectionY * attractionForce;
                }
            }
        }

        // Max speed
        const maxSpeed = 5;
        this.velocity.x = Math.max(-maxSpeed, Math.min(maxSpeed, this.velocity.x));
        this.velocity.y = Math.max(-maxSpeed, Math.min(maxSpeed, this.velocity.y));


        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.draw();
    }
}

// Function to initialize particles
function init() {
    particles = []; // Clear existing particles
    const numberOfParticles = 100; // Number of particles
    for (let i = 0; i < numberOfParticles; i++) {
        const radius = Math.random() * 5 + 5; // Random size (5 to 10)
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`; // Random color
        particles.push(new Particle(x, y, radius, color));
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    particles.forEach(particle => {
        particle.update();
    });
}

// Event listeners for mouse click
canvas.addEventListener('mousedown', () => {
    particles.forEach(particle => particle.isClicked = true);
});

canvas.addEventListener('mouseup', () => {
    particles.forEach(particle => particle.isClicked = false);
});


// Initialize and start animation
init();
animate();

// Adjust canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.9;
    init(); // Re-initialize particles on resize
});
