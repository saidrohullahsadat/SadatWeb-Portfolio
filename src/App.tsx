import { useEffect } from "react";
import SidebarNavigation from "./components/SidebarNavigation";
import MobileNavigation from "./components/MobileNavigation";
import TopHeader from "./components/TopHeader";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import { About, Education, Experience, Footer, GitHub, Hero, Process, Services, Skills } from "./components/Sections";
import { useActiveSection } from "./hooks/useActiveSection";

export default function App() {
  const activeSection = useActiveSection();

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="site-shell">
      <SidebarNavigation activeSection={activeSection} />
      <div className="portfolio-panel glass">
        <TopHeader />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Education />
          <Services />
          <Process />
          <GitHub />
          <Contact />
        </main>
        <Footer />
      </div>
      <MobileNavigation activeSection={activeSection} />
    </div>
  );
}
