import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import ListingCard from "../components/ListingCard";
import SkeletonCard from "../components/SkeletonCard";
import PageTransition from "../components/PageTransition";
import { getListings } from "../services/api";
import { sanitizeText } from "../utils/validation";

const CATEGORIES = [
  "All", "Music", "Coding", "Cooking", "Home Repair", "Languages",
  "Fitness", "Art & Design", "Writing", "Business", "Other",
];

const MOCK_LISTINGS = [
  { id: "1", type: "offer",   title: "Guitar Lessons for Beginners",  category: "Music",       location: "Satellite Town", description: "I've been playing for 8 years and love teaching absolute beginners chords and strumming patterns." },
  { id: "2", type: "request", title: "Need Help Learning React",        category: "Coding",      location: "Bahria Town",    description: "Looking for someone to help me understand hooks and component state, happy to trade cooking lessons." },
  { id: "3", type: "offer",   title: "Home-cooked Pakistani Cuisine",   category: "Cooking",     location: "Chaklala",       description: "I can teach you how to make biryani, karahi, and daal from scratch." },
  { id: "4", type: "request", title: "Want to Learn Basic Home Wiring", category: "Home Repair", location: "Satellite Town", description: "Keep tripping the breaker and want to actually understand what I'm doing before calling an electrician." },
  { id: "5", type: "offer",   title: "Conversational Spanish Practice", category: "Languages",   location: "Chaklala",       description: "Native speaker, happy to do casual conversation practice over chai." },
  { id: "6", type: "offer",   title: "Watercolor Painting Basics",      category: "Art & Design",location: "Rawalpindi",     description: "Can teach fundamentals — colour mixing, wet-on-wet, simple landscapes." },
];

export default function BrowseListings() {
  const [listings, setListings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [category, setCategory]   = useState("All");
  const [typeFilter, setTypeFilter] = useState("all"); // "all" | "offer" | "request"
  const [search, setSearch]       = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchListings = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== "All") params.category = category;
        const res = await getListings(params);
        if (!cancelled) { setListings(res.data); setUsingMock(false); }
      } catch {
        if (!cancelled) { setListings(MOCK_LISTINGS); setUsingMock(true); }
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
      const matchesType     = typeFilter === "all" || l.type === typeFilter;
      const matchesSearch   = !q || l.title?.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q);
      return matchesCategory && matchesType && matchesSearch;
    });
  }, [listings, category, typeFilter, search]);

  return (
    <PageTransition>
      <div className="container browse-page">
        <div className="browse-header">
          <span className="eyebrow-teal">The board</span>
          <h1>Browse listings</h1>
        </div>

        {usingMock && (
          <div className="alert alert-success" style={{ marginBottom: "var(--space-5)" }}>
            Showing sample listings — connect the backend to see real ones.
          </div>
        )}

        {/* Search + type filter row */}
        <div className="browse-controls">
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

          <div className="type-toggle">
            {[["all", "All"], ["offer", "Offering"], ["request", "Looking for"]].map(([val, label]) => (
              <button
                key={val}
                className={`type-btn${typeFilter === val ? " active" : ""}`}
                onClick={() => setTypeFilter(val)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Category pills */}
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
          <div className="listing-grid">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h3>Nothing here yet</h3>
            <p>Try a different category, type, or search term — or be the first to post one.</p>
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
        .browse-controls {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-4);
          flex-wrap: wrap;
        }
        .search-box {
          display: flex; align-items: center; gap: 8px;
          background: var(--paper-raised); border: 2px solid var(--line);
          border-radius: var(--radius-md); padding: 0.5rem 0.9rem;
          flex: 1; max-width: 380px;
        }
        .search-box:focus-within { border-color: var(--teal); }
        .search-input { border: none; outline: none; background: none; width: 100%; font-size: 0.95rem; }
        .type-toggle { display: flex; border: 2px solid var(--line); border-radius: var(--radius-md); overflow: hidden; }
        .type-btn {
          padding: 0.5rem 1rem; background: var(--paper-raised); border: none;
          font-size: 0.85rem; font-weight: 600; cursor: pointer;
          font-family: var(--font-body); color: var(--ink-soft);
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .type-btn + .type-btn { border-left: 2px solid var(--line); }
        .type-btn.active { background: var(--ink); color: var(--paper-raised); }
        .pill-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: var(--space-6); }
        .listing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: var(--space-6) var(--space-5);
          padding-top: var(--space-2);
        }
        @media (max-width: 600px) {
          .browse-controls { flex-direction: column; align-items: stretch; }
          .search-box { max-width: 100%; }
        }
      `}</style>
    </PageTransition>
  );
}
