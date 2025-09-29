/**
 * Dentabel Clinic Website Main JavaScript
 * Author: Web Development Team
 * Version: 1.0.0
 * Description: Modern dental clinic website functionality
 */

'use strict';

// Document Ready State Management
class DentabelApp {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        console.log('🦷 Dentabel Clinic Website Initialized');
        
        // Initialize all components
        this.initScrollToTop();
        this.initMobileMenu();
        this.initSmoothScrolling();
        this.initContactForm();
        this.initAnimations();
        this.initAccessibility();
        
        // Add loading complete class
        document.body.classList.add('loaded');
        
        console.log('✅ All components initialized successfully');
    }

    /**
     * Scroll to Top Button Functionality
     */
    initScrollToTop() {
        const scrollToTopBtn = document.getElementById('scrollToTop');
        
        if (!scrollToTopBtn) {
            console.warn('⚠️ Scroll to top button not found');
            return;
        }

        // Show/hide button based on scroll position
        const toggleScrollButton = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        };

        // Smooth scroll to top
        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };

        // Event listeners
        window.addEventListener('scroll', this.throttle(toggleScrollButton, 100));
        scrollToTopBtn.addEventListener('click', scrollToTop);

        console.log('✅ Scroll to top functionality initialized');
    }

    /**
     * Mobile Menu Functionality
     */
    initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');
        
        if (!mobileMenuBtn || !navMenu) {
            console.warn('⚠️ Mobile menu elements not found');
            return;
        }

        let isMenuOpen = false;

        const toggleMenu = () => {
            isMenuOpen = !isMenuOpen;
            
            mobileMenuBtn.classList.toggle('active', isMenuOpen);
            navMenu.classList.toggle('active', isMenuOpen);
            
            // Update ARIA attributes
            mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen);
            mobileMenuBtn.setAttribute('aria-label', isMenuOpen ? 'Закрыть меню' : 'Открыть меню');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        };

        const closeMenu = () => {
            if (isMenuOpen) {
                toggleMenu();
            }
        };

        // Event listeners
        mobileMenuBtn.addEventListener('click', toggleMenu);
        
        // Close menu when clicking on nav links
        navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link') && !e.target.classList.contains('disabled')) {
                closeMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        });

        // Close menu on window resize
        window.addEventListener('resize', this.debounce(() => {
            if (window.innerWidth > 768 && isMenuOpen) {
                closeMenu();
            }
        }, 250));

        console.log('✅ Mobile menu functionality initialized');
    }

    /**
     * Smooth Scrolling for Anchor Links
     */
    initSmoothScrolling() {
        const anchors = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        
        anchors.forEach(anchor => {
            // Skip disabled links
            if (anchor.classList.contains('disabled')) {
                return;
            }

            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update active navigation
                    this.updateActiveNav(targetId);
                }
            });
        });

        console.log('✅ Smooth scrolling initialized');
    }

    /**
     * Update Active Navigation Item
     */
    updateActiveNav(targetId) {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Contact Form Handling
     */
    initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (!contactForm) {
            console.warn('⚠️ Contact form not found');
            return;
        }

        // Form validation rules
        const validationRules = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[а-яёА-ЯЁa-zA-Z\s-]+$/
            },
            phone: {
                required: true,
                pattern: /^[\+]?[0-9\(\)\-\s]{10,}$/
            },
            email: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            }
        };

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input, validationRules));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Form submission
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm(contactForm, validationRules)) {
                this.handleFormSubmission(contactForm);
            }
        });

        console.log('✅ Contact form functionality initialized');
    }

    /**
     * Validate Individual Form Field
     */
    validateField(field, rules) {
        const rule = rules[field.name];
        if (!rule) return true;

        const value = field.value.trim();
        const errors = [];

        // Required validation
        if (rule.required && !value) {
            errors.push('Это поле обязательно для заполнения');
        }

        // Minimum length validation
        if (rule.minLength && value.length < rule.minLength) {
            errors.push(`Минимальная длина: ${rule.minLength} символов`);
        }

        // Pattern validation
        if (rule.pattern && value && !rule.pattern.test(value)) {
            switch (field.name) {
                case 'name':
                    errors.push('Имя должно содержать только буквы');
                    break;
                case 'phone':
                    errors.push('Некорректный формат телефона');
                    break;
                case 'email':
                    errors.push('Некорректный email адрес');
                    break;
            }
        }

        // Display errors
        if (errors.length > 0) {
            this.showFieldError(field, errors[0]);
            return false;
        } else {
            this.clearFieldError(field);
            return true;
        }
    }

    /**
     * Show Field Error
     */
    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    /**
     * Clear Field Error
     */
    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Validate Entire Form
     */
    validateForm(form, rules) {
        const inputs = form.querySelectorAll('input, select, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input, rules)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Handle Form Submission (Demo Mode)
     */
    handleFormSubmission(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        
        // Simulate form submission
        setTimeout(() => {
            // Reset form
            form.reset();
            
            // Show success message
            this.showNotification('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            
            console.log('📧 Form submitted successfully (demo mode)');
        }, 1500);
    }

    /**
     * Show Notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Закрыть">&times;</button>
            </div>
        `;

        // Add styles if not exist
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    max-width: 400px;
                    padding: 1rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                }
                .notification-success {
                    background-color: #d4edda;
                    border: 1px solid #c3e6cb;
                    color: #155724;
                }
                .notification-error {
                    background-color: #f8d7da;
                    border: 1px solid #f5c6cb;
                    color: #721c24;
                }
                .notification.show {
                    transform: translateX(0);
                }
                .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 1rem;
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    opacity: 0.7;
                }
                .notification-close:hover {
                    opacity: 1;
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.closeNotification(notification));

        // Auto-close after 5 seconds
        setTimeout(() => this.closeNotification(notification), 5000);
    }

    /**
     * Close Notification
     */
    closeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    /**
     * Initialize Scroll Animations
     */
    initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.service-card, .hero-text, .about-text, .contact-info-block, .contact-form-block');
        animateElements.forEach(el => {
            el.classList.add('animate-element');
            observer.observe(el);
        });

        // Add animation styles
        if (!document.querySelector('#animation-styles')) {
            const styles = document.createElement('style');
            styles.id = 'animation-styles';
            styles.textContent = `
                .animate-element {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 0.6s ease, transform 0.6s ease;
                }
                .animate-element.animate-in {
                    opacity: 1;
                    transform: translateY(0);
                }
                @media (prefers-reduced-motion: reduce) {
                    .animate-element {
                        opacity: 1;
                        transform: none;
                        transition: none;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        console.log('✅ Scroll animations initialized');
    }

    /**
     * Initialize Accessibility Features
     */
    initAccessibility() {
        // Skip to content link
        this.createSkipLink();
        
        // Keyboard navigation for disabled elements
        this.handleDisabledElements();
        
        // Focus management
        this.initFocusManagement();

        console.log('✅ Accessibility features initialized');
    }

    /**
     * Create Skip to Content Link
     */
    createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Перейти к основному содержимому';
        skipLink.className = 'skip-link';
        
        // Add styles
        if (!document.querySelector('#skip-link-styles')) {
            const styles = document.createElement('style');
            styles.id = 'skip-link-styles';
            styles.textContent = `
                .skip-link {
                    position: absolute;
                    top: -40px;
                    left: 6px;
                    background: #000;
                    color: #fff;
                    padding: 8px;
                    text-decoration: none;
                    border-radius: 0 0 4px 4px;
                    z-index: 10001;
                    transition: top 0.3s;
                }
                .skip-link:focus {
                    top: 0;
                }
            `;
            document.head.appendChild(styles);
        }

        // Add ID to main element
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main';
            main.setAttribute('tabindex', '-1');
        }

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    /**
     * Handle Disabled Elements
     */
    handleDisabledElements() {
        const disabledElements = document.querySelectorAll('.disabled');
        
        disabledElements.forEach(element => {
            element.setAttribute('tabindex', '-1');
            element.setAttribute('aria-disabled', 'true');
            
            if (element.tagName === 'A') {
                element.setAttribute('role', 'button');
            }
        });
    }

    /**
     * Focus Management
     */
    initFocusManagement() {
        // Trap focus in mobile menu when open
        const navMenu = document.getElementById('navMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (navMenu && mobileMenuBtn) {
            navMenu.addEventListener('keydown', (e) => {
                if (e.key === 'Tab' && navMenu.classList.contains('active')) {
                    const focusableElements = navMenu.querySelectorAll('a:not(.disabled)');
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
        }
    }

    /**
     * Utility Functions
     */
    
    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Debounce function for resize events
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Page Navigation System for Future Pages
class PageManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.initPageSpecificFeatures();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        return path.split('/').pop() || 'index.html';
    }

    initPageSpecificFeatures() {
        // Scroll to top when navigating between pages
        if (performance.navigation.type === performance.navigation.TYPE_NAVIGATE) {
            window.scrollTo(0, 0);
        }

        // Page-specific initialization
        switch (this.currentPage) {
            case 'index.html':
            case '':
                this.initHomePage();
                break;
            default:
                console.log(`📄 Page: ${this.currentPage}`);
        }
    }

    initHomePage() {
        console.log('🏠 Home page specific features initialized');
        
        // Add any home page specific functionality here
        this.initServiceCards();
        this.initHeroAnimation();
    }

    initServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    initHeroAnimation() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            // Add typewriter effect (optional)
            heroTitle.style.opacity = '1';
        }
    }
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('🚨 JavaScript Error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('🚨 Unhandled Promise Rejection:', e.reason);
});

// Initialize Application
const dentabelApp = new DentabelApp();
const pageManager = new PageManager();

// Performance Monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('⚡ Page Load Performance:', {
                domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.navigationStart),
                loadComplete: Math.round(perfData.loadEventEnd - perfData.navigationStart)
            });
        }, 0);
    });
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DentabelApp, PageManager };
}