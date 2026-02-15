export default function needSwitch(species, isThisAnSpecialCase) {
    isThisAnSpecialCase = isThisAnSpecialCase || false;
    switch (species.toLowerCase()) {
        case 'mimikyu':
            return 'https://pokeapi.co/api/v2/pokemon/mimikyu-disguised';
        default:
            return `https://pokeapi.co/api/v2/pokemon/${species}`;
    }
}