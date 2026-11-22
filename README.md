<div align="center">

# Pranav Baghare — 3D AI & ML Portfolio

**An interactive 3D developer portfolio built with Next.js, React Three Fiber, Three.js, GSAP, and Framer Motion.**  
Explore an interactive 3D Neural Processor Core, press or click any of the 16 compute modules to inspect my AI/ML & Computer Vision stack, and browse real-world projects.

### [Live Demo -> pranav-baghare.vercel.app](https://pranav-baghare.vercel.app/)

</div>

---

## Features

- **Interactive 3D Neural Processor Core** — Loaded via `GLTFLoader` (`arctic_neural_processor_core_v2.glb`) with 16 interactive compute modules (`NeuralNode_00`–`NeuralNode_15`), hover/click/keyboard shortcuts (`Q`–`K`), tactile audio feedback, and section-choreographed GSAP + ScrollTrigger animations.
- **Cosmic Universe Backdrop** — Custom 2D canvas starfield featuring spectral-colored twinkling stars, nebula clouds, star clusters, a galactic band, and shooting star streaks in dark mode.
- **Smooth Scrolling & Motion** — Lenis smooth scroll synchronized with GSAP `ScrollTrigger` and `motion/react` reveal transitions, with `prefers-reduced-motion` support and adaptive graphics quality.
- **Featured Projects** — Detailed interactive project modals for *Satellite Imagery Segmentation & Deforestation Analysis*, *Automated Pneumonia Diagnosis System*, and *Autonomous Vehicle Traffic Sign Recognition*.
- **Contact Form & Resume** — Contact form powered by Resend (`/api/send`) with Zod validation and rate limiting, plus an embedded `/resume` viewer and PDF download.
- **Light & Dark Mode** — Theme switching with circular View Transition animations.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **3D & Graphics** | Three.js, React Three Fiber (`@react-three/fiber`), `GLTFLoader` |
| **Animation** | GSAP (`ScrollTrigger`), Motion (`motion/react`), Lenis |
| **Styling & UI** | Tailwind CSS, Radix UI, Lucide Icons |
| **Email & Validation** | Resend, Zod |

---

## Getting Started

### Prerequisites

- Node.js 20.9+
- npm or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pranav1468/pranav1468.github.io.git
   cd pranav1468.github.io
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env.local` and add your Resend API key:
   ```bash
   cp .env.example .env.local
   ```
   ```env
   RESEND_API_KEY=re_your_api_key_here
   ```

4. **Run in development or production:**
   ```bash
   # Development
   npm run dev

   # Production
   npm run build && npm run start
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Contact

- **Email:** [pranavbaghare@gmail.com](mailto:pranavbaghare@gmail.com)
- **GitHub:** [@pranav1468](https://github.com/pranav1468)
- **LinkedIn:** [linkedin.com/in/pranav-baghare](https://linkedin.com/in/pranav-baghare)
