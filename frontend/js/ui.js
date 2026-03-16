(function () {
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let notificationStack;
  let fxLayer;
  let dayOverlay;
  let loadingOverlay;
  const LOADING_SESSION_KEY = "techtycoon_loading_target";
  const LOADING_DURATION_MS = 6000;

  function reducedMotion() {
    return reducedMotionQuery.matches;
  }

  function ensureLayers() {
    if (!notificationStack) {
      notificationStack = document.createElement("div");
      notificationStack.className = "notification-stack";
      notificationStack.setAttribute("aria-live", "polite");
      notificationStack.setAttribute("aria-atomic", "true");
      document.body.appendChild(notificationStack);
    }

    if (!fxLayer) {
      fxLayer = document.createElement("div");
      fxLayer.className = "fx-layer";
      fxLayer.setAttribute("aria-hidden", "true");
      document.body.appendChild(fxLayer);
    }

    if (!dayOverlay) {
      dayOverlay = document.createElement("div");
      dayOverlay.className = "day-overlay";
      dayOverlay.setAttribute("aria-hidden", "true");
      dayOverlay.innerHTML = `
        <div class="day-overlay__panel">
          <div class="day-overlay__eyebrow">Startup Sprint Update</div>
          <h2 class="day-overlay__title"></h2>
          <p class="day-overlay__meta"></p>
        </div>
      `;
      document.body.appendChild(dayOverlay);
    }

    if (!loadingOverlay) {
      loadingOverlay = document.createElement("div");
      loadingOverlay.className = "loading-overlay";
      loadingOverlay.setAttribute("aria-hidden", "true");
      loadingOverlay.innerHTML = `
        <div class="loading-overlay__panel">
          <div class="loading-overlay__scene" aria-hidden="true">
            <div class="loading-orbit loading-orbit--outer"></div>
            <div class="loading-orbit loading-orbit--mid"></div>
            <div class="loading-orbit loading-orbit--inner"></div>
            <div class="loading-hub">
              <span class="loading-hub__core"></span>
              <span class="loading-hub__pulse"></span>
            </div>
            <span class="loading-node loading-node--blue"></span>
            <span class="loading-node loading-node--gold"></span>
            <span class="loading-node loading-node--green"></span>
            <div class="loading-grid"></div>
          </div>
          <button class="loading-overlay__button" type="button" tabindex="-1">Loading next stage</button>
        </div>
      `;
      document.body.appendChild(loadingOverlay);
    }
  }

  function formatCurrency(value) {
    const abs = Math.abs(Math.round(value));
    const text = "$" + abs.toLocaleString();
    if (value < 0) return "-" + text;
    if (value > 0) return "+" + text;
    return text;
  }

  function animateValue(element, targetValue, options = {}) {
    if (!element) return;

    const {
      duration = reducedMotion() ? 0 : 480,
      formatter = (value) => String(Math.round(value)),
      pulseClass
    } = options;

    const startValue = Number(element.dataset.value || 0);
    const endValue = Number(targetValue);
    element.dataset.value = String(endValue);

    if (!duration || startValue === endValue) {
      element.textContent = formatter(endValue);
      if (pulseClass) pulseMetric(element, pulseClass);
      return;
    }

    const startTime = performance.now();

    function frame(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + (endValue - startValue) * eased;
      element.textContent = formatter(nextValue);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        element.textContent = formatter(endValue);
        if (pulseClass) pulseMetric(element, pulseClass);
      }
    }

    requestAnimationFrame(frame);
  }

  function pulseMetric(element, kind) {
    if (!element) return;
    element.classList.remove("metric-flash-positive", "metric-flash-negative", "metric-flash-neutral");
    const className = kind === "positive"
      ? "metric-flash-positive"
      : kind === "negative"
        ? "metric-flash-negative"
        : "metric-flash-neutral";
    element.classList.add(className);
    window.setTimeout(() => element.classList.remove(className), reducedMotion() ? 60 : 700);
  }

  function revealElements(scope) {
    const root = scope || document;
    const selectors = [
      ".welcome-content",
      ".welcome-description",
      ".stage-container",
      ".rules-container > h2",
      ".rules-container > h3",
      ".rules-container > p",
      ".rules-container > ul",
      ".rules-container > ol",
      ".metric-box",
      ".decision-example",
      ".highlight-box",
      ".avatar-card",
      ".problem-card",
      ".choice-card",
      ".score-card",
      ".metric-card",
      ".results-message",
      ".reflection-section",
      "#summary-section",
      ".nav-footer",
      "#deadline-strip"
    ];

    const nodes = root.querySelectorAll(selectors.join(","));
    nodes.forEach((node, index) => {
      if (node.dataset.revealReady === "true") return;
      node.dataset.revealReady = "true";
      node.style.setProperty("--reveal-index", String(index));
      node.classList.add("reveal-item");
      requestAnimationFrame(() => node.classList.add("reveal-item--visible"));
    });
  }

  function initPage() {
    ensureLayers();
    revealElements(document);
    document.body.classList.add("game-ui");
    const pendingTarget = sessionStorage.getItem(LOADING_SESSION_KEY);
    if (pendingTarget) {
      sessionStorage.removeItem(LOADING_SESSION_KEY);
      showLoadingOverlay(formatLoadingLabel(pendingTarget));
      window.setTimeout(hideLoadingOverlay, reducedMotion() ? 120 : LOADING_DURATION_MS);
    }
    requestAnimationFrame(() => document.body.classList.add("page-ready"));
    setupNavigationInterception();
  }

  function setupNavigationInterception() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("button[onclick]");
      if (!button) return;

      const onclick = button.getAttribute("onclick") || "";
      const match = onclick.match(/window\.location\.href='([^']+\.html)'/);
      if (!match) return;

      event.preventDefault();
      navigate(match[1]);
    });
  }

  function navigate(url) {
    if (!url) return false;
    if (reducedMotion()) {
      window.location.href = url;
      return true;
    }

    sessionStorage.setItem(LOADING_SESSION_KEY, url);
    showLoadingOverlay(formatLoadingLabel(url));
    document.body.classList.add("page-exit");
    window.setTimeout(() => {
      window.location.href = url;
    }, 320);
    return true;
  }

  function transitionBack() {
    if (reducedMotion()) {
      window.history.back();
      return true;
    }

    sessionStorage.setItem(LOADING_SESSION_KEY, "back");
    showLoadingOverlay("Loading previous stage");
    document.body.classList.add("page-exit");
    window.setTimeout(() => window.history.back(), 320);
    return true;
  }

  function formatLoadingLabel(url) {
    const file = (url || "").split("/").pop() || "";
    if (file.includes("stage")) return "Loading next stage";
    if (file.includes("results")) return "Compiling results";
    if (file.includes("brief")) return "Preparing mission brief";
    if (file.includes("team")) return "Building your team board";
    if (file.includes("problem")) return "Loading scenarios";
    return "Loading";
  }

  function showLoadingOverlay(label = "Loading next stage") {
    ensureLayers();
    if (!loadingOverlay) return;
    const button = loadingOverlay.querySelector(".loading-overlay__button");
    if (button) button.textContent = label;
    loadingOverlay.classList.add("is-visible");
    loadingOverlay.setAttribute("aria-hidden", "false");
  }

  function hideLoadingOverlay() {
    if (!loadingOverlay) return;
    loadingOverlay.classList.remove("is-visible");
    loadingOverlay.setAttribute("aria-hidden", "true");
  }

  function showNotification({ title, message = "", type = "info", duration = 2600 }) {
    ensureLayers();
    const card = document.createElement("article");
    card.className = `sim-notification sim-notification--${type}`;
    card.innerHTML = `
      <strong>${title}</strong>
      ${message ? `<p>${message}</p>` : ""}
    `;

    notificationStack.appendChild(card);
    requestAnimationFrame(() => card.classList.add("is-visible"));

    window.setTimeout(() => {
      card.classList.remove("is-visible");
      window.setTimeout(() => card.remove(), reducedMotion() ? 0 : 300);
    }, reducedMotion() ? 1200 : duration);
  }

  function showFloatingDelta(target, deltas) {
    ensureLayers();
    const rect = target.getBoundingClientRect();
    const group = document.createElement("div");
    group.className = "floating-delta";
    group.style.left = `${rect.left + rect.width / 2}px`;
    group.style.top = `${rect.top + window.scrollY + 10}px`;

    group.innerHTML = deltas.map((delta) => {
      const valueText = delta.currency ? formatCurrency(delta.value) : `${delta.value > 0 ? "+" : ""}${delta.value}`;
      return `
        <div class="floating-delta__item floating-delta__item--${delta.kind}">
          <span class="floating-delta__label">${delta.label}</span>
          <strong>${valueText}</strong>
        </div>
      `;
    }).join("");

    fxLayer.appendChild(group);
    requestAnimationFrame(() => group.classList.add("is-visible"));

    window.setTimeout(() => {
      group.classList.remove("is-visible");
      window.setTimeout(() => group.remove(), reducedMotion() ? 0 : 350);
    }, reducedMotion() ? 900 : 1400);
  }

  function showDayOverlay({ day, remaining, deadlineLabel = "", tense = false }) {
    ensureLayers();
    const title = dayOverlay.querySelector(".day-overlay__title");
    const meta = dayOverlay.querySelector(".day-overlay__meta");
    title.textContent = `Day ${day}`;
    meta.textContent = `${remaining} day${remaining === 1 ? "" : "s"} remaining${deadlineLabel ? ` until ${deadlineLabel}` : ""}`;

    dayOverlay.classList.remove("is-tense");
    if (tense) dayOverlay.classList.add("is-tense");
    dayOverlay.classList.add("is-visible");
    dayOverlay.setAttribute("aria-hidden", "false");

    window.setTimeout(() => {
      dayOverlay.classList.remove("is-visible");
      dayOverlay.setAttribute("aria-hidden", "true");
    }, reducedMotion() ? 700 : 1300);
  }

  function revealSequence(nodes, stepMs = 120) {
    const list = Array.from(nodes || []);
    list.forEach((node, index) => {
      node.style.setProperty("--reveal-index", String(index));
      node.classList.add("reveal-item");
      if (reducedMotion()) {
        node.classList.add("reveal-item--visible");
        return;
      }
      window.setTimeout(() => node.classList.add("reveal-item--visible"), index * stepMs);
    });
  }

  document.addEventListener("DOMContentLoaded", initPage);

  window.TechTycoonUI = {
    animateValue,
    formatCurrency,
    navigate,
    transitionBack,
    pulseMetric,
    revealElements,
    revealSequence,
    showNotification,
    showFloatingDelta,
    showDayOverlay,
    showLoadingOverlay,
    hideLoadingOverlay,
    loadingDuration: () => LOADING_DURATION_MS,
    reducedMotion
  };
})();
