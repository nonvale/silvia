/**
 * Villa Maria Pia — script.js
 * Animazioni leggere, navbar sticky, scroll reveal, hamburger menu
 */

(function () {
  'use strict';

  /* ============================================
     NAVBAR — STICKY + SCROLL STATE
  ============================================ */
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Esegui subito (nel caso la pagina sia già scrollata al caricamento)
  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });


  /* ============================================
     HAMBURGER MENU — MOBILE
  ============================================ */
  const hamburger = document.getElementById('nav-hamburger');
  const mobileOverlay = document.getElementById('nav-mobile-overlay');
  const mobileLinks = document.querySelectorAll('.nav-mobile-link');

  function openMenu() {
    hamburger.classList.add('open');
    mobileOverlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileOverlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (mobileOverlay.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Chiudi il menu quando si clicca un link interno
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Chiudi premendo Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });


  /* ============================================
     SCROLL REVEAL — INTERSECTION OBSERVER
  ============================================ */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Aggiungi stagger delay basato sulla posizione nella griglia
            const siblings = Array.from(
              entry.target.parentElement.querySelectorAll('.reveal')
            );
            const index = siblings.indexOf(entry.target);

            if (index > 0) {
              // Delay progressivo per elementi nella stessa sezione
              const delay = Math.min(index * 0.1, 0.5);
              entry.target.style.transitionDelay = delay + 's';
            }

            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback per browser vecchi
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ============================================
     HERO — ANIMAZIONI AL CARICAMENTO
  ============================================ */
  const heroEls = document.querySelectorAll('.reveal-hero');
  const heroImg = document.querySelector('.hero-image');

  // Attiva l'animazione parallax/zoom sull'immagine hero
  if (heroImg) {
    heroImg.addEventListener('load', function () {
      heroImg.classList.add('loaded');
    });
    // Se è già caricata (cache)
    if (heroImg.complete) {
      heroImg.classList.add('loaded');
    }
  }

  // Trigger immediato per gli elementi hero
  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      heroEls.forEach(function (el) {
        el.classList.add('visible');
      });
    }, 150);
  });

  // Se DOMContentLoaded è già passato
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    setTimeout(function () {
      heroEls.forEach(function (el) {
        el.classList.add('visible');
      });
    }, 150);
  }


  /* ============================================
     SMOOTH SCROLL — LINK INTERNI
  ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
        10
      ) || 72;

      const targetY = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
    });
  });


  /* ============================================
     PARALLAX LEGGERO HERO
  ============================================ */
  const heroSection = document.querySelector('.hero');
  const heroImageWrap = document.querySelector('.hero-image-wrap');

  if (heroSection && heroImageWrap) {
    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      const heroH = heroSection.offsetHeight;

      // Solo mentre l'hero è visibile
      if (scrollY < heroH) {
        const offset = scrollY * 0.3;
        heroImageWrap.style.transform = 'translateY(' + offset + 'px)';
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }


  /* ============================================
     ACTIVE NAV LINK — highlight sezione corrente
  ============================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-link-cta)');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionH = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionH) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });


  /* ============================================
     LAZY IMAGE OBSERVER
  ============================================ */
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('img-loaded');
            imgObserver.unobserve(img);
          }
        });
      },
      { rootMargin: '200px 0px' }
    );

    lazyImages.forEach(function (img) {
      imgObserver.observe(img);
    });
  }


  /* ============================================
     LANGUAGE SWITCHER
  ============================================ */
  const translatableIds = [
    'nav-link-villa', 'nav-link-rooms', 'nav-link-breakfast', 'nav-link-territory', 'nav-link-reviews', 'nav-link-book',
    'mobile-nav-link-villa', 'mobile-nav-link-rooms', 'mobile-nav-link-breakfast', 'mobile-nav-link-territory', 'mobile-nav-link-reviews', 'mobile-nav-link-book',
    'hero-label', 'hero-title', 'hero-title-em', 'hero-subtitle', 'hero-btn-book', 'hero-btn-discover', 'hero-scroll',
    'intro-label', 'intro-title', 'intro-title-em', 'intro-body-1', 'intro-body-2', 'intro-body-3', 'intro-btn',
    'features-label', 'features-title', 'features-title-em', 'feature-1-title', 'feature-1-desc', 'feature-2-title', 'feature-2-desc', 'feature-3-title', 'feature-3-desc', 'feature-4-title', 'feature-4-desc', 'feature-5-title', 'feature-5-desc',
    'rooms-label', 'rooms-title', 'rooms-intro', 'room-1-name', 'room-1-desc', 'room-2-name', 'room-2-desc', 'room-3-name', 'room-3-desc', 'room-4-name', 'room-4-desc',
    'breakfast-label', 'breakfast-title', 'breakfast-title-em', 'breakfast-body-1', 'breakfast-body-2', 'breakfast-body-3', 'breakfast-tag-1', 'breakfast-tag-2', 'breakfast-tag-3', 'breakfast-tag-4',
    'territory-label', 'territory-title', 'territory-title-em', 'territory-body-1', 'territory-body-2', 'territory-item-1', 'territory-item-2', 'territory-item-3', 'territory-item-4', 'territory-item-5',
    'reviews-label', 'reviews-title', 'reviews-title-em', 'review-1-text', 'review-1-author', 'review-1-origin', 'review-2-text', 'review-2-author', 'review-2-origin', 'review-3-text', 'review-3-author', 'review-3-origin',
    'cta-label', 'cta-title', 'cta-title-em', 'cta-subtitle', 'cta-email', 'cta-whatsapp', 'cta-contact-email', 'cta-contact-phone',
  ];

  const originalText = {};
  translatableIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) originalText[id] = el.innerHTML;
  });

  const translations = {
    it: originalText,
    en: {
      'nav-link-villa': 'The Villa',
      'nav-link-rooms': 'Rooms',
      'nav-link-breakfast': 'Breakfast',
      'nav-link-territory': 'Monopoli',
      'nav-link-reviews': 'Guests',
      'nav-link-book': 'Book now',
      'mobile-nav-link-villa': 'The Villa',
      'mobile-nav-link-rooms': 'Rooms',
      'mobile-nav-link-breakfast': 'Breakfast',
      'mobile-nav-link-territory': 'Monopoli',
      'mobile-nav-link-reviews': 'Guests',
      'mobile-nav-link-book': 'Book now',
      'hero-label': 'Monopoli · Puglia',
      'hero-title': 'Where the Mediterranean<br/><em>feels like home</em>',
      'hero-title-em': 'feels like home',
      'hero-subtitle': 'An authentic stay, just steps from the historic center and the sea.',
      'hero-btn-book': 'Book now',
      'hero-btn-discover': 'Discover the villa',
      'hero-scroll': 'Scroll',
      'intro-label': 'B&B · Monopoli',
      'intro-title': 'More than a stay.<br/><em>An experience.</em>',
      'intro-title-em': 'An experience.',
      'intro-body-1': 'Villa Maria Pia is born from a passion for genuine hospitality. A bright villa, a stone’s throw from the heart of Monopoli, where every detail is designed so you feel truly at home: not just a passing guest, but someone awaited with care.',
      'intro-body-2': 'The rooms are spacious, impeccable, flooded with natural light. The common areas invite relaxation. And the atmosphere, that of a lived-in home with passion, is felt from the first moment you cross the threshold.',
      'intro-body-3': 'The location, slightly away from the center, offers the rare quiet of a real holiday — without giving up the convenience of reaching the sea, the historic center and the treasures of the most authentic Puglia in minutes.',
      'intro-btn': 'Contact us',
      'features-label': 'Why choose us',
      'features-title': 'What makes<br/><em>Villa Maria Pia</em> special',
      'features-title-em': 'Villa Maria Pia',
      'feature-1-title': 'Prime location',
      'feature-1-desc': 'A few minutes walk from Monopoli historic center and the sea. Everything you seek is nearby.',
      'feature-2-title': 'Relax and tranquility',
      'feature-2-desc': 'Silence, green and fresh air. A refuge from summer frenzy, for those who really want to rest.',
      'feature-3-title': 'Thoughtful rooms',
      'feature-3-desc': 'Bright spaces, tasteful furnishings, impeccable cleanliness. Every room is prepared with attention for maximum comfort.',
      'feature-4-title': 'Artisanal breakfast',
      'feature-4-desc': 'Fresh, homemade products selected with care. A waking moment that becomes one of the best of the day.',
      'feature-5-title': 'Genuine hospitality',
      'feature-5-desc': 'Small gestures, true availability, honest tips. Hospitality that makes the difference between a stay and a memory.',
      'rooms-label': 'Where to sleep',
      'rooms-title': 'The villa rooms',
      'rooms-intro': 'Every space is designed to offer authentic rest: air, light, comfort and that feeling of care you feel in every detail.',
      'room-1-name': 'Terrace Room',
      'room-1-desc': 'Comfort for two with private terrace and natural light. Air conditioning, private bathroom and garden view.',
      'room-2-name': 'Garden Room',
      'room-2-desc': 'Double room with garden view, ideal for relaxation. Double bed, modern comforts and private bathroom.',
      'room-3-name': 'Girls Room',
      'room-3-desc': 'Space for two with feminine details and warm atmosphere. Comfortable and quiet, private bathroom and air conditioning.',
      'room-4-name': 'Pia Room',
      'room-4-desc': 'Cozy double room with refined details, ideal for couples. Comfortable, with queen-size bed and private bathroom.',
      'breakfast-label': 'Morning at Villa Maria Pia',
      'breakfast-title': 'Breakfast<br/><em>you will remember</em>',
      'breakfast-title-em': 'you will remember',
      'breakfast-body-1': 'There is a ritual many guests mention among their fondest memories: the first morning at Villa Maria Pia, when the scent from the kitchen announces something good.',
      'breakfast-body-2': 'Our breakfast is made with carefully selected products: artisanal pastries, local jams, cheeses and cold cuts from the area, fresh seasonal fruit. A buffet that changes daily with that personal touch no hotel can offer.',
      'breakfast-body-3': 'Not a breakfast to rush. A moment to enjoy slowly, perhaps in the garden, with the changing light of Puglian morning.',
      'breakfast-tag-1': 'Local products',
      'breakfast-tag-2': 'Homemade pastries',
      'breakfast-tag-3': 'Fresh fruit',
      'breakfast-tag-4': 'Gluten-free on request',
      'territory-label': 'Where we are',
      'territory-title': 'Monopoli and Puglia<br/><em>all around you</em>',
      'territory-title-em': 'all around you',
      'territory-body-1': 'Monopoli is one of the pearls of the Puglian Adriatic: a whitewashed historic center descending to the sea, an authentic fishing port, beaches of all kinds a few minutes away. Villa Maria Pia enjoys a privileged position — close enough to walk or cycle everywhere, far enough to preserve peace.',
      'territory-body-2': 'From here, the best Puglia is within reach: Alberobello and its trulli, Polignano a Mare with its caves, Ostuni the White, baroque Lecce. A region that surprises at every turn.',
      'territory-item-1': '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="8" cy="7" r="4" stroke="#B8986A" stroke-width="1.2"/><path d="M8 11 L8 15" stroke="#B8986A" stroke-width="1.2"/></svg><strong>Monopoli historic center</strong> — 5 min walk',
      'territory-item-2': '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="8" cy="7" r="4" stroke="#B8986A" stroke-width="1.2"/><path d="M8 11 L8 15" stroke="#B8986A" stroke-width="1.2"/></svg><strong>Sea and beaches</strong> — 10 min walk',
      'territory-item-3': '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="8" cy="7" r="4" stroke="#B8986A" stroke-width="1.2"/><path d="M8 11 L8 15" stroke="#B8986A" stroke-width="1.2"/></svg><strong>Polignano a Mare</strong> — 15 min by car',
      'territory-item-4': '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="8" cy="7" r="4" stroke="#B8986A" stroke-width="1.2"/><path d="M8 11 L8 15" stroke="#B8986A" stroke-width="1.2"/></svg><strong>Alberobello</strong> — 40 min by car',
      'territory-item-5': '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="8" cy="7" r="4" stroke="#B8986A" stroke-width="1.2"/><path d="M8 11 L8 15" stroke="#B8986A" stroke-width="1.2"/></svg><strong>Bari Airport</strong> — 45 min by car',
      'reviews-label': 'Guests who have already chosen us',
      'reviews-title': 'Words<br/><em>from our guests</em>',
      'reviews-title-em': 'from our guests',
      'review-1-text': '"Breakfast is something I will never forget. Artisanal products, attention to detail, a table set with love. And the rooms are exactly as they appear in the photos: bright, clean, cozy. We will definitely come back."',
      'review-1-author': 'Federica M.',
      'review-1-origin': 'Milan · July 2024',
      'review-2-text': '"We stayed four nights and it felt like visiting a friend\'s home in the most beautiful part of Italy. The hosts are genuinely warm, the room was spotless and comfortable, and the location is perfect — quiet, but minutes from everything. Highly recommended."',
      'review-2-author': 'James & Claire H.',
      'review-2-origin': 'London · August 2024',
      'review-3-text': '"We chose Villa Maria Pia for our anniversary and could not have made a better choice. Intimate atmosphere, peaceful yet strategic location for exploring Monopoli and surroundings. The hosts recommended restaurants and amazing spots we would not have found on our own."',
      'review-3-author': 'Lorenzo & Anna P.',
      'review-3-origin': 'Turin · September 2024',
      'cta-label': 'Ready to welcome you',
      'cta-title': 'Start planning<br/><em>your Puglia</em>',
      'cta-title-em': 'your Puglia',
      'cta-subtitle': 'Write to us to check availability, get information about the rooms or learn more about Villa Maria Pia. We respond within a few hours.',
      'cta-email': 'Write us an email',
      'cta-whatsapp': 'Contact us on WhatsApp',
      'cta-contact-email': '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;"><path d="M4 4 L10 9 L16 4" stroke="currentColor" stroke-width="1.2"/><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.2"/></svg> caffedelcorsomonopoli@gmail.com',
      'cta-contact-phone': '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;"><path d="M6 2 L14 2 C15.1 2 16 2.9 16 4 L16 16 C16 17.1 15.1 18 14 18 L6 18 C4.9 18 4 17.1 4 16 L4 4 C4 2.9 4.9 2 6 2Z" stroke="currentColor" stroke-width="1.2"/><circle cx="10" cy="15" r="1" fill="currentColor"/></svg> +39 338 185 3433',
    },
  };

  function setLanguage(lang) {
    if (!translations[lang]) return;
    translatableIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const value = translations[lang][id];
      if (typeof value !== 'undefined') {
        el.innerHTML = value;
      }
    });

    const gray = translations[lang]['territory-items'] || null;
    const captions = {
      it: ['Foto 1: Porto di Monopoli', 'Foto 2: Trulli di Alberobello'],
      en: ['Photo 1: Monopoli harbour', 'Photo 2: Alberobello trulli'],
    };
    document.querySelectorAll('.territory-img-caption').forEach((el, index) => {
      el.textContent = captions[lang][index] || el.textContent;
    });

    const toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.textContent = lang === 'it' ? 'EN' : 'IT';
    }

    localStorage.setItem('preferred-lang', lang);
  }

  const savedLang = localStorage.getItem('preferred-lang') || 'it';
  setLanguage(savedLang);

  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      const nextLang = (localStorage.getItem('preferred-lang') || 'it') === 'it' ? 'en' : 'it';
      setLanguage(nextLang);
    });
  }

  console.log('🌿 Villa Maria Pia — script caricato');

})();
