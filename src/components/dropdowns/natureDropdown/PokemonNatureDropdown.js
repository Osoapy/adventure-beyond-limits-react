import { useEffect, useRef, useState } from 'react';
import '../pokemonDropdown.scss';

const natures = [
  "adamant",  // Attack+, Sp Atk-
  "bashful",  // Neutral
  "bold",     // Defense+, Attack-
  "brave",    // Attack+, Speed-
  "calm",     // Sp Def+, Attack-
  "careful",  // Sp Def+, Sp Atk-
  "docile",   // Neutral
  "gentle",   // Sp Def+, Defense-
  "hardy",    // Neutral
  "hasty",    // Speed+, Defense-
  "impish",   // Defense+, Sp Atk-
  "jolly",    // Speed+, Sp Atk-
  "lax",      // Defense+, Sp Def-
  "lonely",   // Attack+, Defense-
  "mild",     // Sp Atk+, Defense-
  "modest",   // Sp Atk+, Attack-
  "naive",    // Speed+, Sp Def-
  "naughty",  // Attack+, Sp Def-
  "quiet",    // Sp Atk+, Speed-
  "quirky",   // Neutral
  "rash",     // Sp Atk+, Sp Def-
  "relaxed",  // Defense+, Speed-
  "sassy",    // Sp Def+, Speed-
  "serious",  // Neutral
  "timid",    // Speed+, Attack-
];

export default function PokemonNatureDropdown({ onSelect, initialValue }) {
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(natures);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!initialValue) return;

    setSearch(initialValue);
  }, [initialValue]);  

  useEffect(() => {
    setFiltered(
      natures.filter(n => n.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

  useEffect(() => {
    const handleClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className='nature-dropdown'
    >
      <input
        className='pokemon-field-answear'
        ref={inputRef}
        value={search}
        onChange={e => setSearch(e.target.value)}
        onFocus={() => setShowDropdown(true)}
      />

      {showDropdown && filtered.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            zIndex: 10,
          }}
        >
          {filtered.map(name => (
            <li
              key={name}
              onClick={() => {
                setSearch(name);
                setShowDropdown(false);
                onSelect(name);
              }}
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
