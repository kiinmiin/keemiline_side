export const moleculeBuilderData = {
  title: 'Molecule Builder',
  instructions: 'Build molecules by selecting the correct atoms and bond types',

  molecules: [
    {
      id: 'water',
      name: 'Water',
      formula: 'H₂O',
      requiredAtoms: [
        { element: 'O', count: 1 },
        { element: 'H', count: 2 },
      ],
      bondType: 'covalent',
      structure: 'bent',
      hint: 'One oxygen atom bonds with two hydrogen atoms',
      explanation: 'Water has two O-H covalent bonds with a bent molecular geometry due to two lone pairs on oxygen.',
    },
    {
      id: 'methane',
      name: 'Methane',
      formula: 'CH₄',
      requiredAtoms: [
        { element: 'C', count: 1 },
        { element: 'H', count: 4 },
      ],
      bondType: 'covalent',
      structure: 'tetrahedral',
      hint: 'One carbon atom bonds with four hydrogen atoms',
      explanation: 'Methane has four C-H covalent bonds arranged in a tetrahedral shape.',
    },
    {
      id: 'ammonia',
      name: 'Ammonia',
      formula: 'NH₃',
      requiredAtoms: [
        { element: 'N', count: 1 },
        { element: 'H', count: 3 },
      ],
      bondType: 'covalent',
      structure: 'trigonal pyramidal',
      hint: 'One nitrogen atom bonds with three hydrogen atoms',
      explanation: 'Ammonia has three N-H covalent bonds with a trigonal pyramidal shape due to one lone pair on nitrogen.',
    },
    {
      id: 'carbonDioxide',
      name: 'Carbon Dioxide',
      formula: 'CO₂',
      requiredAtoms: [
        { element: 'C', count: 1 },
        { element: 'O', count: 2 },
      ],
      bondType: 'covalent',
      structure: 'linear',
      hint: 'One carbon atom double-bonds with two oxygen atoms',
      explanation: 'Carbon dioxide has two C=O double bonds arranged in a linear geometry.',
    },
    {
      id: 'hydrogenChloride',
      name: 'Hydrogen Chloride',
      formula: 'HCl',
      requiredAtoms: [
        { element: 'H', count: 1 },
        { element: 'Cl', count: 1 },
      ],
      bondType: 'covalent',
      structure: 'linear',
      hint: 'One hydrogen atom bonds with one chlorine atom',
      explanation: 'HCl is a diatomic molecule with one polar covalent bond.',
    },
    {
      id: 'sodiumChloride',
      name: 'Sodium Chloride',
      formula: 'NaCl',
      requiredAtoms: [
        { element: 'Na', count: 1 },
        { element: 'Cl', count: 1 },
      ],
      bondType: 'ionic',
      structure: 'ionic lattice',
      hint: 'Sodium loses an electron to chlorine',
      explanation: 'NaCl forms through ionic bonding where Na donates an electron to Cl.',
    },
  ],

  availableAtoms: [
    { id: 'H', symbol: 'H', name: 'Hydrogen', valence: 1 },
    { id: 'O', symbol: 'O', name: 'Oxygen', valence: 2 },
    { id: 'C', symbol: 'C', name: 'Carbon', valence: 4 },
    { id: 'N', symbol: 'N', name: 'Nitrogen', valence: 3 },
    { id: 'Cl', symbol: 'Cl', name: 'Chlorine', valence: 1 },
    { id: 'Na', symbol: 'Na', name: 'Sodium', valence: 1 },
  ],

  bondTypes: [
    { id: 'covalent', name: 'Covalent Bond', description: 'Atoms share electrons' },
    { id: 'ionic', name: 'Ionic Bond', description: 'Electron transfer between atoms' },
  ],

  successMessage: 'Excellent! You built all the molecules correctly!',

  // Scoring
  totalItems: 6,
  passingScore: 5, // Need 5/6 correct to pass
};
