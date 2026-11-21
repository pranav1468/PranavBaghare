import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

export type NeuralSection = "hero" | "skills" | "projects" | "contact";

const SCROLL_SECTIONS = [
  { id: "skills", previous: "hero", threshold: 0.5 },
  { id: "projects", previous: "skills", threshold: 0.7 },
  { id: "contact", previous: "projects", threshold: 0.3 },
] as const;

type Vector = { x: number; y: number; z: number };

// Mirror the exact camera-relative Euler composition from the Chibi keyboard motion.
function sectionRotation(rotation: Vector, mobile: boolean): [number, number, number] {
  const baseTilt = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(0.38, 0.007, 0.12)
  );
  const reference = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(0, mobile ? -Math.PI / 6 : -Math.PI / 12, 0)
  );
  const legacy = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(rotation.x, rotation.y, rotation.z)
  );
  const euler = new THREE.Euler().setFromQuaternion(
    baseTilt.multiply(reference).multiply(legacy)
  );
  return [euler.x, euler.y, euler.z];
}

export interface NeuralCoreTargets {
  boardGroup: THREE.Group;
  revealGroup: THREE.Group;
  nodes: { group: THREE.Object3D; baseY: number }[];
}

/**
 * GSAP + ScrollTrigger choreography for the 3D Neural Processor Core,
 * matching the exact timing, easing, reveal drop, section poses, and
 * contact floating-node loops of the main 3D keyboard.
 */
export function createNeuralCoreMotion(
  targets: NeuralCoreTargets,
  onSection: (section: NeuralSection) => void,
  onActivity?: () => void,
  onInSkills?: (active: boolean) => void
) {
  gsap.registerPlugin(ScrollTrigger);

  let section: NeuralSection = "hero";
  let disposed = false;
  let revealed = false;
  let initialHeroDropDone = false;

  const position: Vector = { x: 0, y: 0, z: 0 };
  const scale: Vector = { x: 0.001, y: 0.001, z: 0.001 };
  const rotation: Vector = { x: 0, y: 0, z: 0 };
  const revealScale = { value: 0.001 };

  const nodeOffsets = targets.nodes.map(() => ({ y: 0 }));
  const nodeRevealOffsets = targets.nodes.map(() => ({ y: 0 }));

  const applyNode = (index: number) => {
    const node = targets.nodes[index];
    if (!node) return;
    node.group.position.y =
      node.baseY + nodeOffsets[index].y + nodeRevealOffsets[index].y;
    onActivity?.();
  };

  const applyPose = () => {
    targets.boardGroup.position.set(position.x, position.y, position.z);
    targets.boardGroup.scale.set(scale.x, scale.y, scale.z);
    const [rx, ry, rz] = sectionRotation(rotation, window.innerWidth < 768);
    targets.boardGroup.rotation.set(rx, ry, rz);
    onActivity?.();
  };

  const pose = () => {
    const mobile = window.innerWidth < 768;
    const fit = Math.min(1, (window.innerWidth / window.innerHeight) * 1.05);
    const size =
      fit *
      (section === "hero"
        ? mobile
          ? 0.72
          : 0.8
        : section === "contact"
          ? 0.75
          : section === "skills"
            ? mobile
              ? 0.88
              : 1.05
            : 0.95);
    const right =
      !mobile && section === "hero"
        ? 2.2
        : !mobile && section === "contact"
          ? 3.1
          : 0;
    const up = section === "contact" ? -0.6 : 0;

    return {
      position:
        mobile && section === "hero"
          ? { x: 0, y: -0.55, z: 0 }
          : {
              x: right / Math.sqrt(2) + up / Math.sqrt(6),
              y: up * Math.sqrt(2 / 3),
              z: right / Math.sqrt(2) - up / Math.sqrt(6),
            },
      rotation:
        section === "projects" || (mobile && section === "contact")
          ? { x: Math.PI, y: Math.PI / 3, z: Math.PI }
          : {
              x: 0,
              y: section === "skills" ? (mobile ? Math.PI / 6 : Math.PI / 12) : 0,
              z: 0,
            },
      scale: { x: size, y: size, z: size },
    };
  };

  const sectionTweens: gsap.core.Tween[] = [];
  const loops: gsap.core.Tween[] = [];
  const revealTweens: gsap.core.Tween[] = [];
  const pending: gsap.core.Tween[] = [];
  const nodeTweens: gsap.core.Tween[] = [];

  const kill = (tweens: gsap.core.Tween[]) => {
    tweens.splice(0).forEach((tween) => tween.kill());
  };

  const onVisibility = () => {
    const hidden = document.hidden;
    [...loops, ...sectionTweens, ...revealTweens, ...pending, ...nodeTweens].forEach(
      (t) => t.paused(hidden)
    );
  };

  const applySection = (next: NeuralSection, immediate = false) => {
    if (disposed) return;
    section = next;
    onSection(next);
    kill(sectionTweens);
    kill(loops);
    kill(pending);

    const target = pose();
    for (const [value, destination] of [
      [position, target.position],
      [rotation, target.rotation],
      [scale, target.scale],
    ] as const) {
      sectionTweens.push(
        gsap.to(value, {
          ...destination,
          duration: immediate ? 0 : 1,
          ease: "power1.out",
          overwrite: true,
          onUpdate: applyPose,
        })
      );
    }

    if (next === "hero") {
      loops.push(
        gsap.to(rotation, {
          y: Math.PI * 2 + rotation.y,
          duration: 10,
          repeat: -1,
          yoyo: true,
          yoyoEase: true,
          ease: "back.inOut",
          onUpdate: applyPose,
        })
      );
    }

    const isInitialHero = next === "hero" && !initialHeroDropDone;
    if (next === "hero") initialHeroDropDone = true;
    const delay = isInitialHero ? 2.1 : (next === "projects" ? 0.3 : 0.2) + 0.6;
    const shouldFloat = next === "contact" || next === "hero";

    pending.push(
      gsap.delayedCall(delay, () => {
        if (disposed || section !== next) return;
        kill(nodeTweens);

        if (next === "contact") {
          sectionTweens[1]?.kill();
          loops.push(
            gsap.fromTo(
              rotation,
              { x: 0, y: 0, z: 0 },
              {
                y: -Math.PI / 2,
                duration: 5,
                repeat: -1,
                yoyo: true,
                yoyoEase: true,
                ease: "power1.out",
                onUpdate: applyPose,
              }
            )
          );
        }

        const items = targets.nodes.map((node, index) => ({
          index,
          offset: nodeOffsets[index],
          node,
        }));
        if (shouldFloat) items.sort(() => Math.random() - 0.5);

        items.forEach(({ index: nodeIndex, offset }, orderIndex) => {
          nodeTweens.push(
            gsap.to(
              offset,
              shouldFloat
                ? {
                    y: 0.45 + Math.random() * 0.45,
                    duration: 2 + Math.random() * 2,
                    delay: orderIndex * 0.6,
                    repeat: -1,
                    yoyo: true,
                    yoyoEase: "none",
                    ease: "elastic.out(1,0.3)",
                    onUpdate: () => applyNode(nodeIndex),
                  }
                : {
                    y: 0,
                    duration: 4,
                    ease: "elastic.out(1,0.7)",
                    onUpdate: () => applyNode(nodeIndex),
                  }
            )
          );
        });
        onVisibility();
      })
    );
    onVisibility();
  };

  const syncSection = (): NeuralSection => {
    let next: NeuralSection = "hero";
    for (const { id, threshold } of SCROLL_SECTIONS) {
      const top = document.getElementById(id)?.getBoundingClientRect().top ?? Infinity;
      if (top <= window.innerHeight * threshold) next = id;
    }
    return next;
  };

  const isSkillsActive = () => {
    const bounds = document.getElementById("skills")?.getBoundingClientRect();
    return Boolean(
      bounds &&
        bounds.top <= window.innerHeight * 0.5 &&
        bounds.bottom > window.innerHeight * 0.25
    );
  };

  const triggers = SCROLL_SECTIONS.filter(({ id }) => document.getElementById(id)).map(
    ({ id, previous, threshold }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: `top ${threshold * 100}%`,
        onEnter: () => {
          if (revealed) applySection(id);
        },
        onLeaveBack: () => {
          if (revealed) applySection(previous);
        },
      })
  );

  if (document.getElementById("skills")) {
    triggers.push(
      ScrollTrigger.create({
        trigger: "#skills",
        start: "top 50%",
        end: "bottom 25%",
        onToggle: ({ isActive }) => {
          if (revealed) onInSkills?.(isActive);
        },
      })
    );
  }

  let lastWidth = window.innerWidth;
  const resize = () => {
    const w = window.innerWidth;
    if (w === lastWidth) return;
    lastWidth = w;
    if (revealed) {
      applySection(syncSection(), true);
      onInSkills?.(isSkillsActive());
    }
  };
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVisibility);

  targets.boardGroup.visible = false;

  return {
    reveal() {
      if (revealed || disposed) return;
      revealed = true;
      targets.boardGroup.visible = true;
      applySection(syncSection(), true);
      onInSkills?.(isSkillsActive());

      revealScale.value = 0.001;
      targets.revealGroup.scale.setScalar(0.001);
      revealTweens.push(
        gsap.to(revealScale, {
          value: 1,
          duration: 1.5,
          ease: "elastic.out(1,0.6)",
          onUpdate: () => {
            targets.revealGroup.scale.setScalar(revealScale.value);
            onActivity?.();
          },
        })
      );

      if (section !== "contact") {
        targets.nodes.forEach((node, index) => {
          const offset = nodeRevealOffsets[index];
          offset.y = 0.5;
          node.group.visible = false;
          applyNode(index);
          revealTweens.push(
            gsap.delayedCall(0.9 + index * 0.07, () => {
              if (!disposed) node.group.visible = true;
            })
          );
          revealTweens.push(
            gsap.to(offset, {
              y: 0,
              delay: 1 + index * 0.07,
              duration: 0.5,
              ease: "bounce.out",
              onUpdate: () => applyNode(index),
            })
          );
        });
      }
      onVisibility();
    },
    dispose() {
      disposed = true;
      kill(loops);
      kill(sectionTweens);
      kill(revealTweens);
      kill(pending);
      kill(nodeTweens);
      triggers.forEach((t) => t.kill());
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}
