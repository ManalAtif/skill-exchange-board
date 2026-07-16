import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Users, Search, MessageCircle, Star, Shield, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/PageTransition";

const PREVIEW_CARDS = [
  { type: "offer",   title: "Guitar Lessons for Beginners", category: "Music",   location: "Satellite Town" },
  { type: "request", title: "Need Help Learning React",      category: "Coding",  location: "Bahria Town"   },
  { type: "offer",   title: "Home-cooked Pakistani Cuisine", category: "Cooking", location: "Chaklala"      },
];

const STEPS = [
  { icon: Users,         title: "Post your listing",  desc: "Share a skill you can teach, or something you want to learn. Takes 60 seconds." },
  { icon: Search,        title: "Find your match",    desc: "Browse nearby offers and requests filtered by category, type, and location." },
  { icon: MessageCircle, title: "Swap and grow",      desc: "Chat in-app, agree on a schedule, and start your skill exchange." },
];

const STATS = [
  { value: "500+",  label: "Skills shared"       },
  { value: "250+",  label: "Active members"      },
  { value: "120+",  label: "Successful exchanges"},
  { value: "30+",   label: "Skill categories"    },
];

const FEATURES = [
  { icon: Shield, title: "Verified community",  desc: "Every member is a real person in your neighbourhood. No bots, no spam." },
  { icon: Zap,    title: "Fast matching",        desc: "Our algorithm surfaces the most relevant offers and requests for your needs." },
  { icon: Star,   title: "Grow your reputation", desc: "Build a track record with every exchange and become a trusted community expert." },
];

const TESTIMONIALS = [
  { name: "Sara K.",   loc: "Satellite Town", text: "Found a guitar teacher in exchange for cooking lessons — best deal ever. The board made it so easy." },
  { name: "Ahmed R.",  loc: "Bahria Town",    text: "I learned React in three sessions by trading Spanish tutoring. SkillSwap is genuinely brilliant." },
  { name: "Nadia M.",  loc: "Chaklala",       text: "Posted a fitness coaching offer and had three messages within a day. Community feels warm and real." },
];

const CATEGORIES = [
  { emoji: "🎸", name: "Music"       },
  { emoji: "💻", name: "Coding"      },
  { emoji: "🍳", name: "Cooking"     },
  { emoji: "🔧", name: "Home Repair" },
  { emoji: "🌍", name: "Languages"   },
  { emoji: "💪", name: "Fitness"     },
  { emoji: "🎨", name: "Art & Design"},
  { emoji: "✍️", name: "Writing"     },
];

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 22 },
  whileInView:{ opacity: 1, y: 0  },
  viewport:   { once: true, margin: "-60px" },
  transition: { duration: 0.45, delay },
});

export default function Home() {
  const { user } = useAuth();

  return (
    <PageTransition>

      {/* ══════════════ HERO ══════════════ */}
      <section className="hero texture-board">
        <div className="container hero-inner">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="hero-eyebrow">Local skill exchange · Pakistan</span>
            <h1 className="hero-h1">
              Trade skills,<br /><em className="hero-em">not cash.</em>
            </h1>
            <p className="hero-sub">
              Teach what you know. Learn what you don't. Everyone on the board is right in your neighbourhood — no fees, no middlemen.
            </p>
            <div className="hero-actions">
              <Link to="/browse">
                <motion.span whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="btn btn-primary btn-lg">
                  Browse the board <ArrowRight size={17} />
                </motion.span>
              </Link>
              {!user && (
                <Link to="/signup">
                  <motion.span whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="btn btn-ghost hero-ghost-btn">
                    Get started free
                  </motion.span>
                </Link>
              )}
            </div>
            <p className="hero-trust">
              <span className="trust-dot" /> Free to join &nbsp;·&nbsp;
              <span className="trust-dot" /> No credit card &nbsp;·&nbsp;
              <span className="trust-dot" /> Local community
            </p>
          </motion.div>

          <div className="hero-board">
            {PREVIEW_CARDS.map((c, i) => (
              <motion.div
                key={c.title}
                className="pin-card hero-pin"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.13 }}
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

      {/* ══════════════ STATS ══════════════ */}
      <section className="stats-band">
        <div className="container stats-grid">
          {STATS.map((s, i) => (
            <motion.div key={s.label} className="stat-item" {...fadeUp(i * 0.08)}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="section-pad container">
        <div className="section-head">
          <span className="section-label">How it works</span>
          <h2>Three steps to your first swap</h2>
          <p className="section-sub">No complicated setup. Just post, match, and meet.</p>
        </div>
        <div className="steps-grid">
          {STEPS.map((step, i) => (
            <motion.div key={step.title} className="step-card" {...fadeUp(i * 0.1)}>
              <div className="step-num">{String(i + 1).padStart(2, "0")}</div>
              <div className="step-icon-wrap">
                <step.icon size={20} strokeWidth={2} />
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════ CATEGORIES ══════════════ */}
      <section className="categories-band">
        <div className="container">
          <div className="section-head">
            <span className="section-label">Browse by category</span>
            <h2>Skills for every interest</h2>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.name} {...fadeUp(i * 0.06)}>
                <Link to={`/browse?category=${cat.name}`} className="cat-chip">
                  <span className="cat-emoji">{cat.emoji}</span>
                  <span className="cat-name">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="section-pad container">
        <div className="section-head">
          <span className="section-label">Why SkillSwap</span>
          <h2>Built for real communities</h2>
          <p className="section-sub">Everything you need to teach, learn, and connect — nothing you don't.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} className="feature-card" {...fadeUp(i * 0.1)}>
              <div className="feature-icon">
                <f.icon size={20} strokeWidth={2} />
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <section className="testimonials-band">
        <div className="container">
          <div className="section-head center">
            <span className="section-label">Community stories</span>
            <h2>Real people, real swaps</h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} className="testimonial-card" {...fadeUp(i * 0.1)}>
                <div className="t-stars">{"★★★★★"}</div>
                <p className="t-text">"{t.text}"</p>
                <div className="t-author">
                  <div className="t-avatar">{t.name[0]}</div>
                  <div>
                    <p className="t-name">{t.name}</p>
                    <p className="t-loc">{t.loc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="cta-band">
        <div className="container cta-inner">
          <motion.div {...fadeUp()}>
            <span className="section-label" style={{ color: "var(--gold-light)" }}>Ready to start?</span>
            <h2 className="cta-h2">Your next skill is one swap away</h2>
            <p className="cta-sub">Join the community and start exchanging skills today. It's completely free.</p>
            <div className="cta-actions">
              {user ? (
                <Link to="/browse" className="btn btn-primary btn-lg">Browse listings <ArrowRight size={17} /></Link>
              ) : (
                <>
                  <Link to="/signup" className="btn btn-primary btn-lg">Create free account</Link>
                  <Link to="/browse" className="btn btn-ghost" style={{ border: "2px solid rgba(255,255,255,0.35)" }}>Browse first</Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        /* ---- Hero ---- */
        .hero { padding: var(--space-9) 0 var(--space-8); color: var(--paper-raised); overflow: hidden; }
        .hero-inner {
          display: grid; grid-template-columns: 1.15fr 0.85fr;
          gap: var(--space-8); align-items: center;
        }
        .hero-eyebrow {
          font-family: var(--font-mono); font-size: 0.72rem;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold-light); font-weight: 600;
          display: block; margin-bottom: var(--space-3);
        }
        .hero-h1 { color: var(--paper-raised); font-size: clamp(2.6rem, 5vw + 1rem, 4.2rem); line-height: 1.05; margin-bottom: var(--space-4); }
        .hero-em { color: var(--gold-light); font-style: italic; }
        .hero-sub { font-size: 1.08rem; color: rgba(240,236,224,0.82); max-width: 480px; line-height: 1.65; margin-bottom: var(--space-5); }
        .hero-actions { display: flex; gap: var(--space-3); flex-wrap: wrap; margin-bottom: var(--space-4); }
        .hero-ghost-btn { border: 2px solid rgba(255,255,255,0.38) !important; }
        .hero-trust { font-size: 0.8rem; color: rgba(240,236,224,0.55); display: flex; align-items: center; gap: var(--space-1); flex-wrap: wrap; }
        .trust-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold-light); display: inline-block; }
        .hero-board { display: grid; gap: var(--space-4); }
        .hero-pin { padding: var(--space-4) var(--space-4) var(--space-3); }

        /* ---- Stats band ---- */
        .stats-band { background: var(--paper-raised); border-bottom: 1px solid var(--line); padding: var(--space-7) 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: var(--space-4); }
        .stat-item { text-align: center; padding: var(--space-4); }
        .stat-value { display: block; font-family: var(--font-display); font-size: 2.6rem; font-weight: 700; color: var(--teal); line-height: 1; margin-bottom: 6px; }
        .stat-label { font-size: 0.88rem; color: var(--ink-soft); font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }

        /* ---- Generic section ---- */
        .section-pad { padding: var(--space-8) 0; }
        .section-head { margin-bottom: var(--space-7); }
        .section-head.center { text-align: center; }
        .section-sub { color: var(--ink-soft); font-size: 1.02rem; max-width: 520px; margin-top: var(--space-2); }

        /* ---- Steps ---- */
        .steps-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: var(--space-5); }
        .step-card {
          background: var(--paper-raised); border: 1px solid var(--line);
          border-radius: var(--radius-lg); padding: var(--space-5);
          box-shadow: var(--shadow-xs); position: relative;
          transition: box-shadow 0.25s, transform 0.25s;
        }
        .step-card:hover { box-shadow: var(--shadow-card); transform: translateY(-3px); }
        .step-num { font-family: var(--font-mono); font-size: 0.72rem; color: var(--line); font-weight: 700; margin-bottom: var(--space-3); letter-spacing: 0.1em; }
        .step-icon-wrap { width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--teal-bg); display: flex; align-items: center; justify-content: center; color: var(--teal); margin-bottom: var(--space-3); }
        .step-title { font-size: 1.08rem; margin-bottom: var(--space-2); }
        .step-desc  { color: var(--ink-soft); font-size: 0.92rem; line-height: 1.6; margin: 0; }

        /* ---- Categories ---- */
        .categories-band { background: var(--paper-raised); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: var(--space-8) 0; }
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px,1fr)); gap: var(--space-3); margin-top: var(--space-6); }
        .cat-chip {
          display: flex; flex-direction: column; align-items: center; gap: var(--space-2);
          background: var(--paper); border: 1.5px solid var(--line);
          border-radius: var(--radius-lg); padding: var(--space-4) var(--space-3);
          text-decoration: none; color: var(--ink);
          transition: all 0.2s ease;
        }
        .cat-chip:hover { border-color: var(--teal); background: var(--teal-bg); color: var(--teal); text-decoration: none; transform: translateY(-2px); box-shadow: var(--shadow-card); }
        .cat-emoji { font-size: 1.6rem; }
        .cat-name  { font-size: 0.83rem; font-weight: 600; text-align: center; }

        /* ---- Features ---- */
        .features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: var(--space-5); }
        .feature-card { padding: var(--space-5); border-radius: var(--radius-lg); background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-xs); transition: box-shadow 0.25s, transform 0.25s; }
        .feature-card:hover { box-shadow: var(--shadow-card); transform: translateY(-3px); }
        .feature-icon { width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--gold-bg); display: flex; align-items: center; justify-content: center; color: var(--gold); margin-bottom: var(--space-4); }
        .feature-title { font-size: 1.08rem; margin-bottom: var(--space-2); }
        .feature-desc  { color: var(--ink-soft); font-size: 0.92rem; line-height: 1.6; margin: 0; }

        /* ---- Testimonials ---- */
        .testimonials-band { background: var(--board); padding: var(--space-8) 0; }
        .testimonials-band .section-label { color: var(--gold-light); }
        .testimonials-band h2 { color: var(--paper-raised); }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: var(--space-5); margin-top: var(--space-6); }
        .testimonial-card { background: rgba(250,247,239,0.09); border: 1px solid rgba(255,255,255,0.12); border-radius: var(--radius-lg); padding: var(--space-5); backdrop-filter: blur(4px); }
        .t-stars { color: var(--gold-light); font-size: 0.85rem; letter-spacing: 2px; margin-bottom: var(--space-3); }
        .t-text  { color: rgba(240,236,224,0.88); font-size: 0.95rem; line-height: 1.65; margin-bottom: var(--space-4); font-style: italic; }
        .t-author { display: flex; align-items: center; gap: var(--space-3); }
        .t-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--gold); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; color: var(--board-dark); flex-shrink: 0; }
        .t-name   { font-weight: 600; font-size: 0.9rem; color: var(--paper-raised); margin: 0; }
        .t-loc    { font-size: 0.78rem; color: rgba(240,236,224,0.55); margin: 2px 0 0; }

        /* ---- CTA band ---- */
        .cta-band { background: var(--ink); padding: var(--space-9) 0; text-align: center; }
        .cta-inner { max-width: 620px; margin: 0 auto; }
        .cta-h2   { color: var(--paper-raised); margin-bottom: var(--space-3); }
        .cta-sub  { color: rgba(240,236,224,0.65); font-size: 1.05rem; margin-bottom: var(--space-6); }
        .cta-actions { display: flex; gap: var(--space-3); justify-content: center; flex-wrap: wrap; }

        /* ---- Responsive ---- */
        @media (max-width: 900px) {
          .hero-inner      { grid-template-columns: 1fr; }
          .steps-grid      { grid-template-columns: 1fr; }
          .features-grid   { grid-template-columns: 1fr; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .stats-grid      { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr; }
          .cat-grid   { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>
    </PageTransition>
  );
}
