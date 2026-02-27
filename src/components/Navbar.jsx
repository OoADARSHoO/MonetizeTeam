import { useState, useEffect, useCallback, memo } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import logo from "../assets/images/white.png";
import Button from "../elements/Button";

gsap.registerPlugin(ScrollToPlugin, ScrollSmoother);

const LINKS = ["Home", "About", "Approach", "Contact"];

const STYLES = `
  .navbar-wrapper {
    position: fixed;
    top: 30px;
    left: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    padding: 0 24px;
  }
  .navbar {
    width: 100%;
    max-width: 1300px;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 0 32px;
    height: 65px;
    border-radius: 999px;
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 4px 32px rgba(0,0,0,0.25);
  }
  .navbar-brand {
    display: flex;
    align-items: center;
    text-decoration: none;
  }
  .navbar-logo {
    height: 28px;
    margin-top: 8px;
    width: auto;
    object-fit: contain;
  }
  .navbar-links {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 22px;
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
  }
  .navbar-links li {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .navbar-links a {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 1rem;
    font-weight: 500;
    color: rgba(255,255,255,0.85);
    text-decoration: none;
    padding: 0 6px;
    transition: color 0.25s ease;
    cursor: pointer;
  }
  .navbar-links a::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 12px;
    width: 100%;
    height: 2px;
    background: #ffffff;
    border-radius: 999px;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  .navbar-links a:hover { color: #ffffff; }
  .navbar-links a:hover::after { transform: scaleX(1); }
  .navbar-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    margin: -8px;
    -webkit-tap-highlight-color: transparent;
  }
  .hamburger span {
    display: block;
    width: 22px;
    height: 1.5px;
    background: #fff;
    border-radius: 2px;
    transition: transform 0.3s cubic-bezier(0.76,0,0.24,1), opacity 0.3s;
  }
  .hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
  .mobile-menu {
    position: fixed;
    inset: 0;
    z-index: 999;
    background: rgba(10,8,30,0.97);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    transform: translateY(-100%);
    transition: transform 0.4s cubic-bezier(0.76,0,0.24,1);
    pointer-events: none;
  }
  .mobile-menu.open {
    transform: translateY(0);
    pointer-events: all;
  }
  .mobile-menu a {
    font-size: 2rem;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    text-decoration: none;
    transition: color 0.2s;
    cursor: pointer;
  }
  .mobile-menu a:hover { color: #fff; }
  .mobile-cta { margin-top: 8px; }
  @media (max-width: 900px) {
    .navbar { padding: 0 24px; }
    .navbar-links { gap: 14px; }
    .navbar-links a { font-size: 0.9rem; }
  }
  @media (max-width: 720px) {
    .navbar { grid-template-columns: 1fr auto; padding: 0 24px; }
    .navbar-links, .navbar-right { display: none; }
    .hamburger { display: flex; }
  }
  @media (max-width: 480px) {
    .navbar-wrapper { top: 16px; padding: 0 16px; }
    .navbar { height: 56px; padding: 0 20px; }
    .navbar-logo { height: 22px; margin-top: 4px; }
    .mobile-menu a { font-size: 1.75rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .mobile-menu { transition: none; }
    .hamburger span { transition: none; }
  }
`;

// Inject styles once at module level — avoids re-injecting on every render
if (
  typeof document !== "undefined" &&
  !document.getElementById("navbar-styles")
) {
  const styleTag = document.createElement("style");
  styleTag.id = "navbar-styles";
  styleTag.textContent = STYLES;
  document.head.appendChild(styleTag);
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = useCallback((e, id) => {
    e.preventDefault();
    setMenuOpen(false);
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

  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <div className="navbar-wrapper">
        <nav className="navbar">
          <a
            href="#home"
            className="navbar-brand"
            onClick={(e) => handleNavClick(e, "home")}
          >
            <img
              src={logo}
              alt="Logo"
              className="navbar-logo"
              width={120}
              height={28}
            />
          </a>

          <ul className="navbar-links">
            {LINKS.map((l) => {
              const id = l.toLowerCase();
              return (
                <li key={l}>
                  <a href={`#${id}`} onClick={(e) => handleNavClick(e, id)}>
                    {l}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="navbar-right">
            <Button iconSize={18} fontSize="0.85em" />
          </div>

          <button
            className={`hamburger${menuOpen ? " open" : ""}`}
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </nav>
      </div>

      <div
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        {LINKS.map((l) => {
          const id = l.toLowerCase();
          return (
            <a key={l} href={`#${id}`} onClick={(e) => handleNavClick(e, id)}>
              {l}
            </a>
          );
        })}
        <div className="mobile-cta">
          <Button iconSize={18} fontSize="0.9em" onClick={closeMenu} />
        </div>
      </div>
    </>
  );
};

export default memo(Navbar);
