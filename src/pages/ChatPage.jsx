import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft } from "lucide-react";
import { getMessages, sendMessage, getListingById } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { sanitizeText } from "../utils/validation";
import PageTransition from "../components/PageTransition";

const MAX_MESSAGE_LENGTH = 1000;

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDay(ts) {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

// Group messages by day so we can show date separators
function groupByDay(messages) {
  const groups = [];
  let lastDay = null;
  for (const msg of messages) {
    const day = new Date(msg.timestamp).toDateString();
    if (day !== lastDay) {
      groups.push({ type: "separator", label: formatDay(msg.timestamp), key: `sep-${msg.timestamp}` });
      lastDay = day;
    }
    groups.push({ type: "message", msg });
  }
  return groups;
}

function Avatar({ name, isMe }) {
  const initial = name?.[0]?.toUpperCase() || "?";
  return (
    <div
      className="chat-avatar"
      style={{ background: isMe ? "var(--teal)" : "var(--gold)" }}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}

export default function ChatPage() {
  const { listingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [listing, setListing] = useState(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // Fetch listing info so we can show who you're talking about
  useEffect(() => {
    getListingById(listingId)
      .then((res) => setListing(res.data))
      .catch(() => setListing({ title: "Listing", owner_name: "Other user" }));
  }, [listingId]);

  useEffect(() => {
    let cancelled = false;
    const fetchMessages = async () => {
      try {
        const res = await getMessages(listingId);
        if (!cancelled) setMessages(res.data);
      } catch {
        if (!cancelled) {
          setMessages([
            { id: "m1", sender_id: "other", sender_name: "Alex", content: "Hey! Saw your listing, still available?", timestamp: Date.now() - 120000 },
            { id: "m2", sender_id: user?.id || "me", sender_name: user?.name || "You", content: "Yes, absolutely! When works for you?", timestamp: Date.now() - 60000 },
            { id: "m3", sender_id: "other", sender_name: "Alex", content: "This weekend would be great.", timestamp: Date.now() - 30000 },
          ]);
        }
      }
    };
    fetchMessages();
    return () => { cancelled = true; };
  }, [listingId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const clean = sanitizeText(text, MAX_MESSAGE_LENGTH);
    if (!clean || sending) return;

    setSending(true);
    const optimistic = {
      id: `local-${Date.now()}`,
      sender_id: user?.id || "me",
      sender_name: user?.name || "You",
      content: clean,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setText("");

    try {
      await sendMessage({ listing_id: listingId, content: clean });
    } catch {
      // optimistic message stays; could add a "failed" indicator later
    } finally {
      setSending(false);
    }
  };

  const items = groupByDay(messages);

  return (
    <PageTransition>
      <div className="container chat-page">
        <div className="chat-shell">
          {/* Header */}
          <div className="chat-header">
            <button className="chat-back" onClick={() => navigate(-1)} aria-label="Go back">
              <ArrowLeft size={18} />
            </button>
            <div className="chat-header-info">
              <p className="chat-header-title">
                {listing?.title || "Conversation"}
              </p>
              {listing?.owner_name && (
                <p className="chat-header-sub">with {listing.owner_name}</p>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="chat-body">
            <AnimatePresence initial={false}>
              {items.map((item) => {
                if (item.type === "separator") {
                  return (
                    <div key={item.key} className="day-separator">
                      <span>{item.label}</span>
                    </div>
                  );
                }

                const { msg } = item;
                const isMe = msg.sender_id === (user?.id || "me");
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`msg-row ${isMe ? "mine" : "theirs"}`}
                  >
                    {!isMe && <Avatar name={msg.sender_name} isMe={false} />}
                    <div className="msg-col">
                      {!isMe && <span className="msg-name">{msg.sender_name}</span>}
                      <div className={`bubble ${isMe ? "mine" : "theirs"}`}>{msg.content}</div>
                      <span className="msg-time">{formatTime(msg.timestamp)}</span>
                    </div>
                    {isMe && <Avatar name={msg.sender_name || user?.name} isMe={true} />}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="chat-input-row">
            <input
              className="input"
              placeholder="Type a message…"
              maxLength={MAX_MESSAGE_LENGTH}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="btn btn-primary"
              onClick={handleSend}
              disabled={sending || !text.trim()}
              aria-label="Send message"
            >
              <Send size={16} />
            </motion.button>
          </div>
        </div>
      </div>

      <style>{`
        .chat-page { padding: var(--space-7) var(--space-5) var(--space-9); display: flex; justify-content: center; }
        .chat-shell {
          width: 100%; max-width: 560px; height: 620px;
          background: var(--paper-raised); border: 1px solid var(--line);
          border-radius: var(--radius-lg); box-shadow: var(--shadow-card);
          display: flex; flex-direction: column; overflow: hidden;
        }
        .chat-header {
          display: flex; align-items: center; gap: var(--space-3);
          padding: var(--space-4) var(--space-5);
          border-bottom: 1px solid var(--line);
          background: var(--paper-raised);
        }
        .chat-back {
          background: none; border: none; cursor: pointer;
          color: var(--ink-soft); display: flex; padding: 4px;
          border-radius: var(--radius-sm);
        }
        .chat-back:hover { color: var(--ink); }
        .chat-header-info { flex: 1; min-width: 0; }
        .chat-header-title {
          font-family: var(--font-display); font-weight: 600;
          font-size: 1rem; margin: 0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .chat-header-sub { font-size: 0.8rem; color: var(--ink-soft); margin: 0; }
        .chat-body {
          flex: 1; overflow-y: auto; padding: var(--space-4) var(--space-5);
          display: flex; flex-direction: column; gap: var(--space-2);
        }
        .day-separator {
          display: flex; align-items: center; gap: var(--space-3);
          color: var(--ink-soft); font-size: 0.75rem; font-family: var(--font-mono);
          text-transform: uppercase; letter-spacing: 0.06em; margin: var(--space-2) 0;
        }
        .day-separator::before, .day-separator::after {
          content: ""; flex: 1; height: 1px; background: var(--line);
        }
        .msg-row {
          display: flex; align-items: flex-end; gap: var(--space-2);
        }
        .msg-row.mine  { justify-content: flex-end; }
        .msg-row.theirs { justify-content: flex-start; }
        .msg-col { display: flex; flex-direction: column; max-width: 72%; }
        .msg-row.mine .msg-col { align-items: flex-end; }
        .msg-name { font-size: 0.75rem; color: var(--ink-soft); margin-bottom: 2px; font-weight: 600; }
        .msg-time { font-size: 0.7rem; color: var(--ink-soft); margin-top: 3px; }
        .chat-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700;
          color: var(--paper-raised); flex-shrink: 0; margin-bottom: 18px;
        }
        .chat-input-row {
          display: flex; gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          border-top: 1px solid var(--line);
        }
        .chat-input-row .input { flex: 1; }
      `}</style>
    </PageTransition>
  );
}
