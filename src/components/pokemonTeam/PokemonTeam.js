import { FiShare2, FiTrash2 } from "react-icons/fi";
import styles from "./pokemonTeam.module.scss";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ClickedPokemonForm from "../forms/clickedPokemonForm/ClickedPokemonForm";
// ALERTS
import excludeTeamAlert from "../../utils/alerts/excludeTeamAlert/excludeTeamAlert";
import exportTeamAlert from "../../utils/alerts/exportTeamAlert/exportTeamAlert";
// BUTTON
import AddPokemonButton from "../buttons/addPokemonButton/AddPokemonButton";
import OpenPokemonButton from "../buttons/openPokemonButton/OpenPokemonButton";

const MySwal = withReactContent(Swal);

export default function PokemonTeam({ teamNumber, teamData, email, realTeamNumber, setTeams }) {

    return (
        <div className={styles["pokemon-team-container"]}>
            <div className={styles["team-header"]}>
                <p>Time {teamNumber} com {teamData.pokemons ? teamData.pokemons.length : 0} pokémons</p>
                <div className={styles["team-header-icons"]}>
                    <button onClick={() => exportTeamAlert(teamData.pokemons)} className={styles["share-button"]}>
                        <FiShare2 size={20} />
                    </button>
                    <button onClick={() => excludeTeamAlert(email, realTeamNumber, setTeams)} className={styles["exclude-button"]}>
                        <FiTrash2 size={20} />
                    </button>
                </div>
            </div>
            <div className={styles["pokemons-container"]}>
                {teamData.pokemons && teamData.pokemons.map((pokemon, index) => (
                    <OpenPokemonButton
                        key={index}
                        pokemon={pokemon}
                        onClick={() => {
                            MySwal.fire({
                                title: '',
                                width: 1000,
                                background: 'transparent',
                                color: '#fff',
                                showConfirmButton: false,
                                showCloseButton: true,
                                allowOutsideClick: true,
                                html: (
                                    <ClickedPokemonForm
                                        pokemon={pokemon}
                                        teamNumber={realTeamNumber}
                                        email={email}
                                        setTeams={setTeams}
                                        closeSwal={MySwal.close}
                                    />
                                ),
                            });
                        }}
                    />
                ))}
                <AddPokemonButton teamNumber={realTeamNumber} email={email} />
            </div>
        </div>
    );
}