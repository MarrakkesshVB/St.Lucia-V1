document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Icons
    lucide.createIcons();

    // 2. Prefers Reduced Motion Check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 3. Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.getAttribute('data-delay') || 0;
                if (!prefersReducedMotion) {
                    setTimeout(() => {
                        el.classList.add('active');
                    }, parseFloat(delay) * 1000);
                } else {
                    el.classList.add('active');
                }
                observer.unobserve(el);
            }
        });
    }, { rootMargin: "-50px" });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Animated Counters
    const counterElements = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const targetValue = parseInt(el.getAttribute('data-value'), 10);
                const suffix = el.getAttribute('data-suffix') || '';

                if (prefersReducedMotion) {
                    el.textContent = targetValue + suffix;
                } else {
                    let startTimestamp = null;
                    const duration = 2000;
                    const step = (timestamp) => {
                        if (!startTimestamp) startTimestamp = timestamp;
                        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                        const easeProgress = 1 - Math.pow(1 - progress, 4);
                        const current = Math.floor(easeProgress * targetValue);
                        el.textContent = current + suffix;
                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        } else {
                            el.textContent = targetValue + suffix;
                        }
                    };
                    window.requestAnimationFrame(step);
                }
                observer.unobserve(el);
            }
        });
    }, { rootMargin: "-50px" });

    counterElements.forEach(el => counterObserver.observe(el));

    // 5. Form Submission Mailto
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const origin = document.getElementById('origin').value;
            const destination = document.getElementById('destination').value;
            const cargoType = document.getElementById('cargoType').value;
            const weight = document.getElementById('weight').value;

            const subject = encodeURIComponent("Quote Request");
            const bodyText = `Origin: ${origin}\nDestination: ${destination}\nType: ${cargoType}\nWeight: ${weight} kg`;
            const body = encodeURIComponent(bodyText);
            window.location.href = `mailto:ingrid@stluciaexpress.com?subject=${subject}&body=${body}`;
        });
    }

    // 6. Parallax effect for hero background
    const heroBg = document.getElementById('hero-bg');
    if (heroBg && !prefersReducedMotion) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < 1000) {
                const yPos = (scrollY / 1000) * 300;
                heroBg.style.transform = `translateY(${yPos}px)`;
            }
        });
    }

    // 7. Mobile menu
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
        mobileMenu.querySelectorAll('a').forEach(a =>
            a.addEventListener('click', () => mobileMenu.classList.add('hidden')));
    }

    // 8. Dynamic year
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});
