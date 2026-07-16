import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { List } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/api";
import { sanitizeText } from "../utils/validation";
import { useToast } from "../components/Toast";
import Field from "../components/Field";
import PageTransition from "../components/PageTransition";

export default function Profile() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: "", bio: "", location: "", photo_url: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "", bio: user.bio || "",
        location: user.location || "", photo_url: user.photo_url || "",
      });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await updateProfile({
        name: sanitizeText(form.name, 100),
        bio: sanitizeText(form.bio, 500),
        location: sanitizeText(form.location, 120),
        photo_url: sanitizeText(form.photo_url, 500),
      });
      addToast("Profile updated.");
    } catch (err) {
      addToast(err.response?.data?.message || "Couldn't save your profile. Try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="container profile-page">
        <motion.div
          className="form-shell profile-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="profile-head">
            <div className="avatar">
              {form.photo_url ? (
                <img src={form.photo_url} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              ) : (
                <span>{form.name?.[0]?.toUpperCase() || "?"}</span>
              )}
            </div>
            <div>
              <h2 style={{ marginBottom: 4 }}>My profile</h2>
              {user?.name && <p style={{ color: "var(--ink-soft)", fontSize: "0.9rem", margin: 0 }}>{user.name}</p>}
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <Field label="Name" htmlFor="name">
              <input id="name" name="name" maxLength={100} className="input" value={form.name} onChange={handleChange} />
            </Field>
            <Field label="Bio" htmlFor="bio" hint={`${form.bio.length}/500`}>
              <textarea id="bio" name="bio" maxLength={500} className="textarea" value={form.bio} onChange={handleChange} />
            </Field>
            <Field label="Location" htmlFor="location" hint="Neighborhood-level only, for your privacy">
              <input id="location" name="location" maxLength={120} className="input" value={form.location} onChange={handleChange} />
            </Field>
            <Field label="Photo URL" htmlFor="photo_url" hint="Optional">
              <input id="photo_url" name="photo_url" type="url" maxLength={500} placeholder="https://…" className="input" value={form.photo_url} onChange={handleChange} />
            </Field>

            <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Saving…" : "Save changes"}
            </motion.button>
          </form>

          <div className="profile-footer">
            <Link to="/my-listings" className="profile-footer-link">
              <List size={16} /> View my listings
            </Link>
          </div>
        </motion.div>
      </div>

      <style>{`
        .profile-page { padding: var(--space-7) var(--space-5) var(--space-9); display: flex; justify-content: center; }
        .profile-card { width: 100%; max-width: 460px; }
        .profile-head { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-5); }
        .avatar {
          width: 56px; height: 56px; border-radius: 50%; background: var(--gold);
          display: flex; align-items: center; justify-content: center; overflow: hidden;
          font-family: var(--font-display); font-weight: 700; color: var(--paper-raised); font-size: 1.3rem;
          flex-shrink: 0;
        }
        .avatar img { width: 100%; height: 100%; object-fit: cover; }
        .profile-footer {
          margin-top: var(--space-5); padding-top: var(--space-4);
          border-top: 1px solid var(--line); text-align: center;
        }
        .profile-footer-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.9rem; font-weight: 600; color: var(--teal);
        }
      `}</style>
    </PageTransition>
  );
}
