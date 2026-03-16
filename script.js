document.addEventListener('DOMContentLoaded', () => {
    // Scroll reveal animation
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        reveals.forEach((reveal) => {
            const revealTop = reveal.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });

        // Hide scroll indicator when scrolled down
        const indicator = document.querySelector('.scroll-indicator');
        if (indicator) {
            if (window.scrollY > 100) {
                indicator.style.opacity = '0';
                indicator.style.pointerEvents = 'none';
            } else {
                indicator.style.opacity = '1';
                indicator.style.pointerEvents = 'auto';
            }
        }

        // Liquid Navbar effect
        const nav = document.querySelector('.custom-nav');
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    };

    // Initial check and scroll event listener
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);

    // Custom Cursor Logic
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animateCursors = () => {
        // Liquid cursor (primary) follows mouse smoothly
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.transform = `translate(${cursorX - 12.5}px, ${cursorY - 12.5}px)`;

        // Small dot (follower) follows the liquid cursor with more lag
        followerX += (cursorX - followerX) * 0.2;
        followerY += (cursorY - followerY) * 0.2;
        follower.style.transform = `translate(${followerX - 3}px, ${followerY - 3}px)`;

        requestAnimationFrame(animateCursors);
    };
    animateCursors();

    // Intersection Observer to optimize Spline Performance
    const splineObserverOptions = {
        root: null,
        threshold: 0.01 // Trigger as soon as even 1% is visible
    };

    const splineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const viewer = entry.target.querySelector('spline-viewer');
            if (viewer) {
                if (entry.isIntersecting) {
                    // In viewport: let it render
                    viewer.style.visibility = 'visible';
                    viewer.style.pointerEvents = 'auto';
                } else {
                    // Out of viewport: hide it to stop engine loops
                    viewer.style.visibility = 'hidden';
                    viewer.style.pointerEvents = 'none';
                }
            }
        });
    }, splineObserverOptions);

    const heroTarget = document.getElementById('hero-section');
    const robotTarget = document.getElementById('robot-container');
    if (heroTarget) splineObserver.observe(heroTarget);
    if (robotTarget) splineObserver.observe(robotTarget);

    // Aggressive Spline Logo Removal... (rest of the code)
    const forceRemoveLogo = () => {
        const viewers = document.querySelectorAll('spline-viewer');
        viewers.forEach(viewer => {
            if (viewer.shadowRoot) {
                // Method 1: Injecting CSS into the shadow DOM (Most persistent)
                if (!viewer.shadowRoot.querySelector('#hide-spline-css')) {
                    const style = document.createElement('style');
                    style.id = 'hide-spline-css';
                    style.textContent = `
                        #logo, .spline-watermark, a[href*="spline.design"] {
                            display: none !important;
                            visibility: hidden !important;
                            opacity: 0 !important;
                            pointer-events: none !important;
                        }
                    `;
                    viewer.shadowRoot.appendChild(style);
                }

                // Method 2: Direct manipulation as fallback
                const logo = viewer.shadowRoot.getElementById('logo');
                if (logo) logo.style.display = 'none';
            }
        });
    };

    // Constant monitoring for the first 10 seconds, then sparse checks
    const logoInterval = setInterval(forceRemoveLogo, 500);
    setTimeout(() => {
        clearInterval(logoInterval);
        // Keep a slow check just in case
        setInterval(forceRemoveLogo, 3000);
    }, 10000);
});
