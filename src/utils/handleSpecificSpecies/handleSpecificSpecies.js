const handleSpecificSpecies = (species, purpose) => {
  species = species.toLowerCase();
  if (species.includes('vivillon') && purpose !== 'nothing') {
    return 'vivillon';
  }
  else if (species.includes('mimikyu') && purpose !== 'nothing') {
    return 'mimikyu-disguised';
  }
  return species;
}

export default handleSpecificSpecies;