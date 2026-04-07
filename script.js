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
      intro_cta:   'Contact us on WhatsApp',
      intro_tag:   'Monopoli, Puglia',

      /* Features */
      feat_label: 'Why choose us',

      /* Rooms */
      rooms_label: 'Where to sleep',
      rooms_cta:   'Check availability on WhatsApp',

      /* Breakfast */
      bk_label: 'Mornings at Villa Maria Pia',

      /* Location */
      loc_label: 'Where we are',

      /* Reviews */
      rev_label: 'What our guests say',

      /* CTA */
      cta_label: 'Ready to welcome you',
      cta_wa: 'Write to us on WhatsApp',
      // cta_call removed (WA only)

      /* Footer */
      foot_contact: 'Contact',
      foot_where:   'Where we are',
      foot_follow:  'Follow us',
      foot_credit:  'Crafted with care',

      /* Full block translations (innerHTML) */
      hero_title_h1:    'Where the Mediterranean<br><em>feels like home</em>',
      hero_subtitle_p:  'An authentic stay, just steps from the old town and the sea.',
      intro_title_h2:   'More than a stay.<br><em>An experience.</em>',
      intro_body_html:  '<p>Villa Mariapia is a small boutique B&amp;B in Monopoli with just 4 rooms, designed to offer an intimate, relaxed and carefully curated stay.</p><p>Every morning our guests are invited to enjoy our <strong>Breakfast Experience</strong> at the family café, just a few minutes from the villa — where cappuccino, fresh-squeezed juice, made-to-order eggs and artisan pastries await.</p><p>The property also features a private (unattended) car park. The perfect choice for those seeking authenticity, atmosphere and a truly local experience.</p>',
      feat_title_h2:    'What makes<br><em>Villa Maria Pia</em> special',
      feat_1_title:     'Ideal location',
      feat_1_desc:      'Just a few minutes\' walk from Monopoli\'s historic centre and a short distance from the sea. Everything you need is close by.',
      feat_2_title:     'Peace &amp; tranquillity',
      feat_2_desc:      'Silence, greenery and fresh air. A retreat from the summer rush, designed for those who truly want to rest.',
      feat_3_title:     'Thoughtfully designed rooms',
      feat_3_desc:      'Light-filled spaces, tasteful furnishings, impeccable cleanliness. Every room is prepared with care to offer you the utmost comfort.',
      feat_4_title:     'Artisan breakfast',
      feat_4_desc:      'Fresh, homemade, lovingly sourced products. A morning moment that becomes one of the highlights of your day.',
      feat_5_title:     'Genuine hospitality',
      feat_5_desc:      'Small gestures, real availability, honest recommendations. The kind of hospitality that turns a stay into a lasting memory.',
      rooms_title_h2:   'The villa\'s rooms',
      rooms_intro_p:    'Every space is designed to offer authentic rest: air, light, comfort and that feeling of care you sense in every single detail.',
      room1_badge:      'Relax Room',
      room1_name:       'Relax Room',
      room1_desc:       'A peaceful haven designed for those who want to truly unwind. Warm tones, soft lighting and carefully chosen details create an atmosphere of calm from the very first moment.',
      room1_am1: 'Air conditioning', room1_am2: 'Free Wi-Fi', room1_am3: 'Private bathroom', room1_am4: 'TV',
      room2_badge:      'Pia Room',
      room2_name:       'Pia Room',
      room2_desc:       'Named after the villa itself, this room embodies its spirit: bright, welcoming and refined. A comfortable retreat with warm colours and an enveloping atmosphere.',
      room2_am1: 'Private terrace', room2_am2: 'Air conditioning', room2_am3: 'Free Wi-Fi', room2_am4: 'Mini fridge',
      room3_badge:      'Garden Room',
      room3_name:       'Garden Room',
      room3_desc:       'Overlooking the garden, this room offers a direct connection with the natural surroundings of the villa. Soft light, natural materials and a quiet setting perfect for a restorative stay.',
      room3_am1: 'Garden view', room3_am2: 'Natural materials', room3_am3: 'Air conditioning', room3_am4: 'Free Wi-Fi',
      room4_badge: 'Terrace Room', room4_name: 'Terrace Room',
      room4_desc: 'Step outside without leaving your room. This suite features a private terrace where you can sip your morning coffee surrounded by the Mediterranean breeze.',
      room4_am1: 'Private terrace', room4_am2: 'Air conditioning', room4_am3: 'Free Wi-Fi', room4_am4: 'Mini fridge',
      bk_title_h2:      'The breakfast<br><em>you\'ll remember</em>',
      bk_body_html:     '<p>Every morning at Villa Mariapia begins with a ritual worth waking up for. Our guests are invited to the family café, just a few minutes\' walk from the villa, to enjoy a real <strong>Breakfast Experience</strong>.</p><p>Freshly brewed cappuccino, cold-pressed orange juice, eggs cooked to order, artisan pastries from local bakeries. Not a standard buffet — a genuine moment of pleasure, prepared with care every single day.</p><p>It\'s the kind of breakfast that makes you want to come back just for that.</p>',
      bk_tag1: 'Local products', bk_tag2: 'Homemade pastries', bk_tag3: 'Fresh fruit', bk_tag4: 'Gluten-free on request',
      loc_title_h2:     'Monopoli and Puglia<br><em>all around you</em>',
      loc_body_html:    '<p>Villa Mariapia sits in a peaceful spot just minutes from the centre of Monopoli and its beautiful beaches. The historic old town — with its whitewashed alleys, traditional restaurants and the characterful fishing harbour — is easy to reach on foot and represents the authentic heart of the city.</p><p>The area is also an ideal base for exploring Puglia: Polignano a Mare, Alberobello and the Valle d\'Itria are all close by. A perfect balance between relaxation and discovery.</p>',
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
      cta_subtitle_p:   'Write to us on WhatsApp to check availability, ask about our rooms or simply find out more. We reply quickly.',
      foot_tagline: 'B&B · Monopoli, Puglia',
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
      intro_cta:   'Contattaci su WhatsApp',
      intro_tag:   'Monopoli, Puglia',

      feat_label: 'Perché sceglierci',
      rooms_label: 'Dove dormire',
      rooms_cta:   'Richiedi disponibilità su WhatsApp',
      bk_label: 'Il mattino a Villa Maria Pia',
      loc_label: 'Dove siamo',
      rev_label: 'Chi ci ha già scelto',
      cta_label: 'Pronti ad accoglierti',
      cta_wa: 'Scrivici su WhatsApp',
      // cta_call removed
      foot_contact: 'Contatti',
      foot_where:   'Dove siamo',
      foot_follow:  'Seguici',
      foot_credit:  'Sito realizzato con cura artigianale',

      hero_title_h1:    'Dove il Mediterraneo<br><em>diventa casa</em>',
      hero_subtitle_p:  'Un soggiorno autentico, a pochi passi dal centro storico e dal mare.',
      intro_title_h2:   'Più di un soggiorno.<br><em>Un\'esperienza.</em>',
      intro_body_html:  '<p>Villa Mariapia è una piccola boutique B&amp;B a Monopoli con sole 4 camere, pensata per offrire un soggiorno intimo, rilassato e curato nei dettagli.</p><p>Ogni mattina gli ospiti sono invitati a vivere la nostra <strong>Breakfast Experience</strong> nel caffè di famiglia, a pochi minuti dalla villa — cappuccino, spremuta fresca, uova al momento e dolci artigianali.</p><p>La struttura dispone inoltre di parcheggio privato non custodito. Una scelta ideale per chi cerca autenticità, atmosfera e un\'esperienza locale vera.</p>',
      feat_title_h2:    'Quello che rende speciale<br><em>Villa Maria Pia</em>',
      feat_1_title:     'Posizione ideale',
      feat_1_desc:      'A pochi minuti a piedi dal centro storico di Monopoli e a breve distanza dal mare. Tutto ciò che cerchi è vicino.',
      feat_2_title:     'Relax e tranquillità',
      feat_2_desc:      'Silenzio, verde e aria pulita. Un rifugio dalla frenesia estiva, pensato per chi vuole davvero riposare.',
      feat_3_title:     'Camere curate',
      feat_3_desc:      'Spazi luminosi, arredi con gusto, pulizia impeccabile. Ogni camera è preparata con attenzione per offrirti il massimo comfort.',
      feat_4_title:     'Colazione artigianale',
      feat_4_desc:      'Prodotti freschi, fatti in casa, ricercati con cura. Un risveglio che diventa uno dei momenti più belli della giornata.',
      feat_5_title:     'Ospitalità autentica',
      feat_5_desc:      'Piccoli gesti, disponibilità vera, consigli sinceri. L\'ospitalità che fa la differenza tra un soggiorno e un ricordo.',
      rooms_title_h2:   'Le camere della villa',
      rooms_intro_p:    'Ogni spazio è pensato per offrire un riposo autentico: aria, luce, comfort e quella sensazione di cura che si percepisce in ogni dettaglio.',
      room1_badge: 'Camera Relax', room1_name: 'Camera Relax',
      room1_desc:  'Un rifugio di pace pensato per chi vuole davvero staccare. Tonalità calde, luce soffusa e dettagli curati creano un'atmosfera di benessere fin dal primo momento.',
      room1_am1: 'Aria condizionata', room1_am2: 'Wi-Fi gratuito', room1_am3: 'Bagno privato', room1_am4: 'TV',
      room2_badge: 'Camera Pia', room2_name: 'Camera Pia',
      room2_desc:  'Porta il nome della villa e ne incarna lo spirito: luminosa, accogliente e raffinata. Un rifugio confortevole con colori caldi e un'atmosfera avvolgente.',
      room2_am1: 'Terrazzo privato', room2_am2: 'Aria condizionata', room2_am3: 'Wi-Fi gratuito', room2_am4: 'Minifrigo',
      room3_badge: 'Camera Giardino', room3_name: 'Camera Giardino',
      room3_desc:  'Affacciata sul giardino, offre un contatto diretto con la natura che circonda la villa. Luce naturale, materiali naturali e silenzio per un soggiorno rigenerante.',
      room3_am1: 'Vista giardino', room3_am2: 'Materiali naturali', room3_am3: 'Aria condizionata', room3_am4: 'Wi-Fi gratuito',
      room4_badge: 'Camera Terrazza', room4_name: 'Camera Terrazza',
      room4_desc: 'Esci all\'aperto senza lasciare la tua camera. Una terrazza privata dove gustare il caffè mattutino con la brezza mediterranea e il silenzio dei tetti di Monopoli.',
      room4_am1: 'Terrazza privata', room4_am2: 'Aria condizionata', room4_am3: 'Wi-Fi gratuito', room4_am4: 'Minifrigo',
      bk_title_h2:  'La colazione<br><em>che ricorderai</em>',
      bk_body_html: '<p>Ogni mattina a Villa Mariapia inizia con un rituale che vale la pena di aspettare. I nostri ospiti sono invitati al caffè di famiglia, a pochi minuti dalla villa, per vivere una vera <strong>Breakfast Experience</strong>.</p><p>Cappuccino appena fatto, succo d\'arancia fresco, uova preparate al momento, dolci artigianali di produzione locale. Non un buffet standard — un vero momento di piacere, curato ogni giorno con passione.</p><p>La colazione che ti fa venir voglia di tornare anche solo per quella.</p>',
      bk_tag1: 'Prodotti locali', bk_tag2: 'Dolci fatti in casa', bk_tag3: 'Frutta fresca', bk_tag4: 'Gluten-free su richiesta',
      loc_title_h2:  'Monopoli e la Puglia<br><em>tutto intorno a te</em>',
      loc_body_html: '<p>Villa Mariapia si trova in una posizione tranquilla a pochi minuti dal centro di Monopoli e dalle sue splendide spiagge. Il centro storico, con i suoi vicoli bianchi, ristoranti tipici e il caratteristico porto, è facilmente raggiungibile a piedi e rappresenta il cuore autentico della città.</p><p>La zona è ideale come punto di partenza per esplorare la Puglia: Polignano a Mare, Alberobello e la Valle d\'Itria sono nelle vicinanze. Un equilibrio perfetto tra relax e scoperta del territorio.</p>',
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
      cta_subtitle_p: 'Scrivici su WhatsApp per verificare le disponibilità, avere informazioni sulle camere o semplicemente per saperne di più. Rispondiamo velocemente.',
      foot_tagline: 'B&B · Monopoli, Puglia',
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
