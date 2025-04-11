import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import './myAccountPage.css';
import PokemonTeam from "../../components/pokemonTeam/PokemonTeam";
import StandardHeader from "../../components/standardHeader/StandardHeader";
import AddButton from "../../components/addButton/AddButton";
import AddPokemonForm from "../../components/addPokemonForm/AddPokemonForm";
import PokemonButton from "../../components/pokemonButton/pokemonButton";
import CurrentPokemonForm from "../../components/currentPokemonForm/CurrentPokemonForm";

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

    return (
        <div className="min-h-screen bg-gray-100">
            <StandardHeader>
                <img
                    src={
                        trainer?.imageBase64 ||
                        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                    }
                    alt="Foto de perfil"
                    className="profile-picture"
                />
            </StandardHeader>

            <PokemonTeam>
                {pokemons.map((poke, index) => (
                    <PokemonButton
                        key={poke.id || index}
                        onClick={() => {
                            if (currentPokemon?.id === poke.id) {
                                setShowPokemonInfo(prev => !prev);
                            } else {
                                setCurrentPokemon(poke);
                                setShowPokemonInfo(true);
                            }
                        }}
                        pokemon={poke}
                    />
                ))}
            </PokemonTeam>

            {showForm && <AddPokemonForm />}
            {showPokemonInfo && currentPokemon && (
                <CurrentPokemonForm pokemon={currentPokemon} />
            )}

            <AddButton onClick={() => setShowForm(prev => !prev)} />
        </div>
    );
}
