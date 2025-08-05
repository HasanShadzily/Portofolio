/**
 * Optimized Portfolio JavaScript
 * Handles all animations and interactions with proper error handling and performance optimization
 */

class PortfolioManager {
    constructor() {
        // State management
        this.isInitialized = false;
        this.isDestroyed = false;
        this.activeAnimations = new Set();
        
        // Animation controls
        this.typingController = null;
        this.particleContainer = null;
        
        // Cached DOM elements
        this.elements = {};
        
        // Event handlers (for cleanup)
        this.handlers = {
            scroll: null,
            resize: null
        };
        
        // Performance optimization
        this.scrollTicking = false;
        this.resizeTicking = false;
        
        // Configuration
        this.config = {
            particles: {
                count: 50,
                maxCount: 100,
                minCount: 20
            },
            typing: {
                speed: 150,
                pauseBetweenTexts: 2000,
                initialDelay: 2000
            },
            scroll: {
                navbarThreshold: 50,
                revealOffset: 150
            }
        };
    }

    /**
     * Safely get DOM element with caching
     */
    getElement(id, cache = true) {
        if (cache && this.elements[id]) {
            return this.elements[id];
        }
        
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id '${id}' not found`);
            return null;
        }
        
        if (cache) {
            this.elements[id] = element;
        }
        
        return element;
    }

    /**
     * Create animated background particles with performance optimization
     */
    createParticles() {
        const bgAnimation = this.getElement('bgAnimation');
        if (!bgAnimation) return;

        // Responsive particle count based on screen size and device capability
        const screenWidth = window.innerWidth;
        const devicePixelRatio = window.devicePixelRatio || 1;
        const isLowEndDevice = devicePixelRatio < 2 && screenWidth < 1024;
        
        let particleCount = this.config.particles.count;
        if (isLowEndDevice) {
            particleCount = Math.max(this.config.particles.minCount, particleCount / 2);
        } else if (screenWidth > 1920) {
            particleCount = Math.min(this.config.particles.maxCount, particleCount * 1.5);
        }

        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Batch style updates
            particle.style.cssText = `
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 6}s;
                animation-duration: ${(Math.random() * 3 + 3)}s;
            `;
            
            fragment.appendChild(particle);
        }
        
        bgAnimation.appendChild(fragment);
        this.particleContainer = bgAnimation;
        
        console.log(`Created ${particleCount} particles`);
    }

    /**
     * Optimized typewriter effect with proper cleanup
     */
    async typeWriter(text, element, speed = 100) {
        if (!element || this.isDestroyed) return false;
        
        element.innerHTML = '';
        
        // Create animation controller for cleanup
        const controller = new AbortController();
        this.typingController = controller;
        
        try {
            for (let i = 0; i < text.length; i++) {
                if (controller.signal.aborted || this.isDestroyed) {
                    return false;
                }
                
                element.innerHTML += text.charAt(i);
                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(resolve, speed);
                    controller.signal.addEventListener('abort', () => {
                        clearTimeout(timeout);
                        reject(new Error('Animation aborted'));
                    });
                });
            }
            return true;
        } catch (error) {
            if (error.message !== 'Animation aborted') {
                console.error('TypeWriter error:', error);
            }
            return false;
        }
    }

    /**
     * Initialize typing animation with multiple texts
     */
    async initTypingAnimation() {
        const typingElement = this.getElement('typingText');
        if (!typingElement) return;

        const texts = [
            'Junior Front-end Developer',
            'React Enthusiast',
            'Creative Problem Solver',
            'UI/UX Designer'
        ];

        let currentIndex = 0;
        const animationId = Date.now();
        this.activeAnimations.add(animationId);

        const runCycle = async () => {
            if (this.isDestroyed || !this.activeAnimations.has(animationId)) {
                return;
            }

            const success = await this.typeWriter(
                texts[currentIndex], 
                typingElement, 
                this.config.typing.speed
            );

            if (success && !this.isDestroyed) {
                currentIndex = (currentIndex + 1) % texts.length;
                
                // Pause between texts
                setTimeout(() => {
                    if (!this.isDestroyed && this.activeAnimations.has(animationId)) {
                        runCycle();
                    }
                }, this.config.typing.pauseBetweenTexts);
            }
        };

        // Start after initial delay
        setTimeout(() => {
            if (!this.isDestroyed) {
                runCycle();
            }
        }, this.config.typing.initialDelay);
    }

    /**
     * Throttled scroll handler for better performance
     */
    handleScroll() {
        if (this.scrollTicking || this.isDestroyed) return;
        
        this.scrollTicking = true;
        requestAnimationFrame(() => {
            this.updateNavbar();
            this.revealOnScroll();
            this.scrollTicking = false;
        });
    }

    /**
     * Update navbar appearance based on scroll position
     */
    updateNavbar() {
        const navbar = this.getElement('navbar');
        if (!navbar) return;

        const shouldBeScrolled = window.scrollY > this.config.scroll.navbarThreshold;
        navbar.classList.toggle('scrolled', shouldBeScrolled);
    }

    /**
     * Reveal elements on scroll with Intersection Observer fallback
     */
    revealOnScroll() {
        const reveals = document.querySelectorAll('.fade-in:not(.visible)');
        if (reveals.length === 0) return;

        const windowHeight = window.innerHeight;
        const threshold = this.config.scroll.revealOffset;

        reveals.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < windowHeight - threshold) {
                element.classList.add('visible');
            }
        });
    }

    /**
     * Setup smooth scrolling for navigation links
     */
    initSmoothScrolling() {
        const anchors = document.querySelectorAll('a[href^="#"]');
        
        anchors.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    console.warn(`Target element ${targetId} not found`);
                }
            });
        });
    }

    /**
     * Enhanced contact form handler
     */
    initContactForm() {
        const form = this.getElement('contactForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.submit-btn');
            if (!submitBtn) return;

            const originalText = submitBtn.textContent;
            const formData = new FormData(form);
            
            // Validate form
            const isValid = this.validateForm(formData);
            if (!isValid) return;

            try {
                // Update button state
                submitBtn.textContent = 'Mengirim...';
                submitBtn.disabled = true;
                submitBtn.style.background = 'linear-gradient(45deg, #888, #666)';

                // Simulate form submission (replace with actual API call)
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Success state
                submitBtn.textContent = 'Terkirim!';
                submitBtn.style.background = 'linear-gradient(45deg, #00ff88, #0088ff)';

                // Reset after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    form.reset();
                }, 2000);

            } catch (error) {
                console.error('Form submission error:', error);
                
                // Error state
                submitBtn.textContent = 'Error! Coba lagi';
                submitBtn.style.background = 'linear-gradient(45deg, #ff4444, #cc0000)';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            }
        });
    }

    /**
     * Simple form validation
     */
    validateForm(formData) {
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const message = formData.get('message')?.trim();

        if (!name || !email || !message) {
            alert('Mohon isi semua field yang diperlukan');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Format email tidak valid');
            return false;
        }

        return true;
    }

    /**
     * Add interactive hover effects for cards
     */
    initCardEffects() {
        // Project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) rotateX(5deg)';
                card.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateX(0deg)';
            });
        });

        // Skill cards
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach(card => {
            const icon = card.querySelector('.skill-icon');
            if (!icon) return;

            card.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }

    /**
     * Initialize AOS with error handling
     */
    initAOS() {
        if (typeof AOS === 'undefined') {
            console.warn('AOS library not loaded, skipping AOS initialization');
            return;
        }

        try {
            AOS.init({
                duration: 1000,
                easing: 'ease-in-out',
                once: true,
                mirror: false,
                offset: 50,
                delay: 0
            });
            console.log('AOS initialized successfully');
        } catch (error) {
            console.error('Failed to initialize AOS:', error);
        }
    }

    /**
     * Handle window resize with throttling
     */
    handleResize() {
        if (this.resizeTicking) return;
        
        this.resizeTicking = true;
        requestAnimationFrame(() => {
            // Recreate particles if container exists
            if (this.particleContainer) {
                this.particleContainer.innerHTML = '';
                this.createParticles();
            }
            this.resizeTicking = false;
        });
    }

    /**
     * Setup performance monitoring
     */
    initPerformanceMonitoring() {
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        if (entry.duration > 50) {
                            console.warn('Long task detected:', entry.duration + 'ms');
                        }
                    });
                });
                observer.observe({ entryTypes: ['longtask'] });
            } catch (error) {
                console.log('Performance monitoring not available');
            }
        }
    }

    /**
     * Main initialization method
     */
    async init() {
        if (this.isInitialized) {
            console.warn('Portfolio already initialized');
            return;
        }

        console.log('Initializing Portfolio...');
        
        try {
            // Initialize performance monitoring
            this.initPerformanceMonitoring();
            
            // Create background particles
            this.createParticles();
            
            // Initialize AOS animations
            this.initAOS();
            
            // Setup typing animation
            this.initTypingAnimation();
            
            // Setup smooth scrolling
            this.initSmoothScrolling();
            
            // Initialize contact form
            this.initContactForm();
            
            // Add card hover effects
            this.initCardEffects();
            
            // Setup event listeners with cleanup tracking
            this.handlers.scroll = this.handleScroll.bind(this);
            this.handlers.resize = this.handleResize.bind(this);
            
            window.addEventListener('scroll', this.handlers.scroll, { passive: true });
            window.addEventListener('resize', this.handlers.resize, { passive: true });
            
            // Initial scroll check
            this.revealOnScroll();
            this.updateNavbar();
            
            this.isInitialized = true;
            console.log('Portfolio initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize portfolio:', error);
        }
    }

    /**
     * Cleanup method for proper resource management
     */
    destroy() {
        console.log('Destroying Portfolio...');
        
        this.isDestroyed = true;
        
        // Stop typing animation
        if (this.typingController) {
            this.typingController.abort();
            this.typingController = null;
        }
        
        // Clear active animations
        this.activeAnimations.clear();
        
        // Remove event listeners
        if (this.handlers.scroll) {
            window.removeEventListener('scroll', this.handlers.scroll);
        }
        if (this.handlers.resize) {
            window.removeEventListener('resize', this.handlers.resize);
        }
        
        // Clear cached elements
        this.elements = {};
        
        // Reset state
        this.isInitialized = false;
        
        console.log('Portfolio destroyed');
    }
}

// Initialize portfolio when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioManager = new PortfolioManager();
    window.portfolioManager.init();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.portfolioManager) {
        window.portfolioManager.destroy();
    }
});

// Handle page visibility changes (tab switching)
document.addEventListener('visibilitychange', () => {
    if (window.portfolioManager) {
        if (document.hidden) {
            // Pause heavy animations when tab is not visible
            window.portfolioManager.isDestroyed = true;
        } else {
            // Resume when tab becomes visible
            window.portfolioManager.isDestroyed = false;
        }
    }
});

// Handle orientation changes on mobile
window.addEventListener('orientationchange', () => {
    if (window.portfolioManager) {
        setTimeout(() => {
            window.portfolioManager.handleResize();
        }, 100);
    }
});