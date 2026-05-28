const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

// Ajustamos el canvas al tamaño de la pantalla
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];

// --- CONFIGURACIÓN DE COLORES ---
// Corazón verde, más claro que el fondo
const heartColor = '#52c457'; 
// Letras más oscuras que el corazón, resaltan sobre el fondo
const textColor = '#26732b'; 

// Ecuación matemática para obtener la forma del corazón
function getHeartPosition(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return { x, y };
}

// Clase que define cada puntito (partícula) del corazón
class Particle {
    constructor(targetX, targetY) {
        // Nacen en posiciones aleatorias de la pantalla
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.targetX = targetX;
        this.targetY = targetY;
        this.size = Math.random() * 2 + 1; // Tamaño aleatorio entre 1 y 3
        this.ease = 0.02 + Math.random() * 0.05; // Velocidad con la que se agrupan
    }

    update() {
        // Movimiento suave hacia su posición final en el corazón
        this.x += (this.targetX - this.x) * this.ease;
        this.y += (this.targetY - this.y) * this.ease;
    }

    draw() {
        ctx.fillStyle = heartColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Inicializar la forma del corazón
function init() {
    particles.length = 0; // Limpiamos si se redimensiona la pantalla
    const scale = Math.min(canvas.width, canvas.height) / 40; // Escala responsiva
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Generar los puntos recorriendo la ecuación
    for (let i = 0; i < Math.PI * 2; i += 0.02) {
        const pos = getHeartPosition(i);
        // El canvas invierte la Y, por eso restamos en el eje Y
        const tx = centerX + pos.x * scale;
        const ty = centerY - pos.y * scale; 
        
        // Creamos varias partículas por cada punto para darle "volumen" al corazón
        for(let j = 0; j < 6; j++) {
            const offsetX = (Math.random() - 0.5) * 15;
            const offsetY = (Math.random() - 0.5) * 15;
            particles.push(new Particle(tx + offsetX, ty + offsetY));
        }
    }
}

// Bucle de animación
function animate() {
    // Limpiamos el canvas cada frame (el fondo verde de tu HTML se verá detrás)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Dibujar el texto en el centro
    ctx.fillStyle = textColor;
    // El tamaño de la fuente se adapta a la pantalla
    ctx.font = `bold ${Math.min(canvas.width, canvas.height) / 8}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // --- CAMBIA EL TEXTO AQUÍ ---
    ctx.fillText('Te Amo', canvas.width / 2, canvas.height / 2);

    // 2. Actualizar y dibujar partículas
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

// Escuchar si el usuario cambia el tamaño de la ventana
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Arrancar el programa
init();
animate();
