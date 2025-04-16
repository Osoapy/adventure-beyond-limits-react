import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { AddMoveToDatabase } from './src/database/AddMoves.js';

const firebaseConfig = {
    apiKey: "AIzaSyDSPuVOSl6qK0_masCfZIczpFuNesdWvLA",
    authDomain: "pokemonadventuresbeyondlimits.firebaseapp.com",
    projectId: "pokemonadventuresbeyondlimits",
    storageBucket: "pokemonadventuresbeyondlimits.firebasestorage.app",
    messagingSenderId: "1091974981674",
    appId: "1:1091974981674:web:f4e92002c20b2870c43b53"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchAndAddAllMoves() {
    let url = 'https://pokeapi.co/api/v2/move';  // URL inicial da PokéAPI para pegar os moves
    let next = true;  // Controle para saber se temos mais páginas de dados

    while (next) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Erro ao buscar dados da PokéAPI');
            }
            const data = await response.json();

            // Adiciona os movimentos ao Firestore
            for (const move of data.results) {
                const moveName = move.name;
                console.log(`Adicionando o movimento: ${moveName}`);
                await AddMoveToDatabase(moveName, db);
            }

            // Se houver uma próxima página, atualiza a URL para buscar
            if (data.next) {
                url = data.next; // Próxima página de dados
            } else {
                next = false; // Não há mais páginas, então saímos do loop
            }
        } catch (error) {
            console.error('Erro ao buscar os movimentos:', error);
            next = false;  // Em caso de erro, interrompemos o loop
        }
    }
}

// Chama a função para começar a buscar os moves
fetchAndAddAllMoves();
