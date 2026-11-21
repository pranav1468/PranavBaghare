"use client";

import React, { useRef, useEffect } from "react";
import { useMousePosition } from "@/utils/mouse";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
  /** Device-pixel-ratio ceiling — caps fill cost on high-DPI / low-end screens. */
  maxDpr?: number;
}

type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
  rgb: string;
  twinkleSpeed: number;
  twinklePhase: number;
  glow: boolean;
};

type ShootingStar = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  alpha: number;
  life: number;
  maxLife: number;
  rgb: string;
};

type NebulaCloud = {
  xRatio: number;
  yRatio: number;
  radiusRatio: number;
  rgb: string;
  alpha: number;
};

// Realistic stellar spectral colors (O/B blue-white, A/F white, G/K gold-amber, M rose-violet)
const STAR_COLORS = [
  "244, 248, 252", // crisp white
  "155, 184, 255", // hot blue-white
  "98, 200, 232",  // cosmic cyan
  "255, 228, 160", // warm gold
  "255, 184, 108", // amber giant
  "216, 180, 254", // soft violet
  "244, 168, 212", // nebula rose
];

const METEOR_COLORS = [
  "255, 255, 255",
  "145, 225, 255",
  "216, 180, 254",
  "255, 228, 168",
];

const NEBULAE: NebulaCloud[] = [
  { xRatio: 0.24, yRatio: 0.28, radiusRatio: 0.36, rgb: "56, 112, 224", alpha: 0.085 },
  { xRatio: 0.72, yRatio: 0.36, radiusRatio: 0.40, rgb: "139, 92, 246", alpha: 0.075 },
  { xRatio: 0.52, yRatio: 0.68, radiusRatio: 0.38, rgb: "45, 195, 225", alpha: 0.065 },
  { xRatio: 0.82, yRatio: 0.78, radiusRatio: 0.28, rgb: "236, 72, 153", alpha: 0.045 },
];

const CLUSTER_CENTERS = [
  { x: 0.25, y: 0.30, spread: 0.11 },
  { x: 0.74, y: 0.38, spread: 0.13 },
  { x: 0.50, y: 0.65, spread: 0.12 },
];

const isDarkMode = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("dark");

function gaussianRandom(): number {
  const u = Math.max(1e-6, Math.random());
  const v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export default function Particles({
  className = "",
  quantity = 30,
  staticity = 50,
  ease = 50,
  refresh = false,
  maxDpr = 2,
}: ParticlesProps) {
  const pathname = usePathname();
  const isBlogPost = pathname.startsWith("/blogs/") && pathname !== "/blogs";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const nebulaCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const circles = useRef<Circle[]>([]);
  const shootingStars = useRef<ShootingStar[]>([]);
  const nextMeteorAt = useRef<number>(0);
  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const rafId = useRef<number>(0);
  const dpr =
    typeof window !== "undefined" ? Math.min(window.devicePixelRatio, maxDpr) : 1;

  useEffect(() => {
    if (isBlogPost) return;
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    const onResize = () => {
      if (!canvasContainerRef.current) return;
      const newW = canvasContainerRef.current.offsetWidth;
      const newH = canvasContainerRef.current.offsetHeight;
      if (newW === canvasSize.current.w && Math.abs(newH - canvasSize.current.h) < 120) {
        return;
      }
      initCanvas();
    };
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId.current);
      } else {
        cancelAnimationFrame(rafId.current);
        animate();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [isBlogPost]);

  useEffect(() => {
    onMouseMove();
  }, [mousePosition.x, mousePosition.y]);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);

      // Pre-render nebula clouds once per resize
      const off = document.createElement("canvas");
      off.width = canvasSize.current.w;
      off.height = canvasSize.current.h;
      const octx = off.getContext("2d");
      if (octx) {
        const w = off.width;
        const h = off.height;
        const base = Math.max(w, h);
        for (const n of NEBULAE) {
          const cx = n.xRatio * w;
          const cy = n.yRatio * h;
          const r = n.radiusRatio * base;
          const grad = octx.createRadialGradient(cx, cy, 0, cx, cy, r);
          grad.addColorStop(0, `rgba(${n.rgb}, ${n.alpha})`);
          grad.addColorStop(0.5, `rgba(${n.rgb}, ${n.alpha * 0.4})`);
          grad.addColorStop(1, `rgba(${n.rgb}, 0)`);
          octx.fillStyle = grad;
          octx.beginPath();
          octx.arc(cx, cy, r, 0, Math.PI * 2);
          octx.fill();
        }
      }
      nebulaCanvasRef.current = off;
    }
  };

  const circleParams = (): Circle => {
    const { w, h } = canvasSize.current;
    const roll = Math.random();
    let x: number;
    let y: number;

    if (roll < 0.25 && w > 0 && h > 0) {
      // Star cluster
      const c = CLUSTER_CENTERS[Math.floor(Math.random() * CLUSTER_CENTERS.length)];
      x = (c.x + gaussianRandom() * c.spread * 0.55) * w;
      y = (c.y + gaussianRandom() * c.spread * 0.55) * h;
    } else if (roll < 0.48 && w > 0 && h > 0) {
      // Diagonal galactic band (Milky Way arc)
      const t = Math.random();
      const bandY = (0.82 - t * 0.64) + gaussianRandom() * 0.085;
      x = t * w;
      y = bandY * h;
    } else {
      // Deep-space field stars
      x = Math.random() * w;
      y = Math.random() * h;
    }

    x = Math.max(0, Math.min(w, x));
    y = Math.max(0, Math.min(h, y));

    const size = Math.random() * 1.7 + 0.85;
    const targetAlpha = parseFloat((Math.random() * 0.65 + 0.25).toFixed(2));
    const rgb = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];

    return {
      x,
      y,
      translateX: 0,
      translateY: 0,
      size,
      alpha: 0,
      targetAlpha,
      dx: (Math.random() - 0.5) * 0.18,
      dy: (Math.random() - 0.5) * 0.18,
      magnetism: 0.1 + Math.random() * 4,
      rgb,
      twinkleSpeed: 0.0015 + Math.random() * 0.003,
      twinklePhase: Math.random() * Math.PI * 2,
      glow: size > 1.85,
    };
  };

  const spawnShootingStar = (): ShootingStar => {
    const { w, h } = canvasSize.current;
    const startX = Math.random() * w * 0.9 + w * 0.05;
    const startY = Math.random() * h * 0.45;
    const speed = 12 + Math.random() * 8;
    const angle = Math.PI * (0.17 + Math.random() * 0.14);
    return {
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: 110 + Math.random() * 110,
      alpha: 0.95,
      life: 0,
      maxLife: 34 + Math.random() * 20,
      rgb: METEOR_COLORS[Math.floor(Math.random() * METEOR_COLORS.length)],
    };
  };

  const drawNebulae = () => {
    const ctx = context.current;
    const off = nebulaCanvasRef.current;
    if (!ctx || !off || !isDarkMode()) return;
    ctx.drawImage(off, 0, 0, canvasSize.current.w, canvasSize.current.h);
  };

  const drawCircle = (circle: Circle, update = false, now = 0) => {
    const ctx = context.current;
    if (!ctx) return;
    const { x, y, translateX, translateY, size, alpha, rgb, twinkleSpeed, twinklePhase, glow } =
      circle;
    const dark = isDarkMode();
    const renderSize = dark ? size * 1.35 : size;
    const twinkle = dark ? 0.78 + 0.22 * Math.sin(now * twinkleSpeed + twinklePhase) : 1;
    const finalAlpha = Math.max(0, Math.min(1, alpha * twinkle));

    ctx.translate(translateX, translateY);
    if (dark && glow) {
      const haloR = renderSize * 3.2;
      const halo = ctx.createRadialGradient(x, y, 0, x, y, haloR);
      halo.addColorStop(0, `rgba(${rgb}, ${finalAlpha * 0.55})`);
      halo.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, haloR, 0, 2 * Math.PI);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(x, y, renderSize, 0, 2 * Math.PI);
    ctx.fillStyle = dark ? `rgba(${rgb}, ${finalAlpha})` : `rgba(255, 255, 255, ${alpha})`;
    ctx.fill();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (!update) {
      circles.current.push(circle);
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
    }
  };

  const drawParticles = () => {
    clearContext();
    drawNebulae();
    const particleCount = Math.max(quantity, 75);
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): number => {
    const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  const animate = () => {
    const now = performance.now();
    clearContext();
    drawNebulae();

    circles.current.forEach((circle: Circle, i: number) => {
      const edge = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      circle.x += circle.dx;
      circle.y += circle.dy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) / ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) / ease;

      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1);
        const newCircle = circleParams();
        drawCircle(newCircle, false, now);
      } else {
        drawCircle(circle, true, now);
      }
    });

    if (isDarkMode() && context.current) {
      if (now >= nextMeteorAt.current && shootingStars.current.length < 5) {
        shootingStars.current.push(spawnShootingStar());
        nextMeteorAt.current = now + 550 + Math.random() * 800;
      }

      const ctx = context.current;
      for (let i = shootingStars.current.length - 1; i >= 0; i--) {
        const s = shootingStars.current[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life += 1;

        const progress = s.life / s.maxLife;
        const fade =
          progress < 0.2 ? progress / 0.2 : Math.max(0, 1 - (progress - 0.2) / 0.8);
        const curAlpha = s.alpha * fade;

        if (s.life >= s.maxLife || curAlpha <= 0.01) {
          shootingStars.current.splice(i, 1);
          continue;
        }

        const mag = Math.hypot(s.vx, s.vy) || 1;
        const tailX = s.x - (s.vx / mag) * s.length;
        const tailY = s.y - (s.vy / mag) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(${s.rgb}, 0)`);
        grad.addColorStop(0.65, `rgba(${s.rgb}, ${curAlpha * 0.45})`);
        grad.addColorStop(1, `rgba(${s.rgb}, ${curAlpha})`);

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.lineCap = "round";
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${curAlpha})`;
        ctx.arc(s.x, s.y, 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    } else if (shootingStars.current.length > 0) {
      shootingStars.current.length = 0;
    }

    rafId.current = window.requestAnimationFrame(animate);
  };

  if (isBlogPost) return null;

  return (
    <div
      className={cn(
        className,
        "dark:bg-gradient-to-tl from-black via-zinc-600/20 to-black"
      )}
      ref={canvasContainerRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
