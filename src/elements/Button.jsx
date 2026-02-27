import { useCallback, useMemo, memo } from "react";

// Moved outside component — created once, never recreated
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap');

.btn-wrapper{position:relative;display:inline-block}

.btn{
  --border-radius:24px;--padding:4px;--transition:0.4s;
  --button-color:#101010;--highlight-color-hue:210deg;
  user-select:none;display:flex;align-items:center;
  justify-content:center;padding:0.5em 0.5em 0.5em 1.1em;
  font-family:"Poppins","Inter","Segoe UI",sans-serif;
  font-size:1em;font-weight:400;background-color:var(--button-color);
  white-space:nowrap;min-height:44px;
  box-shadow:
    inset 0px 1px 1px rgba(255,255,255,0.2),
    inset 0px 2px 2px rgba(255,255,255,0.15),
    inset 0px 4px 4px rgba(255,255,255,0.1),
    inset 0px 8px 8px rgba(255,255,255,0.05),
    inset 0px 16px 16px rgba(255,255,255,0.05),
    0px -1px 1px rgba(0,0,0,0.02),0px -2px 2px rgba(0,0,0,0.03),
    0px -4px 4px rgba(0,0,0,0.05),0px -8px 8px rgba(0,0,0,0.06),
    0px -16px 16px rgba(0,0,0,0.08);
  border:solid 1px #fff2;border-radius:var(--border-radius);
  cursor:pointer;outline:none;
  /* Use will-change to hint compositor for animated properties */
  will-change:box-shadow,border,background-color;
  transition:box-shadow var(--transition),border var(--transition),background-color var(--transition)
}

.btn--navbar{font-size:clamp(0.78rem,0.5vw + 0.6rem,0.88rem);padding:0.42em 0.42em 0.42em 0.9em;min-height:38px}
.btn--hero{
  font-size:clamp(1rem,1vw + 0.7rem,1.25rem);
  padding:clamp(0.5em,1vw + 0.1em,0.65em) clamp(0.5em,1vw + 0.1em,0.65em) clamp(0.5em,1vw + 0.1em,0.65em) clamp(0.9em,1.2vw + 0.4em,1.2em);
  min-height:52px
}
.btn--mobile-menu{font-size:clamp(0.92rem,2.5vw + 0.3rem,1.05rem);padding:0.5em 0.5em 0.5em 1em;min-height:48px}

.btn::before{
  content:"";position:absolute;
  top:calc(0px - var(--padding));left:calc(0px - var(--padding));
  width:calc(100% + var(--padding)*2);height:calc(100% + var(--padding)*2);
  border-radius:calc(var(--border-radius) + var(--padding));
  pointer-events:none;
  background-image:linear-gradient(0deg,#0004,#000a);
  z-index:-1;
  transition:box-shadow var(--transition),filter var(--transition);
  box-shadow:
    0 -8px 8px -6px #0000 inset,0 -16px 16px -8px #00000000 inset,
    1px 1px 1px #fff2,2px 2px 2px #fff1,-1px -1px 1px #0002,-2px -2px 2px #0001
}

.btn::after{
  content:"";position:absolute;top:0;left:0;width:100%;height:100%;
  border-radius:inherit;pointer-events:none;
  background-image:linear-gradient(0deg,#fff,hsl(var(--highlight-color-hue),100%,70%),hsla(var(--highlight-color-hue),100%,70%,50%),8%,transparent);
  background-position:0 0;opacity:0;
  transition:opacity 0.6s ease,filter 0.6s ease,mask-image var(--transition)
}

/* Use transform for GPU-accelerated animation instead of opacity alone where possible */
.btn-svg{
  flex-shrink:0;height:1.25em;width:1.25em;margin-right:0.45em;
  fill:#e8e8e8;
  animation:flicker 2s linear infinite;animation-delay:0.5s;
  filter:drop-shadow(0 0 2px #fff9);
  transition:fill var(--transition),filter var(--transition),opacity var(--transition)
}

@keyframes flicker{50%{opacity:0.3}}

.btn-letter{
  position:relative;display:inline-block;color:#fff5;
  animation:letter-anim 2s ease-in-out infinite;
  transition:color var(--transition),text-shadow var(--transition),opacity var(--transition)
}

@keyframes letter-anim{50%{text-shadow:0 0 3px #fff8;color:#fff}}

.txt-wrapper{position:relative;display:flex;align-items:center;min-width:6.4em}
.txt-1,.txt-2{position:absolute}
.txt-1{animation:appear-anim 1s ease-in-out forwards}
.txt-2{opacity:0}

@keyframes appear-anim{0%{opacity:0}100%{opacity:1}}

.btn:focus .txt-1{animation:opacity-anim 0.3s ease-in-out forwards;animation-delay:1s}
.btn:focus .txt-2{animation:opacity-anim 0.3s ease-in-out reverse forwards;animation-delay:1s}

@keyframes opacity-anim{0%{opacity:1}100%{opacity:0}}

.btn:focus .btn-letter{
  animation:focused-letter-anim 1s ease-in-out forwards,letter-anim 1.2s ease-in-out infinite;
  animation-delay:0s,1s
}

@keyframes focused-letter-anim{
  0%,100%{filter:blur(0px)}
  50%{transform:scale(2);filter:blur(10px) brightness(150%) drop-shadow(-36px 12px 12px hsl(var(--highlight-color-hue),100%,70%))}
}

.btn:focus .btn-svg{animation-duration:1.2s;animation-delay:0.2s}

.btn:focus::before{
  box-shadow:
    0 -8px 12px -6px #fff3 inset,
    0 -16px 16px -8px hsla(var(--highlight-color-hue),100%,70%,20%) inset,
    1px 1px 1px #fff3,2px 2px 2px #fff1,-1px -1px 1px #0002,-2px -2px 2px #0001
}

.btn:focus::after{opacity:0.6;mask-image:linear-gradient(0deg,#fff,transparent);filter:brightness(100%)}

.btn-letter:nth-child(1){animation-delay:0s}.btn-letter:nth-child(2){animation-delay:0.08s}
.btn-letter:nth-child(3){animation-delay:0.16s}.btn-letter:nth-child(4){animation-delay:0.24s}
.btn-letter:nth-child(5){animation-delay:0.32s}.btn-letter:nth-child(6){animation-delay:0.4s}
.btn-letter:nth-child(7){animation-delay:0.48s}.btn-letter:nth-child(8){animation-delay:0.56s}
.btn-letter:nth-child(9){animation-delay:0.64s}.btn-letter:nth-child(10){animation-delay:0.72s}
.btn-letter:nth-child(11){animation-delay:0.8s}.btn-letter:nth-child(12){animation-delay:0.88s}
.btn-letter:nth-child(13){animation-delay:0.96s}

.btn:focus .btn-letter:nth-child(1){animation-delay:0s,1s}.btn:focus .btn-letter:nth-child(2){animation-delay:0.08s,1s}
.btn:focus .btn-letter:nth-child(3){animation-delay:0.16s,1s}.btn:focus .btn-letter:nth-child(4){animation-delay:0.24s,1s}
.btn:focus .btn-letter:nth-child(5){animation-delay:0.32s,1s}.btn:focus .btn-letter:nth-child(6){animation-delay:0.4s,1s}
.btn:focus .btn-letter:nth-child(7){animation-delay:0.48s,1s}.btn:focus .btn-letter:nth-child(8){animation-delay:0.56s,1s}
.btn:focus .btn-letter:nth-child(9){animation-delay:0.64s,1s}.btn:focus .btn-letter:nth-child(10){animation-delay:0.72s,1s}
.btn:focus .btn-letter:nth-child(11){animation-delay:0.8s,1s}.btn:focus .btn-letter:nth-child(12){animation-delay:0.88s,1s}
.btn:focus .btn-letter:nth-child(13){animation-delay:0.96s,1s}

.btn:active{border:solid 1px hsla(var(--highlight-color-hue),100%,80%,70%);background-color:hsla(var(--highlight-color-hue),50%,20%,0.5)}
.btn:active::before{
  box-shadow:
    0 -8px 12px -6px #fffa inset,
    0 -16px 16px -8px hsla(var(--highlight-color-hue),100%,70%,80%) inset,
    1px 1px 1px #fff4,2px 2px 2px #fff2,-1px -1px 1px #0002,-2px -2px 2px #0001
}
.btn:active::after{opacity:1;mask-image:linear-gradient(0deg,#fff,transparent);filter:brightness(200%)}
.btn:active .btn-letter{text-shadow:0 0 1px hsla(var(--highlight-color-hue),100%,90%,90%);animation:none}

.btn:hover{
  border:solid 1px hsla(var(--highlight-color-hue),100%,80%,40%);
  transition:box-shadow 0.6s ease,border 0.6s ease,background-color var(--transition)
}
.btn:hover::before{
  box-shadow:
    0 -8px 8px -6px #fffa inset,
    0 -16px 16px -8px hsla(var(--highlight-color-hue),100%,70%,30%) inset,
    1px 1px 1px #fff2,2px 2px 2px #fff1,-1px -1px 1px #0002,-2px -2px 2px #0001;
  transition:box-shadow 0.6s ease,filter 0.6s ease
}
.btn:hover::after{opacity:1;mask-image:linear-gradient(0deg,#fff,transparent)}
.btn:hover .btn-svg{fill:#fff;filter:drop-shadow(0 0 3px hsl(var(--highlight-color-hue),100%,70%)) drop-shadow(0 -4px 6px #0009);animation:none}

@media (hover:none) and (pointer:coarse){
  .btn:hover{border:solid 1px #fff2}
  .btn:hover::before{
    box-shadow:
      0 -8px 8px -6px #0000 inset,0 -16px 16px -8px #00000000 inset,
      1px 1px 1px #fff2,2px 2px 2px #fff1,-1px -1px 1px #0002,-2px -2px 2px #0001
  }
  .btn:hover::after{opacity:0}
  .btn:hover .btn-svg{fill:#e8e8e8;filter:drop-shadow(0 0 2px #fff9);animation:flicker 2s linear infinite;animation-delay:0.5s}
}

@media (prefers-reduced-motion:reduce){
  .btn-letter,.btn-svg,.txt-1,.btn:focus .btn-letter{animation:none !important}
  .btn-letter{color:#fff8}
  .btn-svg{opacity:1;fill:#e8e8e8}
  .txt-1{opacity:1}
  .btn,.btn::before,.btn::after{transition:none !important}
}
`;

// Inject styles once into <head> — avoids re-injecting on every render
let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = styles;
  document.head.appendChild(el);
  stylesInjected = true;
}

// Memoized static icon — never re-renders
const PhoneIcon = memo(() => (
  <svg
    className="btn-svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
    />
  </svg>
));
PhoneIcon.displayName = "PhoneIcon";

// Memoized letter spans — stable key by index is fine here (static text)
const AnimatedText = memo(({ text }) =>
  text.split("").map((char, i) => (
    <span key={i} className="btn-letter">
      {char === " " ? "\u00A0" : char}
    </span>
  )),
);
AnimatedText.displayName = "AnimatedText";

// Variant → CSS class map — computed once at module level
const VARIANT_CLASS = {
  navbar: " btn--navbar",
  hero: " btn--hero",
  "mobile-menu": " btn--mobile-menu",
};

export default function Button({
  variant = "default",
  label = "Book A Call",
  href = "https://calendly.com/monetizeteam-business/30min",
  onClick,
  style = {},
}) {
  // Inject stylesheet once on first render (no style tag in JSX tree)
  injectStyles();

  // Stable class string — recomputed only when variant changes
  const btnClass = useMemo(
    () => `btn${VARIANT_CLASS[variant] ?? ""}`,
    [variant],
  );

  // Stable callback — recreated only when href/onClick change
  const handleClick = useCallback(() => {
    window.open(href, "_blank", "noopener,noreferrer");
    onClick?.();
  }, [href, onClick]);

  return (
    <div className="btn-wrapper" style={style}>
      <button className={btnClass} onClick={handleClick}>
        <PhoneIcon />
        <div className="txt-wrapper">
          <div className="txt-1">
            <AnimatedText text={label} />
          </div>
          <div className="txt-2">
            <AnimatedText text={label} />
          </div>
        </div>
      </button>
    </div>
  );
}
