import { db } from '../firebase.js';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

export async function AddMoveToDatabase(moveName, db) {
  const moveId = moveName.toLowerCase().trim();
  const moveRef = doc(collection(db, 'moves'), moveId);

  const existingMove = await getDoc(moveRef);
  if (existingMove.exists()) {
    console.log('Movimento já existe no banco.');
    return;
  }

  // Busca os dados do movimento na PokéAPI
  const response = await fetch(`https://pokeapi.co/api/v2/move/${moveId}`);
  if (!response.ok) {
    console.error('Movimento não encontrado na PokéAPI.');
    return;
  }

  const data = await response.json();

  const moveData = {
    name: data.name,
    type: data.type.name,
    category: data.damage_class.name, // "status", "special" ou "physical"
    power: data.power ?? 0,
  };

  await setDoc(moveRef, moveData);
  console.log('Movimento adicionado com sucesso:', moveData);
}
