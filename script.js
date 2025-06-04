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
            x: (Math.random() - 0.5) * 2, // Random initial x velocity
            y: (Math.random() - 0.5) * 2  // Random initial y velocity
        };
        this.radius = radius;
        this.color = color;
        this.mass = 1; // Mass for gravity calculation
        this.isClicked = false; // To track if mouse is clicked
    }

    // Method to draw a particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    // Method to update particle position
    update() {
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
            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                // Accelerate towards the mouse
                const accelerationStrength = 0.7; // Adjust for stronger/weaker attraction
                this.velocity.x += forceDirectionX * accelerationStrength;
                this.velocity.y += forceDirectionY * accelerationStrength;
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
