// ============================================================================
// STAGE PAGE - Main Game Loop
// ============================================================================

let currentProblem = null;
let currentStage = null;

function getCurrentStage() {
  if (!currentProblem) return null;
  return currentProblem.stages[gameState.data.stageIndex] || null;
}

function getStageTime(stage) {
  return Number(stage?.time || 0);
}

function updateDeadlineStrip() {
  if (!currentProblem) return;
  const total = Number(currentProblem.totalDays || 0);
  const currentDay = Number(gameState.data.currentDay || 0);
  const remaining = Math.max(0, total - currentDay);
  const label = currentProblem.launchDeadline ? ` (${currentProblem.launchDeadline})` : '';

  const el = document.getElementById('deadline-strip');
  if (el) {
    el.textContent = `Launch Deadline: Day ${total}${label} | Current Day: Day ${currentDay} | Days Remaining: ${remaining}`;
  }
}

function renderStage() {
  currentProblem = gameState.data.problem;
  currentStage = getCurrentStage();

  if (!currentProblem) {
    window.location.href = 'select-problem.html';
    return;
  }

  if (!currentStage) {
    gameState.endGame('complete');
    window.location.href = 'results.html';
    return;
  }

  const stageNumber = gameState.data.stageIndex + 1;
  const stagePercent = Math.round((stageNumber / gameState.data.totalStages) * 100);
  document.getElementById('progress').style.width = stagePercent + '%';

  const stageTime = getStageTime(currentStage);
  const dayAfterChoice = gameState.data.currentDay + stageTime;
  const daysLeftAfterChoice = Math.max(0, (currentProblem.totalDays || 0) - dayAfterChoice);

  const html = `
    <div class="stage-header">
      <div class="stage-number">Stage ${stageNumber} of ${gameState.data.totalStages}</div>
      <h2 class="stage-title">${currentStage.title}</h2>
      <p class="stage-description">${currentStage.description}</p>
      <p style="margin-top: 8px; font-weight: 700;">This stage takes ${stageTime} day${stageTime !== 1 ? 's' : ''}.</p>
    </div>

    <div class="choices-grid">
      ${currentStage.choices.map((choice, idx) => `
        <button class="choice-card" onclick="makeChoice(${idx})">
          <div class="choice-text">${choice.text}</div>
          <div style="margin: 8px 0 10px 0; font-size: 13px; color: #374151;">
            Time Cost: ${stageTime} day${stageTime !== 1 ? 's' : ''} | Day After Choice: Day ${dayAfterChoice} | Days Remaining After Choice: ${daysLeftAfterChoice}
          </div>
          <div class="choice-impacts">
            ${Object.entries(choice.effects).map(([metric, value]) => {
              const label = metric.charAt(0).toUpperCase() + metric.slice(1);
              const badgeClass = value > 0 ? 'positive' : (value < 0 ? 'negative' : 'neutral');
              const sign = value > 0 ? '+' : '';
              const displayValue = metric === 'budget' ? `${sign}$${Math.abs(value).toLocaleString()}` : `${sign}${value}`;
              return `<div class="impact-badge ${badgeClass}">${label}: ${value < 0 && metric === 'budget' ? '-$' + Math.abs(value).toLocaleString() : displayValue}</div>`;
            }).join('')}
          </div>
        </button>
      `).join('')}
    </div>
  `;

  document.getElementById('stage-content').innerHTML = html;
  updateMetricsDisplay();
  updateDeadlineStrip();

  const prevBtn = document.getElementById('prev-btn');
  prevBtn.style.display = gameState.data.stageIndex > 0 ? 'block' : 'none';
}

function makeChoice(choiceIndex) {
  const choice = currentStage.choices[choiceIndex];
  if (!choice) return;

  const stageTime = getStageTime(currentStage);

  gameState.recordChoice(currentStage.id, choice.text, choice.effects);
  gameState.applyChoiceEffects(choice.effects);
  gameState.data.currentDay += stageTime;
  gameState.save();

  if (window.accessibility && accessibility.clickAudio) {
    accessibility.clickAudio.currentTime = 0;
    accessibility.clickAudio.play().catch(() => {});
  }

  const totalDays = Number(currentProblem.totalDays || 0);
  if (totalDays > 0 && gameState.data.currentDay >= totalDays) {
    gameState.endGame('time-up');
    window.location.href = 'results.html';
    return;
  }

  if (gameState.data.scores.budget <= 0) {
    gameState.endGame('incomplete');
    window.location.href = 'results.html';
    return;
  }

  gameState.goToStage(gameState.data.stageIndex + 1);
  renderStage();
}

function updateMetricsDisplay() {
  document.getElementById('impact-score').textContent = gameState.data.scores.impact;
  document.getElementById('inclusivity-score').textContent = gameState.data.scores.inclusivity;
  document.getElementById('trust-score').textContent = gameState.data.scores.trust;
  document.getElementById('budget-score').textContent = '$' + gameState.data.scores.budget.toLocaleString();
}

function prevStage() {
  if (gameState.data.stageIndex > 0) {
    gameState.goToStage(gameState.data.stageIndex - 1);
    const priorStage = currentProblem.stages[gameState.data.stageIndex];
    gameState.data.currentDay = Math.max(0, gameState.data.currentDay - getStageTime(priorStage));
    gameState.save();
    renderStage();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!gameState.data.problemId) {
    window.location.href = 'select-problem.html';
    return;
  }
  renderStage();
});
