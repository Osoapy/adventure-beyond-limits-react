import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import './myAccountPage.scss';
import PokemonTeam from "../../components/pokemonTeam/PokemonTeam";
import StandardHeader from "../../components/standardHeader/StandardHeader";
import AddTeamButton from "../../components/buttons/addTeamButton/AddTeamButton";
import AddPokemonForm from "../../components/forms/addPokemonForm/AddPokemonForm";
import PokemonButton from "../../components/buttons/pokemonButton/pokemonButton";
import CurrentPokemonForm from "../../components/forms/currentPokemonForm/CurrentPokemonForm";

export default function MyAccountPage() {
  const [trainer, setTrainer] = useState(null);
  const [pokemons, setPokemons] = useState([]);
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [showForm, setShowForm] = useState({ show: false, teamNumber: null });
  const [showPokemonInfo, setShowPokemonInfo] = useState(false);
  const [extraTeams, setExtraTeams] = useState([]);
  const email = sessionStorage.getItem("email");

  // Carrega dados do treinador
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

  // Carrega todos os pokémons do treinador
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
  
  // ✅ Organiza pokémons por times
  const groupedByTeam = pokemons.reduce((acc, poke) => {
    const teamNumber = poke.team ?? 1;
    if (!acc[teamNumber]) {
      acc[teamNumber] = [];
    }
    acc[teamNumber].push(poke);
    return acc;
  }, {});

  const sortedTeamNumbers = Object.keys(groupedByTeam)
    .map(Number)
    .sort((a, b) => a - b);

  // ✅ Adição de novo time vazio
  const handleAddTeam = () => {
    const maxTeamNumber = sortedTeamNumbers.length > 0
      ? Math.max(...sortedTeamNumbers)
      : 0;

    const newTeamNumber = Math.max(...[...sortedTeamNumbers, ...extraTeams, maxTeamNumber]) + 1;

    setExtraTeams(prev => [...prev, newTeamNumber]);
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
        <AddTeamButton onClick={handleAddTeam} />

        {/* Times com pokémons */}
        {sortedTeamNumbers.map(teamNumber => (
          <PokemonTeam
            key={teamNumber}
            teamNumber={teamNumber}
            onReorder={handleReorder}
            setShowForm={setShowForm}
            showForm={showForm}
          >
            {groupedByTeam[teamNumber]?.map(poke => (
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
        ))}

        {/* Times vazios adicionados manualmente */}
        {extraTeams.map(teamNumber => (
          <PokemonTeam
            key={teamNumber}
            teamNumber={teamNumber}
            onReorder={handleReorder}
            setShowForm={setShowForm}
            showForm={showForm}
          >
            {/* Nenhum Pokémon aqui */}
          </PokemonTeam>
        ))}

        {showForm.show && <AddPokemonForm teamNumber={showForm.teamNumber} />}
        {showPokemonInfo && !showForm.show && currentPokemon && (
          <CurrentPokemonForm pokemon={currentPokemon} />
        )}
      </div>
    </>
  );
}
