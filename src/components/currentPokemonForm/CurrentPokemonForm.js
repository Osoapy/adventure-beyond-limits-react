import { useEffect, useRef, useState } from "react";
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import PokemonGif from "../../utils/fetchs/pokemonGif/PokemonGif";
import './currentPokemonForm.css';
import CalculatePokemonStats from "../../utils/functions/calculatePokemonStats/CalculatePokemonStats";

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function CurrentPokemonForm({ pokemon }) {
    const [ready, setReady] = useState(false);
    const chartRef = useRef(null);
    const [section, setSection] = useState("Stats"); // "IVs", "EVs" ou "Stats"
    const chartInstanceRef = useRef(null);

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
                <div className="pokemon-field-answear" contentEditable spellCheck={false}>
                    {pokemon.gender}
                </div>

                <p className="pokemon-field-text">
                    <b>Ability:</b>
                </p>
                <div className="pokemon-field-answear ability water" contentEditable spellCheck={false}>
                    {pokemon.ability}
                </div>

                <p className="pokemon-field-text">
                    <b>Nature:</b>
                </p>
                <div className="pokemon-field-answear nature" contentEditable spellCheck={false}>
                    {pokemon.nature}
                </div>

                <p className="pokemon-field-text">
                    <b>Held item:</b>
                </p>
                <div className="pokemon-field-answear" contentEditable spellCheck={false}>
                    {pokemon.heldItem}
                </div>
            </div>

            <div className="moves-container">
                <div className="info">Moves</div>
                <div className="moves">
                {pokemon.moves.map((move, index) => (
                    <div
                    key={index}
                    className="move"
                    contentEditable
                    spellCheck={false}
                    >
                        {move}
                    </div>
                ))}
                </div>
            </div>

            <div className="ivs-container">
                <div className="info">IVs / EVs</div>
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
                            <div className="iv-value" contentEditable spellCheck={false}>
                                {pokemon.ivs[stat]}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`stats ${section === "Stats" ? "show" : "hide"}`}>
                    {ready && pokemon.attributes && ["HP", "Attack", "Defense", "S.Atk", "S.Def", "Speed"].map((stat, i) => (
                        <div className="stat" key={i}>
                            <div className="stats-text">{stat}</div>
                            <div className="stats-value" contentEditable spellCheck={false}>
                                {pokemon.attributes[stat]}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`evs ${section === "EVs" ? "show" : "hide"}`}>
                    {pokemon.evs && ["HP", "Attack", "Defense", "S.Atk", "S.Def", "Speed"].map((stat, i) => (
                        <div className="ev" key={i}>
                            <div className="ev-text">{stat}</div>
                            <div className="ev-value" contentEditable spellCheck={false}>
                                {pokemon.evs[stat]}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="stats-visualiser">
                <div className="info">Stats</div>
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
            </div>
        </div>
    );
}
