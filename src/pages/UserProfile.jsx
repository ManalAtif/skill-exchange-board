import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, MessageCircle } from "lucide-react";
import { getUserById, getListings, blockUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";
import ListingCard from "../components/ListingCard";
import SkeletonCard from "../components/SkeletonCard";
import PageTransition from "../components/PageTransition";

export default function UserProfile() {
  const { userId } = useParams();
  const { user: me } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [profile, setProfile]     = useState(null);
  const [listings, setListings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [blocking, setBlocking]   = useState(false);
  const [showBlock, setShowBlock] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getUserById(userId).catch(() => ({
        data: { id: userId, name: "Alex Johnson", bio: "Passionate about sharing skills and learning new ones.", location: "Bahria Town" }
      })),
      getListings({ owner: userId }).catch(() => ({
        data: [
          { id: "u1", type: "offer",   title: "Conversational Spanish Practice", category: "Languages", location: "Bahria Town", description: "Native speaker happy to do casual conversation practice." },
          { id: "u2", type: "request", title: "Need a Fitness Coach",             category: "Fitness",   location: "Bahria Town", description: "Looking for someone to help me build a workout routine." },
        ]
      })),
    ]).then(([profileRes, listingsRes]) => {
      if (!cancelled) {
        setProfile(profileRes.data);
        setListings(listingsRes.data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [userId]);

  const handleBlock = async () => {
    setShowBlock(false);
    setBlocking(true);
    try {
      await blockUser(userId);
      addToast("User blocked.");
      navigate(-1);
    } catch {
      addToast("Couldn't block this user. Try again.", "error");
    } finally {
      setBlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "var(--space-7) var(--space-5)" }}>
        <div className="up-hero-skel" />
        <div className="listing-grid" style={{ marginTop: "var(--space-6)" }}>
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  const initial = profile?.name?.[0]?.toUpperCase() || "?";
  const isOwnProfile = me?.id === userId || me?._id === userId;

  return (
    <PageTransition>
      <div className="container up-page">
        {/* Hero card */}
        <motion.div
          className="up-hero"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="up-avatar">{initial}</div>
          <div className="up-info">
            <h1 className="up-name">{profile?.name}</h1>
            {profile?.location && (
              <p className="up-loc">
                <MapPin size={14} style={{ verticalAlign: "-2px" }} /> {profile.location}
              </p>
            )}
            {profile?.bio && <p className="up-bio">{profile.bio}</p>}
          </div>
          {!isOwnProfile && (
            <div className="up-actions">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate(`/chat/${userId}`)}
              >
                <MessageCircle size={14} /> Message
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setShowBlock(true)}
                disabled={blocking}
              >
                Block
              </button>
            </div>
          )}
        </motion.div>

        {/* Their listings */}
        <h2 className="up-section-title">
          {isOwnProfile ? "Your listings" : `${profile?.name?.split(" ")[0]}'s listings`}
        </h2>
        {listings.length === 0 ? (
          <div className="empty-state">
            <p>No listings posted yet.</p>
          </div>
        ) : (
          <div className="listing-grid">
            {listings.map((l, i) => (
              <ListingCard key={l.id || l._id} listing={l} index={i} />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showBlock}
        title="Block this user?"
        message="You won't see their listings or messages. This can be undone from settings."
        confirmLabel="Block"
        danger
        onConfirm={handleBlock}
        onCancel={() => setShowBlock(false)}
      />

      <style>{`
        .up-page { padding: var(--space-7) var(--space-5) var(--space-9); }
        .up-hero {
          display: flex; align-items: flex-start; gap: var(--space-5);
          background: var(--paper-raised); border: 1px solid var(--line);
          border-radius: var(--radius-lg); padding: var(--space-5);
          box-shadow: var(--shadow-card); margin-bottom: var(--space-7);
          flex-wrap: wrap;
        }
        .up-avatar {
          width: 72px; height: 72px; border-radius: 50%; background: var(--gold);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-weight: 700;
          color: var(--paper-raised); font-size: 1.8rem; flex-shrink: 0;
        }
        .up-info { flex: 1; min-width: 0; }
        .up-name { font-size: 1.6rem; margin-bottom: var(--space-1); }
        .up-loc  { font-size: 0.88rem; color: var(--ink-soft); margin-bottom: var(--space-2); }
        .up-bio  { color: var(--ink-soft); font-size: 0.95rem; margin: 0; }
        .up-actions { display: flex; gap: var(--space-2); align-self: center; flex-wrap: wrap; }
        .up-section-title { margin-bottom: var(--space-5); font-size: 1.3rem; }
        .listing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: var(--space-6) var(--space-5);
        }
        .up-hero-skel {
          height: 140px; border-radius: var(--radius-lg);
          background: var(--line); margin-bottom: var(--space-6);
          animation: shimmer 1.4s infinite;
        }
      `}</style>
    </PageTransition>
  );
}
