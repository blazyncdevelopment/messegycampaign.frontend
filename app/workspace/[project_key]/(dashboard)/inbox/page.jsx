"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function InboxPage() {
  const { project_key } = useParams();

  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);

  /* ---------------- FETCH CONVERSATIONS ---------------- */
  const fetchConversations = async () => {
    try {
      const res = await api.get(`/inbox?project_key=${project_key}`);
      setConversations(res.data);
    } catch {
      console.error("Failed to load inbox");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FETCH MESSAGES ---------------- */
const fetchMessages = async (id) => {
  try {
    setMsgLoading(true);

    const res = await api.get(`/inbox/${id}`);

    setMessages(res.data.messages); // 🔥 FIX

  } catch {
    console.error("Failed to load messages");
  } finally {
    setMsgLoading(false);
  }
};

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSelect = (conv) => {
    setSelected(conv);
    fetchMessages(conv.id);
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-white">

      {/* LEFT SIDEBAR */}
      <div className="w-[320px] border-r overflow-y-auto">

        <div className="p-4 border-b font-semibold text-lg">
          Inbox
        </div>

        {conversations.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground">
            No conversations
          </div>
        )}

        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => handleSelect(c)}
            className={`p-4 border-b cursor-pointer transition
              ${selected?.id === c.id
                ? "bg-muted"
                : "hover:bg-muted/50"
              }`}
          >
            <div className="flex justify-between">
              <p className="font-medium text-sm">
                {c.contact?.firstName || "Unknown"}
              </p>

              <span className="text-xs text-muted-foreground">
                {new Date(c.updatedAt).toLocaleDateString()}
              </span>
            </div>

            <p className="text-xs text-muted-foreground mt-1 truncate">
              {c.email}
            </p>
          </div>
        ))}

      </div>

      {/* RIGHT PANEL */}
     <div className="flex-1 flex flex-col bg-[#f6f8fb]">

  {!selected && (
    <div className="flex-1 flex items-center justify-center text-muted-foreground">
      Select a conversation
    </div>
  )}

  {selected && (
    <>
      {/* HEADER */}
      <div className="px-6 py-4 border-b bg-white">
        <h2 className="font-semibold text-lg">
          {selected.contact?.firstName || selected.email}
        </h2>
        <p className="text-sm text-muted-foreground">
          {selected.email}
        </p>
      </div>

      {/* MESSAGE LIST */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {msgLoading && (
          <div className="flex justify-center">
            <Loader2 className="animate-spin" />
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className="bg-white rounded-xl border shadow-sm">

            {/* MESSAGE HEADER */}
            <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50 rounded-t-xl">
              <div>
                <p className="text-sm font-medium">
                  {m.direction === "outbound"
                    ? "You"
                    : selected.contact?.firstName || "User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {m.email}
                </p>
              </div>

              <p className="text-xs text-muted-foreground">
                {new Date(m.createdAt).toLocaleString()}
              </p>
            </div>

            {/* MESSAGE BODY */}
            <div className="p-4 overflow-x-auto">
              
              {/* ⚠️ email HTML ko isolate kar */}
              <div className="border rounded-lg overflow-hidden bg-white">
                <iframe
                  srcDoc={m.html}
                  className="w-full h-full"
                />
              </div>

            </div>

          </div>
        ))}

      </div>
    </>
  )}
</div>

    </div>
  );
}