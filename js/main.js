/* -------------------------------------------------------------
   WHITELEAF INTERIORS - MAIN JAVASCRIPT & RESPONSIVE HANDLER
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Whiteleaf Interiors - Fully Responsive Website Ready.');

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

function createServiceScene(containerId, buildSceneFn) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    40,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );

  const setResponsiveCamera = () => {
    if (window.innerWidth <= 600) {
      camera.position.set(0, 1.6, 5.2);
    } else if (window.innerWidth <= 1024) {
      camera.position.set(0, 1.8, 5.8);
    } else {
      camera.position.set(0, 1.9, 6.2);
    }
    camera.lookAt(0, 0.1, 0);
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

  renderer.domElement?.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
  }, false);

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const standGroup = new THREE.Group();
  scene.add(standGroup);

  // Materials
  const materials = {
    green: new THREE.MeshStandardMaterial({ color: 0x7c8d4c, metalness: 0.4, roughness: 0.3 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x1f1f1f, metalness: 0.6, roughness: 0.4 }),
    wall: new THREE.MeshStandardMaterial({ color: 0x121212, metalness: 0.1, roughness: 0.6 }), // premium black walls
    wood: new THREE.MeshStandardMaterial({ color: 0xc1a179, metalness: 0.1, roughness: 0.6 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.05, clearcoat: 1.0 }),
    screen: new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x2b3818, metalness: 0.8, roughness: 0.2 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 }),
    glowGreen: new THREE.MeshBasicMaterial({ color: 0x9dcb47 }),
    screenGlow: new THREE.MeshStandardMaterial({ color: 0x1a2b10, emissive: 0x7c8d4c, emissiveIntensity: 0.7, roughness: 0.2 }),
    glassClear: new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, metalness: 0.1, roughness: 0.1, clearcoat: 1.0 }),
    plantGreen: new THREE.MeshStandardMaterial({ color: 0x3d6e35, roughness: 0.6 }),
    whiteMarble: new THREE.MeshStandardMaterial({ color: 0xf5f4f0, roughness: 0.2, metalness: 0.1 })
  };

  buildSceneFn(scene, standGroup, materials);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2.2);
  directionalLight.position.set(2, 5, 3);
  scene.add(directionalLight);

  const spotLight = new THREE.SpotLight(0x7c8d4c, 4);
  spotLight.position.set(-2, 4, 3);
  scene.add(spotLight);

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

    standGroup.rotation.y += (mouseX * 0.4 - standGroup.rotation.y) * 0.05;
    standGroup.rotation.x += (mouseY * 0.2 - standGroup.rotation.x) * 0.05;

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
}

function buildExhibitionScene(scene, group, mats) {
  // 1. Raised Main Deck Floor & LED Edge Strip
  const floor = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.1, 3.0), mats.dark);
  floor.position.set(0, -0.8, 0);
  group.add(floor);

  const ledEdge = new THREE.Mesh(new THREE.BoxGeometry(4.22, 0.025, 0.04), mats.glowGreen);
  ledEdge.position.set(0, -0.75, 1.48);
  group.add(ledEdge);

  // Raised Wood Section (VIP Zone Floor)
  const vipDeck = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 1.5), mats.wood);
  vipDeck.position.set(1.0, -0.73, -0.4);
  group.add(vipDeck);

  // 2. Architectural L-Back Wall (Dark Matte + Gold Accent Trim)
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 0.08), mats.wall);
  backWall.position.set(-0.7, 0.4, -1.1);
  group.add(backWall);

  const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.4, 1.6), mats.wall);
  sideWall.position.set(-1.86, 0.4, -0.3);
  group.add(sideWall);

  // Vertical Acoustic Slats on Back Wall
  const slatGeo = new THREE.BoxGeometry(0.04, 2.4, 0.03);
  for (let i = 0; i < 7; i++) {
    const slat = new THREE.Mesh(slatGeo, mats.wood);
    slat.position.set(0.6 + i * 0.22, 0.4, -1.06);
    group.add(slat);
  }

  // 3. Cantilevered Overhead Canopy & Downlights
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 1.6), mats.wall);
  canopy.position.set(-0.6, 1.56, -0.3);
  group.add(canopy);

  // Canopy Downlights (Spotlight Mesh Fixtures)
  for (let i = 0; i < 3; i++) {
    const lightSpot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16), mats.gold);
    lightSpot.position.set(-1.4 + i * 0.8, 1.51, 0.2);
    group.add(lightSpot);

    const lightGlow = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), mats.glowGreen);
    lightGlow.position.set(-1.4 + i * 0.8, 1.50, 0.2);
    group.add(lightGlow);
  }

  // Metallic Support Column for Canopy
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.3, 16), mats.gold);
  column.position.set(0.65, 0.38, 0.45);
  group.add(column);

  // 4. Large Digital LED Widescreen Video Wall
  const ledFrame = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.94, 0.02), mats.gold);
  ledFrame.position.set(-0.7, 0.65, -1.04);
  group.add(ledFrame);

  const screen = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.88, 0.02), mats.screenGlow);
  screen.position.set(-0.7, 0.65, -1.02);
  group.add(screen);

  // 5. Single-Level VIP Executive Ground Lounge Seating (Single Level - No 2nd floor layer)
  const loungeTable = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.45, 24), mats.whiteMarble);
  loungeTable.position.set(1.0, -0.48, -0.3);
  group.add(loungeTable);

  const loungeTop = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.03, 24), mats.gold);
  loungeTop.position.set(1.0, -0.25, -0.3);
  group.add(loungeTop);

  // 6. Modern Reception Desk & Brand Lighting Strip
  const deskBody = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.65, 0.4), mats.whiteMarble);
  deskBody.position.set(-0.6, -0.42, 0.6);
  group.add(deskBody);

  const deskGreenAccent = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.66, 0.41), mats.green);
  deskGreenAccent.position.set(-0.8, -0.42, 0.6);
  group.add(deskGreenAccent);

  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.04, 0.44), mats.wood);
  deskTop.position.set(-0.6, -0.08, 0.6);
  group.add(deskTop);

  const deskLed = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.02, 0.02), mats.glowGreen);
  deskLed.position.set(-0.6, -0.73, 0.81);
  group.add(deskLed);

  // 7. Showcase Display Pedestal with Floating Kinetic Gem
  const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.7, 0.35), mats.whiteMarble);
  pedestal.position.set(0.65, -0.4, 0.8);
  group.add(pedestal);

  const displayGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), mats.gold);
  displayGem.position.set(0.65, 0.08, 0.8);
  group.add(displayGem);

  const gemGlow = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), mats.glowGreen);
  gemGlow.position.set(0.65, 0.08, 0.8);
  group.add(gemGlow);

  // 8. Interactive Touchscreen Totem / Kiosk
  const totemBase = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.04, 0.25), mats.dark);
  totemBase.position.set(-1.5, -0.73, 0.5);
  group.add(totemBase);

  const totemBody = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.1, 0.08), mats.wall);
  totemBody.position.set(-1.5, -0.18, 0.5);
  totemBody.rotation.x = -0.1;
  group.add(totemBody);

  const totemScreen = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.5, 0.01), mats.screenGlow);
  totemScreen.position.set(-1.5, 0.05, 0.54);
  totemScreen.rotation.x = -0.1;
  group.add(totemScreen);

  // 10. Architectural Plant Pot & Foliage Accent
  const plantPot = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.1, 0.35, 16), mats.whiteMarble);
  plantPot.position.set(1.6, -0.6, 1.1);
  group.add(plantPot);

  const plantLeaves1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), mats.plantGreen);
  plantLeaves1.position.set(1.6, -0.38, 1.1);
  group.add(plantLeaves1);

  const plantLeaves2 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), mats.plantGreen);
  plantLeaves2.position.set(1.52, -0.26, 1.15);
  group.add(plantLeaves2);
}

function buildEventsScene(scene, group, mats) {
  // 1. Curved Multi-Tier Stage Platform
  const mainStage = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.5, 0.12, 32), mats.dark);
  mainStage.position.set(0, -0.74, 0.2);
  group.add(mainStage);

  const stageLedEdge = new THREE.Mesh(new THREE.CylinderGeometry(2.32, 2.32, 0.025, 32, 1, true), mats.glowGreen);
  stageLedEdge.position.set(0, -0.7, 0.2);
  group.add(stageLedEdge);

  const centerRiser = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.95, 0.06, 24), mats.whiteMarble);
  centerRiser.position.set(0, -0.65, 0.1);
  group.add(centerRiser);

  // 2. Triple Widescreen LED Curved Video Wall
  const centerScreen = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.2, 0.04), mats.screenGlow);
  centerScreen.position.set(0, 0.35, -1.0);
  group.add(centerScreen);

  const leftScreen = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 0.04), mats.screenGlow);
  leftScreen.position.set(-1.45, 0.3, -0.85);
  leftScreen.rotation.y = Math.PI / 8;
  group.add(leftScreen);

  const rightScreen = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 0.04), mats.screenGlow);
  rightScreen.position.set(1.45, 0.3, -0.85);
  rightScreen.rotation.y = -Math.PI / 8;
  group.add(rightScreen);

  // LED Screen Gold Framing
  const centerFrame = new THREE.Mesh(new THREE.BoxGeometry(2.06, 1.26, 0.02), mats.gold);
  centerFrame.position.set(0, 0.35, -1.02);
  group.add(centerFrame);

  // 3. Heavy Overhead Lighting Rig & Moving Head Spotlights
  const trussBar = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 0.08), mats.gold);
  trussBar.position.set(0, 1.6, -0.4);
  group.add(trussBar);

  for (let i = 0; i < 4; i++) {
    const spotFixture = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.18, 12), mats.wall);
    spotFixture.position.set(-1.35 + i * 0.9, 1.48, -0.4);
    spotFixture.rotation.x = Math.PI / 6;
    group.add(spotFixture);

    const spotLens = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), mats.glowGreen);
    spotLens.position.set(-1.35 + i * 0.9, 1.38, -0.36);
    group.add(spotLens);
  }

  // 4. Line Array Speaker Towers (Left & Right)
  const speakerL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.9, 0.25), mats.wall);
  speakerL.position.set(-1.9, 0.2, -0.4);
  group.add(speakerL);

  const speakerR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.9, 0.25), mats.wall);
  speakerR.position.set(1.9, 0.2, -0.4);
  group.add(speakerR);

  // 5. Angular Keynote Lectern & Digital Monitor
  const lecternBase = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.75, 0.35), mats.wall);
  lecternBase.position.set(-0.6, -0.28, 0.4);
  lecternBase.rotation.y = -0.2;
  group.add(lecternBase);

  const lecternGoldPlate = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.4, 0.01), mats.gold);
  lecternGoldPlate.position.set(-0.58, -0.28, 0.58);
  lecternGoldPlate.rotation.y = -0.2;
  group.add(lecternGoldPlate);

  const lecternScreen = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.22), mats.screenGlow);
  lecternScreen.position.set(-0.6, 0.1, 0.4);
  lecternScreen.rotation.x = -Math.PI / 6;
  group.add(lecternScreen);

  // 6. VIP Audience Lounge Seating
  const chair1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.2, 0.3, 16), mats.green);
  chair1.position.set(0.6, -0.5, 0.8);
  group.add(chair1);

  const chair2 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.2, 0.3, 16), mats.green);
  chair2.position.set(1.2, -0.5, 0.6);
  group.add(chair2);

  const lowTable = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16), mats.gold);
  lowTable.position.set(0.9, -0.55, 0.7);
  group.add(lowTable);
}

function buildInteriorScene(scene, group, mats) {
  // 1. Luxury Parquet Flooring & Contrast Lounge Rug
  const floor = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.1, 3.0), mats.dark);
  floor.position.set(0, -0.8, 0);
  group.add(floor);

  const accentRug = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.02, 1.8), mats.whiteMarble);
  accentRug.position.set(-0.2, -0.74, 0.2);
  group.add(accentRug);

  // 2. Feature Wall with Vertical Timber Louvers & LED Accent Strips
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.4, 0.08), mats.wall);
  backWall.position.set(0, 0.4, -1.1);
  group.add(backWall);

  // Vertical timber slats on left half of wall
  for (let i = 0; i < 9; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.4, 0.03), mats.wood);
    slat.position.set(-1.6 + i * 0.2, 0.4, -1.06);
    group.add(slat);
  }

  // Recessed LED cove lighting strip behind slats
  const coveLed = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.03, 0.02), mats.glowGreen);
  coveLed.position.set(-0.8, 1.55, -1.04);
  group.add(coveLed);

  // Framed Modern Art Piece / Metallic Crest
  const artFrame = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.02), mats.gold);
  artFrame.position.set(0.8, 0.65, -1.05);
  group.add(artFrame);

  const artCanvas = new THREE.Mesh(new THREE.BoxGeometry(0.82, 1.02, 0.01), mats.green);
  artCanvas.position.set(0.8, 0.65, -1.03);
  group.add(artCanvas);

  // Integrated Shelving Unit on Right
  const shelfBack = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.2, 0.2), mats.wall);
  shelfBack.position.set(1.6, 0.3, -0.9);
  group.add(shelfBack);

  for (let s = 0; s < 3; s++) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.03, 0.22), mats.wood);
    shelf.position.set(1.6, -0.3 + s * 0.6, -0.89);
    group.add(shelf);

    // Small decorative vase / object on shelf
    const obj = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.15, 12), mats.gold);
    obj.position.set(1.5 + (s % 2) * 0.18, -0.21 + s * 0.6, -0.85);
    group.add(obj);
  }

  // 3. Executive Marble Desk & Ergonomic Leather Chair
  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.06, 0.7), mats.whiteMarble);
  deskTop.position.set(-0.4, -0.22, 0.2);
  group.add(deskTop);

  const deskModesty = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 0.04), mats.wood);
  deskModesty.position.set(-0.4, -0.48, -0.1);
  group.add(deskModesty);

  const deskLegR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.52, 0.68), mats.gold);
  deskLegR.position.set(0.32, -0.48, 0.2);
  group.add(deskLegR);

  // Desk Laptop
  const laptop = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.22), mats.metal);
  laptop.position.set(-0.4, -0.18, 0.2);
  group.add(laptop);

  const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.01), mats.screenGlow);
  laptopScreen.position.set(-0.4, -0.07, 0.1);
  laptopScreen.rotation.x = -0.2;
  group.add(laptopScreen);

  // Executive Chair
  const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.42), mats.green);
  chairSeat.position.set(-0.4, -0.45, -0.35);
  group.add(chairSeat);

  const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.05), mats.green);
  chairBack.position.set(-0.4, -0.18, -0.54);
  chairBack.rotation.x = -0.08;
  group.add(chairBack);

  const chairBase = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8), mats.metal);
  chairBase.position.set(-0.4, -0.6, -0.35);
  group.add(chairBase);

  // 4. Designer Floor Lamp & Architectural Plant
  const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.8, 12), mats.gold);
  lampPole.position.set(-1.6, 0.1, 0.7);
  group.add(lampPole);

  const lampShade = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), mats.whiteMarble);
  lampShade.position.set(-1.6, 1.0, 0.7);
  group.add(lampShade);

  const plantPot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.4, 16), mats.gold);
  plantPot.position.set(0.9, -0.55, 0.9);
  group.add(plantPot);

  const plantTop = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), mats.plantGreen);
  plantTop.position.set(0.9, -0.28, 0.9);
  group.add(plantTop);
}

function buildActivationScene(scene, group, mats) {
  // 1. Futuristic Raised Platform & LED Outer Strip
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.4, 0.1, 32), mats.dark);
  floor.position.set(0, -0.75, 0);
  group.add(floor);

  const ledEdge = new THREE.Mesh(new THREE.CylinderGeometry(2.32, 2.32, 0.025, 32, 1, true), mats.glowGreen);
  ledEdge.position.set(0, -0.7, 0);
  group.add(ledEdge);

  // 2. Experiential Tunnel Portal Arches (Sleek Rectangular Gateway Frames)
  for (let i = 0; i < 3; i++) {
    const archTop = new THREE.Mesh(new THREE.BoxGeometry(2.2 - i * 0.3, 0.08, 0.08), mats.gold);
    archTop.position.set(0, 1.2 - i * 0.1, -0.8 + i * 0.4);
    group.add(archTop);

    const archL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.9 - i * 0.1, 0.08), mats.gold);
    archL.position.set(-1.06 + i * 0.15, 0.25 - i * 0.05, -0.8 + i * 0.4);
    group.add(archL);

    const archR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.9 - i * 0.1, 0.08), mats.gold);
    archR.position.set(1.06 - i * 0.15, 0.25 - i * 0.05, -0.8 + i * 0.4);
    group.add(archR);

    const archGlow = new THREE.Mesh(new THREE.BoxGeometry(2.18 - i * 0.3, 0.02, 0.09), mats.glowGreen);
    archGlow.position.set(0, 1.15 - i * 0.1, -0.8 + i * 0.4);
    group.add(archGlow);
  }

  // 3. Central Multi-Tiered Hologram Activation Plinth
  const plinthBase = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.7, 0.4, 24), mats.whiteMarble);
  plinthBase.position.set(0, -0.5, 0.2);
  group.add(plinthBase);

  const plinthTop = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.05, 24), mats.green);
  plinthTop.position.set(0, -0.28, 0.2);
  group.add(plinthTop);

  // Central Floating Holographic Sculpture
  const holoCore = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2, 0), mats.gold);
  holoCore.position.set(0, 0.1, 0.2);
  group.add(holoCore);


  // 4. Interactive VR Touchpoint & Pod (Left side)
  const kioskL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.85, 0.35), mats.wall);
  kioskL.position.set(-1.2, -0.32, 0.4);
  group.add(kioskL);

  const kioskScreenL = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.45, 0.01), mats.screenGlow);
  kioskScreenL.position.set(-1.2, -0.15, 0.58);
  group.add(kioskScreenL);

  // Floating VR Headset Model on Pod
  const vrHeadset = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.12), mats.gold);
  vrHeadset.position.set(-1.2, 0.16, 0.4);
  group.add(vrHeadset);

  // 5. Digital Product Showcase Pod (Right side)
  const kioskR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.85, 0.35), mats.wall);
  kioskR.position.set(1.2, -0.32, 0.4);
  group.add(kioskR);

  const kioskScreenR = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.45, 0.01), mats.screenGlow);
  kioskScreenR.position.set(1.2, -0.15, 0.58);
  group.add(kioskScreenR);

  const productGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.1, 0), mats.glowGreen);
  productGem.position.set(1.2, 0.16, 0.4);
  group.add(productGem);

  // 6. Orbital Satellites / Floating Ambient Globes
  for (let g = 0; g < 4; g++) {
    const angle = (g / 4) * Math.PI * 2;
    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), mats.gold);
    globe.position.set(Math.cos(angle) * 1.5, 0.7 + Math.sin(angle * 3) * 0.15, Math.sin(angle) * 1.0 - 0.2);
    group.add(globe);
  }
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
    1: 'Concept Discovery',
    2: 'Holographic Layout',
    3: 'Material Fabrication',
    4: 'Spatial Experience'
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
      if (stepTitleOverlay) stepTitleOverlay.textContent = stepTitles[step];

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
            if (stepTitleOverlay) stepTitleOverlay.textContent = stepTitles[step];
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
    const scale4 = activeStep === 4 ? 1 : 0.001;

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
