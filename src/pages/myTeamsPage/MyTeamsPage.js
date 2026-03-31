import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { addTrainer } from "../../database/functions/addTrainer";
import { db, auth } from "../../database/firebase";
import PokemonTeam from "../../components/pokemonTeam/PokemonTeam";
import StandardHeader from "../../components/headers/standardHeader/StandardHeader";
import CreateNewTeamButton from "../../components/buttons/createNewTeamButton/CreateNewTeamButton";
import ImportFromShowdownButton from "../../components/buttons/importFromShowdownButton/ImportFromShowdownButton";
import styles from "./myTeamsPage.module.scss";

export default function MyAccountPage() {
  const [teams, setTeams] = useState([]);
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { // Verifica a autenticação do usuário e carrega os times de pokemons
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/");
        return;
      }

      try {
        const email = user.email?.toLowerCase().trim();
        setEmail(email);

        const userRef = collection(db, "trainers", email, "teams");
        const userSnap = await getDocs(userRef);

        if (userSnap.empty) {
          console.warn("Nenhum time encontrado");
          addTrainer(email);
          setTeams([]);
          return;
        }

        const data = [];
        for (const teamDoc of userSnap.docs) {
          const teamData = teamDoc.data();

          const pokemonsRef = collection(db, "trainers", email, "teams", teamDoc.id, "pokemons");
          const pokemonsSnap = await getDocs(pokemonsRef);

          const pokemons = [];
          pokemonsSnap.forEach((poke) => {
            pokemons.push(poke.data());
          });

          data.push({
            id: teamDoc.id,
            ...teamData,
            pokemons
          });
        }
        setTeams(data);
        console.log("Times de pokemons carregados:", data);
      } catch (error) {
        console.error("Erro ao buscar pokemons:", error);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
			<StandardHeader>
			</StandardHeader>

      <div className={styles.myAccountBody}>
				<div className={styles.buttonsContainer}>
          <CreateNewTeamButton teamsList={teams} setTeamsList={setTeams} />
          <ImportFromShowdownButton teamList={teams} setTeamList={setTeams} email={email}/>
				</div>

        {teams.map((team, index) => (
          <PokemonTeam 
            key={index}
            teamData={team}
            teamNumber={index + 1}
            realTeamNumber={team.number}
            email={email}
          />
        ))}
			</div>
    </>
  );
}