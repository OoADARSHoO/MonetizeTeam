import { useState, useEffect, useRef, useCallback } from "react";

// ─── SVG icons as stable constants — never re-created on render ──────────────

const IconWrench = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const IconCamera = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const IconTrend = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

// ─── Static data — module-level, never re-allocated ─────────────────────────

const STEPS = [
  {
    icon: IconWrench,
    num: "01",
    title: "We do the heavy lifting",
    body: "We design, build, and operate everything needed to monetise your audience — from offers to funnels to email marketing.",
  },
  {
    icon: IconCamera,
    num: "02",
    title: "You stay in your zone",
    body: "You focus on content and audience growth. We handle the backend: offers, funnels, emails, and optimisation.",
  },
  {
    icon: IconTrend,
    num: "03",
    title: "Build to run",
    body: "We build systems that keep working and improving over time, without constant input from you.",
  },
];

// ─── Stable style objects — defined once at module scope ────────────────────

const rootStyle = {
  fontFamily: "'Google Sans', sans-serif",
  background: "#07070c",
  color: "#ede9e0",
  minHeight: "90vh",
  overflowX: "hidden",
};

const sectionStyle = {
  maxWidth: "1240px",
  margin: "0 auto",
  padding: "96px 64px",
};

const closingStyle = {
  borderTop: "1px solid rgba(255,255,255,0.07)",
  padding: "0px 64px",
  marginTop: "30px",
};

const headerStyle = { marginBottom: "72px" };

const h2Style = {
  fontSize: "clamp(42px, 5.5vw, 68px)",
  marginTop: "18px",
  marginBottom: "20px",
};

const subStyle = {
  fontFamily: "'Google Sans', sans-serif",
  fontSize: "17px",
  fontWeight: 300,
  lineHeight: 1.8,
  color: "rgba(237,233,224,0.46)",
  maxWidth: "500px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "16px",
};

// ─── CSS string — hoisted so React never re-injects the <style> tag ─────────

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500;600;700&family=Google+Sans+Display:wght@300;400;500;700&family=Google+Sans+Mono:wght@300;400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --v1: #6c5ce7; --v2: #a29bfe; --b: rgba(255,255,255,0.07); }

  .rv {
    opacity: 0; transform: translateY(28px);
    transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
  }
  .rv.on { opacity: 1; transform: none; }
  .rv.d1 { transition-delay: 0.08s; }
  .rv.d2 { transition-delay: 0.2s; }
  .rv.d3 { transition-delay: 0.32s; }

  .eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: 'Google Sans Mono', monospace;
    font-size: 10px; letter-spacing: 0.32em; text-transform: uppercase;
    color: var(--v2);
  }
  .eyebrow::before {
    content: ''; width: 24px; height: 1px;
    background: var(--v1); flex-shrink: 0;
  }

  .stitle {
    font-family: 'Google Sans Display', sans-serif;
    font-weight: 700; letter-spacing: -0.025em; line-height: 1.05;
    background: linear-gradient(155deg, #fff 20%, rgba(255,255,255,0.35) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .icon-box {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(108,92,231,0.1); border: 1px solid rgba(108,92,231,0.25);
    display: flex; align-items: center; justify-content: center;
    color: var(--v2); margin-bottom: 36px;
    transition: background 0.35s, border-color 0.35s, transform 0.35s;
    flex-shrink: 0; position: relative; z-index: 1;
  }

  .step-card {
    padding: 44px 40px 48px;
    border: 1px solid rgba(255,255,255,0.07); border-radius: 12px;
    background: rgba(255,255,255,0.018);
    position: relative; overflow: hidden;
    transition: border-color 0.35s, background 0.35s, transform 0.35s;
    cursor: default;
  }
  .step-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(108,92,231,0.6) 50%, transparent 100%);
    opacity: 0; transition: opacity 0.35s;
  }
  .step-card::after {
    content: ''; position: absolute; top: -60px; right: -60px;
    width: 260px; height: 260px; border-radius: 50%;
    background: radial-gradient(circle, rgba(108,92,231,0.13) 0%, transparent 65%);
    pointer-events: none; opacity: 0; transition: opacity 0.5s;
  }
  .step-card:hover { border-color: rgba(108,92,231,0.35); background: rgba(108,92,231,0.035); transform: translateY(-3px); }
  .step-card:hover::before { opacity: 1; }
  .step-card:hover::after  { opacity: 1; }
  .step-card:hover .icon-box { background: rgba(108,92,231,0.2); border-color: rgba(108,92,231,0.5); transform: scale(1.06); }

  .card-tag {
    position: absolute; top: 40px; right: 40px;
    font-family: 'Google Sans Mono', monospace;
    font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
    color: rgba(108,92,231,0.35); user-select: none;
  }
  .card-title {
    font-family: 'Google Sans Display', sans-serif;
    font-size: clamp(22px, 2.2vw, 26px); font-weight: 700;
    color: rgba(237,233,224,0.93); line-height: 1.25; letter-spacing: -0.02em;
    margin-bottom: 18px; transition: color 0.25s; position: relative; z-index: 1;
  }
  .step-card:hover .card-title { color: #fff; }
  .card-body {
    font-family: 'Google Sans', sans-serif;
    font-size: 15.5px; font-weight: 300; line-height: 1.85;
    color: rgba(237,233,224,0.46); transition: color 0.25s; position: relative; z-index: 1;
  }
  .step-card:hover .card-body { color: rgba(237,233,224,0.68); }

  @media (max-width: 1024px) {
    .approach-section { padding: 72px 40px !important; }
    .approach-closing  { padding: 0px 40px !important; }
  }
  @media (max-width: 768px) {
    .approach-section  { padding: 56px 24px !important; }
    .approach-closing  { padding: 0px 24px !important; }
    .approach-header   { margin-bottom: 48px !important; }
    .cards-grid        { grid-template-columns: 1fr !important; gap: 12px !important; }
  }
  @media (max-width: 480px) {
    .approach-section  { padding: 48px 16px !important; }
    .approach-closing  { padding: 0px 16px !important; }
    .approach-header   { margin-bottom: 36px !important; }
    .step-card         { padding: 32px 24px 36px !important; }
    .card-tag          { top: 28px !important; right: 24px !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .rv { opacity: 1; transform: none; transition: none; }
  }
`;

// ─── Component ───────────────────────────────────────────────────────────────

export default function Approach() {
  const [visible, setVisible] = useState({});
  const refs = useRef({});

  const handleIntersect = useCallback((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting)
        setVisible((p) => ({ ...p, [e.target.dataset.id]: true }));
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.1,
    });
    Object.values(refs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [handleIntersect]);

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

      <section className="approach-section" style={sectionStyle}>
        {/* ── HEADER ── */}
        <div
          ref={reg("hd")}
          className={`rv approach-header${v("hd") ? " on" : ""}`}
          style={headerStyle}
        >
          <span className="eyebrow">Approach</span>
          <h2 className="stitle" style={h2Style}>
            How The Partnership Works
          </h2>
          <p style={subStyle}>What working with us actually looks like</p>
        </div>

        {/* ── 3 CARDS ── */}
        <div className="cards-grid" style={gridStyle}>
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              ref={reg(`c${i}`)}
              className={`rv step-card d${i + 1}${v(`c${i}`) ? " on" : ""}`}
            >
              <div className="card-tag">{step.num}</div>
              <div className="icon-box">{step.icon}</div>
              <div className="card-title">{step.title}</div>
              <p className="card-body">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="approach-closing" style={closingStyle}>
        <div ref={reg("qt")} className={`rv${v("qt") ? " on" : ""}`} />
      </section>
    </div>
  );
}
