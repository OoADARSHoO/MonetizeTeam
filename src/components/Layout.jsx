import Navbar from "./Navbar";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Contact from "../sections/Contact";
import Ready from "../sections/Ready";
import Footer from "./Footer";
import Approach from "../sections/Approach";
import SmoothScroll from "../elements/SmoothScroll";

const Layout = () => {
  return (
    <>
      {/* GSAP smooth engine */}
      <SmoothScroll />

      {/* FIXED ELEMENTS OUTSIDE */}
      <Navbar />

      {/* GSAP SCROLL WRAPPER */}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* ✅ FIX: added id="home" so the Home nav link has a target */}
            <section id="home">
              <Hero />
            </section>

            <section id="about">
              <About />
            </section>

            <section id="approach">
              <Approach />
            </section>
            <Ready />

            <section id="contact">
              <Contact />
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
