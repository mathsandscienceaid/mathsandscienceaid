/* =====================================================
   UTILITY: GET HEADER HEIGHT (for accurate scrolling)
===================================================== */
const getHeaderHeight = () => {
    const header = document.querySelector('header');
    return header ? header.offsetHeight : 80;
};

/* =====================================================
   SMOOTH SCROLLING (HEADER-OFFSET SAFE)
===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');

        if (targetId === "#") return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const headerOffset = getHeaderHeight();
        const targetPosition =
            target.getBoundingClientRect().top + window.scrollY - headerOffset - 5;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});

/* =====================================================
   BURGER MENU (ACCESSIBLE + MOBILE-FRIENDLY)
===================================================== */
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

if (burger && navLinks) {
    const toggleMenu = () => {
        navLinks.classList.toggle('nav-active');
        const isOpen = navLinks.classList.contains('nav-active');
        burger.setAttribute('aria-expanded', String(isOpen));
    };

    // Click support
    burger.addEventListener('click', toggleMenu);

    // Keyboard support
    burger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    // Auto-close menu when a link is clicked (mobile)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            burger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside (mobile-friendly)
    document.addEventListener('click', (e) => {
        const clickedInsideNav = navLinks.contains(e.target);
        const clickedBurger = burger.contains(e.target);

        if (!clickedInsideNav && !clickedBurger) {
            navLinks.classList.remove('nav-active');
            burger.setAttribute('aria-expanded', 'false');
        }
    });
}

/* =====================================================
   FADE-IN ANIMATIONS (PERFORMANCE-FRIENDLY)
===================================================== */
const faders = document.querySelectorAll(
    '.welcome-text, .welcome-image, .card, .review, .resources-content, .about-image, .about-text'
);

const appearOnScroll = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target); // run only once
        });
    },
    {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    }
);

faders.forEach(el => appearOnScroll.observe(el));

/* =====================================================
   HEADER SHADOW + ACTIVE NAV (COMBINED SCROLL HANDLER)
   (Better performance — single scroll listener)
===================================================== */
const header = document.querySelector('header');
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const headerHeight = getHeaderHeight();

    /* ---- HEADER SHADOW ---- */
    if (header) {
        header.classList.toggle('scrolled', scrollY > 10);
    }

    /* ---- ACTIVE NAV LINK ---- */
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 10;
        const sectionHeight = section.offsetHeight;

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });

    navItems.forEach(link => {
        const isActive = link.getAttribute('href') === `#${currentSection}`;
        link.classList.toggle('active', isActive);
    });
});

/* =====================================================
   CONTACT FORM (ROBUST FORM HANDLING)
===================================================== */
const form = document.querySelector('.contact-form');
const statusMsg = document.querySelector('.form-status');
const whatsappFallback = document.querySelector('.whatsapp-fallback');

if (form) {
    const button = form.querySelector('.submit-btn');
    const spinner = button?.querySelector('.spinner');
    const btnText = button?.querySelector('.btn-text');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Show loading state
        if (spinner && btnText) {
            spinner.style.display = 'inline-block';
            btnText.textContent = 'Sending...';
            button.disabled = true;
        }

        // Backup timeout in case Formspree is slow
        const slowTimer = setTimeout(() => {
            statusMsg.textContent =
                'Taking longer than expected. You can also use WhatsApp below.';
            statusMsg.style.display = 'block';

            if (whatsappFallback) {
                whatsappFallback.style.display = 'block';
            }
        }, 7000);

        try {
            const formData = new FormData(form);

            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            clearTimeout(slowTimer);

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            // SUCCESS STATE
            statusMsg.textContent =
                '✅ Message sent successfully! Redirecting...';
            statusMsg.style.display = 'block';

            // Hide WhatsApp fallback on success
            if (whatsappFallback) {
                whatsappFallback.style.display = 'none';
            }

            // Reset form
            form.reset();

            // Reset button state before redirect
            if (spinner && btnText) {
                spinner.style.display = 'none';
                btnText.textContent = 'Send Message';
                button.disabled = false;
            }

            // Redirect after success
            setTimeout(() => {
                window.location.href = 'thank-you.html';
            }, 3500);

        } catch (error) {
            console.error('Form error:', error);

            // FAILURE STATE
            statusMsg.textContent =
                '⚠️ Message could not be sent. Please use WhatsApp below.';
            statusMsg.style.display = 'block';

            if (whatsappFallback) {
                whatsappFallback.style.display = 'block';
            }

            // Reset button state
            if (spinner && btnText) {
                spinner.style.display = 'none';
                btnText.textContent = 'Send Message';
                button.disabled = false;
            }
        }
    });
}

/* =====================================================
   WHATSAPP BUTTON (SMART PREFILL)
===================================================== */
const whatsappBtn = document.querySelector('.whatsapp-btn');

if (whatsappBtn && form) {
    whatsappBtn.addEventListener('click', () => {
        const name = form.name?.value || 'Not provided';
        const email =
            form._replyto?.value ||
            form.email?.value ||
            'Not provided';
        const message =
            form.message?.value ||
            'Hello, I would like more information.';

        const whatsappMessage =
            `Hello Maths & Science Aid 👋%0A%0A` +
            `Name: ${encodeURIComponent(name)}%0A` +
            `Email: ${encodeURIComponent(email)}%0A` +
            `Message:%0A${encodeURIComponent(message)}`;

        window.open(
            `https://wa.me/27645381544?text=${whatsappMessage}`,
            '_blank'
        );
    });
}
