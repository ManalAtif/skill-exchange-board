import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { signup } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, getPasswordIssues, sanitizeText } from "../utils/validation";
import Field from "../components/Field";
import PageTransition from "../components/PageTransition";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", location: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
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
        name: sanitizeText(form.name, 100),
        email: sanitizeText(form.email, 254),
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

  return (
    <PageTransition>
      <div className="auth-wrap container">
        <motion.div
          className="form-shell auth-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <span className="eyebrow-dark">Join the board</span>
          <h2>Create your account</h2>

          {serverError && <div className="alert alert-error" role="alert">{serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <Field label="Full name" htmlFor="name" error={errors.name}>
              <input
                id="name" name="name" type="text" autoComplete="name" maxLength={100}
                className={`input${errors.name ? " has-error" : ""}`}
                value={form.name} onChange={handleChange}
              />
            </Field>

            <Field label="Email" htmlFor="email" error={errors.email}>
              <input
                id="email" name="email" type="email" autoComplete="email" maxLength={254}
                className={`input${errors.email ? " has-error" : ""}`}
                value={form.email} onChange={handleChange}
              />
            </Field>

            <Field
              label="Password"
              htmlFor="password"
              error={errors.password}
              hint={!errors.password ? "8+ characters, at least one letter and one number" : undefined}
            >
              <div className="password-wrap">
                <input
                  id="password" name="password" type={showPw ? "text" : "password"}
                  autoComplete="new-password" maxLength={128}
                  className={`input${errors.password ? " has-error" : ""}`}
                  value={form.password} onChange={handleChange}
                />
                <button
                  type="button" className="password-toggle"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            <Field label="City / neighborhood" htmlFor="location" hint="Only your general area is shown — never an exact address">
              <input
                id="location" name="location" type="text" maxLength={120}
                className="input" placeholder="e.g. Rawalpindi, Satellite Town"
                value={form.location} onChange={handleChange}
              />
            </Field>

            <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Creating account…" : "Sign up"}
            </motion.button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        .auth-wrap { display: flex; justify-content: center; padding: var(--space-8) var(--space-4); }
        .auth-card { width: 100%; max-width: 420px; }
        .eyebrow-dark {
          font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--teal); font-weight: 700;
        }
        .auth-switch { margin-top: var(--space-4); font-size: 0.9rem; text-align: center; }
      `}</style>
    </PageTransition>
  );
}
