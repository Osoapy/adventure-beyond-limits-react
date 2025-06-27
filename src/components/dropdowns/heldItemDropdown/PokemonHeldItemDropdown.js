import { useEffect, useRef, useState } from 'react';
import '../pokemonDropdown.scss';

export default function PokemonHeldItemDropdown({ onSelect, initialValue }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!initialValue) return;

    setSearch(initialValue);
  }, [initialValue]);  

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/item/?offset=20&limit=9999')
        .then(res => res.json())
        .then(data => {
            const itemNames = data.results.map(item => item.name);
            setItems(itemNames);
        })
        .catch(() => {
            setItems([]);
        });
  }, []);

  useEffect(() => {
    setFiltered(
      items.filter(item => item.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, items]);

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
      className='held-item-dropdown'
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
