import { useEffect, useRef, useState } from "react";
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import PokemonGif from "../../../utils/fetchs/pokemonGif/PokemonGif";
import './currentPokemonForm.scss';
import CalculatePokemonStats from "../../../utils/functions/calculatePokemonStats/CalculatePokemonStats";
import { doc, updateDoc } from "firebase/firestore";
import SaveButton from "../../buttons/saveButton/SaveButton";
import PokemonMovesDropdown from '../../dropdowns/movesDropdown/PokemonMovesDropdown';
import { db } from "../../../firebase"; // ajuste o caminho conforme onde está sua config do Firebase
import PokemonHeldItemDropdown from "../../dropdowns/heldItemDropdown/PokemonHeldItemDropdown";
import PokemonGenderDropdown from "../../dropdowns/genderDropdown/GenderDropdown";
import PokemonAbilitiesDropdown from "../../dropdowns/abilityDropdown/AbilityDropdown";
import PokemonNatureDropdown from "../../dropdowns/natureDropdown/PokemonNatureDropdown";

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function CurrentPokemonForm({ pokemon }) {
    const [ready, setReady] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [section, setSection] = useState("Stats");
    const [currentNature, setCurrentNature] = useState(pokemon.nature);
    const [currentAbility, setCurrentAbility] = useState(pokemon.ability);
    const [currentGender, setCurrentGender] = useState(pokemon.gender);
    const [currentHeldItem, setCurrentHeldItem] = useState(pokemon.heldItem);
    const [currentMoves, setCurrentMoves] = useState([...pokemon.moves]);

    // Unsaved changes
    useEffect(() => {
        const editableElements = document.querySelectorAll('[contenteditable="true"]');
        const handleInput = () => setHasChanges(true);

        editableElements.forEach(el => {
            el.addEventListener("input", handleInput);
        });

        return () => {
            editableElements.forEach(el => {
                el.removeEventListener("input", handleInput);
            });
        };
    }, [pokemon]);

    useEffect(() => {
        const ivEvInputs = document.querySelectorAll('.iv-value, .ev-value');
        const handleChange = () => setHasChanges(true);
    
        ivEvInputs.forEach(input => {
            input.addEventListener("input", handleChange);
        });
    
        return () => {
            ivEvInputs.forEach(input => {
                input.removeEventListener("input", handleChange);
            });
        };
    }, [pokemon]);    

    // Graphic
    useEffect(() => {
        async function setupStatsAndChart() {
            await CalculatePokemonStats(pokemon);
            if (!pokemon.attributes) return;
            setReady(true);

            const ctx = chartRef.current;

            // Destroi gráfico anterior se existir
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            const newChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['HP', 'Attack', 'Defense', 'S.Atk', 'S.Def', 'Speed'],
                    datasets: [{
                        label: '',
                        data: [
                            pokemon.attributes['HP'],
                            pokemon.attributes['Attack'],
                            pokemon.attributes['Defense'],
                            pokemon.attributes['S.Atk'],
                            pokemon.attributes['S.Def'],
                            pokemon.attributes['Speed']
                        ],
                        fill: true,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgb(255, 99, 132)',
                        pointBackgroundColor: 'rgb(255, 99, 132)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(255, 99, 132)'
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            labels: {
                                font: {
                                    family: "'Kimberle', sans-serif"
                                }
                            }
                        }
                    },
                    elements: {
                        line: {
                            borderWidth: 2
                        }
                    }
                }
            });

            Chart.defaults.font.size = 18;

            chartInstanceRef.current = newChart; // Salva referência
        }

        setupStatsAndChart();

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [pokemon]);

    const saveChanges = async () => {
        const updatedData = {
            nickname: document.querySelector(".first-field:nth-of-type(2)")?.innerText,
            level: document.querySelector(".first-field + .pokemon-field-text + div")?.innerText,
            gender: currentGender,
            ability: currentAbility,
            nature: currentNature,
            heldItem: currentHeldItem,
            moves: currentMoves,
            ivs: {},
            evs: {},
        };
    
        ["HP", "Attack", "Defense", "S.Atk", "S.Def", "Speed"].forEach((stat, i) => {
            const iv = document.querySelector(`.ivs .ev:nth-of-type(${i + 1}) .iv-value`);
            if (iv && iv.value !== "") {
                updatedData.ivs[stat] = parseInt(iv.value);
            } else {
                updatedData.ivs[stat] = pokemon.ivs?.[stat] ?? 0;
            }
            const ev = document.querySelector(`.evs .ev:nth-of-type(${i + 1}) .ev-value`);
            if (ev && ev.value !== "") {
                updatedData.evs[stat] = parseInt(ev.value);
            } else {
                updatedData.evs[stat] = pokemon.evs?.[stat] ?? 0;
            }
            if (iv) updatedData.ivs[stat] = iv.value;
            if (ev) updatedData.evs[stat] = ev.value;
        });
    
        try {
            const pokemonRef = doc(db, "pokemon", pokemon.id); // Certifique-se de que `pokemon.id` é o ID do documento
            await updateDoc(pokemonRef, updatedData);
            setHasChanges(false);
        } catch (error) {
            console.error("Erro ao salvar no Firebase:", error);
        }
    };
    

    return (
        <div className="player-Token pokemon-Filled-Container" id="JhonnyTail2-Token">
            <div className="start">
                <div className="info">Info</div>

                <p className="pokemon-field-text first-field">
                    <b className="null">Nickname:</b>
                </p>
                <div className="pokemon-field-answear first-field" contentEditable spellCheck={false}>
                    {pokemon.nickname}
                </div>

                <p className="pokemon-field-text">
                    <b>Level:</b>
                </p>
                <div className="pokemon-field-answear" contentEditable spellCheck={false}>
                    {pokemon.level}
                </div>

                <p className="pokemon-field-text">
                    <b>Gender:</b>
                </p>
                <PokemonGenderDropdown
                    initialValue={pokemon.gender}
                    onSelect={(newGender) => {
                        pokemon.gender = newGender;
                        setCurrentGender(newGender);
                        setHasChanges(true);
                    }}
                />

                <p className="pokemon-field-text">
                    <b>Ability:</b>
                </p>
                <PokemonAbilitiesDropdown
                    species={pokemon.species}
                    initialValue={pokemon.ability}
                    onSelect={(newAbility) => {
                        pokemon.ability = newAbility;
                        setCurrentAbility(newAbility);
                        setHasChanges(true);
                    }}
                />

                <p className="pokemon-field-text">
                    <b>Nature:</b>
                </p>
                <PokemonNatureDropdown
                    initialValue={pokemon.nature}
                    onSelect={(newNature) => {
                        pokemon.nature = newNature;
                        setCurrentNature(newNature);
                        setHasChanges(true);
                    }}
                />

                <p className="pokemon-field-text">
                    <b>Held item:</b>
                </p>
                <PokemonHeldItemDropdown
                    initialValue={pokemon.heldItem}
                    onSelect={(newItem) => {
                        pokemon.heldItem = newItem;
                        setCurrentHeldItem(newItem);
                        setHasChanges(true);
                    }}
                />
            </div>

            <div className="moves-container">
                <div className="info">Moves</div>
                <div className="moves">
                    {pokemon.moves.map((move, i) => (
                        <PokemonMovesDropdown
                            key={i}
                            species={pokemon.species}
                            initialValue={move}
                            onSelect={(newMove) => {
                                const updatedMoves = [...currentMoves];
                                updatedMoves[i] = newMove;
                                setCurrentMoves(updatedMoves);
                                setHasChanges(true);
                            }}                              
                        />
                    ))}
                </div>
            </div>

            <div className="ivs-container">
                <div className="info">IVs / Stats / EVs</div>
                <div className="iv-button">
                    <button
                        className={`left-button ${section === "IVs" ? "active" : ""}`}
                        onClick={() => section !== "IVs" && setSection("IVs")}
                    >
                        IVs
                    </button>
                    <button
                        className={`att-button ${section === "Stats" ? "active" : ""}`}
                        onClick={() => section !== "Stats" && setSection("Stats")}
                    >
                        Stats
                    </button>
                    <button
                        className={`right-button ${section === "EVs" ? "active" : ""}`}
                        onClick={() => section !== "EVs" && setSection("EVs")}
                    >
                        EVs
                    </button>
                </div>

                <div className={`ivs ${section === "IVs" ? "show" : "hide"}`}>
                    {pokemon.ivs && ["HP", "Attack", "Defense", "S.Atk", "S.Def", "Speed"].map((stat, i) => (
                        <div className="ev" key={i}>
                            <div className="iv-text">{stat}</div>
                            <input
                                defaultValue={pokemon.ivs[stat]}
                                type='number'
                                className="iv-value"
                                min="0" max="31"
                            />
                        </div>
                    ))}
                </div>

                <div className={`stats ${section === "Stats" ? "show" : "hide"}`}>
                    {ready && pokemon.attributes && ["HP", "Attack", "Defense", "S.Atk", "S.Def", "Speed"].map((stat, i) => (
                        <div className="stat" key={i}>
                            <div className="stats-text">{stat}</div>
                            <div className="stats-value" spellCheck={false}>
                                {pokemon.attributes[stat]}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`evs ${section === "EVs" ? "show" : "hide"}`}>
                    {pokemon.evs && ["HP", "Attack", "Defense", "S.Atk", "S.Def", "Speed"].map((stat, i) => (
                        <div className="ev" key={i}>
                            <div className="ev-text">{stat}</div>
                            <input
                                defaultValue={pokemon.evs[stat]}
                                type='number'
                                className="ev-value"
                                min="0" max="252"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="stats-visualiser">
                <div className="info stats-info">Stats</div>
                <div className="canvas-container">
                    <canvas
                        ref={chartRef}
                        className="null"
                        id="myChart"
                        width="435"
                        height="328"
                        style={{
                            display: "block",
                            boxSizing: "border-box",
                            height: "273px",
                            width: "363px"
                        }}
                    ></canvas>
                </div>
                <div className="pokemon-sprite-container">
                    <PokemonGif specie={pokemon.species}></PokemonGif>
                </div>

                {hasChanges && (
                    <SaveButton onClick={saveChanges}></SaveButton>
                )}
            </div>
        </div>
    );
}
