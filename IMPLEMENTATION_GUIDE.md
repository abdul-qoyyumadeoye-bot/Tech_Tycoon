# TechTycoon: Dynamic Scenario Generation Implementation Guide

## Overview

Your TechTycoon game now features **fully dynamic scenario generation** that creates unique, randomized challenges every time it's played, while maintaining a logical product lifecycle structure and supporting reproducible testing with seeded random generation.

---

## 🎮 How It Works

### Scenario Generation Process

1. **Stage Generator** (`stageGenerator.js`) creates scenarios using vanilla JavaScript
2. **Lifecycle Ordering**: Stages are organized as: Idea → Build → Launch → Crisis → Growth
3. **Random Selection**: Each playthrough:
   - Picks 5–7 random stages (varies by play)
   - Ensures **exactly 1 crisis stage** is included
   - Prevents duplicate stage types
   - Maintains logical flow

### Key Components

#### 1. **StageGenerator Class** (`frontend/js/stageGenerator.js`)
- **Constructor**: `new StageGenerator(seed)` 
  - `seed`: Optional number for reproducible scenarios (e.g., `12345`)
  - `null`: Generates random scenarios each time

- **Main Method**: `generateScenario()`
  - Returns a complete scenario object with 5–7 stages
  - Stages follow logical order: Idea → Build → Launch → Crisis → Growth
  - Each stage includes 2–3 decision options with score effects

#### 2. **Integrated with Game Flow**
- `select-problem.js` now uses the generator instead of loading static JSON
- Generates 5 different scenarios on the problem selection screen
- Players choose which scenario to play

#### 3. **How to Play Page** (`frontend/how-to-play.html`)
- Explains the game objective for 13–16 year olds
- Describes all four metrics (Impact, Inclusivity, Trust, Budget)
- Clarifies that there is no "right" answer
- Includes classroom discussion points
- Professional, engaging design

---

## 📊 Scenario Structure

### The Five Life Cycle Stages

#### **Idea Stage** (1–2 stages typical)
Founding decisions: vision, market, funding
- Example: "Defining Your Vision", "Choosing Your Market", "Securing Initial Funding"

#### **Build Stage** (1–2 stages typical)
Engineering decisions: team, tech stack, testing, security
- Example: "Building Your Engineering Team", "Choosing Your Tech Stack", "Early User Testing"

#### **Launch Stage** (0–2 stages typical)
Go-to-market decisions: beta, marketing, partnerships
- Example: "Launching Your Beta", "Your Launch Marketing Strategy", "Building Strategic Partnerships"

#### **Crisis Stage** (exactly 1, mandatory)
Emergency scenarios with high consequences
- Example: "Accessibility Crisis", "Data Security Breach", "AI Ethics & Algorithm Bias"

#### **Growth Stage** (0–2 stages typical)
Scaling decisions: hiring, expansion, sustainability
- Example: "Scaling Your Team", "International Expansion", "Sustainability & Social Responsibility"

### Ensuring Logical Flow

The generator:
1. Always starts with at least 1 **Idea** stage (setting the vision)
2. Always includes at least 1 **Build** stage (making the product)
3. Always includes exactly 1 **Crisis** stage (placed mid-game, not first or last)
4. Ensures **no duplicate stage types** within a playthrough
5. Optionally includes **Launch** and **Growth** stages to reach 5–7 total

---

## 🔐 Seeded Random for Testing & Reproducibility

### Why Seeded Random?

Seeded random allows **same scenario each time** when you pass the same seed. Perfect for:
- **Classroom consistency**: Teacher teaches class about one scenario multiple times
- **Testing**: Verify specific decision paths work correctly
- **Comparison exercises**: All students play the same challenge, then compare outcomes

### Using Seeded Scenarios

#### In the URL
```
http://localhost:3000/frontend/select-problem.html?seed=12345
```
- Replaces `12345` with any number
- Every time you open this URL, you get the exact same 5 scenarios
- Even each specific scenario seed: seed+0, seed+1, seed+2, etc.

#### In JavaScript (Direct Testing)
```javascript
const generator = new StageGenerator(12345);
const scenario = generator.generateScenario();
console.log(scenario);
```

### Teacher Use Case

**Example Workflow:**
1. Teacher decides on seed: `99887766`
2. Teacher creates this URL: 
   ```
   http://yourschool.edu/tech-tycoon/?seed=99887766
   ```
3. All student teams open this link
4. All get the same 5 scenario options to choose from
5. Even if they pick different ones, they can see how different choices lead to different paths

---

## 📈 Score Effects & Balancing

### Decision Score Ranges

Every decision affects four metrics:

| Metric | Range | Example Effects |
|--------|-------|-----------------|
| **Impact** | 4–14 | Fast implementation: +12, Slow but thorough: +8 |
| **Inclusivity** | 2–18 | Hire specialist: +16, Ignore feedback: +2 |
| **Trust** | -15–17 | Transparent crisis response: +15, Cover-up: -12 |
| **Budget** | -£25,000 to +£50,000 | Hire team: -£15,000, Gain partnership: +£15,000 |

### Design Principles

✅ **Balanced choices**: No option is universally "best"
✅ **Realistic trade-offs**: Speed costs money, inclusion takes time
✅ **Ethical weight**: Decisions that seem "profitable" may hurt trust/inclusivity
✅ **No extreme jumps**: Score changes are gradual and predictable

---

## 🔧 Customization & Extension

### Adding New Stages

1. Open `frontend/js/stageGenerator.js`
2. Find the method for the stage type (e.g., `getIdeaStages()`)
3. Add a new stage object to the array:

```javascript
{
  id: 'idea-new-stage',
  title: 'Your Stage Title',
  type: 'idea', // Must be: idea, build, launch, crisis, or growth
  description: 'Long description of the challenge...',
  choices: [
    {
      text: 'Option 1 description',
      effects: { impact: 10, inclusivity: 12, trust: 8, budget: -5000 }
    },
    {
      text: 'Option 2 description',
      effects: { impact: 12, inclusivity: 8, trust: 6, budget: -2000 }
    }
  ]
}
```

**Important**: Each stage must have its own unique `id`.

### Adding Crisis Scenarios

1. Find `getCrisisStages()` method
2. Add a new crisis scenario (same structure as above)
3. It will **automatically** be included in scenario generation

### Adjusting Difficulty

Change the seeded random range for stage count:

```javascript
// Currently: 5 + Math.floor(seededRandom() * 3) gives 5–7
// For harder (more decisions):
const numStages = 6 + Math.floor(seededRandom() * 3); // 6–8 stages

// For easier (fewer decisions):
const numStages = 4 + Math.floor(seededRandom() * 2); // 4–5 stages
```

---

## 🏃 Running the Game

### Quick Start (No Setup)

1. Open `frontend/index.html` in a browser
2. Click "📖 How to Play" to read rules
3. Click "Begin Scenario Selection"
4. Choose a team name, select a scenario, pick a role, assemble your team
5. Play through 5–7 randomly generated stages

### With Backend (Optional)

```bash
cd backend
npm install
npm start
```
Server runs on `http://localhost:3000`

### Seeded Scenarios (For Classes)

```
http://localhost:3000/frontend/select-problem.html?seed=12345
```

---

## 📄 File Structure

```
frontend/
├── index.html ........................ Welcome page with How to Play link
├── how-to-play.html .................. Rules & explanation (NEW)
├── select-problem.html ............... Scenario selection page
├── select-role.html .................. Role selection (5 options)
├── select-team.html .................. Team member selection (12 roles)
├── stage.html ........................ Game play page
├── js/
│   ├── stageGenerator.js ............. Dynamic scenario generator (NEW)
│   ├── select-problem.js ............. Updated to use generator
│   ├── gameState.js .................. Existing game state manager
│   ├── stage.js ...................... Existing stage progression
│   └── ...other files................
└── css/
    ├── base.css ...................... Existing styles
    └── avatars.css ................... Existing component styles
```

---

## 🎓 How to Use in the Classroom

### Scenario 1: Free-Form Gameplay (Every Play is Different)

**Setup:**
1. Teams play independently, no seed
2. Each playthrough generates unique scenarios
3. Promotes discussion about why different scenarios require different strategies

**Debrief:**
- "Which scenario was hardest?"
- "What decision would you change if you played again?"
- "How did your team handle the crisis stage?"

### Scenario 2: Controlled Comparison (Same Scenario, Different Decisions)

**Setup:**
1. Teacher uses a seed (e.g., `seed=2024`)
2. All teams play the same scenarios
3. Different teams make different choices

**Debrief:**
- Compare outcomes across teams
- "Team A prioritized speed, Team B prioritized inclusivity. What were the consequences?"
- "Did budget matter for any decision?"

### Scenario 3: Ethical Deep Dive (Specific Crisis)

**Setup:**
1. Use a seed that consistently generates a specific crisis (test beforehand)
2. Focus on one decision: "What's the right response?"
3. Have teams argue for different options

**Debrief:**
- Debate the ethics: "Was saving money worth losing trust?"
- Real-world connections: "How did real companies respond to similar crises?"

---

## 🔍 Technical Details

### Seeded Random Implementation

Uses **Linear Congruential Generator (LCG)** for reproducibility:

```javascript
// Math formula for deterministic randomness
const a = 1664525;
const c = 1013904223;
const m = 2147483648; // 2^31

seed = (a * seed + c) % m;
return seed / m; // 0.0 to 1.0
```

**Benefits:**
- ✅ No external libraries needed (vanilla JavaScript only)
- ✅ Same seed always produces same sequence
- ✅ Different seeds produce different sequences
- ✅ Lightweight and fast

### Stage Distribution Algorithm

1. **Determine total stages**: Random between 5 and 7
2. **Reserve 1 for crisis**: Must appear in scenario
3. **Distribute remaining** across Idea, Build, Launch, Growth
4. **Enforce minimums**: At least 1 Idea, at least 1 Build
5. **Insert crisis at middle**: Position 1 to (length-1) to avoid first/last
6. **Shuffle within categories**: Randomize order within each lifecycle phase

---

## ✅ Quality Assurance Checklist

### Testing New Stages

- [ ] Stage has unique `id`
- [ ] Stage has all 4 metrics in effect (no missing keys)
- [ ] Score effects are in reasonable ranges (nothing extreme)
- [ ] At least 2 choices, max 3 choices per stage
- [ ] Description clearly explains the challenge
- [ ] Choices are meaningfully different (not arbitrary)

### Testing Seeded Scenarios

- [ ] Use same seed multiple times → Get identical stages
- [ ] Use different seed → Get different stages
- [ ] Test URL parameter: `?seed=12345` works
- [ ] Crisis stage always appears exactly once
- [ ] No duplicate stage types in single playthrough
- [ ] Lifecycle order makes sense (Idea first, Crisis middle, Growth optional)

### Classroom Testing

- [ ] All 5 role options work
- [ ] All 12 team roles selectable
- [ ] "How to Play" page loads and is readable
- [ ] Score metrics update correctly as decisions are made
- [ ] Game ends when budget hits £0
- [ ] Results page shows all metrics
- [ ] Different scenarios feel meaningfully different

---

## 🐛 Troubleshooting

### Scenarios Not Generating

**Problem**: "Error generating scenarios" message
**Solution**: 
- Check browser console for errors (F12 → Console)
- Verify `stageGenerator.js` is loaded before `select-problem.js`
- Clear browser cache (Ctrl+F5)

### Seeded Scenarios Not Working

**Problem**: Same seed gives different scenarios
**Solution**:
- Ensure seed is passed correctly in URL: `?seed=12345`
- Seeds only work with the same code version (if you add stages, old seeds may differ)
- Try a fresh browser tab (no cache interference)

### Budget Goes Extremely Negative

**Problem**: Budget becomes very negative (e.g., -£200,000)
**Solution**:
- This is intentional—teaches budget management
- If too extreme, reduce `budget` effects in stage definitions
- Game ends automatically when budget reaches £0 during play

---

## 📚 Further Reading

- **Game Design**: Each decision intentionally has trade-offs; no "correct" path
- **Real-World Relevance**: Crisis types based on actual tech company incidents
- **Accessibility**: How to Play page uses plain language and clear structure
- **Metrics Philosophy**: Impact (speed), Inclusivity (fairness), Trust (honesty), Budget (resources)

---

## 🎉 You're Ready!

Your TechTycoon game now:

✅ Generates unique scenarios every playthrough
✅ Maintains logical product lifecycle structure
✅ Supports seeded reproduction for testing
✅ Includes a comprehensive "How to Play" page
✅ Works entirely offline with vanilla JavaScript
✅ Scales easily for classroom use (4–5 students per team)

**Happy teaching! 🚀**
