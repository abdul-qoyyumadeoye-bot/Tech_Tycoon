// ============================================================================
// PROBLEM SELECTION PAGE
// Loads fixed scenarios from data/scenarios.json
// ============================================================================

let scenarios = [];

async function loadScenarios() {
  try {
    const response = await fetch('../data/scenarios.json');
    const data = await response.json();
    const problems = Array.isArray(data.problems) ? data.problems : [];
    const uniqueById = new Map();
    problems.forEach((p) => {
      if (p && p.id && !uniqueById.has(p.id)) uniqueById.set(p.id, p);
    });
    scenarios = Array.from(uniqueById.values());
    if (scenarios.length === 0) throw new Error('No scenarios found in data/scenarios.json');
    renderProblems();
  } catch (e) {
    console.error('Error loading scenarios:', e);
    const container = document.getElementById('problems-list');
    if (container) {
      container.innerHTML = '<p style="color: red;">Error loading scenarios. Please refresh the page.</p>';
    }
  }
}

function renderProblems() {
  const container = document.getElementById('problems-list');

  container.innerHTML = scenarios.map(problem => `
    <label class="problem-card" onclick="updateContinueButton()">
      <input type="radio" name="problem" value="${problem.id}" aria-label="Select ${problem.title}">
      <div>
        <div class="problem-theme">${problem.theme}</div>
        <h3 class="problem-title">${problem.title}</h3>
        <p class="problem-description">${problem.projectBrief || ''}</p>
      </div>
      <div class="problem-stat-row">
        <div class="problem-stat-chip"><span>Deadline</span><strong>Day ${problem.totalDays}</strong></div>
        <div class="problem-stat-chip"><span>Budget</span><strong>$${(problem.startingBudget || 0).toLocaleString()}</strong></div>
        <div class="problem-stat-chip"><span>Stages</span><strong>${problem.stages?.length || 0}</strong></div>
      </div>
      <p class="problem-subinfo"><strong>Launch:</strong> ${problem.launchDeadline || 'TBC'}</p>
    </label>
  `).join('');

  document.querySelectorAll('.problem-card').forEach(card => {
    const input = card.querySelector('input[type="radio"]');
    input.addEventListener('change', () => {
      document.querySelectorAll('.problem-card').forEach(c => c.classList.remove('selected'));
      if (input.checked) {
        card.classList.add('selected');
      }
    });
  });

  window.TechTycoonUI?.revealElements(container);
}

function updateContinueButton() {
  const selected = document.querySelector('input[name="problem"]:checked');
  const btn = document.getElementById('continue-btn');
  btn.disabled = !selected;
}

function selectProblem() {
  const selected = document.querySelector('input[name="problem"]:checked');
  if (!selected) return;

  const problem = scenarios.find(p => p.id === selected.value);
  if (problem) {
    gameState.setProblem(selected.value, problem);
    gameState.data.scores = {
      impact: 50,
      inclusivity: 50,
      trust: 50,
      budget: problem.startingBudget || 0
    };
    gameState.data.initialBudget = problem.startingBudget || 0;
    gameState.data.totalStages = problem.stages.length;
    gameState.data.currentDay = 0;
    gameState.data.totalDays = problem.totalDays || 0;
    gameState.save();
    window.TechTycoonUI?.showNotification({
      title: 'Scenario locked',
      message: `${problem.title} selected. Budget: $${(problem.startingBudget || 0).toLocaleString()}.`,
      type: 'info'
    });
  }

  window.TechTycoonUI?.navigate('brief.html') || (window.location.href = 'brief.html');
}

document.addEventListener('DOMContentLoaded', () => {
  loadScenarios();
});
