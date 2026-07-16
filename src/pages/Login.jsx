import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, sanitizeText } from "../utils/validation";
import Field from "../components/Field";
import PageTransition from "../components/PageTransition";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
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
      const res = await login({
        email: sanitizeText(form.email, 254),
        password: form.password, // never trim/alter password content itself
      });
      loginUser(res.data.user, res.data.token);
      navigate("/browse");
    } catch (err) {
      // Deliberately generic — never reveal whether the email exists.
      setServerError(err.response?.data?.message || "Couldn't log in. Check your email and password.");
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
          <span className="eyebrow-dark">Welcome back</span>
          <h2>Log in</h2>

          {serverError && <div className="alert alert-error" role="alert">{serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <Field label="Email" htmlFor="email" error={errors.email}>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                className={`input${errors.email ? " has-error" : ""}`}
                value={form.email}
                onChange={handleChange}
              />
            </Field>

            <Field label="Password" htmlFor="password" error={errors.password}>
              <div className="password-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  maxLength={128}
                  className={`input${errors.password ? " has-error" : ""}`}
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="btn btn-primary btn-block"
              disabled={submitting}
            >
              {submitting ? "Logging in…" : "Log in"}
            </motion.button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        .auth-wrap { display: flex; justify-content: center; padding: var(--space-8) var(--space-4); }
        .auth-card { width: 100%; max-width: 400px; }
        .eyebrow-dark {
          font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--teal); font-weight: 700;
        }
        .auth-switch { margin-top: var(--space-4); font-size: 0.9rem; text-align: center; }
      `}</style>
    </PageTransition>
  );
}
