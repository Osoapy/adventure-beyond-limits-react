import { useEffect, useRef } from "react";
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function CurrentPokemonForm() {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current;

        const myChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['HP', 'Attack', 'Defence', 'S.Atk', 'S.Def', 'Speed'],
                datasets: [{
                    label: '',
                    data: [1, 2, 3, 4, 5, 6],
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

        return () => myChart.destroy();
    }, []);

    return (
        <div className="player-Token pokemon-Filled-Container" id="JhonnyTail2-Token">
            <div className="start">
                <div className="info">Info</div>

                <p className="pokemon-field-text first-field">
                    <b className="null">Nickname:</b>
                </p>
                <div className="pokemon-field-answear first-field" contentEditable spellCheck={false}>Paramount</div>

                <p className="pokemon-field-text">
                    <b>Level:</b>
                </p>
                <div className="pokemon-field-answear" contentEditable spellCheck={false}>21</div>

                <p className="pokemon-field-text">
                    <b>Gender:</b>
                </p>
                <div className="pokemon-field-answear" contentEditable spellCheck={false}>M</div>

                <p className="pokemon-field-text">
                    <b>Ability:</b>
                </p>
                <div className="pokemon-field-answear ability water" contentEditable spellCheck={false}>Water Absorb</div>

                <p className="pokemon-field-text">
                    <b>Nature:</b>
                </p>
                <div className="pokemon-field-answear nature" contentEditable spellCheck={false}>Mild</div>

                <p className="pokemon-field-text">
                    <b>Held item:</b>
                </p>
                <div className="pokemon-field-answear" contentEditable spellCheck={false}></div>
            </div>

            <div className="moves-container">
                <div className="info">Moves</div>
                <div className="moves">
                    <div className="move" contentEditable spellCheck={false}>Bubble Beam</div>
                    <div className="move" contentEditable spellCheck={false}>Hypnosis</div>
                    <div className="move" contentEditable spellCheck={false}>Mud Shot</div>
                    <div className="move" contentEditable spellCheck={false}>Pound</div>
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
                    {["HP", "Atk", "Def", "S.Atk", "S.Def", "Speed"].map((stat, i) => (
                        <div className="ev" key={i}>
                            <div className="iv-text">{stat}</div>
                            <div className="iv-value" contentEditable spellCheck={false}>
                                {["19", "27", "15", "15", "21", "27"][i]}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="ivs show">
                    {["HP", "Atk", "Def", "S.Atk", "S.Def", "Speed"].map((stat, i) => (
                        <div className="ev" key={i}>
                            <div className="ev-text">{stat}</div>
                            <div className="ev-value" contentEditable spellCheck={false}>
                                {["65", "31", "22", "41", "26", "48"][i]}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="evs">
                    {["HP", "Atk", "Def", "S.Atk", "S.Def", "Speed"].map((stat, i) => (
                        <div className="ev" key={i}>
                            <div className="ev-text">{stat}</div>
                            <div className="ev-value" contentEditable spellCheck={false}>
                                {["252", "0", "4", "252", "0", "0"][i]}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="stats">
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
                    <img
                        className="pokemon-sprite"
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/60.gif"
                        alt="pokemon"
                    />
                </div>
            </div>
        </div>
    );
}
