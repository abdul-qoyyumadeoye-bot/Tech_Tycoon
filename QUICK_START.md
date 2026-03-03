# TechTycoon - Quick Start Guide

## 🚀 Getting Started

### Option 1: Play Now (No Setup Required)
1. Open `frontend/index.html` in your browser
2. That's it! The game works completely offline

### Option 2: Full Setup with Backend (Recommended for Schools)

#### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

#### Step 2: Start Backend Server
```bash
npm start
```
The server will run on `http://localhost:3000`

#### Step 3: Open the Game
Open `frontend/index.html` in your browser

---

## 📊 Game Overview

**Duration:** 20-30 minutes  
**Players:** Individual or small group  
**Age:** 13-18 years old

### Five Random Scenarios (randomised each session):
> You’ll be presented with a small subset of the total crisis library so that each play‑through feels fresh.
1. **🏥 The Accessibility Crisis** (45,000 budget) – Digital inclusion in education
2. **🔐 The Data Privacy Scandal** (52,000 budget) – GDPR & security  
3. **🎨 The UX Barrier Problem** (38,000 budget) – Inclusive design
4. **📱 Mobile App Meltdown** (40,000 budget) – Performance & scalability
5. **🤖 AI Ethics Dilemma** (50,000 budget) – Responsible algorithm design

> Five problems are shown each time; the available set is shuffled and budgets vary slightly. Add or edit scenarios in `scenarios-v2.json` and a different group will appear on each load.

Each scenario has **5 decision days** where students make choices that affect:
- **Impact** (how fast did you solve the problem?)
- **Inclusivity** (did you think about all users?)
- **Trust** (did stakeholders believe in you?)
- **Budget** (did you spend wisely?) 💷

---

## 🎮 How to Play

### Flow:
**Welcome → Choose Problem → Read Brief → Pick Role → Select Team → Play Through 5 Days → See Results**

### Key Rules:
- You must **select exactly 5 team members** from 9 specialists
- Each decision **changes your scores immediately** (shown as +/- badges)
- If your **budget reaches £0**, the game ends in a crisis
- Your **final scores** determine the outcome message

### Metrics:
- 📈 **Impact:** How effectively you solved the core problem (0-100)
- ❤️ **Inclusivity:** How well you included all users/stakeholders (0-100)
- 🤝 **Trust:** Whether people believed in your leadership (0-100)
- 💰 **Budget:** Money remaining in pounds (can go negative if you overspend)

---

##  ✨ Features

✅ **Multi-page app** - Separate screens for each game phase  
✅ **Random scenario selection** - Each playthrough loads a different crisis automatically  
✅ **Avatar-based UI** - Beautiful cards for roles & team selection  
✅ **Live metrics sidebar** - See scores update in real-time  
✅ **Accessibility features** - High contrast, large text, text-to-speech  
✅ **Save and export** - Results saved to backend + downloadable CSV  
✅ **Reflection questions** - Debrief and discuss after playing  

---

## 🎓 Educational Use

### Learning Objectives:
- Systems thinking (understanding interconnected consequences)
- Trade-off analysis (impact vs. budget, speed vs. quality)
- Stakeholder management (balancing different priorities)
- Ethical decision-making (inclusivity matters)
- Resource allocation (budget constraints)

### Classroom Activities:
1. **Individual Play:** Each student plays through once (20 min)
2. **Group Discussion:** Compare decisions and outcomes (10 min)
3. **Debate:** Discuss trade-offs in accessibility vs. speed (10 min)
4. **Reflection:** Journal about hardest decision (5 min)

---

## 🎨 Customizing the Game

### Change Budgets
Edit `frontend/data/scenarios-v2.json`, find `"initialBudget": 45000`, change the number

### Add New Scenarios
Duplicate a problem in `scenarios-v2.json` and modify:
- `id`: Unique identifier (no spaces)
- `title`: Problem name
- `theme`: Category  
- `briefDescription`: 1+ page explanation
- `objectives`: What players need to accomplish
- `initialBudget`: Starting amount
- `stages`: Array of 3-6 decision points

### Adjust Difficulty
Each choice has `"effects"` showing score changes:
```json
"effects": {
  "impact": 10,        // Higher = more effective solution
  "inclusivity": 8,    // Higher = better for all users
  "trust": 12,         // Higher = stakeholders believe you
  "budget": -5000      // Negative = costs money
}
```

---

## 🔧 Troubleshooting

**Game won't load**
- Make sure you opened `frontend/index.html` (not `index.html` in root)
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)

**Scenarios not showing**
- Check that `frontend/data/scenarios-v2.json` exists
- Open browser DevTools (F12) and check Console for errors

**Can't save results**
- Make sure backend is running: `npm start` in backend folder
- Check server is on localhost:3000
- CSV export always works as fallback

**Audio not playing**
- Audio requires user to click on page first (browser security)
- The game now plays a random ambient track (rustle, wind, or ocean) and a small click sound on every selection. Put your sound files in `frontend/audio/` named exactly `rustle.mp3`, `wind.mp3`, `ocean.mp3`, and `click.mp3`.
- Replace the empty placeholders with real clips (e.g. leaves rustling, wind blowing, ocean waves, iPhone‑style notification) to enable effect. If none are present the game remains silent.

---

## 📱 Device Support

✅ Desktop / Laptop (Best)  
✅ Tablet with keyboard (Good)  
⚠️  Mobile phone (Can work but small buttons)  

### Projector (Classroom) Tips:
- Use 125% zoom for better visibility
- Test high contrast mode on your projector
- All text sizes scale nicely without extra setup

---

## 🎓 Teachers: Discussion Questions

After students finish, ask:

1. **Decisions:** "Which choice was hardest and why?"
2. **Trade-offs:** "What did you sacrifice to save budget?"
3. **Inclusivity:** "Who did your decisions leave out?"
4. **Real-world:** "Do real companies face these dilemmas?"
5. **Ethics:** "Is it ever right to prioritize budget over inclusion?"

---

## 📊 Results & Reflection

After completing a scenario, students see:
- Final scores (Impact, Inclusivity, Trust, Budget)
- Custom outcome message based on their choices
- Personalized reflection questions
- Complete decision summary

### Export Options:
- **Save to Server:** Results saved permanently (requires backend)
- **Download CSV:** Excel-compatible spreadsheet
- **Play Again:** Reset scores and try a different scenario

---

## 🔐 Privacy & Data

### Frontend Only (No Backend):
- All data stored locally in your browser
- No personal info collected
- Nothing sent to any server
- Leave browser = data cleared

### With Backend:
- Results saved with unique game ID
- No personal data required (just team name)
- Stored on your localhost (not cloud)
- You control the data

---

## 📞 Support

**Something broken?**
1. Clear browser cache
2. Check browser console (F12) for error messages
3. Try a different browser
4. Reload the page

**Want to modify scenarios?**
- Edit `frontend/data/scenarios-v2.json`
- Reload browser to see changes

**Questions about classroom use?**
- See the full README.md for in-depth info
- All source code is readable and editable

---

## ⚡ Pro Tips

- **💾 Save often:** Use CSV export after each game to track results
- **📊 Compare scores:** Play all 3 scenarios and compare outcomes
- **🎯 Speedrun:** Try to finish with highest score and lowest budget
- **👥 Competitive mode:** Have teams compete on same scenario
- **📝 Journaling:** Have students write reflections after each stage
- **♿ Accessibility:** Test high-contrast and large-text modes

---

**Enjoy!** TechTycoon is designed to make ethical decision-making engaging and fun. Have students discuss real tech companies they know and the dilemmas they face.

Good luck with your game! 🚀
