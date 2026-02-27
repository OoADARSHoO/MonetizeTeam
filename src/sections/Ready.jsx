import { useState, useEffect, useRef, useCallback } from "react";

// ─── Stylesheet injected once ─────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500;600;700&family=Google+Sans+Display:wght@300;400;500;700&family=Google+Sans+Mono:wght@300;400&display=swap');
:root{--v1:#6c5ce7;--v2:#a29bfe;}
.rv{opacity:0;transform:translateY(28px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
.rv.on{opacity:1;transform:none}
.rv.d1{transition-delay:.07s}.rv.d2{transition-delay:.17s}.rv.d3{transition-delay:.29s}
.eyebrow{display:inline-flex;align-items:center;gap:10px;font-family:'Google Sans Mono',monospace;font-size:10px;letter-spacing:.32em;text-transform:uppercase;color:var(--v2)}
.eyebrow::before{content:'';width:24px;height:1px;background:var(--v1);flex-shrink:0}
.glow-orb{position:absolute;width:480px;height:280px;border-radius:50%;background:radial-gradient(ellipse,rgba(108,92,231,.12) 0%,transparent 70%);pointer-events:none;filter:blur(40px)}
.cta-section{max-width:1240px;margin:0 auto;padding:72px 64px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:32px;position:relative}
.cta-btn{display:inline-flex;align-items:center;justify-content:center;font-family:'Google Sans',sans-serif;font-size:13px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:#fff;text-decoration:none;background:linear-gradient(135deg,#2d1fa3,var(--v1));padding:15px 44px;border-radius:4px;transition:transform .2s,box-shadow .2s;border:none;cursor:pointer;width:100%;max-width:320px}
.cta-btn:hover{box-shadow:0 4px 20px rgba(108,92,231,.5)}
@media(max-width:768px){.cta-section{padding:56px 24px;gap:24px}.cta-btn{max-width:100%;padding:15px 32px}}
`;

let cssInjected = false;
function injectCSS() {
  if (cssInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = CSS;
  document.head.appendChild(el);
  cssInjected = true;
}

function useReveal() {
  const [visible, setVisible] = useState({});
  const refs = useRef({});
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const updates = {};
        entries.forEach((e) => {
          if (e.isIntersecting) updates[e.target.dataset.id] = true;
        });
        if (Object.keys(updates).length)
          setVisible((prev) => ({ ...prev, ...updates }));
      },
      { threshold: 0.1 },
    );
    Object.values(refs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const reg = useCallback(
    (id) => (el) => {
      refs.current[id] = el;
      if (el) el.dataset.id = id;
    },
    [],
  );
  const v = useCallback((id) => visible[id], [visible]);
  return { reg, v };
}

const STRIP_STYLE = {
  background: "rgba(108,92,231,0.025)",
  position: "relative",
  overflow: "hidden",
  fontFamily: "'Google Sans',sans-serif",
  color: "#ede9e0",
};

const GLOW_ORB_STYLE = {
  top: "-80px",
  left: "50%",
  transform: "translateX(-50%)",
};

const H2_STYLE = {
  fontFamily: "'Google Sans Display',sans-serif",
  fontSize: "clamp(28px,5vw,58px)",
  fontWeight: 700,
  letterSpacing: "-0.025em",
  lineHeight: 1.1,
  background: "linear-gradient(155deg,#fff 20%,rgba(255,255,255,0.35) 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  maxWidth: "640px",
};

const P_STYLE = {
  fontFamily: "'Google Sans',sans-serif",
  fontSize: "15px",
  fontWeight: 300,
  lineHeight: 1.8,
  color: "rgba(237,233,224,0.44)",
  maxWidth: "440px",
};

export default function Ready() {
  injectCSS();
  const { reg, v } = useReveal();

  return (
    <div style={STRIP_STYLE}>
      <div className="glow-orb" style={GLOW_ORB_STYLE} />
      <div className="cta-section">
        <span
          className={`eyebrow rv${v("cta-eye") ? " on" : ""}`}
          ref={reg("cta-eye")}
        >
          Ready?
        </span>
        <h2
          className={`rv d1${v("cta-h") ? " on" : ""}`}
          ref={reg("cta-h")}
          style={H2_STYLE}
        >
          Your audience is already worth more than you think.
        </h2>
        <p
          className={`rv d2${v("cta-p") ? " on" : ""}`}
          ref={reg("cta-p")}
          style={P_STYLE}
        >
          Let us audit your account, calculate your untapped revenue, and show
          you exactly what's possible — for free.
        </p>
        <div
          className={`rv d3${v("cta-btn") ? " on" : ""}`}
          ref={reg("cta-btn")}
        >
          <a href="#contact" className="cta-btn">
            Get Your Free Audit →
          </a>
        </div>
      </div>
    </div>
  );
}
