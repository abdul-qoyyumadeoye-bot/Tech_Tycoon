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
    // protect against accidental duplicate entries by id
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
      <input type="radio" name="problem" value="${problem.id}" style="position: absolute; top: 16px; right: 16px; width: 24px; height: 24px; cursor: pointer;">
      <div class="problem-theme">${problem.theme}</div>
      <h3 class="problem-title">${problem.title}</h3>
      <p class="problem-subinfo"><strong>Deadline:</strong> Day ${problem.totalDays} ${problem.launchDeadline ? `(${problem.launchDeadline})` : ''}</p>
      <p class="problem-description">${problem.projectBrief || ''}</p>
    </label>
  `).join('');

  // Add event listeners to update selected visual state
  document.querySelectorAll('.problem-card').forEach(card => {
    const input = card.querySelector('input[type="radio"]');
    input.addEventListener('change', () => {
      document.querySelectorAll('.problem-card').forEach(c => c.classList.remove('selected'));
      if (input.checked) {
        card.classList.add('selected');
      }
    });
  });
}

function updateContinueButton() {
  const selected = document.querySelector('input[name="problem"]:checked');
  const btn = document.getElementById('continue-btn');
  btn.disabled = !selected;
}

function selectProblem() {
  const selected = document.querySelector('input[name="problem"]:checked');
  if (!selected) return;

  // Find problem and store entire scenario object
  const problem = scenarios.find(p => p.id === selected.value);
  if (problem) {
    gameState.setProblem(selected.value, problem); // Pass full scenario (NEW)
    gameState.data.scores.budget = problem.startingBudget || 0;
    gameState.data.initialBudget = problem.startingBudget || 0;
    gameState.data.totalStages = problem.stages.length;
    gameState.data.currentDay = 0;
    gameState.data.totalDays = problem.totalDays || 0;
    gameState.save();
  }

  window.location.href = 'brief.html';
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadScenarios();
});
