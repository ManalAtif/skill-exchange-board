import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

// The signature element of the whole app: a pinned index card.
// Content is rendered as plain React text (never dangerouslySetInnerHTML),
// so anything a person types into a listing is auto-escaped by React.
export default function ListingCard({ listing, index = 0 }) {
  const navigate = useNavigate();
  const isOffer = listing.type === "offer";

  return (
    <motion.div
      className="pin-card"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/listing/${listing._id || listing.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") navigate(`/listing/${listing._id || listing.id}`);
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
      style={{ cursor: "pointer" }}
    >
      <span className={`stamp ${isOffer ? "offer" : "request"}`}>
        {isOffer ? "Offering" : "Looking for"}
      </span>
      <h3 className="card-title">{listing.title}</h3>
      <p className="card-meta">
        {listing.category}
        {listing.location ? (
          <>
            {" "}·{" "}
            <MapPin size={12} style={{ verticalAlign: "-2px" }} /> {listing.location}
          </>
        ) : null}
      </p>
      <p className="card-desc">
        {listing.description?.slice(0, 110)}
        {listing.description?.length > 110 ? "…" : ""}
      </p>
    </motion.div>
  );
}
