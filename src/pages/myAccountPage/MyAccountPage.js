import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "../../firebase";
import "./myAccountPage.scss";
import PokemonTeam from "../../components/pokemonTeam/PokemonTeam";
import StandardHeader from "../../components/standardHeader/StandardHeader";
import AddPokemonForm from "../../components/forms/addPokemonForm/AddPokemonForm";
import PokemonButton from "../../components/buttons/pokemonButton/pokemonButton";
import CurrentPokemonForm from "../../components/forms/currentPokemonForm/CurrentPokemonForm";
import HandlerButton from "../../components/buttons/handlerButton/HandlerButton";
import importTeamAlert from "../../utils/sweetAlerts2/importTeamAlert";
import { SavePokemon } from "../../database/SavePokemon";

export default function MyAccountPage() {
	const [trainer, setTrainer] = useState(null);
	const [pokemons, setPokemons] = useState([]);
	const [currentPokemon, setCurrentPokemon] = useState(null);
	const [showForm, setShowForm] = useState({ show: false, teamNumber: null });
	const [showPokemonInfo, setShowPokemonInfo] = useState(false);
	const [extraTeams, setExtraTeams] = useState([]);
	const email = sessionStorage.getItem("email");
	const normalizedEmail = email?.toLowerCase().trim();

	useEffect(() => {
		if (!normalizedEmail) return;

		const q = query(
			collection(db, "player"),
			where("email", "==", normalizedEmail)
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			if (!snapshot.empty) {
				setTrainer(snapshot.docs[0].data());
			} else {
				setTrainer(null);
			}
		});

		return () => unsubscribe();
	}, [normalizedEmail]);

	useEffect(() => {
		if (!normalizedEmail) return;

		const q = query(
			collection(db, "pokemon"),
			where("trainer", "==", normalizedEmail)
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const found = snapshot.docs
				.map((doc) => ({
					id: doc.id,
					...doc.data()
				}))
				.sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

			setPokemons(found);
		});

		return () => unsubscribe();
	}, [normalizedEmail]);

	const groupedByTeam = pokemons.reduce((acc, poke) => {
		const teamNumber = poke.team ?? 1;
		if (!acc[teamNumber]) acc[teamNumber] = [];
		acc[teamNumber].push(poke);
		return acc;
	}, {});

	const sortedTeamNumbers = Object.keys(groupedByTeam)
		.map(Number)
		.sort((a, b) => a - b);

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
				{sortedTeamNumbers.map((teamNumber) => (
					<PokemonTeam
						key={teamNumber}
						teamNumber={teamNumber}
						teamPokemons={groupedByTeam[teamNumber]}
					>
						{groupedByTeam[teamNumber]?.map((poke) => (
							<PokemonButton
								key={poke.id}
								pokemon={poke}
								onClick={() => {
									setShowForm(false);

									if (currentPokemon?.id === poke.id) {
										setShowPokemonInfo(prev => !prev);
									} else {
										setCurrentPokemon(poke);
										setShowPokemonInfo(true);
									}
								}}
							/>
						))}
					</PokemonTeam>
				))}

				{showPokemonInfo && currentPokemon && (
					<CurrentPokemonForm
						key={currentPokemon.id}
						pokemon={currentPokemon}
					/>
				)}
			</div>
		</>
	);
}
