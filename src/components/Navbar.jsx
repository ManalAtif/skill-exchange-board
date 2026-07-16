import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PinIcon, Menu, X, Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logoutUser(); setOpen(false); navigate("/login"); };
  const close = () => setOpen(false);
  const linkClass = ({ isActive }) => `navlink${isActive ? " navlink-active" : ""}`;

  return (
    <header className="nav">
      <div className="container nav-inner">
        {/* Brand */}
        <Link to="/" className="brand" onClick={close}>
          <div className="brand-icon"><PinIcon size={15} strokeWidth={2.5} /></div>
          <span className="brand-name">SkillSwap</span>
        </Link>

        <button className="nav-toggle" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>

        {/* Desktop */}
        <nav className="nav-links nav-desktop">
          <NavLink to="/browse" className={linkClass}>Browse</NavLink>
          {user ? (
            <>
              <NavLink to="/matches"     className={linkClass}>Matches</NavLink>
              <NavLink to="/my-listings" className={linkClass}>My Listings</NavLink>
              <Link to="/create-listing" className="btn btn-primary btn-sm nav-post-btn" onClick={close}>
                <Plus size={14} /> Post listing
              </Link>
              <NavLink to="/profile" className={`navlink nav-profile-link`} onClick={close}>
                <div className="nav-avatar" aria-label="Profile">
                  {user.photo_url
                    ? <img src={user.photo_url} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    : <span>{user.name?.[0]?.toUpperCase() || "?"}</span>}
                </div>
                <span className="nav-username">{user.name?.split(" ")[0]}</span>
              </NavLink>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Log in</NavLink>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign up free</Link>
            </>
          )}
        </nav>

        {/* Mobile slide-down */}
        <AnimatePresence>
          {open && (
            <motion.nav
              className="nav-mobile"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <NavLink to="/browse" className={linkClass} onClick={close}>Browse</NavLink>
              {user ? (
                <>
                  <NavLink to="/matches"      className={linkClass} onClick={close}>Matches</NavLink>
                  <NavLink to="/my-listings"  className={linkClass} onClick={close}>My Listings</NavLink>
                  <NavLink to="/create-listing" className={linkClass} onClick={close}>Post Listing</NavLink>
                  <NavLink to="/profile"      className={linkClass} onClick={close}>Profile</NavLink>
                  <button className="btn btn-outline btn-sm" style={{ width: "fit-content" }} onClick={handleLogout}>Log out</button>
                </>
              ) : (
                <>
                  <NavLink to="/login"  className={linkClass} onClick={close}>Log in</NavLink>
                  <Link to="/signup" className="btn btn-primary btn-sm" style={{ width: "fit-content" }} onClick={close}>Sign up free</Link>
                </>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .nav {
          background: var(--ink);
          position: sticky; top: 0; z-index: 40;
          border-bottom: 2px solid rgba(168,120,32,0.6);
          box-shadow: 0 2px 16px rgba(0,0,0,0.18);
        }
        .nav-inner {
          display: flex; align-items: center;
          justify-content: space-between;
          height: 66px; position: relative;
        }
        .brand {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .brand:hover { text-decoration: none; }
        .brand-icon {
          width: 32px; height: 32px; border-radius: var(--radius-md);
          background: var(--teal); display: flex; align-items: center;
          justify-content: center; color: var(--paper-raised);
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .brand:hover .brand-icon { background: var(--teal-light); }
        .brand-name {
          font-family: var(--font-display); font-weight: 700;
          font-size: 1.22rem; color: var(--paper-raised);
          letter-spacing: -0.01em;
          transition: color 0.2s;
        }
        .brand:hover .brand-name { color: var(--gold-light); }
        .nav-links {
          display: flex; align-items: center; gap: var(--space-5);
        }
        .navlink {
          color: rgba(240,236,224,0.75);
          font-weight: 500; font-size: 0.93rem;
          position: relative; padding: 6px 0;
          display: flex; align-items: center; gap: 6px;
          transition: color 0.18s;
          text-decoration: none;
        }
        .navlink:hover { color: var(--paper-raised); text-decoration: none; }
        .navlink-active { color: var(--paper-raised) !important; }
        .navlink-active::after {
          content: ""; position: absolute;
          left: 0; right: 0; bottom: -2px;
          height: 2px; background: var(--gold-light);
          border-radius: 2px;
        }
        .nav-post-btn { margin-left: var(--space-2); }
        .nav-profile-link { gap: 8px; }
        .nav-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: var(--gold); display: flex; align-items: center;
          justify-content: center; font-size: 0.75rem; font-weight: 700;
          color: var(--board-dark); overflow: hidden; flex-shrink: 0;
          border: 2px solid rgba(168,120,32,0.5);
        }
        .nav-avatar img  { width: 100%; height: 100%; object-fit: cover; }
        .nav-username { font-size: 0.88rem; color: rgba(240,236,224,0.8); }
        .nav-toggle {
          display: none; background: none; border: none;
          color: var(--paper-raised); cursor: pointer; padding: 4px;
        }
        .nav-mobile {
          position: absolute; top: 66px; left: 0; right: 0;
          background: var(--ink); display: flex; flex-direction: column;
          align-items: flex-start; gap: var(--space-4);
          padding: var(--space-5) var(--space-5) var(--space-6);
          border-bottom: 2px solid rgba(168,120,32,0.4);
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        }
        @media (max-width: 820px) {
          .nav-toggle  { display: flex; }
          .nav-desktop { display: none; }
        }
      `}</style>
    </header>
  );
}
