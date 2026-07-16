import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";

export default function ListingCard({ listing, index = 0 }) {
  const navigate = useNavigate();
  const isOffer = listing.type === "offer";
  const id = listing._id || listing.id;

  return (
    <motion.div
      className="pin-card listing-card"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/listing/${id}`)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") navigate(`/listing/${id}`); }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
      style={{ cursor: "pointer" }}
    >
      <div className="lc-top">
        <span className={`stamp ${isOffer ? "offer" : "request"}`}>
          {isOffer ? "Offering" : "Looking for"}
        </span>
      </div>
      <h3 className="card-title">{listing.title}</h3>
      <p className="card-meta">
        {listing.category}
        {listing.location && (
          <><span className="lc-dot">·</span><MapPin size={11} style={{ flexShrink: 0 }} />{listing.location}</>
        )}
      </p>
      <p className="card-desc">
        {listing.description?.slice(0, 105)}
        {listing.description?.length > 105 ? "…" : ""}
      </p>
      <div className="lc-footer">
        <span className="lc-more">View details <ArrowRight size={13} /></span>
      </div>
    </motion.div>
  );
}
