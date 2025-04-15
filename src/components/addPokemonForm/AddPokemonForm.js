import { useState } from 'react';
import PokemonDropdown from '../dropdowns/pokemonDropdown/PokemonDropdown';
import './addPokemonForm.css';
import { SavePokemon } from '../../database/SavePokemon';
import PokemonMovesDropdown from '../dropdowns/movesDropdown/PokemonMovesDropdown';
import PokemonGenderDropdown from '../dropdowns/genderDropdown/GenderDropdown';
import PokemonAbilitiesDropdown from '../dropdowns/abilityDropdown/AbilityDropdown';
import PokemonNatureDropdown from '../dropdowns/natureDropdown/PokemonNatureDropdown';
import PokemonHeldItemDropdown from '../dropdowns/heldItemDropdown/PokemonHeldItemDropdown';

export default function AddPokemonForm() {
  const email = sessionStorage.getItem("email");

  const [pokemonData, setPokemonData] = useState({
    trainer: email,
    species: '',
    nickname: '???',
    level: '100',
    mainType: '',
    gender: '',
    ability: '',
    nature: '',
    heldItem: 'None',
    moves: ['Move #1', 'Move #2', 'Move #3', 'Move #4'],
    ivs: { HP: '0', Attack: '0', Defense: '0', 'S.Atk': '0', 'S.Def': '0', Speed: '0' },
    evs: { HP: '0', Attack: '0', Defense: '0', 'S.Atk': '0', 'S.Def': '0', Speed: '0' },
  });

  const [activeStats, setActiveStats] = useState('ivs');

  const toggleStats = (type) => {
    if (activeStats === type) return; // já está ativo
    setActiveStats(type);
  };

  const handleFieldChange = (field, value) => {
    setPokemonData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (group, stat, value) => {
    setPokemonData(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [stat]: value,
      },
    }));
  };

  const handleMoveChange = (index, value) => {
    const updated = [...pokemonData.moves];
    updated[index] = value;
    setPokemonData(prev => ({ ...prev, moves: updated }));
  };

  return (
    <div className="player-Token pokemon-Filled-Container" id="JhonnyTail2-Token">
      <div className="start">
        <div className="info">Info</div>

        <p className="pokemon-field-text creation-start"><b>Species:</b></p>
        <PokemonDropdown species={pokemonData.species} onSelect={name => handleFieldChange('species', name)} />

        <p className="pokemon-field-text"><b>Nickname:</b></p>
        <input
          placeholder={pokemonData.nickname}
          type='text'
          minLength="1"
          className="pokemon-field-answear"
          spellCheck={false}
          onInput={e => handleFieldChange('nickname', e.currentTarget.value)}
        ></input>

        <p className="pokemon-field-text"><b>Level:</b></p>
        <input
          placeholder={pokemonData.level}
          type='number'
          className="pokemon-field-answear"
          min="1"
          max="100"
          spellCheck={false}
          onInput={e => handleFieldChange('level', e.currentTarget.value)}
        ></input>

        <p className="pokemon-field-text"><b>Gender:</b></p>
        <PokemonGenderDropdown species={pokemonData.species} onSelect={gender => handleFieldChange('gender', gender)}/>

        <p className="pokemon-field-text"><b>Ability:</b></p>
        <PokemonAbilitiesDropdown species={pokemonData.species} onSelect={ability => handleFieldChange('ability', ability)} />

        <p className="pokemon-field-text"><b>Nature:</b></p>
        <PokemonNatureDropdown onSelect={nature => handleFieldChange('nature', nature)} />

        <p className="pokemon-field-text"><b>Held item:</b></p>
        <PokemonHeldItemDropdown onSelect={heldItem => handleFieldChange('heldItem', heldItem)} />
      </div>

      <div className="moves-container">
        <div className="info">Moves</div>
        <div className="moves">
        {pokemonData.moves.map((move, i) => (
          <PokemonMovesDropdown key={i}
            species={pokemonData.species}
            onSelect={newMove => handleMoveChange(i, newMove)}
          />
        ))}
        </div>
      </div>

      <div className="ivs-container">
        <div className="info">IVs / EVs</div>

        <div className="iv-button">
          <button
            className={`left-button ${activeStats === 'ivs' ? 'active' : ''}`}
            onClick={() => toggleStats('ivs')}
          >
            IVs
          </button>
          <button
            className={`right-button ${activeStats === 'evs' ? 'active' : ''}`}
            onClick={() => toggleStats('evs')}
          >
            EVs
          </button>
        </div>

        <div className={`ivs ${activeStats === 'ivs' ? 'show' : 'hide'}`}>
          {Object.keys(pokemonData.ivs).map(stat => (
            <div className="ev" key={`iv-${stat}`}>
              <div className="iv-text">{stat}</div>
              <input
                placeholder={pokemonData.ivs[stat]}
                type='number'
                className="iv-value"
                min="0"
                max="31"
                spellCheck={false}
                onInput={e => handleStatChange('ivs', stat, e.currentTarget.value)}
              ></input>
            </div>
          ))}
        </div>

        <div className={`evs ${activeStats === 'evs' ? 'show' : 'hide'}`}>
          {Object.keys(pokemonData.evs).map(stat => (
            <div className="ev" key={`ev-${stat}`}>
              <div className="ev-text">{stat}</div>
              <input
                placeholder={pokemonData.evs[stat]}
                type='number'
                className="ev-value"
                min="0"
                max="252"
                spellCheck={false}
                onInput={e => handleStatChange('evs', stat, e.currentTarget.value)}
              ></input>
            </div>
          ))}
        </div>

        <button className="create-button" onClick={() => SavePokemon(pokemonData)}>
          CREATE
        </button>
      </div>
    </div>
  );
}
