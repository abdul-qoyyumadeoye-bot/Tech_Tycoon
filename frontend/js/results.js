// ============================================================================
// RESULTS PAGE
// ============================================================================

function renderResults() {
  const problem = gameState.data.problem;
  if (!problem) {
    alert('Problem not found');
    return;
  }

  const message = generateResultsMessage();
  document.getElementById('results-message').innerHTML = message;

  const reprimands = generateReprimands();
  if (reprimands.length > 0) {
    const reprimandHtml = '<div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin-top: 16px; border-radius: 16px;"><strong style="color: #dc2626;">Areas of Concern</strong><ul style="margin-top: 8px; padding-left: 20px;">' + reprimands.map(r => `<li>${r}</li>`).join('') + '</ul></div>';
    document.getElementById('results-message').innerHTML += reprimandHtml;
  }

  const reflectionQuestions = generateReflectionQuestions();
  const questionsHtml = reflectionQuestions.map(q => `<li>${q}</li>`).join('');
  document.getElementById('reflection-questions').innerHTML = questionsHtml;

  renderAchievements();
  renderDecisionsSummary();
  animateFinalScores();
  revealResultBlocks();
}

function animateFinalScores() {
  const metrics = [
    { id: 'final-impact', value: gameState.data.scores.impact, currency: false },
    { id: 'final-inclusivity', value: gameState.data.scores.inclusivity, currency: false },
    { id: 'final-trust', value: gameState.data.scores.trust, currency: false },
    { id: 'final-budget', value: gameState.data.scores.budget, currency: true }
  ];

  metrics.forEach((metric) => {
    const el = document.getElementById(metric.id);
    if (!el) return;
    el.dataset.value = '0';
    window.TechTycoonUI?.animateValue(el, metric.value, {
      duration: metric.currency ? 0 : (window.TechTycoonUI?.reducedMotion() ? 0 : 700),
      formatter: metric.currency ? (value) => '$' + Math.round(value).toLocaleString() : (value) => String(Math.round(value)),
      pulseClass: metric.currency ? 'neutral' : 'positive'
    });
  });
}

function revealResultBlocks() {
  const blocks = document.querySelectorAll('.results-block');
  window.TechTycoonUI?.revealSequence(blocks, 120);
}

function renderAchievements() {
  const container = document.getElementById('results-badges');
  if (!container) return;

  const { impact, inclusivity, trust, budget } = gameState.data.scores;
  const badges = [];

  if (impact >= 70) badges.push('Impact Driver');
  if (inclusivity >= 70) badges.push('Inclusive Builder');
  if (trust >= 70) badges.push('Trust Keeper');
  if (budget > gameState.data.initialBudget * 0.35) badges.push('Runway Manager');
  if (gameState.data.gameStatus === 'complete') badges.push('Launch Ready');
  if (gameState.data.gameStatus === 'time-up') badges.push('Deadline Pressure');
  if (!badges.length) badges.push('Hard Lessons Learned');

  container.innerHTML = badges.map((badge) => `<div class="results-badge">${badge}</div>`).join('');
}

function generateResultsMessage() {
  const problem = gameState.data.problem;
  const { impact, inclusivity, trust, budget } = gameState.data.scores;
  const average = (impact + inclusivity + trust) / 3;

  let message = '';

  if (gameState.data.gameStatus === 'time-up') {
    const totalDays = gameState.data.totalDays || (problem?.totalDays || 0);
    const currentDay = gameState.data.currentDay || 0;
    const overtime = Math.max(0, currentDay - totalDays);
    message = `<strong>Time Up: Project Closed</strong><br>
    Deadline was Day ${totalDays}${problem?.launchDeadline ? ` (${problem.launchDeadline})` : ''}. Your team reached Day ${currentDay}.${overtime > 0 ? ` You were ${overtime} day${overtime !== 1 ? 's' : ''} late.` : ''}<br>
    Final status: Impact ${impact}, Inclusivity ${inclusivity}, Trust ${trust}, Budget $${budget.toLocaleString()}.<br>
    The launch window ended before you could continue, so the project has been closed.`;
  } else if (gameState.data.gameStatus === 'incomplete') {
    message = `<strong>Project Incomplete:</strong> Your team ran out of budget before completing all planned work. Despite your efforts to deliver impact (Impact: ${impact}), maintain inclusivity (Inclusivity: ${inclusivity}), and preserve stakeholder trust (Trust: ${trust}), financial constraints forced the project to halt.`;
  } else if (average >= 75 && trust >= 70 && budget > 0) {
    message = `<strong>Excellent Leadership:</strong> Your team navigated this crisis with remarkable balance. You prioritized inclusive solutions (Inclusivity: ${inclusivity}), maintained strong stakeholder relationships (Trust: ${trust}), and delivered real impact (Impact: ${impact}). Schools and advocacy groups are praising your commitment to do the right thing. You've emerged stronger.`;
  } else if (average >= 55 && trust >= 50 && budget > 0) {
    message = `<strong>Solid Crisis Management:</strong> You made reasonable trade-offs and kept your team together. Impact: ${impact}, Inclusivity: ${inclusivity}, Trust: ${trust}. While not perfect, you demonstrated thoughtful decision-making under pressure. There's room to improve, but you prevented disaster.`;
  } else {
    message = `<strong>Difficult Choices:</strong> You faced impossible trade-offs. Your scores (Impact: ${impact}, Inclusivity: ${inclusivity}, Trust: ${trust}) reflect the painful reality that every choice had costs. Perhaps some problems have no perfect answer, only different ways to struggle.`;
  }

  return message;
}

function generateReprimands() {
  const { impact, inclusivity, trust } = gameState.data.scores;
  const reprimands = [];

  if (impact < 40) {
    reprimands.push('<strong>Low Impact:</strong> You failed to deliver meaningful solutions to the core problem. Whatever you attempted, it was not enough to create real change.');
  }

  if (inclusivity < 40) {
    reprimands.push('<strong>Low Inclusivity:</strong> Your approach excluded significant portions of your user base or stakeholder community.');
  }

  if (trust < 40) {
    reprimands.push('<strong>Low Trust:</strong> Your stakeholders do not believe in your leadership or your solutions.');
  }

  return reprimands;
}

function generateReflectionQuestions() {
  const { impact, inclusivity, trust, budget } = gameState.data.scores;
  const questions = [];

  if (gameState.data.gameStatus === 'incomplete') {
    questions.push('Looking back, where did you prioritize spending? Which decisions cost the most?');
    questions.push('If you could go back, how would you allocate your budget differently?');
    questions.push('What would have happened if you had made more conservative choices earlier?');
    questions.push('What does it feel like to fail due to resource constraints rather than poor leadership?');
    return questions;
  }

  if (inclusivity < 50) {
    questions.push('Whose needs got left behind in your decisions? How might you have prioritized inclusivity differently?');
  } else {
    questions.push('What choices did you make specifically to center inclusivity? How did that affect your other metrics?');
  }

  if (trust < 50) {
    questions.push('How did transparency factor into your decisions? What would have been needed to restore public trust?');
  } else {
    questions.push('Which decisions helped maintain stakeholder trust? Why was that important to preserve?');
  }

  if (impact < 50) {
    questions.push('Did you focus too much on process and not enough on solving the core problem? How might you have moved faster?');
  } else {
    questions.push('How did you balance speed with quality? What kept you focused on delivering real results?');
  }

  if (budget < 0) {
    questions.push('Looking back, where did you overspend? Which solutions were not worth the cost?');
  } else if (budget > gameState.data.initialBudget * 0.5) {
    questions.push('Why did you spend conservatively? Were you missing opportunities to do more?');
  } else {
    questions.push('How well did you allocate your limited budget? Did every pound spent generate proportional value?');
  }

  questions.push('If you could go back and change one decision, which would it be and why?');

  return questions;
}

function renderDecisionsSummary() {
  const container = document.getElementById('decisions-summary');

  if (gameState.data.choices.length === 0) {
    container.innerHTML = '<p>No decisions recorded.</p>';
    return;
  }

  const html = '<ul style="list-style: none; padding: 0; margin: 0;">' + gameState.data.choices.map((choice, idx) => `
    <li class="results-block" style="margin-bottom: 12px; padding: 14px 16px; background: rgba(255,255,255,0.86); border: 1px solid rgba(15,23,42,0.08); border-left: 4px solid #3b82f6; border-radius: 16px; box-shadow: 0 10px 22px rgba(16, 32, 51, 0.06);">
      <strong>Decision ${idx + 1}:</strong> ${choice.choiceText}
      <br><small style="color: #6b7280;">
        Impact: ${choice.effects.impact > 0 ? '+' : ''}${choice.effects.impact}, 
        Inclusivity: ${choice.effects.inclusivity > 0 ? '+' : ''}${choice.effects.inclusivity}, 
        Trust: ${choice.effects.trust > 0 ? '+' : ''}${choice.effects.trust}, 
        Budget: ${window.TechTycoonUI?.formatCurrency(choice.effects.budget) || ('$' + choice.effects.budget.toLocaleString())}
      </small>
    </li>
  `).join('') + '</ul>';

  container.innerHTML = html;
}

async function saveResults() {
  try {
    const data = {
      teamName: gameState.data.teamName,
      problemId: gameState.data.problemId,
      role: gameState.data.role,
      teamMembers: gameState.data.teamMembers,
      finalScores: gameState.data.scores,
      choices: gameState.data.choices,
      duration: gameState.getDuration(),
      timestamp: new Date().toISOString()
    };

    const response = await fetch('http://localhost:3000/api/game/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.success) {
      window.TechTycoonUI?.showNotification({ title: 'Results saved', message: 'Your run was saved to the local server.', type: 'success' });
    } else {
      alert('Error saving results. You can download as CSV instead.');
    }
  } catch (e) {
    console.error('Error saving results:', e);
    alert('Could not connect to server. Make sure the backend is running on localhost:3000');
  }
}

async function downloadResults() {
  try {
    const data = {
      teamName: gameState.data.teamName,
      problemId: gameState.data.problemId,
      finalScores: gameState.data.scores,
      choices: gameState.data.choices,
      duration: gameState.getDuration(),
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch(`http://localhost:3000/api/game/export/${data.timestamp}`, {
        method: 'GET'
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `techtycoon-results-${data.timestamp}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        return;
      }
    } catch (e) {
      console.log('Server export not available, using local CSV generation');
    }

    let csv = 'TechTycoon Game Results\n';
    csv += `Team Name,${data.teamName}\n`;
    csv += `Problem,${data.problemId}\n`;
    csv += `Duration,${data.duration} minutes\n`;
    csv += `Date,${new Date(data.timestamp).toLocaleString()}\n\n`;
    csv += 'Final Scores\n';
    csv += `Impact,${data.finalScores.impact}\n`;
    csv += `Inclusivity,${data.finalScores.inclusivity}\n`;
    csv += `Trust,${data.finalScores.trust}\n`;
    csv += `Budget Remaining,$${data.finalScores.budget}\n\n`;
    csv += 'Decisions\n';
    csv += 'Day,Decision,Impact,Inclusivity,Trust,Budget Change\n';
    data.choices.forEach((choice, idx) => {
      csv += `${idx + 1},"${choice.choiceText}",${choice.effects.impact},${choice.effects.inclusivity},${choice.effects.trust},$${choice.effects.budget}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `techtycoon-${gameState.data.teamName.replace(/\s+/g, '-')}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Error downloading results:', e);
    alert('Error downloading results');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!gameState.data.problemId) {
    window.TechTycoonUI?.navigate('select-problem.html');
    return;
  }

  if (gameState.data.gameStatus === 'in-progress') {
    gameState.endGame('complete');
  }

  renderResults();
});

