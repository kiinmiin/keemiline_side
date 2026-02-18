export const bondTypesData = {
  title: 'Chemical Bond Types',
  instructions: 'Drag each item to the correct category',

  items: [
    {
      id: 'ionic',
      name: 'Ionic Bond',
      isChemicalBond: true,
      explanation:
        'Ionic bonds are chemical bonds formed when electrons are transferred from one atom to another, creating charged ions that attract each other.',
    },
    {
      id: 'covalent',
      name: 'Covalent Bond',
      isChemicalBond: true,
      explanation:
        'Covalent bonds are chemical bonds where atoms share electrons to achieve stable electron configurations.',
    },
    {
      id: 'metallic',
      name: 'Metallic Bond',
      isChemicalBond: true,
      explanation:
        'Metallic bonds are chemical bonds where electrons are shared among many atoms in a "sea of electrons," common in metals.',
    },
    {
      id: 'hydrogen',
      name: 'Hydrogen Bond',
      isChemicalBond: false,
      explanation:
        'Hydrogen bonds are intermolecular forces (not true chemical bonds) between molecules containing hydrogen and electronegative atoms.',
    },
    // {
    //   id: 'vanderwaals',
    //   name: 'Van der Waals Forces',
    //   isChemicalBond: false,
    //   explanation:
    //     'Van der Waals forces are weak intermolecular attractions (not chemical bonds) between molecules or parts of molecules.',
    // },
  ],

  zones: [
    { id: 'chemical', label: 'Chemical Bonds', accepts: true },
    { id: 'not-chemical', label: 'Not Chemical Bonds', accepts: false },
  ],

  successMessage: 'Great job! You correctly identified all chemical bonds.',

  // Scoring
  totalItems: 4,
  passingScore: 3, // Need 3/4 correct to pass
};
