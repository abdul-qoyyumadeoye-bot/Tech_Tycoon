// ============================================================================
// BRIEF PAGE
// Shows detailed problem description
// ============================================================================

function renderBrief() {
  const problem = gameState.data.problem;

  if (!problem) {
    document.getElementById('brief-content').innerHTML = '<p style="color: #dc2626; font-weight: 600;">Error: Scenario not found. Please go back and select a scenario.</p>';
    return;
  }

  const html = `
    <div class="brief-shell">
      <div class="panel-intro">
        <div class="panel-kicker">Mission Brief</div>
        <h2>${problem.title}</h2>
        <p>${problem.theme}</p>
      </div>

      <div class="brief-hero">
        ${(problem.projectBrief || '').split('\n').map(para => `<p>${para}</p>`).join('')}
      </div>

      <div class="brief-stats-grid">
        <div class="brief-stat-card">
          <span>Launch deadline</span>
          <strong>Day ${problem.totalDays || 0}</strong>
          <small>${problem.launchDeadline || 'Deadline TBC'}</small>
        </div>
        <div class="brief-stat-card">
          <span>Starting budget</span>
          <strong>$${(problem.startingBudget || 0).toLocaleString()}</strong>
          <small>Available runway for the full sprint</small>
        </div>
        <div class="brief-stat-card">
          <span>Total stages</span>
          <strong>${problem.stages?.length || 0}</strong>
          <small>Decision points in this run</small>
        </div>
      </div>

      <div class="brief-columns">
        <section class="brief-panel">
          <h3>Suggested team</h3>
          <div class="brief-chip-row">
            ${(problem.suggestedTeam || []).map(member => `<span class="brief-chip">${member}</span>`).join('')}
          </div>
        </section>
        <section class="brief-panel">
          <h3>What success looks like</h3>
          <ul>
            <li>Ship before the deadline.</li>
            <li>Protect trust while handling pressure.</li>
            <li>Use budget carefully enough to finish the run.</li>
            <li>Balance impact with inclusive decisions.</li>
          </ul>
        </section>
      </div>
    </div>
  `;

  document.getElementById('brief-content').innerHTML = html;
  window.TechTycoonUI?.revealElements(document.getElementById('brief-content'));
}

function continueToTeam() {
  window.TechTycoonUI?.navigate('select-team.html') || (window.location.href = 'select-team.html');
}

document.addEventListener('DOMContentLoaded', () => {
  renderBrief();
});
