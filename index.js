/* ══════════════════════════════════════════════
   TOPWAY MIDIYA — index.js
   Fully working: Dark Mode, Carousel, Reveal,
   Filter Tabs, Counter Animation, EmailJS, Toast
   ══════════════════════════════════════════════ */

/* ── EmailJS Configuration ──────────────────────
   Replace the three values below with your own:
   1. Go to https://emailjs.com → free account
   2. Add Email Service → copy Service ID
   3. Create Template with vars:
      {{from_name}} {{from_email}} {{contactNo}} {{subject}} {{message}}
      Set "To" = your receiving email
   4. Copy Template ID and Public Key
*/
const EJS_PUBLIC_KEY  = "3nGejaKiNsz8i9-lq";   // your EmailJS public key
const EJS_SERVICE_ID  = "service_gg5tkx7";       // your service ID
const EJS_TEMPLATE_ID = "template_35g6phz";      // your template ID
const RECIPIENT_EMAIL = "gsmagar076@gmail.com";     // fallback mailto recipient

/* ══════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initCursorGlow();
  initDarkMode();
  initNavbar();
  initMobileMenu();
  initCarousel();
  initScrollReveal();
  initServiceFilter();
  initScrollTop();
  sendMail();
  initCounters();
  initFooterYear();
  initSmoothScroll();
});

/* ══════════════════════════════════════════════
   1. CURSOR GLOW
   ══════════════════════════════════════════════ */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(hover: none)').matches) return;
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

/* ══════════════════════════════════════════════
   2. DARK MODE
   ══════════════════════════════════════════════ */
function initDarkMode() {
  const html         = document.documentElement;
  const darkToggle   = document.getElementById('darkToggle');
  const mobToggle    = document.getElementById('mobDarkToggle');

  function setTheme(dark) {
    html.setAttribute('data-theme', dark ? 'dark' : 'light');
    const icon = dark ? 'fa-sun' : 'fa-moon';
    if (darkToggle)  darkToggle.innerHTML  = `<i class="fas ${icon}"></i>`;
    if (mobToggle)   mobToggle.innerHTML   = `<i class="fas ${icon}"></i>`;
    try { localStorage.setItem('topway-theme', dark ? 'dark' : 'light'); } catch(e) {}
  }

  // Read saved or system preference
  let saved = null;
  try { saved = localStorage.getItem('topway-theme'); } catch(e) {}
  if (saved) {
    setTheme(saved === 'dark');
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme(true);
  }

  function toggle() {
    setTheme(html.getAttribute('data-theme') !== 'dark');
  }
  if (darkToggle)  darkToggle.addEventListener('click',  toggle);
  if (mobToggle)   mobToggle.addEventListener('click',   toggle);
}

/* ══════════════════════════════════════════════
   3. NAVBAR SCROLL
   ══════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 80);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ══════════════════════════════════════════════
   4. MOBILE MENU
   ══════════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const overlay     = document.getElementById('menuOverlay');
  if (!hamburger || !mobileMenu) return;

  window.openMobile = function() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeMobile = function() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () =>
    mobileMenu.classList.contains('open') ? closeMobile() : openMobile()
  );
  if (overlay) overlay.addEventListener('click', closeMobile);
}

/* ══════════════════════════════════════════════
   5. HERO CAROUSEL
   ══════════════════════════════════════════════ */
function initCarousel() {
  const track   = document.getElementById('carouselTrack');
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  if (!track || !dotsWrap) return;

  const TOTAL = track.children.length;
  let cur = 0;
  let autoInt = null;
  let touchStart = 0;

  // Build dots
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsWrap.appendChild(dot);
  }

  function goTo(n) {
    cur = ((n % TOTAL) + TOTAL) % TOTAL;
    track.style.transform = `translateX(-${cur * (100 / TOTAL)}%)`;
    document.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === cur)
    );
  }

  function resetAuto() {
    clearInterval(autoInt);
    autoInt = setInterval(() => goTo(cur + 1), 5500);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(cur - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(cur + 1); resetAuto(); });

  // Touch support
  track.addEventListener('touchstart', e => {
    touchStart = e.changedTouches[0].screenX;
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStart - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? cur + 1 : cur - 1); resetAuto(); }
  }, { passive: true });

  // Keyboard support
  document.addEventListener('keydown', e => {
    const section = document.getElementById('home');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.top > 100 || rect.bottom < 0) return;
    if (e.key === 'ArrowLeft')  { goTo(cur - 1); resetAuto(); }
    if (e.key === 'ArrowRight') { goTo(cur + 1); resetAuto(); }
  });

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoInt));
  track.addEventListener('mouseleave', resetAuto);

  resetAuto();
}

/* ══════════════════════════════════════════════
   6. SCROLL REVEAL
   ══════════════════════════════════════════════ */
function initScrollReveal() {
  const cards = new Set(['service-card', 'portfolio-item', 'team-card', 'stat-box']);

  const isCard = el => [...el.classList].some(c => cards.has(c));

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (isCard(el)) {
        const siblings = [...el.parentNode.children].filter(c => isCard(c));
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = (idx * 0.09) + 's';
      } else {
        el.style.transitionDelay = '';
      }
      el.classList.add('visible');
      obs.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════
   7. SERVICE FILTER TABS
   ══════════════════════════════════════════════ */
function initServiceFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.service-card');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;

      let visibleIdx = 0;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.style.display = '';
          // Re-trigger animation
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = `cardIn 0.5s ease ${visibleIdx * 0.08}s both`;
          visibleIdx++;
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ══════════════════════════════════════════════
   8. SCROLL TO TOP
   ══════════════════════════════════════════════ */
function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  window.addEventListener('scroll', () =>
    btn.classList.toggle('visible', window.scrollY > 500), { passive: true }
  );
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ══════════════════════════════════════════════
   9. COUNTER ANIMATION
   ══════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const start = performance.now();
    const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(ease(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════
   10. FOOTER YEAR
   ══════════════════════════════════════════════ */
function initFooterYear() {
  const el = document.getElementById('fyear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ══════════════════════════════════════════════
   11. SMOOTH SCROLL (anchor links)
   ══════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ══════════════════════════════════════════════
   12. TOAST
   ══════════════════════════════════════════════ */
let toastTimeout = null;
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  const icon = toast.querySelector('.toast-icon');
  const msg  = toast.querySelector('.toast-msg');

  if (icon) icon.className = `toast-icon fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}`;
  if (msg)  msg.textContent = message;

  toast.classList.toggle('error', isError);
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 4500);
}

/* ══════════════════════════════════════════════
   13. CONTACT FORM — Validation + EmailJS
   ══════════════════════════════════════════════ */
function sendMail() {
  const sendBtn = document.getElementById('sendBtn');
  if (!sendBtn) return;

  // Field refs
  const fields = {
    name:    { el: () => document.getElementById('fname') },
    contact: { el: () => document.getElementById('fcontact')},
    email:   { el: () => document.getElementById('femail')},
    subject: { el: () => document.getElementById('fsubject')},
    message: { el: () => document.getElementById('fmessage')},
  };

  // Inline validation on blur
  Object.values(fields).forEach(({ el, err, label }) => {
    const input = el();
    if (!input) return;
    input.addEventListener('blur', () => validateField(input, err, label));
    input.addEventListener('input', () => clearError(err));
  });

  function validateField(input, errId, label) {
    const val = input.value.trim();
    const errEl = document.getElementById(errId);
    if (!errEl) return true;

    if (!val) {
      errEl.textContent = `${label} is required.`;
      input.style.borderColor = '#c03030';
      return false;
    }
    if (errId === 'err-femail' && !/^\S+@\S+\.\S+$/.test(val)) {
      errEl.textContent = 'Please enter a valid email address.';
      input.style.borderColor = '#c03030';
      return false;
    }
    if (errId === 'err-fcontact' && !/^\+?[\d\s\-]{7,15}$/.test(val)) {
      errEl.textContent = 'Please enter a valid phone number.';
      input.style.borderColor = '#c03030';
      return false;
    }
    errEl.textContent = '';
    input.style.borderColor = '';
    return true;
  }

  function clearError(errId) {
    const errEl = document.getElementById(errId);
    if (errEl) errEl.textContent = '';
  }

  function validateAll() {
    let valid = true;
    Object.entries(fields).forEach(([, { el, err, label }]) => {
      const input = el();
      if (input && !validateField(input, err, label)) valid = false;
    });
    return valid;
  }

  function setBtnLoading(loading) {
    const textEl    = sendBtn.querySelector('.btn-text');
    const loadingEl = sendBtn.querySelector('.btn-loading');
    sendBtn.disabled = loading;
    if (textEl)    textEl.style.display    = loading ? 'none' : '';
    if (loadingEl) loadingEl.style.display = loading ? '' : 'none';
  }

  function clearForm() {
    Object.values(fields).forEach(({ el }) => { const input = el(); if (input) input.value = ''; });
    Object.values(fields).forEach(({ err }) => clearError(err));
  }

  sendBtn.addEventListener('click', async () => {
    if (!validateAll()) {
      showToast('Please fill in all fields correctly.', true);
      return;
    }

    const name      = fields.name.el().value.trim();
    const email     = fields.email.el().value.trim();
    const subject   = fields.subject.el().value.trim();
    const message   = fields.message.el().value.trim();
    const contactNo = fields.contact.el().value.trim();

    setBtnLoading(true);
    let params= {
        name:  name,
        email: email,
        subject: subject,
        message: message,
        to_email:   RECIPIENT_EMAIL,
        contactNo:contactNo,
    };
    try {
        await emailjs.send(EJS_SERVICE_ID, EJS_TEMPLATE_ID,params);
        console.log("EmailJS success "+JSON.stringify(params));
        clearForm();
        showToast('✅ Message sent! We\'ll get back to you soon.', false);
    } catch (err) {
      console.error('EmailJS error: ', err);
      // Fallback: open native mail client
      const mailtoLink = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nContact: ${contactNo}\n\nMessage:\n${message}`
      )}`;
      window.location.href = mailtoLink;

      showToast('📧 Opening your mail app as fallback.', false);
    } finally {
      setBtnLoading(false);
    }
  });

  // Allow Enter key in inputs to submit (except textarea)
  Object.values(fields).forEach(({ el }) => {
    const input = el();
    if (!input || input.tagName === 'TEXTAREA') return;
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') sendBtn.click();
    });
  });
}

/* ══════════════════════════════════════════════
   14. SERVICE CARD ANIMATION (CSS keyframe inject)
   ══════════════════════════════════════════════ */
(function injectCardAnim() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes cardIn {
      from { opacity: 0; transform: scale(0.92) translateY(20px); }
      to   { opacity: 1; transform: none; }
    }
  `;
  document.head.appendChild(style);
})();