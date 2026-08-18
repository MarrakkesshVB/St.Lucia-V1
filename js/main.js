document.addEventListener("DOMContentLoaded", () => {
    // 0. Reload / F5 => siempre al tope
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    let tries = 0;
    (function top(){
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (++tries < 20) setTimeout(top, 50);
    })();
    window.addEventListener('load', () => window.scrollTo({ top: 0, behavior: 'instant' }));
    window.addEventListener('pageshow', e => { if (e.persisted) window.scrollTo({ top: 0, behavior: 'instant' }); });

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

    // 5. Form Submission Web3Forms
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        const submitBtn = document.getElementById('submit-btn');
        const btnText = document.getElementById('btn-text');
        const btnIcon = document.getElementById('btn-icon');
        
        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Honeypot check (anti-spam)
            const formData = new FormData(quoteForm);
            if (formData.get('bot-field')) return;
            formData.delete('bot-field');
            
            // UI: loading state
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            btnIcon.style.display = 'none';
            
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    btnText.textContent = 'Quote sent!';
                    submitBtn.classList.add('bg-green-500', 'hover:bg-green-500');
                    quoteForm.reset();
                    
                    setTimeout(() => {
                        btnText.textContent = 'Request Rate';
                        btnIcon.style.display = 'inline-block';
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('bg-green-500', 'hover:bg-green-500');
                        lucide.createIcons();
                    }, 3000);
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            } catch (error) {
                btnText.textContent = 'Error — try again';
                submitBtn.disabled = false;
                btnIcon.style.display = 'inline-block';
                lucide.createIcons();
                console.error('Form submission error:', error);
            }
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

    // 9. Border beam: haz cónico que recorre el borde (hover = acelera)
    document.querySelectorAll('.beam-card').forEach(card => {
        let a = Math.random() * 360, sp = 60, tg = 60, last = performance.now();
        const tick = t => {
            const dt = Math.min((t - last) / 1000, 0.05); last = t;
            sp += (tg - sp) * 0.08;
            a = (a + sp * dt) % 360;
            card.style.setProperty('--beam-a', a.toFixed(2) + 'deg');
            requestAnimationFrame(tick);
        };
        card.addEventListener('mouseenter', () => tg = 320);
        card.addEventListener('mouseleave', () => tg = 60);
        requestAnimationFrame(tick);
    });
});
