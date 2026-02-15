import { useEffect, useRef, useState } from 'react';
import '../pokemonDropdown.scss';

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
      let names = data.results.map((p) => p.name).filter(name => {
        if (name.startsWith("mimikyu-")) return false; // remove variações
        if (name.startsWith("pikachu-")) return false; // remove variações
        if (name.startsWith("minior-")) return false; // remove variações
        if (name.endsWith("-cap")) return false; // remove pika likes
        if (name.endsWith("-primal")) return false; // remove primais
        if (name.endsWith("-mega")) return false; // remove megas
        if (name.endsWith("-mega-x")) return false; // remove megas
        if (name.endsWith("-mega-y")) return false; // remove megas
        if (name.endsWith("-mega-z")) return false; // remove megas
        return true;
      });
      names.push("mimikyu"); // adicionar forma base
      names.push("minior"); // adicionar forma base
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
    <div ref={containerRef} className='pokemon-dropdown'>
      <input
        className='pokemon-field-answear'
        ref={inputRef}
        value={search}
        onChange={e => setSearch(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        placeholder="Search Pokémon"
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
