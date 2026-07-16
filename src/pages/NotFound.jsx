import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PinIcon } from "lucide-react";
import PageTransition from "../components/PageTransition";

export default function NotFound() {
  return (
    <PageTransition>
      <div className="nf-wrap">
        <motion.div
          className="nf-card"
          initial={{ opacity: 0, y: 20, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ duration: 0.4 }}
        >
          <div className="nf-pin">
            <PinIcon size={22} color="var(--gold)" />
          </div>
          <span className="stamp offer" style={{ marginBottom: "1.5rem" }}>404</span>
          <h1 className="nf-title">Page not found</h1>
          <p className="nf-desc">
            Looks like this card fell off the board. The page you're looking for doesn't exist.
          </p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
            Back to home
          </Link>
        </motion.div>
      </div>

      <style>{`
        .nf-wrap {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-8) var(--space-4);
          background: var(--paper);
        }
        .nf-card {
          position: relative;
          background: var(--paper-raised);
          border: 1px solid var(--line);
          border-radius: 3px;
          padding: var(--space-7) var(--space-6);
          box-shadow: var(--shadow-pop);
          max-width: 400px;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .nf-pin {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: radial-gradient(circle at 32% 32%, var(--gold) 0%, var(--gold-dark) 70%);
          box-shadow: 0 2px 4px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nf-title {
          font-size: 2rem;
          margin: var(--space-2) 0 var(--space-3);
        }
        .nf-desc {
          color: var(--ink-soft);
          font-size: 0.97rem;
          margin: 0;
        }
      `}</style>
    </PageTransition>
  );
}
