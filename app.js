document.addEventListener('DOMContentLoaded', () => {
  const screens = Array.from(document.querySelectorAll('.screen'));
  const progressEl = document.getElementById('progress');
  let current = 0;

  // app data and state
  let scenarios = null;
  const gameState = {
    teamName: 'Techgrine',
    problemId: null,
    roles: [],
    stageIndex: 0,
    scores: {
      impact: 50,
      inclusivity: 50,
      trust: 50,
      budget: 100
    }
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

  function clampScore(v) { return Math.max(0, Math.min(100, Math.round(v))); }

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

    // pick a random default problem
    if (scenarios.problems.length) {
      const rand = Math.floor(Math.random()*scenarios.problems.length);
      const radio = list.querySelectorAll('input[type="radio"]')[rand];
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
      if (brief) brief.textContent = `Your company Techgrine is tasked with: ${p.title}.\nTheme: ${p.theme}.`;
    }
  }

  function setupMembersUI() {
    // Build member list — all roles pick exactly 5 members
    const memberListEl = document.getElementById('member-list');
    memberListEl.innerHTML = '';

    document.getElementById('team-members-instruction').textContent = `Pick exactly 5 team members to work with you.`;

    // create a named pool to choose from
    const pool = ['Frontend Engineer','Backend Engineer','UX Designer','QA Engineer','DevOps Engineer','Accessibility Specialist','Product Manager','Data Analyst','Security Analyst'];
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

    const idx = gameState.stageIndex;
    const stage = scenario.stages[idx];
    if (!stage) return showScreen('results-screen');

    document.getElementById('stage-title').textContent = stage.title;
    document.getElementById('stage-desc').textContent = stage.description;

    const choicesEl = document.getElementById('stage-choices');
    choicesEl.innerHTML = '';

    // randomise order of choices for variety
    const choices = stage.choices.slice().sort(()=>Math.random()-0.5);
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
    gameState.scores.impact = clampScore(gameState.scores.impact + (d.impact||0));
    gameState.scores.inclusivity = clampScore(gameState.scores.inclusivity + (d.inclusivity||0));
    gameState.scores.trust = clampScore(gameState.scores.trust + (d.trust||0));
    // budget only decreases (effects likely negative or positive for income); enforce decrease-only
    const newBudget = gameState.scores.budget + (d.budget||0);
    gameState.scores.budget = Math.max(0, Math.min(1000, Math.round(newBudget)));

    updateDashboard();

    // advance stage
    gameState.stageIndex += 1;
    const probId = document.querySelector('input[name="problem"]:checked')?.value;
    const scenario = scenarios.problems.find(p=>p.id === probId);
    if (gameState.stageIndex >= scenario.stages.length) {
      showScreen('results-screen');
    } else {
      renderStage();
    }
  }

  function renderResults(){
    const s = gameState.scores;
    const summary = document.getElementById('summary');
    let outcome = '';
    if (s.impact>70 && s.trust<40) outcome = 'High Impact, Low Trust — growth with reputational risk.';
    else if (s.inclusivity>60 && s.trust>60) outcome = 'Inclusive & Trusted — responsible product.';
    else outcome = 'Mixed results — discuss trade-offs.';

    summary.innerHTML = `<p><strong>Company:</strong> ${gameState.teamName}</p>
      <p><strong>Final metrics</strong></p>
      <p>Impact: ${s.impact}</p>
      <p>Inclusivity: ${s.inclusivity}</p>
      <p>Trust: ${s.trust}</p>
      <p>Budget: ${s.budget}</p>
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
    document.getElementById('metric-budget').textContent = `Budget: ${gameState.scores.budget}`;
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
    gameState.scores = {impact:50,inclusivity:50,trust:50,budget:100};
    updateDashboard();
    // ensure brief text is up to date before showing
    updateProblemDesc();
    showScreen('brief-screen');
  });

  if (restartBtn) restartBtn.addEventListener('click', () => {
    gameState.stageIndex = 0;
    gameState.scores = {impact:50,inclusivity:50,trust:50,budget:100};
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
