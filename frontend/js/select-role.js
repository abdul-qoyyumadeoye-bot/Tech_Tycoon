// ============================================================================
// ROLE SELECTION PAGE
// ============================================================================

function updateContinueButton() {
  const selected = document.querySelector('input[name="role"]:checked');
  const btn = document.getElementById('continue-btn');
  btn.disabled = !selected;
  
  // Update visual state
  document.querySelectorAll('.avatar-card').forEach(card => {
    const input = card.querySelector('input[type="radio"]');
    if (input && input.checked) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });
}

function selectRole() {
  const selected = document.querySelector('input[name="role"]:checked');
  if (!selected) return;

  gameState.setRole(selected.value);
  window.TechTycoonUI?.navigate('select-team.html') || (window.location.href = 'select-team.html');
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  const roleInputs = document.querySelectorAll('input[name="role"]');
  roleInputs.forEach(input => {
    input.addEventListener('change', updateContinueButton);
  });

  // Make the entire card clickable (helpful if we ever swap back to divs)
  document.querySelectorAll('.avatar-card').forEach(card => {
    card.addEventListener('click', () => {
      const input = card.querySelector('input[type="radio"]');
      if (input && !input.checked) {
        input.checked = true;
        updateContinueButton();
      }
    });
  });
});

