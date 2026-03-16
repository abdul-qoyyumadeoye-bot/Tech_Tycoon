// ============================================================================
// GAME STATE MANAGER
// Persists game state across page navigations using localStorage
// ============================================================================

class GameState {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem('techtycoon_game');
      return stored ? JSON.parse(stored) : this.getDefaultState();
    } catch {
      return this.getDefaultState();
    }
  }

  getDefaultState() {
    return {
      teamName: 'Techgrine',
      problemId: null,
      problem: null, // Full scenario object (NEW)
      role: null,
      teamMembers: [],
      stageIndex: 0,
      totalStages: 0,
      currentDay: 0,
      totalDays: 0,
      gameStatus: 'in-progress', // 'in-progress', 'complete', 'incomplete'
      scores: {
        impact: 50,
        inclusivity: 50,
        trust: 50,
        budget: 0
      },
      initialBudget: 0,
      choices: [],
      startTime: null,
      endTime: null
    };
  }

  save() {
    try {
      localStorage.setItem('techtycoon_game', JSON.stringify(this.data));
    } catch (e) {
      console.error('Error saving game state:', e);
    }
  }

  reset() {
    this.data = this.getDefaultState();
    this.save();
  }

  setTeamName(name) {
    this.data.teamName = name || 'Techgrine';
    this.save();
  }

  setProblem(problemId, scenarioObject = null) {
    this.data.problemId = problemId;
    this.data.problem = scenarioObject; // Store full scenario (NEW)
    this.save();
  }

  setRole(role) {
    this.data.role = role;
    this.save();
  }

  setTeamMembers(members) {
    this.data.teamMembers = members;
    this.save();
  }

  setTotalStages(count) {
    this.data.totalStages = count;
    this.save();
  }

  goToStage(index) {
    this.data.stageIndex = index;
    this.save();
  }

  applyChoiceEffects(effects) {
    // Core metrics are intentionally capped at 99 so a perfect 100 is impossible.
    this.data.scores.impact = Math.max(0, Math.min(99, this.data.scores.impact + (effects.impact || 0)));
    this.data.scores.inclusivity = Math.max(0, Math.min(99, this.data.scores.inclusivity + (effects.inclusivity || 0)));
    this.data.scores.trust = Math.max(0, Math.min(99, this.data.scores.trust + (effects.trust || 0)));
    this.data.scores.budget = Math.max(0, this.data.scores.budget + (effects.budget || 0));
    this.save();
  }

  recordChoice(stageId, choiceText, effects) {
    this.data.choices.push({
      stageId,
      choiceText,
      effects,
      timestamp: new Date().toISOString()
    });
    this.save();
  }

  startGame() {
    this.data.startTime = new Date().toISOString();
    this.save();
  }

  endGame(status = 'complete') {
    this.data.gameStatus = status; // 'complete' or 'incomplete'
    this.data.endTime = new Date().toISOString();
    this.save();
  }

  getDuration() {
    if (!this.data.startTime || !this.data.endTime) return 0;
    const start = new Date(this.data.startTime);
    const end = new Date(this.data.endTime);
    return Math.round((end - start) / 60000); // minutes
  }

  isGameOver() {
    return this.data.stageIndex >= this.data.totalStages;
  }


  getGameData() {
    return { ...this.data };
  }
}

// Create global game state instance
const gameState = new GameState();
