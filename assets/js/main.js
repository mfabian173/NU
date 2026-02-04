/**
 * NORTHEASTERN CLIMBING TEAM - MAIN JAVASCRIPT
 * Professional interactive functionality
 */

(function() {
  'use strict';

  // ==========================================================================
  // DOM ELEMENTS
  // ==========================================================================
  
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');
  const navMobile = document.querySelector('.nav__mobile');
  const navLinks = document.querySelectorAll('.nav__link');
  const accordionItems = document.querySelectorAll('.accordion__item');
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  const statNumbers = document.querySelectorAll('.stat__number');
  
  // ==========================================================================
  // NAVIGATION
  // ==========================================================================
  
  // Scroll handler for nav
  let lastScroll = 0;
  
  function handleNavScroll() {
    const currentScroll = window.pageYOffset;
    
    if (nav) {
      if (currentScroll > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    
    lastScroll = currentScroll;
  }
  
  // Mobile menu toggle
  function toggleMobileMenu() {
    if (navToggle && navMobile) {
      navToggle.classList.toggle('active');
      navMobile.classList.toggle('active');
      document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
    }
  }
  
  // Close mobile menu when clicking a link
  function closeMobileMenu() {
    if (navToggle && navMobile) {
      navToggle.classList.remove('active');
      navMobile.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  // Set active nav link based on current page
  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (currentPath.includes(href) || (currentPath === '/' && href === 'index.html'))) {
        link.classList.add('active');
      }
    });
  }
  
  // ==========================================================================
  // ACCORDION
  // ==========================================================================
  
  function initAccordion() {
    accordionItems.forEach(item => {
      const header = item.querySelector('.accordion__header');
      
      if (header) {
        header.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          
          // Close all items
          accordionItems.forEach(i => i.classList.remove('active'));
          
          // Open clicked item if it wasn't active
          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });
  }
  
  // ==========================================================================
  // SCROLL ANIMATIONS
  // ==========================================================================
  
  function initScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          
          // Animate stat numbers
          if (entry.target.classList.contains('stat__number')) {
            animateNumber(entry.target);
          }
        }
      });
    }, observerOptions);
    
    animatedElements.forEach(el => observer.observe(el));
    statNumbers.forEach(el => observer.observe(el));
  }
  
  // ==========================================================================
  // NUMBER ANIMATION
  // ==========================================================================
  
  function animateNumber(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const number = parseInt(text.replace(/[^0-9]/g, ''), 10);
    
    if (isNaN(number)) return;
    
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = number / steps;
    
    let current = 0;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), number);
      
      let display = current.toString();
      if (hasPlus) display += '+';
      if (hasPercent) display += '%';
      
      element.textContent = display;
      
      if (step >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);
  }
  
  // ==========================================================================
  // SMOOTH SCROLL
  // ==========================================================================
  
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          const navHeight = nav ? nav.offsetHeight : 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          closeMobileMenu();
        }
      });
    });
  }
  

  // ==========================================================================
  // CURSOR EFFECTS
  // ==========================================================================
  
  function initCursorEffects() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    document.body.appendChild(cursorDot);
    
    document.addEventListener('mousemove', (e) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
    
    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .card, .member-card, .sponsor-card');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorDot.classList.add('hover');
      });
      
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorDot.classList.remove('hover');
      });
    });
  }
  
  // ==========================================================================
  // TYPING EFFECT
  // ==========================================================================
  
  function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    
    type();
  }
  
  // ==========================================================================
  // IMAGE LAZY LOADING
  // ==========================================================================
  
  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  // ==========================================================================
  // FORM HANDLING
  // ==========================================================================
  
  function initForms() {
    const forms = document.querySelectorAll('form[data-ajax]');
    
    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        submitBtn.textContent = 'Sent!';
        submitBtn.classList.add('success');
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('success');
          form.reset();
        }, 2000);
      });
    });
  }
  
  // ==========================================================================
  // TABS
  // ==========================================================================
  
  function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs');
    
    tabContainers.forEach(container => {
      const tabs = container.querySelectorAll('.tab');
      const panels = container.querySelectorAll('.tab-panel');
      
      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
          // Remove active from all
          tabs.forEach(t => t.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));
          
          // Add active to clicked
          tab.classList.add('active');
          panels[index]?.classList.add('active');
        });
      });
    });
  }
  
  // ==========================================================================
  // RIPPLE EFFECT
  // ==========================================================================
  
  function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }
  
  // ==========================================================================
  // YEAR UPDATE
  // ==========================================================================
  
  function updateYear() {
    const yearElements = document.querySelectorAll('[data-year]');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
      el.textContent = currentYear;
    });
  }
  
  // ==========================================================================
  // SCROLL TO TOP
  // ==========================================================================
  
  function initScrollToTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    if (scrollTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
          scrollTopBtn.classList.add('visible');
        } else {
          scrollTopBtn.classList.remove('visible');
        }
      });
      
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }
  
  // ==========================================================================
  // MOUSE FOLLOW EFFECT
  // ==========================================================================
  
  function initMouseFollow() {
    const followElements = document.querySelectorAll('[data-mouse-follow]');
    
    followElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const intensity = parseFloat(el.dataset.mouseFollow) || 0.1;
        
        el.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }
  
  // ==========================================================================
  // PAGE LOADING ANIMATION
  // ==========================================================================
  
  function initPageLoader() {
    const loader = document.querySelector('.page-loader');
    
    if (loader) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          loader.classList.add('loaded');
          document.body.classList.add('page-loaded');
        }, 500);
      });
    } else {
      document.body.classList.add('page-loaded');
    }
  }
  
  // ==========================================================================
  // MAGNETIC BUTTONS
  // ==========================================================================
  
  function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-magnetic');
    
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }
  
  // ==========================================================================
  // TEXT REVEAL ANIMATION
  // ==========================================================================
  
  function initTextReveal() {
    const revealTexts = document.querySelectorAll('.reveal-text');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.5 });
    
    revealTexts.forEach(text => observer.observe(text));
  }
  
  // ==========================================================================
  // INITIALIZE
  // ==========================================================================
  
  function init() {
    // Event Listeners
    window.addEventListener('scroll', handleNavScroll);
    
    if (navToggle) {
      navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Mobile menu links
    if (navMobile) {
      navMobile.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
      });
    }
    
    // Close mobile menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });
    
    // Initialize components
    setActiveNavLink();
    initAccordion();
    initScrollAnimations();
    initSmoothScroll();
    initLazyLoading();
    initForms();
    initTabs();
    initRippleEffect();
    updateYear();
    initScrollToTop();
    initMouseFollow();
    initPageLoader();
    initMagneticButtons();
    initTextReveal();
    
    // Add loaded class to body
    document.body.classList.add('js-loaded');
  }
  
  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();
