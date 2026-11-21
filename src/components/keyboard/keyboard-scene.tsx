"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { SKILLS, type Skill } from "@/data/constants";
import { setSceneStatus } from "@/lib/scene-health";
import { usePreloader } from "../preloader";
import { isTypingTarget } from "./input";
import {
  createNeuralCoreMotion,
  type NeuralSection,
} from "./neural-core-motion";
import { useKeyboardSounds } from "./use-keyboard-sounds";
import { useAdaptiveGraphics } from "./use-adaptive-graphics";
import { useKeyboardCounts } from "./use-keyboard-counts";

const MODEL_URL = "/assets/models/arctic_neural_processor_core_v2.glb";

const SCENE_STYLE: CSSProperties = {
  position: "fixed",
  inset: 0,
  width: "100vw",
  height: "100dvh",
};

interface NeuralNodeHandle {
  index: number;
  skill: Skill;
  group: THREE.Object3D;
  baseY: number;
  pressGroup: THREE.Group;
  materials: THREE.MeshStandardMaterial[];
}

function createSkillDecalTexture(skill: Skill): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const draw = (img: HTMLImageElement | null) => {
    const grad = ctx.createRadialGradient(
      size * 0.35,
      size * 0.3,
      24,
      size * 0.5,
      size * 0.5,
      size * 0.72
    );
    grad.addColorStop(0, "#1E3354");
    grad.addColorStop(1, "#0E1A2D");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = "rgba(98, 200, 232, 0.45)";
    ctx.lineWidth = 12;
    ctx.strokeRect(24, 24, size - 48, size - 48);

    const keyChar = skill.shortcut?.replace("Key", "") ?? "";
    if (keyChar) {
      ctx.fillStyle = "#62C8E8";
      ctx.font = "bold 52px monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(keyChar, 48, 40);
    }

    if (img) {
      const pad = 108;
      ctx.drawImage(img, pad, pad + 12, size - pad * 2, size - pad * 2);
    } else {
      ctx.fillStyle = skill.color || "#62C8E8";
      ctx.font = "bold 92px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(skill.label.slice(0, 3).toUpperCase(), size / 2, size / 2 + 16);
    }
  };

  draw(null);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    draw(img);
    tex.needsUpdate = true;
  };
  img.src = skill.icon;

  return tex;
}

function NeuralCoreRig({
  skills,
  onReady,
  onError,
  onSection,
  onInSkills,
  onSelect,
  playSound,
  recordPress,
  isLoading,
  markActive,
}: {
  skills: Skill[];
  onReady: () => void;
  onError: (err: Error) => void;
  onSection: (section: NeuralSection) => void;
  onInSkills: (active: boolean) => void;
  onSelect: (skill: Skill | null) => void;
  playSound: (pressed: boolean) => void;
  recordPress: (name: string) => void;
  isLoading: boolean;
  markActive: () => void;
}) {
  const { camera, gl, scene } = useThree();
  const boardGroupRef = useRef<THREE.Group>(null);
  const revealGroupRef = useRef<THREE.Group>(null);
  const [loaded, setLoaded] = useState(false);

  const nodesRef = useRef<NeuralNodeHandle[]>([]);
  const rayTargetsRef = useRef<THREE.Object3D[]>([]);
  const spinnerRefs = useRef<{
    tensorCore: THREE.Object3D | null;
    ringCyan: THREE.Object3D | null;
    ringTitanium: THREE.Object3D | null;
    mixer: THREE.AnimationMixer | null;
  }>({ tensorCore: null, ringCyan: null, ringTitanium: null, mixer: null });

  const heldSources = useRef<Map<string, number>>(new Map());
  const heldByNode = useRef<Map<number, Set<string>>>(new Map());
  const activeStack = useRef<number[]>([]);
  const motionRef = useRef<ReturnType<typeof createNeuralCoreMotion> | null>(null);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointerNdc = useMemo(() => new THREE.Vector2(-99, -99), []);

  // Studio environment for metallic/clearcoat reflections
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x0b1526);
    const addPanel = (
      w: number,
      h: number,
      x: number,
      y: number,
      z: number,
      rx: number,
      ry: number,
      color: number
    ) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })
      );
      m.position.set(x, y, z);
      m.rotation.set(rx, ry, 0);
      envScene.add(m);
    };
    addPanel(14, 6, 0, 8, 2, Math.PI / 2, 0, 0xf4f8fc);
    addPanel(10, 6, -9, 3, -4, 0, Math.PI / 2.5, 0x62c8e8);
    addPanel(10, 6, 9, 3, -3, 0, -Math.PI / 2.5, 0x3978d5);
    const rt = pmrem.fromScene(envScene, 0.04);
    scene.environment = rt.texture;
    pmrem.dispose();
    return () => {
      scene.environment = null;
      rt.dispose();
    };
  }, [gl, scene]);

  const setNodePressed = useCallback(
    (index: number, pressed: boolean) => {
      const handle = nodesRef.current[index];
      if (!handle) return;
      markActive();
      gsap.to(handle.pressGroup.position, {
        y: pressed ? -0.075 : 0,
        duration: 0.1,
        ease: "power2.inOut",
        overwrite: true,
      });
      const accent = new THREE.Color(handle.skill.keyboardColor ?? handle.skill.color);
      for (const mat of handle.materials) {
        if (pressed) {
          mat.emissive.copy(accent);
          mat.emissiveIntensity = 0.7;
        } else {
          mat.emissive.setHex(0x000000);
          mat.emissiveIntensity = 0;
        }
      }
      playSound(pressed);
    },
    [markActive, playSound]
  );

  const pressNode = useCallback(
    (source: string, index: number) => {
      const prev = heldSources.current.get(source);
      if (prev === index) return;
      if (prev !== undefined) {
        const prevSet = heldByNode.current.get(prev);
        prevSet?.delete(source);
        if (prevSet && prevSet.size === 0) {
          heldByNode.current.delete(prev);
          setNodePressed(prev, false);
        }
      }
      heldSources.current.set(source, index);
      const set = heldByNode.current.get(index) ?? new Set<string>();
      const first = set.size === 0;
      set.add(source);
      heldByNode.current.set(index, set);
      if (first) {
        setNodePressed(index, true);
        if (!isLoading && !document.hidden) {
          recordPress(skills[index].name);
        }
      }
      activeStack.current = activeStack.current.filter((i) => i !== index);
      activeStack.current.push(index);
      onSelect(skills[index]);
    },
    [isLoading, onSelect, recordPress, setNodePressed, skills]
  );

  const releaseSource = useCallback(
    (source: string) => {
      const index = heldSources.current.get(source);
      if (index === undefined) return;
      heldSources.current.delete(source);
      const set = heldByNode.current.get(index);
      set?.delete(source);
      if (set && set.size === 0) {
        heldByNode.current.delete(index);
        setNodePressed(index, false);
      }
      activeStack.current = activeStack.current.filter((i) => i !== index);
      const top = activeStack.current.at(-1);
      onSelect(top !== undefined ? skills[top] : null);
    },
    [onSelect, setNodePressed, skills]
  );

  const releaseAll = useCallback(() => {
    for (const source of [...heldSources.current.keys()]) {
      releaseSource(source);
    }
  }, [releaseSource]);

  // Load arctic_neural_processor_core_v2.glb
  useEffect(() => {
    let cancelled = false;
    const loader = new GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (cancelled || !revealGroupRef.current || !boardGroupRef.current) return;
        const root = gltf.scene;
        root.scale.setScalar(1.35);
        revealGroupRef.current.clear();
        revealGroupRef.current.add(root);

        spinnerRefs.current.tensorCore = root.getObjectByName("Tensor_Core_Sphere") ?? null;
        spinnerRefs.current.ringCyan = root.getObjectByName("Gyro_Ring_Cyan") ?? null;
        spinnerRefs.current.ringTitanium = root.getObjectByName("Gyro_Ring_Titanium") ?? null;

        if (gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(root);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
          spinnerRefs.current.mixer = mixer;
        }

        const handles: NeuralNodeHandle[] = [];
        const rayTargets: THREE.Object3D[] = [];
        const decalGeo = new THREE.PlaneGeometry(0.30, 0.30);

        for (let i = 0; i < skills.length; i++) {
          const name = `NeuralNode_${String(i).padStart(2, "0")}`;
          const obj = root.getObjectByName(name);
          if (!obj || !obj.parent) continue;

          // Wrap obj in a motionGroup so scroll/reveal/float (motionGroup.position.y)
          // and key press (pressGroup.position.y) compose without overwriting each other.
          const motionGroup = new THREE.Group();
          motionGroup.name = `${name}_Motion`;
          motionGroup.position.copy(obj.position);
          motionGroup.rotation.copy(obj.rotation);
          motionGroup.scale.copy(obj.scale);
          obj.parent.add(motionGroup);

          const pressGroup = new THREE.Group();
          pressGroup.name = `${name}_Press`;
          obj.position.set(0, 0, 0);
          obj.rotation.set(0, 0, 0);
          obj.scale.set(1, 1, 1);
          pressGroup.add(obj);
          motionGroup.add(pressGroup);

          const mats: THREE.MeshStandardMaterial[] = [];
          pressGroup.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.userData.neuralNodeIndex = i;
              if (mesh.material && !Array.isArray(mesh.material)) {
                mesh.material = mesh.material.clone();
                if ((mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
                  mats.push(mesh.material as THREE.MeshStandardMaterial);
                }
              }
            }
          });

          const tex = createSkillDecalTexture(skills[i]);
          const decalMat = new THREE.MeshStandardMaterial({
            map: tex,
            emissiveMap: tex,
            emissive: new THREE.Color(0xffffff),
            emissiveIntensity: 0.45,
            roughness: 0.3,
            metalness: 0.05,
            polygonOffset: true,
            polygonOffsetFactor: -2,
          });
          const decal = new THREE.Mesh(decalGeo, decalMat);
          decal.rotation.x = -Math.PI / 2;
          // NeuralNode cap top in the GLB is y = 0.2445; place decal just above it.
          decal.position.set(0, 0.247, 0);
          decal.userData.neuralNodeIndex = i;
          pressGroup.add(decal);
          rayTargets.push(decal);

          handles.push({
            index: i,
            skill: skills[i],
            group: motionGroup,
            baseY: motionGroup.position.y,
            pressGroup,
            materials: mats,
          });
        }

        nodesRef.current = handles;
        rayTargetsRef.current = rayTargets;

        const controller = createNeuralCoreMotion(
          {
            boardGroup: boardGroupRef.current,
            revealGroup: revealGroupRef.current,
            nodes: handles.map((h) => ({ group: h.group, baseY: h.baseY })),
          },
          (next) => {
            onSection(next);
            releaseAll();
            const hash = next === "hero" ? "" : `#${next}`;
            window.history.replaceState(
              window.history.state,
              "",
              window.location.pathname + window.location.search + hash
            );
          },
          markActive,
          onInSkills
        );
        motionRef.current = controller;
        setLoaded(true);
        onReady();
      },
      undefined,
      (err) => {
        if (!cancelled) {
          onError(err instanceof Error ? err : new Error("Failed to load 3D model"));
        }
      }
    );

    return () => {
      cancelled = true;
      motionRef.current?.dispose();
      motionRef.current = null;
      spinnerRefs.current.mixer?.stopAllAction();
      spinnerRefs.current.mixer = null;
    };
  }, [markActive, onError, onInSkills, onReady, onSection, releaseAll, skills]);

  // Trigger reveal once loaded & preloader finishes
  useEffect(() => {
    if (loaded && !isLoading) {
      motionRef.current?.reveal();
    }
  }, [loaded, isLoading]);

  // Pointer raycasting for hover & click on NeuralNode_00..15
  useEffect(() => {
    if (!loaded) return;

    const getHitIndex = (e: PointerEvent): number | null => {
      if (rayTargetsRef.current.length === 0) return null;
      pointerNdc.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerNdc.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(rayTargetsRef.current, false);
      for (const hit of hits) {
        const idx = hit.object.userData.neuralNodeIndex;
        if (typeof idx === "number") return idx;
      }
      return null;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const idx = getHitIndex(e);
      if (idx !== null) {
        document.body.style.cursor = "pointer";
        pressNode("hover", idx);
      } else {
        document.body.style.cursor = "default";
        releaseSource("hover");
      }
    };

    const onDown = (e: PointerEvent) => {
      const idx = getHitIndex(e);
      if (idx !== null) pressNode(`pointer:${e.pointerId}`, idx);
    };

    const onUp = (e: PointerEvent) => {
      releaseSource(`pointer:${e.pointerId}`);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    return () => {
      document.body.style.cursor = "default";
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [camera, loaded, pointerNdc, pressNode, raycaster, releaseSource]);

  // Physical keyboard shortcuts (KeyQ..KeyK)
  useEffect(() => {
    if (!loaded) return;
    const shortcutMap = new Map<string, number>();
    skills.forEach((s, idx) => {
      if (s.shortcut) shortcutMap.set(s.shortcut, idx);
    });

    const down = (e: KeyboardEvent) => {
      if (
        e.defaultPrevented ||
        e.repeat ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        isTypingTarget(e.target)
      ) {
        return;
      }
      const idx = shortcutMap.get(e.code);
      if (idx !== undefined) pressNode(`key:${e.code}`, idx);
    };

    const up = (e: KeyboardEvent) => releaseSource(`key:${e.code}`);
    const vis = () => {
      if (document.hidden) releaseAll();
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", releaseAll);
    document.addEventListener("visibilitychange", vis);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", releaseAll);
      document.removeEventListener("visibilitychange", vis);
      releaseAll();
    };
  }, [loaded, pressNode, releaseAll, releaseSource, skills]);

  // Continuous idle animation for the Tensor Core & Gimbal Rings
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    spinnerRefs.current.mixer?.update(dt);
    if (spinnerRefs.current.tensorCore) {
      spinnerRefs.current.tensorCore.rotation.y += dt * 0.85;
    }
    if (spinnerRefs.current.ringCyan) {
      spinnerRefs.current.ringCyan.rotation.y -= dt * 1.1;
    }
    if (spinnerRefs.current.ringTitanium) {
      spinnerRefs.current.ringTitanium.rotation.y += dt * 0.65;
    }
  });

  return (
    <group ref={boardGroupRef}>
      <group ref={revealGroupRef} />
    </group>
  );
}

export default function KeyboardScene({ maxDpr }: { maxDpr: number }) {
  const { isLoading, bypassLoading } = usePreloader();
  const failed = useRef(false);
  const [ready, setReady] = useState(false);
  const [inSkills, setInSkills] = useState(false);
  const [, setSection] = useState<NeuralSection>("hero");
  const [selected, setSelected] = useState<Skill | null>(null);
  const playSound = useKeyboardSounds();
  const skills = useMemo(() => Object.values(SKILLS), []);
  const { settings: graphics, markActive } = useAdaptiveGraphics(ready && !isLoading);
  const { total, available, recordPress } = useKeyboardCounts();

  const dpr = useMemo<[number, number]>(
    () => [1, graphics.dpr < 1 ? Math.min(1.5, maxDpr) : maxDpr],
    [maxDpr, graphics.dpr]
  );

  const onReady = useCallback(() => {
    if (failed.current) return;
    setReady(true);
    setSceneStatus("ready");
    bypassLoading();
  }, [bypassLoading]);

  const onError = useCallback(
    (err: Error) => {
      failed.current = true;
      console.warn("Neural core 3D scene unavailable", err);
      setSceneStatus("failed");
      bypassLoading();
    },
    [bypassLoading]
  );

  return (
    <>
      <div style={SCENE_STYLE} className="pointer-events-none">
        <Canvas
          dpr={dpr}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
          }}
          camera={{ position: [0, 2.2, 8.2], fov: 35, near: 0.1, far: 100 }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", () =>
              onError(new Error("WebGL context lost"))
            );
          }}
        >
          <hemisphereLight args={[0xf4f8fc, 0x192b46, graphics.lighting ? 0.85 : 0.6]} />
          <directionalLight position={[5, 8, 5]} intensity={1.5} color={0xf4f8fc} />
          <directionalLight position={[-6, 4, -5]} intensity={1.35} color={0x62c8e8} />
          <directionalLight position={[-4, 2, 5]} intensity={0.9} color={0x3978d5} />
          <NeuralCoreRig
            skills={skills}
            onReady={onReady}
            onError={onError}
            onSection={setSection}
            onInSkills={setInSkills}
            onSelect={setSelected}
            playSound={playSound}
            recordPress={recordPress}
            isLoading={isLoading}
            markActive={markActive}
          />
        </Canvas>
      </div>

      {inSkills && ready && (
        <div className="pointer-events-none fixed inset-x-4 bottom-8 z-20 flex flex-col items-center text-center text-foreground md:inset-x-auto md:bottom-auto md:left-10 lg:left-16 md:top-1/2 md:-translate-y-1/2 md:items-start md:text-left md:max-w-sm">
          <div aria-live="polite">
            {selected?.shortcut && (
              <p className="mb-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                [{selected.shortcut.replace("Key", "")}] · {selected.category}
              </p>
            )}
            <h3 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              {selected?.label ?? "Explore my skills"}
            </h3>
            <p className="mt-3 font-sans text-sm md:text-base leading-relaxed text-muted-foreground">
              {selected?.shortDescription ??
                "Hover, tap, or press Q–K on a 3D neural module"}
            </p>
          </div>
          <p className="sr-only">
            {available
              ? `${total.toLocaleString("en-US")} module presses by all visitors`
              : "Shared module count unavailable"}
          </p>
        </div>
      )}
    </>
  );
}
