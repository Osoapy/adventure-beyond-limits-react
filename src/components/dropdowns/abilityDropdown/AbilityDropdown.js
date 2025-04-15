import { useEffect, useRef, useState } from 'react';
import '../pokemonDropdown.css';

export default function PokemonAbilitiesDropdown({ species, onSelect }) {
  const [abilities, setAbilities] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let url = '';
    if (!species || species === '') {
      url = 'https://pokeapi.co/api/v2/ability/?limit=9999';
    } else {
      url = `https://pokeapi.co/api/v2/pokemon/${species.toLowerCase()}`;
    }
  
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (species) {
          // Garante que data.abilities existe
          const abilityNames = Array.isArray(data.abilities)
            ? data.abilities.map(a => a.ability.name)
            : [];
          setAbilities(abilityNames);
        } else {
          const abilityNames = data.results.map(a => a.name);
          setAbilities(abilityNames);
        }
      })
      .catch(() => {
        setAbilities([]);
      });
  }, [species]);
  
  useEffect(() => {
    setFiltered(
      abilities.filter(a => a.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, abilities]);

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
      className='abilities-dropdown'
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
