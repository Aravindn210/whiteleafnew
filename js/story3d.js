/* -------------------------------------------------------------
   WHITELEAF INTERIORS - HIGH-DETAIL 3D SCROLL STORYTELLING (#storytelling)
   Hyper-Realistic Exhibition Stand & Trade Show Architecture
   ------------------------------------------------------------- */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('storytelling') || document.querySelector('.bsl-about-story-section');
    const canvas = document.getElementById('about-story-webgl');
    if (!container || !canvas || typeof THREE === 'undefined') return;

    // 1. SCENE, CAMERA & UNREAL ENGINE RENDERER SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040507);
    scene.fog = new THREE.FogExp2(0x040507, 0.01);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 14, 46);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // 2. CINEMATIC TRADE SHOW SPOTLIGHT LIGHTING RIG
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    mainKeyLight.position.set(25, 45, 30);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 2048;
    mainKeyLight.shadow.mapSize.height = 2048;
    mainKeyLight.shadow.bias = -0.0001;
    scene.add(mainKeyLight);

    // Lime Green Brand Spotlight (#A6CE39)
    const accentSpot = new THREE.SpotLight(0xa6ce39, 5, 60, Math.PI / 4, 0.35, 1);
    accentSpot.position.set(-18, 28, 15);
    scene.add(accentSpot);

    // Warm Interior VIP Lounge Point Light
    const warmLoungeLight = new THREE.PointLight(0xffd194, 3, 35);
    warmLoungeLight.position.set(-6, 7, -4);
    scene.add(warmLoungeLight);

    // Cool White Showcase Spot
    const showcaseSpot = new THREE.SpotLight(0xf8fafc, 4, 45, Math.PI / 5, 0.3);
    showcaseSpot.position.set(12, 22, 10);
    scene.add(showcaseSpot);

    // 3. ARCHITECTURAL MATERIAL PALETTE
    const materials = {
      hallFloorMat: new THREE.MeshPhysicalMaterial({
        color: 0x06080b,
        roughness: 0.15,
        metalness: 0.9,
        clearcoat: 0.8,
        clearcoatRoughness: 0.05
      }),
      raisedDeckMat: new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.12,
        metalness: 0.05
      }),
      blackAcrylicMat: new THREE.MeshPhysicalMaterial({
        color: 0x0a0c10,
        roughness: 0.08,
        metalness: 0.4,
        clearcoat: 1.0
      }),
      woodWallMat: new THREE.MeshStandardMaterial({
        color: 0x855428,
        roughness: 0.35,
        metalness: 0.05
      }),
      steelTrussMat: new THREE.MeshStandardMaterial({
        color: 0x1e2229,
        metalness: 0.92,
        roughness: 0.25
      }),
      glassWallMat: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.35,
        transmission: 0.9,
        roughness: 0.04,
        ior: 1.52
      }),
      ledScreenMat: new THREE.MeshBasicMaterial({
        color: 0xa6ce39,
        transparent: true,
        opacity: 0.92
      }),
      neonSkirtingMat: new THREE.MeshBasicMaterial({
        color: 0xa6ce39
      }),
      goldBrassMat: new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.95,
        roughness: 0.18
      }),
      plantLeafMat: new THREE.MeshStandardMaterial({
        color: 0x15803d,
        roughness: 0.4
      }),
      leatherSofaMat: new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.5
      }),
      visitorMat: new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.7,
        transparent: true,
        opacity: 0.8
      })
    };

    // 4. MASTER BOOTH CONTAINER
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Exhibition Hall Floor Grid Base
    const floorGeo = new THREE.PlaneGeometry(180, 180);
    const floorMesh = new THREE.Mesh(floorGeo, materials.hallFloorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    masterGroup.add(floorMesh);

    // --- SCENE 1: CONCEPT BLUEPRINT GRID ---
    const conceptGroup = new THREE.Group();
    masterGroup.add(conceptGroup);

    const gridHelper = new THREE.GridHelper(70, 46, 0xa6ce39, 0x334155);
    gridHelper.position.y = 0.06;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0;
    conceptGroup.add(gridHelper);

    // --- SCENE 2 & 3: FULL EXHIBITION STAND ARCHITECTURE ---
    const boothGroup = new THREE.Group();
    masterGroup.add(boothGroup);

    // 1. Raised Exhibition Platform Deck (28m x 20m x 0.4m)
    const deckGeo = new THREE.BoxGeometry(28, 0.4, 20);
    const deckMesh = new THREE.Mesh(deckGeo, materials.raisedDeckMat);
    deckMesh.position.set(0, 0.2, 0);
    deckMesh.receiveShadow = true;
    boothGroup.add(deckMesh);

    // Illuminated Green LED Base Skirting Strip
    const deckNeonGeo = new THREE.BoxGeometry(28.3, 0.12, 20.3);
    const deckNeon = new THREE.Mesh(deckNeonGeo, materials.neonSkirtingMat);
    deckNeon.position.set(0, 0.06, 0);
    boothGroup.add(deckNeon);

    // 2. Heavy Architectural Back Wall Structure (28m W x 14m H)
    const backWallGeo = new THREE.BoxGeometry(28, 14, 1.2);
    const backWall = new THREE.Mesh(backWallGeo, materials.blackAcrylicMat);
    backWall.position.set(0, 7, -9.4);
    backWall.castShadow = true;
    boothGroup.add(backWall);

    // Vertical Wood Slat Feature Accent Wall (12m W x 13m H)
    const slatGroup = new THREE.Group();
    boothGroup.add(slatGroup);
    for (let i = -5.5; i <= 5.5; i += 0.8) {
      const slatGeo = new THREE.BoxGeometry(0.4, 13, 0.4);
      const slat = new THREE.Mesh(slatGeo, materials.woodWallMat);
      slat.position.set(i, 6.7, -8.6);
      slat.castShadow = true;
      slatGroup.add(slat);
    }

    // Huge Curved High-Res LED Screen Display (18m W x 8.5m H)
    const ledScreenGeo = new THREE.PlaneGeometry(18, 8.5);
    const ledScreen = new THREE.Mesh(ledScreenGeo, materials.ledScreenMat);
    ledScreen.position.set(0, 7.2, -8.6);
    boothGroup.add(ledScreen);

    // 3. Overhead Architectural Canopy Header Fascia with Brand Signage
    const canopyGeo = new THREE.BoxGeometry(28, 2.2, 7);
    const canopyHeader = new THREE.Mesh(canopyGeo, materials.blackAcrylicMat);
    canopyHeader.position.set(0, 14.1, -6.5);
    canopyHeader.castShadow = true;
    boothGroup.add(canopyHeader);

    // Illuminated 3D Brand Logo Header Strip
    const headerStripGeo = new THREE.BoxGeometry(28.2, 0.2, 7.2);
    const headerStrip = new THREE.Mesh(headerStripGeo, materials.neonSkirtingMat);
    headerStrip.position.set(0, 13, -6.5);
    boothGroup.add(headerStrip);

    // 4. Structural Quad Steel Columns (8 Pillars)
    const pillarGeo = new THREE.BoxGeometry(0.8, 14, 0.8);
    const pillarPositions = [
      [-13.5, 7, -9.4], [13.5, 7, -9.4], [-13.5, 7, 9.4], [13.5, 7, 9.4],
      [-7, 7, -9.4],    [7, 7, -9.4],    [-7, 7, 9.4],    [7, 7, 9.4]
    ];
    const pillars = [];
    pillarPositions.forEach(pos => {
      const p = new THREE.Mesh(pillarGeo, materials.steelTrussMat);
      p.position.set(pos[0], pos[1], pos[2]);
      p.scale.y = 0.001;
      p.castShadow = true;
      boothGroup.add(p);
      pillars.push(p);
    });

    // 5. VIP GLASS MEETING SUITE (Left Zone)
    const vipSuiteGroup = new THREE.Group();
    boothGroup.add(vipSuiteGroup);

    // Glass Enclosure Walls
    const glassWallGeo = new THREE.BoxGeometry(10, 7, 0.2);
    const glassBack = new THREE.Mesh(glassWallGeo, materials.glassWallMat);
    glassBack.position.set(-8, 3.7, -4);
    vipSuiteGroup.add(glassBack);

    const glassSide = new THREE.Mesh(new THREE.BoxGeometry(0.2, 7, 8), materials.glassWallMat);
    glassSide.position.set(-3, 3.7, 0);
    vipSuiteGroup.add(glassSide);

    // Luxury Executive Lounge Seating
    const sofaGeo = new THREE.BoxGeometry(5.5, 1.2, 2.2);
    const sofa = new THREE.Mesh(sofaGeo, materials.leatherSofaMat);
    sofa.position.set(-8, 1, -2);
    sofa.castShadow = true;
    vipSuiteGroup.add(sofa);

    const coffeeTableGeo = new THREE.BoxGeometry(3, 0.7, 1.6);
    const coffeeTable = new THREE.Mesh(coffeeTableGeo, materials.raisedDeckMat);
    coffeeTable.position.set(-8, 0.75, 0.8);
    vipSuiteGroup.add(coffeeTable);

    // 6. FRONT CURVED RECEPTION & INFORMATION DESK
    const deskGroup = new THREE.Group();
    boothGroup.add(deskGroup);

    const deskGeo = new THREE.BoxGeometry(10, 2.6, 2.8);
    const receptionDesk = new THREE.Mesh(deskGeo, materials.blackAcrylicMat);
    receptionDesk.position.set(0, 1.5, 5);
    receptionDesk.castShadow = true;
    deskGroup.add(receptionDesk);

    const deskNeonGeo = new THREE.BoxGeometry(10.2, 0.15, 2.9);
    const deskNeon = new THREE.Mesh(deskNeonGeo, materials.neonSkirtingMat);
    deskNeon.position.set(0, 0.3, 5);
    deskGroup.add(deskNeon);

    // 7. TWO ILLUMINATED VERTICAL SHOWCASE TOWERS (Right Zone)
    const showcaseGroup = new THREE.Group();
    boothGroup.add(showcaseGroup);

    const towerGeo = new THREE.BoxGeometry(2.4, 7, 2.4);
    const tower1 = new THREE.Mesh(towerGeo, materials.blackAcrylicMat);
    tower1.position.set(8.5, 3.7, -1);
    tower1.castShadow = true;
    showcaseGroup.add(tower1);

    const towerGlassGeo = new THREE.BoxGeometry(2, 3.5, 2);
    const towerGlass1 = new THREE.Mesh(towerGlassGeo, materials.glassWallMat);
    towerGlass1.position.set(8.5, 4.5, -1);
    showcaseGroup.add(towerGlass1);

    const tower2 = new THREE.Mesh(towerGeo, materials.blackAcrylicMat);
    tower2.position.set(8.5, 3.7, 5);
    tower2.castShadow = true;
    showcaseGroup.add(tower2);

    // 8. ARCHITECTURAL PLANTER BOXES & GREENERY
    const planterGeo = new THREE.BoxGeometry(3.5, 1.4, 1.2);
    const planter1 = new THREE.Mesh(planterGeo, materials.blackAcrylicMat);
    planter1.position.set(-12, 0.9, 8);
    boothGroup.add(planter1);

    const plantGeo = new THREE.DodecahedronGeometry(1.2);
    const plant1 = new THREE.Mesh(plantGeo, materials.plantLeafMat);
    plant1.position.set(-12, 2.2, 8);
    boothGroup.add(plant1);

    const planter2 = new THREE.Mesh(planterGeo, materials.blackAcrylicMat);
    planter2.position.set(12, 0.9, 8);
    boothGroup.add(planter2);

    const plant2 = new THREE.Mesh(plantGeo, materials.plantLeafMat);
    plant2.position.set(12, 2.2, 8);
    boothGroup.add(plant2);

    // --- VISITOR SILHOUETTES ---
    const visitorGroup = new THREE.Group();
    masterGroup.add(visitorGroup);

    const visitorGeo = new THREE.CylinderGeometry(0.45, 0.45, 3.2, 16);
    const visitorPositions = [
      [-3.5, 1.8, 5], [3.5, 1.8, 5], [8.5, 1.8, 2], [-8, 1.8, 0], [-10, 1.8, 4], [2, 1.8, -2], [11, 1.8, 7]
    ];
    const visitors = [];
    visitorPositions.forEach(pos => {
      const v = new THREE.Mesh(visitorGeo, materials.visitorMat);
      v.position.set(pos[0], pos[1], pos[2]);
      visitorGroup.add(v);
      visitors.push(v);
    });

    // 5. GSAP SCROLLTRIGGER STORYLINE TIMELINE
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=600%',
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            updateLifecycleStory(self.progress);
          }
        }
      });
    }

    // 6. 5-SCENE LIFECYCLE ANIMATION CONTROLLER
    function updateLifecycleStory(p) {
      // --- Scene 1: Concept Beginning (0.00 - 0.20) ---
      if (p < 0.20) {
        const t = p / 0.20;
        camera.position.x = gsap.utils.interpolate(0, -10, t);
        camera.position.y = gsap.utils.interpolate(18, 14, t);
        camera.position.z = gsap.utils.interpolate(52, 42, t);
        camera.lookAt(0, 5, 0);

        gridHelper.material.opacity = gsap.utils.interpolate(0, 0.95, t);

        pillars.forEach(col => col.scale.y = 0.001);
        deckMesh.scale.set(0.001, 0.001, 0.001);
        canopyHeader.position.y = 30;
      }
      // --- Scene 2: 3D Transformation (0.20 - 0.40) ---
      else if (p < 0.40) {
        const t = (p - 0.20) / 0.20;
        camera.position.x = gsap.utils.interpolate(-10, 18, t);
        camera.position.y = gsap.utils.interpolate(14, 18, t);
        camera.position.z = gsap.utils.interpolate(42, 34, t);
        camera.lookAt(0, 6, 0);

        deckMesh.scale.set(1, 1, 1);
        deckMesh.position.y = gsap.utils.interpolate(-4, 0.2, t);

        pillars.forEach((col, idx) => {
          const delayT = Math.max(0, Math.min(1, (t - idx * 0.08) / 0.35));
          col.scale.y = gsap.utils.interpolate(0.001, 1, delayT);
        });

        backWall.position.y = gsap.utils.interpolate(-10, 7, t);
        canopyHeader.position.y = gsap.utils.interpolate(30, 14.1, t);
        ledScreen.material.opacity = gsap.utils.interpolate(0, 0.92, t);
      }
      // --- Scene 3: Exhibition Build Process (0.40 - 0.60) ---
      else if (p < 0.60) {
        const t = (p - 0.40) / 0.20;
        camera.position.x = gsap.utils.interpolate(18, 0, t);
        camera.position.y = gsap.utils.interpolate(18, 7, t);
        camera.position.z = gsap.utils.interpolate(34, 20, t);
        camera.lookAt(0, 5, 0);

        receptionDesk.position.z = gsap.utils.interpolate(18, 5, t);
        vipSuiteGroup.position.y = gsap.utils.interpolate(-6, 0, t);
        showcaseGroup.position.y = gsap.utils.interpolate(-6, 0, t);
        warmLoungeLight.intensity = gsap.utils.interpolate(0, 3.5, t);
      }
      // --- Scene 4: Final Exhibition Experience (0.60 - 0.80) ---
      else if (p < 0.80) {
        const t = (p - 0.60) / 0.20;
        camera.position.x = gsap.utils.interpolate(0, -22, t);
        camera.position.y = gsap.utils.interpolate(7, 12, t);
        camera.position.z = gsap.utils.interpolate(20, 32, t);
        camera.lookAt(0, 6, 0);

        accentSpot.intensity = gsap.utils.interpolate(1, 5.5, t);
        showcaseSpot.intensity = gsap.utils.interpolate(0, 4.5, t);
        visitors.forEach(v => v.material.opacity = gsap.utils.interpolate(0, 0.85, t));
      }
      // --- Scene 5: Premium Brand Showcase (0.80 - 1.00) ---
      else {
        const t = (p - 0.80) / 0.20;
        camera.position.x = gsap.utils.interpolate(-22, 0, t);
        camera.position.y = gsap.utils.interpolate(12, 26, t);
        camera.position.z = gsap.utils.interpolate(32, 56, t);
        camera.lookAt(0, 7, 0);

        masterGroup.rotation.y = gsap.utils.interpolate(0, 0.35, t);
      }

      // Sync active story text card overlay
      const sceneIndex = Math.min(5, Math.max(1, Math.floor(p * 5.001) + 1));
      document.querySelectorAll('.story-scene-card').forEach(card => {
        const cardNum = parseInt(card.getAttribute('data-scene'), 10);
        if (cardNum === sceneIndex) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    }

    // 7. RENDER LOOP & RESPONSIVE LISTENER
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    function updateCameraAspect() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.fov = window.innerWidth < 768 ? 62 : 45;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', updateCameraAspect);
    updateCameraAspect();

    // Initial update
    updateLifecycleStory(0);
  });
})();
