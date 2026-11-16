import { useState, type FormEvent } from "react";
import { EMAIL, socials } from "../data/content";
type F = { name: string; email: string; subject: string; message: string };
const check = (f: F): Partial<F> => {
  const e: Partial<F> = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) e.email = "Enter a valid email address.";
  if (f.subject.trim().length < 3) e.subject = "Please add a subject.";
  if (f.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
  return e;
};
export default function Contact() {
  const [f, setF] = useState<F>({ name: "", email: "", subject: "", message: "" });
  const [hp, setHp] = useState("");
  const [err, setErr] = useState<Partial<F>>({});
  const [msg, setMsg] = useState("No server is connected. Submitting opens your email app with the message prefilled.");
  const [copied, setCopied] = useState("Copy Email");
  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    if (hp) return;
    const e = check(f); setErr(e);
    if (Object.keys(e).length) return;
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(f.subject)}&body=${encodeURIComponent(`${f.message}\n\n— ${f.name} (${f.email})`)}`;
    setMsg("If your email app did not open, email me directly at " + EMAIL + ".");
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setCopied("Copied ✓"); } catch { setCopied("Copy failed"); }
    setTimeout(() => setCopied("Copy Email"), 2000);
  };
  const field = (k: keyof F, label: string, area = false) => (
    <label>{label}
      {area ? <textarea rows={5} value={f[k]} required aria-invalid={!!err[k]} aria-describedby={`${k}-error`} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
        : <input type={k === "email" ? "email" : "text"} value={f[k]} required aria-invalid={!!err[k]} aria-describedby={`${k}-error`} autoComplete={k === "name" ? "name" : k === "email" ? "email" : "off"} onChange={(e) => setF({ ...f, [k]: e.target.value })} />}
      <span className="err" id={`${k}-error`}>{err[k]}</span>
    </label>
  );
  return (
    <section id="contact"><div className="wrap">
      <div className="sec-h reveal"><h2>Let’s Build Something Together</h2><p>Have a project, job opportunity, or collaboration in mind? I would be happy to hear from you.</p></div>
      <div className="contact">
        <form className="glass reveal" onSubmit={submit} noValidate>
          {field("name", "Full Name")}{field("email", "Email Address")}{field("subject", "Subject")}{field("message", "Message", true)}
          <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} />
          <button className="btn primary" type="submit">Send via Email App</button>
          <p className="muted" role="status" style={{ fontSize: ".85rem" }}>{msg}</p>
        </form>
        <div className="glass card reveal"><h3>Connect With Me</h3>
          <p className="muted">SadatWeb · {EMAIL} · 0798116566</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
            <a className="btn" href={`mailto:${EMAIL}`}>Email Me</a>
            <button className="btn" type="button" onClick={copy}>{copied}</button>
            <a className="btn" href="https://wa.me/93798116566" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a className="btn" href="https://t.me/sayedsadat143" target="_blank" rel="noopener noreferrer">Telegram</a>
          </div>
          <div className="soc">{socials.map(([n, u]) => <a key={n} className="glass" href={u} target="_blank" rel="noopener noreferrer" title={n} aria-label={`${n} profile`}>{n}</a>)}</div>
        </div>
      </div>
    </div></section>
  );
}
