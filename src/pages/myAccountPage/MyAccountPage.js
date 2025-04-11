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
    const [currentPokemon, setCurrentPokemon] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showPokemonInfo, setShowPokemonInfo] = useState(false);
    const email = sessionStorage.getItem("email");

    useEffect(() => {
        async function fetchTrainer() {
            if (!email) return;
    
            const q = query(
                collection(db, "player"),
                where("email", "==", String(email).toLowerCase().trim())
            );            
    
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const data = snapshot.docs[0].data();
                setTrainer(data);
            } else {
                console.warn("Nenhum trainer encontrado para o email:", email);
            }
        }
    
        fetchTrainer();
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
                <PokemonButton onClick={() => setShowPokemonInfo(prev => !prev)} ></PokemonButton>
                <PokemonButton onClick={() => setShowPokemonInfo(prev => !prev)} ></PokemonButton>
                <PokemonButton onClick={() => setShowPokemonInfo(prev => !prev)} ></PokemonButton>
                <PokemonButton onClick={() => setShowPokemonInfo(prev => !prev)} ></PokemonButton>
                <PokemonButton onClick={() => setShowPokemonInfo(prev => !prev)} ></PokemonButton>
                <PokemonButton onClick={() => setShowPokemonInfo(prev => !prev)} ></PokemonButton>
                <PokemonButton onClick={() => setShowPokemonInfo(prev => !prev)} ></PokemonButton>
                <PokemonButton onClick={() => setShowPokemonInfo(prev => !prev)} ></PokemonButton>
            </PokemonTeam>

            {showForm && <AddPokemonForm />}
            {showPokemonInfo && <CurrentPokemonForm />}

            <AddButton onClick={() => setShowForm(prev => !prev)} />
        </div>
    );
}
