import { useEffect, useRef, useState } from 'react';
import PokemonDropdown from '../pokemonDropdown/PokemonDropdown';
import './addPokemonForm.css';

export default function AddPokemonForm() {
  const [pokemonData, setPokemonData] = useState({
    species: '',
    nickname: '???',
    level: '1',
    gender: '',
    ability: '',
    nature: '',
    heldItem: 'None',
    moves: ['Move #1', 'Move #2', 'Move #3', 'Move #4'],
    ivs: { HP: '0', Attack: '0', Defense: '0', 'S.Atk': '0', 'S.Def': '0', Speed: '0' },
    evs: { HP: '0', Attack: '0', Defense: '0', 'S.Atk': '0', 'S.Def': '0', Speed: '0' },
  });

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
        <PokemonDropdown onSelect={name => handleFieldChange('species', name)} />

        <p className="pokemon-field-text"><b>Nickname:</b></p>
        <div
          className="pokemon-field-answear"
          contentEditable
          spellCheck={false}
          onInput={e => handleFieldChange('nickname', e.currentTarget.textContent)}
        >{pokemonData.nickname}</div>

        <p className="pokemon-field-text"><b>Level:</b></p>
        <div
          className="pokemon-field-answear"
          contentEditable
          spellCheck={false}
          onInput={e => handleFieldChange('level', e.currentTarget.textContent)}
        >{pokemonData.level}</div>

        <p className="pokemon-field-text"><b>Gender:</b></p>
        <div
          className="pokemon-field-answear"
          contentEditable
          spellCheck={false}
          onInput={e => handleFieldChange('gender', e.currentTarget.textContent)}
        >{pokemonData.gender || 'Choose between M, F or None'}</div>

        <p className="pokemon-field-text"><b>Ability:</b></p>
        <div
          className="pokemon-field-answear ability"
          contentEditable
          spellCheck={false}
          onInput={e => handleFieldChange('ability', e.currentTarget.textContent)}
        >{pokemonData.ability || 'Insert its ability here...'}</div>

        <p className="pokemon-field-text"><b>Nature:</b></p>
        <div
          className="pokemon-field-answear nature"
          contentEditable
          spellCheck={false}
          onInput={e => handleFieldChange('nature', e.currentTarget.textContent)}
        >{pokemonData.nature || 'Insert its nature here...'}</div>

        <p className="pokemon-field-text"><b>Held item:</b></p>
        <div
          className="pokemon-field-answear"
          contentEditable
          spellCheck={false}
          onInput={e => handleFieldChange('heldItem', e.currentTarget.textContent)}
        >{pokemonData.heldItem}</div>
      </div>

      <div className="moves-container">
        <div className="info">Moves</div>
        <div className="moves">
          {pokemonData.moves.map((move, i) => (
            <div
              key={i}
              className="move"
              contentEditable
              spellCheck={false}
              onInput={e => handleMoveChange(i, e.currentTarget.textContent)}
            >{move}</div>
          ))}
        </div>
      </div>

      <div className="ivs-container">
        <div className="info">IVs / EVs</div>

        <div className="iv-button">
          <button className="left-button">IVs</button>
          <button className="att-button active">Stats</button>
          <button className="right-button">EVs</button>
        </div>

        <div className="ivs">
          {Object.keys(pokemonData.ivs).map(stat => (
            <div className="ev" key={`iv-${stat}`}>
              <div className="iv-text">{stat}</div>
              <div
                className="iv-value"
                contentEditable
                spellCheck={false}
                onInput={e => handleStatChange('ivs', stat, e.currentTarget.textContent)}
              >{pokemonData.ivs[stat]}</div>
            </div>
          ))}
        </div>

        <div className="ivs show">
          {Object.keys(pokemonData.ivs).map(stat => (
            <div className="ev" key={`ivs-show-${stat}`}>
              <div className="ev-text">{stat}</div>
              <div className="ev-value" contentEditable spellCheck={false}>
                {pokemonData.ivs[stat]}
              </div>
            </div>
          ))}
        </div>

        <div className="evs">
          {Object.keys(pokemonData.evs).map(stat => (
            <div className="ev" key={`ev-${stat}`}>
              <div className="ev-text">{stat}</div>
              <div
                className="ev-value"
                contentEditable
                spellCheck={false}
                onInput={e => handleStatChange('evs', stat, e.currentTarget.textContent)}
              >{pokemonData.evs[stat]}</div>
            </div>
          ))}
        </div>

        <button className="create-button" onClick={() => console.log(pokemonData)}>
          CREATE
        </button>
      </div>
    </div>
  );
}
