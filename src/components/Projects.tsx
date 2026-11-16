import { useEffect, useRef, useState } from "react";
import { projects, type Category, type Project } from "../data/projects";

const projectImageUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const categories: Category[] = ["Frontend", "Backend", "Full-Stack"];
const cats: ("All" | Category)[] = ["All", ...categories.filter((category) => projects.some((project) => project.category === category))];
export default function Projects() {
  const [cat, setCat] = useState<"All" | Category>("All");
  const [sel, setSel] = useState<Project | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const selectedImages = sel?.images ?? (sel?.image ? [sel.image] : []);
  useEffect(() => { if (sel && !dlg.current?.open) dlg.current?.showModal(); }, [sel]);
  return (
    <section id="projects"><div className="wrap">
      <div className="sec-h reveal"><h2>Featured Projects</h2><p>Selected projects demonstrating my software development skills.</p></div>
      <div className="filters" role="group" aria-label="Filter projects">
        {cats.map((c) => <button key={c} aria-pressed={c === cat} onClick={() => setCat(c)}>{c === "All" ? "All Projects" : c}</button>)}
      </div>
      <div className="cols">
        {projects.filter((p) => cat === "All" || p.category === cat).map((p) => (
          <article key={p.title} className="glass card proj">
            <div className="shot">
              {p.images?.[0]
                ? <img src={projectImageUrl(p.images[0])} alt={`${p.title} project preview`} loading="lazy" decoding="async" />
                : p.image
                  ? <img src={projectImageUrl(p.image)} alt={`${p.title} project preview`} loading="lazy" decoding="async" />
                : <span aria-hidden="true">{p.title[0]}</span>}
            </div>
            <h3>{p.title} — {p.subtitle}</h3><p>{p.description}</p>
            <div className="chips">{p.tech.map((t) => <span className="chip" key={t}>{t}</span>)}{p.status && <span className="chip st">{p.status}</span>}</div>
            <div className="acts">
              <button className="btn" type="button" onClick={() => setSel(p)}>View Details</button>
              {p.live && <a className="btn primary" href={p.live} target="_blank" rel="noopener noreferrer">Live Demo</a>}
              {p.repo && <a className="btn" href={p.repo} target="_blank" rel="noopener noreferrer">GitHub</a>}
            </div>
          </article>
        ))}
      </div>
      <dialog ref={dlg} aria-labelledby="project-dialog-title" aria-describedby="project-dialog-description" onClose={() => setSel(null)}>
        {sel && <><h3 id="project-dialog-title">{sel.title} — {sel.subtitle}</h3>{selectedImages.length > 0 && <div className="project-image-gallery">{selectedImages.map((image, index) => <img className="project-detail-image" src={projectImageUrl(image)} alt={`${sel.title} screenshot ${index + 1}`} loading="lazy" decoding="async" key={image} />)}</div>}<p id="project-dialog-description" className="muted" style={{ marginTop: 8 }}>{sel.description}</p>
          <p style={{ marginTop: 10 }}><strong>Category:</strong> {sel.category}{sel.status && <> · <strong>Status:</strong> {sel.status}</>}</p>
          <div className="chips" style={{ margin: "10px 0 16px" }}>{sel.tech.map((t) => <span className="chip" key={t}>{t}</span>)}</div></>}
        <button className="btn primary" type="button" onClick={() => dlg.current?.close()}>Close</button>
      </dialog>
    </div></section>
  );
}
