/* -------------------------------------------------------------
   WHITELEAF INTERIORS - HIGH-DETAIL 3D SCROLL STORYTELLING (#storytelling)
   Real Architectural Exhibition Stand Experience
   ------------------------------------------------------------- */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('storytelling') || document.querySelector('.bsl-about-story-section');
    const canvas = document.getElementById('about-story-webgl');
    if (!container || !canvas || typeof THREE === 'undefined') return;

    // 1. SCENE, CAMERA & UNREAL ENGINE 5 RENDERER SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040507);
    scene.fog = new THREE.FogExp2(0x040507, 0.011);

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
    renderer.toneMappingExposure = 1.2;

    // 2. CINEMATIC MULTI-SPOTLIGHT ARCHITECTURAL LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainKeyLight.position.set(25, 40, 30);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 2048;
    mainKeyLight.shadow.mapSize.height = 2048;
    mainKeyLight.shadow.bias = -0.0001;
    scene.add(mainKeyLight);

    // Lime Green Accent Spotlight (#A6CE39)
    const accentSpot = new THREE.SpotLight(0xa6ce39, 4.5, 60, Math.PI / 4, 0.4, 1);
    accentSpot.position.set(-18, 26, 15);
    scene.add(accentSpot);

    // Warm Interior Lounge Light
    const warmLoungeLight = new THREE.PointLight(0xffd194, 2.5, 30);
    warmLoungeLight.position.set(0, 6, -4);
    scene.add(warmLoungeLight);

    // Cyan Product Pod Light
    const cyanSpot = new THREE.SpotLight(0x38bdf8, 3.5, 40, Math.PI / 6, 0.3);
    cyanSpot.position.set(12, 18, 8);
    scene.add(cyanSpot);

    // 3. PHYSICALLY REALISTIC PBR MATERIALS PALETTE
    const materials = {
      floorMat: new THREE.MeshPhysicalMaterial({
        color: 0x07090c,
        roughness: 0.18,
        metalness: 0.92,
        clearcoat: 0.7,
        clearcoatRoughness: 0.08
      }),
      glossyPanelMat: new THREE.MeshPhysicalMaterial({
        color: 0x0f1115,
        roughness: 0.12,
        metalness: 0.3,
        clearcoat: 0.9
      }),
      steelTrussMat: new THREE.MeshStandardMaterial({
        color: 0x1e2025,
        metalness: 0.92,
        roughness: 0.3
      }),
      glassRailMat: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        transmission: 0.9,
        roughness: 0.05,
        ior: 1.52
      }),
      woodSlatMat: new THREE.MeshStandardMaterial({
        color: 0x7c4d25,
        roughness: 0.4,
        metalness: 0.05
      }),
      marbleDeckMat: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.12,
        metalness: 0.08
      }),
      ledScreenMat: new THREE.MeshBasicMaterial({
        color: 0xa6ce39,
        transparent: true,
        opacity: 0.9
      }),
      neonStripMat: new THREE.MeshBasicMaterial({
        color: 0xa6ce39
      }),
      goldAccentMat: new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.95,
        roughness: 0.18
      }),
      visitorMat: new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.7,
        transparent: true,
        opacity: 0.75
      })
    };

    // 4. HIGH-DETAIL 3D EXHIBITION BOOTH MESHES
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Ground Reflective Floor
    const floorGeo = new THREE.PlaneGeometry(160, 160);
    const floorMesh = new THREE.Mesh(floorGeo, materials.floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    masterGroup.add(floorMesh);

    // --- SCENE 1: CLEAN ARCHITECTURAL CONCEPT FLOOR GRID ---
    const conceptGroup = new THREE.Group();
    masterGroup.add(conceptGroup);

    const gridHelper = new THREE.GridHelper(70, 46, 0xa6ce39, 0x334155);
    gridHelper.position.y = 0.06;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0;
    conceptGroup.add(gridHelper);

    // --- SCENE 2: DETAILED BOOTH ARCHITECTURE ---
    const boothGroup = new THREE.Group();
    masterGroup.add(boothGroup);

    // Raised Marble Deck Platform with Backlit Edge
    const deckGeo = new THREE.BoxGeometry(26, 0.4, 20);
    const deckMesh = new THREE.Mesh(deckGeo, materials.marbleDeckMat);
    deckMesh.position.set(0, 0.2, 0);
    deckMesh.receiveShadow = true;
    boothGroup.add(deckMesh);

    const deckNeonGeo = new THREE.BoxGeometry(26.2, 0.1, 20.2);
    const deckNeon = new THREE.Mesh(deckNeonGeo, materials.neonStripMat);
    deckNeon.position.set(0, 0.05, 0);
    boothGroup.add(deckNeon);

    // 8 Structural Powder-Coated Steel Pillars
    const pillarGeo = new THREE.BoxGeometry(0.7, 14, 0.7);
    const pillarPositions = [
      [-12.5, 7, -9.5], [12.5, 7, -9.5], [-12.5, 7, 9.5], [12.5, 7, 9.5],
      [-6.5, 7, -9.5],  [6.5, 7, -9.5],  [-6.5, 7, 9.5],  [6.5, 7, 9.5]
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

    // Overhead Quad Truss Roof Grid
    const trussGroup = new THREE.Group();
    boothGroup.add(trussGroup);

    const trussBeamGeo = new THREE.BoxGeometry(26, 0.5, 0.5);
    const tBeam1 = new THREE.Mesh(trussBeamGeo, materials.steelTrussMat);
    tBeam1.position.set(0, 14, -9.5);
    trussGroup.add(tBeam1);

    const tBeam2 = new THREE.Mesh(trussBeamGeo, materials.steelTrussMat);
    tBeam2.position.set(0, 14, 9.5);
    trussGroup.add(tBeam2);

    // Back Architectural Glossy Wall & Huge LED Curved Backdrop
    const backWallGeo = new THREE.BoxGeometry(26, 12, 1.4);
    const backWall = new THREE.Mesh(backWallGeo, materials.glossyPanelMat);
    backWall.position.set(0, 6, -9.3);
    backWall.castShadow = true;
    boothGroup.add(backWall);

    const ledScreenGeo = new THREE.PlaneGeometry(20, 8.5);
    const ledScreen = new THREE.Mesh(ledScreenGeo, materials.ledScreenMat);
    ledScreen.position.set(0, 6.5, -8.5);
    boothGroup.add(ledScreen);

    // --- DOUBLE-DECK MEZZANINE VIP LOUNGE ---
    const mezzanineGroup = new THREE.Group();
    boothGroup.add(mezzanineGroup);

    const mezFloorGeo = new THREE.BoxGeometry(14, 0.5, 10);
    const mezFloor = new THREE.Mesh(mezFloorGeo, materials.glossyPanelMat);
    mezFloor.position.set(0, 6.5, -3);
    mezFloor.castShadow = true;
    mezzanineGroup.add(mezFloor);

    // Glass Railings for Mezzanine
    const railGeo = new THREE.BoxGeometry(14, 2.2, 0.2);
    const glassRail = new THREE.Mesh(railGeo, materials.glassRailMat);
    glassRail.position.set(0, 7.8, 1.9);
    mezzanineGroup.add(glassRail);

    // VIP Lounge Seating Furniture
    const sofaGeo = new THREE.BoxGeometry(4, 1, 1.8);
    const sofa = new THREE.Mesh(sofaGeo, materials.woodSlatMat);
    sofa.position.set(0, 7.3, -5);
    mezzanineGroup.add(sofa);

    // --- GROUND LEVEL RECEPTION DESK & DISPLAY PODS ---
    const receptionDeskGeo = new THREE.BoxGeometry(9, 2.4, 2.6);
    const receptionDesk = new THREE.Mesh(receptionDeskGeo, materials.glossyPanelMat);
    receptionDesk.position.set(0, 1.4, 4.5);
    receptionDesk.castShadow = true;
    boothGroup.add(receptionDesk);

    const deskStripGeo = new THREE.BoxGeometry(9.2, 0.15, 2.7);
    const deskStrip = new THREE.Mesh(deskStripGeo, materials.neonStripMat);
    deskStrip.position.set(0, 0.3, 4.5);
    boothGroup.add(deskStrip);

    // 3 Clean Product Showcase Pedestals
    const podGeo = new THREE.CylinderGeometry(1.2, 1.4, 2.2, 32);
    const podPositions = [[-8, 1.3, 3], [8, 1.3, 3], [0, 1.3, -1]];
    const displayPods = [];
    podPositions.forEach(pos => {
      const pod = new THREE.Mesh(podGeo, materials.marbleDeckMat);
      pod.position.set(pos[0], pos[1], pos[2]);
      pod.castShadow = true;
      boothGroup.add(pod);
      displayPods.push(pod);
    });

    // --- VISITOR SILHOUETTES ---
    const visitorGroup = new THREE.Group();
    masterGroup.add(visitorGroup);

    const visitorGeo = new THREE.CylinderGeometry(0.45, 0.45, 3.2, 16);
    const visitorPositions = [
      [-3.5, 1.8, 4.5], [3.5, 1.8, 4.5], [-8, 1.8, 3], [8, 1.8, 3], [0, 8.2, -4], [-5, 1.8, -2], [5, 1.8, -2]
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
        camera.position.x = gsap.utils.interpolate(0, -8, t);
        camera.position.y = gsap.utils.interpolate(16, 12, t);
        camera.position.z = gsap.utils.interpolate(50, 38, t);
        camera.lookAt(0, 5, 0);

        gridHelper.material.opacity = gsap.utils.interpolate(0, 0.95, t);

        pillars.forEach(col => col.scale.y = 0.001);
        deckMesh.scale.set(0.001, 0.001, 0.001);
      }
      // --- Scene 2: 3D Transformation (0.20 - 0.40) ---
      else if (p < 0.40) {
        const t = (p - 0.20) / 0.20;
        camera.position.x = gsap.utils.interpolate(-8, 16, t);
        camera.position.y = gsap.utils.interpolate(12, 18, t);
        camera.position.z = gsap.utils.interpolate(38, 30, t);
        camera.lookAt(0, 6, 0);

        deckMesh.scale.set(1, 1, 1);
        deckMesh.position.y = gsap.utils.interpolate(-3, 0.2, t);

        pillars.forEach((col, idx) => {
          const delayT = Math.max(0, Math.min(1, (t - idx * 0.08) / 0.35));
          col.scale.y = gsap.utils.interpolate(0.001, 1, delayT);
        });

        backWall.scale.set(1, 1, 1);
        backWall.position.y = gsap.utils.interpolate(-8, 6, t);
        ledScreen.material.opacity = gsap.utils.interpolate(0, 0.95, t);
      }
      // --- Scene 3: Exhibition Build Process (0.40 - 0.60) ---
      else if (p < 0.60) {
        const t = (p - 0.40) / 0.20;
        camera.position.x = gsap.utils.interpolate(16, 0, t);
        camera.position.y = gsap.utils.interpolate(18, 6.5, t);
        camera.position.z = gsap.utils.interpolate(30, 18, t);
        camera.lookAt(0, 5, 0);

        receptionDesk.scale.set(1, 1, 1);
        receptionDesk.position.z = gsap.utils.interpolate(16, 4.5, t);

        mezzanineGroup.position.y = gsap.utils.interpolate(-6, 0, t);
        warmLoungeLight.intensity = gsap.utils.interpolate(0, 3.5, t);
      }
      // --- Scene 4: Final Exhibition Experience (0.60 - 0.80) ---
      else if (p < 0.80) {
        const t = (p - 0.60) / 0.20;
        camera.position.x = gsap.utils.interpolate(0, -20, t);
        camera.position.y = gsap.utils.interpolate(6.5, 10, t);
        camera.position.z = gsap.utils.interpolate(18, 28, t);
        camera.lookAt(0, 6, 0);

        accentSpot.intensity = gsap.utils.interpolate(1, 5, t);
        cyanSpot.intensity = gsap.utils.interpolate(0, 4, t);
        visitors.forEach(v => v.material.opacity = gsap.utils.interpolate(0, 0.85, t));
      }
      // --- Scene 5: Premium Brand Showcase (0.80 - 1.00) ---
      else {
        const t = (p - 0.80) / 0.20;
        camera.position.x = gsap.utils.interpolate(-20, 0, t);
        camera.position.y = gsap.utils.interpolate(10, 24, t);
        camera.position.z = gsap.utils.interpolate(28, 52, t);
        camera.lookAt(0, 7, 0);

        masterGroup.rotation.y = gsap.utils.interpolate(0, 0.4, t);
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

    // 7. RENDER LOOP & ANIMATIONS
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
