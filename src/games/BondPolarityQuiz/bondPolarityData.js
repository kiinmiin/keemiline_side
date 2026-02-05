export const bondPolarityData = {
  title: 'Bond Polarity Quiz',
  instructions: 'Determine if each bond is polar or nonpolar based on electronegativity difference',

  bonds: [
    {
      id: 'h2',
      atoms: ['H', 'H'],
      formula: 'H-H',
      isPolar: false,
      electronegativityDiff: 0,
      explanation: 'Two identical atoms have no electronegativity difference, so the bond is nonpolar.',
    },
    {
      id: 'hcl',
      atoms: ['H', 'Cl'],
      formula: 'H-Cl',
      isPolar: true,
      electronegativityDiff: 0.9,
      explanation: 'Chlorine (3.0) is more electronegative than hydrogen (2.1), creating a polar bond.',
    },
    {
      id: 'nacl',
      atoms: ['Na', 'Cl'],
      formula: 'Na-Cl',
      isPolar: true,
      electronegativityDiff: 2.1,
      explanation: 'Large electronegativity difference (2.1) creates a highly polar/ionic bond.',
    },
    {
      id: 'o2',
      atoms: ['O', 'O'],
      formula: 'O=O',
      isPolar: false,
      electronegativityDiff: 0,
      explanation: 'Identical atoms share electrons equally, resulting in a nonpolar bond.',
    },
    {
      id: 'h2o',
      atoms: ['O', 'H'],
      formula: 'O-H',
      isPolar: true,
      electronegativityDiff: 1.4,
      explanation: 'Oxygen (3.5) is more electronegative than hydrogen (2.1), making O-H bonds polar.',
    },
    {
      id: 'co2_co',
      atoms: ['C', 'O'],
      formula: 'C=O',
      isPolar: true,
      electronegativityDiff: 1.0,
      explanation: 'Oxygen (3.5) is more electronegative than carbon (2.5), creating polar C=O bonds.',
    },
    {
      id: 'n2',
      atoms: ['N', 'N'],
      formula: 'N≡N',
      isPolar: false,
      electronegativityDiff: 0,
      explanation: 'Two nitrogen atoms share electrons equally in a nonpolar triple bond.',
    },
    {
      id: 'ch',
      atoms: ['C', 'H'],
      formula: 'C-H',
      isPolar: false,
      electronegativityDiff: 0.4,
      explanation: 'Small electronegativity difference (0.4) makes C-H bonds essentially nonpolar.',
    },
    {
      id: 'nh',
      atoms: ['N', 'H'],
      formula: 'N-H',
      isPolar: true,
      electronegativityDiff: 0.9,
      explanation: 'Nitrogen (3.0) is more electronegative than hydrogen (2.1), creating polar bonds.',
    },
    {
      id: 'cl2',
      atoms: ['Cl', 'Cl'],
      formula: 'Cl-Cl',
      isPolar: false,
      electronegativityDiff: 0,
      explanation: 'Two chlorine atoms share electrons equally in a nonpolar bond.',
    },
  ],

  categories: [
    { id: 'polar', label: 'Polar Bonds', accepts: true },
    { id: 'nonpolar', label: 'Nonpolar Bonds', accepts: false },
  ],

  successMessage: 'Great job! You understand bond polarity!',

  // Scoring
  totalItems: 10,
  passingScore: 8, // Need 8/10 correct to pass
};
