// Jalmitra Website JavaScript
// Enhanced functionality for smart water cleaning boat website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavbar();
    initHeroAnimations();
    initFeatureCards();
    initStatsCounter();
    initScrollAnimations();
    initFloatingElements();
    initParallaxEffects();
    initPreloader();
    initMobileMenu();
    initContactForm();
    initTypingEffect();
    initLiveDataSimulation();
});

// Enhanced Navbar functionality
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Navbar scroll effect with debouncing
    let ticking = false;
    
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
    
    // Active link highlighting
    function highlightActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        navLinks.forEach(link => {
            const section = document.querySelector(link.getAttribute('href'));
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveLink);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Hero section animations
function initHeroAnimations() {
    const heroText = document.querySelector('.hero-text');
    const heroImage = document.querySelector('.hero-image');
    
    // Stagger animation for hero elements
    if (heroText) {
        const heroElements = heroText.querySelectorAll('h1, .subtitle, p, .hero-buttons');
        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.animation = `fadeInUp 0.8s ease ${index * 0.2}s forwards`;
        });
    }
    
    // Hero image hover effect
    if (heroImage) {
        const img = heroImage.querySelector('img');
        heroImage.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.05) rotate(2deg)';
        });
        
        heroImage.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1) rotate(0deg)';
        });
    }
}

// Enhanced feature cards
function initFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        // Add hover sound effect (optional)
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click ripple effect
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(0, 121, 107, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = (e.clientX - card.offsetLeft) + 'px';
            ripple.style.top = (e.clientY - card.offsetTop) + 'px';
            
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Enhanced stats counter with animation
function initStatsCounter() {
    function animateCounter(element, target, duration = 2000, suffix = '') {
        let start = 0;
        const startTime = performance.now();
        const isPercentage = suffix === '%';
        const isDecimal = target.toString().includes('.');
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (target - start) * easeOutQuart;
            
            if (isDecimal) {
                element.textContent = current.toFixed(1) + suffix;
            } else if (isPercentage) {
                element.textContent = Math.floor(current) + suffix;
            } else {
                element.textContent = Math.floor(current).toLocaleString() + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const number = entry.target.querySelector('.stat-number');
                const text = number.textContent;
                
                // Parse different number formats
                if (text.includes('%')) {
                    const target = parseFloat(text.replace('%', ''));
                    animateCounter(number, target, 2000, '%');
                } else if (text.includes('/')) {
                    // Handle "24/7" format
                    number.textContent = text;
                } else {
                    const target = parseFloat(text.replace(/,/g, ''));
                    if (!isNaN(target)) {
                        animateCounter(number, target, 2000);
                    }
                }
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat-item').forEach(item => {
        statsObserver.observe(item);
    });
}

// Advanced scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe various elements
    const elementsToAnimate = document.querySelectorAll('.feature-card, .stats-grid, .footer-section');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}

// Floating elements animation
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-icon');
    
    floatingElements.forEach((element, index) => {
        // Random floating animation
        setInterval(() => {
            const randomX = Math.random() * 10 - 5;
            const randomY = Math.random() * 10 - 5;
            element.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 2000 + index * 500);
        
        // Add click interaction
        element.addEventListener('click', () => {
            element.style.animation = 'none';
            element.style.transform = 'scale(1.5) rotate(360deg)';
            setTimeout(() => {
                element.style.animation = 'float 6s ease-in-out infinite';
                element.style.transform = 'scale(1) rotate(0deg)';
            }, 500);
        });
    });
}

// Parallax scrolling effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-image, .floating-elements');
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const rate = scrolled * -0.5 * (index + 1);
            element.style.transform = `translateY(${rate}px)`;
        });
    }
    
    window.addEventListener('scroll', updateParallax);
}

// Preloader
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">
                <img src="asset/Jalmitra Logo.png" alt="Jalmitra" style="width: 80px; height: 80px; border-radius: 50%;">
            </div>
            <div class="preloader-text">Loading Jalmitra...</div>
            <div class="preloader-spinner"></div>
        </div>
    `;
    
    // Add preloader styles
    const preloaderStyles = `
        #preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        
        .preloader-content {
            text-align: center;
            color: #00796b;
        }
        
        .preloader-logo {
            margin-bottom: 20px;
            animation: pulse 2s infinite;
        }
        
        .preloader-text {
            font-size: 1.2rem;
            margin-bottom: 20px;
            font-weight: 600;
        }
        
        .preloader-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #26a69a;
            border-top: 4px solid #00796b;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = preloaderStyles;
    document.head.appendChild(style);
    document.body.appendChild(preloader);
    
    // Remove preloader when page is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 1000);
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="bi bi-list"></i>';
    
    // Add mobile menu styles
    const mobileStyles = `
        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--primary);
            cursor: pointer;
        }
        
        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: block;
            }
            
            .nav-links {
                position: fixed;
                top: 80px;
                left: -100%;
                width: 100%;
                height: calc(100vh - 80px);
                background: white;
                flex-direction: column;
                padding: 50px 0;
                transition: left 0.3s ease;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            
            .nav-links.active {
                left: 0;
            }
            
            .nav-links a {
                padding: 15px 40px;
                border-bottom: 1px solid #f0f0f0;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = mobileStyles;
    document.head.appendChild(style);
    
    navbar.querySelector('.nav-container').appendChild(mobileMenuBtn);
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.className = navLinks.classList.contains('active') ? 'bi bi-x' : 'bi bi-list';
    });
    
    // Close mobile menu when link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.querySelector('i').className = 'bi bi-list';
        });
    });
}

// Contact form functionality
function initContactForm() {
    const contactForms = document.querySelectorAll('form');
    
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Show success message
                showNotification('Message sent successfully!', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    });
}

// Typing effect for hero text
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let index = 0;
        function typeText() {
            if (index < text.length) {
                heroTitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeText, 100);
            }
        }
        
        setTimeout(typeText, 500);
    }
}

// Live data simulation
function initLiveDataSimulation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function updateLiveData() {
        statNumbers.forEach((stat, index) => {
            if (index === 0) { // System Uptime
                const current = parseFloat(stat.textContent);
                const change = (Math.random() - 0.5) * 0.1;
                const newValue = Math.max(95, Math.min(100, current + change));
                stat.textContent = newValue.toFixed(1) + '%';
            } else if (index === 1) { // Data Points
                const current = parseInt(stat.textContent.replace(/,/g, ''));
                const increment = Math.floor(Math.random() * 10) + 1;
                stat.textContent = (current + increment).toLocaleString();
            } else if (index === 2) { // Water Quality Index
                const current = parseInt(stat.textContent);
                const change = Math.floor(Math.random() * 3) - 1;
                const newValue = Math.max(70, Math.min(100, current + change));
                stat.textContent = newValue;
            }
        });
    }
    
    // Update every 10 seconds
    setInterval(updateLiveData, 10000);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        }
        
        .notification-success {
            background: #4caf50;
        }
        
        .notification-error {
            background: #f44336;
        }
        
        .notification-info {
            background: #2196f3;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = notificationStyles;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Utility functions
function debounce(func, wait) {
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

// Add ripple effect animation
const rippleStyle = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

const rippleStyleSheet = document.createElement('style');
rippleStyleSheet.textContent = rippleStyle;
document.head.appendChild(rippleStyleSheet);

// Performance optimization
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Optimize scroll events
    const scrollHandlers = [];
    window.addEventListener('scroll', debounce(() => {
        scrollHandlers.forEach(handler => handler());
    }, 16));
}

// Initialize performance optimizations
optimizePerformance();

// Export functions for external use
window.JalmitraJS = {
    showNotification,
    debounce,
    initLiveDataSimulation
};