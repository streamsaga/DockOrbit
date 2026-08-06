import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

// Mirrors useBookmarks.js exactly, but for saved playlists (Playlist
// Finder's "Saved" feature) - server-backed, tied to the logged-in
// user, via /api/playlist-bookmarks instead of /api/bookmarks.
export function usePlaylistBookmarks() {
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
    fetch("/api/playlist-bookmarks", {
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

  function isBookmarked(playlistId) {
    return bookmarks.some((b) => b.id === playlistId);
  }

  async function toggleBookmark(playlist) {
    if (!token) return; // caller should prompt login before this is reachable

    const already = isBookmarked(playlist.id);

    if (already) {
      setBookmarks((prev) => prev.filter((b) => b.id !== playlist.id)); // optimistic
      await fetch(`/api/playlist-bookmarks/${playlist.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast(`Removed "${playlist.title}" from Saved`, "info");
    } else {
      setBookmarks((prev) => [playlist, ...prev]); // optimistic
      await fetch("/api/playlist-bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ playlist }),
      });
      showToast(`Saved "${playlist.title}"`, "success");
    }
  }

  return { bookmarks, isBookmarked, toggleBookmark, loading, isLoggedIn: !!user };
}