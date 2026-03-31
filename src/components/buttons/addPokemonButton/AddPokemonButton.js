import styles from "./addPokemonButton.module.scss";
import spriteUrl from '../../../assets/images/plusSymbol.png';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import NewPokemonForm from "../../forms/newPokemonForm/NewPokemonForm";

const MySwal = withReactContent(Swal);

export default function AddPokemonButton({ teamNumber, email }) {
    const openPokemonModal = () => {
        const defaultData = {
            trainer: email,
            species: '',
            nickname: '',
            level: '1',
            gender: '',
            ability: '',
            nature: '',
            team: teamNumber,
            heldItem: '',
            moves: ['', '', '', ''],
            ivs: { HP: '31', Attack: '31', Defense: '31', 'S.Atk': '31', 'S.Def': '31', Speed: '31' },
            evs: { HP: '0', Attack: '0', Defense: '0', 'S.Atk': '0', 'S.Def': '0', Speed: '0' },
        };

        MySwal.fire({
            title: '',
            width: 1000,
            background: 'transparent',
            color: '#fff',
            showConfirmButton: false,
            showCloseButton: true,
            allowOutsideClick: true,
            html: (
                <NewPokemonForm
                    defaultData={defaultData}
                    teamNumber={teamNumber}
                    email={email}
                />
            ),
        });
    };

    return (
        <button 
            className={styles.pokemonFromTeam + " " + styles.plusSymbolContainer}
            onClick={openPokemonModal}
        >
            <img 
                className={styles.plusSymbol} 
                src={spriteUrl} 
                alt={"AddButton"} 
                draggable="false"
            />
            <img 
                className={styles.fakePlusSymbol}
                src={spriteUrl} 
                alt={"AddButton"} 
                draggable="false"
            />
        </button>
    );
}