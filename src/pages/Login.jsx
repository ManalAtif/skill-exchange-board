import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, PinIcon } from "lucide-react";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, sanitizeText } from "../utils/validation";
import Field from "../components/Field";
import PageTransition from "../components/PageTransition";

export default function Login() {
  const [form, setForm]             = useState({ email: "", password: "" });
  const [errors, setErrors]         = useState({});
  const [showPw, setShowPw]         = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate   = useNavigate();
  const { loginUser } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const next = {};
    if (!isValidEmail(form.email)) next.email = "Enter a valid email address";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate() || submitting) return;
    setSubmitting(true);
    try {
      const res = await login({ email: sanitizeText(form.email, 254), password: form.password });
      loginUser(res.data.user, res.data.token);
      navigate("/browse");
    } catch (err) {
      setServerError(err.response?.data?.message || "Couldn't log in. Check your email and password.");
    } finally {
      setSubmitting(false);
    }
  };

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
            <h2 className="auth-panel-h2">The neighbourhood skill exchange</h2>
            <p className="auth-panel-sub">
              Teach what you know. Learn what you don't. Everyone on the board is right where you are.
            </p>
            <ul className="auth-perks">
              <li><span className="perk-dot" />Free to join, forever</li>
              <li><span className="perk-dot" />No middlemen or fees</li>
              <li><span className="perk-dot" />Secure in-app messaging</li>
              <li><span className="perk-dot" />Real people, real skills</li>
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
            <span className="eyebrow-teal">Welcome back</span>
            <h1 className="auth-h1">Log in</h1>
            <p className="auth-desc">Good to see you again. Enter your details to continue.</p>

            {serverError && <div className="alert alert-error" role="alert">{serverError}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <Field label="Email" htmlFor="email" error={errors.email}>
                <input id="email" name="email" type="email" autoComplete="email" maxLength={254}
                  placeholder="you@example.com"
                  className={`input${errors.email ? " has-error" : ""}`}
                  value={form.email} onChange={handleChange} />
              </Field>

              <Field label="Password" htmlFor="password" error={errors.password}>
                <div className="password-wrap">
                  <input id="password" name="password" type={showPw ? "text" : "password"}
                    autoComplete="current-password" maxLength={128}
                    className={`input${errors.password ? " has-error" : ""}`}
                    value={form.password} onChange={handleChange} />
                  <button type="button" className="password-toggle"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}>
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </Field>

              <motion.button whileTap={{ scale: 0.97 }} type="submit"
                className="btn btn-primary btn-block" style={{ marginTop: "var(--space-2)" }}
                disabled={submitting}>
                {submitting ? "Logging in…" : "Log in"}
              </motion.button>
            </form>

            <p className="auth-switch">
              Don't have an account? <Link to="/signup">Sign up free</Link>
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
        .auth-brand {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: var(--space-6);
        }
        .auth-brand-icon {
          width: 36px; height: 36px; border-radius: var(--radius-md);
          background: rgba(255,255,255,0.15); display: flex;
          align-items: center; justify-content: center;
        }
        .auth-brand span { font-family: var(--font-display); font-weight: 700; font-size: 1.25rem; }
        .auth-panel-h2 { color: var(--paper-raised); font-size: 1.8rem; margin-bottom: var(--space-3); line-height: 1.2; }
        .auth-panel-sub { color: rgba(240,236,224,0.7); font-size: 0.97rem; line-height: 1.65; margin-bottom: var(--space-6); }
        .auth-perks { display: flex; flex-direction: column; gap: var(--space-3); }
        .auth-perks li { display: flex; align-items: center; gap: var(--space-3); font-size: 0.93rem; color: rgba(240,236,224,0.85); }
        .perk-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--gold-light); flex-shrink: 0; }
        .auth-panel-right {
          display: flex; align-items: center; justify-content: center;
          padding: var(--space-8) var(--space-6); background: var(--paper);
        }
        .auth-form-wrap { width: 100%; max-width: 400px; }
        .auth-h1 { font-size: 2rem; margin: var(--space-2) 0 var(--space-2); }
        .auth-desc { color: var(--ink-soft); font-size: 0.95rem; margin-bottom: var(--space-5); }
        .auth-switch { margin-top: var(--space-5); font-size: 0.9rem; text-align: center; color: var(--ink-soft); }
        .auth-switch a { font-weight: 600; }
        .eyebrow-teal {
          display: block; font-family: var(--font-mono); font-size: 0.72rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--teal); font-weight: 700;
        }
        @media (max-width: 780px) {
          .auth-page { grid-template-columns: 1fr; }
          .auth-panel-left { display: none; }
          .auth-panel-right { padding: var(--space-7) var(--space-5); min-height: calc(100vh - 66px); }
        }
      `}</style>
    </PageTransition>
  );
}
