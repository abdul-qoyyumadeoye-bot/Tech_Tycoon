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

function isTenseStage(stage) {
  const source = `${stage?.title || ""} ${stage?.description || ""}`.toLowerCase();
  return /(crisis|fault|issue|complaint|warning|breach|bias|security|unexpected)/.test(source);
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
    window.TechTycoonUI?.navigate('select-problem.html');
    return;
  }

  if (!currentStage) {
    gameState.endGame('complete');
    window.TechTycoonUI?.navigate('results.html');
    return;
  }

  const stageNumber = gameState.data.stageIndex + 1;
  const stagePercent = Math.round((stageNumber / gameState.data.totalStages) * 100);
  document.getElementById('progress').style.width = stagePercent + '%';

  const stageTime = getStageTime(currentStage);
  const dayAfterChoice = gameState.data.currentDay + stageTime;
  const daysLeftAfterChoice = Math.max(0, (currentProblem.totalDays || 0) - dayAfterChoice);
  const tense = isTenseStage(currentStage);

  const html = `
    <div class="stage-header ${tense ? 'stage-header--tense' : ''}">
      <div class="stage-number">Stage ${stageNumber} of ${gameState.data.totalStages}</div>
      <h2 class="stage-title">${currentStage.title}</h2>
      <p class="stage-description">${currentStage.description}</p>
      <p style="margin-top: 8px; font-weight: 700;">This stage takes ${stageTime} day${stageTime !== 1 ? 's' : ''}.</p>
    </div>

    <div class="choices-grid">
      ${currentStage.choices.map((choice, idx) => `
        <button class="choice-card" data-choice-index="${idx}">
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

  const stageContent = document.getElementById('stage-content');
  stageContent.innerHTML = html;
  updateMetricsDisplay();
  updateDeadlineStrip();
  window.TechTycoonUI?.revealElements(stageContent);

  stageContent.querySelectorAll('[data-choice-index]').forEach((button) => {
    button.addEventListener('click', () => makeChoice(Number(button.dataset.choiceIndex), button));
  });

  const prevBtn = document.getElementById('prev-btn');
  prevBtn.style.display = gameState.data.stageIndex > 0 ? 'block' : 'none';
}

async function makeChoice(choiceIndex, button) {
  const choice = currentStage.choices[choiceIndex];
  if (!choice) return;

  const previousScores = { ...gameState.data.scores };
  const stageTime = getStageTime(currentStage);
  const nextDay = gameState.data.currentDay + stageTime;
  const totalDays = Number(currentProblem.totalDays || 0);
  const daysRemaining = Math.max(0, totalDays - nextDay);
  const tense = isTenseStage(currentStage);

  button?.classList.add('selected');

  gameState.recordChoice(currentStage.id, choice.text, choice.effects);
  gameState.applyChoiceEffects(choice.effects);
  gameState.data.currentDay = nextDay;
  gameState.save();

  if (window.accessibility && accessibility.clickAudio) {
    accessibility.clickAudio.currentTime = 0;
    accessibility.clickAudio.play().catch(() => {});
  }

  updateMetricsDisplay(previousScores, choice.effects);
  showChoiceFeedback(choice.effects, tense, daysRemaining, button);

  if (daysRemaining <= 5) {
    window.TechTycoonUI?.showNotification({
      title: daysRemaining === 0 ? 'Deadline reached' : 'Deadline warning',
      message: `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining until launch.`,
      type: daysRemaining <= 2 ? 'danger' : 'warning'
    });
  }

  window.TechTycoonUI?.showDayOverlay({
    day: nextDay,
    remaining: daysRemaining,
    deadlineLabel: currentProblem.launchDeadline || `Day ${totalDays}`,
    tense
  });

  await wait(window.TechTycoonUI?.reducedMotion() ? 120 : 950);

  if (totalDays > 0 && gameState.data.currentDay >= totalDays) {
    gameState.endGame('time-up');
    window.TechTycoonUI?.navigate('results.html');
    return;
  }

  if (gameState.data.scores.budget <= 0) {
    gameState.endGame('incomplete');
    window.TechTycoonUI?.navigate('results.html');
    return;
  }

  window.TechTycoonUI?.showLoadingOverlay('Loading next stage');
  await wait(window.TechTycoonUI?.reducedMotion() ? 80 : (window.TechTycoonUI?.loadingDuration?.() || 12000));
  gameState.goToStage(gameState.data.stageIndex + 1);
  renderStage();
  window.TechTycoonUI?.hideLoadingOverlay?.();
}

function showChoiceFeedback(effects, tense, daysRemaining, button) {
  const strip = document.querySelector('.score-strip') || document.getElementById('stage-content');
  const target = button || strip;
  const deltas = [];

  ['impact', 'inclusivity', 'trust', 'budget'].forEach((metric) => {
    const value = Number(effects[metric] || 0);
    if (!value) return;
    deltas.push({
      label: metric,
      value: Math.abs(value),
      kind: value > 0 ? 'positive' : 'negative',
      currency: metric === 'budget'
    });
  });

  if (deltas.length) {
    window.TechTycoonUI?.showFloatingDelta(target, deltas);
  }

  const type = tense ? 'danger' : daysRemaining <= 5 ? 'warning' : 'success';
  const title = tense ? 'Crisis response logged' : 'Decision locked in';
  const message = `Day ${gameState.data.currentDay} complete. Budget remaining: ${window.TechTycoonUI?.formatCurrency(gameState.data.scores.budget) || ('$' + gameState.data.scores.budget.toLocaleString())}.`;
  window.TechTycoonUI?.showNotification({ title, message, type });
}

function updateMetricsDisplay(previousScores = null, effects = null) {
  const metrics = [
    { id: 'impact-score', value: gameState.data.scores.impact, currency: false },
    { id: 'inclusivity-score', value: gameState.data.scores.inclusivity, currency: false },
    { id: 'trust-score', value: gameState.data.scores.trust, currency: false },
    { id: 'budget-score', value: gameState.data.scores.budget, currency: true }
  ];

  metrics.forEach((metric) => {
    const el = document.getElementById(metric.id);
    if (!el) return;

    const previousValue = previousScores ? previousScores[metric.id.replace('-score', '')] : metric.value;
    el.dataset.value = String(previousValue);

    const pulse = effects
      ? ((metric.id === 'budget-score' ? effects.budget : effects[metric.id.replace('-score', '')]) > 0 ? 'positive' : ((metric.id === 'budget-score' ? effects.budget : effects[metric.id.replace('-score', '')]) < 0 ? 'negative' : 'neutral'))
      : 'neutral';

    window.TechTycoonUI?.animateValue(el, metric.value, {
      duration: metric.currency ? 0 : (window.TechTycoonUI?.reducedMotion() ? 0 : 520),
      formatter: metric.currency
        ? (value) => '$' + Math.round(value).toLocaleString()
        : (value) => String(Math.round(value)),
      pulseClass: pulse
    });
  });
}

function prevStage() {
  if (gameState.data.stageIndex > 0) {
    window.TechTycoonUI?.showLoadingOverlay('Loading previous stage');
    gameState.goToStage(gameState.data.stageIndex - 1);
    const priorStage = currentProblem.stages[gameState.data.stageIndex];
    gameState.data.currentDay = Math.max(0, gameState.data.currentDay - getStageTime(priorStage));
    gameState.save();
    renderStage();
    window.setTimeout(
      () => window.TechTycoonUI?.hideLoadingOverlay?.(),
      window.TechTycoonUI?.reducedMotion() ? 40 : (window.TechTycoonUI?.loadingDuration?.() || 12000)
    );
  }
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', () => {
  if (!gameState.data.problemId) {
    window.TechTycoonUI?.navigate('select-problem.html');
    return;
  }
  renderStage();
  const remaining = Math.max(0, Number(gameState.data.totalDays || 0) - Number(gameState.data.currentDay || 0));
  window.TechTycoonUI?.showDayOverlay({
    day: Number(gameState.data.currentDay || 0),
    remaining,
    deadlineLabel: currentProblem?.launchDeadline || `Day ${gameState.data.totalDays || 0}`,
    tense: isTenseStage(getCurrentStage())
  });
});

