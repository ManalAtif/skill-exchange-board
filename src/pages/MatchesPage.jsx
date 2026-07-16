import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import ListingCard from "../components/ListingCard";
import SkeletonCard from "../components/SkeletonCard";
import PageTransition from "../components/PageTransition";
import { getMatches } from "../services/api";

const MOCK_MATCHES = [
  {
    id: "m1", type: "offer", title: "Guitar Lessons for Beginners",
    category: "Music", location: "Satellite Town",
    description: "I've been playing for 8 years and love teaching absolute beginners chords and strumming patterns.",
  },
  {
    id: "m2", type: "request", title: "Need Help Learning React",
    category: "Coding", location: "Bahria Town",
    description: "Looking for someone to help me understand hooks and component state — happy to trade cooking lessons.",
  },
  {
    id: "m3", type: "offer", title: "Conversational Spanish Practice",
    category: "Languages", location: "Chaklala",
    description: "Native speaker, happy to do casual conversation practice over chai.",
  },
  {
    id: "m4", type: "offer", title: "Watercolor Painting Basics",
    category: "Art & Design", location: "Satellite Town",
    description: "Can teach fundamentals — colour mixing, wet-on-wet, simple landscapes.",
  },
];

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchMatches = async () => {
      try {
        const res = await getMatches();
        if (!cancelled) setMatches(res.data);
      } catch {
        if (!cancelled) {
          setMatches(MOCK_MATCHES);
          setUsingMock(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchMatches();
    return () => { cancelled = true; };
  }, []);

  return (
    <PageTransition>
      <div className="container matches-page">
        <div className="matches-header">
          <span className="eyebrow-teal">Suggested for you</span>
          <h1>Your matches</h1>
          <p className="matches-sub">
            Based on your listings, here's who might be a good trade for you.
          </p>
        </div>

        {usingMock && (
          <div className="alert alert-success" style={{ marginBottom: "var(--space-5)" }}>
            Showing sample matches — connect the backend to see real ones.
          </div>
        )}

        {loading ? (
          <div className="listing-grid">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : matches.length === 0 ? (
          <div className="empty-state">
            <Sparkles size={36} color="var(--gold)" style={{ marginBottom: "1rem" }} />
            <h3>No matches yet</h3>
            <p>Post an "Offer" or "Request" to get matched with nearby people.</p>
            <Link to="/create-listing" className="btn btn-primary" style={{ marginTop: "1.25rem" }}>
              Create a listing
            </Link>
          </div>
        ) : (
          <div className="listing-grid">
            {matches.map((listing, i) => (
              <ListingCard key={listing.id || listing._id} listing={listing} index={i} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .matches-page { padding: var(--space-7) var(--space-5) var(--space-9); }
        .matches-header { margin-bottom: var(--space-6); }
        .eyebrow-teal {
          font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--teal); font-weight: 700;
        }
        .matches-sub { color: var(--ink-soft); margin-top: var(--space-2); }
        .listing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: var(--space-6) var(--space-5);
        }
      `}</style>
    </PageTransition>
  );
}
