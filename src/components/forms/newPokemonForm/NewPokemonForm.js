import styles from '../standardForm.module.scss';
import { useState } from 'react';
import { addPokemon } from '../../../database/functions/addPokemon';
import Swal from 'sweetalert2';
// DROPDOWNS
import PokemonDropdown from '../../dropdowns/pokemonDropdown/PokemonDropdown';
import GenderDropdown from '../../dropdowns/genderDropdown/GenderDropdown';
import AbilityDropdown from '../../dropdowns/abilityDropdown/AbilityDropdown';
import NatureDropdown from '../../dropdowns/natureDropdown/NatureDropdown';
import HeldItemDropdown from '../../dropdowns/heldItemDropdown/HeldItemDropdown';
import MovesDropdown from '../../dropdowns/movesDropdown/MovesDropdown';

export default function NewPokemonForm({ teamNumber, email }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultData = {
    trainer: email,
    species: '',
    nickname: '',
    level: '1',
    mainType: '',
    gender: '',
    ability: '',
    nature: '',
    heldItem: '',
    moves: ['', '', '', ''],
    ivs: { HP: '31', Attack: '31', Defense: '31', 'S.Atk': '31', 'S.Def': '31', Speed: '31' },
    evs: { HP: '0', Attack: '0', Defense: '0', 'S.Atk': '0', 'S.Def': '0', Speed: '0' },
    id: `pokemonID-${Date.now()}`
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
      await addPokemon(email, teamNumber, pokemonData);
      Swal.fire({ icon: 'success', title: 'Pokémon criado!', text: `${pokemonData.nickname || pokemonData.species} foi salvo.` });
      setPokemonData(defaultData);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Erro ao salvar', text: 'Algo deu errado ao tentar salvar.' });
    }
    setIsSubmitting(false);
  };

  return (
    <div className={styles["player-Token"] + " " + styles["pokemon-Filled-Container"]}>
      <div className={styles["start"]}>
        <div className={styles["info"]}>Info</div>
        <div className={styles["text-and-dropdown-wrapper"]}>
          <p className={styles["pokemon-field-text"]}><b>Species:</b></p>
          <PokemonDropdown species={pokemonData.species} onSelect={name => handleFieldChange('species', name)} />
        </div>

        <div className={styles["text-and-dropdown-wrapper"]}>
          <p className={styles["pokemon-field-text"]}><b>Nickname:</b></p>
          <input
            type='text'
            className={styles["pokemon-field-answear"]}
            onInput={e => handleFieldChange('nickname', e.currentTarget.value)}
          />
        </div>

        <div className={styles["text-and-dropdown-wrapper"]}>
          <p className={styles["pokemon-field-text"]}><b>Level:</b></p>
          <input
            placeholder="1"
            type='number'
            className={styles["pokemon-field-answear"]}
            min="1" max="100"
            onInput={e => handleFieldChange('level', e.currentTarget.value)}
          />
        </div>

        <div className={styles["text-and-dropdown-wrapper"]}>
          <p className={styles["pokemon-field-text"]}><b>Gender:</b></p>
          <GenderDropdown species={pokemonData.species} onSelect={g => handleFieldChange('gender', g)} />
        </div>

        <div className={styles["text-and-dropdown-wrapper"]}>
          <p className={styles["pokemon-field-text"]}><b>Ability:</b></p>
          <AbilityDropdown species={pokemonData.species} onSelect={a => handleFieldChange('ability', a)} />
        </div>

        <div className={styles["text-and-dropdown-wrapper"]}>
          <p className={styles["pokemon-field-text"]}><b>Nature:</b></p>
          <NatureDropdown onSelect={n => handleFieldChange('nature', n)} />
        </div>

        <div className={styles["text-and-dropdown-wrapper"]}>
          <p className={styles["pokemon-field-text"]}><b>Held item:</b></p>
          <HeldItemDropdown onSelect={i => handleFieldChange('heldItem', i)} />
        </div>
      </div>

      <div className={styles["moves-container"]}>
        <div className={styles["info-moves"]}>Moves</div>
        <div className={styles["moves"]}>
          {pokemonData.moves.map((move, i) => (
            <MovesDropdown
              key={i}
              species={pokemonData.species}
              onSelect={newMove => handleMoveChange(i, newMove)}
            />
          ))}
        </div>
      </div>

      <div className={styles["ivs-container"]}>
        <div className={styles["info-ivs-evs"]}>IVs / EVs</div>
        <div className={styles["iv-button"]}>
          <button className={styles[`left-button`] + " " + styles[`${activeStats === 'ivs' ? 'active' : ''}`]} onClick={() => toggleStats('ivs')}>IVs</button>
          <button className={styles[`right-button`] + " " + styles[`${activeStats === 'evs' ? 'active' : ''}`]} onClick={() => toggleStats('evs')}>EVs</button>
        </div>

        <div className={styles[`ivs`] + " " + styles[`${activeStats === 'ivs' ? 'show' : 'hide'}`]}>
          {Object.keys(pokemonData.ivs).map(stat => (
            <div className={styles["ev"]} key={`iv-${stat}`}>
              <div className={styles["iv-text"]}>{stat}</div>
              <input
                placeholder={pokemonData.ivs[stat]}
                type='number'
                className={styles["iv-value"]}
                min="0" max="31"
                onInput={e => handleStatChange('ivs', stat, e.currentTarget.value)}
              />
            </div>
          ))}
        </div>

        <div className={styles[`evs`] + " " + styles[`${activeStats === 'evs' ? 'show' : 'hide'}`]}>
          {Object.keys(pokemonData.evs).map(stat => (
            <div className={styles["ev"]} key={`ev-${stat}`}>
              <div className={styles["ev-text"]}>{stat}</div>
              <input
                placeholder={pokemonData.evs[stat]}
                type='number'
                className={styles["ev-value"]}
                min="0" max="252"
                onInput={e => handleStatChange('evs', stat, e.currentTarget.value)}
              />
            </div>
          ))}
        </div>

        <input
          type="submit"
          value={isSubmitting ? 'Salvando...' : 'Create'}
          className={styles["create-button"]}
          onClick={handleSubmit}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
