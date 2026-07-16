import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, PinIcon } from "lucide-react";
import { signup } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, getPasswordIssues, sanitizeText } from "../utils/validation";
import Field from "../components/Field";
import PageTransition from "../components/PageTransition";

export default function Signup() {
  const [form, setForm]             = useState({ name: "", email: "", password: "", location: "" });
  const [errors, setErrors]         = useState({});
  const [showPw, setShowPw]         = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate   = useNavigate();
  const { loginUser } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!isValidEmail(form.email)) next.email = "Enter a valid email address";
    const pwIssues = getPasswordIssues(form.password);
    if (pwIssues.length) next.password = `Missing: ${pwIssues.join(", ")}`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate() || submitting) return;
    setSubmitting(true);
    try {
      const res = await signup({
        name:     sanitizeText(form.name, 100),
        email:    sanitizeText(form.email, 254),
        password: form.password,
        location: sanitizeText(form.location, 120),
      });
      loginUser(res.data.user, res.data.token);
      navigate("/browse");
    } catch (err) {
      setServerError(err.response?.data?.message || "Couldn't create your account. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const pwStrength = form.password.length === 0 ? 0
    : getPasswordIssues(form.password).length === 0 ? 3
    : form.password.length >= 6 ? 2 : 1;

  return (
    <PageTransition>
      <div className="auth-page">
        {/* Left panel */}
        <div className="auth-panel-left">
          <div className="auth-panel-content">
            <div className="auth-brand">
              <div className="auth-brand-icon"><PinIcon size={18} strokeWidth={2.5} /></div>
              <span>SkillSwap</span>
            </div>
            <h2 className="auth-panel-h2">Join your local skill exchange</h2>
            <p className="auth-panel-sub">
              Post what you can teach, discover what you want to learn, and swap skills with people nearby — no money needed.
            </p>
            <ul className="auth-perks">
              <li><span className="perk-dot" />Free forever, no credit card</li>
              <li><span className="perk-dot" />Connect with people nearby</li>
              <li><span className="perk-dot" />30+ skill categories</li>
              <li><span className="perk-dot" />Secure private messaging</li>
            </ul>
          </div>
        </div>

        {/* Right: form */}
        <div className="auth-panel-right">
          <motion.div
            className="auth-form-wrap"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <span className="eyebrow-teal">Get started</span>
            <h1 className="auth-h1">Create your account</h1>
            <p className="auth-desc">It takes under a minute. No payment needed.</p>

            {serverError && <div className="alert alert-error" role="alert">{serverError}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <Field label="Full name" htmlFor="name" error={errors.name}>
                <input id="name" name="name" type="text" autoComplete="name" maxLength={100}
                  placeholder="Your name"
                  className={`input${errors.name ? " has-error" : ""}`}
                  value={form.name} onChange={handleChange} />
              </Field>

              <Field label="Email" htmlFor="email" error={errors.email}>
                <input id="email" name="email" type="email" autoComplete="email" maxLength={254}
                  placeholder="you@example.com"
                  className={`input${errors.email ? " has-error" : ""}`}
                  value={form.email} onChange={handleChange} />
              </Field>

              <Field label="Password" htmlFor="password" error={errors.password}
                hint={!errors.password ? "8+ characters, a letter and a number" : undefined}>
                <div className="password-wrap">
                  <input id="password" name="password" type={showPw ? "text" : "password"}
                    autoComplete="new-password" maxLength={128}
                    className={`input${errors.password ? " has-error" : ""}`}
                    value={form.password} onChange={handleChange} />
                  <button type="button" className="password-toggle"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}>
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {form.password.length > 0 && (
                  <div className="pw-strength">
                    {[1,2,3].map((n) => (
                      <div key={n} className={`pw-bar ${pwStrength >= n ? (pwStrength === 3 ? "strong" : pwStrength === 2 ? "medium" : "weak") : ""}`} />
                    ))}
                    <span className="pw-label">
                      {pwStrength === 3 ? "Strong" : pwStrength === 2 ? "Medium" : "Weak"}
                    </span>
                  </div>
                )}
              </Field>

              <Field label="City / neighbourhood" htmlFor="location"
                hint="Neighbourhood-level only — never your exact address">
                <input id="location" name="location" type="text" maxLength={120}
                  placeholder="e.g. Rawalpindi, Satellite Town"
                  className="input" value={form.location} onChange={handleChange} />
              </Field>

              <motion.button whileTap={{ scale: 0.97 }} type="submit"
                className="btn btn-primary btn-block" style={{ marginTop: "var(--space-2)" }}
                disabled={submitting}>
                {submitting ? "Creating account…" : "Create free account"}
              </motion.button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </motion.div>
        </div>
      </div>

      <style>{`
        .auth-page {
          display: grid; grid-template-columns: 1fr 1fr;
          min-height: calc(100vh - 66px);
        }
        .auth-panel-left {
          background: var(--board);
          background-image: radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.06) 0, transparent 60%),
                            radial-gradient(ellipse at 80% 80%, rgba(0,0,0,0.18) 0, transparent 50%);
          display: flex; align-items: center; justify-content: center;
          padding: var(--space-8) var(--space-7);
        }
        .auth-panel-content { max-width: 380px; color: var(--paper-raised); }
        .auth-brand { display: flex; align-items: center; gap: 10px; margin-bottom: var(--space-6); }
        .auth-brand-icon { width: 36px; height: 36px; border-radius: var(--radius-md); background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; }
        .auth-brand span { font-family: var(--font-display); font-weight: 700; font-size: 1.25rem; }
        .auth-panel-h2 { color: var(--paper-raised); font-size: 1.8rem; margin-bottom: var(--space-3); line-height: 1.2; }
        .auth-panel-sub { color: rgba(240,236,224,0.7); font-size: 0.97rem; line-height: 1.65; margin-bottom: var(--space-6); }
        .auth-perks { display: flex; flex-direction: column; gap: var(--space-3); }
        .auth-perks li { display: flex; align-items: center; gap: var(--space-3); font-size: 0.93rem; color: rgba(240,236,224,0.85); }
        .perk-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--gold-light); flex-shrink: 0; }
        .auth-panel-right { display: flex; align-items: center; justify-content: center; padding: var(--space-7) var(--space-6); background: var(--paper); overflow-y: auto; }
        .auth-form-wrap { width: 100%; max-width: 400px; }
        .auth-h1 { font-size: 2rem; margin: var(--space-2) 0 var(--space-2); }
        .auth-desc { color: var(--ink-soft); font-size: 0.95rem; margin-bottom: var(--space-5); }
        .auth-switch { margin-top: var(--space-5); font-size: 0.9rem; text-align: center; color: var(--ink-soft); }
        .auth-switch a { font-weight: 600; }
        .eyebrow-teal { display: block; font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--teal); font-weight: 700; }
        .pw-strength { display: flex; align-items: center; gap: 6px; margin-top: 6px; }
        .pw-bar { flex: 1; height: 4px; border-radius: 2px; background: var(--line); transition: background 0.25s; }
        .pw-bar.weak   { background: var(--rust); }
        .pw-bar.medium { background: var(--gold); }
        .pw-bar.strong { background: var(--teal); }
        .pw-label { font-size: 0.75rem; font-weight: 600; color: var(--ink-muted); white-space: nowrap; }
        @media (max-width: 780px) {
          .auth-page { grid-template-columns: 1fr; }
          .auth-panel-left { display: none; }
          .auth-panel-right { padding: var(--space-7) var(--space-5); min-height: calc(100vh - 66px); }
        }
      `}</style>
    </PageTransition>
  );
}
