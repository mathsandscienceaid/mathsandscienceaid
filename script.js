/* =========================
   SMOOTH SCROLLING
========================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === "#") return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

/* =========================
   BURGER MENU (ACCESSIBLE)
========================= */
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

if (burger && navLinks) {
    const toggleMenu = () => {
        navLinks.classList.toggle('nav-active');
        const isOpen = navLinks.classList.contains('nav-active');
        burger.setAttribute('aria-expanded', isOpen);
    };

    burger.addEventListener('click', toggleMenu);
    burger.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') toggleMenu();
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            burger.setAttribute('aria-expanded', 'false');
        });
    });
}

/* =========================
   FADE-IN ON SCROLL
========================= */
const faders = document.querySelectorAll(
    '.welcome-text, .welcome-image, .card, .review, .resources-content, .about-image, .about-text'
);

const appearOnScroll = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        });
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
);

faders.forEach(el => appearOnScroll.observe(el));

/* =========================
   HEADER SHADOW ON SCROLL
========================= */
const header = document.querySelector('header');

if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
    });
}

/* =========================
   ACTIVE NAV LINK HIGHLIGHT
========================= */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = "";

    sections.forEach(section => {
        const top = section.offsetTop - 120;
        const height = section.offsetHeight;

        if (window.scrollY >= top && window.scrollY < top + height) {
            current = section.id;
        }
    });

    navItems.forEach(link => {
        link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${current}`
        );
    });
});

/* =========================
   CONTACT FORM (PRO VERSION)
   - Real Formspree handling
   - Loading state
   - Success message
   - WhatsApp fallback on failure
========================= */

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

        try {
            const formData = new FormData(form);

            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // SUCCESS
                statusMsg.textContent = "✅ Message sent successfully! Redirecting...";
                statusMsg.style.display = 'block';

                // Reset form
                form.reset();

                // Redirect after success
                setTimeout(() => {
                    window.location.href = 'thank-you.html';
                }, 3500);
            } else {
                throw new Error("Form submission failed");
            }

        } catch (error) {
            console.error("Form error:", error);

            // FAILURE → Show WhatsApp fallback
            statusMsg.textContent = "⚠️ Message could not be sent. Please use WhatsApp below.";
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

/* =========================
   WHATSAPP BUTTON (SMART VERSION)
========================= */
const whatsappBtn = document.querySelector('.whatsapp-btn');

if (whatsappBtn && form) {
    whatsappBtn.addEventListener('click', () => {
        const name = form.name.value || 'Not provided';
        const email = form._replyto?.value || form.email?.value || 'Not provided';
        const message = form.message.value || 'Hello, I would like more information.';

        const whatsappMessage =
            `Hello Maths & Science Aid 👋%0A%0A` +
            `Name: ${name}%0A` +
            `Email: ${email}%0A` +
            `Message:%0A${message}`;

        window.open(
            `https://wa.me/27645381544?text=${whatsappMessage}`,
            '_blank'
        );
    });
}
