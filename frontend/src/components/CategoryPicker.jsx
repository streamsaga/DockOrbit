import Dropdown from "./Dropdown.jsx";

export default function CategoryPicker({ categories, activeCategory, onSelect }) {
  return (
    <Dropdown
      ariaLabel="Choose a category"
      value={activeCategory}
      onChange={onSelect}
      options={categories.map((cat) => ({ value: cat.slug, label: cat.label }))}
    />
  );
}