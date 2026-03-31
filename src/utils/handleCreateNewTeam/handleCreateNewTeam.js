import { addTeam } from "../../database/functions/addTeam";
import { getAuth } from "firebase/auth";

export default async function handleCreateNewTeam(teamsList, setTeamsList) {
    const user = getAuth().currentUser;

    if (!user) {
        console.error("Usuário não autenticado");
        return;
    }

    let biggestTeamNumber = 0;

    teamsList.forEach(team => {
        if (team.number > biggestTeamNumber) {
            biggestTeamNumber = team.number;
        }
    });

    const nextTeamNumber = biggestTeamNumber + 1;

    console.log("Próximo número do time:", nextTeamNumber);

    await addTeam(user.email, nextTeamNumber);
    setTeamsList(prev => [...prev, { number: nextTeamNumber }]);

    return nextTeamNumber;
}