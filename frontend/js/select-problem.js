// ============================================================================
// PROBLEM SELECTION PAGE
// Dynamically generates random scenarios using StageGenerator
// ============================================================================

let scenarios = [];

async function loadScenarios() {
  try {
    // Check URL for seed parameter (for testing/reproducibility)
    const urlParams = new URLSearchParams(window.location.search);
    const seed = urlParams.get('seed') ? parseInt(urlParams.get('seed')) : null;

    // Generate 5 different random scenarios
    scenarios = [];
    for (let i = 0; i < 5; i++) {
      // Each scenario gets a unique seed based on the main seed
      const scenarioSeed = seed !== null ? seed + i : null;
      const generator = new StageGenerator(scenarioSeed);
      const scenario = generator.generateScenario(`scenario-${i}`);
      scenarios.push(scenario);
    }

    if (scenarios.length === 0) {
      throw new Error('Failed to generate scenarios');
    }

    // render the generated list so the user can pick one
    renderProblems();
  } catch (e) {
    console.error('Error generating scenarios:', e);
    // Fallback: show error message
    const container = document.getElementById('problems-list');
    if (container) {
      container.innerHTML = '<p style="color: red;">Error generating scenarios. Please refresh the page.</p>';
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
      <p class="problem-subinfo"><strong>${problem.stages.length} decision day${problem.stages.length>1?'s':''}</strong></p>
      <p class="problem-description">${problem.objectives}</p>
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
    gameState.data.scores.budget = problem.initialBudget;
    gameState.data.initialBudget = problem.initialBudget;
    gameState.data.totalStages = problem.stages.length;
    gameState.save();
  }

  window.location.href = 'brief.html';
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadScenarios();
});
