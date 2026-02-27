import { useState, useRef, useEffect, useCallback } from "react";

// ─── Static data — module-level, never re-allocated ─────────────────────────

const FIELDS = [
  { name: "name", label: "Your Name", type: "text", placeholder: "Jane Smith" },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "jane@example.com",
  },
  {
    name: "handle",
    label: "Instagram Handle",
    type: "text",
    placeholder: "@yourhandle",
  },
];

const INFO_CARDS = [
  {
    label: "What happens next",
    body: "We review your profile, calculate your estimated revenue potential, and send you a free monetization gameplan — no pitch, no catch.",
  },
  {
    label: "What we need from you",
    body: "An active audience of 10K–100K followers and content people actually engage with. That's it. We handle everything else.",
  },
  {
    label: "The deal, plainly",
    body: "Zero upfront fees. No retainers. We create the full monetization strategy and opportunities — you only pay us a fair percentage of the new revenue we help you generate. If it doesn't work, you pay nothing.",
  },
];

const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSffBiRpgPgTluWi1oiZjjN1mxapdEfIsYtOyBl5cf_EdS5Usw/formResponse";

const EMPTY_FORM = { name: "", email: "", handle: "", message: "" };

// ─── Stable style objects ────────────────────────────────────────────────────

const rootStyle = {
  fontFamily: "'Google Sans', sans-serif",
  background: "#07070c",
  color: "#ede9e0",
  minHeight: "100vh",
  overflowX: "hidden",
};

const sectionStyle = {
  maxWidth: "1240px",
  margin: "0 auto",
  padding: "88px 64px",
};
const headerStyle = { marginBottom: "72px", maxWidth: "680px" };
const h2Style = {
  fontSize: "clamp(42px, 5.5vw, 68px)",
  marginTop: "16px",
  marginBottom: "20px",
};
const subStyle = {
  fontFamily: "'Google Sans', sans-serif",
  fontSize: "16px",
  fontWeight: 300,
  lineHeight: 1.8,
  color: "rgba(237,233,224,0.48)",
};
const bodyGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 420px",
  gap: "64px",
  alignItems: "start",
};
const formStyle = { display: "flex", flexDirection: "column", gap: "20px" };
const nameEmailStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
};
const infoColStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  position: "sticky",
  top: "120px",
};
const emojiStyle = { fontSize: "40px" };
const successH3Style = {
  fontFamily: "'Google Sans Display', sans-serif",
  fontSize: "26px",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  color: "#ede9e0",
};
const successPStyle = {
  fontFamily: "'Google Sans', sans-serif",
  fontSize: "15px",
  fontWeight: 300,
  lineHeight: 1.75,
  color: "rgba(237,233,224,0.48)",
  maxWidth: "380px",
};
const successTagStyle = {
  fontFamily: "'Google Sans Mono', monospace",
  fontSize: "9px",
  letterSpacing: "0.3em",
  color: "rgba(162,155,254,0.45)",
  textTransform: "uppercase",
};
const footerStyle = {
  fontFamily: "'Google Sans Mono', monospace",
  fontSize: "9px",
  letterSpacing: "0.2em",
  color: "rgba(237,233,224,0.22)",
  textTransform: "uppercase",
  textAlign: "center",
};
const cardLabelStyle = {
  fontFamily: "'Google Sans Mono', monospace",
  fontSize: "9px",
  letterSpacing: "0.3em",
  textTransform: "uppercase",
  color: "rgba(162,155,254,0.5)",
  marginBottom: "10px",
};
const cardBodyStyle = {
  fontFamily: "'Google Sans', sans-serif",
  fontSize: "13.5px",
  fontWeight: 300,
  lineHeight: 1.8,
  color: "rgba(237,233,224,0.5)",
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
  .rv.d1 { transition-delay: 0.07s; }
  .rv.d2 { transition-delay: 0.17s; }
  .rv.d3 { transition-delay: 0.28s; }

  .eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: 'Google Sans Mono', monospace;
    font-size: 10px; letter-spacing: 0.32em; text-transform: uppercase;
    color: var(--v2);
  }
  .eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--v1); flex-shrink: 0; }

  .stitle {
    font-family: 'Google Sans Display', sans-serif;
    font-weight: 700; letter-spacing: -0.025em; line-height: 1.05;
    background: linear-gradient(155deg, #fff 20%, rgba(255,255,255,0.35) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .vgrad {
    background: linear-gradient(115deg, var(--v2) 0%, var(--v1) 55%, #c4bfff 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .field-wrap { display: flex; flex-direction: column; gap: 8px; }
  .field-label {
    font-family: 'Google Sans Mono', monospace;
    font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
    color: rgba(162,155,254,0.55); transition: color 0.25s;
  }
  .field-label.active { color: var(--v2); }

  .field-input {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px; padding: 14px 18px;
    font-family: 'Google Sans', sans-serif; font-size: 15px; font-weight: 400;
    color: #ede9e0; outline: none; width: 100%;
    transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
  }
  .field-input::placeholder { color: rgba(237,233,224,0.2); }
  .field-input:focus {
    border-color: rgba(108,92,231,0.55); background: rgba(108,92,231,0.05);
    box-shadow: 0 0 0 3px rgba(108,92,231,0.1);
  }

  .field-textarea {
    resize: none; min-height: 140px;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px; padding: 14px 18px;
    font-family: 'Google Sans', sans-serif; font-size: 15px; font-weight: 400;
    color: #ede9e0; outline: none; width: 100%; line-height: 1.7;
    transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
  }
  .field-textarea::placeholder { color: rgba(237,233,224,0.2); }
  .field-textarea:focus {
    border-color: rgba(108,92,231,0.55); background: rgba(108,92,231,0.05);
    box-shadow: 0 0 0 3px rgba(108,92,231,0.1);
  }

  .submit-btn {
    width: 100%; padding: 16px 0;
    background: linear-gradient(135deg, #2d1fa3, var(--v1));
    border: none; border-radius: 6px;
    font-family: 'Google Sans', sans-serif; font-size: 13px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #fff; cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  }
  .submit-btn:hover { box-shadow: 0 4px 15px rgba(108,92,231,0.5); }
  .submit-btn:active { transform: translateY(0); }

  .info-card {
    padding: 24px 28px; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px; background: rgba(255,255,255,0.015);
    position: relative; overflow: hidden; transition: border-color 0.3s;
  }
  .info-card:hover { border-color: rgba(108,92,231,0.3); }
  .info-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(108,92,231,0.6), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .info-card:hover::before { opacity: 1; }

  .success-wrap {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; text-align: center; gap: 20px;
    padding: 64px 32px; border: 1px solid rgba(108,92,231,0.3);
    border-radius: 12px; background: rgba(108,92,231,0.04);
    animation: fadeIn 0.6s ease both;
  }
  @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }

  @media (max-width: 1024px) {
    .contact-section { padding: 72px 40px !important; }
    .contact-body    { grid-template-columns: 1fr 360px !important; gap: 40px !important; }
  }
  @media (max-width: 768px) {
    .contact-section { padding: 56px 24px !important; }
    .contact-header  { margin-bottom: 48px !important; }
    .contact-body    { grid-template-columns: 1fr !important; gap: 40px !important; }
    .contact-info    { position: static !important; }
    .name-email-row  { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 480px) {
    .contact-section { padding: 48px 16px !important; }
    .contact-header  { margin-bottom: 36px !important; }
    .success-wrap    { padding: 48px 20px !important; }
    .info-card       { padding: 20px 20px !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .rv { opacity: 1; transform: none; transition: none; }
    .success-wrap { animation: none; }
  }
`;

// ─── Component ───────────────────────────────────────────────────────────────

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);
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

  // Stable change handler — single handler for all fields via e.target.name
  const handleChange = useCallback(
    (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value })),
    [],
  );

  // Stable focus/blur handlers — avoids creating new arrow functions per field per render
  const handleFocus = useCallback((e) => setFocused(e.target.name), []);
  const handleBlur = useCallback(() => setFocused(null), []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!form.name || !form.email || !form.handle || !form.message) {
        alert("Please fill in all required fields.");
        return;
      }
      const fd = new FormData();
      fd.append("entry.1915139014", form.name);
      fd.append("entry.1747355512", form.email);
      fd.append("entry.1652709457", form.handle);
      fd.append("entry.719818541", form.message);
      try {
        await fetch(GOOGLE_FORM_ACTION, {
          method: "POST",
          mode: "no-cors",
          body: fd,
        });
        setSubmitted(true);
        setForm(EMPTY_FORM);
      } catch (err) {
        console.error("Submission failed:", err);
        alert("Something went wrong. Please try again.");
      }
    },
    [form],
  );

  return (
    <div style={rootStyle}>
      <style>{STYLES}</style>

      <section className="contact-section" style={sectionStyle}>
        {/* Header */}
        <div
          ref={reg("hd")}
          className={`rv contact-header${v("hd") ? " on" : ""}`}
          style={headerStyle}
        >
          <span className="eyebrow">Contact</span>
          <h2 className="stitle" style={h2Style}>
            Let's see what
            <br />
            <span className="vgrad">you're sitting on.</span>
          </h2>
          <p style={subStyle}>
            Tell us a little about your audience and what you do. We'll come
            back with a free monetization gameplan — no strings attached.
          </p>
        </div>

        {/* Two column layout */}
        <div className="contact-body" style={bodyGridStyle}>
          {/* LEFT — Form */}
          <div ref={reg("fm")} className={`rv${v("fm") ? " on" : ""}`}>
            {submitted ? (
              <div className="success-wrap">
                <div style={emojiStyle}>✦</div>
                <h3 style={successH3Style}>We've got your message.</h3>
                <p style={successPStyle}>
                  We'll review your profile and send you a custom monetization
                  gameplan within 48 hours.
                </p>
                <div style={successTagStyle}>— MonetizeTeam</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={formStyle}>
                {/* Name + Email row — rendered from FIELDS slice, no per-render field objects */}
                <div className="name-email-row" style={nameEmailStyle}>
                  {FIELDS.slice(0, 2).map((f) => (
                    <div key={f.name} className="field-wrap">
                      <label
                        className={`field-label${focused === f.name ? " active" : ""}`}
                      >
                        {f.label}
                      </label>
                      <input
                        className="field-input"
                        type={f.type}
                        name={f.name}
                        placeholder={f.placeholder}
                        value={form[f.name]}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        required
                      />
                    </div>
                  ))}
                </div>

                {/* Instagram handle */}
                <div className="field-wrap">
                  <label
                    className={`field-label${focused === "handle" ? " active" : ""}`}
                  >
                    Instagram Handle
                  </label>
                  <input
                    className="field-input"
                    type="text"
                    name="handle"
                    placeholder="@yourhandle"
                    value={form.handle}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                  />
                </div>

                {/* Message */}
                <div className="field-wrap">
                  <label
                    className={`field-label${focused === "message" ? " active" : ""}`}
                  >
                    Message
                  </label>
                  <textarea
                    className="field-textarea"
                    name="message"
                    placeholder="Hi, I am reaching out for..."
                    value={form.message}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Send Message →
                </button>

                <p style={footerStyle}>
                  We respond within 48 hours · No spam · Ever
                </p>
              </form>
            )}
          </div>

          {/* RIGHT — Info cards */}
          <div
            ref={reg("inf")}
            className={`rv d2 contact-info${v("inf") ? " on" : ""}`}
            style={infoColStyle}
          >
            {INFO_CARDS.map((card) => (
              <div key={card.label} className="info-card">
                <div style={cardLabelStyle}>{card.label}</div>
                <p style={cardBodyStyle}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
