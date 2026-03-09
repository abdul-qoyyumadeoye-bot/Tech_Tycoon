// ============================================================================
// RESULTS PAGE
// ============================================================================

function renderResults() {
  // Use the stored scenario from gameState
  const problem = gameState.data.problem;
  if (!problem) {
    alert('Problem not found');
    return;
  }

  // Display final scores
  document.getElementById('final-impact').textContent = gameState.data.scores.impact;
  document.getElementById('final-inclusivity').textContent = gameState.data.scores.inclusivity;
  document.getElementById('final-trust').textContent = gameState.data.scores.trust;
  document.getElementById('final-budget').textContent = '$' + gameState.data.scores.budget.toLocaleString();

  // Generate results message based on scores
  const message = generateResultsMessage();
  document.getElementById('results-message').innerHTML = message;

  // Generate and display reprimands for low scores
  const reprimands = generateReprimands();
  if (reprimands.length > 0) {
    const reprimandHtml = '<div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin-top: 16px; border-radius: 4px;"><strong style="color: #dc2626;">⚠️ Areas of Concern:</strong><ul style="margin-top: 8px; padding-left: 20px;">' + reprimands.map(r => `<li>${r}</li>`).join('') + '</ul></div>';
    document.getElementById('results-message').innerHTML += reprimandHtml;
  }

  // Reflection questions
  const reflectionQuestions = generateReflectionQuestions();
  const questionsHtml = reflectionQuestions.map(q => `<li>${q}</li>`).join('');
  document.getElementById('reflection-questions').innerHTML = questionsHtml;

  // Summary of decisions
  renderDecisionsSummary();
}

function generateResultsMessage() {
  const problem = gameState.data.problem;
  const { impact, inclusivity, trust, budget } = gameState.data.scores;
  const average = (impact + inclusivity + trust) / 3;

  let message = '';
  let sentiment = 'balanced';

  if (gameState.data.gameStatus === 'time-up') {
    sentiment = 'time-up';
    const totalDays = gameState.data.totalDays || (problem?.totalDays || 0);
    const currentDay = gameState.data.currentDay || 0;
    const overtime = Math.max(0, currentDay - totalDays);
    message = `<strong>⏰ Time Up: Project Closed</strong><br>
    Deadline was Day ${totalDays}${problem?.launchDeadline ? ` (${problem.launchDeadline})` : ''}. Your team reached Day ${currentDay}.${overtime > 0 ? ` You were ${overtime} day${overtime !== 1 ? 's' : ''} late.` : ''}<br>
    Final status: Impact ${impact}, Inclusivity ${inclusivity}, Trust ${trust}, Budget $${budget.toLocaleString()}.<br>
    The launch window ended before you could continue, so the project has been closed.`;
  } else if (gameState.data.gameStatus === 'incomplete') {
    sentiment = 'incomplete';
    message = `<strong>❌ Project Incomplete:</strong> Your team ran out of budget before completing all planned work. Despite your efforts to deliver impact (Impact: ${impact}), maintain inclusivity (Inclusivity: ${inclusivity}), and preserve stakeholder trust (Trust: ${trust}), financial constraints forced the project to halt.`;
  } else if (average >= 75 && trust >= 70 && budget > 0) {
    sentiment = 'excellent';
    message = `<strong>Excellent Leadership:</strong> Your team navigated this crisis with remarkable balance. You prioritized inclusive solutions (Inclusivity: ${inclusivity}), maintained strong stakeholder relationships (Trust: ${trust}), and delivered real impact (Impact: ${impact}). Schools and advocacy groups are praising your commitment to do the right thing. You've emerged stronger.`;
  } else if (average >= 55 && trust >= 50 && budget > 0) {
    sentiment = 'good';
    message = `<strong>Solid Crisis Management:</strong> You made reasonable trade-offs and kept your team together. Impact: ${impact}, Inclusivity: ${inclusivity}, Trust: ${trust}. While not perfect, you demonstrated thoughtful decision-making under pressure. There's room to improve, but you prevented disaster.`;
  } else {
    sentiment = 'difficult';
    message = `<strong>Difficult Choices:</strong> You faced impossible trade-offs. Your scores (Impact: ${impact}, Inclusivity: ${inclusivity}, Trust: ${trust}) reflect the painful reality that every choice had costs. Perhaps some problems have no perfect answer—only different ways to struggle.`;
  }

  return message;
}

function generateReprimands() {
  const { impact, inclusivity, trust } = gameState.data.scores;
  const reprimands = [];

  // Budget is intentionally omitted from this list; only the core performance
  // metrics trigger an "areas of concern" warning. Financial trouble is
  // already handled separately (incomplete projects, etc.).

  if (impact < 40) {
    reprimands.push('<strong>Low Impact:</strong> You failed to deliver meaningful solutions to the core problem. Whatever you attempted, it wasn\'t enough to create real change. In future crises, focus on actions that actually move the needle, not just going through the motions.');
  }

  if (inclusivity < 40) {
    reprimands.push('<strong>Low Inclusivity:</strong> Your approach excluded significant portions of your user base or stakeholder community. You may have solved the problem for some while making things worse for others. Genuine inclusion means considering all voices, especially those most affected.');
  }

  if (trust < 40) {
    reprimands.push('<strong>Low Trust:</strong> Your stakeholders don\'t believe in your leadership or your solutions. Whether through lack of transparency, poor communication, or decisions perceived as self-serving, you lost the confidence of the people who need to support your work. Trust, once broken, is incredibly hard to rebuild.');
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
    questions.push('Looking back, where did you overspend? Which solutions weren\'t worth the cost?');
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

  const html = '<ul style="list-style: none; padding: 0;">' + gameState.data.choices.map((choice, idx) => `
    <li style="margin-bottom: 12px; padding: 12px; background: #f9fafb; border-left: 4px solid #3b82f6; border-radius: 4px;">
      <strong>Day ${idx + 1}:</strong> ${choice.choiceText}
      <br><small style="color: #6b7280;">
        Impact: ${choice.effects.impact > 0 ? '+' : ''}${choice.effects.impact}, 
        Inclusivity: ${choice.effects.inclusivity > 0 ? '+' : ''}${choice.effects.inclusivity}, 
        Trust: ${choice.effects.trust > 0 ? '+' : ''}${choice.effects.trust}, 
        Budget: $${choice.effects.budget > 0 ? '+' : ''}${choice.effects.budget.toLocaleString()}
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
      alert('✓ Results saved to server!');
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

    // Try to use backend export if available
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

    // Fallback: Generate CSV locally
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

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  if (!gameState.data.problemId) {
    window.location.href = 'select-problem.html';
    return;
  }

  gameState.endGame();
  renderResults();
});
