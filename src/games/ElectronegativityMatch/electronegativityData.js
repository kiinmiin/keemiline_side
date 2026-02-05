export const electronegativityData = {
  title: 'Electronegativity Match',
  instructions: 'Match each element with its electronegativity value',

  elements: [
    {
      id: 'fluorine',
      symbol: 'F',
      name: 'Fluorine',
      electronegativity: 4.0,
      description: 'Most electronegative element',
    },
    {
      id: 'oxygen',
      symbol: 'O',
      name: 'Oxygen',
      electronegativity: 3.5,
      description: 'Second most electronegative element',
    },
    {
      id: 'nitrogen',
      symbol: 'N',
      name: 'Nitrogen',
      electronegativity: 3.0,
      description: 'Highly electronegative nonmetal',
    },
    {
      id: 'chlorine',
      symbol: 'Cl',
      name: 'Chlorine',
      electronegativity: 3.0,
      description: 'Electronegative halogen',
    },
    {
      id: 'carbon',
      symbol: 'C',
      name: 'Carbon',
      electronegativity: 2.5,
      description: 'Moderate electronegativity',
    },
    {
      id: 'hydrogen',
      symbol: 'H',
      name: 'Hydrogen',
      electronegativity: 2.1,
      description: 'Low electronegativity nonmetal',
    },
    {
      id: 'sodium',
      symbol: 'Na',
      name: 'Sodium',
      electronegativity: 0.9,
      description: 'Very low electronegativity metal',
    },
    {
      id: 'potassium',
      symbol: 'K',
      name: 'Potassium',
      electronegativity: 0.8,
      description: 'One of the least electronegative elements',
    },
  ],

  values: [
    { id: 'val_4.0', value: 4.0, display: '4.0' },
    { id: 'val_3.5', value: 3.5, display: '3.5' },
    { id: 'val_3.0a', value: 3.0, display: '3.0' },
    { id: 'val_3.0b', value: 3.0, display: '3.0' },
    { id: 'val_2.5', value: 2.5, display: '2.5' },
    { id: 'val_2.1', value: 2.1, display: '2.1' },
    { id: 'val_0.9', value: 0.9, display: '0.9' },
    { id: 'val_0.8', value: 0.8, display: '0.8' },
  ],

  successMessage: 'Excellent! You understand electronegativity values!',

  // Scoring
  totalItems: 8,
  passingScore: 6, // Need 6/8 correct to pass
};
