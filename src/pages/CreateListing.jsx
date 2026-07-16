import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { createListing } from "../services/api";
import { sanitizeText } from "../utils/validation";
import Field from "../components/Field";
import PageTransition from "../components/PageTransition";

const CATEGORIES = [
  "Music", "Coding", "Cooking", "Home Repair", "Languages",
  "Fitness", "Art & Design", "Writing", "Business", "Other",
];

export default function CreateListing() {
  const [form, setForm] = useState({
    type: "offer", title: "", category: "", description: "", availability: "", radius_km: 5,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Give your listing a title";
    if (!form.category) next.category = "Choose a category";
    if (!form.description.trim() || form.description.trim().length < 10) {
      next.description = "Add at least a short sentence describing this";
    }
    const radius = Number(form.radius_km);
    if (!radius || radius <= 0 || radius > 100) next.radius_km = "Enter a radius between 1 and 100 km";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate() || submitting) return;

    setSubmitting(true);
    try {
      await createListing({
        type: form.type,
        title: sanitizeText(form.title, 100),
        category: form.category,
        description: sanitizeText(form.description, 1000),
        availability: sanitizeText(form.availability, 100),
        radius_km: Number(form.radius_km),
      });
      navigate("/browse");
    } catch (err) {
      setServerError(err.response?.data?.message || "Couldn't post your listing. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="container create-page">
        <motion.div
          className="form-shell create-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <span className="eyebrow-teal">Pin something new</span>
          <h2>Create a listing</h2>

          {serverError && <div className="alert alert-error" role="alert">{serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label>What kind of listing is this?</label>
              <div className="toggle-group">
                <button
                  type="button"
                  className={`toggle-option offer${form.type === "offer" ? " active" : ""}`}
                  onClick={() => setForm({ ...form, type: "offer" })}
                >
                  I can teach
                </button>
                <button
                  type="button"
                  className={`toggle-option request${form.type === "request" ? " active" : ""}`}
                  onClick={() => setForm({ ...form, type: "request" })}
                >
                  I want to learn
                </button>
              </div>
            </div>

            <Field label="Title" htmlFor="title" error={errors.title}>
              <input
                id="title" name="title" maxLength={100} placeholder="e.g. Beginner Guitar Lessons"
                className={`input${errors.title ? " has-error" : ""}`}
                value={form.title} onChange={handleChange}
              />
            </Field>

            <Field label="Category" htmlFor="category" error={errors.category}>
              <select
                id="category" name="category"
                className={`select${errors.category ? " has-error" : ""}`}
                value={form.category} onChange={handleChange}
              >
                <option value="">Choose one…</option>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </Field>

            <Field label="Description" htmlFor="description" error={errors.description}>
              <textarea
                id="description" name="description" maxLength={1000}
                className={`textarea${errors.description ? " has-error" : ""}`}
                value={form.description} onChange={handleChange}
              />
              <span className="hint">{form.description.length}/1000</span>
            </Field>

            <Field label="Availability" htmlFor="availability" hint="Optional — e.g. weekends, evenings">
              <input
                id="availability" name="availability" maxLength={100}
                className="input" value={form.availability} onChange={handleChange}
              />
            </Field>

            <Field label="Search radius (km)" htmlFor="radius_km" error={errors.radius_km}>
              <input
                id="radius_km" name="radius_km" type="number" min="1" max="100"
                className={`input${errors.radius_km ? " has-error" : ""}`}
                value={form.radius_km} onChange={handleChange}
              />
            </Field>

            <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Posting…" : "Post listing"}
            </motion.button>
          </form>
        </motion.div>
      </div>

      <style>{`
        .create-page { padding: var(--space-7) var(--space-5) var(--space-9); display: flex; justify-content: center; }
        .create-card { width: 100%; max-width: 480px; }
        .eyebrow-teal {
          font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--teal); font-weight: 700;
        }
      `}</style>
    </PageTransition>
  );
}
