import { useEffect, useRef, useState } from 'react';
import styles from '../pokemonDropdown.module.scss';

export default function GenderDropdown({ species, onSelect, initialValue }) {
  const [genders, setGenders] = useState([]);
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
    if (!species || species === '') {
      setGenders(['male', 'female', 'genderless']);
      return;
    }

    fetch(`https://pokeapi.co/api/v2/pokemon-species/${species.toLowerCase()}`)
      .then(res => res.json())
      .then(data => {
        setSearch('');
        const rate = data.gender_rate;
        if (rate === -1) {
          setGenders(['genderless']);
          setSearch('genderless');
          onSelect('genderless');
        } else if (rate === 0) {
          setGenders(['male']);
          setSearch('male');
          onSelect('male');
        } else if (rate === 8) {
          setGenders(['female']);
          setSearch('female');
          onSelect('female');
        } else {
          setGenders(['male', 'female']);
        }
      })
      .catch(() => {
        setGenders(['genderless', 'male', 'female']);
      });
  }, [species]);

  useEffect(() => {
    setFiltered(
      genders.filter(g => g.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, genders]);

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
      className={styles["genders-dropdown"]}
    >
      <input
        className={styles["pokemon-field-answear"]}
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
          {filtered.map(g => (
            <li
              key={g}
              onClick={() => {
                setSearch(g);
                setShowDropdown(false);
                onSelect(g);
              }}
              className={styles["dropdown-item"]}
            >
              {g}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
