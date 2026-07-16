import { useState, useEffect } from "react";
import ListingCard from "../components/ListingCard";
import PageTransition from "../components/PageTransition";
import { getMatches } from "../services/api";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchMatches = async () => {
      try {
        const res = await getMatches();
        if (!cancelled) setMatches(res.data);
      } catch {
        if (!cancelled) setMatches([]); // no mock data — real matching logic isn't built yet
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
        <span className="eyebrow-teal">Suggested for you</span>
        <h1>Your matches</h1>
        <p className="matches-sub">Based on your listings, here's who might be a good trade for you.</p>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}><div className="spinner" /></div>
        ) : matches.length === 0 ? (
          <div className="empty-state">
            <h3>No matches yet</h3>
            <p>Post an "Offer" or "Request" to get matched with nearby people.</p>
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
        .eyebrow-teal {
          font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--teal); font-weight: 700;
        }
        .matches-sub { color: var(--ink-soft); margin-bottom: var(--space-6); }
        .listing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: var(--space-6) var(--space-5);
        }
      `}</style>
    </PageTransition>
  );
}
