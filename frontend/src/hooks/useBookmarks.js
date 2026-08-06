import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

// Bookmarks now live on the server, tied to the logged-in user, instead
// of localStorage - so they follow you across devices/browsers as long
// as you're logged into the same account.
export function useBookmarks() {
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    if (!token) {
      setBookmarks([]);
      return;
    }
    setLoading(true);
    fetch("/api/bookmarks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setBookmarks(Array.isArray(data) ? data : []))
      .catch(() => setBookmarks([]))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function isBookmarked(channelId) {
    return bookmarks.some((b) => b.id === channelId);
  }

  async function toggleBookmark(channel) {
    if (!token) return; // caller should prompt login before this is reachable

    const already = isBookmarked(channel.id);

    if (already) {
      setBookmarks((prev) => prev.filter((b) => b.id !== channel.id)); // optimistic
      await fetch(`/api/bookmarks/${channel.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast(`Removed ${channel.name} from Saved`, "info");
    } else {
      setBookmarks((prev) => [channel, ...prev]); // optimistic
      await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ channel }),
      });
      showToast(`Saved ${channel.name}`, "success");
    }
  }

  return { bookmarks, isBookmarked, toggleBookmark, loading, isLoggedIn: !!user };
}