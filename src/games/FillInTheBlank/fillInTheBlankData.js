export const fillInTheBlankData = {
  totalItems: 3,
  passingScore: 2,
  exercises: [
    {
      id: 'chemicalBonds',
      parts: [
        { type: 'text', textKey: 'games.fillInTheBlank.exercises.chemicalBonds.part1' },
        { type: 'blank', id: 'blank1' },
        { type: 'text', textKey: 'games.fillInTheBlank.exercises.chemicalBonds.part2' },
        { type: 'blank', id: 'blank2' },
        { type: 'text', textKey: 'games.fillInTheBlank.exercises.chemicalBonds.part3' },
      ],
      words: [
        { id: 'betweenAtoms', textKey: 'games.fillInTheBlank.words.betweenAtoms' },
        { id: 'together', textKey: 'games.fillInTheBlank.words.together' },
        { id: 'evaporates', textKey: 'games.fillInTheBlank.words.evaporates' },
      ],
      answers: {
        blank1: 'betweenAtoms',
        blank2: 'together',
      },
    },
    {
      id: 'ionicBond',
      parts: [
        { type: 'text', textKey: 'games.fillInTheBlank.exercises.ionicBond.part1' },
        { type: 'blank', id: 'blank1' },
        { type: 'text', textKey: 'games.fillInTheBlank.exercises.ionicBond.part2' },
        { type: 'blank', id: 'blank2' },
        { type: 'text', textKey: 'games.fillInTheBlank.exercises.ionicBond.part3' },
      ],
      words: [
        { id: 'moves', textKey: 'games.fillInTheBlank.words.moves' },
        { id: 'toAnother', textKey: 'games.fillInTheBlank.words.toAnother' },
        { id: 'shines', textKey: 'games.fillInTheBlank.words.shines' },
      ],
      answers: {
        blank1: 'moves',
        blank2: 'toAnother',
      },
    },
    {
      id: 'covalentBond',
      parts: [
        { type: 'text', textKey: 'games.fillInTheBlank.exercises.covalentBond.part1' },
        { type: 'blank', id: 'blank1' },
        { type: 'text', textKey: 'games.fillInTheBlank.exercises.covalentBond.part2' },
        { type: 'blank', id: 'blank2' },
        { type: 'text', textKey: 'games.fillInTheBlank.exercises.covalentBond.part3' },
      ],
      words: [
        { id: 'share', textKey: 'games.fillInTheBlank.words.share' },
        { id: 'stability', textKey: 'games.fillInTheBlank.words.stability' },
        { id: 'runAway', textKey: 'games.fillInTheBlank.words.runAway' },
      ],
      answers: {
        blank1: 'share',
        blank2: 'stability',
      },
    },
  ],
};
