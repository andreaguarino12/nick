// ===== CANVAS GEOMETRICO ASTRATTO =====
const canvas = document.getElementById('geo-canvas');
let ctx;
let width, height;
let particles = [];
let time = 0;
let mouseX = 0, mouseY = 0;

// Configurazione
const PARTICLE_COUNT = 80;
const GRID_SIZE = 60;
const SHAPES = ['circle', 'rect', 'triangle', 'line'];

class GeometricParticle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 30 + 10;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.15 + 0.05;
        this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        this.color = Math.random() > 0.5 ? '#ff3366' : '#6c5ce7';
        this.pulse = Math.random() * 2 * Math.PI;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.pulse += 0.02;
        
        // Confini con rimbalzo
        if (this.x < -this.size) this.x = width + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.y > height + this.size) this.y = -this.size;
        
        // Influenza del mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
            const force = (200 - distance) / 200 * 0.02;
            this.x -= dx * force;
            this.y -= dy * force;
        }
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        
        const pulseSize = this.size * (1 + Math.sin(this.pulse) * 0.1);
        ctx.globalAlpha = this.opacity * (1 + Math.sin(this.pulse) * 0.2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        ctx.fillStyle = this.color;
        ctx.fillStyle = 'transparent';
        
        switch(this.shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, pulseSize / 2, 0, Math.PI * 2);
                ctx.stroke();
                break;
                
            case 'rect':
                ctx.strokeRect(-pulseSize / 2, -pulseSize / 2, pulseSize, pulseSize);
                break;
                
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -pulseSize / 1.5);
                ctx.lineTo(pulseSize / 1.5, pulseSize / 1.5);
                ctx.lineTo(-pulseSize / 1.5, pulseSize / 1.5);
                ctx.closePath();
                ctx.stroke();
                break;
                
            case 'line':
                ctx.beginPath();
                ctx.moveTo(-pulseSize / 2, 0);
                ctx.lineTo(pulseSize / 2, 0);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(0, -pulseSize / 2);
                ctx.lineTo(0, pulseSize / 2);
                ctx.stroke();
                break;
        }
        
        ctx.restore();
    }
}

// Griglia geometrica
function drawGrid() {
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = '#ff3366';
    ctx.lineWidth = 0.5;
    
    const gridSize = GRID_SIZE;
    const offsetX = (time * 0.1) % gridSize;
    const offsetY = (time * 0.05) % gridSize;
    
    // Linee verticali
    for (let x = offsetX; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.strokeStyle = '#ff3366';
        ctx.stroke();
    }
    
    // Linee orizzontali
    for (let y = offsetY; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.strokeStyle = '#6c5ce7';
        ctx.stroke();
    }
    
    ctx.restore();
}

// Onde geometriche
function drawWaves() {
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = '#ff3366';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const offsetY = height / 2 + Math.sin(time * 0.02 + i) * 100;
        const amplitude = 40 + i * 20;
        const frequency = 0.01 + i * 0.005;
        
        for (let x = 0; x < width; x += 20) {
            const y = offsetY + Math.sin(x * frequency + time * 0.05) * amplitude;
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.strokeStyle = i % 2 === 0 ? '#ff3366' : '#6c5ce7';
        ctx.stroke();
    }
    
    ctx.restore();
}

// Punti di connessione (effetto costellazione)
function drawConstellation() {
    ctx.save();
    ctx.globalAlpha = 0.2;
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                
                const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                gradient.addColorStop(0, 'rgba(255, 51, 102, 0.1)');
                gradient.addColorStop(1, 'rgba(108, 92, 231, 0.1)');
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 0.8 * (1 - distance / 120);
                ctx.stroke();
            }
        }
    }
    
    ctx.restore();
}

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    width = canvas.width;
    height = canvas.height;
    ctx = canvas.getContext('2d', { alpha: false });
    
    // Crea particelle geometriche
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new GeometricParticle());
    }
}

function animate() {
    if (!ctx) return;
    
    // Sfondo sfumato
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0a041a');
    gradient.addColorStop(0.5, '#12082a');
    gradient.addColorStop(1, '#0a041a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    time++;
    
    // Disegna elementi geometrici
    drawGrid();
    drawWaves();
    
    // Aggiorna e disegna particelle
    particles.forEach(p => p.update());
    drawConstellation();
    particles.forEach(p => p.draw());
    
    // Aggiungi qualche punto luminoso
    ctx.save();
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 20; i++) {
        const x = (Math.sin(time * 0.01 + i) * 0.5 + 0.5) * width;
        const y = (Math.cos(time * 0.01 + i) * 0.5 + 0.5) * height;
        
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ff3366';
        ctx.fill();
    }
    ctx.restore();
    
    requestAnimationFrame(animate);
}

// ===== CURSOR PERSONALIZZATO =====
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (cursor && follower) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
            follower.style.transform = `translate(${e.clientX - 25}px, ${e.clientY - 25}px)`;
        });
        
        document.addEventListener('mouseenter', function() {
            cursor.style.opacity = 1;
            follower.style.opacity = 1;
        });
        
        document.addEventListener('mouseleave', function() {
            cursor.style.opacity = 0;
            follower.style.opacity = 0;
        });
        
        // Effetto hover
        const links = document.querySelectorAll('a, button, .nav-link, .btn');
        links.forEach(link => {
            link.addEventListener('mouseenter', function() {
                cursor.style.transform += ' scale(1.8)';
                follower.style.transform += ' scale(1.5)';
                follower.style.borderColor = 'rgba(255, 51, 102, 0.8)';
                follower.style.backgroundColor = 'rgba(255, 51, 102, 0.1)';
            });
            
            link.addEventListener('mouseleave', function() {
                cursor.style.transform = cursor.style.transform.replace(' scale(1.8)', '');
                follower.style.transform = follower.style.transform.replace(' scale(1.5)', '');
                follower.style.borderColor = 'rgba(255, 51, 102, 0.3)';
                follower.style.backgroundColor = 'transparent';
            });
        });
    }
    
    // Tracciamento mouse per canvas
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Inizializza canvas
    initCanvas();
    animate();
});

// ===== RESIZE =====
window.addEventListener('resize', () => {
    initCanvas();
});

// ===== TYPING EFFECT =====
const typingText = document.getElementById('typing-text');
if (typingText) {
    const words = ['Kubernetes', 'AWS', 'Cloud Native', 'GitOps', 'Terraform', 'DevOps'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeEffect, 500);
        } else {
            setTimeout(typeEffect, isDeleting ? 50 : 100);
        }
    }
    
    typeEffect();
}

// ===== SKILL BARS =====
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
    });
}

const skillsSection = document.getElementById('competenze');
if (skillsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(skillsSection);
}

// ===== NAVIGAZIONE ATTIVA =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNav() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNav);

// ===== MOBILE MENU =====
const navToggle = document.querySelector('.nav-toggle');
const navLinksContainer = document.querySelector('.nav-links');

if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', function() {
        if (navLinksContainer.style.display === 'flex') {
            navLinksContainer.style.display = 'none';
            this.querySelector('i').classList.remove('fa-times');
            this.querySelector('i').classList.add('fa-bars');
        } else {
            navLinksContainer.style.display = 'flex';
            this.querySelector('i').classList.remove('fa-bars');
            this.querySelector('i').classList.add('fa-times');
        }
    });
    
    navLinksContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinksContainer.style.display = 'none';
                navToggle.querySelector('i').classList.add('fa-bars');
                navToggle.querySelector('i').classList.remove('fa-times');
            }
        });
    });
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinksContainer.style.display = 'flex';
            navToggle.querySelector('i').classList.add('fa-bars');
            navToggle.querySelector('i').classList.remove('fa-times');
        } else {
            navLinksContainer.style.display = 'none';
            navToggle.querySelector('i').classList.add('fa-bars');
            navToggle.querySelector('i').classList.remove('fa-times');
        }
    });
}

// ===== FORM SUBMIT =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const button = this.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        button.innerHTML = '<span>Inviato!</span> <i class="fas fa-check"></i>';
        button.style.background = 'linear-gradient(135deg, #ff3366, #6c5ce7)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            this.reset();
        }, 3000);
    });
}

// ===== SCROLL RIVELAZIONE =====
const revealElements = document.querySelectorAll('.glass-card, .timeline-item, .skill-category');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
    revealObserver.observe(el);
});

// ===== PARALLAX =====
document.addEventListener('mousemove', function(e) {
    const moveX = (e.clientX / window.innerWidth - 0.5) * 40;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 40;
    
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
    
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
        heroBadge.style.transform = `translate(${moveX * 0.6}px, ${moveY * 0.6}px)`;
    }
});

// ===== GLITCH EFFECT =====
setInterval(() => {
    const title = document.querySelector('.title-line.accent');
    if (title && Math.random() > 0.97) {
        title.style.textShadow = '4px 0 0 rgba(255, 51, 102, 0.5), -4px 0 0 rgba(108, 92, 231, 0.5)';
        title.style.transform = 'skew(3deg, 0deg) scale(1.02)';
        setTimeout(() => {
            title.style.textShadow = '0 0 40px rgba(255, 51, 102, 0.3)';
            title.style.transform = 'none';
        }, 200);
    }
}, 2500);

// ===== CLEANUP =====
window.addEventListener('beforeunload', () => {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
});