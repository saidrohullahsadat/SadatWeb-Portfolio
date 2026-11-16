import ThemeToggle from "./ThemeToggle";

export default function TopHeader() {
  return (
    <header className="top-header">
      <p className="welcome">Hi, Welcome!</p>
      <div className="header-actions">
        <ThemeToggle />
        <span className="availability"><span className="dot" />Available for opportunities</span>
        <a className="btn primary header-contact" href="#contact">Contact Me</a>
      </div>
    </header>
  );
}
