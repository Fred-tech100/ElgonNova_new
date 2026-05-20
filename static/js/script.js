// ── LOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2000);
});

// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => {
    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top = e.clientY + 'px';
  }, 60);
});

// ── NAVBAR ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('back-top').classList.toggle('show', window.scrollY > 400);
});

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ── HERO SLIDER ──
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slider-dot');
let slideInterval;

function goToSlide(idx) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (idx + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}
function startSlider() {
  slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
}
startSlider();
document.getElementById('nextSlide').addEventListener('click', () => { clearInterval(slideInterval); goToSlide(currentSlide+1); startSlider(); });
document.getElementById('prevSlide').addEventListener('click', () => { clearInterval(slideInterval); goToSlide(currentSlide-1); startSlider(); });
dots.forEach(dot => {
  dot.addEventListener('click', () => { clearInterval(slideInterval); goToSlide(+dot.dataset.index); startSlider(); });
});

// Touch swipe hero
let touchStart = null;
document.getElementById('hero').addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; });
document.getElementById('hero').addEventListener('touchend', e => {
  if (!touchStart) return;
  const diff = touchStart - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) { clearInterval(slideInterval); goToSlide(diff > 0 ? currentSlide+1 : currentSlide-1); startSlider(); }
  touchStart = null;
});

// ── TYPING EFFECT ──
const phrases = [
  'Web Development Experts.',
  'Custom Software Solutions.',
  'IoT & Smart Systems.',
  'Data Analysis Specialists.',
  'IT Consultancy Leaders.',
  'Creative Graphics Design.',
  'Professional Printing Services.',
  'Your Digital Growth Partners.'
];
let phraseIdx = 0, charIdx = 0, deleting = false;
function typeEffect() {
  const el = document.getElementById('typing-text');
  const phrase = phrases[phraseIdx];
  if (!deleting && charIdx <= phrase.length) {
    el.textContent = phrase.substring(0, charIdx++);
    setTimeout(typeEffect, charIdx === phrase.length + 1 ? 1600 : 65);
  } else {
    deleting = true;
    if (charIdx > 0) {
      el.textContent = phrase.substring(0, charIdx--);
      setTimeout(typeEffect, 35);
    } else {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeEffect, 300);
    }
  }
}
setTimeout(typeEffect, 2300);

// ── PARTICLES ──
const container = document.getElementById('particles');
for (let i = 0; i < 28; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 4 + 1;
  const isBlue = Math.random() > .4;
  p.style.cssText = `
    width:${size}px;height:${size}px;
    left:${Math.random()*100}%;
    background:${isBlue ? 'rgba(0,212,255,' : 'rgba(255,107,0,'}${.3+Math.random()*.5});
    animation-duration:${8+Math.random()*14}s;
    animation-delay:-${Math.random()*14}s;
  `;
  container.appendChild(p);
}

// ── REVEAL ANIMATIONS ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── COUNTER ANIMATION ──
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.done) {
      e.target.dataset.done = '1';
      const target = +e.target.dataset.target;
      const suffix = e.target.dataset.target == '24' ? '/7' : '+';
      let count = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        count = Math.min(count + step, target);
        e.target.textContent = count + suffix;
        if (count >= target) clearInterval(timer);
      }, 28);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

// ── PORTFOLIO FILTER ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.portfolio-item').forEach(item => {
      if (filter === 'all' || item.dataset.cat === filter) {
        item.style.display = '';
        item.style.animation = 'fadeIn .4s ease';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ── TESTIMONIALS SLIDER ──
let testiIdx = 0;
const track = document.getElementById('testiTrack');
const cards = track.querySelectorAll('.testi-card');
function updateTesti() {
  const cardW = cards[0].offsetWidth + 24;
  const maxIdx = Math.max(0, cards.length - Math.floor(track.parentElement.offsetWidth / cardW));
  testiIdx = Math.min(testiIdx, maxIdx);
  track.style.transform = `translateX(-${testiIdx * cardW}px)`;
}
document.getElementById('testiNext').addEventListener('click', () => { testiIdx++; updateTesti(); });
document.getElementById('testiPrev').addEventListener('click', () => { testiIdx = Math.max(0, testiIdx-1); updateTesti(); });
let testiAuto = setInterval(() => { testiIdx++; updateTesti(); }, 4500);
track.addEventListener('mouseenter', () => clearInterval(testiAuto));
track.addEventListener('mouseleave', () => { testiAuto = setInterval(() => { testiIdx++; updateTesti(); }, 4500); });
// Touch
let tt = null;
track.addEventListener('touchstart', e => tt = e.touches[0].clientX);
track.addEventListener('touchend', e => {
  if (!tt) return;
  const d = tt - e.changedTouches[0].clientX;
  if (Math.abs(d) > 40) { d > 0 ? testiIdx++ : testiIdx = Math.max(0,testiIdx-1); updateTesti(); }
  tt = null;
});

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      q.setAttribute('aria-expanded', 'true');
    }
  });
  q.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); q.click(); } });
});

// ── BACK TO TOP ──
document.getElementById('back-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── CONTACT FORM ──
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const msg = document.getElementById('formMsg');
  const btn = this.querySelector('button[type=submit]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
  setTimeout(() => {
    msg.style.display = 'block';
    msg.style.color = 'var(--blue)';
    msg.textContent = '✓ MESSAGE SENT SUCCESSFULLY! We\'ll get back to you within 24 hours.';
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> SEND MESSAGE';
    this.reset();
    setTimeout(() => { msg.style.display = 'none'; }, 6000);
  }, 1600);
});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

// Animate gradient in hero title on scroll
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.line2');
  if (hero) {
    const angle = 90 + window.scrollY * 0.05;
    hero.style.backgroundImage = `linear-gradient(${angle}deg, var(--orange), var(--blue))`;
  }
});

// ── LIVE CHAT TOGGLE ──
// document.getElementById('chatToggle').addEventListener('click', () => {
//   const box = document.getElementById('chatBox');
//   const isOpen = box.classList.toggle('open');
//   document.getElementById('chatToggle').setAttribute('aria-expanded', isOpen);
//   // Hide badge once opened
//   const badge = document.querySelector('.chat-badge');
//   if (isOpen && badge) badge.style.display = 'none';
//   if (isOpen) {
//     document.getElementById('chatInput').focus();
//     // Show welcome message with delay if first open
//     if (!box.dataset.init) {
//       box.dataset.init = '1';
//       setTimeout(() => addChatMsg('bot', "👋 Hi there! I'm the ElgonNova assistant. How can I help you today?"), 400);
//     }
//   }
// });

// document.getElementById('chatClose').addEventListener('click', () => {
//   document.getElementById('chatBox').classList.remove('open');
// });

// function addChatMsg(type, text) {
//   const feed = document.getElementById('chatFeed');
//   const msg = document.createElement('div');
//   msg.className = 'chat-msg ' + type;
//   msg.innerHTML = `<span>${text}</span>`;
//   feed.appendChild(msg);
//   feed.scrollTop = feed.scrollHeight;
// }

// const autoReplies = [
//   "Thanks for reaching out! Our team will get back to you shortly. You can also call us at +256 753 825 829.",
//   "Great question! We'd love to help with that. Please send us an email at elgonnovatechnologies@gmail.com for detailed information.",
//   "We're available Mon–Fri 8AM–6PM and Sat 9AM–3PM. For urgent matters, WhatsApp us at +256 753 825 829!",
//   "Absolutely! ElgonNova Technologies serves clients across East Africa and internationally. Let's discuss your project!",
//   "Our pricing is flexible and competitive. Contact us for a free quote tailored to your specific needs."
// ];
// let replyIdx = 0;

// document.getElementById('chatSend').addEventListener('click', sendChat);
// document.getElementById('chatInput').addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });

// function sendChat() {
//   const input = document.getElementById('chatInput');
//   const val = input.value.trim();
//   if (!val) return;
//   addChatMsg('user', val);
//   input.value = '';
//   const typing = document.createElement('div');
//   typing.className = 'chat-msg bot typing-dots';
//   typing.innerHTML = '<span><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>';
//   document.getElementById('chatFeed').appendChild(typing);
//   document.getElementById('chatFeed').scrollTop = 9999;
//   setTimeout(() => {
//     typing.remove();
//     addChatMsg('bot', autoReplies[replyIdx % autoReplies.length]);
//     replyIdx++;
//   }, 1200);
// }

// ── NEWSLETTER ──
document.querySelector('.newsletter-form button').addEventListener('click', function() {
  const input = this.previousElementSibling;
  if (input.value && input.value.includes('@')) {
    input.value = '';
    input.placeholder = '✓ Subscribed! Thank you.';
    input.style.color = 'var(--blue)';
    setTimeout(() => { input.placeholder = 'Your email address'; input.style.color = ''; }, 3500);
  }
});

// ── ACTIVE NAV LINK ON SCROLL ──
const sections = document.querySelectorAll('section[id], div[id="partners"]');
const navLinks = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id ? 'var(--white)' : '';
      });
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => sectionObserver.observe(s));