import { useEffect, useRef, useState } from "react";
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";
import PokemonGif from "../../../utils/fetchs/pokemonGif/PokemonGif";
import "./currentPokemonForm.scss";
import CalculatePokemonStats from "../../../utils/functions/calculatePokemonStats/CalculatePokemonStats";
import { doc, updateDoc } from "firebase/firestore";
import SaveButton from "../../buttons/saveButton/SaveButton";
import PokemonMovesDropdown from "../../dropdowns/movesDropdown/PokemonMovesDropdown";
import { db } from "../../../firebase";
import PokemonHeldItemDropdown from "../../dropdowns/heldItemDropdown/PokemonHeldItemDropdown";
import PokemonGenderDropdown from "../../dropdowns/genderDropdown/GenderDropdown";
import PokemonAbilitiesDropdown from "../../dropdowns/abilityDropdown/AbilityDropdown";
import PokemonNatureDropdown from "../../dropdowns/natureDropdown/PokemonNatureDropdown";

Chart.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function CurrentPokemonForm({ pokemon }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const [formData, setFormData] = useState(pokemon);
  const [section, setSection] = useState("Stats");
  const [hasChanges, setHasChanges] = useState(false);
  const [attributes, setAttributes] = useState(pokemon.attributes || {});

  // 🔁 Sempre que trocar de Pokémon
  useEffect(() => {
    setFormData(pokemon);
    setHasChanges(false);
  }, [pokemon]);

  // 📊 Recalcula stats
  useEffect(() => {
    async function calculate() {
      const clone = { ...formData };
      await CalculatePokemonStats(clone);
      setAttributes(clone.attributes || {});
    }
    calculate();
  }, [formData]);

  // 📈 Gráfico
  useEffect(() => {
    if (!attributes) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const newChart = new Chart(chartRef.current, {
      type: "radar",
      data: {
        labels: ["HP", "Attack", "Defense", "S.Atk", "S.Def", "Speed"],
        datasets: [
          {
            data: [
              attributes["HP"],
              attributes["Attack"],
              attributes["Defense"],
              attributes["S.Atk"],
              attributes["S.Def"],
              attributes["Speed"]
            ],
            fill: true,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgb(255, 99, 132)"
          }
        ]
      }
    });

    chartInstanceRef.current = newChart;

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [attributes]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleStatChange = (type, stat, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [stat]: Number(value)
      }
    }));
    setHasChanges(true);
  };

  const handleMoveChange = (index, newMove) => {
    const updatedMoves = [...formData.moves];
    updatedMoves[index] = newMove;
    handleFieldChange("moves", updatedMoves);
  };

  const saveChanges = async () => {
    try {
      const pokemonRef = doc(db, "pokemon", pokemon.id);
      await updateDoc(pokemonRef, formData);
      setHasChanges(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  return (
    <div className="player-Token pokemon-Filled-Container" id="JhonnyTail2-Token">
      <div className="start">
        <div className="info">Info</div>

        <p className="pokemon-field-text first-field">
          <b>Nickname:</b>
        </p>
        <div
          className="pokemon-field-answear first-field"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => handleFieldChange("nickname", e.currentTarget.innerText)}
        >
          {formData.nickname}
        </div>

        <p className="pokemon-field-text">
          <b>Level:</b>
        </p>
        <div
          className="pokemon-field-answear"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => handleFieldChange("level", Number(e.currentTarget.innerText))}
        >
          {formData.level}
        </div>

        <p className="pokemon-field-text">
          <b>Gender:</b>
        </p>
        <PokemonGenderDropdown
          initialValue={formData.gender}
          onSelect={(v) => handleFieldChange("gender", v)}
        />

        <p className="pokemon-field-text">
          <b>Ability:</b>
        </p>
        <PokemonAbilitiesDropdown
          species={formData.species}
          initialValue={formData.ability}
          onSelect={(v) => handleFieldChange("ability", v)}
        />

        <p className="pokemon-field-text">
          <b>Nature:</b>
        </p>
        <PokemonNatureDropdown
          initialValue={formData.nature || "docile"}
          onSelect={(v) => handleFieldChange("nature", v)}
        />

        <p className="pokemon-field-text">
          <b>Held item:</b>
        </p>
        <PokemonHeldItemDropdown
          initialValue={formData.heldItem}
          onSelect={(v) => handleFieldChange("heldItem", v)}
        />
      </div>

      <div className="moves-container">
        <div className="info">Moves</div>
        <div className="moves">
          {formData.moves?.map((move, i) => (
            <PokemonMovesDropdown
              key={i}
              species={formData.species}
              initialValue={move}
              onSelect={(newMove) => handleMoveChange(i, newMove)}
            />
          ))}
        </div>
      </div>

      <div className="ivs-container">
        <div className="info">IVs / Stats / EVs</div>

        <div className="iv-button">
          <button
            className={`left-button ${section === "IVs" ? "active" : ""}`}
            onClick={() => setSection("IVs")}
          >
            IVs
          </button>

          <button
            className={`att-button ${section === "Stats" ? "active" : ""}`}
            onClick={() => setSection("Stats")}
          >
            Stats
          </button>

          <button
            className={`right-button ${section === "EVs" ? "active" : ""}`}
            onClick={() => setSection("EVs")}
          >
            EVs
          </button>
        </div>

        <div className={`ivs ${section === "IVs" ? "show" : "hide"}`}>
          {formData.ivs &&
            Object.keys(formData.ivs).map((stat) => (
              <div className="ev" key={stat}>
                <div className="iv-text">{stat}</div>
                <input
                  type="number"
                  className="iv-value"
                  min="0"
                  max="31"
                  value={formData.ivs[stat]}
                  onChange={(e) =>
                    handleStatChange("ivs", stat, e.target.value)
                  }
                />
              </div>
            ))}
        </div>

        <div className={`stats ${section === "Stats" ? "show" : "hide"}`}>
          {attributes &&
            Object.keys(attributes).map((stat) => (
              <div className="stat" key={stat}>
                <div className="stats-text">{stat}</div>
                <div className="stats-value">
                  {attributes[stat]}
                </div>
              </div>
            ))}
        </div>

        <div className={`evs ${section === "EVs" ? "show" : "hide"}`}>
          {formData.evs &&
            Object.keys(formData.evs).map((stat) => (
              <div className="ev" key={stat}>
                <div className="ev-text">{stat}</div>
                <input
                  type="number"
                  className="ev-value"
                  min="0"
                  max="252"
                  value={formData.evs[stat]}
                  onChange={(e) =>
                    handleStatChange("evs", stat, e.target.value)
                  }
                />
              </div>
            ))}
        </div>
      </div>

      <div className="stats-visualiser">
        <div className="info stats-info">Stats</div>
        <div className="canvas-container">
          <canvas ref={chartRef} width="435" height="328"></canvas>
        </div>

        <div className="pokemon-sprite-container">
          <PokemonGif specie={formData.species} />
        </div>

        {hasChanges && (
          <SaveButton onClick={saveChanges} />
        )}
      </div>
    </div>
  );
}
