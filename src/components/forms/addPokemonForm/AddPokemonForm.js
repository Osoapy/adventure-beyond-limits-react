import { useState } from 'react';
import Swal from 'sweetalert2';
import PokemonDropdown from '../../dropdowns/pokemonDropdown/PokemonDropdown';
import PokemonMovesDropdown from '../../dropdowns/movesDropdown/PokemonMovesDropdown';
import PokemonGenderDropdown from '../../dropdowns/genderDropdown/GenderDropdown';
import PokemonAbilitiesDropdown from '../../dropdowns/abilityDropdown/AbilityDropdown';
import PokemonNatureDropdown from '../../dropdowns/natureDropdown/PokemonNatureDropdown';
import PokemonHeldItemDropdown from '../../dropdowns/heldItemDropdown/PokemonHeldItemDropdown';
import { SavePokemon } from '../../../database/SavePokemon';
import './addPokemonForm.scss';

export default function AddPokemonForm({ teamNumber }) {
  const email = sessionStorage.getItem("email");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultData = {
    trainer: email,
    species: '',
    nickname: '???',
    level: '100',
    mainType: '',
    gender: '',
    ability: '',
    nature: '',
    team: teamNumber,
    heldItem: 'None',
    moves: ['Move #1', 'Move #2', 'Move #3', 'Move #4'],
    ivs: { HP: '0', Attack: '0', Defense: '0', 'S.Atk': '0', 'S.Def': '0', Speed: '0' },
    evs: { HP: '0', Attack: '0', Defense: '0', 'S.Atk': '0', 'S.Def': '0', Speed: '0' },
  };

  const [pokemonData, setPokemonData] = useState(defaultData);
  const [activeStats, setActiveStats] = useState('ivs');

  const toggleStats = (type) => {
    if (activeStats !== type) setActiveStats(type);
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

  const validatePokemon = () => {
    if (!pokemonData.species || pokemonData.species.trim() === '') {
      Swal.fire({ icon: 'warning', title: 'Faltou a espécie!', text: 'Escolha uma espécie de Pokémon.' });
      return false;
    }
    if (!pokemonData.gender || !pokemonData.ability || !pokemonData.nature) {
      Swal.fire({ icon: 'warning', title: 'Campos obrigatórios!', text: 'Preencha gênero, habilidade e natureza.' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validatePokemon()) return;

    setIsSubmitting(true);
    try {
      await SavePokemon(pokemonData);
      Swal.fire({ icon: 'success', title: 'Pokémon criado!', text: `${pokemonData.nickname || pokemonData.species} foi salvo.` });
      setPokemonData(defaultData);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Erro ao salvar', text: 'Algo deu errado ao tentar salvar.' });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="player-Token pokemon-Filled-Container" id="JhonnyTail2-Token">
      <div className="start">
        <div className="info">Info</div>
        <p className="pokemon-field-text"><b>Species:</b></p>
        <PokemonDropdown species={pokemonData.species} onSelect={name => handleFieldChange('species', name)} />

        <p className="pokemon-field-text"><b>Nickname:</b></p>
        <input
          placeholder={pokemonData.nickname}
          type='text'
          className="pokemon-field-answear"
          onInput={e => handleFieldChange('nickname', e.currentTarget.value)}
        />

        <p className="pokemon-field-text"><b>Level:</b></p>
        <input
          placeholder={pokemonData.level}
          type='number'
          className="pokemon-field-answear"
          min="1" max="100"
          onInput={e => handleFieldChange('level', e.currentTarget.value)}
        />

        <p className="pokemon-field-text"><b>Gender:</b></p>
        <PokemonGenderDropdown species={pokemonData.species} onSelect={g => handleFieldChange('gender', g)} />

        <p className="pokemon-field-text"><b>Ability:</b></p>
        <PokemonAbilitiesDropdown species={pokemonData.species} onSelect={a => handleFieldChange('ability', a)} />

        <p className="pokemon-field-text"><b>Nature:</b></p>
        <PokemonNatureDropdown onSelect={n => handleFieldChange('nature', n)} />

        <p className="pokemon-field-text"><b>Held item:</b></p>
        <PokemonHeldItemDropdown onSelect={i => handleFieldChange('heldItem', i)} />
      </div>

      <div className="moves-container">
        <div className="info">Moves</div>
        <div className="moves">
          {pokemonData.moves.map((move, i) => (
            <PokemonMovesDropdown
              key={i}
              species={pokemonData.species}
              onSelect={newMove => handleMoveChange(i, newMove)}
            />
          ))}
        </div>
      </div>

      <div className="ivs-container">
        <div className="info">IVs / EVs</div>
        <div className="iv-button">
          <button className={`left-button ${activeStats === 'ivs' ? 'active' : ''}`} onClick={() => toggleStats('ivs')}>IVs</button>
          <button className={`right-button ${activeStats === 'evs' ? 'active' : ''}`} onClick={() => toggleStats('evs')}>EVs</button>
        </div>

        <div className={`ivs ${activeStats === 'ivs' ? 'show' : 'hide'}`}>
          {Object.keys(pokemonData.ivs).map(stat => (
            <div className="ev" key={`iv-${stat}`}>
              <div className="iv-text">{stat}</div>
              <input
                placeholder={pokemonData.ivs[stat]}
                type='number'
                className="iv-value"
                min="0" max="31"
                onInput={e => handleStatChange('ivs', stat, e.currentTarget.value)}
              />
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
                min="0" max="252"
                onInput={e => handleStatChange('evs', stat, e.currentTarget.value)}
              />
            </div>
          ))}
        </div>

        <input
          type="submit"
          value={isSubmitting ? 'Salvando...' : 'Create'}
          className="create-button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
