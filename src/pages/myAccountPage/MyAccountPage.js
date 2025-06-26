import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import './myAccountPage.scss';
import PokemonTeam from "../../components/pokemonTeam/PokemonTeam";
import StandardHeader from "../../components/standardHeader/StandardHeader";
import AddButton from "../../components/addButton/AddTeamButton";
import AddPokemonForm from "../../components/forms/addPokemonForm/AddPokemonForm";
import PokemonButton from "../../components/pokemonButton/pokemonButton";
import CurrentPokemonForm from "../../components/forms/currentPokemonForm/CurrentPokemonForm";

export default function MyAccountPage() {
    const [trainer, setTrainer] = useState(null);
    const [pokemons, setPokemons] = useState([]);
    const [currentPokemon, setCurrentPokemon] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showPokemonInfo, setShowPokemonInfo] = useState(false);
    const email = sessionStorage.getItem("email");

    // Busca os dados do treinador (pode remover se não for mais usar)
    useEffect(() => {
        async function fetchTrainer() {
            if (!email) return;
            const q = query(
                collection(db, "player"),
                where("email", "==", email.toLowerCase().trim())
            );
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const data = snapshot.docs[0].data();
                setTrainer(data);
            }
        }

        fetchTrainer();
    }, [email]);

    // Busca todos os pokémons associados ao email
    useEffect(() => {
        async function fetchPokemons() {
            if (!email) return;
            const q = query(
                collection(db, "pokemon"),
                where("trainer", "==", email.toLowerCase().trim())
            );
            const snapshot = await getDocs(q);
            const foundPokemons = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPokemons(foundPokemons);
        }

        fetchPokemons();
    }, [email]);

    const handleReorder = (oldIndex, newIndex) => {
        setPokemons(prevPokemons => {
            const newPokemons = [...prevPokemons];
            const [movedItem] = newPokemons.splice(oldIndex, 1);
            newPokemons.splice(newIndex, 0, movedItem);
            return newPokemons;
        });
    };

    return (
        <>
            <StandardHeader>
                <div className="pfp-container">
                    <img
                        src={
                            trainer?.imageBase64 ||
                            "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                        }
                        alt="Foto de perfil"
                        className="profile-picture"
                    />
                </div>
            </StandardHeader>

            <div className="myAccountBody">
                <AddButton onClick={() => {
                    setShowForm(prev => !prev);
                    if (showPokemonInfo) {
                        setShowPokemonInfo(false);
                    }
                }} />

                <PokemonTeam onReorder={handleReorder} numberOfTeams={1}>
                    {pokemons.map((poke) => (
                        <PokemonButton
                            key={poke.id}
                            pokemon={poke}
                            onClick={() => {
                                if (currentPokemon?.id === poke.id) {
                                    setShowPokemonInfo(prev => !prev);
                                } else {
                                    setShowForm(false);
                                    setCurrentPokemon(poke);
                                    setShowPokemonInfo(true);
                                }
                            }}
                        />
                    ))}
                </PokemonTeam>

                <PokemonTeam onReorder={handleReorder} numberOfTeams={2}>
                    {pokemons.map((poke) => (
                        <PokemonButton
                            key={poke.id}
                            pokemon={poke}
                            onClick={() => {
                                if (currentPokemon?.id === poke.id) {
                                    setShowPokemonInfo(prev => !prev);
                                } else {
                                    setShowForm(false);
                                    setCurrentPokemon(poke);
                                    setShowPokemonInfo(true);
                                }
                            }}
                        />
                    ))}
                </PokemonTeam>

                {showForm && <AddPokemonForm />}
                {showPokemonInfo && !showForm && currentPokemon && (
                    <CurrentPokemonForm pokemon={currentPokemon} />
                )}
            </div>
        </>
    );
}
