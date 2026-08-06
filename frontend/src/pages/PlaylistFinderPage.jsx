import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import PlaylistCard from "../components/PlaylistCard.jsx";
import PlaylistCompareModal from "../components/PlaylistCompareModal.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import AuthModal from "../components/AuthModal.jsx";
import Mascot from "../components/illustrations/Mascot.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { usePlaylistBookmarks } from "../hooks/usePlaylistBookmarks.js";

const EXAMPLE_TOPICS = [
  "Binary Trees",
  "React JS",
  "Machine Learning",
  "Class 12 Physics",
  "Organic Chemistry",
  "Excel",
];

const MAX_COMPARE = 3;

export default function PlaylistFinderPage() {
  const [query, setQuery] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [showSaved, setShowSaved] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { showToast } = useToast();
  const { bookmarks, isBookmarked, toggleBookmark, isLoggedIn } = usePlaylistBookmarks();

  function runSearch(topic, pageToken = "") {
    const isFirstPage = !pageToken;
    if (isFirstPage) {
      setLoading(true);
      setPlaylists([]);
      setNextPageToken(null);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    const pageParam = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : "";
    fetch(`/api/playlists/search?q=${encodeURIComponent(topic)}${pageParam}`)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        if (isFirstPage) {
          setPlaylists(data.playlists || []);
        } else {
          setPlaylists((prev) => {
            const seen = new Set(prev.map((p) => p.id));
            const additions = (data.playlists || []).filter((p) => !seen.has(p.id));
            return [...prev, ...additions];
          });
        }
        setNextPageToken(data.nextPageToken || null);
      })
      .catch(() => {
        setError("Could not find playlists for this topic. Try a different search.");
        showToast("Playlist search failed", "error");
      })
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  }

  function handleSearch(topic) {
    setShowSaved(false);
    setQuery(topic);
    runSearch(topic);
  }

  function handleClearSearch() {
    setQuery(null);
    setPlaylists([]);
    setNextPageToken(null);
  }

  function handleLoadMore() {
    if (!nextPageToken || !query) return;
    runSearch(query, nextPageToken);
  }

  function handleExampleClick(topic) {
    handleSearch(topic);
  }

  function handleToggleBookmark(playlist) {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    toggleBookmark(playlist);
  }

  function handleSavedNavClick() {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    setShowSaved((v) => !v);
  }

  function handleToggleCompare(playlist) {
    setCompareList((prev) => {
      const exists = prev.find((p) => p.id === playlist.id);
      if (exists) return prev.filter((p) => p.id !== playlist.id);
      if (prev.length >= MAX_COMPARE) {
        showToast(`You can compare up to ${MAX_COMPARE} playlists at a time`, "info");
        return prev;
      }
      return [...prev, playlist];
    });
  }

  function handleRemoveFromCompare(playlistId) {
    setCompareList((prev) => prev.filter((p) => p.id !== playlistId));
  }

  function handleClearCompare() {
    setCompareList([]);
    setShowCompareModal(false);
  }

  const displayedPlaylists = showSaved ? bookmarks : playlists;

  return (
    <div className="app-shell">
      <Navbar
        onSearch={handleSearch}
        onClear={handleClearSearch}
        user={user}
        onLoginClick={() => setShowAuthModal(true)}
        onLogout={logout}
        searchPlaceholder="What do you want to learn? e.g. “Binary Trees”, “React JS”, “Class 12 Physics”"
      />

      <div className="subnav">
        <span />
        <button
          className={`saved-nav-btn ${showSaved ? "active" : ""}`}
          onClick={handleSavedNavClick}
        >
          ★ Saved ({bookmarks.length})
        </button>
      </div>

      <div className="page-content">
        {!query && !showSaved && (
          <div className="playlist-intro">
            <Mascot variant="searching" width={260} />
            <h1 className="playlist-intro-title">Playlist Finder</h1>
            <p className="playlist-intro-subtitle">
              Search any topic — programming, exams, languages, finance, anything —
              and get YouTube playlists ranked by topic coverage, teaching
              engagement, recency, and completeness. No more guessing which
              course to commit to.
            </p>
            <div className="playlist-examples">
              {EXAMPLE_TOPICS.map((topic) => (
                <button
                  key={topic}
                  className="playlist-example-chip"
                  onClick={() => handleExampleClick(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {query && !showSaved && (
          <div className="toolbar">
            <span className="toolbar-label">
              {playlists.length} playlist{playlists.length !== 1 ? "s" : ""} for "{query}"
            </span>
          </div>
        )}

        {showSaved && (
          <div className="toolbar">
            <span className="toolbar-label">
              {bookmarks.length} saved playlist{bookmarks.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {error && !showSaved && <div className="error-state">{error}</div>}

        {loading && !error && !showSaved && (
          <div className="channel-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && !error && displayedPlaylists.length === 0 && (query || showSaved) && (
          <div className="empty-state">
            <Mascot variant="empty" width={220} />
            <p className="empty-state-text">
              {showSaved
                ? "No saved playlists yet — click the star on any playlist card to save it here."
                : `No playlists found for "${query}". Try a broader or differently worded topic.`}
            </p>
          </div>
        )}

        {!loading && displayedPlaylists.length > 0 && (
          <>
            <div className="channel-grid">
              {displayedPlaylists.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  searchTopic={query}
                  onToggleBookmark={handleToggleBookmark}
                  isBookmarked={isBookmarked(playlist.id)}
                  onToggleCompare={handleToggleCompare}
                  isComparing={compareList.some((p) => p.id === playlist.id)}
                  compareDisabled={
                    compareList.length >= MAX_COMPARE &&
                    !compareList.some((p) => p.id === playlist.id)
                  }
                />
              ))}
            </div>

            {!showSaved && nextPageToken && (
              <div className="load-more-row">
                <button
                  className="load-more-btn"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading…" : "Load more playlists"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {compareList.length > 0 && (
        <div className="compare-bar">
          <span className="compare-bar-text">
            {compareList.length} of {MAX_COMPARE} selected for comparison
          </span>
          <div className="compare-bar-actions">
            <button className="compare-bar-clear" onClick={handleClearCompare}>
              Clear
            </button>
            <button
              className="compare-bar-view"
              onClick={() => setShowCompareModal(true)}
              disabled={compareList.length < 2}
            >
              Compare {compareList.length >= 2 ? "now" : "(pick 1 more)"}
            </button>
          </div>
        </div>
      )}

      {showCompareModal && (
        <PlaylistCompareModal
          playlists={compareList}
          onClose={() => setShowCompareModal(false)}
          onRemove={handleRemoveFromCompare}
        />
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      <Footer />
    </div>
  );
}