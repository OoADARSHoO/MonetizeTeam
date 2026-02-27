import { memo, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import logo from "../assets/images/white.png";

gsap.registerPlugin(ScrollToPlugin, ScrollSmoother);

// ─── Static data ──────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About", href: "#about", id: "about" },
  { label: "Approach", href: "#approach", id: "approach" },
  { label: "Contact", href: "#contact", id: "contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const PROCESS_ITEMS = [
  "Audience Audit",
  "Product Design",
  "Demand Test",
  "14-Day Launch",
];

const PARTNERSHIP_ITEMS = [
  "Zero Upfront Cost",
  "Performance-Based Earnings",
  "14 Days to Launch",
  "No Long-term Lock-in",
  "You Keep Full Control",
];

const MARQ_BASE = [
  "We See Gaps",
  "◆",
  "We Build Products",
  "◆",
  "We Launch Fast",
  "◆",
  "We Unlock Revenue",
  "◆",
  "You Keep Your Brand",
  "◆",
  "We Stay Invisible",
  "◆",
  "Results Do The Talking",
  "◆",
];
const MARQ_ITEMS = [...MARQ_BASE, ...MARQ_BASE];

// ─── Stylesheet injected once ─────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500;600;700&family=Google+Sans+Display:wght@300;400;500;700&family=Google+Sans+Mono:wght@300;400&display=swap');

*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

:root {
  --v1: #6c5ce7;
  --v2: #a29bfe;
  --b: rgba(255,255,255,0.07);
}

.rv {
  opacity:0;
  transform: translateY(28px);
  transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1);
}
.rv.on { opacity:1; transform:none; }
.rv.d1 { transition-delay:.07s }
.rv.d2 { transition-delay:.17s }
.rv.d3 { transition-delay:.29s }
.rv.d4 { transition-delay:.38s }

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Google Sans Mono', monospace;
  font-size: 10px;
  letter-spacing: .32em;
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

.mq {
  overflow: hidden;
  border-top: 1px solid var(--b);
  border-bottom: 1px solid var(--b);
  padding: 14px 0;
}
.mq-t {
  display: flex;
  gap: 52px;
  white-space: nowrap;
  animation: mqs 22s linear infinite;
  will-change: transform;
}
@keyframes mqs {
  from { transform: translateX(0) }
  to   { transform: translateX(-50%) }
}
.mq-w {
  font-family: 'Google Sans', sans-serif;
  font-weight: 500;
  font-size: 10px;
  letter-spacing: .28em;
  text-transform: uppercase;
  color: rgba(162,155,254,.38);
}
.mq-d {
  color: rgba(108,92,231,.22);
  font-size: 6px;
}

.footer-link {
  font-family: 'Google Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: rgba(237,233,224,.38);
  text-decoration: none;
  position: relative;
  transition: color .25s;
  padding-bottom: 2px;
  width: fit-content;
  display: inline-block;
  cursor: pointer;
}
.footer-link::after {
  content: '';
  position: absolute;
  left: 0; bottom: 0;
  width: 100%;
  height: 1px;
  background: var(--v1);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .3s ease;
}
.footer-link:hover { color: var(--v2); }
.footer-link:hover::after { transform: scaleX(1); }

.social-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 4px;
  background: rgba(255,255,255,.016);
  font-family: 'Google Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: .06em;
  color: rgba(237,233,224,.46);
  text-decoration: none;
  transition: border-color .25s, color .25s, background .25s, transform .2s;
  cursor: pointer;
  white-space: nowrap;
}
.social-btn:hover {
  border-color: rgba(108,92,231,.45);
  color: var(--v2);
  background: rgba(108,92,231,.04);
  transform: translateY(-1px);
}

.divider {
  border: none;
  border-top: 1px solid rgba(255,255,255,.07);
  margin: 0;
}

.footer-body {
  max-width: 1240px;
  margin: 0 auto;
  padding: 72px 64px 56px;
}
.footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 48px;
}
.footer-bar {
  max-width: 1240px;
  margin: 0 auto;
  padding: 20px 64px;
}
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 16px;
}

.legal-link {
  font-family: 'Google Sans Mono', monospace;
  font-size: 9px;
  letter-spacing: .2em;
  color: rgba(255,255,255,.13);
  text-transform: uppercase;
  text-decoration: none;
  transition: color .2s;
}
.legal-link:hover { color: rgba(162,155,254,.4); }

.brand-logo {
  display: block;
  height: 32px;
  width: auto;
}

.brand-desc {
  font-family: 'Google Sans', sans-serif;
  font-size: 13.5px;
  font-weight: 300;
  line-height: 1.85;
  color: rgba(237,233,224,0.38);
  max-width: 260px;
  margin: 20px 0 32px;
}

.social-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ──────────────────────────────────────── Media Queries ──────── */
@media (max-width: 1024px) {
  .footer-body { padding: 64px 48px 48px; }
  .footer-bar  { padding: 20px 48px; }
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px 48px;
  }
  .footer-grid > *:first-child { grid-column: 1 / -1; }
}

@media (max-width: 768px) {
  .footer-body { padding: 56px 24px 40px; }
  .footer-bar  { padding: 20px 24px; }
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  .social-row { flex-direction: row; flex-wrap: wrap; gap: 12px; }
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .mq-w { font-size: 9px; letter-spacing: .2em; }
  .social-row { justify-content: center; }
}
`;

let cssInjected = false;
function injectCSS() {
  if (cssInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = CSS;
  document.head.appendChild(el);
  cssInjected = true;
}

// ─── Icons ────────────────────────────────────────────────────────────────
const Logo = memo(() => (
  <img src={logo} alt="MonetizeTeam" className="brand-logo" />
));
Logo.displayName = "Logo";

const InstagramIcon = memo(() => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
  </svg>
));
InstagramIcon.displayName = "InstagramIcon";

const EmailIcon = memo(() => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
));
EmailIcon.displayName = "EmailIcon";

const DOT_STYLE = {
  width: 4,
  height: 4,
  borderRadius: "50%",
  background: "rgba(108,92,231,0.5)",
  flexShrink: 0,
};
const Dot = memo(() => <div style={DOT_STYLE} />);
Dot.displayName = "Dot";

// ─── Footer ───────────────────────────────────────────────────────────────
export default function Footer() {
  injectCSS();

  // Same scroll logic as Navbar
  const handleNavClick = useCallback((e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(target, true, "top top");
    } else {
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 80 },
        duration: 1,
        ease: "power2.inOut",
      });
    }
  }, []);

  return (
    <footer
      style={{
        fontFamily: "'Google Sans', sans-serif",
        background: "#07070c",
        color: "#ede9e0",
        overflowX: "hidden",
      }}
    >
      {/* Marquee */}
      <div className="mq">
        <div className="mq-t">
          {MARQ_ITEMS.map((t, i) => (
            <span key={i} className={t === "◆" ? "mq-d" : "mq-w"}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Main content */}
      <div className="footer-body">
        <div className="footer-grid">
          {/* Brand column */}
          <div>
            <Logo />
            <p className="brand-desc">
              We build digital products &amp; monetization systems for creators
              with engaged audiences — zero upfront cost, performance-based
              partnership.
            </p>

            <div className="social-row">
              <a
                href="https://www.instagram.com/monetize.team/"
                className="social-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon /> @monetizeteam
              </a>
              <a
                href="#contact"
                className="social-btn"
                onClick={(e) => handleNavClick(e, "contact")}
              >
                <EmailIcon /> Contact Us
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p
              style={{
                fontFamily: "'Google Sans Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(108,92,231,0.55)",
                marginBottom: 20,
              }}
            >
              Navigation
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="footer-link"
                  onClick={(e) => handleNavClick(e, link.id)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p
              style={{
                fontFamily: "'Google Sans Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(108,92,231,0.55)",
                marginBottom: 20,
              }}
            >
              Process
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PROCESS_ITEMS.map((item) => (
                <div
                  key={item}
                  style={{
                    fontSize: 14,
                    color: "rgba(237,233,224,0.38)",
                    lineHeight: 1.45,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p
              style={{
                fontFamily: "'Google Sans Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(108,92,231,0.55)",
                marginBottom: 20,
              }}
            >
              Partnership
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PARTNERSHIP_ITEMS.map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 13,
                    color: "rgba(237,233,224,0.36)",
                  }}
                >
                  <Dot /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* Bottom bar */}
      <div className="footer-bar">
        <div className="footer-bottom">
          <span
            style={{
              fontFamily: "'Google Sans Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.13)",
              textTransform: "uppercase",
            }}
          >
            © 2025 MonetizeTeam · We Stay Hidden
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {LEGAL_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="legal-link">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
