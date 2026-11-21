/**
 * PhysioElite — Premium Physiotherapy & Rehabilitation
 * main.js — Core UI interactions, animations & form handling
 */

'use strict';

(function setPageName() {
  const page = (location.pathname.split('/').pop() || 'home1.html');
  if (document.body) document.body.dataset.page = page;
  else document.addEventListener('DOMContentLoaded', () => { document.body.dataset.page = page; });
})();

/* ============================================================
   1. THEME TOGGLE (Dark / Light Mode)
   ============================================================ */
(function initTheme() {
  const saved = localStorage.getItem('physioTheme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      updateThemeIcon(btn, saved);
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('physioTheme', next);
        document.querySelectorAll('[data-theme-toggle]').forEach(b => updateThemeIcon(b, next));
      });
    });
  });

  function updateThemeIcon(btn, theme) {
    const icon = btn.querySelector('i');
    if (!icon) return;
    if (theme === 'dark') {
      icon.className = icon.className.replace('fa-moon', 'fa-sun');
    } else {
      icon.className = icon.className.replace('fa-sun', 'fa-moon');
    }
  }
})();

/* ============================================================
   2. RTL (RIGHT-TO-LEFT) DIRECTION SUPPORT
   ============================================================ */
function setDirection(dir, persist) {
  const html = document.documentElement;
  const normalized = dir === 'rtl' ? 'rtl' : 'ltr';

  html.setAttribute('dir', normalized);
  html.classList.toggle('rtl', normalized === 'rtl');

  if (persist) localStorage.setItem('physioDir', normalized);

  document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
    const isRTL = normalized === 'rtl';
    btn.setAttribute('aria-pressed', String(isRTL));
    btn.setAttribute('aria-label', isRTL ? 'Switch to left-to-right layout' : 'Switch to right-to-left layout');
    btn.setAttribute('title', isRTL ? 'Switch to LTR' : 'Switch to RTL');
    const label = btn.querySelector('.rtl-toggle-text');
    if (label) label.textContent = 'RTL';
  });

  document.dispatchEvent(new CustomEvent('directionchange', { detail: { dir: normalized } }));
}

function toggleRTL() {
  setDirection(document.documentElement.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl', true);
}

function createRTLToggle(extraClass) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'rtl-toggle' + (extraClass ? ' ' + extraClass : '');
  btn.setAttribute('data-rtl-toggle', '');
  btn.innerHTML = '<span class="rtl-toggle-text" aria-hidden="true">RTL</span>';
  btn.addEventListener('click', toggleRTL);
  return btn;
}

(function initRTL() {
  const saved = localStorage.getItem('physioDir') || 'ltr';
  setDirection(saved, false);

  const injectToggle = () => {
    const themeToggles = document.querySelectorAll('[data-theme-toggle]');

    if (themeToggles.length) {
      themeToggles.forEach(toggle => {
        if (toggle.parentNode.querySelector('[data-rtl-toggle]')) return;

        let displayClass = '';
        if (toggle.classList.contains('d-none')) displayClass = 'd-none d-lg-flex';
        else if (toggle.classList.contains('d-lg-none')) displayClass = 'd-lg-none';

        toggle.insertAdjacentElement('afterend', createRTLToggle(displayClass));
      });
    } else if (!document.querySelector('.rtl-toggle--fixed')) {
      const topbarActions = document.querySelector('.topbar-actions, .topbar-right');
      if (topbarActions) topbarActions.appendChild(createRTLToggle());
      else document.body.appendChild(createRTLToggle('rtl-toggle--fixed'));
    }

    setDirection(document.documentElement.getAttribute('dir') || 'ltr', false);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectToggle);
  } else {
    injectToggle();
  }
})();

/* ============================================================
   3. STICKY NAVBAR
   ============================================================ */
function initStickyNavbar() {
  const navbar = document.querySelector('.navbar, .physio-navbar');
  if (!navbar) return;
  const handler = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

/* Active link highlighting for the shared navbar */
function initNavActiveLink() {
  const links = document.querySelectorAll('#mainNav .nav-link-custom');
  if (!links.length) return;
  const current = window.location.pathname.split('/').pop() || 'home1.html';
  const aliases = { 'blog-details.html': 'blog.html', 'service-details.html': 'services.html' };
  const active = aliases[current] || current;
  links.forEach(link => {
    const isActive = link.getAttribute('href') === active;
    link.classList.toggle('active-link', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

/* ============================================================
   4. MOBILE HAMBURGER MENU
   ============================================================ */
function initMobileMenu() {
  const hamburger = document.querySelector('[data-mobile-toggle], .navbar-toggler-custom');
  const mobileNav = document.querySelector('.mobile-nav, .offcanvas-nav');
  const overlay = document.querySelector('.mobile-nav-overlay, .offcanvas-backdrop-custom');
  if (!hamburger) return;

  const open = () => {
    mobileNav && mobileNav.classList.add('open');
    overlay && overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    mobileNav && mobileNav.classList.remove('open');
    overlay && overlay.classList.remove('visible');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav && mobileNav.classList.contains('open');
    isOpen ? close() : open();
  });
  overlay && overlay.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}

/* ============================================================
   5. SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('revealed'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-on-scroll').forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 0.1 + 's';
    observer.observe(el);
  });
}

/* ============================================================
   6. SMOOTH SCROLL TO ANCHORS
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = document.querySelector('.navbar, .physio-navbar')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   7. FAQ / ACCORDION (custom, supplements Bootstrap)
   ============================================================ */
function initFAQAccordion() {
  document.querySelectorAll('.faq-question, [data-faq-trigger]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item, [data-faq-item]');
      const answer = item && item.querySelector('.faq-answer, [data-faq-answer]');
      if (!answer) return;
      const isOpen = item.classList.contains('active');

      // Close all siblings
      const container = item.closest('.faq-list, [data-faq-container]');
      if (container) {
        container.querySelectorAll('.faq-item.active, [data-faq-item].active').forEach(sibling => {
          if (sibling !== item) {
            sibling.classList.remove('active');
            const a = sibling.querySelector('.faq-answer, [data-faq-answer]');
            if (a) { a.style.maxHeight = '0'; a.style.opacity = '0'; }
            const sibBtn = sibling.querySelector('.faq-question, [data-faq-trigger]');
            if (sibBtn) sibBtn.setAttribute('aria-expanded', 'false');
          }
        });
      }

      if (isOpen) {
        item.classList.remove('active');
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 32 + 'px';
        answer.style.opacity = '1';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ============================================================
   8. FORM VALIDATION
   ============================================================ */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone) {
  return /^[\d\s\+\-\(\)]{7,20}$/.test(phone.trim());
}

function markInvalid(field, message) {
  field.classList.add('is-invalid');
  field.classList.remove('is-valid');
  let feedback = field.nextElementSibling;
  if (!feedback || !feedback.classList.contains('invalid-feedback')) {
    feedback = document.createElement('div');
    feedback.className = 'invalid-feedback';
    field.parentNode.insertBefore(feedback, field.nextSibling);
  }
  feedback.textContent = message || 'This field is required.';
}

function markValid(field) {
  field.classList.remove('is-invalid');
  field.classList.add('is-valid');
  const feedback = field.nextElementSibling;
  if (feedback && feedback.classList.contains('invalid-feedback')) {
    feedback.textContent = '';
  }
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const val = field.value.trim();
    if (!val) {
      markInvalid(field, 'This field is required.');
      valid = false;
    } else if (field.type === 'email' && !isValidEmail(val)) {
      markInvalid(field, 'Please enter a valid email address.');
      valid = false;
    } else if (field.type === 'tel' && !isValidPhone(val)) {
      markInvalid(field, 'Please enter a valid phone number.');
      valid = false;
    } else {
      markValid(field);
    }
  });
  return valid;
}

function initFormValidation() {
  document.querySelectorAll('form[data-validate]').forEach(form => {
    // Real-time field validation
    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', () => {
        if (field.hasAttribute('required') && !field.value.trim()) {
          markInvalid(field);
        } else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
          markInvalid(field, 'Please enter a valid email address.');
        } else if (field.value.trim()) {
          markValid(field);
        }
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (validateForm(form)) {
        const btn = form.querySelector('[type="submit"]');
        if (btn) {
          const originalText = btn.innerHTML;
          btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending…';
          btn.disabled = true;
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            showToast('Message sent successfully! We\'ll be in touch soon.', 'success');
            form.reset();
            form.querySelectorAll('.is-valid').forEach(f => f.classList.remove('is-valid'));
          }, 1800);
        }
      } else {
        showToast('Please fix the errors above before submitting.', 'error');
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  });
}

/* ============================================================
   9. TOAST NOTIFICATION SYSTEM
   ============================================================ */
function showToast(message, type = 'success', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;';
    document.body.appendChild(container);
  }

  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
  const colors = { success: '#8FAE9B', error: '#e74c3c', info: '#6B9C9A', warning: '#f39c12' };

  const toast = document.createElement('div');
  toast.style.cssText = `background:#fff;border-left:4px solid ${colors[type] || colors.success};border-radius:10px;padding:14px 18px;box-shadow:0 8px 32px rgba(0,0,0,.12);display:flex;align-items:center;gap:12px;min-width:280px;max-width:380px;animation:slideInRight .3s ease;font-family:'DM Sans',sans-serif;font-size:.9rem;color:#303A38;`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.success}" style="color:${colors[type] || colors.success};font-size:1.1rem;flex-shrink:0;"></i><span style="flex:1;">${message}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;color:#999;padding:0 0 0 8px;font-size:1.1rem;" aria-label="Close">×</button>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOutRight .3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ============================================================
   10. TAB SWITCHING (Generic)
   ============================================================ */
function initTabs(containerSelector) {
  document.querySelectorAll(containerSelector || '[data-tabs]').forEach(container => {
    const triggers = container.querySelectorAll('[data-tab]');
    const panels = container.querySelectorAll('[data-tab-panel]');

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const target = trigger.dataset.tab;

        triggers.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(p => {
          p.style.display = p.dataset.tabPanel === target ? 'block' : 'none';
          p.setAttribute('aria-hidden', p.dataset.tabPanel !== target);
        });

        trigger.classList.add('active');
        trigger.setAttribute('aria-selected', 'true');
      });
    });

    // Activate first by default
    if (triggers.length > 0 && !container.querySelector('[data-tab].active')) {
      triggers[0].click();
    }
  });
}

/* ============================================================
   11. SERVICE / BLOG FILTER
   ============================================================ */
function initServiceFilter() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      document.querySelectorAll('[data-category]').forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter || card.dataset.category.includes(filter);
        card.style.display = show ? '' : 'none';
        card.style.animation = show ? 'fadeIn .4s ease' : '';
      });
    });
  });
}

/* ============================================================
   12. ANIMATED COUNTERS
   ============================================================ */
function initCounters() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count || el.textContent.replace(/\D/g, ''), 10);
      const suffix = el.dataset.suffix || (el.textContent.match(/[^\d]+$/) || [''])[0];
      const prefix = el.dataset.prefix || '';
      const duration = parseInt(el.dataset.duration || '1800', 10);
      let start = null;

      function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.floor(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

/* ============================================================
   13. COUNTDOWN TIMER (Coming Soon page)
   ============================================================ */
function initCountdown(targetDateStr, selectors) {
  const target = new Date(targetDateStr || '2025-01-01T00:00:00').getTime();
  const sel = selectors || { days: '#cd-days', hours: '#cd-hours', minutes: '#cd-minutes', seconds: '#cd-seconds' };

  function update() {
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      Object.values(sel).forEach(s => { const el = document.querySelector(s); if (el) el.textContent = '00'; });
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');

    const setEl = (key, val) => { const el = document.querySelector(sel[key]); if (el) el.textContent = key === 'days' ? d : pad(val); };
    setEl('days', d);
    setEl('hours', h);
    setEl('minutes', m);
    setEl('seconds', s);
  }

  update();
  setInterval(update, 1000);
}

/* ============================================================
   14. READING PROGRESS BAR (Blog Details)
   ============================================================ */
function initReadingProgress() {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
}

/* ============================================================
   15. MULTI-STEP FORM (Registration)
   ============================================================ */
function initMultiStepForm() {
  const forms = document.querySelectorAll('[data-multistep]');
  forms.forEach(form => {
    const steps = form.querySelectorAll('[data-step]');
    const indicators = form.querySelectorAll('[data-step-indicator]');
    let current = 0;

    function showStep(n) {
      steps.forEach((s, i) => {
        s.style.display = i === n ? 'block' : 'none';
        s.setAttribute('aria-hidden', i !== n);
      });
      indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === n);
        ind.classList.toggle('completed', i < n);
      });
      current = n;
    }

    form.querySelectorAll('[data-step-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        const currentStep = steps[current];
        const fieldsOk = validateForm({ querySelectorAll: sel => currentStep.querySelectorAll(sel) });
        if (fieldsOk !== false) showStep(Math.min(current + 1, steps.length - 1));
      });
    });

    form.querySelectorAll('[data-step-back]').forEach(btn => {
      btn.addEventListener('click', () => showStep(Math.max(current - 1, 0)));
    });

    showStep(0);
  });
}

/* ============================================================
   16. PASSWORD STRENGTH INDICATOR
   ============================================================ */
function checkPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { label: 'Weak', color: '#e74c3c', pct: 25 };
  if (score <= 2) return { label: 'Fair', color: '#f39c12', pct: 50 };
  if (score <= 3) return { label: 'Good', color: '#6B9C9A', pct: 75 };
  return { label: 'Strong', color: '#8FAE9B', pct: 100 };
}

function initPasswordStrength() {
  document.querySelectorAll('[data-password-strength]').forEach(input => {
    const targetId = input.dataset.passwordStrength;
    const bar = document.getElementById(targetId + '-bar');
    const label = document.getElementById(targetId + '-label');

    input.addEventListener('input', () => {
      const result = checkPasswordStrength(input.value);
      if (bar) { bar.style.width = result.pct + '%'; bar.style.backgroundColor = result.color; }
      if (label) { label.textContent = result.label; label.style.color = result.color; }
    });
  });

  // Confirm password match
  document.querySelectorAll('[data-match-target]').forEach(input => {
    input.addEventListener('input', () => {
      const targetInput = document.querySelector(input.dataset.matchTarget);
      if (!targetInput) return;
      if (input.value && input.value !== targetInput.value) {
        markInvalid(input, 'Passwords do not match.');
      } else if (input.value) {
        markValid(input);
      }
    });
  });
}

/* ============================================================
   17. DASHBOARD SIDEBAR NAVIGATION
   ============================================================ */
function initDashboardNav() {
  const navLinks = document.querySelectorAll('[data-panel-link]');
  const panels = document.querySelectorAll('[data-panel]');
  if (!navLinks.length) return;

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.dataset.panelLink;

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      panels.forEach(panel => {
        panel.style.display = panel.dataset.panel === target ? 'block' : 'none';
      });

      // Close mobile sidebar if open
      const sidebar = document.querySelector('.sidebar, .dashboard-sidebar');
      if (sidebar && window.innerWidth < 992) {
        sidebar.classList.remove('open');
        document.querySelector('.sidebar-overlay')?.classList.remove('visible');
        document.body.style.overflow = '';
      }

      // Update page title
      const pageTitle = document.getElementById('page-title');
      if (pageTitle) pageTitle.textContent = link.textContent.trim();
    });
  });

  // Mobile sidebar toggle for dashboards
  const sidebarToggle = document.querySelector('[data-sidebar-toggle]');
  const sidebar = document.querySelector('.dashboard-sidebar, .sidebar');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarOverlay?.classList.toggle('visible');
      document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    });
    sidebarOverlay?.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('visible');
      document.body.style.overflow = '';
    });
  }
}

/* ============================================================
   18. APPOINTMENT BOOKING UI
   ============================================================ */
function initBookingWidget() {
  // Time slot selection (pill toggle)
  document.querySelectorAll('[data-time-slot]').forEach(slot => {
    slot.addEventListener('click', () => {
      const group = slot.closest('[data-slot-group]');
      if (group) group.querySelectorAll('[data-time-slot]').forEach(s => s.classList.remove('selected', 'btn-sage'));
      slot.classList.add('selected', 'btn-sage');
    });
  });

  // Minimum date = today
  document.querySelectorAll('input[type="date"]').forEach(input => {
    if (!input.min) input.min = new Date().toISOString().split('T')[0];
  });
}

/* ============================================================
   19. NAVBAR LOGIN / DROPDOWN
   ============================================================ */
function initNavDropdowns() {
  document.querySelectorAll('[data-dropdown-trigger]').forEach(trigger => {
    const dropdown = document.getElementById(trigger.dataset.dropdownTrigger) || trigger.nextElementSibling;
    if (!dropdown) return;
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', () => dropdown.classList.remove('open'));
  });
}

/* ============================================================
   20. TOAST CSS KEYFRAMES (injected once)
   ============================================================ */
(function injectToastStyles() {
  if (document.getElementById('physio-toast-styles')) return;
  const style = document.createElement('style');
  style.id = 'physio-toast-styles';
  style.textContent = `
    @keyframes slideInRight { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(120%); opacity: 0; } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   INIT ALL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initStickyNavbar();
  initNavActiveLink();
  initMobileMenu();
  initScrollReveal();
  initSmoothScroll();
  initFAQAccordion();
  initFormValidation();
  initTabs();
  initServiceFilter();
  initCounters();
  initBookingWidget();
  initDashboardNav();
  initNavDropdowns();
  initPasswordStrength();
  initMultiStepForm();
  initReadingProgress();

  // Countdown — only on coming-soon page
  if (document.getElementById('cd-days')) {
    initCountdown('2025-01-01T00:00:00');
  }

  // Activate first tab in each tabbed container
  document.querySelectorAll('[data-tabs]').forEach(container => {
    const firstTrigger = container.querySelector('[data-tab]');
    if (firstTrigger) firstTrigger.click();
  });
});
