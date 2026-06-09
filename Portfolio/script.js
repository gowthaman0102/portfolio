/* ============================================================
   PORTFOLIO SCRIPTS — Gowthaman S
   Premium interactions & animations
   ============================================================ */

'use strict';

/* ============================================================
   HELPERS
   ============================================================ */
const $ = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];

/* ============================================================
   NAVBAR — Scroll shrink + active section highlight
   ============================================================ */
(function initNavbar() {
    const navbar    = $('#navbar');
    const sections  = $$('section[id], div[id="stats-anchor"]');
    const navLinks  = $$('.nav-links a');

    // On scroll: add .scrolled class
    function onScroll() {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section highlight
        let current = '';
        sections.forEach(sec => {
            const top = sec.getBoundingClientRect().top;
            if (top <= 100) {
                current = sec.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

/* ============================================================
   MOBILE MENU — Hamburger toggle
   ============================================================ */
(function initMobileMenu() {
    const hamburger  = $('#hamburger');
    const mobileMenu = $('#mobileMenu');
    const mobLinks   = $$('.mob-link');

    if (!hamburger || !mobileMenu) return;

    function openMenu() {
        hamburger.classList.add('active');
        mobileMenu.style.display = 'flex';
        requestAnimationFrame(() => mobileMenu.classList.add('active'));
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        // Hide after transition
        mobileMenu.addEventListener('transitionend', () => {
            if (!mobileMenu.classList.contains('active')) {
                mobileMenu.style.display = '';
            }
        }, { once: true });
    }

    hamburger.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close on link click
    mobLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenu();
    });
})();

/* ============================================================
   SMOOTH SCROLL — Offset for fixed navbar height
   ============================================================ */
(function initSmoothScroll() {
    const OFFSET = 90; // navbar height + margin

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
})();

/* ============================================================
   INTERSECTION OBSERVER — Scroll reveal
   ============================================================ */
(function initScrollReveal() {
    const revealEls = $$('.reveal');
    const timelineItems = $$('.timeline-item');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => observer.observe(el));
    timelineItems.forEach(el => observer.observe(el));
})();

/* ============================================================
   TIMELINE TRACK FILL — fills gradient line on scroll
   ============================================================ */
(function initTimelineFill() {
    const fill    = $('#timelineFill');
    const wrapper = $('.timeline-wrapper');
    if (!fill || !wrapper) return;

    function updateFill() {
        const rect   = wrapper.getBoundingClientRect();
        const total  = rect.height;
        const visible = Math.max(0, Math.min(total, window.innerHeight - rect.top));
        const pct    = Math.max(0, Math.min(100, (visible / total) * 100));
        fill.style.height = pct + '%';
    }

    window.addEventListener('scroll', updateFill, { passive: true });
    updateFill();
})();

/* ============================================================
   STAT COUNTER — Count up animation
   ============================================================ */
(function initCounters() {
    const statValues = $$('.stat-value[data-count]');
    if (!statValues.length) return;

    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function animateCounter(el) {
        const target  = parseInt(el.dataset.count, 10);
        const suffix  = el.dataset.suffix || '';
        const duration = 1400;
        const start   = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const value    = Math.floor(easeOut(progress) * target);
            el.textContent = value + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + suffix;
            }
        }

        requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    statValues.forEach(el => observer.observe(el));
})();

/* ============================================================
   COPY EMAIL — with premium toast
   ============================================================ */
function copyEmail() {
    const email = 'gowthamanseenivasan0@gmail.com';
    const toast  = $('#toast');
    const toastMsg = $('#toastMsg');
    const copyBtn  = $('#copyEmailBtn');
    const btnText  = copyBtn ? copyBtn.querySelector('.btn-text') : null;

    navigator.clipboard.writeText(email)
        .then(() => {
            // Button feedback
            if (btnText) {
                btnText.textContent = 'Copied! ✓';
                copyBtn.style.borderColor = 'var(--green)';
                copyBtn.style.color = 'var(--green)';
            }

            // Show toast
            if (toast) {
                toastMsg.textContent = 'Email copied to clipboard!';
                toast.classList.add('show');
            }

            // Reset after 2.5s
            setTimeout(() => {
                if (btnText) {
                    btnText.textContent = 'Copy Email';
                    copyBtn.style.borderColor = '';
                    copyBtn.style.color = '';
                }
                if (toast) {
                    toast.classList.remove('show');
                }
            }, 2500);
        })
        .catch(err => {
            console.error('Failed to copy email:', err);
        });
}

// Expose to global scope for inline onclick
window.copyEmail = copyEmail;



/* ============================================================
   PROJECT CARD — 3D tilt on hover (desktop only)
   ============================================================ */
(function initCardTilt() {
    // Only on pointer-fine (desktop) devices
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cards = $$('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect   = card.getBoundingClientRect();
            const cx     = e.clientX - rect.left - rect.width / 2;
            const cy     = e.clientY - rect.top  - rect.height / 2;
            const rotX   = (cy / rect.height) * -6;
            const rotY   = (cx / rect.width)  *  6;

            card.style.transform = `
                translateY(-6px)
                perspective(600px)
                rotateX(${rotX}deg)
                rotateY(${rotY}deg)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();

/* ============================================================
   INITIAL RUN — ensure reveals near top fire immediately
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
    // Trigger any initially-visible elements
    document.dispatchEvent(new Event('scroll'));
});
