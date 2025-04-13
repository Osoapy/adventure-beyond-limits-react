export default function getNatureEffect(nature) {
    // MAKING THE NATURE LOWERCASE
    nature = nature.toLowerCase();

    const natures = {
        "adamant": [2, 4],  // Attack+, Sp Atk-
        "bold": [3, 2],     // Defense+, Attack-
        "brave": [2, 6],    // Attack+, Speed-
        "calm": [5, 2],     // Sp Def+, Attack-
        "careful": [5, 4],  // Sp Def+, Sp Atk-
        "gentle": [5, 3],   // Sp Def+, Defense-
        "hardy": [0, 0],    // Neutral
        "hasty": [6, 3],    // Speed+, Defense-
        "impish": [3, 4],   // Defense+, Sp Atk-
        "jolly": [6, 4],    // Speed+, Sp Atk-
        "lax": [3, 5],      // Defense+, Sp Def-
        "lonely": [2, 3],   // Attack+, Defense-
        "mild": [4, 3],     // Sp Atk+, Defense-
        "modest": [4, 2],   // Sp Atk+, Attack-
        "naive": [6, 5],    // Speed+, Sp Def-
        "naughty": [2, 5],  // Attack+, Sp Def-
        "quiet": [4, 6],    // Sp Atk+, Speed-
        "quirky": [0, 0],   // Neutral
        "rash": [4, 5],     // Sp Atk+, Sp Def-
        "relaxed": [3, 6],  // Defense+, Speed-
        "sassy": [5, 6],    // Sp Def+, Speed-
        "serious": [0, 0],  // Neutral
        "timid": [6, 2]     // Speed+, Attack-
    };

    return natures[nature] || [0, 0]; // Returns 0 0 if the nature is not found
}