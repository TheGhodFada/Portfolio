// ===========================================
// INITIALIZATION
// ===========================================

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initNavigation();
    initTheme();
    initScrollEffects();
    initAnimations();
    initForm();
    initKeyboardNavigation();
});

// ===========================================
// LOADER
// ===========================================

function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 2000);
    });
}

// ===========================================
// CUSTOM CURSOR
// ===========================================

function initCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    function updateCursor() {
        if (window.innerWidth <= 768) {
            cursor.style.display = 'none';
            return;
        }

        cursor.style.display = 'block';

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Add hover effects
        const interactiveElements = document.querySelectorAll(
            'a, button, .work-item, .stat, .skill-category, .blog-card, .highlight-item, .nav-link'
        );

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) cursor.classList.remove('hover');
            });
        });
    }

    updateCursor();

    // Handle window resize
    window.addEventListener('resize', updateCursor);
}

// ===========================================
// NAVIGATION
// ===========================================

function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!nav || !navToggle || !navMenu || !mobileMenuOverlay) return;

    // Mobile menu toggle
    function toggleMobileMenu() {
        const isActive = navMenu.classList.contains('active');
        
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = isActive ? 'auto' : 'hidden';
    }

    navToggle.addEventListener('click', toggleMobileMenu);

    // Close mobile menu
    function closeMobileMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            closeMobileMenu();
        });
    });

    // Update active nav link on scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
            
            if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    }

    // Update navbar background
    function updateNavbar() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        updateActiveNavLink();
    }

    window.addEventListener('scroll', updateNavbar);
}

// ===========================================
// THEME TOGGLE
// ===========================================

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    if (!themeToggle) return;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon();

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon();
    });

    function updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        const theme = html.getAttribute('data-theme');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Detect system theme preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches && !localStorage.getItem('theme')) {
        html.setAttribute('data-theme', 'light');
        updateThemeIcon();
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            html.setAttribute('data-theme', e.matches ? 'light' : 'dark');
            updateThemeIcon();
        }
    });
}

// ===========================================
// SCROLL EFFECTS
// ===========================================

function initScrollEffects() {
    // Parallax effect for hero section
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroBg = document.querySelector('.hero-bg');
        const heroContent = document.querySelector('.hero-content');
        const heroParticles = document.querySelector('.hero-particles');
        
        if (heroBg && heroContent && heroParticles) {
            heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroParticles.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
            heroContent.style.opacity = 1 - scrolled / 800;
        }
    }

    // Scroll progress indicator
    function updateScrollProgress() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (window.pageYOffset / scrollHeight) * 100;
        
        let progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 2px;
                background: var(--accent);
                z-index: 10001;
                transition: width 0.1s ease;
            `;
            document.body.appendChild(progressBar);
        }
        
        progressBar.style.width = scrollPercent + '%';
    }

    // Debounced scroll handler
    let scrollTimer;
    function handleScroll() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            updateParallax();
            updateScrollProgress();
        }, 10);
    }

    window.addEventListener('scroll', handleScroll);
}

// ===========================================
// ANIMATIONS
// ===========================================

function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger specific animations
                if (entry.target.classList.contains('stat')) {
                    animateCounter(entry.target);
                }
                
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillProgress(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.work-item, .timeline-item, .skill-category, .stat, .blog-card, .highlight-item'
    );
    
    animatedElements.forEach(item => observer.observe(item));

    // Typing effect for hero title
    function typeWriter(element, text, speed = 100) {
        element.innerHTML = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Initialize typing effect
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const lines = heroTitle.querySelectorAll('.line');
            lines.forEach((line, index) => {
                const text = line.textContent;
                setTimeout(() => {
                    typeWriter(line, text, 80);
                }, 2000 + (index * 500));
            });
        }
    }, 100);

    // Code block glow animation
    setTimeout(() => {
        const codeBlock = document.querySelector('.code-block');
        if (codeBlock) {
            codeBlock.style.animation = 'codeBlockGlow 3s ease-in-out infinite alternate';
        }
    }, 2500);

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes codeBlockGlow {
            0% { box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); }
            100% { box-shadow: 0 20px 60px rgba(0, 255, 136, 0.2); }
        }
    `;
    document.head.appendChild(style);
}

// ===========================================
// COUNTER ANIMATIONS
// ===========================================

function animateCounter(element) {
    const numberElement = element.querySelector('.stat-number');
    if (!numberElement) return;
    
    const text = numberElement.textContent;
    const number = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/[0-9]/g, '');
    
    if (isNaN(number) || element.classList.contains('animated')) return;
    
    element.classList.add('animated');
    let current = 0;
    const increment = number / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        numberElement.textContent = Math.floor(current) + suffix;
    }, 30);
}

// ===========================================
// SKILL PROGRESS ANIMATIONS
// ===========================================

function animateSkillProgress(element) {
    if (element.classList.contains('animated')) return;
    
    element.classList.add('animated');
    const progressBars = element.querySelectorAll('.skill-progress');
    
    progressBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.width = bar.style.getPropertyValue('--progress');
        }, index * 100);
    });
}

// ===========================================
// FORM HANDLING
// ===========================================

function initForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!validateForm(data)) return;
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalContent = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        
        // Reset button
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
    });

    function validateForm(data) {
        if (!data.name || !data.email || !data.subject || !data.message) {
            showNotification('Please fill in all fields', 'error');
            return false;
        }
        
        if (!isValidEmail(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// ===========================================
// NOTIFICATION SYSTEM
// ===========================================

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '24px',
        padding: '16px 24px',
        background: type === 'success' ? 'var(--accent)' : '#ff4444',
        color: 'var(--bg)',
        borderRadius: '8px',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ===========================================
// KEYBOARD NAVIGATION
// ===========================================

function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Close mobile menu with Escape
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
            
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
        
        // Number keys for section navigation (1-7)
        if (e.key >= '1' && e.key <= '7') {
            const sections = ['home', 'work', 'skills', 'experience', 'about', 'blog', 'contact'];
            const index = parseInt(e.key) - 1;
            const targetSection = document.getElementById(sections[index]);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
}

// ===========================================
// MAGNETIC BUTTON EFFECTS
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .submit-btn, .nav-cta');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
});

// ===========================================
// IMAGE LOADING
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        img.addEventListener('error', () => {
            img.style.opacity = '0.5';
        });
        
        // Set initial state
        img.style.transition = 'opacity 0.3s ease';
        img.style.opacity = '0';
    });
});

// ===========================================
// CONSOLE EASTER EGG
// ===========================================

console.log('%c🚀 Welcome to the future of web development', 'font-size: 20px; font-weight: bold; color: #00ff88;');
console.log('%cBuilt with passion and cutting-edge technologies', 'font-size: 14px; color: #888;');
console.log('%cFeel free to explore the source code!', 'font-size: 14px; color: #888;');