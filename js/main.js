/* -------------------------------------------------------------
   WHITELEAF INTERIORS - MAIN JAVASCRIPT & RESPONSIVE HANDLER
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Whiteleaf Interiors - Experience Ready.');

  // Slide-Out Side Menu Drawer Logic
  (function initSideMenu() {
    const sideTrigger = document.getElementById('side-menu-trigger');
    const sidePanel = document.getElementById('side-menu-panel');
    const sideOverlay = document.getElementById('side-menu-overlay');
    const sideClose = document.getElementById('side-menu-close');
    const sideLinks = document.querySelectorAll('.side-nav-link');

    function openSideMenu() {
      if (sidePanel) sidePanel.classList.add('active');
      if (sideOverlay) sideOverlay.classList.add('active');
    }

    function closeSideMenu() {
      if (sidePanel) sidePanel.classList.remove('active');
      if (sideOverlay) sideOverlay.classList.remove('active');
    }

    if (sideTrigger) sideTrigger.addEventListener('click', openSideMenu);
    if (sideClose) sideClose.addEventListener('click', closeSideMenu);
    if (sideOverlay) sideOverlay.addEventListener('click', closeSideMenu);

    sideLinks.forEach((link) => {
      link.addEventListener('click', closeSideMenu);
    });
  })();

  // Lenis Smooth Scroll Initialization & GSAP Ticker Sync
  let lenisInstance = null;
  if (typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenisInstance.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // Smooth Inertia Scroll for all Anchor Links (#contact, #services, #projects, #about, #home)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          if (lenisInstance) {
            lenisInstance.scrollTo(targetEl, { offset: 0, duration: 1.2 });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });

  // Custom Cursor Follower Logic
  const cursor = document.getElementById('custom-cursor');
  const cursorText = document.getElementById('cursor-text');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    const hoverItems = document.querySelectorAll('[data-cursor]');
    hoverItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        if (cursorText) cursorText.textContent = item.getAttribute('data-cursor') || 'VIEW';
      });
      item.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        if (cursorText) cursorText.textContent = '';
      });
    });
  }

  // Minimal Rotating Service Hover Popup Listener
  const popup = document.getElementById('service-hover-popup');
  const popupImg = document.getElementById('service-popup-img');
  const serviceRows = document.querySelectorAll('.infya-service-row[data-popup-img]');

  if (popup && popupImg && serviceRows.length > 0) {
    document.addEventListener('mousemove', (e) => {
      popup.style.left = (e.clientX + 20) + 'px';
      popup.style.top = (e.clientY + 20) + 'px';
    });

    serviceRows.forEach((row) => {
      row.addEventListener('mouseenter', () => {
        const imgSrc = row.getAttribute('data-popup-img');
        if (imgSrc) {
          popupImg.src = imgSrc;
          popup.classList.add('active');
        }
      });

      row.addEventListener('mouseleave', () => {
        popup.classList.remove('active');
      });
    });
  }

  // --- Interactive 3D Cursor Tilt Effect on Showcase & Service Cards ---
  const tiltCards = document.querySelectorAll('.fullscreen-project-card, .horizontal-service-item');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 10;
      const rotateY = (x / rect.width) * 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });

  // --- HERO BACKGROUND CAROUSEL LOGIC ---
  (function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-bg-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('hero-carousel-prev');
    const nextBtn = document.getElementById('hero-carousel-next');
    const slideNumEl = document.getElementById('hero-slide-num');

    if (!slides.length) return;

    let currentSlideIndex = 0;
    let autoSlideInterval = null;
    const SLIDE_DURATION = 5500; // 5.5s per photo slide

    function goToSlide(index) {
      if (index < 0) {
        index = slides.length - 1;
      } else if (index >= slides.length) {
        index = 0;
      }

      currentSlideIndex = index;

      slides.forEach((slide, i) => {
        if (i === currentSlideIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      dots.forEach((dot, i) => {
        dot.classList.remove('active');
        const progress = dot.querySelector('.dot-progress');
        if (progress) progress.style.width = '0%';

        if (i === currentSlideIndex) {
          void dot.offsetWidth; // Trigger reflow to restart CSS progress animation
          dot.classList.add('active');
        }
      });

      if (slideNumEl) {
        slideNumEl.textContent = String(currentSlideIndex + 1).padStart(2, '0');
      }
    }

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideInterval = setInterval(() => {
        goToSlide(currentSlideIndex + 1);
      }, SLIDE_DURATION);
    }

    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    }

    function resetAutoSlide() {
      stopAutoSlide();
      startAutoSlide();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentSlideIndex + 1);
        resetAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentSlideIndex - 1);
        resetAutoSlide();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', function () {
        const slideIdx = parseInt(this.getAttribute('data-slide'), 10);
        if (!isNaN(slideIdx)) {
          goToSlide(slideIdx);
          resetAutoSlide();
        }
      });
    });

    const heroSection = document.querySelector('.bsl-hero');
    if (heroSection) {
      let touchStartX = 0;
      let touchEndX = 0;

      heroSection.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroSection.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 40;
        if (touchEndX < touchStartX - swipeThreshold) {
          goToSlide(currentSlideIndex + 1);
          resetAutoSlide();
        } else if (touchEndX > touchStartX + swipeThreshold) {
          goToSlide(currentSlideIndex - 1);
          resetAutoSlide();
        }
      }, { passive: true });
    }

    goToSlide(0);
    startAutoSlide();
  })();

  // Master 3D Kinetic Scroll Reveal Suite across all site sections
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Title 3D Flip Unfold
    const heroTitle = document.querySelector('.bsl-hero-title');
    if (heroTitle) {
      gsap.fromTo(heroTitle,
        { opacity: 0, y: 80, rotateX: 35, transformPerspective: 1200 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: heroTitle,
            start: 'top 92%'
          }
        }
      );
    }

    // 2. Existing Section Divider Lines & Borders Animated Loading Drawing
    gsap.utils.toArray('.unboxed-stats-strip, .unboxed-stat-divider, .grid-line-h, .grid-line-v').forEach((line) => {
      ScrollTrigger.create({
        trigger: line,
        start: 'top 92%',
        onEnter: () => line.classList.add('is-inview', 'revealed')
      });
    });

    // 3. Generic .gsap-reveal and .reveal elements (3D Unfold + Subtle Scale)
    gsap.utils.toArray('.gsap-reveal, .reveal, .bsl-hero-footer, .bsl-about-container, .infya-contact-grid').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 75, rotateX: 12, transformPerspective: 1200, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1.3,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
            onEnter: () => {
              el.classList.add('is-inview', 'revealed');
              if (el.classList.contains('unboxed-stats-strip') || el.querySelector('.unboxed-stat-number')) {
                if (typeof window.triggerStatAnimation === 'function') window.triggerStatAnimation();
              }
            }
          }
        }
      );
    });

    // 3. Liquid Parallax & 3D Perspective Shift on Showcase Cards
    gsap.utils.toArray('.fullscreen-project-card').forEach((card) => {
      const img = card.querySelector('.parallax-img');
      const caption = card.querySelector('.fullscreen-caption');

      gsap.fromTo(card,
        { opacity: 0, y: 100, rotateX: -10, transformPerspective: 1200 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.4,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 82%'
          }
        }
      );

      if (img) {
        gsap.fromTo(img, 
          { yPercent: -18, scale: 1.15 },
          {
            yPercent: 18,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          }
        );
      }

      if (caption) {
        gsap.fromTo(caption,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 78%'
            }
          }
        );
      }
    });

    // 4. Staggered 3D Perspective Elevation for Horizontal Service Cards
    const hServices = gsap.utils.toArray('.horizontal-service-item');
    if (hServices.length > 0) {
      gsap.fromTo(hServices,
        { opacity: 0, y: 90, rotateX: -12, transformPerspective: 1200 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.4,
          stagger: 0.15,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.horizontal-services-row',
            start: 'top 80%'
          }
        }
      );
    }
  }

  // 1. Mobile Navigation Drawer Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileDrawer.classList.toggle('active');
    });

    // Close mobile drawer when clicking a link inside it
    const drawerLinks = mobileDrawer.querySelectorAll('a');
    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
      });
    });

    // Close mobile drawer when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileDrawer.classList.remove('active');
      }
    });
  }

  // 2. Interactive Three.js 3D Small Exhibition Stand Canvas
  init3DSmallBooth();
  initService3DModels();
  initProcess3DModel();

  // 3. Contact Form Submission
  const contactForm = document.getElementById('blueprint-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name')?.value || '';

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = 'Project Specification Received! 📐';
        submitBtn.style.background = '#7C8D4C';
        submitBtn.style.color = '#FFFFFF';
      }

      setTimeout(() => {
        alert(`Thank you, ${name}! Your project inquiry has been received. Our spatial architects will review your blueprint requirements and contact you shortly.`);
        contactForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = 'Submit Project Specification →';
          submitBtn.style.background = 'var(--accent-green)';
        }
      }, 1000);
    });
  }

  // 4. Smooth scroll for internal links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    });
  });

  // 5. Portfolio Category Filter Handler
  const filterBtns = document.querySelectorAll('.project-filters .filter-btn');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});

/* -------------------------------------------------------------
   THREE.JS 3D SMALL EXHIBITION STAND RENDERER
   ------------------------------------------------------------- */
function init3DSmallBooth() {
  try {
    
  const existingCanvas = document.getElementById('hero-canvas');
  let container = document.getElementById('hero-3d-booth');
  
  if (!container && existingCanvas) {
    container = existingCanvas.parentElement;
  }
  if (!container || typeof THREE === 'undefined') return;

  // Clean up any extra canvases inside container except hero-canvas
  const extraCanvases = container.querySelectorAll('canvas:not(#hero-canvas)');
  extraCanvases.forEach(c => c.remove());

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 7.5);
  camera.lookAt(0, 0, 0);

  let renderer = null;
  try {
    renderer = existingCanvas 
      ? new THREE.WebGLRenderer({ canvas: existingCanvas, alpha: true, antialias: true, failIfMajorPerformanceCaveat: false })
      : new THREE.WebGLRenderer({ alpha: true, antialias: true, failIfMajorPerformanceCaveat: false });
  } catch (err) {
    console.warn("Hero WebGL Context initialization fallback:", err);
    return;
  }
  if (!renderer) return;

  renderer.domElement?.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    console.warn('Hero WebGL context lost.');
  }, false);

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  if (!existingCanvas && !container.contains(renderer.domElement)) {
    container.appendChild(renderer.domElement);
  }

  // Main Sculpture Group
  const sculptureGroup = new THREE.Group();
  scene.add(sculptureGroup);

  // Inner groups for independent kinetic rotation
  const lettersGroup = new THREE.Group();
  sculptureGroup.add(lettersGroup);

  // Materials
  const brassMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37, // premium brass
    metalness: 0.9,
    roughness: 0.15,
  });

  const greenGlowMaterial = new THREE.MeshStandardMaterial({
    color: 0x7c8d4c, // brand green glow
    emissive: 0x2b3818,
    metalness: 0.2,
    roughness: 0.2,
  });

  const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x121212,
    metalness: 0.7,
    roughness: 0.2,
  });

  const woodMaterial = new THREE.MeshStandardMaterial({
    color: 0xc1a179,
    metalness: 0.05,
    roughness: 0.6,
  });

  // 1. Build the "W" (Brass pillars)
  const barW1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.6, 0.12), brassMaterial);
  barW1.rotation.z = 0.35;
  barW1.position.set(-0.65, 0.1, 0.05);
  lettersGroup.add(barW1);

  const barW2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.25, 0.12), brassMaterial);
  barW2.rotation.z = -0.4;
  barW2.position.set(-0.24, -0.06, 0.05);
  lettersGroup.add(barW2);

  const barW3 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.25, 0.12), brassMaterial);
  barW3.rotation.z = 0.4;
  barW3.position.set(0.24, -0.06, 0.05);
  lettersGroup.add(barW3);

  const barW4 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.6, 0.12), brassMaterial);
  barW4.rotation.z = -0.35;
  barW4.position.set(0.65, 0.1, 0.05);
  lettersGroup.add(barW4);

  // 2. Build the "L" (Brand green glowing bars layered slightly behind)
  const barL1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.7, 0.12), greenGlowMaterial);
  barL1.position.set(0.25, 0.05, -0.25);
  lettersGroup.add(barL1);

  const barL2 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.12, 0.12), greenGlowMaterial);
  barL2.position.set(0.69, -0.74, -0.25);
  lettersGroup.add(barL2);

  // 5. Small floating accent cubes and spheres (Creative Activation)
  const accentsGroup = new THREE.Group();
  sculptureGroup.add(accentsGroup);

  const sphereGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const cubeGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);

  const accent1 = new THREE.Mesh(sphereGeo, brassMaterial);
  accent1.position.set(-1.2, 1.2, 0.5);
  accentsGroup.add(accent1);

  const accent2 = new THREE.Mesh(cubeGeo, greenGlowMaterial);
  accent2.position.set(1.4, -1.1, 0.3);
  accentsGroup.add(accent2);

  const accent3 = new THREE.Mesh(sphereGeo, darkMaterial);
  accent3.position.set(-1.5, -0.8, -0.4);
  accentsGroup.add(accent3);

  const accent4 = new THREE.Mesh(cubeGeo, brassMaterial);
  accent4.position.set(1.1, 1.4, -0.2);
  accentsGroup.add(accent4);


  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
  scene.add(ambientLight);

  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
  directionalLight1.position.set(3, 5, 4);
  scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0x7c8d4c, 1.5);
  directionalLight2.position.set(-3, -2, 2);
  scene.add(directionalLight2);

  const pointLight = new THREE.PointLight(0xffffff, 1.5, 10);
  pointLight.position.set(0, 0, 1.5);
  scene.add(pointLight);

  // Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationY = 0;
  let targetRotationX = 0;

  const handlePointerMove = (e) => {
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = -(((clientY - rect.top) / rect.height) * 2 - 1);
  };

  container.addEventListener('mousemove', handlePointerMove);
  container.addEventListener('touchmove', handlePointerMove, { passive: true });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Only rotate based on interaction and time
    targetRotationX = Math.sin(Date.now() * 0.0005) * 0.1;

    // Follow mouse moves with smooth interpolation
    sculptureGroup.rotation.y += (mouseX * 0.35 - sculptureGroup.rotation.y) * 0.05;
    sculptureGroup.rotation.x += (targetRotationX + mouseY * 0.2 - sculptureGroup.rotation.x) * 0.05;

    // Remove auto-rotations for kinetic behaviors
    // lettersGroup.rotation.y += 0.004;
    // ringGroup.rotation.z -= 0.002;

    // Floating accents orbital movements
    accentsGroup.rotation.y -= 0.003;
    accentsGroup.rotation.x += 0.001;

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  const handleResize = () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);

  } catch (e) {
    console.warn("Hero 3D Booth initialization warning:", e);
  }
}







/* -------------------------------------------------------------
   THREE.JS 3D SERVICE MODELS RENDERERS
   ------------------------------------------------------------- */
function initService3DModels() {
  try {
    if (typeof THREE === 'undefined') return;
    createServiceScene('service-3d-exhibition', buildExhibitionScene);
    createServiceScene('service-3d-events', buildEventsScene);
    createServiceScene('service-3d-interior', buildInteriorScene);
    createServiceScene('service-3d-activation', buildActivationScene);
  } catch (e) {
    console.error("Error in initService3DModels:", e);
  }
}

// Window load fallback to ensure 3D canvases render even if DOM layout is delayed
window.addEventListener('load', () => {
  initService3DModels();
});

function createServiceScene(containerId, buildSceneFn) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const getWidth = () => Math.max(container.clientWidth, container.parentElement?.clientWidth || 240);
  const getHeight = () => Math.max(container.clientHeight, 270);

  container.innerHTML = ''; // Clear stale elements

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    42,
    getWidth() / getHeight(),
    0.1,
    1000
  );

  const setResponsiveCamera = () => {
    const w = getWidth();
    const h = getHeight();
    if (window.innerWidth <= 600) {
      camera.position.set(0, 0.2, 6.2);
    } else if (window.innerWidth <= 1024) {
      camera.position.set(0, 0.2, 5.8);
    } else {
      camera.position.set(0, 0.2, 5.4);
    }
    camera.lookAt(0, 0.05, 0);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  setResponsiveCamera();

  let renderer = null;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, failIfMajorPerformanceCaveat: false });
  } catch (err) {
    console.warn("Service WebGL Context initialization fallback:", err);
    return;
  }
  if (!renderer) return;

  renderer.setSize(getWidth(), getHeight(), false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  const standGroup = new THREE.Group();
  scene.add(standGroup);

  // Robust, high-compatibility materials
  const materials = {
    green: new THREE.MeshStandardMaterial({ color: 0x7c8d4c, metalness: 0.3, roughness: 0.3 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.4 }),
    wall: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.1, roughness: 0.6 }),
    wood: new THREE.MeshStandardMaterial({ color: 0xc1a179, metalness: 0.1, roughness: 0.6 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.1 }),
    screen: new THREE.MeshStandardMaterial({ color: 0x9dcb47, emissive: 0x7c8d4c, emissiveIntensity: 0.8 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.8, roughness: 0.2 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 }),
    glowGreen: new THREE.MeshBasicMaterial({ color: 0x9dcb47 }),
    screenGlow: new THREE.MeshStandardMaterial({ color: 0x9dcb47, emissive: 0x7c8d4c, emissiveIntensity: 0.8 }),
    glassClear: new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }),
    plantGreen: new THREE.MeshStandardMaterial({ color: 0x3d6e35, roughness: 0.6 }),
    whiteMarble: new THREE.MeshStandardMaterial({ color: 0xf5f4f0, roughness: 0.2, metalness: 0.1 })
  };

  buildSceneFn(scene, standGroup, materials);

  // Bright, error-free dual directional & ambient lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
  dirLight1.position.set(5, 10, 7);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x9dcb47, 1.5);
  dirLight2.position.set(-5, 5, -3);
  scene.add(dirLight2);

  // Interaction
  let mouseX = 0;
  let mouseY = 0;

  const handlePointerMove = (e) => {
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = -(((clientY - rect.top) / rect.height) * 2 - 1);
  };

  container.addEventListener('mousemove', handlePointerMove);
  container.addEventListener('touchmove', handlePointerMove, { passive: true });
  container.addEventListener('touchstart', handlePointerMove, { passive: true });

  function animate() {
    requestAnimationFrame(animate);

    // Oscillate smoothly back and forth by exactly 180 degrees (Math.PI total range) and return (reduced speed)
    standGroup.rotation.y = Math.sin(Date.now() * 0.0003) * (Math.PI / 2);

    // Mouse interaction interpolation
    standGroup.rotation.x += (mouseY * 0.15 - standGroup.rotation.x) * 0.02;

    renderer.render(scene, camera);
  }
  animate();

  const handleResize = () => {
    if (!container || !renderer) return;
    setResponsiveCamera();
    renderer.setSize(getWidth(), getHeight(), false);
  };
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);

  setTimeout(handleResize, 100);
  setTimeout(handleResize, 500);
}

function buildExhibitionScene(scene, group, mats) {
  // 1. Raised Main Deck Floor & LED Edge Strip (Unified to 3.6 x 2.6 footprint)
  const floor = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 2.6), mats.dark);
  floor.position.set(0, -0.65, 0);
  group.add(floor);

  const ledEdge = new THREE.Mesh(new THREE.BoxGeometry(3.62, 0.02, 0.03), mats.glowGreen);
  ledEdge.position.set(0, -0.61, 1.28);
  group.add(ledEdge);

  // Raised Wood Section (VIP Zone Floor)
  const vipDeck = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.04, 1.2), mats.wood);
  vipDeck.position.set(0.8, -0.58, -0.3);
  group.add(vipDeck);

  // 2. Architectural L-Back Wall (Dark Matte + Gold Accent Trim)
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.0, 0.06), mats.wall);
  backWall.position.set(-0.5, 0.35, -0.9);
  group.add(backWall);

  const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.0, 1.3), mats.wall);
  sideWall.position.set(-1.5, 0.35, -0.25);
  group.add(sideWall);

  // Vertical Acoustic Slats on Back Wall
  const slatGeo = new THREE.BoxGeometry(0.03, 2.0, 0.02);
  for (let i = 0; i < 7; i++) {
    const slat = new THREE.Mesh(slatGeo, mats.wood);
    slat.position.set(0.5 + i * 0.18, 0.35, -0.86);
    group.add(slat);
  }

  // 3. Cantilevered Overhead Canopy & Downlights
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.06, 1.3), mats.wall);
  canopy.position.set(-0.5, 1.35, -0.25);
  group.add(canopy);

  // Canopy Downlights (Spotlight Mesh Fixtures)
  for (let i = 0; i < 3; i++) {
    const lightSpot = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 16), mats.gold);
    lightSpot.position.set(-1.1 + i * 0.65, 1.31, 0.15);
    group.add(lightSpot);

    const lightGlow = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), mats.glowGreen);
    lightGlow.position.set(-1.1 + i * 0.65, 1.30, 0.15);
    group.add(lightGlow);
  }

  // Metallic Support Column for Canopy
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.95, 16), mats.gold);
  column.position.set(0.55, 0.32, 0.35);
  group.add(column);

  // 4. Large Digital LED Widescreen Video Wall
  const ledFrame = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 0.02), mats.gold);
  ledFrame.position.set(-0.5, 0.55, -0.85);
  group.add(ledFrame);

  const screen = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.75, 0.02), mats.screenGlow);
  screen.position.set(-0.5, 0.55, -0.83);
  group.add(screen);

  // 5. Single-Level VIP Executive Ground Lounge Seating
  const loungeTable = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.36, 24), mats.whiteMarble);
  loungeTable.position.set(0.8, -0.4, -0.25);
  group.add(loungeTable);

  const loungeTop = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.02, 24), mats.gold);
  loungeTop.position.set(0.8, -0.21, -0.25);
  group.add(loungeTop);

  // 6. Modern Reception Desk & Brand Lighting Strip
  const deskBody = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.52, 0.3), mats.whiteMarble);
  deskBody.position.set(-0.5, -0.38, 0.45);
  group.add(deskBody);

  const deskGreenAccent = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.53, 0.31), mats.green);
  deskGreenAccent.position.set(-0.66, -0.38, 0.45);
  group.add(deskGreenAccent);

  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.03, 0.34), mats.wood);
  deskTop.position.set(-0.5, -0.11, 0.45);
  group.add(deskTop);

  // 7. Showcase Display Pedestal with Floating Kinetic Gem
  const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.55, 0.28), mats.whiteMarble);
  pedestal.position.set(0.55, -0.36, 0.65);
  group.add(pedestal);

  const displayGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.1, 0), mats.gold);
  displayGem.position.set(0.55, 0.05, 0.65);
  group.add(displayGem);

  // 8. Interactive Touchscreen Totem / Kiosk
  const totemBase = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.03, 0.2), mats.dark);
  totemBase.position.set(-1.2, -0.61, 0.4);
  group.add(totemBase);

  const totemBody = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.9, 0.06), mats.wall);
  totemBody.position.set(-1.2, -0.18, 0.4);
  totemBody.rotation.x = -0.1;
  group.add(totemBody);

  // 10. Architectural Plant Pot & Foliage Accent
  const plantPot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.28, 16), mats.whiteMarble);
  plantPot.position.set(1.3, -0.5, 0.9);
  group.add(plantPot);

  const plantLeaves1 = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), mats.plantGreen);
  plantLeaves1.position.set(1.3, -0.32, 0.9);
  group.add(plantLeaves1);

  const plantLeaves2 = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), mats.plantGreen);
  plantLeaves2.position.set(1.24, -0.22, 0.94);
  group.add(plantLeaves2);
}

function buildEventsScene(scene, group, mats) {
  // 1. Sleek Rectangular Stage Deck (Footprint unified to 3.6 x 2.6)
  const floor = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 2.6), mats.dark);
  floor.position.set(0, -0.65, 0);
  group.add(floor);

  const stageBase = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.12, 1.6), mats.dark);
  stageBase.position.set(0, -0.55, -0.15);
  group.add(stageBase);

  const stageLedEdge = new THREE.Mesh(new THREE.BoxGeometry(3.02, 0.02, 1.62), mats.glowGreen);
  stageLedEdge.position.set(0, -0.49, -0.15);
  group.add(stageLedEdge);

  // 2. Large Flat Widescreen LED Wall (Realistic Backdrop Board)
  const centerScreen = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.1, 0.04), mats.screenGlow);
  centerScreen.position.set(0, 0.25, -0.7);
  group.add(centerScreen);

  const ledFrame = new THREE.Mesh(new THREE.BoxGeometry(2.26, 1.16, 0.02), mats.gold);
  ledFrame.position.set(0, 0.25, -0.72);
  group.add(ledFrame);

  // Symmetrical Side Graphic Branding Wings
  const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 0.03), mats.wall);
  wingL.position.set(-1.25, 0.1, -0.5);
  wingL.rotation.y = 0.35;
  group.add(wingL);

  const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 0.03), mats.wall);
  wingR.position.set(1.25, 0.1, -0.5);
  wingR.rotation.y = -0.35;
  group.add(wingR);

  // 3. Ground-Supported Speaker Stands (Practical AV Setup)
  const poleL = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 12), mats.gold);
  poleL.position.set(-1.3, -0.15, 0.3);
  group.add(poleL);

  const speakerBoxL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.26, 0.18), mats.wall);
  speakerBoxL.position.set(-1.3, 0.28, 0.3);
  group.add(speakerBoxL);

  const poleR = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 12), mats.gold);
  poleR.position.set(1.3, -0.15, 0.3);
  group.add(poleR);

  const speakerBoxR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.26, 0.18), mats.wall);
  speakerBoxR.position.set(1.3, 0.28, 0.3);
  group.add(speakerBoxR);

  // 4. Sleek Presentation Podium / Lectern
  const lecternBase = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.55, 0.24), mats.wall);
  lecternBase.position.set(-0.7, -0.21, 0.25);
  lecternBase.rotation.y = -0.2;
  group.add(lecternBase);

  const lecternTop = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.02, 0.26), mats.gold);
  lecternTop.position.set(-0.7, 0.07, 0.25);
  lecternTop.rotation.y = -0.2;
  group.add(lecternTop);

  // 5. VIP Lounge Armchair on Stage (Realistic Event Furnishing)
  const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.42), mats.green);
  chairSeat.position.set(0.6, -0.38, 0.1);
  group.add(chairSeat);

  const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.48, 0.08), mats.green);
  chairBack.position.set(0.6, -0.15, -0.1);
  group.add(chairBack);

  const table = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.25, 16), mats.whiteMarble);
  table.position.set(1.1, -0.32, 0.25);
  group.add(table);

  const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 16), mats.gold);
  tableTop.position.set(1.1, -0.18, 0.25);
  group.add(tableTop);
}

function buildInteriorScene(scene, group, mats) {
  // 1. Luxury Parquet Flooring & Contrast Lounge Rug
  const floor = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 2.6), mats.dark);
  floor.position.set(0, -0.65, 0);
  group.add(floor);

  const accentRug = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.02, 1.5), mats.whiteMarble);
  accentRug.position.set(-0.1, -0.6, 0.15);
  group.add(accentRug);

  // 2. Feature Wall with Vertical Timber Louvers & LED Accent Strips
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.0, 0.06), mats.wall);
  backWall.position.set(0, 0.35, -0.9);
  group.add(backWall);

  // Vertical timber slats on left half of wall
  for (let i = 0; i < 8; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.035, 2.0, 0.025), mats.wood);
    slat.position.set(-1.3 + i * 0.18, 0.35, -0.86);
    group.add(slat);
  }

  // Cove LED lighting strip behind slats
  const coveLed = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.025, 0.02), mats.glowGreen);
  coveLed.position.set(-0.6, 1.3, -0.84);
  group.add(coveLed);

  // Framed Modern Art Piece / Metallic Crest
  const artFrame = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.9, 0.02), mats.gold);
  artFrame.position.set(0.65, 0.55, -0.85);
  group.add(artFrame);

  const artCanvas = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.83, 0.01), mats.green);
  artCanvas.position.set(0.65, 0.55, -0.83);
  group.add(artCanvas);

  // 3. Executive Marble Desk & Chair
  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.6), mats.whiteMarble);
  deskTop.position.set(-0.3, -0.22, 0.15);
  group.add(deskTop);

  const deskModesty = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.42, 0.03), mats.wood);
  deskModesty.position.set(-0.3, -0.42, -0.1);
  group.add(deskModesty);

  // Designer Floor Lamp
  const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.2, 12), mats.gold);
  lampPole.position.set(-1.3, -0.05, 0.5);
  group.add(lampPole);

  const lampShade = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), mats.whiteMarble);
  lampShade.position.set(-1.3, 0.55, 0.5);
  group.add(lampShade);
}

function buildActivationScene(scene, group, mats) {
  // 1. Sleek Rectangular Base (unified to 3.6 x 2.6 footprint)
  const floor = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 2.6), mats.dark);
  floor.position.set(0, -0.65, 0);
  group.add(floor);

  // Recessed circular luxury car reveal turntable
  const turntable = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.3, 0.06, 32), mats.dark);
  turntable.position.set(0, -0.58, 0);
  group.add(turntable);

  const turntableRim = new THREE.Mesh(new THREE.TorusGeometry(1.28, 0.02, 16, 48), mats.glowGreen);
  turntableRim.position.set(0, -0.55, 0);
  turntableRim.rotation.x = Math.PI / 2;
  group.add(turntableRim);

  // 2. Curved Experiential Back Wall & Glowing Brand Ring
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.8, 0.1), mats.wall);
  backWall.position.set(0, 0.25, -0.85);
  group.add(backWall);

  const logoRing = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.04, 16, 48), mats.glowGreen);
  logoRing.position.set(0, 0.45, -0.78);
  group.add(logoRing);

  const logoCenter = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 0), mats.gold);
  logoCenter.position.set(0, 0.45, -0.78);
  group.add(logoCenter);

  // Symmetrical gold vertical ribs accenting the back wall
  for (let i = 0; i < 6; i++) {
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.8, 0.04), mats.gold);
    rib.position.set(-1.3 + i * 0.52, 0.25, -0.8);
    if (i !== 2 && i !== 3) {
      group.add(rib);
    }
  }

  // 3. DETAILED 3D LUXURY SPORTS CAR MODEL (PERFECT GROUND ALIGNMENT)
  const carGroup = new THREE.Group();
  carGroup.position.set(0, -0.40, 0.05); // Bottom of wheels rests precisely at y = -0.55 turntable surface
  carGroup.rotation.y = -0.35; // Angled 3/4 perspective view

  // Main Car Lower Body Chassis (Aerodynamic Sports Car Shape with Ground Clearance)
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.22, 0.74), mats.dark);
  chassis.position.set(0, 0.10, 0);
  carGroup.add(chassis);

  // Metallic Gold Side Skirts & Accent Strips
  const sideSkirtL = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.04, 0.03), mats.gold);
  sideSkirtL.position.set(0, 0.01, 0.375);
  carGroup.add(sideSkirtL);

  const sideSkirtR = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.04, 0.03), mats.gold);
  sideSkirtR.position.set(0, 0.01, -0.375);
  carGroup.add(sideSkirtR);

  // Front Aerodynamic Bumper & Gold Splitter
  const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.10, 0.72), mats.gold);
  frontBumper.position.set(0.8, 0.05, 0);
  carGroup.add(frontBumper);

  // Slanted Front Hood Slope
  const hood = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.70), mats.dark);
  hood.position.set(0.45, 0.17, 0);
  hood.rotation.z = -0.08;
  carGroup.add(hood);

  // Glass Cabin & Roof (Greenhouse)
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.80, 0.20, 0.60), mats.glass);
  cabin.position.set(-0.15, 0.28, 0);
  carGroup.add(cabin);

  // Slanted Front Windshield
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.58), mats.glassClear);
  windshield.position.set(0.18, 0.26, 0);
  windshield.rotation.z = -0.45;
  carGroup.add(windshield);

  // Rear Wing Spoiler & Gold Supports
  const wing = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.76), mats.gold);
  wing.position.set(-0.80, 0.36, 0);
  carGroup.add(wing);

  const wingSupportL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.04), mats.gold);
  wingSupportL.position.set(-0.80, 0.29, 0.24);
  carGroup.add(wingSupportL);

  const wingSupportR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.04), mats.gold);
  wingSupportR.position.set(-0.80, 0.29, -0.24);
  carGroup.add(wingSupportR);

  // Dual Glowing Xenon LED Headlights
  const headlightL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.16), mats.glowGreen);
  headlightL.position.set(0.93, 0.08, 0.25);
  carGroup.add(headlightL);

  const headlightR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.16), mats.glowGreen);
  headlightR.position.set(0.93, 0.08, -0.25);
  carGroup.add(headlightR);

  // Rear LED Taillight Bar
  const taillight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.68), mats.glowGreen);
  taillight.position.set(-0.82, 0.08, 0);
  carGroup.add(taillight);

  // 4 Sport Alloy Wheels Resting Exactly on Turntable Surface
  const wheelPositions = [
    [0.48, 0, 0.37],
    [0.48, 0, -0.37],
    [-0.48, 0, 0.37],
    [-0.48, 0, -0.37]
  ];

  wheelPositions.forEach((pos) => {
    // Outer Rubber Tire (Radius 0.15)
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.08, 24), mats.dark);
    tire.position.set(pos[0], pos[1], pos[2]);
    tire.rotation.x = Math.PI / 2;
    carGroup.add(tire);

    // Inner Gold Alloy Rim
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.09, 16), mats.gold);
    rim.position.set(pos[0], pos[1], pos[2]);
    rim.rotation.x = Math.PI / 2;
    carGroup.add(rim);
  });

  group.add(carGroup);

  // 4. Interactive Touchscreen Console (Right side)
  const consoleBase = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 0.3), mats.whiteMarble);
  consoleBase.position.set(1.1, -0.31, 0.4);
  consoleBase.rotation.y = -0.4;
  group.add(consoleBase);

  const consoleScreen = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.02, 0.24), mats.screenGlow);
  consoleScreen.position.set(1.1, -0.01, 0.4);
  consoleScreen.rotation.y = -0.4;
  consoleScreen.rotation.x = -Math.PI / 6;
  group.add(consoleScreen);
}

/* -------------------------------------------------------------
   THREE.JS 3D PROCESS MODEL RENDERER
   ------------------------------------------------------------- */
function initProcess3DModel() {
  try {
    
  const container = document.getElementById('process-3d-canvas');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2.5, 7.5);
  camera.lookAt(0, 0, 0);

  let renderer = null;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, failIfMajorPerformanceCaveat: false });
  } catch (err) {
    console.warn("Process WebGL Context initialization fallback:", err);
    return;
  }
  if (!renderer) return;

  renderer.domElement?.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
  }, false);

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const processGroup = new THREE.Group();
  scene.add(processGroup);

  // Materials for 4 Evolution Stages
  const mats = {
    green: new THREE.MeshStandardMaterial({ color: 0x7c8d4c, metalness: 0.4, roughness: 0.3 }),
    greenWire: new THREE.MeshBasicMaterial({ color: 0x9dcb47, wireframe: true }),
    dark: new THREE.MeshStandardMaterial({ color: 0x181c15, metalness: 0.6, roughness: 0.4 }),
    darkWire: new THREE.MeshBasicMaterial({ color: 0x445522, wireframe: true }),
    wall: new THREE.MeshStandardMaterial({ color: 0x121410, metalness: 0.1, roughness: 0.6 }),
    wallWire: new THREE.MeshBasicMaterial({ color: 0x7c8d4c, wireframe: true }),
    wood: new THREE.MeshStandardMaterial({ color: 0xc1a179, metalness: 0.1, roughness: 0.6 }),
    woodWire: new THREE.MeshBasicMaterial({ color: 0xc1a179, wireframe: true }),
    gold: new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 }),
    goldWire: new THREE.MeshBasicMaterial({ color: 0xd4af37, wireframe: true }),
    marble: new THREE.MeshStandardMaterial({ color: 0xf5f4f0, roughness: 0.2, metalness: 0.1 }),
    screenGlow: new THREE.MeshStandardMaterial({ color: 0x1a2b10, emissive: 0x7c8d4c, emissiveIntensity: 0.8, roughness: 0.2 }),
    lightBeam: new THREE.MeshBasicMaterial({ color: 0x9dcb47, transparent: true, opacity: 0.22, side: THREE.DoubleSide }),
    plantGreen: new THREE.MeshStandardMaterial({ color: 0x3d6e35, roughness: 0.6 })
  };

  // Build the 4 groups for the steps
  const step1Group = new THREE.Group(); // 01 Discover: Holographic Blueprint & CAD Grid
  const step2Group = new THREE.Group(); // 02 Design: Wireframe Structural Form
  const step3Group = new THREE.Group(); // 03 Build: Solid Fabricated Pavilion
  const step4Group = new THREE.Group(); // 04 Experience: Fully Lit & Activated Event

  processGroup.add(step1Group);
  processGroup.add(step2Group);
  processGroup.add(step3Group);
  processGroup.add(step4Group);

  // Initial scales
  step1Group.scale.set(1, 1, 1);
  step2Group.scale.set(0.001, 0.001, 0.001);
  step3Group.scale.set(0.001, 0.001, 0.001);
  step4Group.scale.set(0.001, 0.001, 0.001);

  // =========================================================
  // --- Step 1: Discover (CAD Blueprint & 4 Corner Pillars) ---
  // =========================================================
  // Symmetrical 4 Corner Pillars (Exact fit with Canopy & Backwall)
  const pillarPositions = [
    [-1.4, 0.3, 0.7],  // Front-Left
    [1.4, 0.3, 0.7],   // Front-Right
    [-1.4, 0.3, -1.2], // Back-Left
    [1.4, 0.3, -1.2]   // Back-Right
  ];

  // =========================================================
  // --- Step 1: Discover (CAD Blueprint & 4 Corner Pillars) ---
  // =========================================================
  const gridHelper = new THREE.GridHelper(4.0, 16, 0x9dcb47, 0x334422);
  gridHelper.position.y = -0.8;
  step1Group.add(gridHelper);

  // Blueprint Axis
  const axisX = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.03, 0.03), mats.greenWire);
  axisX.position.set(0, -0.78, -0.25);
  step1Group.add(axisX);

  const axisZ = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 3.0), mats.greenWire);
  axisZ.position.set(0, -0.78, -0.25);
  step1Group.add(axisZ);

  // 4 Corner Pillars (Step 1: Wireframe Green CAD Laser Lines)
  pillarPositions.forEach(([px, py, pz]) => {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 12), mats.greenWire);
    pillar.position.set(px, py, pz);
    step1Group.add(pillar);
  });

  // Floating Measurement CAD Nodes
  const nodesGroup = new THREE.Group();
  for (let i = 0; i < 10; i++) {
    const node = new THREE.Mesh(new THREE.OctahedronGeometry(0.08, 0), mats.goldWire);
    const angle = (i / 10) * Math.PI * 2;
    node.position.set(Math.cos(angle) * 1.5, -0.2 + Math.sin(angle * 3) * 0.3, Math.sin(angle) * 1.1 - 0.25);
    nodesGroup.add(node);
  }
  step1Group.add(nodesGroup);

  // =========================================================
  // --- Step 2: Design (Wireframe Structure on 4 Pillars) ---
  // =========================================================
  const floorW = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 2.6), mats.darkWire);
  floorW.position.set(0, -0.76, -0.25);
  step2Group.add(floorW);

  // Keep the exact same 4 Corner Pillars in Wireframe
  pillarPositions.forEach(([px, py, pz]) => {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 12), mats.goldWire);
    pillar.position.set(px, py, pz);
    step2Group.add(pillar);
  });

  const backWallW = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.2, 0.08), mats.wallWire);
  backWallW.position.set(0, 0.3, -1.2);
  step2Group.add(backWallW);

  const canopyW = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.08, 2.1), mats.goldWire);
  canopyW.position.set(0, 1.4, -0.25);
  step2Group.add(canopyW);

  const deskW = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.4), mats.greenWire);
  deskW.position.set(-0.5, -0.42, 0.2);
  step2Group.add(deskW);

  const screenW = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.85, 0.04), mats.greenWire);
  screenW.position.set(-0.5, 0.55, -1.14);
  step2Group.add(screenW);

  // =========================================================
  // --- Step 3: Build (Solid Fabrication on 4 Gold Pillars) ---
  // =========================================================
  const floorS = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 2.6), mats.dark);
  floorS.position.set(0, -0.76, -0.25);
  step3Group.add(floorS);

  const ledEdgeS = new THREE.Mesh(new THREE.BoxGeometry(3.62, 0.025, 0.04), mats.green);
  ledEdgeS.position.set(0, -0.72, 1.03);
  step3Group.add(ledEdgeS);

  // Keep the exact same 4 Corner Pillars in Solid Polished Gold Brass
  pillarPositions.forEach(([px, py, pz]) => {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 16), mats.gold);
    pillar.position.set(px, py, pz);
    step3Group.add(pillar);
  });

  const backWallS = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.2, 0.08), mats.wall);
  backWallS.position.set(0, 0.3, -1.2);
  step3Group.add(backWallS);

  // Timber Louver Slats mounted neatly on the right side of the Back Wall (X: 0.3 to 1.3)
  for (let i = 0; i < 6; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.2, 0.04), mats.wood);
    slat.position.set(0.3 + i * 0.2, 0.3, -1.16);
    step3Group.add(slat);
  }

  const canopyS = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.08, 2.1), mats.wall);
  canopyS.position.set(0, 1.4, -0.25);
  step3Group.add(canopyS);

  const deskS = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.4), mats.marble);
  deskS.position.set(-0.5, -0.42, 0.2);
  step3Group.add(deskS);

  const deskTopS = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.04, 0.44), mats.wood);
  deskTopS.position.set(-0.5, -0.1, 0.2);
  step3Group.add(deskTopS);

  // =========================================================
  // --- Step 4: Experience (Fully Lit & Activated Event Pavilion) ---
  // =========================================================
  const floorE = floorS.clone();
  const ledEdgeE = ledEdgeS.clone();
  const backWallE = backWallS.clone();
  const canopyE = canopyS.clone();
  const deskE = deskS.clone();
  const deskTopE = deskTopS.clone();

  step4Group.add(floorE);
  step4Group.add(ledEdgeE);
  step4Group.add(backWallE);
  step4Group.add(canopyE);
  step4Group.add(deskE);
  step4Group.add(deskTopE);

  // Keep the exact same 4 Corner Pillars in Solid Gold
  pillarPositions.forEach(([px, py, pz]) => {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 16), mats.gold);
    pillar.position.set(px, py, pz);
    step4Group.add(pillar);
  });

  // Re-add Louver Slats to Step 4
  for (let i = 0; i < 6; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.2, 0.04), mats.wood);
    slat.position.set(0.3 + i * 0.2, 0.3, -1.16);
    step4Group.add(slat);
  }

  // Active Widescreen LED Display
  const screenE = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.82, 0.03), mats.screenGlow);
  screenE.position.set(-0.5, 0.55, -1.16);
  step4Group.add(screenE);

  const screenFrameE = new THREE.Mesh(new THREE.BoxGeometry(1.46, 0.88, 0.02), mats.gold);
  screenFrameE.position.set(-0.5, 0.55, -1.18);
  step4Group.add(screenFrameE);

  // VIP Ground Lounge Seating Table
  const loungeTableE = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.42, 24), mats.marble);
  loungeTableE.position.set(0.7, -0.5, 0.1);
  step4Group.add(loungeTableE);

  const loungeTopE = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.03, 24), mats.gold);
  loungeTopE.position.set(0.7, -0.27, 0.1);
  step4Group.add(loungeTopE);

  // Volumetric Overhead Stage Lighting Beams
  for (let i = 0; i < 3; i++) {
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.65, 2.0, 16, 1, true), mats.lightBeam);
    beam.position.set(-1.0 + i * 0.7, 0.4, 0.1);
    beam.rotation.z = (i === 0 ? -0.15 : i === 2 ? 0.15 : 0);
    step4Group.add(beam);
  }

  // Botanical Foliage
  const plantPotE = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.3, 16), mats.marble);
  plantPotE.position.set(1.3, -0.58, 0.7);
  step4Group.add(plantPotE);

  const plantLeavesE = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), mats.plantGreen);
  plantLeavesE.position.set(1.3, -0.38, 0.7);
  step4Group.add(plantLeavesE);

  // Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
  directionalLight.position.set(3, 6, 4);
  scene.add(directionalLight);

  const spotLight = new THREE.SpotLight(0x9dcb47, 3);
  spotLight.position.set(-2, 4, 3);
  scene.add(spotLight);

  const setResponsiveCamera = () => {
    if (window.innerWidth <= 600) {
      camera.position.set(0, 1.8, 4.8);
    } else if (window.innerWidth <= 1024) {
      camera.position.set(0, 2.0, 5.4);
    } else {
      camera.position.set(0, 2.1, 5.8);
    }
  };
  setResponsiveCamera();

  // Animation & Interaction variables
  let activeStep = 1;
  let mouseX = 0;
  let mouseY = 0;

  const handlePointerMove = (e) => {
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = -(((clientY - rect.top) / rect.height) * 2 - 1);
  };

  container.addEventListener('mousemove', handlePointerMove);
  container.addEventListener('touchmove', handlePointerMove, { passive: true });
  container.addEventListener('touchstart', handlePointerMove, { passive: true });

  // Handle active step changes (hover & click/tap on cards)
  const cards = document.querySelectorAll('.process-card');
  const stepTitles = {
    1: 'Vision Collaboration',
    2: 'Spatial Analysis',
    3: 'Transparent Timeline',
    4: 'Precision Production',
    5: 'Seamless Installation'
  };

  cards.forEach(card => {
    const handleSelectStep = (e) => {
      const step = parseInt(card.getAttribute('data-step') || '1');
      if (step === activeStep && e && e.type === 'mouseenter') return;

      activeStep = step;
      
      // Update UI active states
      cards.forEach(c => {
        c.classList.remove('active');
        c.style.background = '';
        c.style.borderColor = '';
      });
      card.classList.add('active');

      // Update text overlays safely
      const overlay = container.nextElementSibling || (container.parentElement ? container.parentElement.querySelector('.process-3d-overlay') : null);
      const stepNumOverlay = overlay ? overlay.querySelector('.process-3d-step-num') : null;
      const stepTitleOverlay = overlay ? overlay.querySelector('.process-3d-step-title') : null;

      if (stepNumOverlay) stepNumOverlay.textContent = `STEP 0${step}`;
      if (stepTitleOverlay) stepTitleOverlay.textContent = stepTitles[step] || 'Strategy Step';

      // On mobile devices, smoothly scroll to bring the 3D canvas viewer into full view!
      if (window.innerWidth <= 1024) {
        const process3dWrapper = document.querySelector('.process-3d-wrapper');
        if (process3dWrapper) {
          process3dWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    };

    card.addEventListener('mouseenter', handleSelectStep);
    card.addEventListener('click', handleSelectStep);
    card.addEventListener('touchstart', handleSelectStep, { passive: true });
  });

  // Scroll observer: Automatically update 3D active step as user scrolls cards down on mobile
  if ('IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const step = parseInt(entry.target.getAttribute('data-step') || '1');
          if (step !== activeStep) {
            activeStep = step;
            cards.forEach(c => {
              c.classList.remove('active');
              c.style.background = '';
              c.style.borderColor = '';
            });
            entry.target.classList.add('active');

            const overlay = container.nextElementSibling || (container.parentElement ? container.parentElement.querySelector('.process-3d-overlay') : null);
            const stepNumOverlay = overlay ? overlay.querySelector('.process-3d-step-num') : null;
            const stepTitleOverlay = overlay ? overlay.querySelector('.process-3d-step-title') : null;

            if (stepNumOverlay) stepNumOverlay.textContent = `STEP 0${step}`;
            if (stepTitleOverlay) stepTitleOverlay.textContent = stepTitles[step] || 'Strategy Step';
          }
        }
      });
    }, {
      root: null,
      rootMargin: '-25% 0px -35% 0px',
      threshold: 0.3
    });

    cards.forEach(card => scrollObserver.observe(card));
  }

  function animate() {
    requestAnimationFrame(animate);

    // Only rotate based on interaction
    processGroup.rotation.y += (mouseX * 0.4 - processGroup.rotation.y) * 0.05;
    processGroup.rotation.x += (mouseY * 0.2 - processGroup.rotation.x) * 0.05;

    // Interpolate scales of step groups
    const scale1 = activeStep === 1 ? 1 : 0.001;
    const scale2 = activeStep === 2 ? 1 : 0.001;
    const scale3 = activeStep === 3 ? 1 : 0.001;
    const scale4 = (activeStep === 4 || activeStep === 5) ? 1 : 0.001;

    step1Group.scale.x += (scale1 - step1Group.scale.x) * 0.08;
    step1Group.scale.y += (scale1 - step1Group.scale.y) * 0.08;
    step1Group.scale.z += (scale1 - step1Group.scale.z) * 0.08;

    step2Group.scale.x += (scale2 - step2Group.scale.x) * 0.08;
    step2Group.scale.y += (scale2 - step2Group.scale.y) * 0.08;
    step2Group.scale.z += (scale2 - step2Group.scale.z) * 0.08;

    step3Group.scale.x += (scale3 - step3Group.scale.x) * 0.08;
    step3Group.scale.y += (scale3 - step3Group.scale.y) * 0.08;
    step3Group.scale.z += (scale3 - step3Group.scale.z) * 0.08;

    step4Group.scale.x += (scale4 - step4Group.scale.x) * 0.08;
    step4Group.scale.y += (scale4 - step4Group.scale.y) * 0.08;
    step4Group.scale.z += (scale4 - step4Group.scale.z) * 0.08;

    renderer.render(scene, camera);
  }
  animate();

  const handleResize = () => {
    if (!container) return;
    setResponsiveCamera();
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);

  } catch (e) {
    console.error("Error in initProcess3DModel:", e);
  }
}



/* ==========================================================================
   RESTORED SERVICES.HTML SPECIFIC LOGIC & TRANSLATIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Only execute on services.html (by checking if the main services container or services-specific selector exists)
  const isServicesPage = document.querySelector('.services-hero') || document.querySelector('.services-detail-section');
  if (!isServicesPage) return;

  console.log('[Whiteleaf Restored] Initializing services page modules...');

  // --- 1. Translations System ---
      // ====================================================
    const translations = {
        'logo-sub': {
            en: 'Interiors',
            ar: 'التصميم الداخلي'
        },
        'nav-home': {
            en: 'Home',
            ar: 'الرئيسية'
        },
        'nav-services': {
            en: 'Services',
            ar: 'الخدمات'
        },
        'nav-about': {
            en: 'About',
            ar: 'من نحن'
        },
        'nav-contact': {
            en: 'Get in Touch',
            ar: 'تواصل معنا'
        },
        'theme-toggle-label': {
            en: 'Dark Mode',
            ar: 'الوضع الداكن'
        },
        'hero-tagline': {
            en: 'Bespoke Space & Form',
            ar: 'تصميم وتنفيذ متكامل للفراغ'
        },
        'hero-title-1': {
            en: 'Crafting',
            ar: 'صياغة'
        },
        'hero-title-2': {
            en: 'Bespoke',
            ar: 'تصاميم مخصصة'
        },
        'hero-title-3': {
            en: 'Environments.',
            ar: 'لبيئات ملهمة.'
        },
        'hero-desc': {
            en: 'We design and execute award-winning international trade show pavilions, corporate office interiors, and luxury brand launch experiences across Dubai and globally.',
            ar: 'نقوم بتصميم وتنفيذ أجنحة المعارض الدولية الحائزة على جوائز، والتصميم الداخلي المتميز للمكاتب والشركات، وفعاليات إطلاق العلامات التجارية الفاخرة في دبي والعالم.'
        },
        'hero-btn': {
            en: 'Explore Portfolio',
            ar: 'اكتشف أعمالنا'
        },
        'services-hero-tag': {
            en: 'Mastery',
            ar: 'إتقان تسليم المفتاح'
        },
        'services-hero-title': {
            en: 'OUR EXPERTISE & SERVICES',
            ar: 'خبراتنا وخدماتنا'
        },
        'services-hero-desc': {
            en: 'From luxury workplace architecture in Business Bay to award-winning country exhibition pavilions globally, we build environments that embody Silent Luxury and Flawless Execution.',
            ar: 'بدءاً من التجهيزات المكتبية الفاخرة في الخليج التجاري إلى أجنحة المعارض الدولية الحائزة على جوائز حول العالم، نصمم وننفذ بيئات تجسد الفخامة الهادئة والتنفيذ الخالي من العيوب.'
        },
        'service-1-tag': {
            en: '01 / ARCHITECTURAL FIT-OUT',
            ar: '٠١ / التجهيز المعماري'
        },
        'service-1-title': {
            en: 'Interior Design & Fit-Out',
            ar: 'التصميم الداخلي المتكامل والتجهيز'
        },
        'service-1-desc': {
            en: 'We create corporate offices and commercial settings that cultivate productivity and project brand authority. Our interior division handles spatial layouts, detailed 3D rendering, authority approvals (Dubai Municipality, Civil Defense), custom joinery, MEP engineering, and structural execution.',
            ar: 'نبتكر مساحات عمل ومحلات تجارية تعزز الإنتاجية وتجسد حضور العلامة التجارية. يتولى قسم التصميم الداخلي لدينا تخطيط المساحات، والمخططات التنفيذية، والموافقات الحكومية (بلدية دبي، الدفاع المدني)، والتصنيع، والأعمال الكهروميكانيكية، والتشطيبات النهائية.'
        },
        'service-1-feat-1': {
            en: 'Grade-A In-House Joinery',
            ar: 'أعمال خشبية مصنعة داخلياً بجودة عالية'
        },
        'service-1-feat-2': {
            en: 'Bespoke Workspace Planning',
            ar: 'تخطيط مخصص لمساحات العمل'
        },
        'service-1-feat-3': {
            en: 'Integrated MEP Engineering',
            ar: 'أعمال هندسة كهروميكانيكية متكاملة'
        },
        'service-2-tag': {
            en: '02 / TRADE SHOW PAVILIONS',
            ar: '٠٢ / أجنحة المعارض التجارية'
        },
        'service-2-title': {
            en: 'Exhibition Stands & Country Pavilions',
            ar: 'أجنحة المعارض والمنصات الدولية'
        },
        'service-2-desc': {
            en: 'High-impact brand architectures designed for trade shows. With integrated fabrication facilities in Dubai and Mumbai, we build premium double-deckers, custom wood stands, and pavilions. We handle the entire engineering, safety certifications, custom graphics, AV integration, and worldwide logistics.',
            ar: 'هندسة معمارية للمنصات ذات تأثير عالٍ ومصممة لجذب الزوار. بفضل مصانعنا في دبي ومومباي، نقوم بتنفيذ أجنحة ذات طابقين، ومنصات خشبية مخصصة، وهياكل ألومنيوم وعالمياً، ونتولى الهندسة، وشهادات السلامة، والرسومات، وتكامل الصوت والصورة، والخدمات اللوجستية.'
        },
        'service-2-feat-1': {
            en: 'Double-Decker Certified Engineering',
            ar: 'هندسة معتمدة للمنصات ذات الطابقين'
        },
        'service-2-feat-2': {
            en: 'In-House CNC Fabrication',
            ar: 'تصنيع داخلي دقيق باستخدام CNC'
        },
        'service-2-feat-3': {
            en: 'Global Logistics & Setup Control',
            ar: 'إدارة كاملة للخدمات اللوجستية والتركيب عالمياً'
        },
        'service-3-tag': {
            en: '03 / BRAND ARCHITECTURES',
            ar: '٠٣ / فعاليات العلامات التجارية'
        },
        'service-3-title': {
            en: 'Experiential Events & Brand Activations',
            ar: 'الفعاليات التجريبية وتنشيط العلامات التجارية'
        },
        'service-3-desc': {
            en: 'We turn blank canvases into temporary theatrical landscapes. Our events team handles scenic design, advanced illumination arrays, structure styling, staging, audio-visual networks, and interactive digital activations for luxury product reveals and corporate summits.',
            ar: 'نحول المساحات إلى مسارح للعلامات التجارية. يقوم قسم الفعاليات لدينا بتخطيط وتنفيذ منصات العرض الفاخرة، وأنظمة الإضاءة المتقدمة، والديكورات المخصصة، وتكامل الوسائط الرقمية لإطلاق المنتجات الفاخرة وقمم الشركات.'
        },
        'service-3-feat-1': {
            en: 'Immersive Projection Mapping',
            ar: 'إسقاط ضوئي غامر ثلاثي الأبعاد'
        },
        'service-3-feat-2': {
            en: 'Custom Scenic Styling',
            ar: 'ديكورات وتنسيقات مخصصة'
        },
        'service-3-feat-3': {
            en: 'End-to-End AV & Staging Control',
            ar: 'تحكم كامل بالصوت والصورة والمسارح'
        },
        'material-tag': {
            en: 'Our Execution Standard',
            ar: 'معيار التنفيذ لدينا'
        },
        'material-title': {
            en: 'MATERIALITY & CRAFTSMANSHIP',
            ar: 'المواد والصناعة اليدوية'
        },
        'material-desc': {
            en: 'Every piece of wood, steel, glass, and acoustical fabric is curated to deliver silent luxury and high-end sensory appeal.',
            ar: 'يتم اختيار كل قطعة من الخشب والصلب والزجاج والأقمشة بعناية لتقديم فخامة هادئة وتأثير حسي راقٍ.'
        },
        'material-1-title': {
            en: 'Oak & Walnut Veneers',
            ar: 'قشرة خشب البلوط والجوز'
        },
        'material-1-desc': {
            en: 'Custom book-matched veneers crafted in our joinery studio.',
            ar: 'قشرة خشبية مخصصة ومطابقة للفراغات الإنشائية.'
        },
        'material-2-title': {
            en: 'Architectural Metals',
            ar: 'معادن معمارية'
        },
        'material-2-desc': {
            en: 'PVD-coated brass and structural black iron details.',
            ar: 'تفاصيل من النحاس المطلي بـ PVD والحديد الأسود الإنشائي.'
        },
        'material-3-title': {
            en: 'Fluted & Ribbed Glass',
            ar: 'زجاج مضلع ومحزز'
        },
        'material-3-desc': {
            en: 'Textured glass panels for luxury architectural partitioning.',
            ar: 'ألواح زجاجية محكمة لتجزئة المساحات بطابع فاخر.'
        },
        'material-4-title': {
            en: 'Eco Acoustics',
            ar: 'صوتيات صديقة للبيئة'
        },
        'material-4-desc': {
            en: 'Recycled PET felt panels for premium sound control.',
            ar: 'ألواح لباد معاد تدويرها للتحكم الصوتي المتميز.'
        },
        'services-cta-title': {
            en: 'READY TO COLLABORATE?',
            ar: 'جاهز للتعاون معنا؟'
        },
        'services-cta-desc': {
            en: 'Let us transform your commercial vision into a physical statement of architecture. Get in touch with our design directors today.',
            ar: 'دعنا نحول رؤيتك إلى واقع معماري ملموس. تواصل مع مديري التصميم لدينا اليوم.'
        },
        'services-cta-btn': {
            en: 'Initiate Project Dialogue',
            ar: 'ابدأ مناقشة مشروعك'
        },
        'scroll-text': {
            en: 'Scroll to experience',
            ar: 'انزل للأسفل لتجربة العرض'
        },
        'pillar-span-1': {
            en: '01 // INTERNATIONAL STANDS',
            ar: '٠١ // أجنحة معارض دولية'
        },
        'pillar-title-1': {
            en: 'EXHIBITIONS',
            ar: 'المعارض'
        },
        'pillar-desc-1': {
            en: 'Bespoke custom-built exhibition stands and pavilions engineered for international trade shows, maximizing impact and commercial authority.',
            ar: 'منصات وأجنحة عرض مخصصة ومصممة خصيصاً للمعارض التجارية الدولية لزيادة الحضور والتأثير الفعال للعلامة التجارية.'
        },
        'pillar-span-2': {
            en: '02 // FIT-OUT',
            ar: '٠٢ // تسليم مفتاح متكامل'
        },
        'pillar-title-2': {
            en: 'INTERIOR DESIGN',
            ar: 'التصميم الداخلي'
        },
        'pillar-desc-2': {
            en: 'Premium corporate offices, high-end commercial showrooms, and luxury workspaces designed with spatial precision and delivery.',
            ar: 'مكاتب شركات متميزة، وصالات عرض تجارية راقية، ومساحات عمل فاخرة مصممة بدقة هندسية وتسليم متكامل بالكامل.'
        },
        'pillar-span-3': {
            en: '03 // EXPERIENTIAL SETUPS',
            ar: '٠٣ // فعاليات تجريبية'
        },
        'pillar-title-3': {
            en: 'EVENTS',
            ar: 'الفعاليات'
        },
        'pillar-desc-3': {
            en: 'Immersive brand launch events, high-end corporate summits, and experiential settings planned with cutting-edge staging, audio-visuals, and styling.',
            ar: 'تجارب إطلاق منتجات غامرة، وقمم شركات رفيعة المستوى، وتجهيزات تجريبية مخططة بأحدث تقنيات المسارح والديكورات والصوت والصورة.'
        },
        'about-tag': {
            en: 'Design Philosophy',
            ar: 'فلسفتنا في التصميم'
        },
        'about-title-1': {
            en: 'SILENT LUXURY,',
            ar: 'الفخامة الهادئة،'
        },
        'about-title-2': {
            en: 'Flawless Execution.',
            ar: 'والتنفيذ الخالي من العيوب.'
        },
        'about-desc-1': {
            en: 'We believe that a space is a storytelling canvas. Whether it is a temporary exhibition stand at a world congress or a headquarters office in Dubai, the form must reflect a refined architectural voice—silent luxury that communicates without being loud.',
            ar: 'نؤمن بأن المساحة هي لوحة لسرد القصص. وسواء كان جناح عرض مؤقتاً في مؤتمر عالمي أو مكتباً رئيسياً لشركة في دبي، يجب أن يعكس الشكل صوتاً معمارياً راقياً وفخامة هادئة تتحدث بوضوح دون صخب.'
        },
        'about-desc-2': {
            en: 'With integrated design studios, engineering teams, and in-house fabrication facilities in Dubai and Mumbai, we offer complete project control from visualization to structural delivery.',
            ar: 'مع استوديوهات تصميم متكاملة، وفرق هندسية، ومرافق تصنيع داخلية في دبي ومومباي، نقدم تحكماً شاملاً بالكامل للمشروع بدءاً من الفكرة والتخيل وحتى التسليم الإنشائي الفعلي.'
        },
        'stat-label-1': {
            en: 'Countries Executed',
            ar: 'دولة نفذنا فيها مشاريع'
        },
        'stat-label-2': {
            en: 'Projects Delivered',
            ar: 'مشروع تم تسليمه'
        },
        'stat-label-3': {
            en: 'On-Time Delivery',
            ar: 'تسليم متكامل في الوقت المحدد'
        },
        'portfolio-tag': {
            en: 'Curated Works',
            ar: 'أعمال منتقاة'
        },
        'portfolio-title': {
            en: 'FEATURED PROJECTS',
            ar: 'مشاريعنا المميزة'
        },
        'p1-tag': {
            en: 'Exhibitions // Pavilions',
            ar: 'المعارض // الأجنحة'
        },
        'p1-title': {
            en: 'Aerospace Expo Pavilion',
            ar: 'جناح معرض الفضاء والطيران'
        },
        'p2-tag': {
            en: 'Interiors // Corporate Office',
            ar: 'التصميم الداخلي // مكاتب شركات'
        },
        'p2-title': {
            en: 'Tech Hub Headquarters, Dubai',
            ar: 'المقر الرئيسي لـ مركز التكنولوجيا، دبي'
        },
        'p3-tag': {
            en: 'Events // Product Launch',
            ar: 'الفعاليات // إطلاق منتجات'
        },
        'p3-title': {
            en: 'Vanguard EV Launch Show',
            ar: 'عرض إطلاق سيارة فانجارد الكهربائية'
        },
        'p4-tag': {
            en: 'Interiors // Showrooms',
            ar: 'التصميم الداخلي // صالات العرض'
        },
        'p4-title': {
            en: 'Chronos Luxury Boutique',
            ar: 'معرض كرونوس الفاخر'
        },
        'process-tag': {
            en: 'Our Methodology',
            ar: 'منهجيتنا'
        },
        'process-title': {
            en: 'THE PATH',
            ar: 'مسار التسليم المتكامل'
        },
        'step-title-1': {
            en: 'CONSULTATION',
            ar: 'الاستشارة والاستماع'
        },
        'step-desc-1': {
            en: 'Analyzing space layout, brand positioning, and functional targets to draft a clear architectural brief.',
            ar: 'تحليل مخطط المساحة، وموقع العلامة التجارية، والأهداف التشغيلية لصياغة موجز معماري واضح للعمل.'
        },
        'step-title-2': {
            en: 'DESIGN & VR',
            ar: 'التصميم والواقع الافتراضي'
        },
        'step-desc-2': {
            en: 'Rendering highly detailed 3D spatial models and virtual walkthroughs for complete spatial clarity.',
            ar: 'نمذجة مساحية ثلاثية الأبعاد عالية التفاصيل وجولات افتراضية لتوفير وضوح تام للمساحة للفراغ المعماري.'
        },
        'step-title-3': {
            en: 'FABRICATION',
            ar: 'التصنيع والjoinery'
        },
        'step-desc-3': {
            en: 'Constructing custom joinery and structural elements in our advanced in-house production facilities.',
            ar: 'تصنيع أعمال الخشب والديكور المخصصة والعناصر الإنشائية في مرافق الإنتاج والمصانع المتقدمة لدينا.'
        },
        'step-title-4': {
            en: 'HANDOVER',
            ar: 'التسليم وإدارة الموقع'
        },
        'step-desc-4': {
            en: 'Managing full logistics, on-site structural assembly, fine finishing, and keys-in-hand delivery.',
            ar: 'إدارة الخدمات اللوجستية الكاملة، والتركيب الإنشائي في الموقع، والتشطيبات النهائية الفاخرة، والتسليم الجاهز للمفتاح.'
        },
        'contact-title-1': {
            en: 'START A DIALOGUE',
            ar: 'ابدأ حواراً مع فريقنا'
        },
        'contact-title-2': {
            en: 'With Whiteleaf.',
            ar: 'مع وايت ليف'
        },
        'contact-detail-1': {
            en: 'General Inquiries',
            ar: 'الاستفسارات العامة'
        },
        'contact-detail-2': {
            en: 'Dubai Design Studio',
            ar: 'استوديو دبي للتصميم'
        },
        'contact-detail-3': {
            en: 'Business Bay, Dubai, United Arab Emirates',
            ar: 'الخليج التجاري، دبي، الإمارات العربية المتحدة'
        },
        'contact-detail-4': {
            en: 'Mumbai Studio',
            ar: 'استوديو مومباي للتصميم'
        },
        'contact-detail-5': {
            en: 'Bandra Kurla Complex, Mumbai, India',
            ar: 'مجمع باندرا كورلا، مومباي، الهند'
        },
        'form-name': {
            en: 'Full Name',
            ar: 'الاسم الكامل'
        },
        'form-email': {
            en: 'Email Address',
            ar: 'البريد الإلكتروني'
        },
        'form-type': {
            en: 'Project Type (e.g. Interior Design, Exhibition)',
            ar: 'نوع المشروع (مثل: تصميم داخلي، جناح معرض)'
        },
        'form-brief': {
            en: 'Project Brief & Timeline',
            ar: 'ملخص المشروع والجدول الزمني المطلوب'
        },
        'form-submit': {
            en: 'Submit Inquiry',
            ar: 'إرسال الطلب'
        },
        'footer-copy': {
            en: 'All Rights Reserved.',
            ar: 'جميع الحقوق محفوظة.'
        }
    };

    let currentLang = localStorage.getItem('lang') || 'en';

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;
        
        // Toggle dir property for RTL compatibility
        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
        }

        // Apply translations
        const translatableElements = document.querySelectorAll('[data-i18n]');
        translatableElements.forEach(elem => {
            const key = elem.getAttribute('data-i18n');
            if (translations[key] && translations[key][lang]) {
                // If it is a form placeholder/label or just text
                elem.textContent = translations[key][lang];
            }
        });

        // Update translation switch buttons label
        const switchButtons = document.querySelectorAll('#lang-toggle, #lang-toggle-mobile');
        switchButtons.forEach(btn => {
            const label = btn.querySelector('.lang-label');
            if (label) {
                label.textContent = lang === 'en' ? 'العربية' : 'English';
            }
        });

        // Update theme toggler label translation
        const mobileLabel = document.querySelector('#theme-toggle-mobile .theme-label');
        if (mobileLabel) {
            const isDark = document.documentElement.classList.contains('dark-mode');
            if (isDark) {
                mobileLabel.textContent = lang === 'en' ? 'Light Mode' : 'الوضع المضيء';
            } else {
                mobileLabel.textContent = lang === 'en' ? 'Dark Mode' : 'الوضع الداكن';
            }
        }
    }

    // Bind lang buttons
    const langBtn = document.getElementById('lang-toggle');
    const langBtnMobile = document.getElementById('lang-toggle-mobile');

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            setLanguage(currentLang === 'en' ? 'ar' : 'en');
        });
    }
    if (langBtnMobile) {
        langBtnMobile.addEventListener('click', () => {
            setLanguage(currentLang === 'en' ? 'ar' : 'en');
        });
    }

    // Initialize Language translation
    setLanguage(currentLang);

    // ====================================================

  // --- 2. Lenis Scroll System ---
      // ====================================================
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.5, // slightly longer for more premium feel
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // Sync GSAP ScrollTrigger with Lenis
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        if (lenis) {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0, 0);
        }
    }

  // --- 3. Custom Mouse Cursor ---
      // 3. Custom Magnetic Cursor Loop
    // ====================================================
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let isHovering = false;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });
    
    function animateCursor() {
        if (cursor) {
            const lerpFactor = isHovering ? 0.2 : 0.12;
            cursorX += (mouseX - cursorX) * lerpFactor;
            cursorY += (mouseY - cursorY) * lerpFactor;
            
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    const hoverElements = document.querySelectorAll('a, button, .pillar-card, .project-card, .service-detail-item');
    
    hoverElements.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('hover');
            isHovering = true;
        });
        elem.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('hover');
            isHovering = false;
            if (typeof gsap !== 'undefined') {
                gsap.to(elem, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
            }
        });
        
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const dx = (relX - centerX) * 0.4; 
            const dy = (relY - centerY) * 0.4;
            
            if(elem.classList.contains('btn-cta') || elem.classList.contains('btn-explore') || elem.classList.contains('btn-submit')) {
                if (typeof gsap !== 'undefined') {
                    gsap.to(elem, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
                }
            }
        });
    });


  // --- 4. Dramatic Preloader Sequence (GSAP) ---
      // 4. Dramatic Preloader Sequence (GSAP)
    // ====================================================
    const preloader = document.querySelector('.preloader');
    const preloaderLogoContainer = document.querySelector('.preloader-logo-container');
    const debugBadge = document.getElementById('whiteleaf-debug-badge');

    // Set initial states for hero elements so they don't flash before preloader finishes
    if (typeof gsap !== 'undefined') {
        console.log('[Whiteleaf Animations] Setting initial GSAP states for hero elements');
        gsap.set('.hero-img-inner', { 
            clipPath: 'inset(100% 100% 100% 100%)', 
            scale: 1.8, 
            opacity: 0,
            rotation: () => gsap.utils.random(-8, 8)
        });
        gsap.set('.h2g', { yPercent: 120, opacity: 0 });
        gsap.set('.hero-desc-text, .scroll-indicator-bottom', { opacity: 0, y: 20 });
    }

    if (preloader && typeof gsap !== 'undefined') {
        console.log('[Whiteleaf Animations] Starting preloader timeline');
        // Make preloader background pure dark for premium contrast
        preloader.style.backgroundColor = "#FDFCF9";

        const tlPreloader = gsap.timeline();
        if (lenis) {
            console.log('[Whiteleaf Animations] Temporarily pausing Lenis smooth scrolling during preloader');
            lenis.stop();
        }

        if (preloaderLogoContainer) {
            tlPreloader.to(preloaderLogoContainer, { opacity: 1, duration: 0.4, ease: 'power2.out' });
        }

        const preloaderLogoImg = document.querySelector('.preloader-logo-img');
        if (preloaderLogoImg) {
            gsap.set(preloaderLogoImg, { opacity: 0, scale: 0.85 });
            tlPreloader.to(preloaderLogoImg, { 
                opacity: 1, 
                scale: 1, 
                duration: 1.5, 
                ease: 'power3.out' 
            });
        }

        if (preloaderLogoContainer) {
            tlPreloader.to(preloaderLogoContainer, { 
                scale: 0.8, 
                opacity: 0, 
                duration: 0.8, 
                ease: 'power3.inOut',
                delay: 0.3
            });
        }

        tlPreloader.to(preloader, {
            yPercent: -100,
            duration: 1.4,
            ease: 'expo.inOut',
            borderBottomLeftRadius: '50%',
            borderBottomRightRadius: '50%'
        }, "-=0.4")
        .set(preloader, { display: 'none' }) // Completely display none after exit
        .call(() => {
            console.log('[Whiteleaf Animations] Preloader exit complete');
            if (lenis) {
                console.log('[Whiteleaf Animations] Resuming Lenis smooth scrolling');
                lenis.start();
            }
            // Fade out the debug badge
            if (debugBadge) {
                gsap.to(debugBadge, { opacity: 0, y: -20, duration: 0.5, onComplete: () => debugBadge.style.display = 'none' });
            }
            if (typeof animateHero === 'function') animateHero();
        });
    } else {
        console.log('[Whiteleaf Animations] Preloader or GSAP not found, bypassing preloader');
        if (preloader) preloader.style.display = 'none';
        if (debugBadge) debugBadge.style.display = 'none';
        if (typeof animateHero === 'function') animateHero();
    }

  // --- 5. Scroll Reveals ---
      function initScrollReveals() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        // 6.1 Generic text blocks - Skew and fade up
        const revealElements = gsap.utils.toArray('.reveal');
        revealElements.forEach(elem => {
            if (elem.closest('.hero-content') || elem.classList.contains('hero-visual')) return;

            gsap.fromTo(elem, 
                { opacity: 0, y: 80, skewY: 3 },
                {
                    opacity: 1,
                    y: 0,
                    skewY: 0,
                    duration: 1.2,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // 6.2 Pillar Cards - Dramatic Stagger
        const pillarCards = gsap.utils.toArray('.pillar-card');
        if (pillarCards.length > 0) {
            gsap.fromTo(pillarCards, 
                { opacity: 0, y: 150, rotateX: -10, transformPerspective: 1000 },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 1.5,
                    stagger: 0.15,
                    ease: 'expo.out',
                    scrollTrigger: {
                        trigger: '.pillars-grid',
                        start: 'top 75%'
                    }
                }
            );
            
            // Image Parallax inside Pillar Cards
            pillarCards.forEach(card => {
                const bg = card.querySelector('.card-bg');
                if (bg) {
                    gsap.to(bg, {
                        yPercent: 25,
                        scale: 1.1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true
                        }
                    });
                }
            });
        }
        
        // 6.3 Projects - Full-Screen Parallax Shifting & Service reveals
        const parallaxSections = gsap.utils.toArray('.parallax_sections .ps');
        parallaxSections.forEach(section => {
            const bg = section.querySelector('.bgp');
            const txt = section.querySelector('.fixed_t');
            
            if (bg) {
                gsap.fromTo(bg,
                    { yPercent: -15 },
                    {
                        yPercent: 15,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true
                        }
                    }
                );
            }
            
            if (txt) {
                gsap.to(txt, {
                    opacity: 0,
                    y: -60,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true
                    }
                });
            }
        });

        // Animates service detail items in services.html
        const serviceItems = gsap.utils.toArray('.service-detail-item');
        serviceItems.forEach(item => {
            const img = item.querySelector('.service-img-col');
            if (img) {
                gsap.fromTo(img, 
                    { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', scale: 1.25 },
                    {
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', 
                        scale: 1,
                        duration: 1.8,
                        ease: 'power4.out',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 80%'
                        }
                    }
                );
            }
        });

        // 6.4 Section Grid Divider Lines Reveal (Horizontal and Vertical)
        const horizontalGridLines = gsap.utils.toArray('.grid-line-h');
        horizontalGridLines.forEach(line => {
            gsap.fromTo(line, 
                { scaleX: 0, transformOrigin: 'left center' },
                {
                    scaleX: 1,
                    duration: 1.8,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: line,
                        start: 'top 95%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        const verticalGridLines = gsap.utils.toArray('.grid-line-v');
        verticalGridLines.forEach(line => {
            gsap.fromTo(line, 
                { scaleY: 0, transformOrigin: 'center top' },
                {
                    scaleY: 1,
                    duration: 1.8,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: line,
                        start: 'top 95%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    }
  // --- 100% Reliable Smooth Scroll-Triggered Count Up Animation ---
  window.triggerStatAnimation = function() {
    const statElements = document.querySelectorAll('.unboxed-stat-number');
    statElements.forEach(el => animateStatNumber(el));
  };

  function animateStatNumber(el) {
    if (el.dataset.animating === 'true') return;
    el.dataset.animating = 'true';

    const targetVal = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';

    if (!isNaN(targetVal)) {
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Exponential ease-out for ultra smooth digit progression
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = Math.floor(targetVal * easeProgress);

        el.textContent = currentVal + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = targetVal + suffix;
          el.dataset.animating = 'false';
        }
      }

      // Reset to 0 before starting count up
      el.textContent = '0' + suffix;
      requestAnimationFrame(step);
    } else {
      // Decode matrix animation for non-numeric text like "UAE & KSA"
      const originalText = el.dataset.originalText || el.textContent.trim();
      el.dataset.originalText = originalText;
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const duration = 1200;
      const startTime = performance.now();

      function stepText(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const revealedCount = Math.floor(progress * originalText.length);

        let result = "";
        for (let i = 0; i < originalText.length; i++) {
          if (i < revealedCount || originalText[i] === ' ' || originalText[i] === '&') {
            result += originalText[i];
          } else {
            result += chars[Math.floor(Math.random() * chars.length)];
          }
        }

        el.textContent = result;

        if (progress < 1) {
          requestAnimationFrame(stepText);
        } else {
          el.textContent = originalText;
          el.dataset.animating = 'false';
        }
      }

      requestAnimationFrame(stepText);
    }
  }

  function initStatCounters() {
    function setup() {
      const statElements = document.querySelectorAll('.unboxed-stat-number');
      if (!statElements.length) return;

      // IntersectionObserver with threshold: 0 for instant scroll detection
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateStatNumber(entry.target);
          }
        });
      }, { threshold: 0, rootMargin: '0px 0px -10px 0px' });

      statElements.forEach(el => {
        observer.observe(el);

        // Re-trigger count up on hover
        el.closest('.unboxed-stat-item')?.addEventListener('mouseenter', () => {
          el.dataset.animating = 'false';
          animateStatNumber(el);
        });
      });

      // Fallback scroll position check
      function checkScroll() {
        const strip = document.querySelector('.unboxed-stats-strip');
        if (strip) {
          const rect = strip.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
            window.triggerStatAnimation();
          }
        }
      }

      window.addEventListener('scroll', checkScroll, { passive: true });
      if (typeof lenis !== 'undefined') {
        lenis.on('scroll', checkScroll);
      }

      // Initial check in case elements are already visible
      checkScroll();
      setTimeout(checkScroll, 300);
      setTimeout(checkScroll, 1000);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setup);
    } else {
      setup();
    }
    window.addEventListener('load', setup);
  }

  initStatCounters();

  // Initialize scroll reveals
  if (typeof initScrollReveals === 'function') {
    initScrollReveals();
  }

  // --- 6. Scrolled Navbar state ---
      const navbar = document.querySelector('#main-nav');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

  // --- 7. Mobile Menu Drawer Toggle for services.html ---
      const menuBtn = document.querySelector('.mobile-menu-btn');
    const navOverlay = document.querySelector('.mobile-nav-overlay');
    const overlayLinks = document.querySelectorAll('.mobile-nav-links a');
    
    if (menuBtn && navOverlay) {
        menuBtn.addEventListener('click', () => {
            const isActive = navOverlay.classList.toggle('active');
            
            if (isActive) {
                menuBtn.children[0].style.transform = 'translateY(6px) rotate(45deg)';
                menuBtn.children[1].style.opacity = '0';
                menuBtn.children[2].style.transform = 'translateY(-7px) rotate(-45deg)';
                if (typeof lenis !== 'undefined' && lenis) lenis.stop();
            } else {
                menuBtn.children[0].style.transform = 'none';
                menuBtn.children[1].style.opacity = '1';
                menuBtn.children[2].style.transform = 'none';
                if (typeof lenis !== 'undefined' && lenis) lenis.start();
            }
        });
        
        overlayLinks.forEach(link => {
            link.addEventListener('click', () => {
                navOverlay.classList.remove('active');
                menuBtn.children[0].style.transform = 'none';
                menuBtn.children[1].style.opacity = '1';
                menuBtn.children[2].style.transform = 'none';
                if (typeof lenis !== 'undefined' && lenis) lenis.start();
            });
        });
    }
});
