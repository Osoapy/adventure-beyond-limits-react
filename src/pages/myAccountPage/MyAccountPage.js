import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import './myAccountPage.css'

export default function MyAccountPage() {
    const [trainer, setTrainer] = useState(null);
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
            <header className="app-bar">
                <div className="app-bar-title">Pokédex</div>
                <div className="app-bar-buttons">
                </div>
                <img
                    src={
                        trainer?.imageBase64 ||
                        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                    }
                    alt="Foto do corno"
                    className="w-10 h-10 rounded-full border-2 border-white shadow"
                />
            </header>
            <header className="bg-blue-700 text-white flex items-center justify-between px-6 py-4 shadow-md">
                <h1 className="text-2xl font-semibold">Minha Conta</h1>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium">
                            {trainer?.name || "Treinador Desconhecido"}
                        </p>
                        <p className="text-xs text-blue-200">
                            {trainer?.rank || "Sem Rank"}
                        </p>
                    </div>
                    
                </div>
            </header>

            <main className="p-6">
                <h2 className="text-lg font-bold mb-2">Seja bem-vindo, {trainer?.name || email}!</h2>
                <p>Você é rank <strong>{trainer?.rank || "N/A"}</strong> com <strong>{trainer?.money || "0"}</strong> moedas.</p>
            </main>
        </div>
    );
}
