// Jalmitra About Page JavaScript
// Interactive features and animations

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
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

  // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeInObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Initialize fade-in animations for cards
  function initializeFadeInAnimations() {
    document.querySelectorAll('.feature-card, .team-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'all 0.6s ease';
      fadeInObserver.observe(card);
    });
  }

  // ===== COUNTER ANIMATION =====
  function animateCounter(element, target, duration = 2000) {
    const targetText = element.textContent || element.innerText;
    const isPercentage = targetText.includes('%');
    const isNumber = !isNaN(parseInt(targetText));
    
    if (!isNumber) {
      return; // Skip animation for non-numeric values
    }
    
    const numericTarget = parseInt(targetText);
    let start = 0;
    const increment = numericTarget / (duration / 16);
    
    const updateCounter = () => {
      start += increment;
      if (start < numericTarget) {
        element.textContent = Math.floor(start) + (isPercentage ? '%' : '');
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = numericTarget + (isPercentage ? '%' : '');
      }
    };
    
    updateCounter();
  }

  // ===== STATS COUNTER ANIMATION =====
  const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll('.stat-number');
        statNumbers.forEach(statNumber => {
          animateCounter(statNumber, statNumber.textContent);
        });
        // Disconnect observer after animation
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  // Observe stats section
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ===== FLOATING ELEMENTS ANIMATION =====
  function animateFloatingElements() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach((icon, index) => {
      // Add random floating animation
      const animationDelay = index * 0.5;
      const duration = 3 + Math.random() * 2; // Random duration between 3-5 seconds
      
      icon.style.animationDelay = `${animationDelay}s`;
      icon.style.animationDuration = `${duration}s`;
      icon.style.animationName = 'float';
      icon.style.animationIterationCount = 'infinite';
      icon.style.animationTimingFunction = 'ease-in-out';
    });
  }

  // ===== PARALLAX EFFECT FOR HERO SECTION =====
  function initializeParallaxEffect() {
    const hero = document.querySelector('.about-hero');
    if (hero) {
      window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
      });
    }
  }

  // ===== HOVER EFFECTS FOR CARDS =====
  function initializeHoverEffects() {
    document.querySelectorAll('.feature-card, .team-card').forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
        this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = 'none';
      });
    });
  }

  // ===== MOBILE MENU TOGGLE =====
  function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
      mobileMenuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.classList.toggle('active');
      });
    }
  }

  // ===== TEAM CARD FLIP EFFECT =====
  function initializeTeamCardFlip() {
    document.querySelectorAll('.team-card').forEach(card => {
      card.addEventListener('click', function() {
        this.classList.toggle('flipped');
      });
    });
  }

  // ===== LAZY LOADING FOR IMAGES =====
  function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
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
  }

  // ===== SCROLL TO TOP BUTTON =====
  function initializeScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.display = 'none';
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'block';
      } else {
        scrollToTopBtn.style.display = 'none';
      }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===== TYPEWRITER EFFECT =====
  function typewriterEffect(element, text, speed = 100) {
    element.textContent = '';
    let i = 0;
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    
    type();
  }

  // ===== INITIALIZE ALL FEATURES =====
  function initializeAllFeatures() {
    initializeFadeInAnimations();
    animateFloatingElements();
    initializeParallaxEffect();
    initializeHoverEffects();
    initializeMobileMenu();
    initializeTeamCardFlip();
    initializeLazyLoading();
    initializeScrollToTop();
    
    // Add typewriter effect to hero title
    const heroTitle = document.querySelector('.about-hero h1');
    if (heroTitle) {
      const originalText = heroTitle.textContent;
      typewriterEffect(heroTitle, originalText, 50);
    }
  }

  // ===== PERFORMANCE OPTIMIZATION =====
  let ticking = false;
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateAnimations);
      ticking = true;
    }
  }
  
  function updateAnimations() {
    // Update any frame-dependent animations here
    ticking = false;
  }

  // ===== ERROR HANDLING =====
  window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send this to an error reporting service
  });

  // ===== INITIALIZE EVERYTHING =====
  initializeAllFeatures();
  
  // Add CSS animations via JavaScript
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    
    .scroll-to-top {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      cursor: pointer;
      z-index: 1000;
      transition: all 0.3s ease;
    }
    
    .scroll-to-top:hover {
      background: #0056b3;
      transform: scale(1.1);
    }
    
    .animate-in {
      animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
});

// ===== UTILITY FUNCTIONS =====
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

function throttle(func, limit) {
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

// Export functions for potential use in other scripts
window.JalmitraAbout = {
  animateCounter,
  typewriterEffect,
  debounce,
  throttle
};