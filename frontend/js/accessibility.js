// ============================================================================
// ACCESSIBILITY FEATURES
// Handles contrast, text size, and text-to-speech across all pages
// ============================================================================

class AccessibilityManager {
  constructor() {
    this.settings = this.loadSettings();
    this.ambientAudio = null;
    this.clickAudio = null;
    this.init();
  }

  loadSettings() {
    try {
      const stored = localStorage.getItem('techtycoon_accessibility');
      return stored ? JSON.parse(stored) : { highContrast: false, bigText: false, tts: false };
    } catch {
      return { highContrast: false, bigText: false, tts: false };
    }
  }

  saveSettings() {
    localStorage.setItem('techtycoon_accessibility', JSON.stringify(this.settings));
  }

  init() {
    this.setupAccessibilityToggleButton();
    this.setupAccessibilityPanel();
    this.applySettings();
    this.startBackgroundAudio();
  }

  setupAccessibilityToggleButton() {
    const btn = document.getElementById('accessibility-toggle');
    if (btn) {
      btn.addEventListener('click', (e) => {
        const panel = document.getElementById('accessibility-panel');
        if (!panel) return;
        const shown = panel.style.display === 'block';
        if (shown) {
          panel.style.display = 'none';
        } else {
          // position panel next to button
          const rect = btn.getBoundingClientRect();
          panel.style.top = `${rect.bottom + window.scrollY + 8}px`;
          let leftPos = rect.left + window.scrollX;
          // prevent overflow right
          const panelWidth = panel.offsetWidth || 240;
          if (leftPos + panelWidth > window.innerWidth - 10) {
            leftPos = window.innerWidth - panelWidth - 10;
          }
          panel.style.left = `${leftPos}px`;
          panel.style.display = 'block';
        }
        e.target.setAttribute('aria-expanded', String(!shown));
      });
    }
  }

  setupAccessibilityPanel() {
    const contrastToggle = document.getElementById('high-contrast-toggle');
    const bigTextToggle = document.getElementById('big-text-toggle');
    const ttsToggle = document.getElementById('tts-toggle');
    const readAloudBtn = document.getElementById('read-aloud-btn');

    if (contrastToggle) {
      contrastToggle.checked = this.settings.highContrast;
      contrastToggle.addEventListener('change', () => {
        this.settings.highContrast = contrastToggle.checked;
        this.saveSettings();
        this.applySettings();
      });
    }

    if (bigTextToggle) {
      bigTextToggle.checked = this.settings.bigText;
      bigTextToggle.addEventListener('change', () => {
        this.settings.bigText = bigTextToggle.checked;
        this.saveSettings();
        this.applySettings();
      });
    }

    if (ttsToggle) {
      ttsToggle.checked = this.settings.tts;
      ttsToggle.addEventListener('change', () => {
        this.settings.tts = ttsToggle.checked;
        this.saveSettings();
        if (readAloudBtn) {
          readAloudBtn.style.display = this.settings.tts ? 'block' : 'none';
        }
      });
    }

    if (readAloudBtn) {
      readAloudBtn.style.display = this.settings.tts ? 'block' : 'none';
      readAloudBtn.addEventListener('click', () => this.readPageAloud());
    }
  }

  applySettings() {
    const html = document.documentElement;
    
    if (this.settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    if (this.settings.bigText) {
      document.body.classList.add('big-text');
    } else {
      document.body.classList.remove('big-text');
    }
  }

  readPageAloud() {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    // Get main content
    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    const text = mainContent.innerText;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.Volume = 1.0;

    // Speak
    speechSynthesis.speak(utterance);
  }

  startBackgroundAudio() {
    // ambient audio elements may be swapped randomly
    const ambientFiles = ['audio/rustle.mp3','audio/wind.mp3','audio/ocean.mp3'];
    const choice = ambientFiles[Math.floor(Math.random() * ambientFiles.length)];
    this.ambientAudio = document.createElement('audio');
    this.ambientAudio.src = choice;
    this.ambientAudio.loop = true;
    this.ambientAudio.volume = 0.3;
    document.body.appendChild(this.ambientAudio);
    // autoplay after first click
    document.addEventListener('click', () => {
      this.ambientAudio.play().catch(e => console.log('Audio autoplay prevented:', e));
    }, { once: true });

    // prepare click sound
    this.clickAudio = document.createElement('audio');
    this.clickAudio.src = 'audio/click.mp3';
    this.clickAudio.volume = 0.5;
    document.body.appendChild(this.clickAudio);

    // global button click listener
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.classList.contains('choice-card')) {
        if (this.clickAudio) {
          this.clickAudio.currentTime = 0;
          this.clickAudio.play().catch(() => {});
        }
      }
    });
  }
}

// Create global accessibility manager
const accessibility = new AccessibilityManager();

// Navigation helpers
function goBack() {
  window.history.back();
}

function goToResults() {
  window.location.href = 'results.html';
}

function startNewGame() {
  gameState.reset();
  window.location.href = 'index.html';
}
