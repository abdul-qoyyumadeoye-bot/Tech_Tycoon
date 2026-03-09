document.addEventListener('DOMContentLoaded', () => {
  const screens = Array.from(document.querySelectorAll('.screen'));
  const progressEl = document.getElementById('progress');
  let current = 0;

  // full pool of potential team members (used for checkbox list)
  const fullTeamPool = [
    'Software Engineer','Frontend Developer','Backend Developer','Full Stack Developer','Mobile App Developer','Game Developer','AI Engineer','Machine Learning Engineer','Data Scientist','Data Analyst','DevOps Engineer','Cloud Engineer','Site Reliability Engineer','QA Tester','Automation Test Engineer','Cybersecurity Specialist','Security Engineer','Privacy Engineer','Product Manager','Project Manager','Technical Program Manager','UX Designer','UI Designer','Accessibility Specialist','Interaction Designer','User Researcher','Marketing Manager','Digital Marketing Specialist','Growth Strategist','SEO Specialist','Social Media Manager','Brand Manager','Sales Manager','Partnerships Manager','Business Development Manager','Finance Manager','Operations Manager','Customer Support Lead','Community Manager','Content Creator','Technical Writer','Solutions Architect','Database Administrator','Infrastructure Engineer','Compliance Officer','Ethics Advisor'
  ];

  // app data and state
  let scenarios = null;
  const gameState = {
    teamName: 'Techgrine',
    problemId: null,
    roles: [],
    stageIndex: 0,
    // scores only hold the three metrics, budget and day are tracked separately
    scores: {
      impact: 0,
      inclusivity: 0,
      trust: 0
    },
    budget: 0,
    currentDay: 0
  };

  // Shows a screen by id or by numeric index
  function showScreen(screenIdOrIndex) {
    let idx = null;
    if (typeof screenIdOrIndex === 'number') {
      idx = screenIdOrIndex;
    } else if (typeof screenIdOrIndex === 'string') {
      const el = document.getElementById(screenIdOrIndex);
      idx = el ? screens.indexOf(el) : -1;
    }
    if (idx === -1 || idx === null) return;
    if (idx < 0) idx = 0;
    if (idx > screens.length - 1) idx = screens.length - 1;
    current = idx;
    screens.forEach((s, i) => s.classList.toggle('active', i === idx));
    updateProgress();
    const id = screens[idx].id;
    if (id === 'team-members-screen') setupMembersUI();
    if (id === 'stage-screen') renderStage();
    if (id === 'results-screen') renderResults();
  }

  function updateProgress() {
    const pct = Math.round((current / (screens.length - 1)) * 100);
    if (progressEl) {
      if (!progressEl._bar) {
        const bar = document.createElement('div');
        bar.style.height = '100%';
        bar.style.width = '0%';
        bar.style.background = 'linear-gradient(90deg,#06b6d4,#3b82f6)';
        bar.style.transition = 'width .25s ease';
        progressEl.appendChild(bar);
        progressEl._bar = bar;
      }
      progressEl._bar.style.width = pct + '%';
    }
  }

  function roundScore(v) { return Math.round(v); }

  // Load scenarios.json and populate problem list
  async function loadData() {
    try {
      const res = await fetch('data/scenarios.json');
      scenarios = await res.json();
    } catch (e) {
      console.error('Could not load scenarios.json', e);
      scenarios = { problems: [] };
    }

    const list = document.getElementById('problem-list');
    list.innerHTML = '';
    scenarios.problems.forEach((p, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<label><input type="radio" name="problem" value="${p.id}" ${i===0? 'checked':''}> ${p.title}</label>`;
      list.appendChild(li);
    });

    // default to first problem (no randomisation)
    if (scenarios.problems.length) {
      const radio = list.querySelectorAll('input[type="radio"]')[0];
      if (radio) radio.checked = true;
      updateProblemDesc();
    }

    // wire change
    list.addEventListener('change', updateProblemDesc);
  }

  function updateProblemDesc(){
    const selected = document.querySelector('input[name="problem"]:checked')?.value;
    const p = scenarios.problems.find(x => x.id === selected);
    const desc = document.getElementById('problem-desc');
    const brief = document.getElementById('brief-text');
    if (p) {
      const themeText = p.theme ? `${p.theme} — ` : '';
      desc.textContent = `${themeText}${p.title}`;
      if (brief) {
        const suggestedTeam = (p.suggestedTeam || []).join(', ');
        const launchDate = p.launchDeadline ? `<p><strong>Launch Date:</strong> ${p.launchDeadline}</p>` : '';
        const launchDay = p.totalDays ? `<p><strong>Launch Deadline:</strong> Day ${p.totalDays}</p>` : '';
        brief.innerHTML = `
          <p>${p.projectBrief || `Your company Techgrine is tasked with: ${p.title}.`}</p>
          ${launchDate}
          ${launchDay}
          <p><strong>Total Development Window:</strong> ${p.totalDays || 0} days</p>
          <p><strong>Starting Budget:</strong> $${(p.startingBudget || 0).toLocaleString()}</p>
          <p><strong>Suggested Team:</strong> ${suggestedTeam || 'Not provided'}</p>
        `;
      }
    }
  }

  function setupMembersUI() {
    // Build member list — all roles pick exactly 5 members
    const memberListEl = document.getElementById('member-list');
    memberListEl.innerHTML = '';

    document.getElementById('team-members-instruction').textContent = `Pick exactly 5 team members to work with you.`;

    // wire up hint button (shows suggested team if available)
    const hintBtn = document.getElementById('team-hint-btn');
    const hintContainer = document.getElementById('team-hint');
    hintBtn.onclick = () => {
      const probId = document.querySelector('input[name="problem"]:checked')?.value;
      const scenario = scenarios.problems.find(p => p.id === probId) || {};
      const suggestions = scenario.suggestedTeam || [];
      if (suggestions.length) {
        hintContainer.textContent = 'Suggested team:\n' + suggestions.join(', ');
        hintContainer.style.display = 'block';
      } else {
        hintContainer.textContent = 'No suggestions available for this scenario.';
        hintContainer.style.display = 'block';
      }
    };

    // create a named pool to choose from (full list provided globally)
    const pool = fullTeamPool.slice();
    pool.forEach(name => {
      const lbl = document.createElement('label');
      lbl.innerHTML = `<input type="checkbox" name="member" value="${name}"> ${name}`;
      memberListEl.appendChild(lbl);
    });

    const checkboxes = Array.from(memberListEl.querySelectorAll('input[type="checkbox"]'));
    const nextBtn = document.getElementById('members-next');
    const requiredCount = 5;

    function updateCount() {
      const count = checkboxes.filter(c => c.checked).length;
      nextBtn.disabled = (count !== requiredCount);
      
      // Update visual feedback
      checkboxes.forEach(cb => {
        const lbl = cb.closest('label');
        if (cb.checked) lbl.classList.add('selected');
        else lbl.classList.remove('selected');
      });
    }

    checkboxes.forEach(cb => cb.addEventListener('change', (e)=>{
      const count = checkboxes.filter(c => c.checked).length;
      if (e.target.checked && count > requiredCount) {
        e.target.checked = false;
        return;
      }
      updateCount();
    }));

    updateCount();
  }

  // Render the current stage from the chosen scenario
  function renderStage() {
    const probId = document.querySelector('input[name="problem"]:checked')?.value;
    const scenario = scenarios.problems.find(p=>p.id === probId);
    if (!scenario) return;

    // update header info about deadline and days remaining
    updateDeadlineInfo();

    const idx = gameState.stageIndex;
    const stage = scenario.stages[idx];
    if (!stage) return showScreen('results-screen');

    document.getElementById('stage-title').textContent = stage.title;
    document.getElementById('stage-desc').textContent = stage.description;
    // clear any previous feedback message
    const feedback = document.getElementById('stage-feedback');
    if (feedback) feedback.textContent = '';

    const choicesEl = document.getElementById('stage-choices');
    choicesEl.innerHTML = '';

    // keep authored order of choices
    const choices = stage.choices.slice();
    choices.forEach((c, i) => {
      const div = document.createElement('div');
      div.className = 'choice';
      
      const impacts = c.effects || {};
      let badgesHtml = '';
      if (impacts.impact) badgesHtml += `<span class="impact-badge ${impacts.impact > 0 ? 'positive' : 'negative'}">Impact: ${impacts.impact > 0 ? '+' : ''}${impacts.impact}</span>`;
      if (impacts.inclusivity) badgesHtml += `<span class="impact-badge ${impacts.inclusivity > 0 ? 'positive' : 'negative'}">Inclusivity: ${impacts.inclusivity > 0 ? '+' : ''}${impacts.inclusivity}</span>`;
      if (impacts.trust) badgesHtml += `<span class="impact-badge ${impacts.trust > 0 ? 'positive' : 'negative'}">Trust: ${impacts.trust > 0 ? '+' : ''}${impacts.trust}</span>`;
      if (impacts.budget) badgesHtml += `<span class="impact-badge ${impacts.budget > 0 ? 'positive' : 'negative'}">Budget: ${impacts.budget > 0 ? '+' : ''}${impacts.budget}</span>`;
      
      div.innerHTML = `<div class="choice-text">${c.text}</div>
        <div class="choice-impacts">${badgesHtml}</div>
        <button data-choice="${i}">Choose</button>`;
      
      choicesEl.appendChild(div);
      const btn = div.querySelector('button');
      btn.addEventListener('click', ()=> applyChoice(c));
    });

    // auto-read if TTS enabled
    if (settings.tts) speakText(`${stage.title}. ${stage.description}`);
  }

  function applyChoice(choice) {
    // apply deltas
    const d = choice.effects || {};
    gameState.scores.impact = roundScore(gameState.scores.impact + (d.impact||0));
    gameState.scores.inclusivity = roundScore(gameState.scores.inclusivity + (d.inclusivity||0));
    gameState.scores.trust = roundScore(gameState.scores.trust + (d.trust||0));
    // update budget (effects expressed in actual dollars)
    gameState.budget = Math.max(0, gameState.budget + (d.budget||0));

    // increment current day by stage time (if defined)
    const probId = document.querySelector('input[name="problem"]:checked')?.value;
    const scenario = scenarios.problems.find(p=>p.id === probId) || {};
    const stage = scenario.stages[gameState.stageIndex] || {};
    if (stage.time) {
      gameState.currentDay += stage.time;
    }

    updateDashboard();

    // check deadline before advancing to next stage
    if (scenario.totalDays && gameState.currentDay >= scenario.totalDays) {
      showDeadlineExceeded();
      return;
    }

    // show feedback about days remaining
    const remaining = (scenario.totalDays||0) - gameState.currentDay;
    const feedback = document.getElementById('stage-feedback');
    if (feedback) {
      feedback.textContent = `Current Day: Day ${gameState.currentDay} | Days remaining after this stage: ${remaining>0?remaining:0}`;
    }

    // advance stage index and continue
    gameState.stageIndex += 1;
    if (gameState.stageIndex >= scenario.stages.length) {
      showScreen('results-screen');
    } else {
      renderStage();
    }
  }

  function renderResults(){
    const s = gameState.scores;
    const totalScore = s.impact + s.inclusivity + s.trust;
    const summary = document.getElementById('summary');
    let outcome = '';
    if (totalScore >= 150) outcome = 'Outstanding outcome — strong impact, inclusion, and trust.';
    else if (totalScore >= 100) outcome = 'Solid outcome — good balance across key metrics.';
    else if (totalScore >= 60) outcome = 'Moderate outcome — meaningful progress with clear trade-offs.';
    else outcome = 'At-risk outcome — project needs stronger strategic decisions.';

    summary.innerHTML = `<p><strong>Company:</strong> ${gameState.teamName}</p>
      <p><strong>Final metrics</strong></p>
      <p>Impact: ${s.impact}</p>
      <p>Inclusivity: ${s.inclusivity}</p>
      <p>Trust: ${s.trust}</p>
      <p>Total Score: ${totalScore}</p>
      <p>Budget remaining: $${gameState.budget.toLocaleString()}</p>
      <p>Days used: ${gameState.currentDay}</p>
      <p><em>${outcome}</em></p>
      <h4>Reflection</h4>
      <ul>
        <li>What decisions most affected Inclusivity?</li>
        <li>How did Budget constraints drive trade-offs?</li>
        <li>What would you change on a second run?</li>
      </ul>`;
  }

  // Dashboard update
  function updateDashboard(){
    document.getElementById('metric-impact').textContent = `Impact: ${gameState.scores.impact}`;
    document.getElementById('metric-inclusivity').textContent = `Inclusivity: ${gameState.scores.inclusivity}`;
    document.getElementById('metric-trust').textContent = `Trust: ${gameState.scores.trust}`;
    document.getElementById('metric-budget').textContent = `Budget: $${gameState.budget.toLocaleString()}`;
  }

  function updateDeadlineInfo() {
    const probId = document.querySelector('input[name="problem"]:checked')?.value;
    const scenario = scenarios.problems.find(p=>p.id === probId);
    if (!scenario) return;
    const infoEl = document.getElementById('deadline-info');
    const current = gameState.currentDay;
    const total = scenario.totalDays || 0;
    const remaining = total - current;
    let text = '';
    if (total) {
      text += `Launch Deadline: Day ${total}`;
      if (scenario.launchDeadline) text += ` (${scenario.launchDeadline})`;
    }
    if (total) {
      text += ` | Current Day: Day ${current}`;
      text += ` | Days Remaining: ${remaining > 0 ? remaining : 0}`;
    }
    infoEl.textContent = text;
  }

  function showDeadlineExceeded() {
    const probId = document.querySelector('input[name="problem"]:checked')?.value;
    const scenario = scenarios.problems.find(p=>p.id === probId) || {};
    const msgEl = document.getElementById('deadline-message');
    const day = gameState.currentDay;
    const over = day - (scenario.totalDays || 0);
    msgEl.innerHTML = `<strong>You have run out of time!</strong><br>
      The project deadline was Day ${scenario.totalDays || 'unknown'}${scenario.launchDeadline ? ` (${scenario.launchDeadline})` : ''}.<br>
      Your team reached Day ${day}.${over > 0 ? ` You are ${over} day${over!==1?'s':''} past the deadline.` : ''}<br>
      <br>
      <strong>Project Status at Deadline</strong><br>
      Stage completed: ${Math.min(gameState.stageIndex + 1, (scenario.stages || []).length)} of ${(scenario.stages || []).length}<br>
      Impact: ${gameState.scores.impact} | Inclusivity: ${gameState.scores.inclusivity} | Trust: ${gameState.scores.trust}<br>
      Budget remaining: $${gameState.budget.toLocaleString()}<br>
      <br>
      The school term or launch event has arrived, so this project is now closed. Review earlier stage decisions to improve time planning in your next run.`;
    showScreen('deadline-screen');
  }

  // Accessibility settings
  const settings = { highContrast:false, bigText:false, tts:false };

  function createAccessibilityPanel(){
    const panel = document.createElement('div');
    panel.id = 'accessibility-panel';

    panel.innerHTML = `
      <label><input type="checkbox" id="ac-contrast"> High contrast</label>
      <label><input type="checkbox" id="ac-bigtext"> Larger text</label>
      <label><input type="checkbox" id="ac-tts"> Text-to-speech (TTS)</label>
      <div style="margin-top:8px"><button id="ac-read">Read current stage</button></div>
    `;
    document.body.appendChild(panel);

    document.getElementById('ac-contrast').addEventListener('change', (e)=>{
      settings.highContrast = e.target.checked;
      document.documentElement.classList.toggle('high-contrast', settings.highContrast);
    });
    document.getElementById('ac-bigtext').addEventListener('change', (e)=>{
      settings.bigText = e.target.checked;
      document.documentElement.classList.toggle('big-text', settings.bigText);
    });
    document.getElementById('ac-tts').addEventListener('change', (e)=>{
      settings.tts = e.target.checked;
    });
    document.getElementById('ac-read').addEventListener('click', ()=>{
      const title = document.getElementById('stage-title')?.textContent || '';
      const desc = document.getElementById('stage-desc')?.textContent || '';
      speakText(`${title}. ${desc}`);
    });
  }

  function speakText(txt){
    if (!settings.tts || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(txt);
    window.speechSynthesis.speak(u);
  }

  // wire interactions
  const startBtn = document.querySelector('.start-btn');
  const restartBtn = document.querySelector('.restart-btn');
  const nextBtns = Array.from(document.querySelectorAll('.next-btn'));
  const prevBtns = Array.from(document.querySelectorAll('.prev-btn'));

  if (startBtn) startBtn.addEventListener('click', () => {
    // reset state
    gameState.stageIndex = 0;
    gameState.scores = {impact:0,inclusivity:0,trust:0};
    gameState.currentDay = 0;
    const probId = document.querySelector('input[name="problem"]:checked')?.value;
    const scenario = scenarios.problems.find(p=>p.id===probId) || {};
    gameState.budget = scenario.startingBudget || 0;
    updateDashboard();
    // ensure brief text is up to date before showing
    updateProblemDesc();
    showScreen('brief-screen');
  });

  if (restartBtn) restartBtn.addEventListener('click', () => {
    gameState.stageIndex = 0;
    gameState.scores = {impact:0,inclusivity:0,trust:0};
    gameState.currentDay = 0;
    gameState.budget = 0;
    updateDashboard();
    showScreen('welcome-screen');
  });

  nextBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = btn.getAttribute('data-target');
      if (target) return showScreen(target);
      // special-case step flows: moving from role -> members (all roles require member selection)
      const parent = btn.closest('.screen');
      if (parent && parent.id === 'role-screen') {
        return showScreen('team-members-screen');
      }
      showScreen(current + 1);
    });
  });

  prevBtns.forEach(btn => btn.addEventListener('click', ()=> showScreen(current -1)));

  const membersNext = document.getElementById('members-next');
  if (membersNext) membersNext.addEventListener('click', ()=> {
    // capture selected members
    const selected = Array.from(document.querySelectorAll('.member-list input[type="checkbox"]:checked')).map(n=>n.value);
    gameState.roles = selected;
    showScreen('stage-screen');
  });



  // accessibility toggle
  document.getElementById('accessibility-toggle').addEventListener('click', (e)=>{
    const panel = document.getElementById('accessibility-panel');
    if (!panel) return;
    const shown = panel.style.display === 'block';
    panel.style.display = shown ? 'none' : 'block';
    e.target.setAttribute('aria-expanded', String(!shown));
  });

  // init
  createAccessibilityPanel();
  loadData().then(()=>{
    updateDashboard();
    showScreen(0);
  });


});
