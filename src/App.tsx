import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  FileText,
  GraduationCap,
  Linkedin,
  Mail,
  Map,
  Menu,
  MessageCircle,
  Mic,
  Route,
  Search,
  Sparkle,
  Target,
  UserCheck,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import heroImage from "./assets/career-conversation.jpg";
import logo from "./assets/logo.png";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  ["Why", "why"],
  ["Services", "services"],
  ["Journey", "journey"],
  ["Resources", "resources"],
  ["FAQ", "faq"],
  ["Contact", "contact"],
] as const;

const services = [
  {
    icon: FileText,
    title: "Resume Building & Optimization",
    text: "Stand out with ATS-friendly resumes that highlight your skills, experience, and achievements.",
  },
  {
    icon: GraduationCap,
    title: "Career Counseling",
    text: "Personalized guidance to help students, graduates, and professionals identify the right career path and growth opportunities.",
  },
  {
    icon: Mic,
    title: "Interview Preparation",
    text: "Mock sessions, detailed feedback, and proven strategies to improve interview performance and confidence.",
  },
  {
    icon: Linkedin,
    title: "LinkedIn Optimization",
    text: "Profile enhancement, keyword strategy, and visibility improvements to attract recruiters and opportunities.",
  },
  {
    icon: Search,
    title: "Job Placement Assistance",
    text: "Support in identifying opportunities, applying strategically, and navigating hiring processes successfully.",
  },
  {
    icon: MessageCircle,
    title: "Mock Interviews",
    text: "Real-world interview simulations with actionable feedback from experienced professionals.",
  },
  {
    icon: Route,
    title: "Career Roadmap Planning",
    text: "Personalized 6-24 month career plans with milestones, skills, certifications, and growth objectives.",
  },
];

const journeySteps = [
  ["Discover", "Understand your strengths, interests, goals, and current career gaps."],
  ["Plan", "Choose a practical direction and define the next milestones."],
  ["Build", "Improve your resume, profile, story, and professional materials."],
  ["Prepare", "Practice interviews, sharpen answers, and build confidence."],
  ["Apply", "Identify better-fit opportunities and apply with intention."],
  ["Interview", "Navigate conversations with clarity, structure, and composure."],
  ["Get Hired", "Evaluate opportunities and move through hiring processes thoughtfully."],
  ["Grow", "Keep developing skills, confidence, and long-term career momentum."],
];

const resources = [
  {
    topic: "Career Advice",
    title: "How to choose a career direction when every option feels uncertain",
  },
  {
    topic: "Resume Tips",
    title: "What a strong resume needs before you start applying",
  },
  {
    topic: "Interview Strategies",
    title: "How to prepare answers that sound clear, natural, and credible",
  },
  {
    topic: "LinkedIn Best Practices",
    title: "Small profile improvements that make your experience easier to understand",
  },
  {
    topic: "Career Growth Guides",
    title: "Building a 6-month plan for professional development",
  },
];

const faqs = [
  {
    question: "Is RecronixHR only a recruitment agency?",
    answer:
      "We're much more than that. Alongside connecting you with the right opportunities, RecronixHR supports you through your entire career path — personalized consulting, resume and LinkedIn building, and interview preparation — guiding you every step of the way until you get placed and beyond.",
  },
  {
    question: "Who can work with RecronixHR?",
    answer:
      "Students, fresh graduates, early-career professionals, and experienced professionals who want clearer direction, stronger career materials, and better preparation for opportunities.",
  },
  {
    question: "What happens in a career consultation?",
    answer:
      "We learn about your background, goals, challenges, and current materials, then recommend a practical path across guidance, resume support, interview preparation, LinkedIn, or roadmap planning.",
  },
];

function useGsapReveals() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((node) => {
        gsap.fromTo(
          node,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: node,
              start: "top 92%",
              once: true,
            },
          },
        );
      });
    });

    return () => ctx.revert();
  }, [reduceMotion]);
}

function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient__wash ambient__wash--one" />
      <div className="ambient__wash ambient__wash--two" />
      <div className="ambient__paper" />
    </div>
  );
}

function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  useEffect(() => {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    const over = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      setActive(Boolean(target?.closest("a, button, input, textarea, [data-cursor='active']")));
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [reduceMotion, x, y]);

  if (reduceMotion) return null;

  return (
    <motion.div
      className="custom-cursor"
      aria-hidden="true"
      style={{ x, y }}
      animate={{ opacity: visible ? 1 : 0, scale: active ? 1.85 : 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    />
  );
}

function MagneticButton({
  children,
  href,
  variant = "primary",
}: {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "quiet";
}) {
  const reduceMotion = useReducedMotion();

  const onMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = event.clientX - rect.left - rect.width / 2;
    const relY = event.clientY - rect.top - rect.height / 2;
    gsap.to(event.currentTarget, {
      x: relX * 0.14,
      y: relY * 0.18,
      duration: 0.28,
      ease: "power3.out",
    });
  };

  const onLeave = (event: React.PointerEvent<HTMLAnchorElement>) => {
    gsap.to(event.currentTarget, { x: 0, y: 0, duration: 0.45, ease: "expo.out" });
  };

  return (
    <a className={`button button--${variant}`} href={href} onPointerMove={onMove} onPointerLeave={onLeave}>
      <span>{children}</span>
      <ArrowRight aria-hidden="true" size={18} />
    </a>
  );
}

function WordReveal({
  children,
  className = "",
  as: Tag = "h2",
  delay = 0,
}: {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
}) {
  const words = children.split(" ");
  const reduceMotion = useReducedMotion();
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(triggerRef, { once: true, amount: 0.45 });

  if (reduceMotion) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag className={className} aria-label={children}>
      {words.map((word, index) => (
        <span className="word-mask" aria-hidden="true" key={`${word}-${index}`} ref={index === 0 ? triggerRef : undefined}>
          <motion.span
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.5, delay: delay + index * 0.025, ease: [0.19, 1, 0.22, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="RecronixHR home">
        <img className="brand__logo" src={logo} alt="RecronixHR" />
      </a>

      <nav className="nav" aria-label="Primary navigation">
        {navItems.map(([label, id]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>

      <a className="header-cta" href="#contact">
        Book consultation
        <ArrowRight size={16} aria-hidden="true" />
      </a>

      <button className="menu-button" type="button" aria-label="Toggle navigation" onClick={() => setOpen((value) => !value)}>
        {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            {navItems.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero section-shell" id="top">
      <div className="hero__content">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
          Career consultancy and growth guidance
        </motion.p>
        <WordReveal as="h1" className="hero__title" delay={0.04}>
          Your Career. Your Growth. Your Next Opportunity.
        </WordReveal>
        <motion.p
          className="hero__lede"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.74, ease: [0.19, 1, 0.22, 1] }}
        >
          RecronixHR helps students and professionals build stronger resumes, prepare for interviews, optimize
          LinkedIn profiles, and secure meaningful career opportunities through expert guidance and personalized support.
        </motion.p>
        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
          <MagneticButton href="#contact">Book Career Consultation</MagneticButton>
          <MagneticButton href="#services" variant="secondary">
            Explore Services
          </MagneticButton>
        </motion.div>
      </div>

      <HeroShowcase />
    </section>
  );
}

type HeroSlide =
  | { kind: "image"; tag: string; caption: string }
  | { kind: "panel"; tag: string; title: string; items: string[] };

const heroSlides: HeroSlide[] = [
  {
    kind: "image",
    tag: "Trusted guidance",
    caption: "One-on-one career consultations, tailored to you.",
  },
  {
    kind: "panel",
    tag: "What we help with",
    title: "Everything you need to move forward with confidence.",
    items: ["ATS-ready resumes", "Interview preparation", "LinkedIn optimization", "Career roadmaps"],
  },
  {
    kind: "panel",
    tag: "Your journey",
    title: "A clear path from uncertainty to opportunity.",
    items: ["Discover your strengths", "Prepare with intention", "Apply with clarity", "Grow long-term"],
  },
];

function HeroShowcase() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, [reduceMotion, paused]);

  const slide = heroSlides[index];

  return (
    <motion.div
      className="hero-showcase"
      initial={{ opacity: 0, y: 28, clipPath: "inset(0 0 20% 0)" }}
      animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
      transition={{ delay: 0.26, duration: 1.05, ease: [0.19, 1, 0.22, 1] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="hero-showcase__stage">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className={`hero-slide hero-slide--${slide.kind}`}
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.19, 1, 0.22, 1] }}
          >
            {slide.kind === "image" ? (
              <>
                <img
                  src={heroImage}
                  alt="A career consultant guiding a professional through their next step"
                />
                <div className="hero-slide__caption">
                  <span>{slide.tag}</span>
                  <strong>{slide.caption}</strong>
                </div>
              </>
            ) : (
              <div className="hero-slide__panel">
                <span className="hero-slide__tag">{slide.tag}</span>
                <h3>{slide.title}</h3>
                <ul>
                  {slide.items.map((item) => (
                    <li key={item}>
                      <Check size={16} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="hero-showcase__dots" role="tablist" aria-label="Hero highlights">
        {heroSlides.map((item, i) => (
          <button
            key={item.tag}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show highlight ${i + 1}`}
            className={i === index ? "is-active" : undefined}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </motion.div>
  );
}

const whyPoints = [
  "Personalized guidance for your background and goals.",
  "Practical support across resumes, interviews, LinkedIn, and applications.",
  "Long-term career growth instead of one-time advice.",
  "Guidance that helps you prepare, apply, and grow with confidence.",
];

function WhyElevate() {
  return (
    <section className="why-simple section-shell" id="why">
      <div className="why-simple__head">
        <div className="section-kicker" data-reveal>
          <Sparkle size={16} aria-hidden="true" />
          Why RecronixHR
        </div>
        <WordReveal className="section-title">We don't just help you find a job. We help you build a career.</WordReveal>
        <p className="section-copy" data-reveal>
          RecronixHR is a career partner for people who want direction, confidence, employability, and practical
          support. We help you understand where you are, improve how you present yourself, and navigate the next
          opportunity with preparation rather than guesswork.
        </p>
      </div>
      <ul className="why-simple__grid">
        {whyPoints.map((point, index) => (
          <motion.li
            className="why-point"
            key={point}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: index * 0.06, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="why-point__icon">
              <Check size={16} aria-hidden="true" />
            </span>
            <span>{point}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

function Services() {
  const onCardMove = (event: React.MouseEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <section className="services section-shell" id="services">
      <div className="section-intro">
        <div>
          <div className="section-kicker" data-reveal>
            <UserCheck size={16} aria-hidden="true" />
            Our services
          </div>
          <WordReveal className="section-title">Personal career support for every important step.</WordReveal>
        </div>
        <p className="section-copy" data-reveal>
          Focused, practical services designed to help you discover, prepare, apply, succeed, and grow.
        </p>
      </div>

      <div className="services-grid">
        {services.map((service, index) => {
          const Icon = service.icon;

          return (
            <motion.article
              className="service-card"
              key={service.title}
              data-cursor="active"
              onMouseMove={onCardMove}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.19, 1, 0.22, 1] }}
            >
              <span className="service-card__number">{String(index + 1).padStart(2, "0")}</span>
              <span className="service-card__icon">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <span className="service-card__meta">
                <Check size={15} aria-hidden="true" />
                Career-ready support
              </span>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function CareerJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end center"] });
  const fillWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="journey section-shell" id="journey">
      <div className="journey__head">
        <div className="section-kicker" data-reveal>
          <Map size={16} aria-hidden="true" />
          Career success journey
        </div>
        <WordReveal className="section-title">A guided path from uncertainty to opportunity.</WordReveal>
        <p className="section-copy" data-reveal>
          Career growth becomes less overwhelming when the next step is visible — a clear path from discovery to
          preparation, application, interviews, and long-term growth.
        </p>
      </div>

      <div className="timeline" ref={ref}>
        <div className="timeline__row">
          <div className="timeline__track" aria-hidden="true">
            <motion.div className="timeline__fill" style={{ width: reduceMotion ? "100%" : fillWidth }} />
          </div>
          {journeySteps.map(([title, text], index) => (
            <motion.div
              className="timeline__item"
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: index * 0.05, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="timeline__node">{String(index + 1).padStart(2, "0")}</div>
              <div className="timeline__card">
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Resources() {
  return (
    <section className="resources section-shell" id="resources">
      <div className="section-intro">
        <div>
          <div className="section-kicker" data-reveal>
            <BookOpen size={16} aria-hidden="true" />
            Resources & insights
          </div>
          <WordReveal className="section-title">A knowledge center for career confidence.</WordReveal>
        </div>
        <p className="section-copy" data-reveal>
          Practical guidance for career advice, resume tips, interview strategies, LinkedIn best practices, industry
          trends, and professional development.
        </p>
      </div>
      <div className="resource-board">
        {resources.map((item, index) => (
          <motion.article
            className="resource-item"
            key={item.title}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.07, ease: [0.19, 1, 0.22, 1] }}
          >
            <span>{item.topic}</span>
            <h3>{item.title}</h3>
            <a href="#contact" aria-label={`Ask about ${item.topic.toLowerCase()}`}>
              Ask about this
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="faq section-shell" id="faq">
      <div className="faq__head">
        <div className="section-kicker" data-reveal>
          <Target size={16} aria-hidden="true" />
          Frequently asked questions
        </div>
        <WordReveal className="section-title">Clear answers before you begin.</WordReveal>
      </div>
      <div className="faq-list">
        {faqs.map((item, index) => {
          const isOpen = open === index;
          return (
            <article className={`faq-item${isOpen ? " is-open" : ""}`} key={item.question} data-reveal>
              <button type="button" onClick={() => setOpen(isOpen ? -1 : index)} aria-expanded={isOpen}>
                <span>{item.question}</span>
                <ChevronDown size={18} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="faq-item__panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <p>{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          );
        })}
      </div>
    </section>
  );
}

const WHATSAPP_NUMBER = "917090612992";
const WHATSAPP_DISPLAY = "+91 70906 12992";

function Contact() {
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const focus = String(data.get("focus") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !message) {
      setStatus("error");
      form.classList.add("was-validated");
      return;
    }

    const text = [
      "Hi RecronixHR, I'd like to book a consultation.",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Support needed: ${focus}`,
      "",
      `Message: ${message}`,
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");

    setStatus("success");
    form.reset();
    form.classList.remove("was-validated");
  };

  return (
    <section className="contact section-shell" id="contact">
      <div className="contact__copy">
        <div className="section-kicker" data-reveal>
          <Mail size={16} aria-hidden="true" />
          Contact & consultation
        </div>
        <WordReveal className="section-title">Book a career consultation and find your next step.</WordReveal>
        <p className="section-copy" data-reveal>
          Tell us where you are now, what feels unclear, and what kind of growth you want. Send the form and it opens a
          WhatsApp chat with your details ready to go.
        </p>

        <a
          className="contact-direct"
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          data-reveal
        >
          <span className="contact-direct__icon">
            <MessageCircle size={20} aria-hidden="true" />
          </span>
          <span className="contact-direct__text">
            <strong>Chat with us on WhatsApp</strong>
            <span>{WHATSAPP_DISPLAY}</span>
          </span>
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>

      <form className="contact-form" onSubmit={onSubmit} noValidate data-reveal>
        <label>
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" required placeholder="Your name" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        </label>
        <label>
          <span>Support needed</span>
          <select name="focus" defaultValue="Career Consultation">
            <option>Career Consultation</option>
            <option>Resume Building & Optimization</option>
            <option>Interview Preparation</option>
            <option>LinkedIn Optimization</option>
            <option>Placement Assistance</option>
            <option>Career Roadmap Planning</option>
          </select>
        </label>
        <label>
          <span>Message</span>
          <textarea name="message" required placeholder="Tell us about your career goal, current challenge, or upcoming opportunity." rows={5} />
        </label>
        <button className="form-submit" type="submit">
          <MessageCircle size={18} aria-hidden="true" />
          Send via WhatsApp
        </button>
        <div className="form-status" role="status" aria-live="polite">
          {status === "error" && "Please complete the required fields so we can understand your career goals."}
          {status === "success" && "Opening WhatsApp with your details. Just press send to reach us."}
        </div>
      </form>
    </section>
  );
}

function ClimberFigure({ color }: { color: string }) {
  // a simple climbing/running figure drawn with feet at the origin (0, 0)
  return (
    <g stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx={0} cy={-26} r={4.6} fill={color} stroke="none" />
      <path d="M0 -21 L0 -9" />
      <path d="M0 -9 L-6 0" />
      <path d="M0 -9 L6 -1" />
      <path d="M0 -18 L-7 -12" />
      <path d="M0 -18 L8 -25" />
    </g>
  );
}

function Intro({ onSkip }: { onSkip: () => void }) {
  const green = "#3aa838";
  const blue = "#34a4d6";
  const navy = "#1d3f5d";

  const bars = [
    { x: 46, w: 24, base: 154, h: 34 },
    { x: 82, w: 24, base: 154, h: 58 },
    { x: 118, w: 24, base: 154, h: 86 },
  ];
  // each climber sits on top of its bar; they rise into place bottom-to-top
  const climbers = [
    { x: 58, y: 120, delay: 0.7 },
    { x: 94, y: 96, delay: 0.95 },
    { x: 130, y: 68, delay: 1.2 },
  ];

  return (
    <motion.div
      className="intro"
      role="presentation"
      onClick={onSkip}
      initial={{ opacity: 1 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="intro__stage">
        <svg className="intro__art" viewBox="0 0 200 175" fill="none" aria-hidden="true">
          <motion.ellipse
            cx={100}
            cy={158}
            rx={86}
            ry={13}
            stroke={navy}
            strokeWidth={5}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          />

          {bars.map((b, i) => (
            <motion.rect
              key={b.x}
              x={b.x}
              y={b.base - b.h}
              width={b.w}
              height={b.h}
              rx={4}
              fill={blue}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
              transition={{ duration: 0.55, delay: 0.25 + i * 0.16, ease: [0.19, 1, 0.22, 1] }}
            />
          ))}

          {climbers.map((c) => (
            <motion.g
              key={c.x}
              initial={{ opacity: 0, x: c.x - 24, y: c.y + 30 }}
              animate={{ opacity: 1, x: c.x, y: c.y }}
              transition={{ duration: 0.6, delay: c.delay, ease: [0.34, 1.3, 0.5, 1] }}
            >
              <ClimberFigure color={green} />
            </motion.g>
          ))}

          <motion.path
            d="M139 41 l5 -9 l5 9"
            stroke={green}
            strokeWidth={3.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: [0, 1, 1], y: [8, 0, -4] }}
            transition={{ duration: 0.6, delay: 1.5, ease: [0.19, 1, 0.22, 1] }}
          />
        </svg>

        <motion.img
          className="intro__logo"
          src={logo}
          alt="RecronixHR"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.7, ease: [0.19, 1, 0.22, 1] }}
        />
      </div>
    </motion.div>
  );
}

function App() {
  useGsapReveals();
  const [intro, setIntro] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
      return sessionStorage.getItem("ec-intro-shown") !== "1";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!intro) return;
    try {
      sessionStorage.setItem("ec-intro-shown", "1");
    } catch {
      /* storage may be unavailable in private mode */
    }
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => setIntro(false), 2600);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [intro]);

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <>
      <AnimatePresence>{intro && <Intro key="intro" onSkip={() => setIntro(false)} />}</AnimatePresence>
      <AmbientBackground />
      <CustomCursor />
      <Header />
      <main>
        <Hero />
        <WhyElevate />
        <Services />
        <CareerJourney />
        <Resources />
        <FAQ />
        <Contact />
      </main>
      <footer className="footer section-shell">
        <a className="footer__brand" href="#top" aria-label="RecronixHR home">
          <img src={logo} alt="RecronixHR" />
        </a>
        <span>Career growth starts with the right guidance.</span>
        <span>{year}</span>
      </footer>
    </>
  );
}

export default App;
