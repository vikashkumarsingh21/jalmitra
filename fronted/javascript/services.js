// Jalmitra Services Page Interactive JavaScript

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeServices();
    setupScrollAnimations();
    setupServiceCardInteractions();
    setupProcessStepAnimations();
    setupNavbarScrollEffect();
    setupProductShowcase();
    setupCTAAnimations();
});

// Initialize all services functionality
function initializeServices() {
    console.log('Jalmitra Services initialized');
    
    // Add loading animation to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Stagger animation
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Navbar scroll effect
function setupNavbarScrollEffect() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Service card interactions
function setupServiceCardInteractions() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 123, 255, 0.15)';
            this.style.transition = 'all 0.3s ease';
            
            // Animate service icon
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            
            // Reset service icon
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        // Click animation
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }, 150);
        });
    });
}

// Process step animations
function setupProcessStepAnimations() {
    const processSteps = document.querySelectorAll('.process-step');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate step number
                const stepNumber = entry.target.querySelector('.step-number');
                if (stepNumber) {
                    stepNumber.style.animation = 'pulse 0.6s ease-in-out';
                }
            }
        });
    }, observerOptions);
    
    processSteps.forEach(step => {
        processObserver.observe(step);
    });
}

// Product showcase interactions
function setupProductShowcase() {
    const productCard = document.querySelector('.product-card');
    const productImage = document.querySelector('.product-image img');
    const specItems = document.querySelectorAll('.spec-item');
    
    // Product image hover effect
    if (productImage) {
        productImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.4s ease';
        });
        
        productImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // Spec items hover effects
    specItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
            this.style.transform = 'translateX(5px)';
            this.style.borderLeft = '4px solid #007bff';
            this.style.transition = 'all 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
            this.style.transform = 'translateX(0)';
            this.style.borderLeft = 'none';
        });
    });
    
    // Animate spec items on scroll
    const specObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, Math.random() * 200);
            }
        });
    }, { threshold: 0.5 });
    
    specItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        specObserver.observe(item);
    });
}

// CTA section animations
function setupCTAAnimations() {
    const ctaSection = document.querySelector('.cta-section');
    const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
    
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate buttons with delay
                ctaButtons.forEach((btn, index) => {
                    setTimeout(() => {
                        btn.style.opacity = '1';
                        btn.style.transform = 'translateY(0)';
                    }, index * 200);
                });
            }
        });
    }, { threshold: 0.3 });
    
    if (ctaSection) {
        ctaObserver.observe(ctaSection);
    }
    
    // Button hover effects
    ctaButtons.forEach(btn => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(20px)';
        btn.style.transition = 'all 0.3s ease';
        
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 10px 25px rgba(0, 123, 255, 0.3)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// Scroll-based animations
function setupScrollAnimations() {
    const animateElements = document.querySelectorAll('.services-hero-content, .product-showcase, .process-section');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => {
        scrollObserver.observe(element);
    });
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add dynamic data loading simulation
function simulateDataLoading() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const features = card.querySelectorAll('.service-features li');
        features.forEach((feature, index) => {
            feature.style.opacity = '0';
            feature.style.transform = 'translateX(-20px)';
            feature.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                feature.style.opacity = '1';
                feature.style.transform = 'translateX(0)';
            }, index * 100);
        });
    });
}

// Add typing effect for hero subtitle
function addTypingEffect() {
    const subtitle = document.querySelector('.services-hero-content .subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        
        let index = 0;
        const typeInterval = setInterval(() => {
            subtitle.textContent += text[index];
            index++;
            
            if (index >= text.length) {
                clearInterval(typeInterval);
            }
        }, 100);
    }
}

// Initialize typing effect after page load
window.addEventListener('load', () => {
    setTimeout(addTypingEffect, 500);
    setTimeout(simulateDataLoading, 1000);
});

// Add CSS animations dynamically
function addDynamicStyles() {
    const styles = `
        .service-card {
            transition: all 0.3s ease;
        }
        
        .animate-in {
            animation: slideInUp 0.6s ease-out;
        }
        
        .fade-in {
            animation: fadeIn 0.8s ease-in;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
        }
        
        .navbar.scrolled {
            background-color: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Initialize dynamic styles
addDynamicStyles();

// Error handling
window.addEventListener('error', (e) => {
    console.error('Jalmitra Services Error:', e.error);
});

// Performance monitoring
window.addEventListener('load', () => {
    console.log('Jalmitra Services page loaded successfully');
});