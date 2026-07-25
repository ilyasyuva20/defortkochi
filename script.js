// DOM elements
const loadingScreen = document.querySelector('.loading-screen');
const header = document.querySelector('.site-header');
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-links');
const progressBar = document.querySelector('.progress-bar');
const backToTop = document.querySelector('.back-to-top');
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
const revealItems = document.querySelectorAll('.reveal');
const counterItems = document.querySelectorAll('.counter-card strong');
const testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));
const galleryItems = Array.from(document.querySelectorAll('.gallery-item img'));
const modal = document.querySelector('.modal');
const modalImage = document.querySelector('.modal img');
const modalClose = document.querySelector('.modal-close');
const heroSubtitle = document.querySelector('.typing-text');

// Loading screen
window.addEventListener('load', () => {
  setTimeout(() => {
    loadingScreen?.classList.add('hidden');
  }, 800);
});

// Smooth scroll for in-page anchors
const smoothScrollTo = (targetId) => {
  const target = document.querySelector(targetId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (href && href !== '#') {
      event.preventDefault();
      smoothScrollTo(href);
      if (navMenu?.classList.contains('open')) {
        navMenu.classList.remove('open');
      }
    }
  });
});

// Mobile menu
menuToggle?.addEventListener('click', () => {
  const isOpen = navMenu?.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

// Navbar background on scroll + active link highlight
const setActiveLink = () => {
  const scrollY = window.scrollY + 140;

  document.querySelectorAll('section[id]').forEach((section) => {
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (!link) return;

    if (section.offsetTop <= scrollY && section.offsetTop + section.offsetHeight > scrollY) {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    }
  });
};

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  header?.classList.toggle('scrolled', scrollTop > 20);
  progressBar.style.width = `${(scrollTop / (document.body.scrollHeight - window.innerHeight)) * 100}%`;
  backToTop?.classList.toggle('visible', scrollTop > 600);
  setActiveLink();
});

setActiveLink();

// Scroll reveal using IntersectionObserver
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

// Animated counters
const animateCounter = (element) => {
  const target = Number(element.getAttribute('data-target'));
  let count = 0;
  const duration = 1400;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(progress * target);
    element.textContent = `${value}${target >= 500 ? '+' : '+'}`;
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.textContent = `${target}+`;
    }
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.7 }
);

counterItems.forEach((item) => counterObserver.observe(item));

// Testimonials slider
let testimonialIndex = 0;
setInterval(() => {
  testimonialCards.forEach((card, index) => {
    card.classList.toggle('active', index === testimonialIndex);
  });
  testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
}, 4500);

// Gallery lightbox
galleryItems.forEach((image) => {
  image.addEventListener('click', () => {
    modalImage.src = image.src;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });
});

modalClose?.addEventListener('click', () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
});

modal?.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
});

// Typing effect for hero subtitle
const heroPhrases = [
  'Authentic walking tours with local experts.',
  'Premium tuk-tuk experiences through heritage streets.',
  'Stories, secret corners, and unforgettable memories.'
];

let phraseIndex = 0;
let letterIndex = 0;
let isDeleting = false;

const typeEffect = () => {
  const currentPhrase = heroPhrases[phraseIndex];
  heroSubtitle.textContent = currentPhrase.slice(0, letterIndex);

  if (!isDeleting && letterIndex < currentPhrase.length) {
    letterIndex += 1;
    setTimeout(typeEffect, 70);
  } else if (isDeleting && letterIndex > 0) {
    letterIndex -= 1;
    setTimeout(typeEffect, 40);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) {
      phraseIndex = (phraseIndex + 1) % heroPhrases.length;
    }
    setTimeout(typeEffect, 1000);
  }
};

typeEffect();

// Mouse parallax on hero card
const heroSection = document.querySelector('.hero');
const heroCard = document.querySelector('.hero-card');
const heroCopy = document.querySelector('.hero-copy');

heroSection?.addEventListener('mousemove', (event) => {
  const { width, height, left, top } = heroSection.getBoundingClientRect();
  const x = (event.clientX - left) / width - 0.5;
  const y = (event.clientY - top) / height - 0.5;

  heroCard.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  heroCopy.style.transform = `translate3d(${x * 10}px, ${y * 10}px, 0)`;
});

heroSection?.addEventListener('mouseleave', () => {
  heroCard.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
  heroCopy.style.transform = 'translate3d(0, 0, 0)';
});

// Lazy loading images
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.setAttribute('src', img.getAttribute('data-src'));
      img.removeAttribute('data-src');
      imageObserver.unobserve(img);
    }
  });
});

lazyImages.forEach((img) => imageObserver.observe(img));

// Small interactive hover effect for cards
document.querySelectorAll('.package-card, .place-card, .feature-card').forEach((card) => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-8px)';
  });
});

// Back to top control
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Custom cursor movement
window.addEventListener('mousemove', (event) => {
  cursorDot.style.left = `${event.clientX}px`;
  cursorDot.style.top = `${event.clientY}px`;
  cursorRing.style.left = `${event.clientX}px`;
  cursorRing.style.top = `${event.clientY}px`;
});

window.addEventListener('mousedown', () => {
  cursorRing.style.width = '24px';
  cursorRing.style.height = '24px';
});

window.addEventListener('mouseup', () => {
  cursorRing.style.width = '36px';
  cursorRing.style.height = '36px';
});
