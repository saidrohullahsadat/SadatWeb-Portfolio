import { useEffect, useState } from "react";
import { navigationLinks } from "../data/navigation";

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = navigationLinks
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    if (!sections.length) return;
    const Observer = globalThis.IntersectionObserver;

    const updateFromScrollPosition = () => {
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        setActiveSection(sections[sections.length - 1]!.id);
        return;
      }

      const activationLine = 140;
      const currentSection = [...sections]
        .reverse()
        .find((section) => section.getBoundingClientRect().top <= activationLine);
      setActiveSection(currentSection?.id ?? sections[0]!.id);
    };

    if (typeof Observer !== "function") {
      window.addEventListener("scroll", updateFromScrollPosition, { passive: true });
      updateFromScrollPosition();
      return () => window.removeEventListener("scroll", updateFromScrollPosition);
    }

    const observer = new Observer(
      () => updateFromScrollPosition(),
      { rootMargin: "-140px 0px -65% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", updateFromScrollPosition, { passive: true });
    updateFromScrollPosition();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateFromScrollPosition);
    };
  }, []);

  return activeSection;
}
