// ============================================================================
// INDEX PAGE (Welcome)
// ============================================================================

function startGame() {
  const teamNameInput = document.getElementById('team-name');
  const teamName = teamNameInput.value.trim() || 'Techgrine';
  
  gameState.reset();
  gameState.setTeamName(teamName);
  gameState.startGame();
  
  window.TechTycoonUI?.navigate('select-problem.html') || (window.location.href = 'select-problem.html');
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  const teamNameInput = document.getElementById('team-name');
  if (teamNameInput) {
    teamNameInput.focus();
  }
});

