let heroAnimationsStarted = false;

function shouldRunHeroAnimations() {
    const hero = document.getElementById('hero');
    if (!hero) return false;

    const rect = hero.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.35 && rect.bottom >= 0;
}

function animateCounters() {
    if (!shouldRunHeroAnimations()) return;

    const hero = document.getElementById('hero');
    const counters = hero ? hero.querySelectorAll('.stat-number') : [];
    if (!counters.length) return;

    counters.forEach((counter) => {
        const target = parseInt(counter.dataset.target || counter.dataset.count || '0', 10);
        const suffix = target > 1 ? '+' : '';
        let current = 0;

        const duration = 3000;
        const startTime = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            current = Math.round(target * eased);
            counter.textContent = `${current}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                counter.textContent = `${target}${suffix}`;
            }
        };

        requestAnimationFrame(tick);
    });
}

function initTypingEffect() {
    if (!shouldRunHeroAnimations()) return;

    const hero = document.getElementById('hero');
    const el = hero ? hero.querySelector('.typing-text') : null;
    if (!el) return;

    const titles = ['Full Stack Apps', 'Clean Web UIs', 'Digital Products'];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeSpeed = 180;
    const eraseSpeed = 120;
    const pauseTime = 1800;

    const typeLoop = () => {
        const currentTitle = titles[titleIndex];

        if (!isDeleting) {
            el.textContent = currentTitle.slice(0, ++charIndex);

            if (charIndex === currentTitle.length) {
                isDeleting = true;
                setTimeout(typeLoop, pauseTime);
                return;
            }
        } else {
            el.textContent = currentTitle.slice(0, --charIndex);

            if (charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
            }
        }

        setTimeout(typeLoop, isDeleting ? eraseSpeed : typeSpeed);
    };

    typeLoop();
}

function startHeroAnimations() {
    if (heroAnimationsStarted || !shouldRunHeroAnimations()) return;

    heroAnimationsStarted = true;
    animateCounters();
    initTypingEffect();
}

function initGlassCardGlow() {
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach((card) => {
        const updateGlow = (event) => {
            const rect = card.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;

            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        };

        card.addEventListener('mousemove', updateGlow);
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        });
    });
}

function initSkillBarAnimation() {
    const skillsSection = document.getElementById('skills');
    const bars = skillsSection ? skillsSection.querySelectorAll('.skill-bar-fill') : [];

    if (!skillsSection || !bars.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            bars.forEach((bar, index) => {
                const percentage = bar.dataset.percentage || '0%';
                setTimeout(() => {
                    bar.style.width = percentage;
                }, index * 100);
            });

            obs.disconnect();
        });
    }, { threshold: 0.3 });

    observer.observe(skillsSection);
}
