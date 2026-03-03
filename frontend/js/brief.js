// ============================================================================
// BRIEF PAGE
// Shows detailed problem description
// ============================================================================

function renderBrief() {
  // Get the full scenario object from gameState (stored when scenario was selected)
  const problem = gameState.data.problem;
  
  if (!problem) {
    document.getElementById('brief-content').innerHTML = '<p style="color: #dc2626; font-weight: 600;">Error: Scenario not found. Please go back and select a scenario.</p>';
    return;
  }

  const html = `
    <div>
      <div style="margin-bottom: 12px;">
        <span style="color: #3b82f6; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;">
          ${problem.theme}
        </span>
      </div>
      <h2>${problem.title}</h2>
      <div style="background: #f0f9ff; padding: 24px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 24px 0; line-height: 1.8;">
        ${problem.briefDescription.split('\n').map(para => `<p style="margin: 0 0 16px 0;">${para}</p>`).join('')}
      </div>
      <div style="margin-top: 32px;">
        <h3>Your Objective</h3>
        <p>${problem.objectives}</p>
      </div>
      <div style="margin-top: 24px; padding: 16px; background: #fef3c7; border-radius: 6px;">
        <strong>Starting Budget: £${problem.initialBudget.toLocaleString()}</strong>
        <p style="margin: 8px 0 0 0; font-size: 14px;">This is the total amount you have to resolve this crisis. Spend wisely.</p>
      </div>
    </div>
  `;

  document.getElementById('brief-content').innerHTML = html;
}

function continueToRoles() {
  window.location.href = 'select-role.html';
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  renderBrief();
});
