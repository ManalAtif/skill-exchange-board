import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getListingById, updateListing } from "../services/api";
import { sanitizeText } from "../utils/validation";
import { useToast } from "../components/Toast";
import Field from "../components/Field";
import PageTransition from "../components/PageTransition";

const CATEGORIES = [
  "Music", "Coding", "Cooking", "Home Repair", "Languages",
  "Fitness", "Art & Design", "Writing", "Business", "Other",
];

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    type: "offer", title: "", category: "", description: "", availability: "", radius_km: 5,
  });
  const [loading, setLoading]     = useState(true);
  const [errors, setErrors]       = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    getListingById(id)
      .then((res) => {
        if (!cancelled) {
          const l = res.data;
          setForm({
            type:         l.type         || "offer",
            title:        l.title        || "",
            category:     l.category     || "",
            description:  l.description  || "",
            availability: l.availability || "",
            radius_km:    l.radius_km    || 5,
          });
          setLoading(false);
        }
      })
      .catch(() => {
        // Fall back to mock so the form is usable without a backend
        if (!cancelled) {
          setForm({ type: "offer", title: "Guitar Lessons for Beginners", category: "Music", description: "I've been playing for 8 years.", availability: "Weekends", radius_km: 10 });
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Give your listing a title";
    if (!form.category) next.category = "Choose a category";
    if (!form.description.trim() || form.description.trim().length < 10) next.description = "Add at least a short description";
    const r = Number(form.radius_km);
    if (!r || r <= 0 || r > 100) next.radius_km = "Enter a radius between 1 and 100 km";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate() || submitting) return;
    setSubmitting(true);
    try {
      await updateListing(id, {
        type:         form.type,
        title:        sanitizeText(form.title, 100),
        category:     form.category,
        description:  sanitizeText(form.description, 1000),
        availability: sanitizeText(form.availability, 100),
        radius_km:    Number(form.radius_km),
      });
      addToast("Listing updated.");
      navigate("/my-listings");
    } catch (err) {
      setServerError(err.response?.data?.message || "Couldn't update the listing. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="container edit-page">
        <motion.div
          className="form-shell edit-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <span className="eyebrow-teal">Edit listing</span>
          <h2>Update your listing</h2>
          <p className="edit-sub">Make changes and save — your listing will update immediately.</p>

          {serverError && <div className="alert alert-error" role="alert">{serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label>Listing type</label>
              <div className="toggle-group">
                <button type="button" className={`toggle-option offer${form.type === "offer" ? " active" : ""}`} onClick={() => setForm({ ...form, type: "offer" })}>
                  I can teach
                </button>
                <button type="button" className={`toggle-option request${form.type === "request" ? " active" : ""}`} onClick={() => setForm({ ...form, type: "request" })}>
                  I want to learn
                </button>
              </div>
            </div>

            <Field label="Title" htmlFor="title" error={errors.title}>
              <input id="title" name="title" maxLength={100} placeholder="e.g. Beginner Guitar Lessons"
                className={`input${errors.title ? " has-error" : ""}`}
                value={form.title} onChange={handleChange} />
            </Field>

            <Field label="Category" htmlFor="category" error={errors.category}>
              <select id="category" name="category"
                className={`select${errors.category ? " has-error" : ""}`}
                value={form.category} onChange={handleChange}>
                <option value="">Choose one…</option>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </Field>

            <Field label="Description" htmlFor="description" error={errors.description}>
              <textarea id="description" name="description" maxLength={1000}
                className={`textarea${errors.description ? " has-error" : ""}`}
                value={form.description} onChange={handleChange} />
              <span className="hint">{form.description.length}/1000</span>
            </Field>

            <Field label="Availability" htmlFor="availability" hint="Optional — e.g. weekends, evenings">
              <input id="availability" name="availability" maxLength={100}
                className="input" value={form.availability} onChange={handleChange} />
            </Field>

            <Field label="Search radius (km)" htmlFor="radius_km" error={errors.radius_km}>
              <input id="radius_km" name="radius_km" type="number" min="1" max="100"
                className={`input${errors.radius_km ? " has-error" : ""}`}
                value={form.radius_km} onChange={handleChange} />
            </Field>

            <div className="edit-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate("/my-listings")}>
                Cancel
              </button>
              <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Saving…" : "Save changes"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      <style>{`
        .edit-page { padding: var(--space-7) var(--space-5) var(--space-9); display: flex; justify-content: center; }
        .edit-card  { width: 100%; max-width: 500px; }
        .edit-sub   { color: var(--ink-soft); font-size: 0.95rem; margin-bottom: var(--space-5); }
        .eyebrow-teal {
          display: block; font-family: var(--font-mono); font-size: 0.72rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--teal); font-weight: 700; margin-bottom: var(--space-2);
        }
        .edit-actions { display: flex; gap: var(--space-3); justify-content: flex-end; margin-top: var(--space-2); }
      `}</style>
    </PageTransition>
  );
}
