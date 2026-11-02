// src/components/orders/SearchBox.tsx
// A plain controlled input. The parent owns the text.

interface SearchBoxProps {
  value: string;
  onChange: (text: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="search-box">
      <label htmlFor="search">Search customer</label>
      <input
        id="search"
        type="search"
        placeholder="e.g. Leo"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}