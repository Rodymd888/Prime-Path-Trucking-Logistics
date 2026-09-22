"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Menu,
  Pause,
  Phone,
  Play,
  Plus,
  X,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { QuoteForm } from "@/components/QuoteForm";
import { fleet, markets, type QuotePreset } from "@/lib/fleet";
import { site } from "@/lib/site";

const solutions = [
  {
    number: "01",
    title: "Dedicated routes",
    subtitle: "Make your recurring freight repeatable.",
    description:
      "Bring your schedule, shipping locations, and expected volume. We’ll work through an equipment and transportation plan around the way your business operates.",
    tags: ["Recurring routes", "Facility shuttles", "Distribution programs"],
    service: "Dedicated routes",
  },
  {
    number: "02",
    title: "Local & regional delivery",
    subtitle: "From the loading dock to the next opportunity.",
    description:
      "Connect Texas businesses with the right vehicle for the shipment. Day cabs, box trucks, and cargo vans make room for different load sizes and delivery environments.",
    tags: [
      "City-to-city freight",
      "Commercial deliveries",
      "Pallets & smaller loads",
    ],
    service: "Local & regional delivery",
  },
  {
    number: "03",
    title: "Time-sensitive freight",
    subtitle: "When the timing is part of the job.",
    description:
      "For parts, supplies, and business freight with a tight delivery window, start with the details. We’ll review your lane, equipment needs, and timing before confirming the move.",
    tags: ["Priority inquiries", "Direct routes", "Shipment-specific planning"],
    service: "Time-sensitive freight",
  },
];
const questions = [
  [
    "What vehicles does Prime Path operate?",
    "Our equipment includes day cabs, box trucks, and cargo vans. Day cabs support regional truckload and trailer movements; box trucks serve commercial and palletized deliveries; cargo vans support smaller business shipments. Tell us about the load so we can discuss the right vehicle.",
  ],
  [
    "Do you operate outside Texas?",
    "Our focus is transportation within Texas. We connect Dallas–Fort Worth, Houston, Austin, San Antonio, and surrounding markets. Share your pickup and delivery locations so we can review the lane.",
  ],
  [
    "Can you support recurring routes or a dedicated program?",
    "Yes. We welcome inquiries for recurring routes, facility shuttles, and dedicated freight programs. Include your expected volume, schedule, shipment profile, and proposed start date.",
  ],
  [
    "What should I include in a freight request?",
    "Include the origin and destination, freight type, weight and dimensions, pallet or piece count, pickup date, delivery window, and loading requirements. Tell us if you need liftgate service or other equipment so availability can be reviewed.",
  ],
  [
    "How do I know which equipment to choose?",
    "Select “Help me choose” in the form. We’ll use your freight dimensions, weight, loading needs, and route to discuss an appropriate vehicle. Payloads, equipment features, pricing, and availability are confirmed for your shipment.",
  ],
];

function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p className={light ? "eyebrow light" : "eyebrow"}>
      <span />
      {children}
    </p>
  );
}

function TexasMap({ active }: { active: number }) {
  const selected = markets[active];
  return (
    <svg
      viewBox="0 0 650 600"
      className="texas-map"
      role="img"
      aria-label={
        "Illustrative Texas freight connections from " + selected.name
      }
    >
      <defs>
        <pattern
          id="map-grid"
          width="26"
          height="26"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r=".8" fill="#33516a" />
        </pattern>
        <linearGradient id="state-fill">
          <stop stopColor="#183b58" />
          <stop offset="1" stopColor="#0c2843" />
        </linearGradient>
      </defs>
      <rect width="650" height="600" fill="url(#map-grid)" />
      <path
        d="M211 54H350V147L376 153 389 146 408 160 428 151 449 166 468 159 486 174 509 168 527 181 550 173 559 212 556 245 572 277 571 304 590 328 566 357 546 371 526 396 502 412 480 424 460 449 440 470 423 488 409 514 400 548 366 536 349 516 342 485 322 461 305 438 289 409 270 380 247 371 232 350 207 341 182 352 166 373 142 365 121 346 108 325 82 307 65 280 38 265 29 235H211Z"
        fill="url(#state-fill)"
        stroke="#41627e"
        strokeWidth="1.1"
      />
      <text x="192" y="258" className="map-state">
        TEXAS
      </text>
      {markets.map(
        (market, index) =>
          index !== active && (
            <line
              key={market.id}
              x1={selected.x}
              y1={selected.y}
              x2={market.x}
              y2={market.y}
              className="map-route"
            />
          ),
      )}
      {markets.map((market, index) => (
        <g
          key={market.id}
          className={index === active ? "map-place selected" : "map-place"}
        >
          <circle
            className="map-halo"
            cx={market.x}
            cy={market.y}
            r={index === active ? 19 : 11}
          />
          <circle className="map-dot" cx={market.x} cy={market.y} r="5" />
          <text x={market.lx} y={market.ly}>
            {market.id === "DFW"
              ? "DALLAS–FORT WORTH"
              : market.name.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [activeMarket, setActiveMarket] = useState(0);
  const [preset, setPreset] = useState<QuotePreset | null>(null);
  const [filmOpen, setFilmOpen] = useState(false);
  const [motion, setMotion] = useState(false);
  const [playing, setPlaying] = useState(true);
  const video = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const playTrigger = useRef<HTMLButtonElement | null>(null);
  const market = markets[activeMarket];

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 761px)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const update = () =>
      setMotion(!reduced.matches && desktop.matches && !connection?.saveData);
    update();
    reduced.addEventListener("change", update);
    desktop.addEventListener("change", update);
    return () => {
      reduced.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
    };
  }, []);
  useEffect(() => {
    if (motion && playing) video.current?.play().catch(() => setPlaying(false));
    else video.current?.pause();
  }, [motion, playing]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    const current = dialog.current;
    if (!current) return;
    if (filmOpen && !current.open) current.showModal();
    if (!filmOpen && current.open) {
      current.close();
      playTrigger.current?.focus();
    }
    if (!filmOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [filmOpen]);
  function quote(next: Omit<QuotePreset, "key"> = {}) {
    setPreset({ ...next, key: Date.now() });
    setMenu(false);
    document
      .getElementById("quote")
      ?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
  }
  function openFilm(trigger: HTMLButtonElement) {
    playTrigger.current = trigger;
    setFilmOpen(true);
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="utility-bar">
        <div className="container">
          <span>
            <i />
            TEXAS BASED. BUSINESS FOCUSED.
          </span>
          <a href={"tel:" + site.phone}>
            Let’s talk freight <span>{site.phoneDisplay}</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <header className="site-header">
        <div className="container navigation">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#fleet">Our fleet</a>
            <a href="#solutions">Solutions</a>
            <a href="#texas">Texas reach</a>
            <a href="#standard">Our standard</a>
          </nav>
          <a className="button nav-quote" href="#quote">
            Get a quote
            <ArrowUpRight size={17} />
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            aria-controls="mobile-navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        {menu && (
          <nav
            className="mobile-nav"
            id="mobile-navigation"
            aria-label="Mobile navigation"
          >
            {[
              ["Our fleet", "fleet"],
              ["Solutions", "solutions"],
              ["Texas reach", "texas"],
              ["Our standard", "standard"],
              ["Get a quote", "quote"],
            ].map(([name, id]) => (
              <a key={id} href={"#" + id} onClick={() => setMenu(false)}>
                {name}
                <ArrowUpRight size={20} />
              </a>
            ))}
            <a href={"tel:" + site.phone}>
              {site.phoneDisplay}
              <Phone size={18} />
            </a>
          </nav>
        )}
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="container hero-intro">
            <div>
              <Eyebrow>FREIGHT, WITH DIRECTION.</Eyebrow>
              <h1 id="hero-heading">
                Texas freight.
                <br />
                <span>Handled.</span>
              </h1>
            </div>
            <div className="hero-aside">
              <p className="hero-equipment">
                Day cabs. Box trucks. Cargo vans.
              </p>
              <p>
                Three ways to move your freight.
                <br />
                One partner focused on the details.
              </p>
              <a href="#quote" className="button blue">
                Let’s move your freight
                <ArrowUpRight size={20} />
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <img
              className="hero-photo"
              src="/media/fleet-hero.webp"
              alt="Prime Path fleet concept showing a day-cab semi, a box truck, and a cargo van together"
              width="1774"
              height="887"
              fetchPriority="high"
            />
            {motion && (
              <video
                ref={video}
                className="hero-video"
                autoPlay
                muted
                playsInline
                loop
                preload="none"
                poster="/media/fleet-hero.webp"
                aria-hidden="true"
                onError={() => setMotion(false)}
              >
                <source src="/media/fleet-loop.mp4" type="video/mp4" />
              </video>
            )}
            <div className="hero-photo-shade" />
            <div className="hero-photo-caption">
              <p>
                Connecting Texas.
                <br />
                <strong>City to City.</strong>
              </p>
              <div className="hero-video-controls">
                <button
                  className="watch-button"
                  onClick={(event) => openFilm(event.currentTarget)}
                >
                  <span>
                    <Play size={15} fill="currentColor" />
                  </span>
                  Meet the fleet
                </button>
                {motion && (
                  <button
                    className="motion-toggle"
                    onClick={() => setPlaying(!playing)}
                    aria-label={
                      playing
                        ? "Pause background video"
                        : "Play background video"
                    }
                  >
                    {playing ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="fleet-directory container">
            {fleet.map((item) => (
              <a href={"#" + item.id} key={item.id}>
                <span>{item.number}</span>
                <strong>{item.name}</strong>
                <ArrowDown size={19} />
              </a>
            ))}
          </div>
        </section>

        <section className="fleet-section section-space" id="fleet">
          <div className="container">
            <div className="section-heading">
              <div>
                <Eyebrow>THE PRIME PATH FLEET</Eyebrow>
                <h2>
                  Different loads.
                  <br />
                  The same high standard.
                </h2>
              </div>
              <p>
                From a full trailer to your next critical delivery, we operate
                the equipment to match the way your business moves.
              </p>
            </div>
            <div className="fleet-grid">
              {fleet.map((item) => (
                <article className="fleet-card" id={item.id} key={item.id}>
                  <div className="fleet-image">
                    <img
                      src={"/media/" + item.image + ".webp"}
                      alt={
                        "White Prime Path " +
                        item.equipment.toLowerCase() +
                        " with navy and blue company branding"
                      }
                      width="1400"
                      height="933"
                      loading="lazy"
                    />
                    <span>{item.number} /</span>
                  </div>
                  <div className="fleet-card-body">
                    <p className="fleet-category">{item.category}</p>
                    <h3>{item.name}</h3>
                    <p className="fleet-card-title">{item.title}</p>
                    <p className="fleet-description">{item.description}</p>
                    <ul>
                      {item.capabilities.map((capability) => (
                        <li key={capability}>
                          <Check size={15} />
                          {capability}
                        </li>
                      ))}
                    </ul>
                    <button
                      className="fleet-quote"
                      onClick={() =>
                        quote({
                          equipment: item.equipment,
                          service: item.service,
                        })
                      }
                    >
                      Request a {item.equipment.toLowerCase()}
                      <ArrowUpRight size={19} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="fleet-help">
              <p>Not sure which vehicle fits your shipment?</p>
              <button
                onClick={() => quote({ equipment: "Help me choose" })}
                className="text-link"
              >
                Let’s work it out together
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        <section className="network-section section-space" id="texas">
          <div className="container network-layout">
            <div className="network-copy">
              <Eyebrow light>ONE STATE. REAL CONNECTIONS.</Eyebrow>
              <h2>
                Texas is big.
                <br />
                <span>We bring it closer.</span>
              </h2>
              <p>
                Local deliveries. Regional lanes. The connections between them.
                Prime Path keeps the focus on Texas—and on the businesses that
                keep it moving.
              </p>
              <div
                className="market-tabs"
                role="tablist"
                aria-label="Explore Texas markets"
              >
                {markets.map((item, index) => (
                  <button
                    role="tab"
                    id={"market-" + item.id}
                    aria-controls="market-panel"
                    aria-selected={index === activeMarket}
                    tabIndex={index === activeMarket ? 0 : -1}
                    key={item.id}
                    onClick={() => setActiveMarket(index)}
                    onKeyDown={(event) => {
                      let next = index;
                      if (event.key === "ArrowRight") next = (index + 1) % 4;
                      else if (event.key === "ArrowLeft")
                        next = (index + 3) % 4;
                      else if (event.key === "Home") next = 0;
                      else if (event.key === "End") next = 3;
                      else return;
                      event.preventDefault();
                      setActiveMarket(next);
                      document
                        .getElementById("market-" + markets[next].id)
                        ?.focus();
                    }}
                  >
                    {item.id}
                  </button>
                ))}
              </div>
              <div
                className="market-panel"
                id="market-panel"
                role="tabpanel"
                aria-labelledby={"market-" + market.id}
              >
                <p className="market-region">{market.region}</p>
                <h3>{market.name}</h3>
                <p>{market.description}</p>
                <div className="lane-list">
                  {market.lanes.map((lane) => (
                    <span key={lane}>{lane}</span>
                  ))}
                </div>
                <button
                  className="text-link on-dark"
                  onClick={() => quote({ origin: market.name })}
                >
                  Discuss your {market.id} lane
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
            <div className="map-panel">
              <div className="map-topline">
                <span>OUR TEXAS FOCUS</span>
                <span>DAY CABS / BOX TRUCKS / CARGO VANS</span>
              </div>
              <TexasMap active={activeMarket} />
              <div className="map-footer">
                <span>
                  <i />
                  Connected by a clear plan.
                </span>
                <p>
                  Illustrative routes. Availability is confirmed for each
                  request.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="solutions-section section-space" id="solutions">
          <div className="container solutions-layout">
            <div className="solutions-intro">
              <Eyebrow>BUILT AROUND YOUR BUSINESS</Eyebrow>
              <h2>
                The right move.
                <br />
                For your operation.
              </h2>
              <p>
                Good transportation starts before the engine does. We align the
                vehicle, the route, and the details around what you need to
                accomplish.
              </p>
              <a href="#quote" className="text-link">
                Find your solution
                <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="solution-list">
              {solutions.map((solution, index) => (
                <details
                  key={solution.title}
                  className="solution"
                  open={index === 0 ? true : undefined}
                >
                  <summary>
                    <span>{solution.number}</span>
                    <h3>{solution.title}</h3>
                    <Plus size={21} />
                  </summary>
                  <div className="solution-body">
                    <h4>{solution.subtitle}</h4>
                    <p>{solution.description}</p>
                    <div className="solution-tags">
                      {solution.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <button
                      className="text-link"
                      onClick={() => quote({ service: solution.service })}
                    >
                      Discuss this service
                      <ArrowUpRight size={17} />
                    </button>
                  </div>
                </details>
              ))}
            </div>
          </div>
          <div className="container industry-strip">
            <p>FOR THE BUSINESSES THAT MOVE TEXAS</p>
            <div>
              <span>Manufacturing</span>
              <span>Distribution</span>
              <span>Retail & wholesale</span>
              <span>Commercial supply</span>
            </div>
          </div>
        </section>

        <section className="standard-section section-space" id="standard">
          <div className="container standard-layout">
            <div className="standard-photo">
              <img
                src="/media/cargo-van.webp"
                width="1400"
                height="933"
                loading="lazy"
                alt="Prime Path cargo van outside a Texas commercial building"
              />
              <div className="standard-photo-label">
                <span>PRIME PATH TRUCKING & LOGISTICS</span>
                <p>
                  Every shipment.
                  <br />A business behind it.
                </p>
              </div>
            </div>
            <div className="standard-copy">
              <Eyebrow>THE PRIME PATH STANDARD</Eyebrow>
              <h2>
                We see more
                <br />
                than the load.
              </h2>
              <p className="standard-lead">
                We see the order your customer is waiting on. The parts that
                keep a business running. The promise you made to deliver.
              </p>
              <p>
                That’s why our approach is straightforward: understand the job,
                agree on the plan, and keep the communication clear.
              </p>
              <div className="standards">
                {[
                  [
                    "The right equipment.",
                    "Day cabs, box trucks, and cargo vans—selected around your shipment and delivery requirements.",
                  ],
                  [
                    "A plan you understand.",
                    "Clear expectations for the lane, timing, loading requirements, and price before the move.",
                  ],
                  [
                    "A direct connection.",
                    "A conversation with the team about your freight, your priorities, and what a good outcome looks like.",
                  ],
                ].map(([title, body], index) => (
                  <div key={title}>
                    <span>0{index + 1}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="#quote" className="text-link">
                Let’s build your freight plan
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </section>

        <section className="brand-film-section">
          <div className="container brand-film-layout">
            <div>
              <Eyebrow light>THREE WAYS FORWARD</Eyebrow>
              <h2>
                More ways to move.
                <br />
                One Prime Path.
              </h2>
              <p>
                Day cabs. Box trucks. Cargo vans.
                <br />
                Connecting Texas. City to City.
              </p>
            </div>
            <button
              className="film-cover"
              onClick={(event) => openFilm(event.currentTarget)}
              aria-label="Watch the Prime Path fleet film"
            >
              <img
                src="/media/fleet-hero.webp"
                alt=""
                width="1774"
                height="887"
                loading="lazy"
              />
              <span className="film-play">
                <Play size={24} fill="currentColor" />
              </span>
              <span className="film-cover-caption">
                MEET THE PRIME PATH FLEET <ArrowUpRight size={18} />
              </span>
            </button>
          </div>
        </section>

        <section className="quote-section section-space" id="quote">
          <div className="container quote-layout">
            <div className="quote-copy">
              <Eyebrow>LET’S GET YOUR FREIGHT MOVING</Eyebrow>
              <h2>
                Your next move
                <br />
                <span>starts here.</span>
              </h2>
              <p>
                One shipment or an ongoing program. A day cab, a box truck, or a
                cargo van. Tell us what your operation needs.
              </p>
              <div className="quote-call">
                <span>PREFER A CONVERSATION?</span>
                <a href={"tel:" + site.phone}>
                  {site.phoneDisplay}
                  <ArrowUpRight size={24} />
                </a>
                <a className="quote-email" href={"mailto:" + site.email}>
                  Email the Prime Path team
                  <ArrowUpRight size={15} />
                </a>
              </div>
              <div className="quote-promise">
                <span>
                  <Check size={16} />
                  Freight planning for Texas businesses
                </span>
                <span>
                  <Check size={16} />
                  Equipment matched to your requirements
                </span>
                <span>
                  <Check size={16} />
                  Clear next steps before a commitment
                </span>
              </div>
              <p className="quote-base">DALLAS–FORT WORTH, TEXAS</p>
            </div>
            <QuoteForm preset={preset} />
          </div>
        </section>

        <section className="faq-section section-space">
          <div className="container faq-layout">
            <div>
              <Eyebrow>A FEW THINGS TO KNOW</Eyebrow>
              <h2>
                Before we
                <br />
                get rolling.
              </h2>
            </div>
            <div className="faq-list">
              {questions.map(([question, answer]) => (
                <details key={question}>
                  <summary>
                    {question}
                    <Plus size={20} />
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <div className="closing-line">
          <div className="container">
            <p>
              Connecting Texas. <span>City to City.</span>
            </p>
            <a href="#quote" aria-label="Start a freight inquiry">
              <ArrowUpRight size={40} />
            </a>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-main">
            <div>
              <Brand />
              <p>
                Day cabs. Box trucks. Cargo vans.
                <br />A clear path for your Texas freight.
              </p>
            </div>
            <nav aria-label="Footer navigation">
              <a href="#fleet">Our fleet</a>
              <a href="#solutions">Solutions</a>
              <a href="#texas">Texas reach</a>
              <a href="#standard">Our standard</a>
            </nav>
            <div className="footer-contact">
              <a href={"tel:" + site.phone}>{site.phoneDisplay}</a>
              <a href={"mailto:" + site.email}>
                Email our team
                <ArrowUpRight size={15} />
              </a>
              <span>Dallas–Fort Worth, Texas</span>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              © {new Date().getFullYear()} Prime Path Trucking & Logistics.
            </p>
            <span>Fleet imagery is a brand concept.</span>
            <a href="/privacy">Privacy</a>
            <a href="#main">Back to top ↑</a>
          </div>
        </div>
      </footer>

      <dialog
        ref={dialog}
        className="film-dialog"
        aria-labelledby="film-title"
        onCancel={() => setFilmOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setFilmOpen(false);
        }}
      >
        <button
          type="button"
          className="film-close"
          aria-label="Close fleet film"
          onClick={() => setFilmOpen(false)}
        >
          <X size={22} />
        </button>
        {filmOpen && (
          <>
            <video
              src="/media/fleet-film.mp4"
              poster="/media/fleet-hero.webp"
              controls
              autoPlay
              playsInline
              preload="metadata"
            />
            <div className="film-dialog-copy">
              <h2 id="film-title">Three ways to move. One Prime Path.</h2>
              <p>Day Cabs · Box Trucks · Cargo Vans</p>
              <small>
                A motion piece created from concept fleet photography.
              </small>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
