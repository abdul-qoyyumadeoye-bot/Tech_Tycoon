// ============================================================================
// TEAM MEMBER SELECTION PAGE
// ============================================================================

const TEAM_ROLES = [
  { value: 'frontend-engineer', name: 'Frontend Engineer', description: 'Web & UI development expert', icon: '🎨' },
  { value: 'backend-engineer', name: 'Backend Engineer', description: 'Server & API specialist', icon: '⚙️' },
  { value: 'ux-designer', name: 'UX Designer', description: 'User experience specialist', icon: '🎭' },
  { value: 'qa-engineer', name: 'QA Engineer', description: 'Testing & quality assurance', icon: '✅' },
  { value: 'devops-engineer', name: 'DevOps Engineer', description: 'Infrastructure & deployment', icon: '🚀' },
  { value: 'accessibility-specialist', name: 'Accessibility Specialist', description: 'Inclusive design expert', icon: '♿' },
  { value: 'product-manager', name: 'Product Manager', description: 'Strategy & priorities', icon: '📋' },
  { value: 'data-analyst', name: 'Data Analyst', description: 'Analytics & insights', icon: '📊' },
  { value: 'security-specialist', name: 'Security Specialist', description: 'Security & compliance', icon: '🔒' },
  { value: 'ai-researcher', name: 'AI Researcher', description: 'Machine learning and algorithm expert', icon: '🤖' },
  { value: 'cloud-architect', name: 'Cloud Architect', description: 'Designs scalable cloud infrastructure', icon: '☁️' },
  { value: 'mobile-developer', name: 'Mobile Developer', description: 'Optimises apps for phones and tablets', icon: '📱' }
];

function renderTeamMembers() {
  const container = document.getElementById('team-list');
  
  container.innerHTML = TEAM_ROLES.map(role => `
    <label class="avatar-card">
      <input type="checkbox" name="team-member" value="${role.value}" onchange="updateTeamCount()">
      <div class="avatar-icon">${role.icon}</div>
      <div class="avatar-name">${role.name}</div>
      <div class="avatar-description">${role.description}</div>
    </label>
  `).join('');
}

function updateTeamCount() {
  const selected = document.querySelectorAll('input[name="team-member"]:checked').length;
  document.getElementById('count').textContent = selected;
  
  const continueBtn = document.getElementById('continue-btn');
  continueBtn.disabled = selected !== 5;
  
  // Update visual state
  document.querySelectorAll('.avatar-card').forEach(card => {
    const input = card.querySelector('input[type="checkbox"]');
    if (input && input.checked) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });
}

function selectTeam() {
  const selected = Array.from(document.querySelectorAll('input[name="team-member"]:checked')).map(cb => cb.value);
  
  if (selected.length !== 5) {
    alert('Please select exactly 5 team members.');
    return;
  }

  gameState.setTeamMembers(selected);
  window.location.href = 'stage.html';
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  renderTeamMembers();
});
