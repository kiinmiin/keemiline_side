# Keemiline - Chemistry Education Web App

A mobile-first React web application for teaching chemical bonding through interactive mini-games.

## Getting Started

### Development Server
```bash
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build for Production
```bash
npm run build
npm run preview
```

## Features

### Current Implementation (v1.0)
- **Splash Screen**: Welcome screen with app introduction
- **Game Hub**: Menu showing all games with lock/unlock states
- **Game 1 - Bond Types Sorting**:
  - Drag and drop cards to categorize chemical bonds
  - Immediate visual feedback on correct/incorrect placements
  - Educational explanations for each item
  - Progress tracking with localStorage persistence
  - Sequential game unlocking system

### Game 1: Bond Types Sorting
Learn to distinguish between:
- **Chemical Bonds**: Ionic, Covalent, Metallic
- **Intermolecular Forces**: Hydrogen Bonds, Van der Waals Forces

**How to Play**:
1. Drag items from the "Available Items" deck
2. Drop them into the correct category
3. Receive instant feedback with explanations
4. Complete all items to see your score
5. Score 4/5 or better to unlock the next game

### Progress Tracking
- Completion status for each game
- Attempt counter
- Score tracking
- Persistent storage using localStorage
- Sequential unlock system (complete Game 1 to unlock Game 2, etc.)

## Tech Stack
- **Framework**: Vite + React
- **Routing**: React Router v6
- **Styling**: CSS Modules with mobile-first approach
- **State**: React Context API
- **Storage**: localStorage for progress persistence

## Project Structure
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # Layout components
│   └── navigation/      # Navigation screens
├── games/
│   └── BondTypesSorting/  # Game 1 implementation
├── context/             # React Context providers
├── hooks/               # Custom React hooks
└── utils/               # Utility functions
```

## Mobile Optimization
- Touch-friendly drag and drop (Pointer Events API)
- Minimum 44x44px tap targets
- Responsive layouts (320px - 1024px+)
- Prevented scrolling during drag operations
- Smooth animations and transitions

## Future Games (Planned)
- Game 2: Bond Formation Card Game
- Game 3: Concept Questions
- Game 4: Atomic Structure
- Game 5: Fill-in-the-Blank

## Browser Support
- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Development Notes
- Uses CSS variables for consistent theming
- Modular component architecture
- Custom drag-and-drop implementation (no external libraries)
- Progress data stored in localStorage key: `chemistryApp_progress`

## Testing Checklist
- [ ] Splash screen displays and navigates to hub
- [ ] Game 1 is unlocked, others are locked
- [ ] Drag and drop works on desktop
- [ ] Touch drag works on mobile
- [ ] Correct placements show green feedback
- [ ] Incorrect placements show red feedback with explanation
- [ ] All 5 items can be placed
- [ ] Completion screen shows correct score
- [ ] Game 2 unlocks after completing Game 1
- [ ] Progress persists after page reload

## License
Educational project for chemistry learning.
