// ============================================================================
// STAGE PAGE - Main Game Loop
// ============================================================================

let currentProblem = null;
let currentStage = null;

// helper: format current stage as a "day" (optional real date)
function formatDayLabel(stageNumber) {
  let label = `Day ${stageNumber}`;
  if (gameState.data.startTime) {
    const start = new Date(gameState.data.startTime);
    const date = new Date(start);
    date.setDate(start.getDate() + stageNumber - 1);
    const opts = { month: 'short', day: 'numeric' };
    label += ` (${date.toLocaleDateString(undefined, opts)})`;
  }
  return label;
}

function getCurrentStage() {
  if (!currentProblem) return null;
  return currentProblem.stages[gameState.data.stageIndex] || null;
}

// helper: determine whether any choice can be afforded with current budget
function budgetSufficientForStage(stage) {
  const currentBudget = gameState.data.scores.budget;
  return stage.choices.some(choice => currentBudget + choice.effects.budget >= 0);
}

function renderStage() {
  // Use the stored scenario from gameState (set when scenario was selected)
  currentProblem = gameState.data.problem;
  currentStage = getCurrentStage();

  // crash-safety: if the saved scenario somehow lost its crisis stage, insert one
  if (currentProblem && !currentProblem.stages.some(s => s.type === 'crisis')) {
    console.warn('No crisis stage detected in saved scenario; inserting one now.');
    const generator = new StageGenerator(currentProblem.seed || null);
    const crisisStage = generator.pickRandom(generator.getCrisisStages());
    const pos = Math.floor(currentProblem.stages.length / 2) || 1;
    currentProblem.stages.splice(pos, 0, crisisStage);
    gameState.save();
    currentStage = getCurrentStage();
  }

  if (!currentStage) {
    // Game complete
    window.location.href = 'results.html';
    return;
  }

  // if budget is already too low to pick any option, abort early
  if (!budgetSufficientForStage(currentStage)) {
    gameState.endGame('incomplete');
    window.location.href = 'results.html';
    return;
  }

  const stageNumber = gameState.data.stageIndex + 1;
  const stagePercent = Math.round((stageNumber / gameState.data.totalStages) * 100);
  document.getElementById('progress').style.width = stagePercent + '%';

  // convert label to a day-style representation
  const dayLabel = formatDayLabel(stageNumber);

  // no budget crisis feature any longer; continue as normal


  const crisisBanner = currentStage.type === 'crisis'
    ? '<div class="crisis-badge">⚠️ CRISIS</div>'
    : '';

  const html = `
    <div class="stage-header">
      <div class="stage-number">${dayLabel} of ${gameState.data.totalStages}</div>
      <h2 class="stage-title">${currentStage.title}</h2>
      ${crisisBanner}
      <p class="stage-description">${currentStage.description}</p>
    </div>

    <div class="choices-grid">
      ${currentStage.choices.map((choice, idx) => `
        <button class="choice-card" onclick="makeChoice(${idx})">
          <div class="choice-text">${choice.text}</div>
          <div class="choice-impacts">
            ${Object.entries(choice.effects).map(([metric, value]) => {
              const label = metric.charAt(0).toUpperCase() + metric.slice(1);
              const badgeClass = value > 0 ? 'positive' : 'negative';
              const sign = value > 0 ? '+' : '';
              return `<div class="impact-badge ${badgeClass}">${sign}${value} ${label}</div>`;
            }).join('')}
          </div>
        </button>
      `).join('')}
    </div>
  `;

  document.getElementById('stage-content').innerHTML = html;

  // Update metrics display
  updateMetricsDisplay();

  // Update navigation buttons
  const prevBtn = document.getElementById('prev-btn');
  prevBtn.style.display = gameState.data.stageIndex > 0 ? 'block' : 'none';

  const nextBtn = document.getElementById('next-btn');
  nextBtn.disabled = true;
  nextBtn.textContent = stageNumber >= gameState.data.totalStages ? 'See Results' : 'Continue';
}

function makeChoice(choiceIndex) {
  const choice = currentStage.choices[choiceIndex];
  
  if (!choice) return;

  // Record the choice
  gameState.recordChoice(currentStage.id, choice.text, choice.effects);
  
  // play click sound if available
  if (window.accessibility && accessibility.clickAudio) {
    accessibility.clickAudio.currentTime = 0;
    accessibility.clickAudio.play().catch(() => {});
  }

  // Apply effects
  gameState.applyChoiceEffects(choice.effects);

  // Check if budget has hit zero or below
  if (gameState.data.scores.budget <= 0) {
    gameState.endGame('incomplete');
    window.location.href = 'results.html';
    return;
  }

  // Move to next stage
  gameState.goToStage(gameState.data.stageIndex + 1);

  // Render next stage normally
  renderStage();
}

function updateMetricsDisplay() {
  document.getElementById('impact-score').textContent = gameState.data.scores.impact;
  document.getElementById('inclusivity-score').textContent = gameState.data.scores.inclusivity;
  document.getElementById('trust-score').textContent = gameState.data.scores.trust;
  document.getElementById('budget-score').textContent = '£' + gameState.data.scores.budget.toLocaleString();
}


function prevStage() {
  if (gameState.data.stageIndex > 0) {
    gameState.goToStage(gameState.data.stageIndex - 1);
    renderStage();
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  if (!gameState.data.problemId) {
    window.location.href = 'select-problem.html';
    return;
  }

  renderStage();
});
