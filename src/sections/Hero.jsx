import Silk from "../components/Silk";
import Button from "../elements/Button";

// Moved outside component — stable object reference, never re-created on render
const NAVBAR_OFFSET = 107;

const sectionStyle = {
  position: "relative",
  width: "100%",
  height: "100vh",
  overflow: "hidden",
};

const overlayStyle = {
  position: "absolute",
  inset: 0,
  zIndex: 1,
  background:
    "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.6) 100%)",
};

const contentStyle = {
  position: "absolute",
  inset: 0,
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: `${NAVBAR_OFFSET + 24}px 24px 48px`,
  boxSizing: "border-box",
};

const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "999px",
  padding: "6px 20px",
  marginBottom: "30px",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
};

const badgeTextStyle = {
  color: "rgba(255,255,255,0.95)",
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const h1Style = {
  fontWeight: 800,
  lineHeight: 1.08,
  letterSpacing: "-0.025em",
  color: "#fff",
  margin: "0 0 20px",
  maxWidth: "1200px",
};

const subStyle = {
  color: "rgb(255,255,255)",
  fontSize: "clamp(14px, 1.8vw, 18px)",
  lineHeight: 1.7,
  maxWidth: "540px",
  margin: "20px auto 30px",
  fontWeight: 400,
};

const ctaStyle = { marginTop: "36px" };

// CSS extracted to a module-level constant — only one string allocation ever
const HERO_STYLES = `
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero-badge { animation: fade-up 0.7s ease 0.1s  both; }
  .hero-h1    { animation: fade-up 0.7s ease 0.4s  both; font-size: 100px; }
  .hero-sub   { animation: fade-up 0.7s ease 0.55s both; }
  .hero-ctas  { animation: fade-up 0.7s ease 0.7s  both; }

  @media (max-width: 1024px) {
    .hero-h1 { font-size: 72px; }
  }
  @media (max-width: 768px) {
    .hero-h1 { font-size: 52px; }
    .hero-content {
      padding-left: 20px !important;
      padding-right: 20px !important;
      padding-top: 80px !important;
    }
    .hero-badge { margin-bottom: 20px !important; }
    .hero-sub {
      font-size: 15px !important;
      margin-top: 14px !important;
      margin-bottom: 20px !important;
    }
    .hero-ctas { margin-top: 24px !important; }
  }
  @media (max-width: 480px) {
    .hero-h1 { font-size: 38px; letter-spacing: -0.02em; }
    .hero-content {
      padding-left: 16px !important;
      padding-right: 16px !important;
      padding-top: 72px !important;
    }
    .hero-badge {
      padding: 5px 14px !important;
      margin-bottom: 16px !important;
    }
    .hero-badge span { font-size: 10px !important; }
    .hero-sub {
      font-size: 14px !important;
      max-width: 100% !important;
    }
    .hero-ctas { margin-top: 20px !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .hero-badge, .hero-h1, .hero-sub, .hero-ctas {
      animation: none;
      opacity: 1;
    }
  }
`;

export default function Hero() {
  return (
    <>
      {/* style tag is now a stable string ref — React won't re-inject it on re-renders */}
      <style>{HERO_STYLES}</style>

      <section style={sectionStyle}>
        <Silk
          color="#0c00b3"
          speed={5}
          scale={1}
          noiseIntensity={1.5}
          rotation={0}
        />

        {/* Overlay */}
        <div style={overlayStyle} />

        {/* Content */}
        <div className="hero-content" style={contentStyle}>
          {/* Badge */}
          <div className="hero-badge" style={badgeStyle}>
            <span style={badgeTextStyle}>The Backend Operator</span>
          </div>

          {/* H1 */}
          <h1 className="hero-h1" style={h1Style}>
            Turn Your Audience Into Predictable Revenue
          </h1>

          {/* Sub */}
          <p className="hero-sub" style={subStyle}>
            Operating behind the scenes, we design and run the systems that
            handle monetisation, sales, and growth.
          </p>

          {/* CTA */}
          <div className="hero-ctas" style={ctaStyle}>
            <Button label="Book A Call" />
          </div>
        </div>
      </section>
    </>
  );
}
