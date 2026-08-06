import { useEffect, useRef, useState } from "react";

// A custom dropdown replacing native <select> for the spots where
// visual polish matters most: a button trigger with a chevron, and a
// floating rounded card listing each option as its own row with a
// clean hover highlight - matching the reference "Pages" nav menu
// look, restyled in this site's neumorphic language.
//
// When `searchable` is true (or there are many options), a recessed
// search field appears at the top of the open menu so users can type
// to filter the long list quickly.
export default function Dropdown({ value, options, onChange, ariaLabel, searchable }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);
  const searchRef = useRef(null);

  // Auto-enable search when the list is large (> 10 items)
  const showSearch = searchable || options.length > 10;

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Auto-focus the search input whenever the dropdown opens
  useEffect(() => {
    if (open && showSearch) {
      setTimeout(() => searchRef.current?.focus(), 60);
    }
    if (!open) setQuery("");
  }, [open, showSearch]);

  const selected = options.find((o) => o.value === value) || options[0];

  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  function handleSelect(optValue) {
    onChange(optValue);
    setOpen(false);
  }

  return (
    <div className="neu-dropdown" ref={wrapRef}>
      <button
        type="button"
        className={`neu-dropdown-trigger ${open ? "is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span>{selected?.label}</span>
        <span className={`neu-dropdown-chevron ${open ? "is-open" : ""}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <ul className="neu-dropdown-menu" role="listbox">
          {showSearch && (
            <li className="neu-dropdown-search-row">
              <input
                ref={searchRef}
                type="text"
                className="neu-dropdown-search"
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </li>
          )}
          <li className="neu-dropdown-scroll-area">
            {filtered.length === 0 && (
              <span className="neu-dropdown-empty">No results</span>
            )}
            {filtered.map((opt) => (
              <div
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                className={`neu-dropdown-item ${opt.value === value ? "is-selected" : ""}`}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </div>
            ))}
          </li>
        </ul>
      )}
    </div>
  );
}