export const bondFormationData = {
  title: 'Bond Formation',
  instructions: 'Match atoms that can form chemical bonds together',

  atoms: [
    {
      id: 'sodium',
      symbol: 'Na',
      name: 'Sodium',
      electrons: 1,
      description: 'Alkali metal, 1 valence electron, wants to lose 1 electron',
      pairsWith: ['chlorine'],
      bondType: 'ionic',
    },
    {
      id: 'chlorine',
      symbol: 'Cl',
      name: 'Chlorine',
      electrons: 7,
      description: 'Halogen, 7 valence electrons, wants to gain 1 electron',
      pairsWith: ['sodium'],
      bondType: 'ionic',
    },
    {
      id: 'hydrogen1',
      symbol: 'H',
      name: 'Hydrogen',
      electrons: 1,
      description: 'Nonmetal, 1 valence electron, wants to share electrons',
      pairsWith: ['hydrogen2'],
      bondType: 'covalent',
    },
    {
      id: 'hydrogen2',
      symbol: 'H',
      name: 'Hydrogen',
      electrons: 1,
      description: 'Nonmetal, 1 valence electron, wants to share electrons',
      pairsWith: ['hydrogen1'],
      bondType: 'covalent',
    },
    {
      id: 'magnesium',
      symbol: 'Mg',
      name: 'Magnesium',
      electrons: 2,
      description: 'Alkaline earth metal, 2 valence electrons, wants to lose 2 electrons',
      pairsWith: ['oxygen'],
      bondType: 'ionic',
    },
    {
      id: 'oxygen',
      symbol: 'O',
      name: 'Oxygen',
      electrons: 6,
      description: 'Nonmetal, 6 valence electrons, wants to gain 2 electrons',
      pairsWith: ['magnesium'],
      bondType: 'ionic',
    },
    {
      id: 'carbon',
      symbol: 'C',
      name: 'Carbon',
      electrons: 4,
      description: 'Nonmetal, 4 valence electrons, wants to share electrons',
      pairsWith: ['oxygen2'],
      bondType: 'covalent',
    },
    {
      id: 'oxygen2',
      symbol: 'O',
      name: 'Oxygen',
      electrons: 6,
      description: 'Nonmetal, 6 valence electrons, wants to share electrons',
      pairsWith: ['carbon'],
      bondType: 'covalent',
    },
  ],

  pairs: [
    {
      id: 'nacl',
      atoms: ['sodium', 'chlorine'],
      compound: 'NaCl',
      name: 'Sodium Chloride (Table Salt)',
      bondType: 'Ionic Bond',
      explanation:
        'Sodium loses 1 electron to chlorine, forming Na⁺ and Cl⁻ ions that attract each other. This is an ionic bond formed by electron transfer.',
    },
    {
      id: 'h2',
      atoms: ['hydrogen1', 'hydrogen2'],
      compound: 'H₂',
      name: 'Hydrogen Gas',
      bondType: 'Covalent Bond',
      explanation:
        'Two hydrogen atoms share their electrons to form a stable molecule. This is a covalent bond formed by electron sharing.',
    },
    {
      id: 'mgo',
      atoms: ['magnesium', 'oxygen'],
      compound: 'MgO',
      name: 'Magnesium Oxide',
      bondType: 'Ionic Bond',
      explanation:
        'Magnesium loses 2 electrons to oxygen, forming Mg²⁺ and O²⁻ ions that attract each other. This is an ionic bond.',
    },
    {
      id: 'co2-partial',
      atoms: ['carbon', 'oxygen2'],
      compound: 'C=O',
      name: 'Carbon-Oxygen Bond',
      bondType: 'Covalent Bond',
      explanation:
        'Carbon and oxygen share electrons to form a double covalent bond. In CO₂, carbon forms double bonds with two oxygen atoms.',
    },
  ],

  successMessage:
    'Excellent work! You understand how atoms form bonds through electron transfer and sharing.',

  totalPairs: 4,
  passingScore: 3,
};
