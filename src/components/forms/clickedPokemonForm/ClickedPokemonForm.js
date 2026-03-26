import { useEffect, useRef, useState } from "react";
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import PokemonGif from "../../../utils/pokemonGif/PokemonGif";
import styles from '../standardForm.module.scss';
import getPokemonStats from "../../../utils/getPokemonStats/getPokemonStats";
import SaveButton from "../../buttons/saveButton/SaveButton";
import { savePokemon } from "../../../database/functions/savePokemon";
import { excludePokemon } from "../../../database/functions/excludePokemon"
// DROPDOWNS
import MovesDropdown from '../../dropdowns/movesDropdown/MovesDropdown';
import HeldItemDropdown from "../../dropdowns/heldItemDropdown/HeldItemDropdown";
import GenderDropdown from "../../dropdowns/genderDropdown/GenderDropdown";
import AbilitiesDropdown from "../../dropdowns/abilityDropdown/AbilityDropdown";
import NatureDropdown from "../../dropdowns/natureDropdown/NatureDropdown";
import ExcludeButton from "../../buttons/excludeButton/ExcludeButton";

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function CurrentPokemonForm({ pokemon, teamNumber, email }) {
    const [ready, setReady] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const nicknameRef = useRef();
    const levelRef = useRef();
    const [section, setSection] = useState("Stats");
    const [currentNature, setCurrentNature] = useState(pokemon.nature);
    const [currentAbility, setCurrentAbility] = useState(pokemon.ability);
    const [currentGender, setCurrentGender] = useState(pokemon.gender);
    const [currentHeldItem, setCurrentHeldItem] = useState(pokemon.heldItem);
    const [currentMoves, setCurrentMoves] = useState([...pokemon.moves]);

    useEffect(() => {
        if (nicknameRef.current) nicknameRef.current.innerText = pokemon.nickname;
        if (levelRef.current) levelRef.current.innerText = pokemon.level;
    }, [pokemon]);  

    // Graphic
    useEffect(() => {
        async function setupStatsAndChart() {
            await getPokemonStats(pokemon);
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
            nickname: nicknameRef.current?.innerText,
            level: levelRef.current?.innerText,
            gender: currentGender,
            ability: currentAbility,
            nature: currentNature,
            heldItem: currentHeldItem,
            moves: currentMoves,
            ivs: {},
            evs: {},
            id: pokemon.id,
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
            await savePokemon(email, teamNumber, updatedData)
            setHasChanges(false);
        } catch (error) {
            console.error("Erro ao salvar no Firebase:", error);
        }
    };
    
    return (
    <div className={`${styles["player-Token"]} ${styles["pokemon-Filled-Container"]}`}>
        <div className={styles["start"]}>
            <div className={styles["info"]}>Info</div>

            <div className={styles["text-and-dropdown-wrapper"]}>
                <p className={`${styles["pokemon-field-text"]} ${styles["first-field"]}`}>
                    <b>Nickname:</b>
                </p>
                <div className={`${styles["pokemon-field-answear"]} ${styles["first-field"]}`} ref={nicknameRef} contentEditable spellCheck={false}>
                </div>
            </div>

            <div className={styles["text-and-dropdown-wrapper"]}>
                <p className={styles["pokemon-field-text"]}>
                    <b>Level:</b>
                </p>
                <div className={styles["pokemon-field-answear"]} ref={levelRef} contentEditable spellCheck={false}>
                </div>
            </div>

            <div className={styles["text-and-dropdown-wrapper"]}>
                <p className={styles["pokemon-field-text"]}>
                    <b>Gender:</b>
                </p>
                <GenderDropdown
                    initialValue={pokemon.gender}
                    onSelect={(newGender) => {
                        pokemon.gender = newGender;
                        setCurrentGender(newGender);
                        setHasChanges(true);
                    }}
                />
            </div>

            <div className={styles["text-and-dropdown-wrapper"]}>
                <p className={styles["pokemon-field-text"]}>
                    <b>Ability:</b>
                </p>
                <AbilitiesDropdown
                    species={pokemon.species}
                    initialValue={pokemon.ability}
                    onSelect={(newAbility) => {
                        pokemon.ability = newAbility;
                        setCurrentAbility(newAbility);
                        setHasChanges(true);
                    }}
                />
            </div>

            <div className={styles["text-and-dropdown-wrapper"]}>
                <p className={styles["pokemon-field-text"]}>
                    <b>Nature:</b>
                </p>
                <NatureDropdown
                    initialValue={pokemon.nature ? pokemon.nature : 'docile'}
                    onSelect={(newNature) => {
                        pokemon.nature = newNature;
                        setCurrentNature(newNature);
                        setHasChanges(true);
                    }}
                />
            </div>

            <div className={styles["text-and-dropdown-wrapper"]}>
                <p className={styles["pokemon-field-text"]}>
                    <b>Held item:</b>
                </p>
                <HeldItemDropdown
                    initialValue={pokemon.heldItem}
                    onSelect={(newItem) => {
                        pokemon.heldItem = newItem;
                        setCurrentHeldItem(newItem);
                        setHasChanges(true);
                    }}
                />
            </div>
        </div>

        <div className={styles["moves-container"]}>
            <div className={styles["info-moves"]}>Moves</div>
            <div className={styles["moves"]}>
                {pokemon.moves.map((move, i) => (
                    <MovesDropdown
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

        <div className={styles["ivs-container"]}>
            <div className={styles["info-ivs-evs"]}>IVs / Stats / EVs</div>

            <div className={styles["iv-button"]}>
                <button
                    className={`${styles["left-button"]} ${section === "IVs" ? styles["active"] : ""}`}
                    onClick={() => section !== "IVs" && setSection("IVs")}
                >
                    IVs
                </button>
                <button
                    className={`${styles["att-button"]} ${section === "Stats" ? styles["active"] : ""}`}
                    onClick={() => section !== "Stats" && setSection("Stats")}
                >
                    Stats
                </button>
                <button
                    className={`${styles["right-button"]} ${section === "EVs" ? styles["active"] : ""}`}
                    onClick={() => section !== "EVs" && setSection("EVs")}
                >
                    EVs
                </button>
            </div>

            <div className={`${styles["ivs"]} ${section === "IVs" ? styles["show"] : styles["hide"]}`}>
                {pokemon.ivs && ["HP", "Attack", "Defense", "S.Atk", "S.Def", "Speed"].map((stat, i) => (
                    <div className={styles["ev"]} key={i}>
                        <div className={styles["iv-text"]}>{stat}</div>
                        <input
                            defaultValue={pokemon.ivs[stat]}
                            type='number'
                            className={styles["iv-value"]}
                            min="0" max="31"
                            onChange={() => setHasChanges(true)}
                        />
                    </div>
                ))}
            </div>

            <div className={`${styles["stats"]} ${section === "Stats" ? styles["show"] : styles["hide"]}`}>
                {ready && pokemon.attributes && ["HP", "Attack", "Defense", "S.Atk", "S.Def", "Speed"].map((stat, i) => (
                    <div className={styles["stat"]} key={i}>
                        <div className={styles["stats-text"]}>{stat}</div>
                        <input
                            defaultValue={pokemon.attributes[stat]}
                            type='number'
                            className={styles["stats-value"]}
                            readOnly={true}
                        >
                        </input>
                    </div>
                ))}
            </div>

            <div className={`${styles["evs"]} ${section === "EVs" ? styles["show"] : styles["hide"]}`}>
                {pokemon.evs && ["HP", "Attack", "Defense", "S.Atk", "S.Def", "Speed"].map((stat, i) => (
                    <div className={styles["ev"]} key={i}>
                        <div className={styles["ev-text"]}>{stat}</div>
                        <input
                            defaultValue={pokemon.evs[stat]}
                            type='number'
                            className={styles["ev-value"]}
                            min="0" max="252"
                            onChange={() => setHasChanges(true)}
                        />
                    </div>
                ))}
            </div>
        </div>

        <div className={styles["stats-visualiser"]}>
            <div className={`${styles["stats-info"]}`}>Stats</div>

            <div className={styles["canvas-container"]}>
                <canvas
                    ref={chartRef}
                    className={styles["null"]}
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

            <div className={styles["pokemon-sprite-container"]}>
                <PokemonGif className={styles["pokemon-sprite"]} specie={pokemon.species}></PokemonGif>
            </div>

            {hasChanges && (
                <SaveButton onClick={saveChanges}></SaveButton>
            )}

            <ExcludeButton onClick={() => excludePokemon(email, pokemon.teamNumber, pokemon.id)}></ExcludeButton>
        </div>
    </div>
);

}