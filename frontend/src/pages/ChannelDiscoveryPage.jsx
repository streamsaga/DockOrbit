import { useEffect, useState } from "react";
import CategoryPicker from "../components/CategoryPicker.jsx";
import Dropdown from "../components/Dropdown.jsx";
import ChannelCard from "../components/ChannelCard.jsx";
import CompareModal from "../components/CompareModal.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import AuthModal from "../components/AuthModal.jsx";
import Navbar from "../components/Navbar.jsx";
import DashboardSidebar from "../components/DashboardSidebar.jsx";
import HeroSearchSection from "../components/HeroSearchSection.jsx";
import Mascot from "../components/illustrations/Mascot.jsx";
import Footer from "../components/Footer.jsx";
import { useBookmarks } from "../hooks/useBookmarks.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { COUNTRIES, LANGUAGES } from "../data/filterOptions.js";

const MAX_COMPARE = 3;

export default function ChannelDiscoveryPage() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [channels, setChannels] = useState([]);
  const [sort, setSort] = useState("trustScore");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const { bookmarks, isBookmarked, toggleBookmark, isLoggedIn } = useBookmarks();
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0) setActiveCategory(data[0].slug);
      })
      .catch(() => setError("Could not reach backend. Is it running on port 5000?"));
  }, []);

  useEffect(() => {
    if (showSaved) return;
    const url = buildUrl();
    if (!url) return;

    setLoading(true);
    setError(null);
    setChannels([]);
    setNextPageToken(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        setChannels(data.channels || []);
        setNextPageToken(data.nextPageToken || null);
      })
      .catch(() =>
        setError(
          searchQuery ? "Search failed. Try a different keyword." : "Could not load channels for this category."
        )
      )
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, searchQuery, sort, showSaved, country, language]);

  function buildUrl(pageToken = "") {
    const pageParam = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : "";
    const countryParam = country ? `&country=${country}` : "";
    const languageParam = language ? `&language=${language}` : "";
    const extraParams = `${pageParam}${countryParam}${languageParam}`;
    if (searchQuery) {
      return `/api/search?q=${encodeURIComponent(searchQuery)}&sort=${sort}${extraParams}`;
    }
    if (activeCategory) {
      return `/api/channels?category=${activeCategory}&sort=${sort}${extraParams}`;
    }
    return null;
  }

  function handleLoadMore() {
    if (!nextPageToken) return;
    const url = buildUrl(nextPageToken);
    if (!url) return;

    setLoadingMore(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setChannels((prev) => {
          const seen = new Set(prev.map((c) => c.id));
          const additions = (data.channels || []).filter((c) => !seen.has(c.id));
          return [...prev, ...additions];
        });
        setNextPageToken(data.nextPageToken || null);
      })
      .catch(() => setError("Could not load more channels."))
      .finally(() => setLoadingMore(false));
  }

  function handleSearch(query) {
    setShowSaved(false);
    setSearchQuery(query);
  }

  function handleClearSearch() {
    setSearchQuery(null);
  }

  function handleCategorySelect(slug) {
    setShowSaved(false);
    setSearchQuery(null);
    setActiveCategory(slug);
  }

  function handleToggleCompare(channel) {
    setCompareList((prev) => {
      const exists = prev.find((c) => c.id === channel.id);
      if (exists) return prev.filter((c) => c.id !== channel.id);
      if (prev.length >= MAX_COMPARE) {
        showToast(`You can compare up to ${MAX_COMPARE} channels at a time`, "info");
        return prev;
      }
      return [...prev, channel];
    });
  }

  function handleRemoveFromCompare(channelId) {
    setCompareList((prev) => prev.filter((c) => c.id !== channelId));
  }

  function handleClearCompare() {
    setCompareList([]);
    setShowCompareModal(false);
  }

  function handleToggleBookmark(channel) {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    toggleBookmark(channel);
  }

  function handleSavedNavClick() {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    setShowSaved((v) => !v);
  }

  const displayedChannels = showSaved ? bookmarks : channels;

  return (
    <div className="app-shell flex flex-col md:flex-row min-h-screen bg-background text-on-background antialiased">
      <DashboardSidebar
        user={user}
        onLoginClick={() => setShowAuthModal(true)}
        onLogout={logout}
        onSavedClick={handleSavedNavClick}
        savedCount={bookmarks.length}
      />

      <main className="flex-1 md:ml-60 p-4 md:p-12 bg-background min-h-screen">
        <Navbar
          user={user}
          onLoginClick={() => setShowAuthModal(true)}
          onLogout={logout}
        />

        <HeroSearchSection
          onSearch={handleSearch}
          onClear={handleClearSearch}
          initialQuery={searchQuery || ""}
        />

        <div className="subnav mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {categories.length > 0 && !searchQuery && !showSaved && (
            <CategoryPicker
              categories={categories}
              activeCategory={activeCategory}
              onSelect={handleCategorySelect}
            />
          )}
          <button
            className={`saved-nav-btn ${showSaved ? "active" : ""}`}
            onClick={handleSavedNavClick}
          >
            ★ Saved ({bookmarks.length})
          </button>
        </div>

        <div className="page-content">
          {(categories.length > 0 || searchQuery) && !showSaved && (
            <div className="toolbar mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="toolbar-label text-sm text-on-surface-variant font-medium">
                {searchQuery
                  ? `${channels.length} result${channels.length !== 1 ? "s" : ""} for "${searchQuery}"`
                  : `${channels.length} channel${channels.length !== 1 ? "s" : ""} found`}
              </span>

              <div className="toolbar-filters flex flex-wrap items-center gap-3">
                <Dropdown
                  ariaLabel="Sort channels"
                  value={sort}
                  onChange={setSort}
                  options={[
                    { value: "trustScore", label: "Sort by Trust Score" },
                    { value: "subscribers", label: "Sort by Subscribers" },
                    { value: "recent", label: "Sort by Recent Activity" },
                  ]}
                />

                <Dropdown
                  ariaLabel="Filter by country"
                  value={country}
                  onChange={setCountry}
                  options={COUNTRIES.map((c) => ({ value: c.code, label: c.label }))}
                />

                <Dropdown
                  ariaLabel="Filter by language"
                  value={language}
                  onChange={setLanguage}
                  options={LANGUAGES.map((l) => ({ value: l.code, label: l.label }))}
                />
              </div>
            </div>
          )}

          {showSaved && (
            <div className="toolbar mb-6">
              <span className="toolbar-label text-sm text-on-surface-variant font-medium">
                {bookmarks.length} saved channel{bookmarks.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {error && !showSaved && <div className="error-state text-red-500 p-4 mb-4">{error}</div>}

          {loading && !error && !showSaved && (
            <div className="channel-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!loading && !error && displayedChannels.length === 0 && (
            <div className="empty-state text-center py-12">
              <Mascot variant="empty" width={220} />
              <p className="empty-state-text mt-4 text-on-surface-variant">
                {showSaved
                  ? "No saved channels yet — click the star on any channel card to save it here."
                  : searchQuery
                  ? `No channels found for "${searchQuery}". Try a broader keyword.`
                  : "No channels found in this category yet."}
              </p>
            </div>
          )}

          {!loading && displayedChannels.length > 0 && (
            <>
              <div className="channel-grid">
                {displayedChannels.map((channel) => (
                  <ChannelCard
                    key={channel.id}
                    channel={channel}
                    onToggleCompare={handleToggleCompare}
                    isComparing={compareList.some((c) => c.id === channel.id)}
                    compareDisabled={
                      compareList.length >= MAX_COMPARE &&
                      !compareList.some((c) => c.id === channel.id)
                    }
                    onToggleBookmark={handleToggleBookmark}
                    isBookmarked={isBookmarked(channel.id)}
                  />
                ))}
              </div>

              {!showSaved && nextPageToken && (
                <div className="load-more-row text-center mt-8">
                  <button
                    className="load-more-btn bg-primary text-on-primary px-8 py-3 rounded-full font-medium"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? "Loading…" : "Load more channels"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <Footer />
      </main>

      {compareList.length > 0 && (
        <div className="compare-bar fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-surface shadow-lg rounded-full px-6 py-3 border border-outline-variant flex items-center gap-4">
          <span className="compare-bar-text text-sm font-medium text-on-background">
            {compareList.length} of {MAX_COMPARE} selected for comparison
          </span>
          <div className="compare-bar-actions flex items-center gap-2">
            <button className="compare-bar-clear text-xs px-3 py-1.5 rounded-full border" onClick={handleClearCompare}>
              Clear
            </button>
            <button
              className="compare-bar-view bg-primary text-on-primary text-xs px-4 py-1.5 rounded-full font-bold"
              onClick={() => setShowCompareModal(true)}
              disabled={compareList.length < 2}
            >
              Compare {compareList.length >= 2 ? "now" : "(pick 1 more)"}
            </button>
          </div>
        </div>
      )}

      {showCompareModal && (
        <CompareModal
          channels={compareList}
          onClose={() => setShowCompareModal(false)}
          onRemove={handleRemoveFromCompare}
        />
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}