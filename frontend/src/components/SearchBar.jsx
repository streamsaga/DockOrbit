import { useEffect, useRef, useState } from "react";

export default function SearchBar({
  onSearch,
  onClear,
  placeholder = "Search any topic — e.g. “woodworking”, “personal finance”, “korean cooking”",
}) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef(null);
  const wrapRef = useRef(null);

  // Debounced fetch of suggestions as the user types, same feel as
  // YouTube's own search box - so users don't have to type the whole
  // word/phrase to find what they want.
  useEffect(() => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch(`/api/suggestions?q=${encodeURIComponent(value)}`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data.suggestions || []))
        .catch(() => setSuggestions([]));
    }, 200);

    return () => clearTimeout(debounceRef.current);
  }, [value]);

  // Close the dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function runSearch(term) {
    const trimmed = term.trim();
    if (!trimmed) return;
    setValue(trimmed);
    setShowSuggestions(false);
    setActiveIndex(-1);
    onSearch(trimmed);
  }

  function handleSubmit(e) {
    e.preventDefault();
    runSearch(value);
  }

  function handleChange(e) {
    setValue(e.target.value);
    setShowSuggestions(true);
    setActiveIndex(-1);
  }

  function handleKeyDown(e) {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      runSearch(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  }

  function handleClear() {
    setValue("");
    setSuggestions([]);
    setShowSuggestions(false);
    onClear();
  }

  return (
    <div className="search-bar-wrap" ref={wrapRef}>
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => value && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={showSuggestions && suggestions.length > 0}
          aria-autocomplete="list"
        />
        {value && (
          <button type="button" className="search-clear" onClick={handleClear} aria-label="Clear search">
            ✕
          </button>
        )}
        <button type="submit" className="search-submit">
          Search
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="search-suggestions" role="listbox">
          {suggestions.map((s, i) => (
            <li
              key={s}
              role="option"
              aria-selected={i === activeIndex}
              className={`search-suggestion-item ${i === activeIndex ? "active" : ""}`}
              onMouseDown={(e) => {
                e.preventDefault(); // keep focus, avoid blur before click registers
                runSearch(s);
              }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span className="search-suggestion-icon">🔍</span>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}