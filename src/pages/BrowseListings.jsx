import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import ListingCard from "../components/ListingCard";
import PageTransition from "../components/PageTransition";
import { getListings } from "../services/api";
import { sanitizeText } from "../utils/validation";

const CATEGORIES = [
  "All", "Music", "Coding", "Cooking", "Home Repair", "Languages",
  "Fitness", "Art & Design", "Writing", "Business", "Other",
];

// Fallback so the board looks alive before the backend is wired up.
// Delete once getListings() reliably returns real data.
const MOCK_LISTINGS = [
  { id: "1", type: "offer", title: "Guitar Lessons for Beginners", category: "Music", location: "Satellite Town", description: "I've been playing for 8 years and love teaching absolute beginners chords and strumming patterns." },
  { id: "2", type: "request", title: "Need Help Learning React", category: "Coding", location: "Bahria Town", description: "Looking for someone to help me understand hooks and component state, happy to trade cooking lessons." },
  { id: "3", type: "offer", title: "Home-cooked Pakistani Cuisine", category: "Cooking", location: "Chaklala", description: "I can teach you how to make biryani, karahi, and daal from scratch." },
  { id: "4", type: "request", title: "Want to Learn Basic Home Wiring", category: "Home Repair", location: "Satellite Town", description: "Keep tripping the breaker and want to actually understand what I'm doing before calling an electrician." },
  { id: "5", type: "offer", title: "Conversational Spanish Practice", category: "Languages", location: "Chaklala", description: "Native speaker, happy to do casual conversation practice over chai." },
];

export default function BrowseListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchListings = async () => {
      try {
        const params = {};
        if (category !== "All") params.category = category;
        const res = await getListings(params);
        if (!cancelled) setListings(res.data);
      } catch {
        if (!cancelled) {
          setListings(MOCK_LISTINGS);
          setUsingMock(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchListings();
    return () => { cancelled = true; };
  }, [category]);

  const filtered = useMemo(() => {
    const q = sanitizeText(search, 100).toLowerCase();
    return listings.filter((l) => {
      const matchesCategory = category === "All" || l.category === category;
      const matchesSearch = !q || l.title?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [listings, category, search]);

  return (
    <PageTransition>
      <div className="container browse-page">
        <div className="browse-header">
          <div>
            <span className="eyebrow-teal">The board</span>
            <h1>Browse listings</h1>
          </div>
        </div>

        {usingMock && (
          <div className="alert alert-success" style={{ marginBottom: "var(--space-5)" }}>
            Showing sample listings — connect the backend to see real ones.
          </div>
        )}

        <div className="search-row">
          <div className="search-box">
            <Search size={18} color="var(--ink-soft)" />
            <input
              className="search-input"
              placeholder="Search listings…"
              maxLength={100}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="pill-row">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`pill${category === cat ? " active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h3>Nothing here yet</h3>
            <p>Try a different category or search term — or be the first to post one.</p>
          </div>
        ) : (
          <div className="listing-grid">
            {filtered.map((listing, i) => (
              <ListingCard key={listing.id || listing._id} listing={listing} index={i} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .browse-page { padding: var(--space-7) var(--space-5) var(--space-9); }
        .browse-header { margin-bottom: var(--space-5); }
        .eyebrow-teal {
          font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--teal); font-weight: 700;
        }
        .search-row { margin-bottom: var(--space-4); }
        .search-box {
          display: flex; align-items: center; gap: 8px;
          background: var(--paper-raised); border: 2px solid var(--line);
          border-radius: var(--radius-md); padding: 0.5rem 0.9rem; max-width: 420px;
        }
        .search-box:focus-within { border-color: var(--teal); }
        .search-input { border: none; outline: none; background: none; width: 100%; font-size: 0.95rem; }
        .pill-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: var(--space-6); }
        .listing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: var(--space-6) var(--space-5);
          padding-top: var(--space-2);
        }
      `}</style>
    </PageTransition>
  );
}
