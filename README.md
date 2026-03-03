# TechTycoon Simulator - Complete Setup Guide

## Overview
TechTycoon is now a professional, multi-page educational game with backend persistence, detailed scenarios, avatar-based UI components, and comprehensive accessibility features.

## Project Structure

```
Tech-tycoon/
├── frontend/
│   ├── index.html                 # Welcome page
│   ├── brief.html                 # Problem brief/description
│   ├── select-problem.html        # Problem selection (large boxes)
│   ├── select-role.html           # Role selection (avatar cards)
│   ├── select-team.html           # Team member selection (avatar grid)
│   ├── stage.html                 # Game stages with sidebar metrics
│   ├── results.html               # Final results & reflection
│   ├── css/
│   │   ├── base.css               # Core styling for all pages
│   │   └── avatars.css            # Avatar & component styling
│   ├── js/
│   │   ├── gameState.js           # Game state management
│   │   ├── accessibility.js       # Accessibility features
│   │   ├── index.js               # Welcome page logic
│   │   ├── brief.js               # Brief page logic
│   │   ├── select-problem.js      # Problem selection logic
│   │   ├── select-role.js         # Role selection logic
│   │   ├── select-team.js         # Team selection logic
│   │   ├── stage.js               # Game loop & stage rendering
│   │   └── results.js             # Results & export logic
│   ├── data/
│   │   └── scenarios-v2.json      # 3 detailed scenarios, 5 stages each
│   └── audio/
│       └── ambient.mp3            # Ambient background audio (optional)
│
├── backend/
│   ├── server.js                  # Express server for result persistence
│   ├── package.json               # Dependencies
│   └── data/
│       ├── results-log.json       # Master results log
│       └── game_[id].json         # Individual game results
│
└── README.md                       # This file
```

## Features Implemented

### ✅ Multi-Page Application
- Separate HTML pages for each game phase
- Persistent game state using localStorage
- Clean navigation flow: Welcome → Brief → Problem → Role → Team → Stages → Results

### ✅ Detailed Scenarios (27 stages total)
Three complete crisis scenarios:
1. **The Accessibility Crisis** - Digital inclusion in education
2. **The Data Privacy Scandal** - GDPR compliance & security
3. **The UX Barrier Problem** - Inclusive design for diverse learners

Each with:
- Comprehensive brief (1+ page detailed)
- 5 interactive decision stages
- Dynamic budget (£38,000 - £52,000 depending on scenario)
- Reflection questions

### ✅ Avatar-Based UI
- **Problem Selection**: Large card format with hover/focus states
- **Role Selection**: Avatar cards with icon, name, and description
- **Team Selection**: 9 technical roles as avatar cards (choose exactly 5)
  - Frontend Engineer, Backend Engineer, UX Designer, QA Engineer, DevOps Engineer,Accessibility Specialist, Product Manager, Data Analyst, Security Analyst

### ✅ Game Mechanics
- **Score Tracking**: Impact, Inclusivity, Trust, Budget (£)
- **Visible Impact Badges**: Each choice shows score changes (+green/-red)
- **Budget Constraints**: Game ends if budget reaches £0 (crisis ending)
- **Live Metrics Sidebar**: Real-time score updates on game page
- **Progress Bar**: Visual indication of game progress

### ✅ Accessibility Features
- **High Contrast Mode**: Black background, white text, yellow highlights
- **Large Text Mode**: 18px base font with larger headings
- **Text-to-Speech**: Read page content aloud
- Settings persist across sessions

### ✅ Results & Export
- **Comprehensive Results Page**: Final scores, outcome messages, reflection questions
- **Decision Summary**: All choices with effects displayed
- **Save to Backend**: Results saved to server (requires running backend)
- **CSV Export**: Download results as spreadsheet

### ✅ Backend Server (Node.js/Express)
- Save game results with unique IDs
- Retrieve individual game results
- Export games as CSV
- Master results log in JSON

### ✅ High-Contrast Mode Fix
- Accessibility menu now visible in high-contrast mode
- Yellow button for accessibility toggle
- Clear contrast ratios WCAG AA compliant

## Quick Start

### 1. Frontend Only (No Backend)
```bash
# Open frontend/index.html in your browser
# Works completely offline - no server needed
# Results can be downloaded as CSV
```

### 2. Full Setup (With Backend)
```bash
# Install backend dependencies
cd backend
npm install

# Start backend server
npm start
# Server runs on http://localhost:3000

# Open frontend/index.html in your browser
# Results now auto-save to backend
```

## Game Flow

1. **Welcome** - Enter team name
2. **Select Scenario** - Choose from 3 problems
3. **Brief** - Read detailed problem description & objectives
4. **Select Role** - Choose Technical Lead or Design Lead
5. **Select Team** - Pick 5 team members from 9 specialists
6. **Game Stages** - Make decisions across 5 stages
   - Each choice has immediate score impacts
   - Track metrics in sidebar
   - Continue until all stages complete (or budget runs out)
7. **Results** - Review scores and reflection questions
   - Save results to backend
   - Download as CSV
   - Play again or exit

## Customizing Scenarios

Edit `frontend/data/scenarios-v2.json` to:
- Change budget amounts
- Modify stage descriptions
- Adjust score effects for each choice
- Add new problems or stages

Format for each choice:
```json
{
  "text": "Option text",
  "effects": {
    "impact": 10,        // -100 to +100
    "inclusivity": 15,   // -100 to +100
    "trust": 5,          // -100 to +100
    "budget": -8000      // Pounds (can be positive to gain budget)
  }
}
```

## Personalizing the Experience

### Colors & Theme
Edit CSS custom properties in `frontend/css/base.css`:
```css
:root {
  --primary-color: #3b82f6;     /* Change top nav & button colors */
  --success-color: #10b981;     /* Change save button color */
  --danger-color: #ef4444;      /* Change warning colors */
}
```

### Adding Background Music
1. Place an MP3 file at `frontend/audio/ambient.mp3`
2. File will auto-loop at 30% volume
3. Starts after first user click (respects browser autoplay policies)

Suggested audio:
- Free: Freepik, Pixabay, Zapsplat (search "ambient wind" or "rustling leaves")

## Testing Checklist

- [ ] Welcome page loads, team name input works
- [ ] Scenario is chosen at random when the game starts (no manual selection)
- [ ] Brief page displays detailed problem description
- [ ] Role selection shows 2 avatar cards
- [ ] Team selection requires exactly 5 members
- [ ] Game stages display correctly with metrics sidebar
- [ ] Score badges show on choices (green/red)
- [ ] Results page calculates scores correctly
- [ ] CSV download works
- [ ] High contrast mode makes content visible
- [ ] Large text mode increases all font sizes
- [ ] Text-to-speech button reads content aloud
- [ ] "Play Again" resets game properly

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 14+)
- IE: Not supported

## Accessibility Standards

- WCAG 2.1 AA compliant
- Keyboard navigation supported
- Screen reader friendly
- High contrast mode for low vision
- Large text option for readability
- Text-to-speech for audio learners

## Common Issues

**"Cannot find scenarios-v2.json"**
- Ensure the file is at `frontend/data/scenarios-v2.json`
- Check browser console for exact error path

**Backend results not saving**
- Make sure backend is running: `npm start` in backend folder
- Check that server is on localhost:3000
- CSV export still works offline as fallback

**Audio not playing**
  - Audio autoplay requires user interaction in modern browsers
  - Click on game content first, then audio will play
  - Some school networks block audio - provide MP3 option
  - Ambient sound files (rustle, wind, ocean) and click sound are stored in `frontend/audio`. Replace the placeholder `.mp3` files with real clips (e.g., leaf rustling, wind blowing, ocean tide, small notification) to enable background and decision effects.

## Educational Notes

TechTycoon is designed for:
- Ages 13-18
- Business/Tech/Ethics education
- 30-45 minute gameplay
- Group discussion after playing

Key learning objectives:
- Systems thinking
- Trade-off analysis
- Stakeholder management
- Ethical decision-making
- Resource allocation

## Credits

Made for The Manchester College Tech Education
Designed for classroom projection and groupdiscussion
2024 Edition - Multi-page Professional Build
