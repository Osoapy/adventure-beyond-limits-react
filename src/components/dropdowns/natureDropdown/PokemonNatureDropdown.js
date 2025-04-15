import { useEffect, useRef, useState } from 'react';
import '../pokemonDropdown.css';

const natures = [
  'adamant', 'bold', 'brave', 'calm', 'careful', 'gentle',
  'hardy', 'hasty', 'impish', 'jolly', 'lax', 'lonely',
  'mild', 'modest', 'naive', 'naughty', 'quiet', 'quirky',
  'rash', 'relaxed', 'sassy', 'serious', 'timid'
];

export default function PokemonNatureDropdown({ onSelect }) {
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(natures);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

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
