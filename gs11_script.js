/**
 * GS11 Sikkerhet Landing Page JavaScript
 * Optimized for mobile devices
 */

// Immediately-invoked function expression to avoid global scope pollution
(function() {
  // Initialize critical functionality when DOM is loaded
  document.addEventListener("DOMContentLoaded", initializeCriticalFunctions);
  
  // Initialize non-critical functionality after window load
  window.addEventListener("load", function() {
    // Delay non-critical initializations to prioritize page rendering
    setTimeout(initializeNonCriticalFunctions, 100);
  });
  
  // Handle viewport height for mobile
  function updateVHVariable() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  // Initialize critical functions needed for basic page functionality
  function initializeCriticalFunctions() {
    console.log("DOM fully loaded - initializing critical functions");
    
    // Update current year in footer
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
    
    // Initialize form validation
    setupFormValidation();
    
    // Initialize hero section
    initializeHero();
    
    // Update viewport height for mobile
    updateVHVariable();
    window.addEventListener('resize', debounce(updateVHVariable, 150));
    window.addEventListener('orientationchange', updateVHVariable);
    
    // Setup network status handling
    setupNetworkStatusHandling();
    
    // Setup smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Optimize for touch devices
    setupTouchOptimizations();
    
    // Check for reduced motion preference
    checkReducedMotionPreference();
  }
  
  // Initialize non-critical functions that can be delayed
  function initializeNonCriticalFunctions() {
    console.log("Window loaded - initializing non-critical functions");
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Setup parallax effects
    setupParallaxEffects();
    
    // Setup lazy loading for images
    setupLazyImages();
    
    // Enhance accessibility
    enhanceAccessibility();
  }
  
  // Initialize hero section animations
  function initializeHero() {
    const hero = document.querySelector(".hero-section");
    if (hero) {
      setTimeout(() => {
        hero.classList.add("hero-visible");
      }, 200);
      
      const heroContent = document.querySelectorAll(".hero-section [data-animate]");
      console.log(`Found ${heroContent.length} hero elements to animate`);
      
      heroContent.forEach((el) => {
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 200;
        setTimeout(() => {
          el.classList.add("animated");
        }, delay + 300);
      });
    }
  }
  
  // Setup scroll animations with Intersection Observer
  function setupScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers that don't support IntersectionObserver
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('is-visible');
      });
      return;
    }
    
    const isMobile = window.innerWidth < 768;
    
    const observerOptions = {
      root: null,
      rootMargin: isMobile ? "10px" : "0px",
      threshold: isMobile ? 0.1 : 0.15
    };
    
    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("Element intersecting:", entry.target);
          const delay = entry.target.dataset.staggerDelay
            ? parseInt(entry.target.dataset.staggerDelay) * (isMobile ? 100 : 150)
            : 0;
            
          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, delay);
          
          observer.unobserve(entry.target);
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    console.log(`Found ${animatedElements.length} elements to animate`);
    
    // Group elements by section for staggered animations
    const sections = {};
    
    animatedElements.forEach((el) => {
      // On mobile, prioritize important elements
      if (isMobile) {
        const isPriority = el.tagName === 'H1' || el.tagName === 'H2' || 
                          el.classList.contains('cta-button');
        
        if (!isPriority && !isInViewport(el)) {
          // On mobile, show non-priority elements without animation if not in viewport
          el.classList.add('is-visible');
          return;
        }
      }
      
      const section = el.closest('section') || document.body;
      const sectionId = section.id || 'main';
      
      if (!sections[sectionId]) {
        sections[sectionId] = [];
      }
      
      sections[sectionId].push(el);
    });
    
    Object.values(sections).forEach(sectionElements => {
      sectionElements.forEach((el, index) => {
        el.dataset.staggerDelay = index % (isMobile ? 3 : 5);
        observer.observe(el);
      });
    });
  }
  
  // Setup parallax effects for hero section
  function setupParallaxEffects() {
    // Skip parallax on mobile devices or if reduced motion is preferred
    if (window.innerWidth < 768 || prefersReducedMotion()) {
      return;
    }
    
    const animateOnScroll = () => {
      const scrollY = window.scrollY;
      const hero = document.querySelector(".hero-section");
      if (hero) {
        const heroHeight = hero.offsetHeight;
        
        if (scrollY <= heroHeight) {
          const parallaxOffset = scrollY * 0.4;
          hero.style.backgroundPositionY = `${parallaxOffset}px`;
        }
      }
    };
    
    // Use requestAnimationFrame for smooth parallax
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          animateOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
    
    animateOnScroll();
  }
  
  // Setup form validation and submission
  function setupFormValidation() {
    const contactForm = document.getElementById("landing-page-contact-form");
    const successBox = document.getElementById("form-success");
    
    if (!contactForm) return;
    
    // Add input mode attributes for better mobile keyboard
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      // Set appropriate inputmode for different field types
      if (input.id === 'phone') {
        input.setAttribute('inputmode', 'tel');
        input.setAttribute('pattern', '[0-9+\\s]*');
        input.setAttribute('placeholder', 'f.eks. 970 12 345');
      } else if (input.id === 'email') {
        input.setAttribute('inputmode', 'email');
        input.setAttribute('autocomplete', 'email');
      }
      
      // Add live validation on blur
      input.addEventListener('blur', function() {
        validateField(this);
      });
    });
    
    // Form submission handler
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      
      // Show loading indicator
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      submitButton.innerHTML = '<span class="loading-spinner"></span> Sender...';
      submitButton.disabled = true;
      
      // Validate all fields
      let isValid = true;
      inputs.forEach(input => {
        if (input.required && !validateField(input)) {
          isValid = false;
        }
      });
      
      if (!isValid) {
        resetSubmitButton();
        return;
      }
      
      // Check network status
      if (!navigator.onLine) {
        showFormError("Du er offline. Skjemaet vil bli sendt når du er tilkoblet igjen.");
        saveFormDataLocally(new FormData(contactForm));
        resetSubmitButton();
        return;
      }
      
      // Submit form
      const formData = new FormData(contactForm);
      
      try {
        const response = await fetch("https://usebasin.com/f/65ab43dc9820", {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json"
          }
        });
        
        if (response.ok) {
          // Track conversion with Facebook Pixel
          if (typeof fbq === 'function') {
            fbq('track', 'Lead');
          }
          
          // Show success message
          contactForm.style.display = "none";
          successBox.style.display = "block";
          
          // Smooth scroll to success message
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          showFormError("Noe gikk galt. Vennligst prøv igjen.");
          resetSubmitButton();
        }
      } catch (error) {
        showFormError("En feil oppstod: " + error.message);
        resetSubmitButton();
      }
      
      function resetSubmitButton() {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
      }
    });
    
    // Track button clicks with Facebook Pixel
    document.querySelectorAll('.cta-button').forEach(button => {
      button.addEventListener('click', () => {
        if (typeof fbq === 'function') {
          fbq('trackCustom', 'KlikkPåKnappeCTA');
        }
      });
    });
    
    // Track phone clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.addEventListener('click', () => {
        if (typeof fbq === 'function') {
          fbq('trackCustom', 'KlikkPåTelefon');
        }
      });
    });
    
    // Track email clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      link.addEventListener('click', () => {
        if (typeof fbq === 'function') {
          fbq('trackCustom', 'KlikkPåEpost');
        }
      });
    });
  }
  
  // Setup smooth scrolling for anchor links
  function setupSmoothScrolling() {
    document.querySelectorAll("a[href^='#']").forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (!href) return;
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 75;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          // Use native smooth scrolling if supported and not reduced motion
          if ('scrollBehavior' in document.documentElement.style && 
              !prefersReducedMotion()) {
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          } else {
            // Fallback for browsers without smooth scrolling
            window.scrollTo(0, offsetPosition);
          }
        }
      });
    });
  }
  
  // Setup touch optimizations for mobile
  function setupTouchOptimizations() {
    document.querySelectorAll('.cta-button, a, button').forEach(element => {
      // Remove 300ms delay on touch devices
      element.style.touchAction = 'manipulation';
      
      // Add active state for better visual feedback
      element.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      }, { passive: true });
      
      element.addEventListener('touchend', function() {
        this.classList.remove('touch-active');
      }, { passive: true });
      
      element.addEventListener('touchcancel', function() {
        this.classList.remove('touch-active');
      }, { passive: true });
    });
  }
  
  // Setup lazy loading for images
  function setupLazyImages() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers that don't support IntersectionObserver
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.getAttribute('data-src');
        img.classList.add('loaded');
      });
      return;
    }
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          
          if (src) {
            img.src = src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        }
      });
    });
    
    // Find all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  // Setup network status handling
  function setupNetworkStatusHandling() {
    const updateNetworkStatus = () => {
      if (!navigator.onLine) {
        showOfflineNotification();
      } else {
        hideOfflineNotification();
        checkSavedFormData();
      }
    };
    
    // Check network status on load
    updateNetworkStatus();
    
    // Listen for network status changes
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
  }
  
  // Check for reduced motion preference
  function checkReducedMotionPreference() {
    if (prefersReducedMotion()) {
      document.body.classList.add('reduced-motion');
      
      // Remove pulse animation
      document.querySelectorAll('.pulse-animation').forEach(el => {
        el.classList.remove('pulse-animation');
      });
    }
  }
  
  // Enhance accessibility
  function enhanceAccessibility() {
    // Add ARIA attributes for better screen reader support
    document.querySelectorAll('.cta-button').forEach(button => {
      if (!button.hasAttribute('aria-label')) {
        button.setAttribute('aria-label', button.textContent.trim());
      }
    });
    
    // Improve form fields
    document.querySelectorAll('form').forEach(form => {
      const formFields = form.querySelectorAll('input, select, textarea');
      formFields.forEach(field => {
        // Connect label and field
        const label = form.querySelector(`label[for="${field.id}"]`);
        if (label) {
          field.setAttribute('aria-labelledby', label.id || `${field.id}-label`);
          if (!label.id) {
            label.id = `${field.id}-label`;
          }
        }
        
        // Add descriptive error messages
        if (field.required) {
          field.setAttribute('aria-required', 'true');
        }
      });
    });
  }
  
  // Handle orientation change
  function handleOrientationChange() {
    // Update viewport height
    updateVHVariable();
    
    // Recalibrate animations
    setupScrollAnimations();
  }
  
  // Listen for orientation changes
  window.addEventListener('orientationchange', () => {
    // Wait a bit to ensure the browser has updated dimensions
    setTimeout(handleOrientationChange, 100);
  });
  
  // Utility Functions
  
  // Check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Check if user prefers reduced motion
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  // Debounce function to limit function calls
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }
  
  // Show offline notification
  function showOfflineNotification() {
    // Check if notification already exists
    if (document.getElementById('offline-notification')) return;
    
    const notification = document.createElement('div');
    notification.id = 'offline-notification';
    notification.textContent = 'Du er offline. Noe innhold kan være utilgjengelig.';
    
    document.body.appendChild(notification);
  }
  
  // Hide offline notification
  function hideOfflineNotification() {
    const notification = document.getElementById('offline-notification');
    if (notification) {
      notification.remove();
    }
  }
  
  // Save form data locally for offline support
  function saveFormDataLocally(formData) {
    const formDataObj = {};
    for (const [key, value] of formData.entries()) {
      formDataObj[key] = value;
    }
    
    localStorage.setItem('savedContactForm', JSON.stringify(formDataObj));
  }
  
  // Check for saved form data and try to submit
  function checkSavedFormData() {
    const savedData = localStorage.getItem('savedContactForm');
    if (!savedData) return;
    
    // Try to send form again
    const formDataObj = JSON.parse(savedData);
    const newFormData = new FormData();
    
    for (const key in formDataObj) {
      newFormData.append(key, formDataObj[key]);
    }
    
    fetch("https://usebasin.com/f/65ab43dc9820", {
      method: "POST",
      body: newFormData,
      headers: {
        Accept: "application/json"
      }
    }).then(response => {
      if (response.ok) {
        localStorage.removeItem('savedContactForm');
        
        // Show success message if form is visible
        const contactForm = document.getElementById("landing-page-contact-form");
        const successBox = document.getElementById("form-success");
        
        if (contactForm && successBox) {
          contactForm.style.display = "none";
          successBox.style.display = "block";
        }
        
        if (typeof fbq === 'function') {
          fbq('track', 'Lead');
        }
      }
    }).catch(error => {
      console.error('Kunne ikke sende skjema:', error);
    });
  }
  
  // Show form error message
  function showFormError(message) {
    const contactForm = document.getElementById("landing-page-contact-form");
    if (!contactForm) return;
    
    // Check if error message element already exists
    let errorElement = contactForm.querySelector('.form-error-message');
    
    if (!errorElement) {
      // Create error message element
      errorElement = document.createElement('div');
      errorElement.className = 'form-error-message';
      
      // Insert at top of form
      contactForm.insertBefore(errorElement, contactForm.firstChild);
    }
    
    // Update error message
    errorElement.textContent = message;
    
    // Scroll to error message
    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remove error message after 5 seconds
    setTimeout(() => {
      errorElement.style.opacity = '0';
      setTimeout(() => {
        if (errorElement.parentNode) {
          errorElement.parentNode.removeChild(errorElement);
        }
      }, 300);
    }, 5000);
  }
  
  // Validate form field
  function validateField(field) {
    // Remove any previous error messages
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
    
    // Reset field style
    field.removeAttribute('aria-invalid');
    field.style.borderColor = '';
    
    // Validate required fields
    if (field.required && !field.value.trim()) {
      showFieldError(field, 'Dette feltet er påkrevd');
      return false;
    }
    
    // Validate email
    if (field.id === 'email' && field.value.trim() && !isValidEmail(field.value)) {
      showFieldError(field, 'Vennligst oppgi en gyldig e-postadresse');
      return false;
    }
    
    // Validate phone (Norwegian format)
    if (field.id === 'phone' && field.value.trim() && !isValidNorwegianPhone(field.value)) {
      showFieldError(field, 'Vennligst oppgi et gyldig norsk telefonnummer');
      return false;
    }
    
    return true;
  }
  
  // Show field error
  function showFieldError(field, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
    field.setAttribute('aria-invalid', 'true');
    field.style.borderColor = 'var(--danger-color)';
    
    // Remove error style when user starts editing
    field.addEventListener('input', function() {
      this.removeAttribute('aria-invalid');
      this.style.borderColor = '';
      const error = this.parentNode.querySelector('.field-error');
      if (error) {
        error.remove();
      }
    }, { once: true });
  }
  
  // Validate email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Validate Norwegian phone number
  function isValidNorwegianPhone(phone) {
    // Remove all non-numeric characters
    const cleanPhone = phone.replace(/\D/g, '');
    // Check if it's a valid Norwegian number (8 digits, optionally with +47/0047 prefix)
    return /^(?:(?:\+|00)47)?[2-9]\d{7}$/.test(cleanPhone);
  }
})();
