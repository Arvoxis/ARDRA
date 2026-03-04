// ===== PARTICLE SYSTEM =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Mouse interaction
    if (mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        this.x -= dx * 0.01;
        this.y -= dy * 0.01;
      }
    }

    // Wrap around
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 100);
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        const opacity = (1 - dist / 140) * 0.12;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  connectParticles();
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});


// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section, footer');
const navItems = document.querySelectorAll('.nav-links a');

const observerOptions = {
  root: null,
  rootMargin: '-50% 0px',
  threshold: 0
};

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${id}`) {
          item.classList.add('active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => navObserver.observe(section));

// ===== PROBLEM CARD EXPAND/COLLAPSE =====
const problemCards = document.querySelectorAll('.problem-card');

problemCards.forEach(card => {
  const header = card.querySelector('.problem-header');
  header.addEventListener('click', () => {
    const wasExpanded = card.classList.contains('expanded');

    // Close all
    problemCards.forEach(c => c.classList.remove('expanded'));

    // Toggle clicked
    if (!wasExpanded) {
      card.classList.add('expanded');
      // Smooth scroll into view
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  });
});

// Auto-expand first problem statement
setTimeout(() => {
  problemCards[0]?.classList.add('expanded');
}, 800);

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll(
  '.about-card, .problem-card, .event-card, .section-header'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  root: null,
  rootMargin: '0px 0px -80px 0px',
  threshold: 0.1
});

revealElements.forEach(el => revealObserver.observe(el));

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== TYPING EFFECT (optional use for hero) =====
// Not used directly but available if needed

// ===== PARALLAX MICRO-EFFECT ON HERO =====
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
    heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
  }
});
