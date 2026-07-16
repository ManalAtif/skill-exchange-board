import { Link } from "react-router-dom";
import { PinIcon, Github, Mail } from "lucide-react";

const LINKS = {
  Explore:  [{ label: "Browse listings", to: "/browse" }, { label: "How it works", to: "/#how" }, { label: "Skill categories", to: "/browse" }],
  Account:  [{ label: "Sign up free", to: "/signup" }, { label: "Log in", to: "/login" }, { label: "My listings", to: "/my-listings" }],
  Community:[{ label: "Post a listing", to: "/create-listing" }, { label: "My matches", to: "/matches" }, { label: "My profile", to: "/profile" }],
};

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <div className="footer-logo-icon"><PinIcon size={15} strokeWidth={2.5} /></div>
            <span>SkillSwap</span>
          </Link>
          <p className="footer-tagline">
            Teach what you know.<br />Learn what you don't.
          </p>
          <div className="footer-social">
            <a href="mailto:hello@skillswap.pk" className="social-btn" aria-label="Email us"><Mail size={16} /></a>
            <a href="https://github.com" className="social-btn" aria-label="GitHub" target="_blank" rel="noopener noreferrer"><Github size={16} /></a>
          </div>
        </div>

        {Object.entries(LINKS).map(([group, items]) => (
          <div key={group} className="footer-col">
            <h4 className="footer-col-title">{group}</h4>
            <ul className="footer-col-links">
              {items.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="footer-link">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {year} SkillSwap. Built for local communities.</p>
          <div className="footer-bottom-links">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: var(--ink);
          color: rgba(240,236,224,0.65);
          border-top: 2px solid rgba(168,120,32,0.4);
          margin-top: auto;
        }
        .footer-inner {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: var(--space-7);
          padding-top: var(--space-7);
          padding-bottom: var(--space-7);
        }
        .footer-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; margin-bottom: var(--space-4);
        }
        .footer-logo:hover { text-decoration: none; }
        .footer-logo-icon {
          width: 30px; height: 30px; border-radius: var(--radius-md);
          background: var(--teal); display: flex; align-items: center;
          justify-content: center; color: var(--paper-raised); flex-shrink: 0;
        }
        .footer-logo span {
          font-family: var(--font-display); font-weight: 700;
          font-size: 1.1rem; color: var(--paper-raised);
        }
        .footer-tagline {
          font-size: 0.9rem; line-height: 1.65;
          color: rgba(240,236,224,0.5); margin-bottom: var(--space-4);
        }
        .footer-social { display: flex; gap: var(--space-2); }
        .social-btn {
          width: 34px; height: 34px; border-radius: var(--radius-md);
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          color: rgba(240,236,224,0.6);
          transition: background 0.18s, color 0.18s;
          text-decoration: none;
        }
        .social-btn:hover { background: var(--teal); color: var(--paper-raised); text-decoration: none; }
        .footer-col-title {
          font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(240,236,224,0.4); margin-bottom: var(--space-4);
        }
        .footer-col-links { display: flex; flex-direction: column; gap: var(--space-3); }
        .footer-link {
          font-size: 0.88rem; color: rgba(240,236,224,0.62);
          transition: color 0.15s; text-decoration: none;
        }
        .footer-link:hover { color: var(--paper-raised); text-decoration: none; }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: var(--space-4) 0;
        }
        .footer-bottom-inner {
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: var(--space-3);
        }
        .footer-bottom p { font-size: 0.82rem; margin: 0; }
        .footer-bottom-links {
          display: flex; gap: var(--space-4); font-size: 0.82rem;
        }
        .footer-bottom-links span { cursor: pointer; transition: color 0.15s; }
        .footer-bottom-links span:hover { color: var(--paper-raised); }
        @media (max-width: 820px) {
          .footer-inner { grid-template-columns: 1fr 1fr; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .footer-inner { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  );
}
