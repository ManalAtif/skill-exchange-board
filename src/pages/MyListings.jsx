import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { getMyListings, deleteListing } from "../services/api";
import { useToast } from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";
import SkeletonCard from "../components/SkeletonCard";
import PageTransition from "../components/PageTransition";

const MOCK_MY_LISTINGS = [
  { id: "1", type: "offer",   title: "Guitar Lessons for Beginners",  category: "Music",   location: "Satellite Town", description: "I've been playing for 8 years and love teaching absolute beginners." },
  { id: "2", type: "request", title: "Need Help Learning React",        category: "Coding", location: "Bahria Town",    description: "Looking for someone to help me understand hooks and component state." },
];

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    getMyListings()
      .then((res) => { if (!cancelled) setListings(res.data); })
      .catch(() => { if (!cancelled) setListings(MOCK_MY_LISTINGS); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const confirmDelete = async () => {
    const id = deleteId;
    setDeleteId(null);
    try {
      await deleteListing(id);
      setListings((prev) => prev.filter((l) => (l.id || l._id) !== id));
      addToast("Listing deleted.");
    } catch {
      addToast("Couldn't delete the listing. Try again.", "error");
    }
  };

  return (
    <PageTransition>
      <div className="container my-listings-page">
        <div className="my-listings-header">
          <div>
            <span className="eyebrow-teal">Your board</span>
            <h1>My listings</h1>
          </div>
          <Link to="/create-listing" className="btn btn-primary">
            <Plus size={16} /> New listing
          </Link>
        </div>

        {loading ? (
          <div className="listing-grid">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="empty-state">
            <h3>No listings yet</h3>
            <p>Post your first skill offer or request to get started.</p>
            <Link to="/create-listing" className="btn btn-primary" style={{ marginTop: "1.25rem" }}>
              Create a listing
            </Link>
          </div>
        ) : (
          <div className="listing-grid">
            {listings.map((listing, i) => {
              const id = listing.id || listing._id;
              const isOffer = listing.type === "offer";
              return (
                <motion.div
                  key={id}
                  className="pin-card my-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.4) }}
                >
                  <span className={`stamp ${isOffer ? "offer" : "request"}`}>
                    {isOffer ? "Offering" : "Looking for"}
                  </span>
                  <h3 className="card-title">{listing.title}</h3>
                  <p className="card-meta">
                    {listing.category}
                    {listing.location && <> · <MapPin size={12} style={{ verticalAlign: "-2px" }} /> {listing.location}</>}
                  </p>
                  <p className="card-desc">
                    {listing.description?.slice(0, 110)}{listing.description?.length > 110 ? "…" : ""}
                  </p>
                  <div className="my-card-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/listing/${id}`)}>
                      View
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/edit-listing/${id}`)}>
                      <Pencil size={13} /> Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(id)}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete listing?"
        message="This will permanently remove your listing from the board. This can't be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      <style>{`
        .my-listings-page { padding: var(--space-7) var(--space-5) var(--space-9); }
        .my-listings-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: var(--space-6); flex-wrap: wrap; gap: var(--space-3);
        }
        .eyebrow-teal {
          font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--teal); font-weight: 700;
        }
        .listing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: var(--space-6) var(--space-5);
        }
        .my-card { cursor: default; }
        .my-card-actions {
          display: flex; gap: var(--space-2); margin-top: var(--space-4);
          flex-wrap: wrap;
        }
      `}</style>
    </PageTransition>
  );
}
