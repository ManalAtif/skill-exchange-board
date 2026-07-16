import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PinIcon, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const linkClass = ({ isActive }) => `navlink${isActive ? " navlink-active" : ""}`;

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <PinIcon size={18} strokeWidth={2.5} />
          <span>SkillSwap</span>
        </Link>

        <button className="nav-toggle" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`nav-links${open ? " open" : ""}`}>
          <NavLink to="/browse" className={linkClass} onClick={() => setOpen(false)}>Browse</NavLink>

          {user ? (
            <>
              <NavLink to="/create-listing" className={linkClass} onClick={() => setOpen(false)}>New Listing</NavLink>
              <NavLink to="/matches" className={linkClass} onClick={() => setOpen(false)}>Matches</NavLink>
              <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>Profile</NavLink>
              <motion.button whileTap={{ scale: 0.95 }} className="btn btn-outline btn-sm" onClick={handleLogout}>
                Log out
              </motion.button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>Log in</NavLink>
              <Link to="/signup" onClick={() => setOpen(false)}>
                <motion.span whileTap={{ scale: 0.95 }} className="btn btn-primary btn-sm">
                  Sign up
                </motion.span>
              </Link>
            </>
          )}
        </nav>
      </div>

      <style>{`
        .nav {
          background: var(--ink);
          color: var(--paper-raised);
          position: sticky;
          top: 0;
          z-index: 40;
          border-bottom: 3px solid var(--gold);
        }
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--paper-raised);
        }
        .brand:hover { text-decoration: none; color: var(--gold); }
        .nav-links {
          display: flex;
          align-items: center;
          gap: var(--space-5);
        }
        .navlink {
          color: var(--paper-raised);
          opacity: 0.85;
          font-weight: 500;
          font-size: 0.95rem;
          position: relative;
          padding: 4px 0;
        }
        .navlink:hover { opacity: 1; text-decoration: none; }
        .navlink-active { opacity: 1; }
        .navlink-active::after {
          content: "";
          position: absolute;
          left: 0; right: 0; bottom: -4px;
          height: 2px;
          background: var(--gold);
        }
        .nav-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--paper-raised);
          cursor: pointer;
        }
        @media (max-width: 780px) {
          .nav-toggle { display: block; }
          .nav-links {
            position: absolute;
            top: 64px; left: 0; right: 0;
            background: var(--ink);
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-4);
            padding: var(--space-4) var(--space-5) var(--space-5);
            display: none;
            border-bottom: 3px solid var(--gold);
          }
          .nav-links.open { display: flex; }
        }
      `}</style>
    </header>
  );
}
