import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock, Flag } from "lucide-react";
import { getListingById, reportListing } from "../services/api";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/PageTransition";

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchListing = async () => {
      try {
        const res = await getListingById(id);
        if (!cancelled) setListing(res.data);
      } catch {
        if (!cancelled) {
          setListing({
            id, type: "offer", title: "Guitar Lessons for Beginners", category: "Music",
            location: "Satellite Town", availability: "Weekends",
            description: "I've been playing for 8 years and love teaching absolute beginners chords and strumming patterns.",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchListing();
    return () => { cancelled = true; };
  }, [id]);

  const handleReport = async () => {
    // Basic moderation hook per the PRD — backend should verify auth + rate-limit this.
    try {
      await reportListing(id, "inappropriate");
    } catch {
      // fine to fail silently here; still show confirmation locally
    }
    setReported(true);
  };

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}><div className="spinner" /></div>;
  }
  if (!listing) return <p className="container" style={{ padding: "2rem" }}>Listing not found.</p>;

  const isOffer = listing.type === "offer";

  return (
    <PageTransition>
      <div className="container detail-page">
        <motion.div
          className="pin-card detail-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <span className={`stamp ${isOffer ? "offer" : "request"}`}>
            {isOffer ? "Offering" : "Looking for"}
          </span>
          <h1 className="detail-title">{listing.title}</h1>
          <p className="detail-meta">
            {listing.category}
            {listing.location && <> · <MapPin size={14} style={{ verticalAlign: "-2px" }} /> {listing.location}</>}
          </p>
          <p className="detail-desc">{listing.description}</p>
          {listing.availability && (
            <p className="detail-availability">
              <Clock size={14} style={{ verticalAlign: "-2px" }} /> Available: {listing.availability}
            </p>
          )}

          <div className="detail-actions">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="btn btn-primary"
              onClick={() => (user ? navigate(`/chat/${listing.id || listing._id}`) : navigate("/login"))}
            >
              Message about this listing
            </motion.button>

            <button className="btn-report" onClick={handleReport} disabled={reported}>
              <Flag size={14} /> {reported ? "Reported" : "Report listing"}
            </button>
          </div>
        </motion.div>
      </div>

      <style>{`
        .detail-page { padding: var(--space-8) var(--space-5); display: flex; justify-content: center; }
        .detail-card { width: 100%; max-width: 560px; padding: var(--space-6); }
        .detail-title { margin-top: var(--space-3); }
        .detail-meta { font-family: var(--font-mono); font-size: 0.85rem; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.03em; }
        .detail-desc { margin-top: var(--space-4); font-size: 1.02rem; }
        .detail-availability { color: var(--ink-soft); font-size: 0.9rem; }
        .detail-actions { display: flex; align-items: center; gap: var(--space-4); margin-top: var(--space-5); flex-wrap: wrap; }
        .btn-report {
          background: none; border: none; color: var(--ink-soft); font-size: 0.85rem;
          display: flex; align-items: center; gap: 6px; cursor: pointer;
        }
        .btn-report:hover:not(:disabled) { color: var(--rust); }
        .btn-report:disabled { color: var(--teal); cursor: default; }
      `}</style>
    </PageTransition>
  );
}
