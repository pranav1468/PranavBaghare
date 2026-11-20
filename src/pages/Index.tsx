import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Download,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  ScanEye,
  Workflow,
  X,
} from "lucide-react";
import ComputerVisionConsole from "@/components/ComputerVisionConsole";
import profilePhoto from "@/assets/profile-photo.png";

const navItems = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "approach", label: "Approach" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const projects = [
  {
    number: "01",
    category: "Geospatial computer vision",
    title: "Satellite imagery segmentation",
    description: "Forest monitoring from multispectral satellite imagery, combining Modified U-Net segmentation with Siamese U-Net change detection.",
    image: "/assets/projects/satellite-segmentation.jpg",
    alt: "Satellite imagery segmentation visualization",
    tech: ["Python", "TensorFlow", "U-Net", "GDAL", "Rasterio"],
    href: "https://github.com/pranav1468/Satellite-Imagery-Segmentation-Deforestation-Analysis",
  },
  {
    number: "02",
    category: "Medical imaging",
    title: "Pneumonia detection",
    description: "A chest X-ray classification pipeline built around DenseNet121, with Grad-CAM visualizations to inspect model attention.",
    image: "/assets/projects/pneumonia-gradcam.jpg",
    alt: "Chest X-ray with Grad-CAM activation overlay",
    tech: ["Python", "TensorFlow", "DenseNet121", "Grad-CAM"],
    href: "https://github.com/pranav1468/Automated-Pneumonia-Diagnosis-System-",
  },
  {
    number: "03",
    category: "Autonomous systems",
    title: "Traffic sign recognition",
    description: "A multi-class CNN trained on GTSRB traffic-sign data, with image preprocessing and an interactive Streamlit interface.",
    image: "/assets/projects/traffic-sign-gtsrb.jpg",
    alt: "Traffic sign recognition project visualization",
    tech: ["Python", "Keras", "CNN", "OpenCV", "Streamlit"],
    href: "https://github.com/pranav1468/Autonomous-Vehicle-Traffic-Sign-Recognition",
  },
];

const skillGroups = [
  {
    number: "01",
    title: "Computer vision",
    icon: ScanEye,
    description: "Turning images and video into structured information.",
    skills: ["OpenCV", "YOLO", "GDAL", "Rasterio", "Image processing"],
  },
  {
    number: "02",
    title: "Machine learning",
    icon: Workflow,
    description: "Building, training and evaluating models for specific tasks.",
    skills: ["Python", "PyTorch", "TensorFlow", "Keras", "CNNs", "U-Net"],
  },
  {
    number: "03",
    title: "Engineering",
    icon: Code2,
    description: "Connecting models to applications and deployment environments.",
    skills: ["FastAPI", "Docker", "Linux", "Git", "Streamlit"],
  },
];

const processSteps = [
  { number: "01", title: "Understand the data", text: "Inspect the source, labels, class balance and real-world edge cases before choosing a model." },
  { number: "02", title: "Build the model", text: "Select an architecture that fits the task, the available data and the deployment constraints." },
  { number: "03", title: "Measure what matters", text: "Evaluate task-specific quality, inspect failure cases and account for inference cost." },
  { number: "04", title: "Integrate the system", text: "Turn the model into a usable pipeline with clear inputs, outputs and operational behavior." },
];

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const sectionIds = ["home", ...navItems.map((item) => item.id)];
    const sections = sectionIds.map((id) => document.getElementById(id)).filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: [0, 0.15, 0.35, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));

    const updateProgress = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(available > 0 ? (window.scrollY / available) * 100 : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="portfolio-site">
      <div className="scroll-progress" style={{ width: scrollProgress + "%" }} aria-hidden="true" />

      <header className="site-header">
        <a className="site-brand" href="#home" onClick={closeMenu} aria-label="Pranav Baghare, back to top">
          <span className="site-brand__mark">P<span>.</span></span>
          <span className="site-brand__name">Pranav Baghare</span>
        </a>

        <nav className={"site-nav" + (menuOpen ? " is-open" : "")} aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={"#" + item.id}
              className={activeSection === item.id ? "is-active" : ""}
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a className="header-resume" href="/resume.pdf" download="Pranav_Baghare_Resume.pdf">
          Resume <Download size={14} />
        </a>

        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <main>
        <section id="home" className="hero-section">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-orb hero-orb--one" aria-hidden="true" />
          <div className="hero-orb hero-orb--two" aria-hidden="true" />
          <div className="page-container hero-layout">
            <div className="hero-copy">
              <div className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> AI / ML ENGINEERING <span className="eyebrow-divider">—</span> COMPUTER VISION</div>
              <h1>Building systems<br />that <em>see</em> the world<span className="hero-period">.</span></h1>
              <p className="hero-description">
                I’m Pranav Baghare, a Software Developer (AI/ML) at Mantra Softech. I work across computer vision, deep learning and the engineering needed to turn models into useful systems.
              </p>
              <div className="hero-actions">
                <a className="button button--primary" href="#work">Explore selected work <ArrowUpRight size={16} /></a>
                <a className="button button--secondary" href="/resume.pdf" download="Pranav_Baghare_Resume.pdf">Download résumé <Download size={15} /></a>
              </div>
              <div className="hero-details">
                <span><i className="status-dot" /> Software Developer (AI/ML)</span>
                <span><MapPin size={14} /> India</span>
              </div>
              <div className="hero-socials">
                <a href="https://github.com/pranav1468" target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={12} /></a>
                <a href="https://www.linkedin.com/in/pranav-baghare" target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={12} /></a>
                <a href="mailto:pranavbaghare14@gmail.com"><Mail size={16} /> Email <ArrowUpRight size={12} /></a>
              </div>
            </div>

            <div className="hero-visual">
              <ComputerVisionConsole />
              <div className="hero-visual-note"><span>FIG. 01</span> A visual shorthand for the work: pixels in, useful signals out.</div>
            </div>
          </div>
          <a className="scroll-cue" href="#about"><span>Scroll to explore</span><ArrowDown size={15} /></a>
        </section>

        <div className="discipline-strip" aria-label="Areas of focus">
          <div className="discipline-strip__inner">
            <span>COMPUTER VISION</span><b>✳</b><span>DEEP LEARNING</span><b>✳</b><span>MODEL ENGINEERING</span><b>✳</b><span>EDGE AI</span><b>✳</b><span>COMPUTER VISION</span>
          </div>
        </div>

        <section id="about" className="section section-paper about-section">
          <div className="page-container about-layout">
            <div className="about-portrait">
              <div className="about-photo-wrap">
                <img src={profilePhoto} alt="Portrait of Pranav Baghare" />
                <span className="about-photo-index">PB / PROFILE</span>
              </div>
              <div className="about-caption">
                <span>SOFTWARE DEVELOPER</span>
                <span>AI / ML</span>
              </div>
            </div>

            <div className="about-content">
              <div className="section-kicker"><span>01</span> A little about me</div>
              <h2>Curiosity first.<br /><em>Engineering</em> always.</h2>
              <p className="about-lead">
                I’m interested in the space where machine learning meets real-world constraints: imperfect data, limited compute, changing environments and the need for dependable results.
              </p>
              <p className="about-body">
                My work spans computer vision and deep learning—from satellite imagery and medical imaging to recognition systems. I enjoy understanding a problem end to end: preparing data, choosing an approach, evaluating its limits and integrating the result into software people can use.
              </p>
              <div className="about-focus">
                <div><span>01 / SEE</span><strong>Visual perception</strong><small>Images, video and spatial data</small></div>
                <div><span>02 / LEARN</span><strong>Model development</strong><small>Training, evaluation and iteration</small></div>
                <div><span>03 / SHIP</span><strong>Applied engineering</strong><small>Useful systems, not just notebooks</small></div>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="section section-ink work-section">
          <div className="page-container">
            <div className="section-heading section-heading--light">
              <div>
                <div className="section-kicker"><span>02</span> Selected work</div>
                <h2>Projects with a<br /><em>point of view.</em></h2>
              </div>
              <p>Three examples of applying computer vision and deep learning to different kinds of visual data.</p>
            </div>

            <div className="projects-grid">
              {projects.map((project) => (
                <article className="project-card" key={project.number}>
                  <a className="project-card__image" href={project.href} target="_blank" rel="noreferrer" aria-label={"View " + project.title + " source on GitHub"}>
                    <img src={project.image} alt={project.alt} loading="lazy" />
                    <span className="project-card__number">{project.number}</span>
                    <span className="project-card__open"><ArrowUpRight size={19} /></span>
                  </a>
                  <div className="project-card__body">
                    <div className="project-card__category">{project.category}</div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tags">
                      {project.tech.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                    <a className="text-link" href={project.href} target="_blank" rel="noreferrer">View source <ArrowUpRight size={14} /></a>
                  </div>
                </article>
              ))}
            </div>
            <div className="work-footnote"><span>MORE ON GITHUB</span><a href="https://github.com/pranav1468" target="_blank" rel="noreferrer">Explore the repositories <ArrowUpRight size={15} /></a></div>
          </div>
        </section>

        <section id="approach" className="section section-paper approach-section">
          <div className="page-container">
            <div className="section-heading">
              <div>
                <div className="section-kicker"><span>03</span> How I work</div>
                <h2>From raw data<br />to <em>working systems.</em></h2>
              </div>
              <p>A practical workflow keeps the model connected to the problem it is meant to solve.</p>
            </div>
            <div className="process-grid">
              {processSteps.map((step) => (
                <article className="process-card" key={step.number}>
                  <span className="process-card__number">{step.number}</span>
                  <div className="process-card__rule" />
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
            <div className="process-signature"><Workflow size={18} /><span>DATA</span><i /> <span>MODEL</span><i /> <span>EVALUATION</span><i /> <span>DEPLOYMENT</span></div>
          </div>
        </section>

        <section id="skills" className="section section-ink skills-section">
          <div className="page-container">
            <div className="section-heading section-heading--light">
              <div>
                <div className="section-kicker"><span>04</span> Technical toolkit</div>
                <h2>The tools behind<br /><em>the work.</em></h2>
              </div>
              <p>A focused set of tools across model development, visual data processing and application engineering.</p>
            </div>
            <div className="skills-grid">
              {skillGroups.map((group) => {
                const Icon = group.icon;
                return (
                  <article className="skill-card" key={group.number}>
                    <div className="skill-card__top"><span>{group.number} / DISCIPLINE</span><Icon size={22} strokeWidth={1.5} /></div>
                    <h3>{group.title}</h3>
                    <p>{group.description}</p>
                    <div className="skill-card__tags">{group.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="experience" className="section section-paper experience-section">
          <div className="page-container">
            <div className="section-heading">
              <div>
                <div className="section-kicker"><span>05</span> Experience & education</div>
                <h2>Learning by<br /><em>building.</em></h2>
              </div>
              <p>Professional experience and the academic foundation behind my work.</p>
            </div>

            <div className="timeline">
              <article className="timeline-entry">
                <div className="timeline-entry__date">OCT 2024 — PRESENT</div>
                <div className="timeline-entry__marker"><BriefcaseBusiness size={17} /></div>
                <div className="timeline-entry__content">
                  <div className="timeline-entry__meta">PROFESSIONAL EXPERIENCE</div>
                  <h3>Software Developer (AI/ML)</h3>
                  <strong>Mantra Softech India Pvt. Ltd.</strong>
                  <p>Working on computer vision and deep learning projects, including model development and the engineering of practical AI systems.</p>
                  <span className="timeline-entry__location"><MapPin size={13} /> Ahmedabad, India</span>
                </div>
              </article>

              <article className="timeline-entry">
                <div className="timeline-entry__date">AUG 2025 — FEB 2026</div>
                <div className="timeline-entry__marker"><GraduationCap size={18} /></div>
                <div className="timeline-entry__content">
                  <div className="timeline-entry__meta">POSTGRADUATE STUDY</div>
                  <h3>Post Graduate Diploma</h3>
                  <strong>Centre for Development of Advanced Computing (C-DAC), Noida</strong>
                  <p>Postgraduate training in advanced computing and applied technical practice.</p>
                </div>
              </article>

              <article className="timeline-entry">
                <div className="timeline-entry__date">2020 — 2024</div>
                <div className="timeline-entry__marker"><GraduationCap size={18} /></div>
                <div className="timeline-entry__content">
                  <div className="timeline-entry__meta">UNDERGRADUATE STUDY</div>
                  <h3>B.Tech, Computer Science & Engineering</h3>
                  <strong>Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore</strong>
                  <p>Undergraduate foundation in computer science and software engineering.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="contact" className="section section-contact">
          <div className="contact-glow" aria-hidden="true" />
          <div className="page-container contact-layout">
            <div>
              <div className="section-kicker section-kicker--light"><span>06</span> Get in touch</div>
              <h2>Have a problem<br />worth <em>solving?</em></h2>
              <p>For conversations about computer vision, applied machine learning or engineering projects, reach out.</p>
            </div>
            <div className="contact-panel">
              <span className="contact-panel__label">START A CONVERSATION</span>
              <a className="contact-email" href="mailto:pranavbaghare14@gmail.com">pranavbaghare14@gmail.com <ArrowUpRight size={21} /></a>
              <div className="contact-links">
                <a href="https://github.com/pranav1468" target="_blank" rel="noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={13} /></a>
                <a href="https://www.linkedin.com/in/pranav-baghare" target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn <ArrowUpRight size={13} /></a>
                <a href="/resume.pdf" download="Pranav_Baghare_Resume.pdf"><Download size={16} /> Résumé <ArrowUpRight size={13} /></a>
              </div>
            </div>
          </div>
          <footer className="site-footer page-container">
            <a className="site-brand site-brand--footer" href="#home"><span className="site-brand__mark">P<span>.</span></span><span className="site-brand__name">Pranav Baghare</span></a>
            <span>Designed around the work. © {new Date().getFullYear()} Pranav Baghare.</span>
            <a href="#home" className="back-to-top">Back to top <ArrowUpRight size={14} /></a>
          </footer>
        </section>
      </main>
    </div>
  );
}
