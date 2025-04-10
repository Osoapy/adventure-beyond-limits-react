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
            
            <div className="teams-Container">
                <div className="player-Container" id="JhonnyTail2-Container">
                    <div className="player" id="JhonnyTail2">
                        <header className="top-Container">
                            <div className="playerButton" id="playerJhonnyTail2Button">
                                <img className="playerImg" id="playerJhonnyTail2" 
                                    src={
                                        trainer?.imageBase64 ||
                                        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                                    }/>
                            </div>
                            <div className="player-Top">
                                <h1 className="player-Name">Jhonny Tail 2</h1>
                                <div className="underline"></div>
                            </div>
                        </header>
                        <div className="pokemonTeam-Container">
                            <button className="pokemonTeam steel" id="playerJhonnyTail2TeamButton0">
                                <img className="pokemonTeamImage" id="playerJhonnyTail2TeamImage0" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/375.png"/>
                            </button>
                            <button className="pokemonTeam water" id="playerJhonnyTail2TeamButton1">
                                <img className="pokemonTeamImage" id="playerJhonnyTail2TeamImage1" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/60.png"/>
                            </button>
                            <button className="pokemonTeam" id="playerJhonnyTail2TeamButton2">
                                <img className="pokemonTeamImage" id="playerJhonnyTail2TeamImage2" src="./Assets/Images/addButton.png"/>
                            </button>
                            <button className="pokemonTeam" id="playerJhonnyTail2TeamButton3">
                                <img className="pokemonTeamImage" id="playerJhonnyTail2TeamImage3" src="./Assets/Images/addButton.png"/>
                            </button>
                            <button className="pokemonTeam" id="playerJhonnyTail2TeamButton4">
                                <img className="pokemonTeamImage" id="playerJhonnyTail2TeamImage4" src="./Assets/Images/addButton.png"/>
                            </button>
                            <button className="pokemonTeam" id="playerJhonnyTail2TeamButton5">
                                <img className="pokemonTeamImage" id="playerJhonnyTail2TeamImage5" src="./Assets/Images/addButton.png"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
