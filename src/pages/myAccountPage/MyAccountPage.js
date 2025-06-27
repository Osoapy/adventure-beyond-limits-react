import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import './myAccountPage.scss';
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
			})).sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

			setPokemons(foundPokemons);
		}
		fetchPokemons();
	}, [email]);

	const handleReorder = (teamNumber, oldIndex, newIndex) => {
		// Atualiza localmente de forma imediata
		setPokemons(prev => {
			const updated = [...prev];

			const teamPokemons = updated
				.filter(p => (p.team ?? 1) === teamNumber)
				.sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

			const [moved] = teamPokemons.splice(oldIndex, 1);
			teamPokemons.splice(newIndex, 0, moved);

			teamPokemons.forEach((poke, i) => {
				poke.ordem = i;
			});

			const final = updated.map(p => {
				if ((p.team ?? 1) === teamNumber) {
					return teamPokemons.find(tp => tp.id === p.id);
				}
				return p;
			});

			// Atualiza remotamente em segundo plano
			Promise.all(
				teamPokemons.map(poke =>
					updateDoc(doc(db, "pokemon", poke.id), { ordem: poke.ordem })
				)
			).catch(console.error);

			return final;
		});
	};

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

	const handleAddTeam = () => {
		const maxTeamNumber = sortedTeamNumbers.length > 0
			? Math.max(...sortedTeamNumbers)
			: 0;

		const newTeamNumber = Math.max(...[...sortedTeamNumbers, ...extraTeams, maxTeamNumber]) + 1;

		setExtraTeams(prev => [...prev, newTeamNumber]);
	};

	const handleImportFromShowDown = async () => {
		const pokemonList = await importTeamAlert(); // espera o input do usuário
		if (pokemonList?.length > 0) {
			const email = sessionStorage.getItem("email");

			for (const pokemon of pokemonList) {
				// Garante 4 slots de move
				while (pokemon.moves.length < 4) {
					pokemon.moves.push('');
				}

				const correctedPokemon = {
					trainer: email,
					species: pokemon.species,
					nickname: pokemon.nickname,
					level: pokemon.level,
					mainType: 'normal',
					gender: pokemon.gender === 'M' ? 'Male' : (pokemon.gender === 'F' ? 'Female' : 'Genderless'),
					teraType: pokemon.teraType,
					ability: pokemon.ability,
					nature: pokemon.nature,
					team: Math.max(...[...sortedTeamNumbers, ...extraTeams, sortedTeamNumbers.length > 0? Math.max(...sortedTeamNumbers): 0]) + 1,
					heldItem: pokemon.item,
					moves: pokemon.moves,
					ivs: {
						HP: pokemon.ivs["HP"],
						Attack: pokemon.ivs["Atk"],
						Defense: pokemon.ivs["Def"],
						'S.Atk': pokemon.ivs["SpA"],
						'S.Def': pokemon.ivs["SpD"],
						Speed: pokemon.ivs["Spe"]
					},
					evs: {
						HP: pokemon.evs["HP"],
						Attack: pokemon.evs["Atk"],
						Defense: pokemon.evs["Def"],
						'S.Atk': pokemon.evs["SpA"],
						'S.Def': pokemon.evs["SpD"],
						Speed: pokemon.evs["Spe"]
					},
				};

				await SavePokemon(correctedPokemon);
			}
		}
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
				<div className="buttonsContainer">
					<HandlerButton label="Criar novo time" onClick={handleAddTeam} />
					<HandlerButton label="Importar do ShowDown" onClick={handleImportFromShowDown} />
				</div>

				{sortedTeamNumbers.map(teamNumber => (
					<PokemonTeam
						key={teamNumber}
						teamNumber={teamNumber}
						teamPokemons={groupedByTeam[teamNumber]}
						onReorder={(oldIndex, newIndex) => handleReorder(teamNumber, oldIndex, newIndex)}
						setShowForm={setShowForm}
						showForm={showForm}
					>
						{groupedByTeam[teamNumber]
							?.sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
							.map(poke => (
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

				{extraTeams.map(teamNumber => (
					<PokemonTeam
						key={teamNumber}
						teamNumber={teamNumber}
						onReorder={handleReorder}
						setShowForm={setShowForm}
						showForm={showForm}
					/>
				))}

				{showForm.show && <AddPokemonForm teamNumber={showForm.teamNumber} pokemons={pokemons} />}
				{showPokemonInfo && !showForm.show && currentPokemon && (
					<CurrentPokemonForm pokemon={currentPokemon} />
				)}
			</div>
		</>
	);
}
