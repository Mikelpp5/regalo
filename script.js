const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const particleCount = 500; 

// Fases de la animación: "appearing", "floating", "collapsing"
let animationPhase = "appearing"; 
let phaseTimer = 0;

// Función matemática para calcular la forma de corazón
function getHeartPoint(t) {
    return {
        x: 16 * Math.pow(Math.sin(t), 3),
        y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    };
}

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.t = Math.random() * Math.PI * 2;
        const basePoint = getHeartPoint(this.t);
        const scale = Math.min(canvas.width, canvas.height) / 35; 
        
        // Centro del corazón en pantalla
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2 - 20; 

        this.targetX = this.centerX + basePoint.x * scale;
        this.targetY = this.centerY + basePoint.y * scale;
        
        // Empiezan dispersas cerca del centro
        this.x = this.centerX + (Math.random() - 0.5) * 50;
        this.y = this.centerY + (Math.random() - 0.5) * 50;
        
        this.size = Math.random() * 2 + 1.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.alpha = 0; 
        this.alphaSpeed = 0.01 + Math.random() * 0.02;
    }

    update() {
        if (animationPhase === "appearing") {
            // Viajan hacia afuera formando el corazón
            this.x += (this.targetX - this.x) * 0.05;
            this.y += (this.targetY - this.y) * 0.05;
            if (this.alpha < 1) this.alpha += 0.02;

        } else if (animationPhase === "floating") {
            // El corazón tiembla/brilla de forma normal
            this.x += this.speedX;
            this.y += this.speedY;

            if (Math.abs(this.x - this.targetX) > 10) this.speedX *= -1;
            if (Math.abs(this.y - this.targetY) > 10) this.speedY *= -1;

            this.alpha += this.alphaSpeed;
            if (this.alpha > 1 || this.alpha < 0.3) this.alphaSpeed *= -1;

        } else if (animationPhase === "collapsing") {
            // Se absorben hacia el centro exacto y desaparecen
            this.x += (this.centerX - this.x) * 0.08;
            this.y += (this.centerY - this.y) * 0.08;
            this.alpha -= 0.02;
            if (this.size > 0.1) this.size -= 0.05;
        }
    }

    draw() {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#ff4da6'; // Color rosa brillante para los puntitos
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ff4da6'; // Efecto neón rosa
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Inicializar la lista de puntitos
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animate() {
    // Fondo con rastro para el efecto de movimiento difuminado
    ctx.fillStyle = 'rgba(26, 0, 16, 0.25)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gestor del temporizador de fases
    phaseTimer++;
    if (animationPhase === "appearing" && phaseTimer > 80) {
        animationPhase = "floating";
        phaseTimer = 0;
    } else if (animationPhase === "floating" && phaseTimer > 200) { 
        animationPhase = "collapsing";
        phaseTimer = 0;
    } else if (animationPhase === "collapsing" && phaseTimer > 60) {
        animationPhase = "appearing";
        phaseTimer = 0;
        particles.forEach(p => p.reset());
    }

    // Dibujar y actualizar partículas
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // --- TEXTO "TE AMO" EN ROSA ---
    ctx.save();
    
    // Efecto de desvanecimiento del texto coordinado con el corazón
    if (animationPhase === "appearing") ctx.globalAlpha = Math.min(1, phaseTimer / 80);
    if (animationPhase === "collapsing") ctx.globalAlpha = Math.max(0, 1 - (phaseTimer / 60));
    
    ctx.fillStyle = '#ff4da6'; // Cambiado a rosa brillante como pediste
    ctx.font = 'bold 2.8rem Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff4da6'; // Resplandor rosa
    
    // Centrado perfecto en medio del corazón
    ctx.fillText("TE AMO", canvas.width / 2, canvas.height / 2 - 20);
    ctx.restore();

    requestAnimationFrame(animate);
}

animate();
