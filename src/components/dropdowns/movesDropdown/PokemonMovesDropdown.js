import { useEffect, useRef, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';

export default function PokemonMovesDropdown({ species, onSelect, initialValue }) {
  const [moves, setMoves] = useState([]);
  const [moveTypes, setMoveTypes] = useState({});
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState('normal'); // NOVO
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
    if (!initialValue || Object.keys(moveTypes).length === 0) return;
  
    setSearch(initialValue);
    const type = moveTypes[initialValue] || 'normal';
    setSelectedType(type);
  }, [initialValue, moveTypes]);  

  useEffect(() => {
    const fetchMoveTypes = async () => {
      const snapshot = await getDocs(collection(db, 'moves'));
      const types = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.name && data.type) {
          types[data.name] = data.type;
        }
      });
      setMoveTypes(types);
    };
    fetchMoveTypes();
  }, []);

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
      className={`moves-dropdown move ${selectedType}`} // ATUALIZADO
      style={{ position: 'relative', width: '100%' }}
    >
      <input
        className={selectedType} // ATUALIZADO
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
          {filtered.map(name => {
            const type = moveTypes[name] || 'normal';
            return (
              <li
                key={name}
                className={`move ${type}`}
                onClick={() => {
                  setSearch(name);
                  setSelectedType(type); // NOVO
                  setShowDropdown(false);
                  if (onSelect) {
                    onSelect(name)
                  };
                }}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                }}
              >
                {name}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
