import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import './myAccountPage.css';
import PokemonTeam from "../../components/pokemonTeam/PokemonTeam";
import StandardHeader from "../../components/standardHeader/StandardHeader";
import AddButton from "../../components/addButton/AddButton";
import AddPokemonForm from "../../components/addPokemonForm/AddPokemonForm";

export default function MyAccountPage() {
    const [trainer, setTrainer] = useState(null);
    const [showForm, setShowForm] = useState(false); // controla exibição
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
                    className="w-10 h-10 rounded-full border-2 border-white shadow"
                />
            </StandardHeader>
            
            <PokemonTeam />

            {showForm && <AddPokemonForm />} {/* renderiza o formulário condicionalmente */}

            <AddButton onClick={() => setShowForm(prev => !prev)} />
        </div>
    );
}
