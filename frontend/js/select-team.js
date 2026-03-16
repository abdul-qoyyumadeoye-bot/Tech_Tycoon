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

function getRoleMeta(name) {
  const lower = name.toLowerCase();
  if (lower.includes('security') || lower.includes('privacy') || lower.includes('compliance')) return { badge: 'Risk', icon: 'RK' };
  if (lower.includes('design') || lower.includes('ux') || lower.includes('research') || lower.includes('accessibility')) return { badge: 'Experience', icon: 'UX' };
  if (lower.includes('data') || lower.includes('ai') || lower.includes('machine')) return { badge: 'Insights', icon: 'AI' };
  if (lower.includes('market') || lower.includes('sales') || lower.includes('brand') || lower.includes('growth') || lower.includes('community')) return { badge: 'Growth', icon: 'GR' };
  if (lower.includes('finance') || lower.includes('operations') || lower.includes('project') || lower.includes('product')) return { badge: 'Ops', icon: 'OP' };
  return { badge: 'Build', icon: 'DV' };
}

function getRoleSummary(name) {
  const lower = name.toLowerCase();
  if (lower.includes('security') || lower.includes('privacy') || lower.includes('compliance')) return 'Protects the product from legal, data, and trust risks.';
  if (lower.includes('design') || lower.includes('ux') || lower.includes('research') || lower.includes('accessibility')) return 'Champions usability, inclusion, and a smoother player experience.';
  if (lower.includes('data') || lower.includes('ai') || lower.includes('machine')) return 'Turns signals into smart product and growth decisions.';
  if (lower.includes('market') || lower.includes('sales') || lower.includes('brand') || lower.includes('growth') || lower.includes('community')) return 'Builds momentum, reach, and audience confidence.';
  if (lower.includes('finance') || lower.includes('operations') || lower.includes('project') || lower.includes('product')) return 'Keeps delivery on track, funded, and strategically aligned.';
  return 'Builds the product backbone and keeps the sprint moving.';
}

function renderTeamMembers() {
  const container = document.getElementById('team-list');

  container.innerHTML = TEAM_ROLES.map((name) => {
    const meta = getRoleMeta(name);
    return `
      <label class="avatar-card avatar-card--team">
        <input type="checkbox" name="team-member" value="${name}" onchange="updateTeamCount()">
        <div class="avatar-orbit"></div>
        <div class="avatar-visual">
          <div class="avatar-icon">${meta.icon}</div>
          <div class="avatar-glow"></div>
        </div>
        <div class="avatar-tag">${meta.badge}</div>
        <div class="avatar-name">${name}</div>
        <div class="avatar-description">${getRoleSummary(name)}</div>
      </label>
    `;
  }).join('');

  window.TechTycoonUI?.revealElements(container);
}

function updateTeamCount() {
  const selectedInputs = Array.from(document.querySelectorAll('input[name="team-member"]:checked'));
  const selectedCount = selectedInputs.length;
  document.getElementById('count').textContent = selectedCount;

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
  window.TechTycoonUI?.showNotification({ title: 'Team suggestion ready', message: 'Use it as a starting point, not a requirement.', type: 'info' });
}

function selectTeam() {
  const selected = Array.from(document.querySelectorAll('input[name="team-member"]:checked')).map(cb => cb.value);

  if (!(selected.length === 4 || selected.length === 5)) {
    alert('Please select 4 or 5 team members.');
    return;
  }

  gameState.setTeamMembers(selected);
  window.TechTycoonUI?.navigate('stage.html') || (window.location.href = 'stage.html');
}

document.addEventListener('DOMContentLoaded', () => {
  renderTeamMembers();
  document.getElementById('team-hint-btn')?.addEventListener('click', showSuggestedTeam);
});
