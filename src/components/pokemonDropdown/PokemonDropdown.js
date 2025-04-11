import { useEffect, useRef, useState } from 'react';

export default function PokemonDropdown({ onSelect }) {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Fetch all Pokémon names
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon/?limit=9999')
      .then(res => res.json())
      .then(data => {
        const names = data.results.map((p) => p.name);
        setPokemons(names);
      });
  }, []);

  // Update filtered list
  useEffect(() => {
    setFiltered(
      pokemons.filter(p => p.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, pokemons]);

  // Hide dropdown if clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '300px' }}>
      <input
        ref={inputRef}
        value={search}
        onChange={e => setSearch(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        placeholder="Search Pokémon"
        style={{ width: '100%', padding: '8px' }}
      />

      {showDropdown && filtered.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            position: 'absolute',
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
