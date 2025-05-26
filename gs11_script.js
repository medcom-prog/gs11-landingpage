document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded - initializing animations");

  // --- Update Copyright Year ---
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- Enhanced Scroll Animations using Intersection Observer ---
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log("Element intersecting:", entry.target);

        // Get stagger delay if present
        const delay = entry.target.dataset.staggerDelay
          ? parseInt(entry.target.dataset.staggerDelay) * 150
          : 0;

        // Add visible class after delay
        setTimeout(() => {
          entry.target.classList.add("is-visible");
        }, delay);

        // Stop observing after animation
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  console.log(`Found ${animatedElements.length} elements to animate`);

  const sections = {};

  animatedElements.forEach((el) => {
    const section = el.closest('section') || document.body;
    const sectionId = section.id || 'main';

    if (!sections[sectionId]) {
      sections[sectionId] = [];
    }

    sections[sectionId].push(el);
  });

  Object.values(sections).forEach(sectionElements => {
    sectionElements.forEach((el, index) => {
      el.dataset.staggerDelay = index % 5;
      observer.observe(el);
    });
  });

  // --- Animate hero inner content on page load ---
  const heroContent = document.querySelectorAll(".hero-section [data-animate]");
  console.log(`Found ${heroContent.length} hero elements to animate`);

  heroContent.forEach((el) => {
    const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 200;
    setTimeout(() => {
      el.classList.add("animated");
    }, delay + 300);
  });

  // --- Smooth Scrolling for internal links ---
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

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // --- Form Submission with Basin integration ---
  const contactForm = document.getElementById("landing-page-contact-form");
  const successBox = document.getElementById("form-success");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

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
          contactForm.style.display = "none";
          successBox.style.display = "block";
        } else {
          alert("Noe gikk galt. Vennligst prøv igjen.");
        }
      } catch (error) {
        alert("En feil oppstod: " + error.message);
      }
    });
  }
});

// --- Fade in hero section + parallax scroll ---
window.addEventListener("load", () => {
  console.log("Window loaded - initializing hero animations");

  const hero = document.querySelector(".hero-section");
  if (hero) {
    setTimeout(() => {
      hero.classList.add("hero-visible");
    }, 200);
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

  let lastScrollTime = 0;
  window.addEventListener("scroll", () => {
    const now = Date.now();
    if (now - lastScrollTime > 20) {
      lastScrollTime = now;
      animateOnScroll();
    }
  });

  animateOnScroll();
});
