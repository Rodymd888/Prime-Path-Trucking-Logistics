"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Menu,
  Pause,
  Phone,
  Play,
  Plus,
  X,
} from "lucide-react";
import { site } from "@/lib/site";

const cities = [
  {
    name: "Dallas–Fort Worth",
    short: "DFW",
    x: 389,
    y: 216,
    lx: 402,
    ly: 195,
    corridor: "The North Texas connection",
    text: "Build a freight plan around the region’s distribution centers, manufacturers, and growing commercial corridors.",
    lanes: ["DFW ↔ Houston", "DFW ↔ Austin", "DFW ↔ San Antonio"],
  },
  {
    name: "Houston",
    short: "HOU",
    x: 474,
    y: 352,
    lx: 488,
    ly: 378,
    corridor: "Where industry meets opportunity",
    text: "Connect the Houston metro with your customers, suppliers, and distribution points across Texas.",
    lanes: ["Houston ↔ DFW", "Houston ↔ Austin", "Houston ↔ San Antonio"],
  },
  {
    name: "Austin",
    short: "ATX",
    x: 366,
    y: 348,
    lx: 305,
    ly: 331,
    corridor: "Central Texas, connected",
    text: "Keep freight moving between Austin’s growing business community and the state’s major shipping markets.",
    lanes: ["Austin ↔ DFW", "Austin ↔ Houston", "Austin ↔ San Antonio"],
  },
  {
    name: "San Antonio",
    short: "SAT",
    x: 335,
    y: 393,
    lx: 232,
    ly: 418,
    corridor: "A clear path through South Texas",
    text: "Plan repeatable freight movements from San Antonio to the facilities and customers that keep your business running.",
    lanes: [
      "San Antonio ↔ DFW",
      "San Antonio ↔ Houston",
      "San Antonio ↔ Austin",
    ],
  },
];
const services = [
  {
    n: "01",
    title: "Dedicated trucking",
    subtitle: "Your lanes. A plan built around them.",
    image: "operations",
    text: "Bring structure to recurring freight. We work with you to define the lane, schedule, equipment, and communication your operation needs.",
    details: [
      "Recurring lane and shuttle programs",
      "Facility-to-facility movements",
      "Your shipping windows, built into the plan",
    ],
    service: "Dedicated trucking",
  },
  {
    n: "02",
    title: "Regional truckload",
    subtitle: "City to city. Business to business.",
    image: "hero",
    text: "Move freight between Texas markets with a clear plan from pickup through delivery. Start with your shipment, your timeline, and the details that matter.",
    details: [
      "Point-to-point Texas freight",
      "Distribution and replenishment moves",
      "Shipment-specific planning and coordination",
    ],
    service: "Regional truckload",
  },
  {
    n: "03",
    title: "Power-only solutions",
    subtitle: "Your trailer. The next move.",
    image: "detail",
    text: "Put a focused transportation plan behind the equipment you already have. Discuss tractor capacity, trailer requirements, and your pickup and delivery sequence.",
    details: [
      "Customer-owned trailer movements",
      "Drop-and-hook program planning",
      "Day-cab solutions for regional routes",
    ],
    service: "Power-only",
  },
];
const questions = [
  [
    "Where does Prime Path operate?",
    "Our focus is freight within Texas, including Dallas–Fort Worth, Houston, Austin, San Antonio, and connecting regional markets. Share your origin and destination so we can review your lane.",
  ],
  [
    "Can we discuss a dedicated lane or recurring contract?",
    "Yes. Include your expected volume, frequency, shipping windows, trailer needs, and proposed start date. Those details help us discuss a program built around your operation.",
  ],
  [
    "What information helps you quote a shipment?",
    "Start with the pickup and delivery locations, freight type, estimated weight, equipment requirements, and target dates. Note appointments, loading responsibilities, and any special handling needs.",
  ],
  [
    "Do you handle customer-owned trailers?",
    "We welcome inquiries about power-only and drop-and-hook programs. Trailer specifications, condition, route requirements, and equipment availability are reviewed before a service commitment.",
  ],
  [
    "What happens after I send an inquiry?",
    "We review your requirements and contact you to clarify the lane, timing, and service fit. A quote request starts a conversation; it is not a booking or guaranteed capacity.",
  ],
];

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a
      href="/"
      className={`brand ${light ? "brand-light" : ""}`}
      aria-label="Prime Path Trucking & Logistics home"
    >
      <span className="brand-symbol" aria-hidden="true">
        <img src="/media/brand-logo.png" alt="" width="1774" height="887" />
      </span>
      <span className="brand-name">
        PRIME PATH<span>TRUCKING &amp; LOGISTICS</span>
      </span>
    </a>
  );
}
function Label({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}>
      <span aria-hidden="true" />
      {children}
    </p>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCity, setActiveCity] = useState(0);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [filmOpen, setFilmOpen] = useState(false);
  const [origin, setOrigin] = useState("");
  const [service, setService] = useState("");
  const [formStatus, setFormStatus] = useState<
    "idle" | "sending" | "sent" | "draft" | "error"
  >("idle");
  const [formError, setFormError] = useState("");
  const [draftUrl, setDraftUrl] = useState("");
  const [draftText, setDraftText] = useState("");
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const filmRef = useRef<HTMLDialogElement>(null);
  const city = cities[activeCity];

  useEffect(() => {
    const pref = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const update = () =>
      setMotionAllowed(!pref.matches && !connection?.saveData);
    update();
    pref.addEventListener("change", update);
    return () => pref.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (motionAllowed && playing) v.play().catch(() => setPlaying(false));
    else v.pause();
  }, [motionAllowed, playing]);
  useEffect(() => {
    if (
      !window.IntersectionObserver ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.07 },
    );
    document.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("will-reveal");
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    const d = filmRef.current;
    if (filmOpen && d && !d.open) d.showModal();
    if (!filmOpen && d?.open) d.close();
    if (filmOpen) {
      const old = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = old;
      };
    }
  }, [filmOpen]);

  function startQuote(value?: string, from?: string) {
    if (value) setService(value);
    if (from) setOrigin(from);
    setMenuOpen(false);
    document
      .getElementById("quote")
      ?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
  }
  async function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = Object.fromEntries(new FormData(event.currentTarget).entries());
    if (f.website) return;
    setFormStatus("sending");
    setFormError("");
    setCopied(false);
    const body = [
      "PRIME PATH — FREIGHT INQUIRY",
      "",
      `Name: ${f.name}`,
      `Company: ${f.company}`,
      `Email: ${f.email}`,
      `Phone: ${f.phone || "Not provided"}`,
      "",
      `Origin: ${f.origin}`,
      `Destination: ${f.destination}`,
      `Service: ${f.service}`,
      `Frequency: ${f.frequency}`,
      `Target pickup: ${f.date || "To be discussed"}`,
      "",
      `Freight details: ${f.details || "To be discussed"}`,
    ].join("\n");
    setDraftText(body);
    setDraftUrl(
      `mailto:${site.email}?subject=${encodeURIComponent(`Freight inquiry: ${f.origin} to ${f.destination}`)}&body=${encodeURIComponent(body)}`,
    );
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const result = await response.json();
      if (result.mode === "email-draft") {
        setFormStatus("draft");
        return;
      }
      if (!response.ok)
        throw new Error(
          result.error ||
            "We couldn’t send automatically. Please use the prepared email below.",
        );
      setFormStatus("sent");
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Please email your lane details or call us directly.",
      );
      setFormStatus("error");
    }
  }
  async function copyDetails() {
    try {
      await navigator.clipboard.writeText(draftText);
      setCopied(true);
    } catch {
      setFormError(
        "Copy isn’t available. Use the email link or call us directly.",
      );
    }
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="topline">
        <div className="container">
          <span>TEXAS ROOTS. A HIGHER STANDARD.</span>
          <a href={`tel:${site.phone}`}>
            Let’s talk freight <span /> {site.phoneDisplay}
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <header className="site-header">
        <div className="container nav-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#solutions">Solutions</a>
            <a href="#network">Texas network</a>
            <a href="#standard">Our standard</a>
          </nav>
          <a href="#quote" className="button button-small nav-quote">
            Request a quote
            <ArrowUpRight size={17} />
          </a>
          <button
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            {[
              ["Solutions", "solutions"],
              ["Texas network", "network"],
              ["Our standard", "standard"],
              ["Request a quote", "quote"],
            ].map(([title, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                {title}
                <ArrowUpRight size={20} />
              </a>
            ))}
            <a href={`tel:${site.phone}`}>
              {site.phoneDisplay}
              <Phone size={19} />
            </a>
          </nav>
        )}
      </header>
      <main id="main">
        <section className="hero" aria-labelledby="hero-heading">
          <img
            src="/media/hero.webp"
            className="hero-image"
            alt="Prime Path branded day cab and dry van trailer on a Texas highway at dawn"
            fetchPriority="high"
            width="1920"
            height="1080"
          />
          {motionAllowed && (
            <video
              ref={videoRef}
              className="hero-video"
              muted
              playsInline
              loop
              autoPlay
              preload="none"
              poster="/media/hero.webp"
              aria-hidden="true"
              onError={() => setMotionAllowed(false)}
            >
              <source src="/media/highway-loop.mp4" type="video/mp4" />
            </video>
          )}
          <div className="hero-shade" />
          <div className="container hero-content">
            <p className="hero-eyebrow">
              <span />
              PRIME PATH TRUCKING &amp; LOGISTICS
            </p>
            <h1 id="hero-heading">
              TEXAS.
              <br />
              IN MOTION.
            </h1>
            <p className="hero-description">
              Dedicated trucking. Regional freight.
              <br />A clear path for your business.
            </p>
            <div className="hero-actions">
              <a href="#quote" className="button button-blue">
                Let’s move your freight
                <ArrowUpRight size={20} />
              </a>
              <button className="film-button" onClick={() => setFilmOpen(true)}>
                <span className="play-ring">
                  <Play size={15} fill="currentColor" />
                </span>
                <span>See Prime Path in motion</span>
              </button>
            </div>
          </div>
          <div className="container hero-bottom">
            <p>
              Connecting Texas. City to City
              <span>ONE STATE. EVERY CONNECTION.</span>
            </p>
            <div className="hero-controls">
              {motionAllowed && (
                <button
                  aria-label={
                    playing
                      ? "Pause background motion"
                      : "Play background motion"
                  }
                  onClick={() => setPlaying(!playing)}
                >
                  {playing ? <Pause size={16} /> : <Play size={16} />}
                </button>
              )}
              <a href="#intro" aria-label="Explore Prime Path">
                <ArrowDown size={20} />
              </a>
            </div>
          </div>
        </section>
        <div className="city-strip">
          <div className="container">
            <span className="city-strip-label">A TEXAS STATE OF MIND.</span>
            <span>DALLAS–FORT WORTH</span>
            <i />
            <span>HOUSTON</span>
            <i />
            <span>AUSTIN</span>
            <i />
            <span>SAN ANTONIO</span>
          </div>
        </div>

        <section id="intro" className="intro section-pad">
          <div className="container intro-grid">
            <div className="reveal">
              <Label>BUILT FOR THE WAY TEXAS WORKS</Label>
              <h2>
                Big state.
                <br />
                Clear direction.
              </h2>
            </div>
            <div className="intro-copy reveal">
              <p className="lead">
                Your freight connects more than locations. It connects your
                business to what comes next.
              </p>
              <p>
                Prime Path is built around a straightforward idea: regional
                transportation should be clear, accountable, and easy to work
                with. We focus on Texas, so your lanes get the attention they
                deserve.
              </p>
              <a href="#standard" className="text-link">
                The Prime Path standard
                <ArrowUpRight size={19} />
              </a>
            </div>
          </div>
          <div className="container principles">
            {[
              [
                "Focused on Texas.",
                "A regional approach to the markets that matter to you.",
              ],
              [
                "Built around your lanes.",
                "A transportation plan that starts with your operation.",
              ],
              [
                "Clear from the start.",
                "Defined expectations, direct communication, shared priorities.",
              ],
            ].map(([title, body], i) => (
              <div className="reveal" key={title}>
                <span className="principle-number">0{i + 1} /</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="solutions" className="solutions section-pad">
          <div className="container">
            <div className="section-heading reveal">
              <div>
                <Label>TRANSPORTATION SOLUTIONS</Label>
                <h2>
                  Your freight.
                  <br />
                  Our focus.
                </h2>
              </div>
              <p>
                From a single Texas lane to a recurring freight program, the
                right move starts with understanding your business.
              </p>
            </div>
            <div className="service-grid">
              {services.map((item) => (
                <article className="service-card reveal" key={item.n}>
                  <div className="service-image">
                    <img
                      src={`/media/${item.image}.webp`}
                      alt={`${item.title}: Prime Path branded day-cab concept photography`}
                      loading="lazy"
                      width="800"
                      height="540"
                    />
                    <span>{item.n}</span>
                  </div>
                  <div className="service-content">
                    <h3>{item.title}</h3>
                    <p className="service-subtitle">{item.subtitle}</p>
                    <p>{item.text}</p>
                    <details>
                      <summary>
                        Explore the solution
                        <Plus size={18} />
                      </summary>
                      <ul>
                        {item.details.map((d) => (
                          <li key={d}>
                            <Check size={15} />
                            {d}
                          </li>
                        ))}
                      </ul>
                      <button
                        className="text-link"
                        onClick={() => startQuote(item.service)}
                      >
                        Discuss this service
                        <ArrowRight size={17} />
                      </button>
                    </details>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="network" className="network section-pad">
          <div className="container network-grid">
            <div className="network-copy reveal">
              <Label light>OUR TEXAS NETWORK</Label>
              <h2>
                One state.
                <br />
                <span>Endless momentum.</span>
              </h2>
              <p>
                From North Texas distribution centers to Houston industry and
                the I-35 corridor, we’re building connections around the places
                your freight needs to go.
              </p>
              <div
                className="city-tabs"
                role="tablist"
                aria-label="Explore Texas markets"
              >
                {cities.map((c, i) => (
                  <button
                    id={`city-tab-${i}`}
                    key={c.short}
                    role="tab"
                    aria-controls="city-panel"
                    aria-selected={activeCity === i}
                    tabIndex={activeCity === i ? 0 : -1}
                    onClick={() => setActiveCity(i)}
                    onKeyDown={(e) => {
                      let n = i;
                      if (e.key === "ArrowRight") n = (i + 1) % 4;
                      else if (e.key === "ArrowLeft") n = (i + 3) % 4;
                      else if (e.key === "Home") n = 0;
                      else if (e.key === "End") n = 3;
                      else return;
                      e.preventDefault();
                      setActiveCity(n);
                      document.getElementById(`city-tab-${n}`)?.focus();
                    }}
                  >
                    {c.short}
                  </button>
                ))}
              </div>
              <div
                id="city-panel"
                className="city-panel"
                role="tabpanel"
                aria-labelledby={`city-tab-${activeCity}`}
              >
                <p className="city-corridor">{city.corridor}</p>
                <h3>{city.name}</h3>
                <p>{city.text}</p>
                <div className="lane-chips">
                  {city.lanes.map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </div>
                <button
                  className="text-link text-link-light"
                  onClick={() => startQuote(undefined, city.name)}
                >
                  Discuss a lane from {city.short}
                  <ArrowUpRight size={18} />
                </button>
              </div>
              <p className="network-note">
                Illustrative lanes. Equipment, schedule, and availability are
                confirmed with each quote.
              </p>
            </div>
            <div className="network-map reveal">
              <span className="map-coordinate">
                31.0000° N &nbsp; 100.0000° W
              </span>
              <svg
                className="texas-map"
                viewBox="0 0 650 600"
                role="img"
                aria-label="Illustrative Texas network connecting Dallas–Fort Worth, Houston, Austin, and San Antonio"
              >
                <defs>
                  <pattern
                    id="grid"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="1" cy="1" r=".8" fill="#29455d" />
                  </pattern>
                  <linearGradient id="texas-fill">
                    <stop stopColor="#173a55" />
                    <stop offset="1" stopColor="#0d263e" />
                  </linearGradient>
                </defs>
                <rect width="650" height="600" fill="url(#grid)" />
                <path
                  d="M211 54H350V147L376 153 389 146 408 160 428 151 449 166 468 159 486 174 509 168 527 181 550 173 559 212 556 245 572 277 571 304 590 328 566 357 546 371 526 396 502 412 480 424 460 449 440 470 423 488 409 514 400 548 366 536 349 516 342 485 322 461 305 438 289 409 270 380 247 371 232 350 207 341 182 352 166 373 142 365 121 346 108 325 82 307 65 280 38 265 29 235H211Z"
                  fill="url(#texas-fill)"
                  stroke="#476782"
                  strokeWidth="1.2"
                />
                <path
                  className="map-route"
                  d="M389 216 366 348 335 393M389 216 474 352M335 393 474 352M366 348 474 352"
                />
                <path
                  className="map-route route-soft"
                  d="M92 285 244 295 366 348M283 104 295 224 389 216M335 393 361 484"
                />
                <text x="215" y="243" className="map-state-label">
                  TEXAS
                </text>
                <g className="interstate-label">
                  <rect x="390" y="280" width="37" height="24" rx="4" />
                  <text x="408.5" y="296">
                    I-45
                  </text>
                  <rect x="320" y="276" width="37" height="24" rx="4" />
                  <text x="338.5" y="292">
                    I-35
                  </text>
                  <rect x="406" y="382" width="37" height="24" rx="4" />
                  <text x="424.5" y="398">
                    I-10
                  </text>
                </g>
                {cities.map((c, i) => (
                  <g
                    key={c.short}
                    className={`map-point ${activeCity === i ? "map-point-active" : ""}`}
                  >
                    <circle
                      className="map-halo"
                      cx={c.x}
                      cy={c.y}
                      r={activeCity === i ? 19 : 12}
                    />
                    <circle className="map-dot" cx={c.x} cy={c.y} r="5" />
                    <text x={c.lx} y={c.ly} className="map-city-name">
                      {c.short === "DFW"
                        ? "DALLAS–FORT WORTH"
                        : c.name.toUpperCase()}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="map-legend">
                <span />
                <p>Texas is the plan.</p>
                <i />
                <p>City to city.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="standard" className="standard section-pad">
          <div className="container standard-grid">
            <div className="standard-photo reveal">
              <img
                src="/media/detail.webp"
                loading="lazy"
                width="1200"
                height="800"
                alt="Prime Path branding on a white day cab beside a Texas road"
              />
              <div className="photo-caption">
                <span>THE PRIME PATH STANDARD</span>
                <p>
                  Every detail.
                  <br />
                  Moving in the right direction.
                </p>
              </div>
            </div>
            <div className="standard-copy reveal">
              <Label>HOW WE WORK</Label>
              <h2>
                High expectations.
                <br />
                Shared.
              </h2>
              <p className="standard-intro">
                Your shipment is part of a bigger commitment. To your customers.
                To your schedule. To your business. We build the transportation
                plan with that in mind.
              </p>
              {[
                [
                  "Understand the operation.",
                  "We start with your lanes, shipment profile, dock requirements, and delivery windows.",
                ],
                [
                  "Set a clear plan.",
                  "Equipment, timing, pricing, and communication are defined before the move.",
                ],
                [
                  "Stay accountable.",
                  "Direct contact, clear check-ins, and a shared understanding of what a successful delivery looks like.",
                ],
              ].map(([title, body], i) => (
                <div className="standard-item" key={title}>
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </div>
              ))}
              <a href="#quote" className="text-link">
                Build your freight plan
                <ArrowUpRight size={19} />
              </a>
            </div>
          </div>
        </section>
        <div className="business-band">
          <div className="container">
            <Label light>THE BUSINESSES THAT MOVE TEXAS</Label>
            <div>
              <span>Manufacturing</span>
              <span>Distribution</span>
              <span>Retail &amp; wholesale</span>
              <span>Building materials</span>
            </div>
          </div>
        </div>
        <section className="film-section" aria-labelledby="film-heading">
          <img
            src="/media/operations.webp"
            alt="Branded Prime Path day cabs at a modern distribution center"
            loading="lazy"
            width="1600"
            height="1067"
          />
          <div className="film-shade" />
          <div className="container film-content">
            <Label light>THIS IS PRIME PATH</Label>
            <h2 id="film-heading">
              Built to move.
              <br />
              Driven to connect.
            </h2>
            <button className="film-button" onClick={() => setFilmOpen(true)}>
              <span className="play-ring play-ring-large">
                <Play size={21} fill="currentColor" />
              </span>
              <span>
                Watch the brand film
                <small>Connecting Texas. City to City</small>
              </span>
            </button>
          </div>
        </section>

        <section id="quote" className="quote section-pad">
          <div className="container quote-grid">
            <div className="quote-copy reveal">
              <Label>LET’S TALK FREIGHT</Label>
              <h2>
                Your next move
                <br />
                starts here.
              </h2>
              <p>
                Tell us what you need to move, where it’s going, and what a good
                transportation partner looks like to you.
              </p>
              <p>We’ll start with the details and build from there.</p>
              <a className="contact-phone" href={`tel:${site.phone}`}>
                {site.phoneDisplay}
                <ArrowUpRight size={25} />
              </a>
              <p className="contact-location">
                Dallas–Fort Worth, Texas
                <br />
                Connecting businesses across the state.
              </p>
              <div className="quote-assurance">
                <span>
                  <Check size={16} />A conversation, not a commitment.
                </span>
                <span>
                  <Check size={16} />A plan based on your actual freight.
                </span>
              </div>
            </div>
            <div className="quote-form-wrap reveal">
              <div className="form-heading">
                <h3>Tell us about your lane.</h3>
                <p>A few details help us get the conversation moving.</p>
              </div>
              <form className="quote-form" onSubmit={submitQuote}>
                <div className="honeypot" aria-hidden="true">
                  <label>
                    Website
                    <input name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Your name *
                    <input
                      name="name"
                      autoComplete="name"
                      placeholder="First and last name"
                      required
                      maxLength={120}
                    />
                  </label>
                  <label>
                    Company *
                    <input
                      name="company"
                      autoComplete="organization"
                      placeholder="Company name"
                      required
                      maxLength={160}
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Work email *
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      required
                      maxLength={254}
                    />
                  </label>
                  <label>
                    Phone
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="(555) 000-0000"
                      maxLength={40}
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Origin *
                    <input
                      name="origin"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="City or ZIP in Texas"
                      required
                      maxLength={120}
                    />
                  </label>
                  <label>
                    Destination *
                    <input
                      name="destination"
                      placeholder="City or ZIP in Texas"
                      required
                      maxLength={120}
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Service *
                    <span className="select-wrap">
                      <select
                        name="service"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Select a solution
                        </option>
                        <option>Dedicated trucking</option>
                        <option>Regional truckload</option>
                        <option>Power-only</option>
                        <option>Let’s discuss my needs</option>
                      </select>
                      <ChevronDown size={16} />
                    </span>
                  </label>
                  <label>
                    Frequency
                    <span className="select-wrap">
                      <select name="frequency" defaultValue="To be discussed">
                        <option>To be discussed</option>
                        <option>One-time shipment</option>
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Recurring / contract</option>
                      </select>
                      <ChevronDown size={16} />
                    </span>
                  </label>
                </div>
                <label>
                  Target pickup date
                  <input name="date" type="date" />
                </label>
                <label>
                  What should we know?
                  <textarea
                    name="details"
                    placeholder="Freight type, trailer needs, approximate weight, delivery windows, or anything else that matters."
                    rows={3}
                    maxLength={3000}
                  />
                </label>
                <label className="consent">
                  <input type="checkbox" name="consent" required />
                  <span>
                    I agree to be contacted about this inquiry and have read the{" "}
                    <a href="/privacy">privacy notice</a>.
                  </span>
                </label>
                <button
                  className="button button-blue form-submit"
                  type="submit"
                  disabled={formStatus === "sending" || formStatus === "sent"}
                >
                  {formStatus === "sending"
                    ? "Preparing your request…"
                    : formStatus === "sent"
                      ? "Request received"
                      : "Prepare my freight request"}
                  {formStatus === "sent" ? (
                    <Check size={19} />
                  ) : (
                    <ArrowUpRight size={19} />
                  )}
                </button>
                <p className="form-footnote">
                  All service is subject to lane, equipment, and schedule
                  confirmation.
                </p>
                {formStatus === "sent" && (
                  <div role="status" className="form-result success">
                    <Check size={20} />
                    <div>
                      <strong>Your freight request is on its way.</strong>
                      <p>
                        We’ll follow up using the contact details you provided.
                      </p>
                    </div>
                  </div>
                )}
                {(formStatus === "draft" || formStatus === "error") && (
                  <div role="status" className="form-result">
                    <div>
                      <strong>
                        {formStatus === "error"
                          ? "Let’s finish your request by email."
                          : "Your lane details are ready."}
                      </strong>
                      <p>
                        {formStatus === "error"
                          ? formError
                          : "Open the prepared email, then send it to start the conversation. Your inquiry has not been sent yet."}
                      </p>
                      <a href={draftUrl} className="button button-small">
                        Open email draft
                        <ArrowUpRight size={16} />
                      </a>
                      <button
                        type="button"
                        className="copy-button"
                        onClick={copyDetails}
                      >
                        {copied ? "Details copied" : "Copy details instead"}
                      </button>
                      <p className="draft-recipient">
                        Send to{" "}
                        <a href={`mailto:${site.email}`}>{site.email}</a>
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

        <section className="faq section-pad">
          <div className="container faq-grid">
            <div>
              <Label>BEFORE WE GET ROLLING</Label>
              <h2>
                A few good
                <br />
                questions.
              </h2>
            </div>
            <div className="faq-list">
              {questions.map(([q, a]) => (
                <details key={q}>
                  <summary>
                    {q}
                    <Plus size={19} />
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <Brand light />
            <a href="#quote" className="footer-callout">
              Let’s connect.
              <ArrowUpRight />
            </a>
          </div>
          <div className="footer-middle">
            <p>
              Connecting Texas.
              <br />
              City to City.
            </p>
            <nav aria-label="Footer navigation">
              <a href="#solutions">Solutions</a>
              <a href="#network">Texas network</a>
              <a href="#standard">Our standard</a>
              <a href="#quote">Start a conversation</a>
            </nav>
            <div className="footer-contact">
              <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
              <a href={`mailto:${site.email}`}>
                Email our team
                <ArrowUpRight size={15} />
              </a>
              <span>Dallas–Fort Worth, Texas</span>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              © {new Date().getFullYear()} Prime Path Trucking &amp; Logistics.
            </p>
            <div>
              <span>Fleet visuals are brand concepts.</span>
              <a href="/privacy">Privacy</a>
              <a href="#main">Back to top ↑</a>
            </div>
          </div>
        </div>
      </footer>
      <dialog
        ref={filmRef}
        className="film-dialog"
        aria-labelledby="film-dialog-title"
        onCancel={() => setFilmOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setFilmOpen(false);
        }}
      >
        <button
          className="film-close"
          aria-label="Close brand film"
          onClick={() => setFilmOpen(false)}
        >
          <X />
        </button>
        {filmOpen && (
          <>
            <video
              src="/media/prime-path-film.mp4"
              poster="/media/hero.webp"
              controls
              autoPlay
              playsInline
              preload="metadata"
            />
            <div className="film-dialog-caption">
              <h2 id="film-dialog-title">Connecting Texas. City to City</h2>
              <p>
                A Prime Path brand film · Created from concept fleet imagery.
              </p>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
