import { useEffect, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { useDeviceCapability, usePrefersReducedMotion } from "../../motion/tokens";

function createSoftParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.35, "rgba(255, 255, 255, 0.7)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(64, 64, 8, 64, 64, 62);
    grad.addColorStop(0, "rgba(10, 12, 9, 0.55)");
    grad.addColorStop(0.55, "rgba(10, 12, 9, 0.2)");
    grad.addColorStop(1, "rgba(10, 12, 9, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function StaticSculptureFallback() {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#151713] text-[#F4F4ED]"
      aria-label="Machined Logic Core architectural emblem"
    >
      <svg
        viewBox="0 0 240 240"
        fill="none"
        className="h-4/5 w-4/5 max-h-[200px] max-w-[200px]"
        aria-hidden="true"
      >
        <circle cx="120" cy="120" r="82" stroke="#41443A" strokeWidth="1.25" strokeDasharray="4 4" />
        <ellipse cx="120" cy="120" rx="68" ry="30" transform="rotate(-24 120 120)" stroke="#69734A" strokeWidth="1.5" />
        <ellipse cx="120" cy="120" rx="68" ry="30" transform="rotate(28 120 120)" stroke="#C7E34A" strokeWidth="1.5" />
        <polygon points="120,76 154,100 142,148 98,148 86,100" stroke="#F4F4ED" strokeWidth="1.4" fill="#20231D" />
        <circle cx="120" cy="120" r="8" fill="#C7E34A" />
      </svg>
    </div>
  );
}

interface HeroOrbitalSculptureProps {
  scrollProgressRef?: MutableRefObject<number>;
}

export default function HeroOrbitalSculpture({
  scrollProgressRef,
}: HeroOrbitalSculptureProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const capability = useDeviceCapability();
  const [fallbackActive, setFallbackActive] = useState(false);

  const shouldUseStatic = prefersReduced || capability === "low" || fallbackActive;

  useEffect(() => {
    if (shouldUseStatic) return;
    const container = containerRef.current;
    const mount = mountRef.current;
    if (!container || !mount) return;

    const testCanvas = document.createElement("canvas");
    const probeGl =
      testCanvas.getContext("webgl2") ||
      (testCanvas.getContext("webgl") as WebGLRenderingContext | null);
    if (!probeGl) {
      setFallbackActive(true);
      return;
    }

    const isSoftwareGl = (() => {
      const ext = probeGl.getExtension("WEBGL_debug_renderer_info");
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probeGl.RENDERER;
      const gpu = String(probeGl.getParameter(param));
      probeGl.getExtension("WEBGL_lose_context")?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setFallbackActive(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    const maxDpr = window.innerWidth < 768 || capability === "standard" ? 1.5 : 2;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, maxDpr)
    );
    renderer.shadowMap.enabled = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
    camera.position.set(0, 0.25, 5.4);

    // Studio environment reflections (mandatory for brushed metallic PBR materials)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    // 3-Point Warm / Cool Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xf4f4ed, 0x20231d, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e4, 2.2);
    keyLight.position.set(3.5, 4.5, 4.2);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc7e34a, 1.55);
    rimLight.position.set(-4.0, -1.8, -3.2);
    scene.add(rimLight);

    // Composite Procedural Multi-Part Sculpture ("Machined Logic Core")
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    const disposables: {
      geometries: THREE.BufferGeometry[];
      materials: THREE.Material[];
      textures: THREE.Texture[];
    } = { geometries: [], materials: [], textures: [] };

    // 1. Primary undulating wave torus silhouette (PBR + onBeforeCompile vertex wave)
    const radialSegments = capability === "high" ? 28 : 18;
    const tubularSegments = capability === "high" ? 84 : 48;
    const primaryGeo = new THREE.TorusGeometry(1.18, 0.22, radialSegments, tubularSegments);
    const primaryMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#8B956A"),
      metalness: 0.82,
      roughness: 0.22,
      clearcoat: 0.72,
      clearcoatRoughness: 0.16,
    });
    primaryMat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uEnergy = { value: 0.055 };
      primaryMat.userData.shader = shader;

      shader.vertexShader =
        "uniform float uTime;\nuniform float uEnergy;\n" + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
        #include <begin_vertex>
        float angle = atan(position.y, position.x);
        float harmonic = sin(angle * 4.0 + uTime * 1.35) * cos(position.z * 5.0 - uTime * 0.9);
        transformed += normalize(position) * harmonic * uEnergy;
        `
      );
    };
    const primaryMesh = new THREE.Mesh(primaryGeo, primaryMat);
    primaryMesh.rotation.x = Math.PI * 0.18;
    sculptureGroup.add(primaryMesh);
    disposables.geometries.push(primaryGeo);
    disposables.materials.push(primaryMat);

    // 2. Outer dark anodized gimbal collar
    const gimbalGeo = new THREE.TorusGeometry(1.52, 0.045, 16, 72);
    const gimbalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#2D3228"),
      metalness: 0.9,
      roughness: 0.48,
    });
    const gimbalMesh = new THREE.Mesh(gimbalGeo, gimbalMat);
    gimbalMesh.rotation.y = Math.PI * 0.25;
    gimbalMesh.rotation.x = -Math.PI * 0.15;
    sculptureGroup.add(gimbalMesh);
    disposables.geometries.push(gimbalGeo);
    disposables.materials.push(gimbalMat);

    // 3. Signal Lime precision inner collar ring
    const accentGeo = new THREE.TorusGeometry(0.84, 0.028, 12, 64);
    const accentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#C7E34A"),
      emissive: new THREE.Color("#69734A"),
      emissiveIntensity: 0.35,
      metalness: 0.45,
      roughness: 0.28,
    });
    const accentMesh = new THREE.Mesh(accentGeo, accentMat);
    accentMesh.rotation.x = Math.PI * 0.42;
    sculptureGroup.add(accentMesh);
    disposables.geometries.push(accentGeo);
    disposables.materials.push(accentMat);

    // 4. Faceted brushed titanium inner core
    const coreGeo = new THREE.IcosahedronGeometry(0.46, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#EAEAE1"),
      metalness: 0.92,
      roughness: 0.16,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    sculptureGroup.add(coreMesh);
    disposables.geometries.push(coreGeo);
    disposables.materials.push(coreMat);

    // 5. Four articulated caliper index pins on the outer gimbal
    const pinGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.26, 10);
    const tipGeo = new THREE.ConeGeometry(0.048, 0.11, 10);
    const pinMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#C7E34A"),
      metalness: 0.55,
      roughness: 0.35,
    });
    disposables.geometries.push(pinGeo, tipGeo);
    disposables.materials.push(pinMat);

    const cardinals: [number, number, number][] = [
      [1.52, 0, 0],
      [-1.52, 0, 0],
      [0, 1.52, 0],
      [0, -1.52, 0],
    ];
    cardinals.forEach(([px, py, pz], idx) => {
      const pinPivot = new THREE.Group();
      pinPivot.position.set(px, py, pz);
      pinPivot.rotation.z = idx < 2 ? Math.PI / 2 : 0;
      const shaft = new THREE.Mesh(pinGeo, pinMat);
      const tip = new THREE.Mesh(tipGeo, gimbalMat);
      tip.position.y = idx % 2 === 0 ? -0.15 : 0.15;
      if (idx % 2 === 0) tip.rotation.z = Math.PI;
      pinPivot.add(shaft, tip);
      gimbalMesh.add(pinPivot);
    });

    // 6. Soft grounded contact shadow underneath sculpture
    const shadowTex = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(3.2, 1.3);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.4,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2.2;
    shadowPlane.position.set(0, -1.78, 0);
    scene.add(shadowPlane);
    disposables.geometries.push(shadowGeo);
    disposables.materials.push(shadowMat);
    disposables.textures.push(shadowTex);

    // Bounded Orbital Particle Field (THREE.Points)
    const particleCount = capability === "high" ? 96 : 56;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const cLime = new THREE.Color("#C7E34A");
    const cMoss = new THREE.Color("#69734A");
    const cPaper = new THREE.Color("#D4D6CA");

    for (let i = 0; i < particleCount; i++) {
      const r = 1.65 + (i % 7) * 0.24;
      const theta = i * 2.399963; // golden angle distribution
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.85;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) * 0.7;

      const palette = i % 5 === 0 ? cLime : i % 2 === 0 ? cMoss : cPaper;
      colors[i * 3] = palette.r;
      colors[i * 3 + 1] = palette.g;
      colors[i * 3 + 2] = palette.b;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particlesGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const particleSprite = createSoftParticleTexture();
    const particlesMat = new THREE.PointsMaterial({
      size: 0.095,
      map: particleSprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particleField = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleField);
    disposables.geometries.push(particlesGeo);
    disposables.materials.push(particlesMat);
    disposables.textures.push(particleSprite);

    mount.innerHTML = "";
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    const updateSize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      camera.aspect = width / height;
      const safeAspect = Math.max(0.55, Math.min(1, camera.aspect));
      camera.position.z = 5.4 / safeAspect;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    updateSize();

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(mount);

    // Interactive Pointer & Drag State (Zero GC in Loop)
    let pointerX = 0;
    let pointerY = 0;
    let pointerInside = false;
    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragRotY = 0;
    let dragRotX = 0;
    let scrollFactor = 0;

    let isVisible = true;
    let isTabVisible = !document.hidden;
    let frameId = 0;
    let disposed = false;
    let lastTime = performance.now();
    let elapsed = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointerX = THREE.MathUtils.clamp(nx, -1, 1);
      pointerY = THREE.MathUtils.clamp(ny, -1, 1);
      pointerInside = true;

      if (dragging) {
        dragRotY += (e.clientX - dragStartX) * 0.008;
        dragRotX = THREE.MathUtils.clamp(
          dragRotX + (e.clientY - dragStartY) * 0.006,
          -0.65,
          0.65
        );
        dragStartX = e.clientX;
        dragStartY = e.clientY;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    };

    const onPointerUp = () => {
      dragging = false;
    };

    const onPointerLeave = () => {
      pointerInside = false;
      dragging = false;
      pointerX = 0;
      pointerY = 0;
    };

    const onScroll = () => {
      const vh = window.innerHeight || 800;
      scrollFactor = THREE.MathUtils.clamp(window.scrollY / vh, 0, 1.4);
    };

    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setFallbackActive(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && isTabVisible && !frameId && !disposed) {
          lastTime = performance.now();
          scheduleNext();
        }
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isVisible && isTabVisible && !frameId && !disposed) {
        lastTime = performance.now();
        scheduleNext();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync === "function") {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function scheduleNext() {
      if (disposed || !isVisible || !isTabVisible) {
        frameId = 0;
        return;
      }
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    function tick() {
      frameId = 0;
      if (disposed || !isVisible || !isTabVisible) return;

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsed += dt;

      // Read normalized scroll progress from external ScrollTrigger controller when provided
      const activeScroll = scrollProgressRef
        ? THREE.MathUtils.clamp(scrollProgressRef.current, 0, 1.4)
        : scrollFactor;

      // Update wave shader uniform
      if (primaryMat.userData.shader) {
        primaryMat.userData.shader.uniforms.uTime.value = elapsed;
        primaryMat.userData.shader.uniforms.uEnergy.value =
          (pointerInside ? 0.072 : 0.048) + activeScroll * 0.032;
      }

      // Exponential damping for pointer parallax + scroll alignment
      const targetRotY = dragRotY + pointerX * 0.34 + elapsed * 0.16 + activeScroll * 0.72;
      const targetRotX = dragRotX - pointerY * 0.24 - activeScroll * 0.38;

      sculptureGroup.rotation.y = THREE.MathUtils.damp(
        sculptureGroup.rotation.y,
        targetRotY,
        4.8,
        dt
      );
      sculptureGroup.rotation.x = THREE.MathUtils.damp(
        sculptureGroup.rotation.x,
        targetRotX,
        4.8,
        dt
      );
      sculptureGroup.position.y = THREE.MathUtils.damp(
        sculptureGroup.position.y,
        -activeScroll * 0.2,
        4.8,
        dt
      );

      // Subtle camera elevation and studio rim-light energy response to scroll progress
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        0.25 + activeScroll * 0.22 - pointerY * 0.08,
        4.2,
        dt
      );
      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        pointerX * 0.12,
        4.2,
        dt
      );
      camera.lookAt(0, 0, 0);
      rimLight.intensity = 1.55 + Math.min(activeScroll, 1) * 0.55;

      // Gentle gimbal counter-rotation and core spin
      gimbalMesh.rotation.z += dt * 0.22;
      accentMesh.rotation.y -= dt * 0.38;
      coreMesh.rotation.x += dt * 0.35;
      coreMesh.rotation.y -= dt * 0.42;

      // Subtle particle orbit reacting softly to pointer and scroll depth
      particleField.rotation.y = THREE.MathUtils.damp(
        particleField.rotation.y,
        elapsed * 0.09 + pointerX * 0.18 + activeScroll * 0.24,
        3.2,
        dt
      );
      particleField.rotation.x = THREE.MathUtils.damp(
        particleField.rotation.x,
        -pointerY * 0.14 + activeScroll * 0.14,
        3.2,
        dt
      );

      if (!dragging) {
        dragRotY = THREE.MathUtils.damp(dragRotY, 0, 1.8, dt);
        dragRotX = THREE.MathUtils.damp(dragRotX, 0, 1.8, dt);
      }

      renderer.render(scene, camera);
      scheduleNext();
    }

    // Start render loop
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);

      disposables.geometries.forEach((g) => g.dispose());
      disposables.materials.forEach((m) => m.dispose());
      disposables.textures.forEach((t) => t.dispose());
      envTarget.dispose();
      renderer.dispose();
      mount.innerHTML = "";
    };
  }, [shouldUseStatic, capability]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full min-h-[160px] sm:min-h-[210px] overflow-hidden bg-[#151713] select-none touch-pan-y"
      aria-label="Interactive 3D Machined Logic Core sculpture"
    >
      {shouldUseStatic ? (
        <StaticSculptureFallback />
      ) : (
        <div ref={mountRef} className="h-full w-full cursor-grab active:cursor-grabbing" />
      )}

      {/* Subtle corner technical caption — unobstructed center */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-2 bg-gradient-to-t from-[#151713]/90 to-transparent text-[11px] font-mono uppercase tracking-[0.1em] text-[#B5B8AA]">
        <span>Logic Core · Three.js</span>
        <span className="text-[#C7E34A]">
          {shouldUseStatic ? "Static Mode" : "Drag / Hover"}
        </span>
      </div>
    </div>
  );
}
