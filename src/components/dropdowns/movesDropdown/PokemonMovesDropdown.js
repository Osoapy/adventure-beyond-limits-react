import { useEffect, useRef, useState } from 'react';

export default function PokemonMovesDropdown({ species, onSelect }) {
  const [moves, setMoves] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let url = '';
    if (!species || species === '') {
      url = 'https://pokeapi.co/api/v2/move/?limit=9999';
    } else {
      url = `https://pokeapi.co/api/v2/pokemon/${species.toLowerCase()}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const moveNames = species
          ? data.moves.map(m => m.move.name)
          : data.results.map(m => m.name);
        setMoves(moveNames);
      })
      .catch(() => {
        setMoves([]);
      });
  }, [species]);

  useEffect(() => {
    setFiltered(
      moves.filter(m => m.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, moves]);

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
      className='moves-dropdown move normal'
      style={{ position: 'relative', width: '100%' }}
    >
      <input
        className='normal'
        ref={inputRef}
        value={search}
        onChange={e => setSearch(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        style={{ width: '100%' }}
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
