import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { getMessages, sendMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { sanitizeText } from "../utils/validation";
import PageTransition from "../components/PageTransition";

const MAX_MESSAGE_LENGTH = 1000;

export default function ChatPage() {
  const { listingId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const fetchMessages = async () => {
      try {
        const res = await getMessages(listingId);
        if (!cancelled) setMessages(res.data);
      } catch {
        if (!cancelled) {
          setMessages([
            { id: "m1", sender_id: "other", content: "Hey! Saw your listing, still available?", timestamp: Date.now() - 60000 },
          ]);
        }
      }
    };
    fetchMessages();
    return () => { cancelled = true; };
  }, [listingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const clean = sanitizeText(text, MAX_MESSAGE_LENGTH);
    if (!clean || sending) return;

    setSending(true);
    const optimisticMessage = {
      id: `local-${Date.now()}`,
      sender_id: user?.id || "me",
      content: clean,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    setText("");

    try {
      await sendMessage({ listing_id: listingId, content: clean });
    } catch {
      // The optimistic message stays visible even if the network call fails —
      // consider adding a retry/failed indicator once the backend is live.
    } finally {
      setSending(false);
    }
  };

  return (
    <PageTransition>
      <div className="container chat-page">
        <div className="chat-shell">
          <div className="chat-header">
            <h3>Conversation</h3>
          </div>

          <div className="chat-body">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isMe = msg.sender_id === (user?.id || "me");
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}
                  >
                    <div className={`bubble ${isMe ? "mine" : "theirs"}`}>{msg.content}</div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-row">
            <input
              className="input"
              placeholder="Type a message…"
              maxLength={MAX_MESSAGE_LENGTH}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <motion.button whileTap={{ scale: 0.9 }} className="btn btn-primary" onClick={handleSend} disabled={sending || !text.trim()} aria-label="Send message">
              <Send size={16} />
            </motion.button>
          </div>
        </div>
      </div>

      <style>{`
        .chat-page { padding: var(--space-7) var(--space-5) var(--space-9); display: flex; justify-content: center; }
        .chat-shell {
          width: 100%; max-width: 520px; height: 560px;
          background: var(--paper-raised); border: 1px solid var(--line); border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card); display: flex; flex-direction: column; overflow: hidden;
        }
        .chat-header { padding: var(--space-4) var(--space-5); border-bottom: 1px solid var(--line); }
        .chat-header h3 { margin: 0; }
        .chat-body { flex: 1; overflow-y: auto; padding: var(--space-4) var(--space-5); display: flex; flex-direction: column; gap: var(--space-3); }
        .chat-input-row { display: flex; gap: var(--space-2); padding: var(--space-3) var(--space-4); border-top: 1px solid var(--line); }
        .chat-input-row .input { flex: 1; }
      `}</style>
    </PageTransition>
  );
}
