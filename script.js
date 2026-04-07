/**
 * Villa Maria Pia — script.js
 * Animazioni leggere, navbar sticky, scroll reveal, hamburger menu
 */

(function () {
  'use strict';

  /* ============================================
     JS READY — abilita animazioni CSS
     Aggiunto come primissima cosa: se JS è attivo, il CSS
     body.js-ready porta opacity:0 e poi .visible la ripristina.
     Se JS non gira (file locale bloccato ecc.) i testi restano visibili.
  ============================================ */
  document.body.classList.add('js-ready');


  /* ============================================
     NAVBAR — STICKY + SCROLL STATE
  ============================================ */
  const navbar = document.getElementById('navbar');
  const heroSection = document.getElementById('hero');

  function updateNavbar() {
    const scrollY = window.scrollY;
    const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight - 80 : 0;

    if (scrollY > 30) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('on-hero');
    } else {
      navbar.classList.remove('scrolled');
      // on-hero solo se l'hero esiste ed è visibile
      if (heroSection) {
        navbar.classList.add('on-hero');
      }
    }
  }

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

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

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
            const siblings = Array.from(
              entry.target.parentElement.querySelectorAll('.reveal')
            );
            const index = siblings.indexOf(entry.target);

            if (index > 0) {
              const delay = Math.min(index * 0.1, 0.5);
              entry.target.style.transitionDelay = delay + 's';
            }

            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ============================================
     HERO — ANIMAZIONI AL CARICAMENTO
  ============================================ */
  const heroEls = document.querySelectorAll('.reveal-hero');
  const heroImg = document.querySelector('.hero-image');

  if (heroImg) {
    heroImg.addEventListener('load', function () {
      heroImg.classList.add('loaded');
    });
    if (heroImg.complete) {
      heroImg.classList.add('loaded');
    }
  }

  // Trigger immediato per elementi hero
  function triggerHeroReveal() {
    setTimeout(function () {
      heroEls.forEach(function (el) {
        el.classList.add('visible');
      });
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', triggerHeroReveal);
  } else {
    triggerHeroReveal();
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
  const heroImageWrap = document.querySelector('.hero-image-wrap');

  if (heroSection && heroImageWrap) {
    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      const heroH = heroSection.offsetHeight;

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
     ACTIVE NAV LINK
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


  console.log('\u{1F33F} Villa Maria Pia — script caricato');

})();


/* ============================================
   LANGUAGE TOGGLE — IT / EN
   Tutte le traduzioni sono qui. Per aggiungere
   testi: aggiungi data-i18n="chiave" nell'HTML
   e la coppia chiave/testo in questo oggetto.
============================================ */
(function () {

  var translations = {

    en: {
      /* Meta & html lang */
      _lang: 'en',
      _html_lang: 'en',
      _title: 'Villa Maria Pia — B&B in Monopoli, Puglia',
      _flag: '\uD83C\uDDEC\uD83C\uDDE7',  /* 🇬🇧 */
      _label: 'EN',

      /* Navbar */
      nav_villa:     'The Villa',
      nav_rooms:     'Rooms',
      nav_breakfast: 'Breakfast',
      nav_guests:    'Guests',
      nav_book:      'Book Now',

      /* Hero */
      hero_label:    'Monopoli · Puglia',
      hero_scroll:   'Scroll',
      hero_discover: 'Discover the villa',

      /* Intro */
      intro_label: 'B&B · Monopoli',
      intro_cta:   'Get in touch',
      intro_tag:   'Monopoli, Puglia',

      /* Features */
      feat_label: 'Why choose us',

      /* Rooms */
      rooms_label: 'Where to sleep',
      rooms_cta:   'Check availability',

      /* Breakfast */
      bk_label: 'Mornings at Villa Maria Pia',

      /* Location */
      loc_label: 'Where we are',

      /* Reviews */
      rev_label: 'What our guests say',

      /* CTA */
      cta_label: 'Ready to welcome you',
      cta_email: 'Chat on WhatsApp',
      cta_call:  'WhatsApp',

      /* Footer */
      foot_contact: 'Contact',
      foot_where:   'Where we are',
      foot_follow:  'Follow us',
      foot_credit:  'Crafted with care',

      /* Full block translations (innerHTML) */
      hero_title_h1:    'Where the Mediterranean<br><em>feels like home</em>',
      hero_subtitle_p:  'A boutique stay with only 4 rooms, a curated breakfast experience and genuine local hospitality in Monopoli.',
      intro_title_h2:   'A small boutique B&B.<br><em>Made to feel personal.</em>',
      intro_body_html:  '<p>Villa Maria Pia is a small boutique B&amp;B in Monopoli with only 4 rooms, created to offer an intimate, relaxed stay with attention to every detail.</p><p>Every morning, guests are invited to enjoy our Breakfast Experience at the family café, just a few minutes from the villa, with cappuccino, fresh orange juice, eggs prepared on the spot and artisan baked products.</p><p>The property also offers private unguarded parking, making it an ideal choice for guests looking for authenticity, atmosphere and a true local experience.</p>',
      feat_title_h2:    'What makes<br><em>Villa Maria Pia</em> special',
      feat_1_title:     'Quiet location',
      feat_1_desc:      'A peaceful area just a few minutes from Monopoli’s centre and its beaches, ideal for balancing relaxation and convenience.',
      feat_2_title:     'Breakfast Experience',
      feat_2_desc:      'Cappuccino, fresh orange juice, eggs prepared to order and artisan baked goods at the family café turn breakfast into part of the stay.',
      feat_3_title:     'Boutique atmosphere',
      feat_3_desc:      'Only four rooms, designed to feel intimate, curated and welcoming, for guests who want a stay with personality.',
      feat_4_title:     'Private parking',
      feat_4_desc:      'The villa also offers private unguarded parking, a practical detail that makes arrival and day trips around Puglia easier.',
      feat_5_title:     'Family hospitality',
      feat_5_desc:      'We are a family who runs Villa Maria Pia with passion, offering thoughtful hospitality and personal advice on Monopoli and its surroundings.',
      rooms_title_h2:   'The villa\'s rooms',
      rooms_intro_p:    'Four rooms with distinct identities, designed for guests looking for a calm, intimate and carefully curated stay.',
      room1_badge:      'Relax Room',
      room1_name:       'Relax Room',
      room1_desc:       'A calm and welcoming room designed for a quiet stay, with a bright atmosphere and all the comfort needed for a relaxing break in Monopoli.',
      room1_am1: 'Air conditioning', room1_am2: 'Free Wi-Fi', room1_am3: 'Private bathroom', room1_am4: 'TV',
      room2_badge:      'Pia Room',
      room2_name:       'Pia Room',
      room2_desc:       'An intimate room with a warm, curated style, ideal for guests looking for a simple but refined stay with a boutique feel.',
      room2_am1: 'Private terrace', room2_am2: 'Air conditioning', room2_am3: 'Free Wi-Fi', room2_am4: 'Mini fridge',
      room3_badge:      'Garden Room',
      room3_name:       'Garden Room',
      room3_desc:       'A bright room with a soft and restful atmosphere, inspired by the villa’s outdoor calm and perfect for guests who value tranquillity.',
      room3_am1: 'Air conditioning', room3_am2: 'Free Wi-Fi', room3_am3: 'Private bathroom', room3_am4: 'Mini fridge',
      room4_badge:      'Terrace Room',
      room4_name:       'Terrace Room',
      room4_desc:       'A more open and airy option, ideal for guests who love an outdoor corner and a slower rhythm, especially in the first moments of the morning.',
      room4_am1: 'Private terrace', room4_am2: 'Air conditioning', room4_am3: 'Free Wi-Fi', room4_am4: 'Mini fridge',
      bk_title_h2:      'The Breakfast<br><em>Experience</em>',
      bk_body_html:     '<p>Every morning, guests are invited to enjoy our Breakfast Experience at the family café, just a few minutes from the villa.</p><p>Cappuccino, fresh orange juice, eggs prepared on the spot and artisan baked products make breakfast part of the stay, not just a service.</p><p>It is the kind of morning ritual that makes you think you would come here even just for breakfast.</p>',
      bk_tag1: 'Breakfast Experience', bk_tag2: 'Fresh orange juice', bk_tag3: 'Eggs made to order', bk_tag4: 'Artisan bakery',
      loc_title_h2:     'Monopoli and Puglia<br><em>within easy reach</em>',
      loc_body_html:    '<p>Villa Maria Pia is located in a quiet area just a few minutes from the centre of Monopoli and its beautiful beaches.</p><p>The historic centre, with its white streets, local restaurants and charming harbour, is easy to reach and represents the most authentic side of the city.</p><p>The villa is also an excellent base for discovering Puglia, with places such as Polignano a Mare, Alberobello and the Valle d’Itria within easy reach.</p><p>A perfect balance between relaxation and exploration.</p>',
      dist1_place: 'Monopoli historic centre', dist1_time: '5 min on foot',
      dist2_place: 'Sea &amp; beaches',        dist2_time: '10 min on foot',
      dist3_place: 'Polignano a Mare',         dist3_time: '15 min by car',
      dist4_place: 'Alberobello',              dist4_time: '40 min by car',
      dist5_place: 'Bari Airport',             dist5_time: '45 min by car',
      rev_title_h2:     'Words from<br><em>our guests</em>',
      rev1_text:  '"The breakfast is something I won\'t easily forget. Artisan products, attention to every detail, a table laid with genuine care. And the rooms are exactly as they appear in the photos: light-filled, spotless and welcoming. We will absolutely be back."',
      rev1_name:  'Federica M.',   rev1_origin: 'Milan · July 2024',
      rev2_text:  '"We stayed four nights and it felt like visiting a friend\'s home in the most beautiful part of Italy. The hosts are genuinely warm, the room was spotless and comfortable, and the location is perfect — quiet, but minutes from everything. Highly recommended."',
      rev2_name:  'James &amp; Claire H.', rev2_origin: 'London · August 2024',
      rev3_text:  '"We chose Villa Maria Pia for our anniversary and couldn\'t have made a better choice. An intimate atmosphere, a quiet yet strategic location for exploring Monopoli and the surrounding area. The owners recommended restaurants and places we would never have found on our own."',
      rev3_name:  'Lorenzo &amp; Anna P.', rev3_origin: 'Turin · September 2024',
      cta_title_h2:     'Start planning<br><em>your Puglia</em>',
      cta_subtitle_p:   'Write to us on WhatsApp to check availability, ask about the rooms or receive more information about Villa Maria Pia.',
      foot_tagline: 'Boutique B&B · Monopoli, Puglia',
    },

    it: {
      _lang: 'it',
      _html_lang: 'it',
      _title: 'Villa Maria Pia — B&B a Monopoli, Puglia',
      _flag: '\uD83C\uDDEE\uD83C\uDDF9',  /* 🇮🇹 */
      _label: 'IT',

      nav_villa:     'La Villa',
      nav_rooms:     'Camere',
      nav_breakfast: 'Colazione',
      nav_guests:    'Ospiti',
      nav_book:      'Prenota',

      hero_label:    'Monopoli · Puglia',
      hero_scroll:   'Scorri',
      hero_discover: 'Scopri la villa',

      intro_label: 'B&B · Monopoli',
      intro_cta:   'Contattaci',
      intro_tag:   'Monopoli, Puglia',

      feat_label: 'Perché sceglierci',
      rooms_label: 'Dove dormire',
      rooms_cta:   'Richiedi disponibilità',
      bk_label: 'Il mattino a Villa Maria Pia',
      loc_label: 'Dove siamo',
      rev_label: 'Chi ci ha già scelto',
      cta_label: 'Pronti ad accoglierti',
      cta_email: 'Scrivici su WhatsApp',
      cta_call:  'WhatsApp',
      foot_contact: 'Contatti',
      foot_where:   'Dove siamo',
      foot_follow:  'Seguici',
      foot_credit:  'Sito realizzato con cura artigianale',

      hero_title_h1:    'Dove il Mediterraneo<br><em>diventa casa</em>',
      hero_subtitle_p:  'Un soggiorno boutique con solo 4 camere, breakfast experience e ospitalità autentica a Monopoli.',
      intro_title_h2:   'Un piccolo boutique B&B.<br><em>Curato nei dettagli.</em>',
      intro_body_html:  '<p>Villa Mariapia è una piccola boutique B&amp;B a Monopoli con solo 4 camere, pensata per offrire un soggiorno intimo, rilassato e curato nei dettagli.</p><p>Ogni mattina gli ospiti sono invitati a vivere la nostra Breakfast Experience nel café di famiglia, a pochi minuti dalla villa, dove vengono serviti cappuccino, spremuta fresca, uova preparate al momento e prodotti da forno artigianali.</p><p>La struttura dispone inoltre di parcheggio privato non custodito, ideale per chi cerca autenticità, atmosfera e un’esperienza locale.</p>',
      feat_title_h2:    'Quello che rende speciale<br><em>Villa Maria Pia</em>',
      feat_1_title:     'Posizione tranquilla',
      feat_1_desc:      'Una zona tranquilla a pochi minuti dal centro di Monopoli e dalle sue spiagge, ideale per un perfetto equilibrio tra relax e comodità.',
      feat_2_title:     'Breakfast Experience',
      feat_2_desc:      'Cappuccino, spremuta fresca, uova preparate al momento e prodotti da forno artigianali nel café di famiglia trasformano la colazione in parte dell’esperienza.',
      feat_3_title:     'Atmosfera boutique',
      feat_3_desc:      'Solo quattro camere, pensate per essere intime, curate e accoglienti, per chi desidera un soggiorno con personalità.',
      feat_4_title:     'Parcheggio privato',
      feat_4_desc:      'La villa dispone anche di parcheggio privato non custodito, un dettaglio pratico che rende più semplice l’arrivo e le escursioni in Puglia.',
      feat_5_title:     'Ospitalità di famiglia',
      feat_5_desc:      'Siamo una famiglia che gestisce con passione Villa Maria Pia, offrendo accoglienza autentica e consigli personalizzati su Monopoli e dintorni.',
      rooms_title_h2:   'Le camere della villa',
      rooms_intro_p:    'Ogni spazio è pensato per offrire un riposo autentico: aria, luce, comfort e quella sensazione di cura che si percepisce in ogni dettaglio.',
      room1_badge: 'Camera Relax', room1_name: 'Camera Relax',
      room1_desc:  'Una camera calma e accogliente, pensata per un soggiorno rilassante, luminosa e dotata di tutto il comfort necessario per una pausa a Monopoli.',
      room1_am1: 'Aria condizionata', room1_am2: 'Wi-Fi gratuito', room1_am3: 'Bagno privato', room1_am4: 'TV',
      room2_badge: 'Camera Pia', room2_name: 'Camera Pia',
      room2_desc:  'Una camera intima dallo stile caldo e curato, ideale per chi cerca un soggiorno semplice ma raffinato, con un tocco boutique.',
      room2_am1: 'Terrazzo privato', room2_am2: 'Aria condizionata', room2_am3: 'Wi-Fi gratuito', room2_am4: 'Minifrigo',
      room3_badge: 'Camera Giardino', room3_name: 'Camera Giardino',
      room3_desc:  'Una camera luminosa dall’atmosfera morbida e riposante, ispirata alla quiete esterna della villa e perfetta per chi ama la tranquillità.',
      room3_am1: 'Aria condizionata', room3_am2: 'Wi-Fi gratuito', room3_am3: 'Bagno privato', room3_am4: 'Minifrigo',
      room4_badge: 'Camera Terrazza', room4_name: 'Camera Terrazza',
      room4_desc:  'Una soluzione più aperta e ariosa, ideale per chi ama avere uno spazio esterno e vivere il soggiorno con un ritmo più lento.',
      room4_am1: 'Terrazza privata', room4_am2: 'Aria condizionata', room4_am3: 'Wi-Fi gratuito', room4_am4: 'Minifrigo',
      bk_title_h2:  'La Breakfast<br><em>Experience</em>',
      bk_body_html: '<p>Ogni mattina gli ospiti sono invitati a vivere la nostra Breakfast Experience nel café di famiglia, a pochi minuti dalla villa.</p><p>Cappuccino, spremuta fresca, uova preparate al momento e prodotti da forno artigianali rendono la colazione parte del soggiorno, non un semplice servizio.</p><p>È il tipo di rituale mattutino che ti fa pensare che verresti qui anche solo per la colazione.</p>',
      bk_tag1: 'Breakfast Experience', bk_tag2: 'Spremuta fresca', bk_tag3: 'Uova preparate al momento', bk_tag4: 'Forno artigianale',
      loc_title_h2:  'Monopoli e la Puglia<br><em>a portata di mano</em>',
      loc_body_html: '<p>Villa Maria Pia si trova in una posizione tranquilla a pochi minuti dal centro di Monopoli e dalle sue splendide spiagge.</p><p>Il centro storico, con i suoi vicoli bianchi, i ristoranti tipici e il caratteristico porto, è facilmente raggiungibile e rappresenta il cuore autentico della città.</p><p>La zona è ideale anche come punto di partenza per esplorare la Puglia, con località come Polignano a Mare, Alberobello e la Valle d’Itria nelle vicinanze.</p><p>Un equilibrio perfetto tra relax e scoperta del territorio.</p>',
      dist1_place: 'Centro storico Monopoli', dist1_time: '5 min a piedi',
      dist2_place: 'Mare e spiagge',          dist2_time: '10 min a piedi',
      dist3_place: 'Polignano a Mare',         dist3_time: '15 min in auto',
      dist4_place: 'Alberobello',              dist4_time: '40 min in auto',
      dist5_place: 'Aeroporto di Bari',        dist5_time: '45 min in auto',
      rev_title_h2: 'Le parole<br><em>dei nostri ospiti</em>',
      rev1_text:  '"La colazione è qualcosa che non dimenticherò facilmente. Prodotti artigianali, cura nei dettagli, un tavolo imbandito con amore. E le camere sono esattamente come appaiono nelle foto: luminose, pulite, accoglienti. Torneremo sicuramente."',
      rev1_name:  'Federica M.',      rev1_origin: 'Milano · luglio 2024',
      rev2_text:  '"We stayed four nights and it felt like visiting a friend\'s home in the most beautiful part of Italy. The hosts are genuinely warm, the room was spotless and comfortable, and the location is perfect — quiet, but minutes from everything. Highly recommended."',
      rev2_name:  'James &amp; Claire H.', rev2_origin: 'London · agosto 2024',
      rev3_text:  '"Abbiamo scelto Villa Maria Pia per il nostro anniversario e non potevamo fare scelta migliore. Atmosfera intima, posizione tranquilla ma strategica per visitare Monopoli e i dintorni. I proprietari ci hanno consigliato ristoranti e mete magnifiche che non avremmo trovato da soli."',
      rev3_name:  'Lorenzo &amp; Anna P.', rev3_origin: 'Torino · settembre 2024',
      cta_title_h2:   'Inizia a pianificare<br><em>la tua Puglia</em>',
      cta_subtitle_p: 'Scrivici su WhatsApp per verificare la disponibilità, chiedere informazioni sulle camere o saperne di più su Villa Maria Pia.',
      foot_tagline: 'Boutique B&B · Monopoli, Puglia',
    }
  };

  /* ---- State ---- */
  var currentLang = 'en'; /* pagina parte in inglese */

  /* ---- DOM references ---- */
  var btn      = document.getElementById('lang-toggle');
  var flagEl   = document.getElementById('lang-flag');
  var labelEl  = document.getElementById('lang-label');

  if (!btn) return; /* safety */

  /* ---- Apply translations ---- */
  function applyLang(lang) {
    var t = translations[lang];
    if (!t) return;

    /* html lang attribute & title */
    document.documentElement.lang = t._html_lang;
    document.title = t._title;

    /* --- data-i18n simple text --- */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.innerHTML = t[key];
    });

    /* --- Hero title & subtitle (complex blocks) --- */
    var heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.innerHTML = t.hero_title_h1;

    var heroSub = document.querySelector('.hero-subtitle');
    if (heroSub) heroSub.innerHTML = t.hero_subtitle_p;

    /* --- Intro body --- */
    var introTitle = document.querySelector('.intro-text .section-title');
    if (introTitle) introTitle.innerHTML = t.intro_title_h2;

    var introBody = document.querySelector('.intro-body');
    if (introBody) introBody.innerHTML = t.intro_body_html;

    /* --- Features --- */
    var featTitle = document.querySelector('.features-section .section-title');
    if (featTitle) featTitle.innerHTML = t.feat_title_h2;

    var featCards = document.querySelectorAll('.feature-card');
    var featKeys = [1,2,3,4,5];
    featCards.forEach(function (card, i) {
      var k = featKeys[i];
      var titleEl = card.querySelector('.feature-title');
      var descEl  = card.querySelector('.feature-desc');
      if (titleEl && t['feat_'+k+'_title']) titleEl.innerHTML = t['feat_'+k+'_title'];
      if (descEl  && t['feat_'+k+'_desc'])  descEl.innerHTML  = t['feat_'+k+'_desc'];
    });

    /* --- Rooms --- */
    var roomsTitle = document.querySelector('.rooms-section .section-title');
    if (roomsTitle) roomsTitle.innerHTML = t.rooms_title_h2;

    var roomsIntro = document.querySelector('.rooms-intro');
    if (roomsIntro) roomsIntro.innerHTML = t.rooms_intro_p;

    var roomCards = document.querySelectorAll('.room-card');
    roomCards.forEach(function (card, i) {
      var k = i + 1;
      var badge = card.querySelector('.room-badge');
      var name  = card.querySelector('.room-name');
      var desc  = card.querySelector('.room-desc');
      var ams   = card.querySelectorAll('.room-amenities li');
      if (badge && t['room'+k+'_badge']) badge.innerHTML = t['room'+k+'_badge'];
      if (name  && t['room'+k+'_name'])  name.innerHTML  = t['room'+k+'_name'];
      if (desc  && t['room'+k+'_desc'])  desc.innerHTML  = t['room'+k+'_desc'];
      ams.forEach(function (li, j) {
        var amKey = 'room'+k+'_am'+(j+1);
        if (t[amKey]) li.innerHTML = t[amKey];
      });
    });

    /* --- Breakfast --- */
    var bkTitle = document.querySelector('.breakfast-section .section-title');
    if (bkTitle) bkTitle.innerHTML = t.bk_title_h2;

    var bkBody = document.querySelector('.breakfast-body');
    if (bkBody) bkBody.innerHTML = t.bk_body_html;

    var bkTags = document.querySelectorAll('.breakfast-tags .tag');
    [1,2,3,4].forEach(function (k, i) {
      if (bkTags[i] && t['bk_tag'+k]) bkTags[i].innerHTML = t['bk_tag'+k];
    });

    /* --- Location --- */
    var locTitle = document.querySelector('.territory-section .section-title');
    if (locTitle) locTitle.innerHTML = t.loc_title_h2;

    var locBody = document.querySelector('.territory-text');
    if (locBody) {
      /* replace only the p tags, keep the distance-list */
      var distList = locBody.querySelector('.distance-list');
      locBody.innerHTML = t.loc_body_html;
      if (distList) locBody.appendChild(distList);
    }

    /* distances */
    var distItems = document.querySelectorAll('.distance-item');
    distItems.forEach(function (item, i) {
      var k = i + 1;
      var place = item.querySelector('.distance-place');
      var time  = item.querySelector('.distance-time');
      if (place && t['dist'+k+'_place']) place.innerHTML = t['dist'+k+'_place'];
      if (time  && t['dist'+k+'_time'])  time.innerHTML  = t['dist'+k+'_time'];
    });

    /* --- Reviews --- */
    var revTitle = document.querySelector('.reviews-section .section-title');
    if (revTitle) revTitle.innerHTML = t.rev_title_h2;

    var revCards = document.querySelectorAll('.review-card');
    revCards.forEach(function (card, i) {
      var k = i + 1;
      var text   = card.querySelector('.review-text');
      var name   = card.querySelector('.review-name');
      var origin = card.querySelector('.review-origin');
      if (text   && t['rev'+k+'_text'])   text.innerHTML   = t['rev'+k+'_text'];
      if (name   && t['rev'+k+'_name'])   name.innerHTML   = t['rev'+k+'_name'];
      if (origin && t['rev'+k+'_origin']) origin.innerHTML = t['rev'+k+'_origin'];
    });

    /* --- CTA --- */
    var ctaTitle = document.querySelector('.cta-content .section-title');
    if (ctaTitle) ctaTitle.innerHTML = t.cta_title_h2;

    var ctaSub = document.querySelector('.cta-subtitle');
    if (ctaSub) ctaSub.innerHTML = t.cta_subtitle_p;

    /* --- Footer tagline --- */
    var tagline = document.querySelector('.footer-tagline');
    if (tagline && t.foot_tagline) tagline.innerHTML = t.foot_tagline;

    /* --- Toggle button --- */
    flagEl.innerHTML  = t._flag;
    labelEl.innerHTML = t._label;
  }

  /* ---- Toggle handler ---- */
  btn.addEventListener('click', function () {
    currentLang = currentLang === 'en' ? 'it' : 'en';

    /* flip animation */
    btn.classList.add('switching');
    setTimeout(function () { btn.classList.remove('switching'); }, 320);

    applyLang(currentLang);

    /* save preference */
    try { localStorage.setItem('vmp_lang', currentLang); } catch(e) {}
  });

  /* ---- Init: restore saved language or default to EN ---- */
  try {
    var saved = localStorage.getItem('vmp_lang');
    if (saved && translations[saved]) currentLang = saved;
  } catch(e) {}

  applyLang(currentLang);

})();
