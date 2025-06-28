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

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                if (!snapshot.empty) {
                    setTrainer(snapshot.docs[0].data());
                } else {
                    setTrainer(null);
                }
            },
            (error) => {
                console.error("Erro ao ouvir trainer:", error);
            }
        );

        return () => unsubscribe();
    }, [normalizedEmail]);

    useEffect(() => {
        if (!normalizedEmail) return;

        const hasChangesDocRef = doc(db, "hasChanges", normalizedEmail);
        let unsubscribe = null;

        async function loadPokemons() {
            try {
                const snap = await getDoc(hasChangesDocRef);
                const hasChanges = snap.exists() ? snap.data().hasChanges : true;

                if (!hasChanges) {
                    const cached = localStorage.getItem(`pokemons-${normalizedEmail}`);
                    if (cached) {
                        console.log("Usando cache local");
                        setPokemons(JSON.parse(cached));
                        return;
                    }
                }

                const q = query(
                    collection(db, "pokemon"),
                    where("trainer", "==", normalizedEmail)
                );

				console.log("Fetching pokemons...");
                unsubscribe = onSnapshot(
                    q,
                    (snapshot) => {
                        const found = snapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data()
                        })).sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

                        setPokemons(found);
                        localStorage.setItem(`pokemons-${normalizedEmail}`, JSON.stringify(found));
                    },
                    (error) => {
                        console.error("Erro ao ouvir pokemons:", error);
                    }
                );
            } catch (error) {
                console.error("Erro ao verificar hasChanges:", error);
            }
        }

        loadPokemons();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [normalizedEmail]);

	const handleReorder = (teamNumber, oldIndex, newIndex) => {
		setPokemons((prev) => {
			const updated = [...prev];
			const teamPokemons = updated.filter((p) => (p.team ?? 1) === teamNumber).sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
			const [moved] = teamPokemons.splice(oldIndex, 1);

			teamPokemons.splice(newIndex, 0, moved);
			teamPokemons.forEach((poke, i) => {
				poke.ordem = i;
			});

			const final = updated.map((p) => {
				if ((p.team ?? 1) === teamNumber) {
					return teamPokemons.find((tp) => tp.id === p.id);
				}
				return p;
			});

			Promise.all(
				teamPokemons.map((poke) =>
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

	const sortedTeamNumbers = Object.keys(groupedByTeam).map(Number).sort((a, b) => a - b);

	const handleAddTeam = () => {
		const maxTeamNumber = sortedTeamNumbers.length > 0 ? Math.max(...sortedTeamNumbers) : 0;
		const newTeamNumber = Math.max(...[...sortedTeamNumbers, ...extraTeams, maxTeamNumber]) + 1;
		setExtraTeams((prev) => [...prev, newTeamNumber]);
	};

	const handleImportFromShowDown = async () => {
		const pokemonList = await importTeamAlert(); // espera input do usuário
		if (pokemonList?.length > 0) {
			for (const pokemon of pokemonList) {
				while (pokemon.moves.length < 4) {
					pokemon.moves.push("");
				}

				const correctedPokemon = {
					trainer: normalizedEmail,
					species: pokemon.species,
					nickname: pokemon.nickname,
					level: pokemon.level,
					mainType: "normal",
					gender: pokemon.gender === "M" ? "male" : pokemon.gender === "F" ? "female" : "genderless",
					teraType: pokemon.teraType,
					ability: pokemon.ability,
					nature: pokemon.nature,
					team: Math.max(...[...sortedTeamNumbers, ...extraTeams, sortedTeamNumbers.length > 0 ? Math.max(...sortedTeamNumbers) : 0,]) + 1,
					heldItem: pokemon.item,
					moves: pokemon.moves,
					ivs: {
						HP: pokemon.ivs["HP"],
						Attack: pokemon.ivs["Atk"],
						Defense: pokemon.ivs["Def"],
						"S.Atk": pokemon.ivs["SpA"],
						"S.Def": pokemon.ivs["SpD"],
						Speed: pokemon.ivs["Spe"],
					},
					evs: {
						HP: pokemon.evs["HP"],
						Attack: pokemon.evs["Atk"],
						Defense: pokemon.evs["Def"],
						"S.Atk": pokemon.evs["SpA"],
						"S.Def": pokemon.evs["SpD"],
						Speed: pokemon.evs["Spe"],
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

				{sortedTeamNumbers.map((teamNumber) => (
					<PokemonTeam
						key={teamNumber}
						teamNumber={teamNumber}
						teamPokemons={groupedByTeam[teamNumber]}
						onReorder={(oldIndex, newIndex) =>
							handleReorder(teamNumber, oldIndex, newIndex)
						}
						setShowForm={setShowForm}
						showForm={showForm}
					>
						{groupedByTeam[teamNumber]?.sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)).map((poke) => (
							<PokemonButton
								key={poke.id}
								pokemon={poke}
								onClick={() => {
									if (currentPokemon?.id === poke.id) {
										setShowPokemonInfo((prev) => !prev);
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

				{extraTeams.map((teamNumber) => (
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
