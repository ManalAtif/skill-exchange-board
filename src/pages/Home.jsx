import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Users, Search, MessageCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/PageTransition";

const PREVIEW_CARDS = [
  { type: "offer", title: "Guitar Lessons for Beginners", category: "Music", location: "Satellite Town" },
  { type: "request", title: "Need Help Learning React", category: "Coding", location: "Bahria Town" },
  { type: "offer", title: "Home-cooked Pakistani Cuisine", category: "Cooking", location: "Chaklala" },
];

const STEPS = [
  { icon: Users, title: "Post your board", desc: "Say what you can teach and what you're hoping to learn." },
  { icon: Search, title: "Find your match", desc: "Browse nearby offers and requests, filtered by category and distance." },
  { icon: MessageCircle, title: "Message and trade", desc: "Chat in-app, no phone number required, and arrange your swap." },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <PageTransition>
      {/* ---- Hero: the corkboard ---- */}
      <section className="hero texture-board">
        <div className="container hero-inner">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow">Local skill exchange</span>
            <h1>Trade skills, <em>not cash.</em></h1>
            <p className="hero-sub">
              Teach what you know. Learn what you don't. Everyone on the board
              is right in your neighborhood.
            </p>
            <div className="hero-actions">
              <Link to="/browse">
                <motion.span whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="btn btn-primary">
                  Browse the board <ArrowRight size={16} />
                </motion.span>
              </Link>
              {!user && (
                <Link to="/signup">
                  <motion.span whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="btn btn-ghost" style={{ border: "2px solid rgba(255,255,255,0.5)" }}>
                    Get started
                  </motion.span>
                </Link>
              )}
            </div>
          </motion.div>

          <div className="hero-board">
            {PREVIEW_CARDS.map((c, i) => (
              <motion.div
                key={c.title}
                className="pin-card mini"
                initial={{ opacity: 0, y: 24, rotate: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.25 + i * 0.12 }}
              >
                <span className={`stamp ${c.type === "offer" ? "offer" : "request"}`}>
                  {c.type === "offer" ? "Offering" : "Looking for"}
                </span>
                <h3 className="card-title">{c.title}</h3>
                <p className="card-meta">{c.category} · {c.location}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How it works — a real 3-step sequence, numbering earns its keep here ---- */}
      <section className="container steps-section">
        <h2 className="steps-heading">How the board works</h2>
        <div className="steps-grid">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              className="step"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="step-number">{String(i + 1).padStart(2, "0")}</div>
              <step.icon size={22} strokeWidth={2} color="var(--teal)" />
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <style>{`
        .hero { padding: var(--space-9) 0 var(--space-8); color: var(--paper-raised); overflow: hidden; }
        .hero-inner {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: var(--space-7);
          align-items: center;
        }
        .eyebrow {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 600;
        }
        .hero-copy h1 { color: var(--paper-raised); margin-top: var(--space-2); }
        .hero-copy h1 em { color: var(--gold); font-style: normal; }
        .hero-sub { font-size: 1.1rem; color: rgba(255,255,255,0.82); max-width: 460px; margin-top: var(--space-3); }
        .hero-actions { display: flex; gap: var(--space-3); margin-top: var(--space-5); flex-wrap: wrap; }
        .hero-board {
          display: grid;
          gap: var(--space-4);
        }
        .pin-card.mini { padding: var(--space-4) var(--space-3) var(--space-3); }
        .pin-card.mini .card-title { font-size: 1rem; }

        .steps-section { padding: var(--space-8) 0; }
        .steps-heading { text-align: center; margin-bottom: var(--space-7); }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
        }
        .step { position: relative; }
        .step-number {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: var(--line);
          font-weight: 700;
          margin-bottom: var(--space-2);
        }
        .step h3 { margin: var(--space-2) 0 var(--space-1); }
        .step p { color: var(--ink-soft); font-size: 0.94rem; }

        @media (max-width: 860px) {
          .hero-inner { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </PageTransition>
  );
}
