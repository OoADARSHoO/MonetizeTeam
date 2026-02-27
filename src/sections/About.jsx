import { useState, useEffect, useRef, useCallback } from "react";

// ─── Static data outside component — never re-allocated on render ───────────

const WHO_CARDS = [
  {
    num: "01",
    title: "The Ones Who See",
    body: "We look beyond surface-level metrics and study how your content performs, how your audience reacts, and where attention is building — revealing opportunities to refine your strategy and unlock your next stage of growth.",
  },
  {
    num: "02",
    title: "The Ones Who Build",
    body: "Once we see the gap, we build the bridge. Products, launch sequences, demand tests — all engineered for your specific audience, in your voice, under your name. You post. We architect.",
  },
  {
    num: "03",
    title: "The Ones Who Stay Hidden",
    body: "You're the face. We're the engine. We have no interest in the spotlight. Our job is to make sure every connection your audience was always ready to make — actually happens through you.",
  },
];

const STEPS = [
  {
    n: "01",
    action: "We audit your audience",
    detail:
      "Follower count, engagement, content themes — we map the exact value sitting untapped in your account right now.",
  },
  {
    n: "02",
    action: "We design your product",
    detail:
      "We build a digital product your audience actually wants — tailored to what they already trust you on.",
  },
  {
    n: "03",
    action: "We test demand before building",
    detail:
      "Three Instagram Stories. We post a demand test to your audience. If they respond, we build. Zero risk to you.",
  },
  {
    n: "04",
    action: "We launch it in 14 days",
    detail:
      "A proven launch sequence, built by us, posted by you. We handle every touchpoint. You watch the notifications come in.",
  },
];

const PILLS = [
  "No upfront investment",
  "No long-term contracts",
  "No showing your face",
  "No product expertise needed",
  "No audience building required",
  "True collaboration",
];

const STATS = [
  ["Equal", "True Collaboration"],
  ["14 Days", "To First Reveal"],
  ["Zero", "Initial Effort Needed"],
  ["∞", "Growth Possibilities"],
];

// Duplicated once for seamless CSS marquee loop
const MARQ_ITEMS = [
  "We See Gaps",
  "◆",
  "We Build Products",
  "◆",
  "We Launch Fast",
  "◆",
  "We Share The Vision",
  "◆",
  "You Keep Your Brand",
  "◆",
  "We Stay Invisible",
  "◆",
  "Results Do The Talking",
  "◆",
];

// ─── Stable style objects — defined once, never re-created ──────────────────

const rootStyle = {
  fontFamily: "'Google Sans', sans-serif",
  background: "#07070c",
  color: "#ede9e0",
  minHeight: "100vh",
  overflowX: "hidden",
};

const processSectionStyle = {
  borderTop: "1px solid rgba(255,255,255,0.07)",
  borderBottom: "1px solid rgba(255,255,255,0.07)",
  background: "rgba(108,92,231,0.025)",
};

const marqTrackStyle = { display: "flex", gap: "52px", alignItems: "center" };
const dealBodyStyle = { display: "flex", flexDirection: "column", gap: "5px" };

// ─── CSS string — hoisted so React never re-injects the <style> tag ─────────

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500;600;700&family=Google+Sans+Display:wght@300;400;500;700;900&family=Google+Sans+Mono:wght@300;400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --v1: #6c5ce7;
    --v2: #a29bfe;
    --v3: rgba(162,155,254,0.5);
    --b: rgba(255,255,255,0.07);
    --bg: #07070c;
  }
  .rv {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
  }
  .rv.on { opacity: 1; transform: none; }
  .rv.d1 { transition-delay: 0.07s; }
  .rv.d2 { transition-delay: 0.17s; }
  .rv.d3 { transition-delay: 0.29s; }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: 'Google Sans Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--v2);
  }
  .eyebrow::before {
    content: '';
    width: 24px;
    height: 1px;
    background: var(--v1);
    flex-shrink: 0;
  }
  .stitle {
    font-family: 'Google Sans Display', sans-serif;
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.05;
    background: linear-gradient(155deg, #fff 20%, rgba(255,255,255,0.35) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .vgrad {
    background: linear-gradient(115deg, var(--v2) 0%, var(--v1) 55%, #c4bfff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .mq {
    overflow: hidden;
    border-top: 1px solid var(--b);
    border-bottom: 1px solid var(--b);
    padding: 16px 0;
  }
  .mq-t {
    display: flex;
    gap: 52px;
    white-space: nowrap;
    animation: mqs 22s linear infinite;
    will-change: transform;
  }
  @keyframes mqs {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .mq-w {
    font-family: 'Google Sans', sans-serif;
    font-weight: 500;
    font-size: 10px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(162,155,254,0.38);
  }
  .mq-d { color: rgba(108,92,231,0.22); font-size: 6px; }
  .wcard {
    padding: 36px 32px;
    border: 1px solid var(--b);
    background: rgba(255,255,255,0.016);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s, background 0.3s;
  }
  .wcard:hover {
    border-color: rgba(108,92,231,0.3);
    background: rgba(108,92,231,0.035);
  }
  .wcard::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--v1), transparent);
    transform: scaleX(0);
    transition: transform 0.4s ease;
  }
  .wcard:hover::after { transform: scaleX(1); }
  .who-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }
  .steps-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 2px;
    overflow: hidden;
  }
  .step-cell {
    padding: 48px 48px 52px;
    position: relative;
    cursor: default;
    overflow: hidden;
  }
  .step-cell:nth-child(1), .step-cell:nth-child(2) {
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .step-cell:nth-child(1), .step-cell:nth-child(3) {
    border-right: 1px solid rgba(255,255,255,0.07);
  }
  .step-cell::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 70% 60% at 20% 20%, rgba(108,92,231,0.08) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.5s;
    pointer-events: none;
  }
  .step-cell:hover::after { opacity: 1; }
  .step-cell::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--v1), var(--v2), transparent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
  }
  .step-cell:hover::before { transform: scaleX(1); }
  .step-number {
    font-family: 'Google Sans Display', sans-serif;
    font-size: clamp(64px, 7vw, 88px);
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.04em;
    background: linear-gradient(135deg, var(--v1) 0%, var(--v2) 60%, rgba(162,155,254,0.4) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 24px;
    transition: filter 0.3s;
    display: inline-block;
  }
  .step-cell:hover .step-number { filter: brightness(1.25); }
  .step-title {
    font-family: 'Google Sans', sans-serif;
    font-size: clamp(16px, 1.6vw, 19px);
    font-weight: 700;
    color: rgba(237,233,224,0.92);
    line-height: 1.25;
    letter-spacing: -0.015em;
    margin-bottom: 12px;
    transition: color 0.25s;
  }
  .step-cell:hover .step-title { color: #fff; }
  .step-body {
    font-family: 'Google Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 300;
    line-height: 1.8;
    color: rgba(237,233,224,0.38);
    transition: color 0.25s;
  }
  .step-cell:hover .step-body { color: rgba(237,233,224,0.58); }
  .step-dot {
    position: absolute;
    top: 22px; right: 26px;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: rgba(108,92,231,0.5);
    transition: background 0.3s, transform 0.3s;
  }
  .step-cell:hover .step-dot { background: var(--v2); transform: scale(1.4); }
  .pill {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    border: 1px solid rgba(108,92,231,0.17);
    border-radius: 3px;
    font-family: 'Google Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: rgba(237,233,224,0.52);
    transition: all 0.25s;
  }
  .pill::before {
    content: '';
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--v1);
    opacity: 0.55;
    flex-shrink: 0;
    transition: opacity 0.25s;
  }
  .pill:hover { border-color: var(--v1); color: var(--v2); background: rgba(108,92,231,0.055); }
  .pill:hover::before { opacity: 1; }
  .stat-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: 1px solid var(--b);
    margin-bottom: 16px;
    border-radius: 4px;
    overflow: hidden;
  }
  .stat-cell {
    padding: 22px 24px;
    background: rgba(255,255,255,0.016);
    border-right: 1px solid var(--b);
    border-bottom: 1px solid var(--b);
  }
  .stat-cell:nth-child(2n) { border-right: none; }
  .stat-cell:nth-child(n+3) { border-bottom: none; }
  .section-who { padding: 88px 64px 72px; max-width: 1240px; margin: 0 auto; }
  .section-process-inner { max-width: 1240px; margin: 0 auto; padding: 88px 64px; }
  .section-deal { padding: 88px 64px; max-width: 1240px; margin: 0 auto; }
  .deal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: start; }
  .section-closing { border-top: 1px solid rgba(255,255,255,0.07); padding: 20px 64px; }

  @media (max-width: 1024px) {
    .section-who, .section-process-inner, .section-deal { padding-left: 40px; padding-right: 40px; }
    .section-closing { padding-left: 40px; padding-right: 40px; }
    .deal-grid { gap: 48px; }
    .step-cell { padding: 36px 32px 40px; }
  }
  @media (max-width: 768px) {
    .section-who, .section-process-inner, .section-deal {
      padding-left: 24px; padding-right: 24px;
      padding-top: 64px; padding-bottom: 56px;
    }
    .section-closing { padding-left: 24px; padding-right: 24px; }
    .who-grid { grid-template-columns: 1fr; gap: 10px; }
    .steps-grid { grid-template-columns: 1fr; }
    .step-cell { padding: 32px 24px 36px; border-right: none !important; }
    .step-cell:nth-child(1), .step-cell:nth-child(2), .step-cell:nth-child(3) {
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }
    .step-cell:nth-child(4) { border-bottom: none; }
    .deal-grid { grid-template-columns: 1fr; gap: 40px; }
  }
  @media (max-width: 480px) {
    .section-who, .section-process-inner, .section-deal {
      padding-left: 16px; padding-right: 16px;
      padding-top: 48px; padding-bottom: 40px;
    }
    .section-closing { padding-left: 16px; padding-right: 16px; }
    .step-cell { padding: 28px 20px 32px; }
    .wcard { padding: 28px 22px; }
    .stat-cell { padding: 16px 18px; }
    .pill { padding: 12px 16px; font-size: 13px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .rv { opacity: 1; transform: none; transition: none; }
    .mq-t { animation: none; }
  }
`;

// ─── Shared inline style objects for card internals ─────────────────────────

const cardNumStyle = {
  fontFamily: "'Google Sans Mono', monospace",
  fontSize: "9px",
  letterSpacing: "0.3em",
  color: "rgba(108,92,231,0.4)",
  textTransform: "uppercase",
  marginBottom: "28px",
};

const cardTitleStyle = {
  fontFamily: "'Google Sans Display', sans-serif",
  fontSize: "20px",
  fontWeight: 600,
  color: "#ede9e0",
  lineHeight: 1.3,
  letterSpacing: "-0.01em",
  marginBottom: "14px",
};

const cardBodyStyle = {
  fontFamily: "'Google Sans', sans-serif",
  fontSize: "14.5px",
  fontWeight: 300,
  lineHeight: 1.8,
  color: "rgba(237,233,224,0.46)",
};

const whoHeadStyle = { marginBottom: "56px" };
const whoH2Style = { fontSize: "clamp(42px, 5.5vw, 68px)", marginTop: "16px" };
const processHeadStyle = { marginBottom: "64px" };
const processH2Style = {
  fontSize: "clamp(40px, 5.2vw, 64px)",
  marginTop: "16px",
};

const dealH2Style = {
  fontFamily: "'Google Sans Display', sans-serif",
  fontSize: "clamp(38px, 5vw, 62px)",
  fontWeight: 700,
  lineHeight: 1.1,
  letterSpacing: "-0.025em",
  marginTop: "18px",
  marginBottom: "28px",
};

const dealBodyTextStyle = {
  fontFamily: "'Google Sans', sans-serif",
  fontSize: "16px",
  fontWeight: 300,
  lineHeight: 1.8,
  color: "rgba(237,233,224,0.46)",
  marginBottom: "40px",
  maxWidth: "420px",
};

const statValStyle = {
  fontFamily: "'Google Sans Display', sans-serif",
  fontSize: "26px",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  color: "#ede9e0",
  marginBottom: "3px",
};

const statLblStyle = {
  fontFamily: "'Google Sans Mono', monospace",
  fontSize: "9px",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "rgba(162,155,254,0.45)",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AboutUs() {
  const [visible, setVisible] = useState({});
  const refs = useRef({});

  // Stable callback — no deps, never re-created
  const handleIntersect = useCallback((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        setVisible((p) => ({ ...p, [e.target.dataset.id]: true }));
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.1,
    });
    Object.values(refs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [handleIntersect]);

  // Stable ref callback factory — memoised per id via inline closure is fine
  // here because it only runs once per element mount, not on every render
  const reg = useCallback(
    (id) => (el) => {
      refs.current[id] = el;
      if (el) el.dataset.id = id;
    },
    [],
  );

  const v = (id) => visible[id];

  return (
    <div style={rootStyle}>
      <style>{STYLES}</style>

      {/* ── MARQUEE ── */}
      <div className="mq">
        <div className="mq-t">
          {/* Two copies for seamless loop — static, no key-index anti-pattern needed */}
          {[0, 1].map((i) => (
            <div key={i} style={marqTrackStyle}>
              {MARQ_ITEMS.map((t, j) => (
                <span key={j} className={t === "◆" ? "mq-d" : "mq-w"}>
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── WHO WE ARE ── */}
      <section className="section-who">
        <div
          ref={reg("wh")}
          className={`rv${v("wh") ? " on" : ""}`}
          style={whoHeadStyle}
        >
          <span className="eyebrow">About Us</span>
          <h2 className="stitle" style={whoH2Style}>
            Who We Are
          </h2>
        </div>

        <div className="who-grid">
          {WHO_CARDS.map((card, i) => (
            <div
              key={card.num}
              ref={reg(`wc${i}`)}
              className={`rv wcard d${i + 1}${v(`wc${i}`) ? " on" : ""}`}
            >
              <div style={cardNumStyle}>— {card.num}</div>
              <h3 style={cardTitleStyle}>{card.title}</h3>
              <p style={cardBodyStyle}>{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT WE ACTUALLY DO ── */}
      <section style={processSectionStyle}>
        <div className="section-process-inner">
          <div
            ref={reg("dh")}
            className={`rv${v("dh") ? " on" : ""}`}
            style={processHeadStyle}
          >
            <span className="eyebrow">Our Process</span>
            <h2 className="stitle" style={processH2Style}>
              What We Actually <br /> Do For You
            </h2>
          </div>

          <div ref={reg("sg")} className={`rv d1${v("sg") ? " on" : ""}`}>
            <div className="steps-grid">
              {STEPS.map((s) => (
                <div key={s.n} className="step-cell">
                  <div className="step-dot" />
                  <div className="step-number">{s.n}</div>
                  <div className="step-title">{s.action}</div>
                  <p className="step-body">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── THE DEAL ── */}
      <section className="section-deal">
        <div className="deal-grid">
          <div ref={reg("dl")} className={`rv${v("dl") ? " on" : ""}`}>
            <span className="eyebrow">The Deal</span>
            <h2 style={dealH2Style}>
              You keep your brand. <br />
              <span className="vgrad">We share the vision.</span> <br />
              That's the whole deal.
            </h2>
            <p style={dealBodyTextStyle}>
              No retainers. No heavy lifting. No spotlight on us. We align with
              your voice and audience, proving our value through results. If it
              doesn't fit, we adapt — or step away.
            </p>
          </div>

          <div ref={reg("dr")} className={`rv d2${v("dr") ? " on" : ""}`}>
            <div className="stat-grid">
              {STATS.map(([val, lbl]) => (
                <div key={lbl} className="stat-cell">
                  <div style={statValStyle}>{val}</div>
                  <div style={statLblStyle}>{lbl}</div>
                </div>
              ))}
            </div>

            <div style={dealBodyStyle}>
              {PILLS.map((p) => (
                <div key={p} className="pill">
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CLOSING ── */}
      <section className="section-closing">
        <div ref={reg("qt")} className={`rv${v("qt") ? " on" : ""}`} />
      </section>
    </div>
  );
}
