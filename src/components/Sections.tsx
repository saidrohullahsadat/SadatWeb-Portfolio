import { EMAIL, aboutFacts, process, services, skills } from "../data/content";
import type { ReactNode } from "react";

const CV_DOWNLOAD_URL = `${import.meta.env.BASE_URL}sayed-rohullah-sadat-cv.pdf`;

const Head = ({ title, sub }: { title: string; sub?: string }) => <div className="sec-h reveal"><h2>{title}</h2>{sub && <p>{sub}</p>}</div>;
const Sec = ({ id, children }: { id?: string; children: ReactNode }) => <section id={id}><div className="wrap">{children}</div></section>;

export const Hero = () => (
  <section className="hero" id="home"><div className="wrap grid">
    <div>
      <p className="eyebrow">HELLO, I’M</p>
      <h1>Sayed Rohullah Sadat</h1>
      <h2>Full-Stack Developer &amp; Software Engineer</h2>
      <p>I build modern web applications and scalable software solutions, combining clean user interfaces with reliable backend systems.</p>
      <p>Passionate about software engineering, system architecture, database design, and solving real-world problems through technology.</p>
      <div className="cta"><a className="btn primary" href="#projects">Explore My Projects</a><a className="btn" href={CV_DOWNLOAD_URL} download="Sayed-Rohullah-Sadat-CV.pdf">Download My CV</a><a className="text-link" href="#contact">Let’s Talk →</a></div>
      <span className="glass status"><span className="dot" />Open to Software Development Opportunities</span>
    </div>
    <div className="visual">
      <figure className="profile-frame glass">
        <img src={`${import.meta.env.BASE_URL}images/profile-photo.jpeg`} alt="Portrait of Sayed Rohullah Sadat" />
        <figcaption className="profile-caption">
          <strong>Sayed Rohullah Sadat</strong>
          <span>Full-Stack Developer</span>
        </figcaption>
      </figure>
    </div>
  </div></section>
);
export const About = () => (
  <Sec id="about"><Head title="About Me" sub="Building technology with purpose." />
    <div className="about">
      <div className="glass surface card reveal"><p>I am a Computer Science student at Herat University with a strong interest in software engineering and full-stack development.</p><br /><p>My focus is on developing modern, scalable, and maintainable applications. I enjoy working across frontend and backend technologies, designing database structures, building APIs, and solving practical software problems.</p><br /><p>I continuously improve my engineering knowledge through hands-on projects, experimentation, and learning modern development technologies.</p></div>
      <div className="glass card reveal"><dl className="facts">{aboutFacts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></div>
    </div></Sec>
);
export const Skills = () => (
  <Sec id="skills"><Head title="Technical Expertise" sub="Technologies and tools I use to build software." />
    <div className="cols">{Object.entries(skills).map(([k, v]) => <div className="glass card reveal" key={k}><h3>{k}</h3><div className="chips">{v.map((s) => <span className="chip" key={s}>{s}</span>)}</div></div>)}</div></Sec>
);
export const Experience = () => (
  <Sec id="experience"><Head title="Experience & Professional Journey" sub="Hands-on experience gained through personal projects." />
    <div className="glass surface card reveal"><h3>Personal Software Projects</h3><p className="muted">No formal employment is listed here. My practical experience comes from building and deploying personal projects:</p>
      <ul className="muted" style={{ paddingLeft: 20, marginTop: 10 }}><li>Full-stack application development</li><li>Database design and implementation</li><li>REST API development</li><li>Frontend interface development</li><li>Deployment and debugging</li></ul></div></Sec>
);
export const Education = () => (
  <Sec id="education"><Head title="Education" />
    <div className="glass surface card reveal"><h3>Computer Science — Herat University</h3><p className="muted">Currently studying.</p></div></Sec>
);
export const Services = () => (
  <Sec id="services"><Head title="What I Can Help With" /><div className="cols">{services.map(([t, d]) => <div className="glass card reveal" key={t}><h3>{t}</h3><p>{d}</p></div>)}</div></Sec>
);
export const Process = () => (
  <Sec id="process"><Head title="How I Build Software" /><div className="cols steps">{process.map(([t, d]) => <div className="glass card reveal" key={t}><h3>{t}</h3><p>{d}</p></div>)}</div></Sec>
);
export const GitHub = () => (
  <Sec id="github"><Head title="Development Activity" />
    <div className="glass surface card reveal"><p className="muted">See my public repositories and contribution activity directly on GitHub.</p><br /><a className="btn primary" href="https://github.com/saidrohullahsadat" target="_blank" rel="noopener noreferrer">View GitHub Profile</a></div></Sec>
);
export const Footer = () => (
  <footer><div className="wrap">
    <strong>SadatWeb</strong> · Sayed Rohullah Sadat
    <p className="muted">Building Software. Solving Problems. Engineering Better Solutions.</p>
    <div className="row"><a href="#about">About</a><a href="#projects">Projects</a><a href="#contact">Contact</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div>
    <p className="muted">© {new Date().getFullYear()} SadatWeb. All rights reserved.</p>
    <a href="#home" className="btn" style={{ marginTop: 12 }}>↑ Back to top</a>
  </div></footer>
);
