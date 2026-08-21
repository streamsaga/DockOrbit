import { useState } from "react";

export default function HeroSearchSection({ onSearch, onClear, initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  }

  function handleClear() {
    setQuery("");
    onClear();
  }

  return (
    <section className="mb-12 text-center max-w-4xl mx-auto pt-6 md:pt-2">
      <h1 className="hero-heading font-display-lg text-display-lg font-bold text-on-background mb-4 tracking-tight">
        Discover Better <span className="text-primary">YouTube Content</span>
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-8 text-lg md:text-xl">
        Find channels and playlists worth your time.
      </p>

      <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-outline text-2xl">search</span>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-16 pl-16 pr-28 bg-surface border border-surface-variant rounded-full text-lg font-body-md text-on-background placeholder-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all neumorphic-inset"
          placeholder="Search channels, topics, or paste a URL..."
          type="text"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-28 px-3 flex items-center text-outline hover:text-primary"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button
            type="submit"
            className="bg-primary text-on-primary h-12 px-6 rounded-full font-label-sm text-label-sm shadow-sm hover:shadow-md hover:bg-primary-container transition-all font-bold"
          >
            Search
          </button>
        </div>
      </form>
    </section>
  );
}
