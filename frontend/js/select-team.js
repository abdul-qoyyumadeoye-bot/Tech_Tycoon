// ============================================================================
// TEAM MEMBER SELECTION PAGE
// ============================================================================

const TEAM_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile App Developer',
  'Game Developer',
  'AI Engineer',
  'Machine Learning Engineer',
  'Data Scientist',
  'Data Analyst',
  'DevOps Engineer',
  'Cloud Engineer',
  'Site Reliability Engineer',
  'QA Tester',
  'Automation Test Engineer',
  'Cybersecurity Specialist',
  'Security Engineer',
  'Privacy Engineer',
  'Product Manager',
  'Project Manager',
  'Technical Program Manager',
  'UX Designer',
  'UI Designer',
  'Accessibility Specialist',
  'Interaction Designer',
  'User Researcher',
  'Marketing Manager',
  'Digital Marketing Specialist',
  'Growth Strategist',
  'SEO Specialist',
  'Social Media Manager',
  'Brand Manager',
  'Sales Manager',
  'Partnerships Manager',
  'Business Development Manager',
  'Finance Manager',
  'Operations Manager',
  'Customer Support Lead',
  'Community Manager',
  'Content Creator',
  'Technical Writer',
  'Solutions Architect',
  'Database Administrator',
  'Infrastructure Engineer',
  'Compliance Officer',
  'Ethics Advisor'
];

function renderTeamMembers() {
  const container = document.getElementById('team-list');

  container.innerHTML = TEAM_ROLES.map((name) => `
    <label class="avatar-card">
      <input type="checkbox" name="team-member" value="${name}" onchange="updateTeamCount()">
      <div class="avatar-name">${name}</div>
    </label>
  `).join('');
}

function updateTeamCount() {
  const selectedInputs = Array.from(document.querySelectorAll('input[name="team-member"]:checked'));
  const selectedCount = selectedInputs.length;
  document.getElementById('count').textContent = selectedCount;

  // Max 5 members allowed.
  if (selectedCount > 5) {
    selectedInputs[selectedInputs.length - 1].checked = false;
  }

  const currentCount = document.querySelectorAll('input[name="team-member"]:checked').length;
  const continueBtn = document.getElementById('continue-btn');
  continueBtn.disabled = !(currentCount === 4 || currentCount === 5);

  document.querySelectorAll('.avatar-card').forEach(card => {
    const input = card.querySelector('input[type="checkbox"]');
    card.classList.toggle('selected', Boolean(input && input.checked));
  });
}

function showSuggestedTeam() {
  const hint = document.getElementById('team-hint');
  const suggested = gameState.data.problem?.suggestedTeam || [];
  if (!hint) return;

  if (suggested.length) {
    hint.innerHTML = `<strong>Suggested Team:</strong> ${suggested.join(', ')}`;
  } else {
    hint.textContent = 'No suggested team provided for this scenario.';
  }
  hint.style.display = 'block';
}

function selectTeam() {
  const selected = Array.from(document.querySelectorAll('input[name="team-member"]:checked')).map(cb => cb.value);

  if (!(selected.length === 4 || selected.length === 5)) {
    alert('Please select 4 or 5 team members.');
    return;
  }

  gameState.setTeamMembers(selected);
  window.location.href = 'stage.html';
}

document.addEventListener('DOMContentLoaded', () => {
  renderTeamMembers();
  document.getElementById('team-hint-btn')?.addEventListener('click', showSuggestedTeam);
});
