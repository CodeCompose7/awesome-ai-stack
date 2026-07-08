// Browser IIFE for the dev-only /local-samples run wizard. Read verbatim by
// dev/local-samples.mjs and injected into the folder listing page, so it must
// avoid template literals and ${...} (it lives inside a template literal there).
(function () {
  var el = document.getElementById('run-data');
  if (!el) return;
  var data = JSON.parse(el.textContent);
  var modal = document.getElementById('run-modal');
  var fields = document.getElementById('env-fields');
  var taskEl = document.getElementById('task');
  var cmdEl = document.getElementById('cmd-preview');
  var logEl = document.getElementById('run-log');
  var statusEl = document.getElementById('run-status');
  var recipeEl = document.getElementById('recipe');
  var recipeDescEl = document.getElementById('recipe-desc');

  function recipeById(id) {
    for (var i = 0; i < data.recipes.length; i++) if (data.recipes[i].id === id) return data.recipes[i];
    return data.recipes[0];
  }
  // The recipe picked on the page; captured when the wizard opens.
  var recipe = recipeEl.value;
  function syncRecipeDesc() {
    recipeDescEl.textContent = recipeById(recipeEl.value).desc || '';
  }
  recipeEl.addEventListener('change', syncRecipeDesc);
  syncRecipeDesc();

  // Persist the wizard state per sample in sessionStorage so a page refresh
  // doesn't lose the record: the modal reopens where it was, with the log. It
  // can't resume a live stream (the refresh drops the HTTP connection) — an
  // interrupted run shows its partial log with a note.
  var KEY = 'aas-run:' + data.folder;
  var state;
  try {
    state = JSON.parse(sessionStorage.getItem(KEY) || 'null');
  } catch (e) {}
  if (!state) state = { open: false, step: 1, task: '', recipe: recipe, log: '', status: '' };
  var lastSave = 0;
  function persist(force) {
    var now = Date.now();
    if (!force && now - lastSave < 400) return;
    lastSave = now;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
  }

  // Step 1 — build the env form from the .env.sample schema, prefilled with the
  // current .env values. Secret fields render masked with a show/hide toggle.
  data.env.forEach(function (f) {
    var wrap = document.createElement('div');
    wrap.className = 'field';
    var lab = document.createElement('label');
    lab.textContent = f.key;
    wrap.appendChild(lab);
    if (f.comment) {
      var hint = document.createElement('p');
      hint.className = 'hint';
      hint.textContent = f.comment;
      wrap.appendChild(hint);
    }
    var row = document.createElement('div');
    row.className = 'inrow';
    var inp = document.createElement('input');
    inp.name = f.key;
    inp.autocomplete = 'off';
    inp.spellcheck = false;
    var cur = data.values[f.key];
    inp.value = (cur != null ? cur : f.value) || '';
    inp.type = f.secret ? 'password' : 'text';
    row.appendChild(inp);
    if (f.secret) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'reveal';
      btn.textContent = 'show';
      btn.onclick = function () {
        var masked = inp.type === 'password';
        inp.type = masked ? 'text' : 'password';
        btn.textContent = masked ? 'hide' : 'show';
      };
      row.appendChild(btn);
    }
    wrap.appendChild(row);
    fields.appendChild(wrap);
  });

  // Step 2 — the command preview updates live as the task is edited, and
  // reflects the chosen recipe. A custom recipe runs its run/<id>.sh; the
  // built-in default assembles the docker command (DooD shows the detached +
  // `docker logs -f` form, matching the README and what actually runs).
  function buildCmd(task) {
    // Escape inner quotes so the preview matches what actually runs (shellish).
    var q = task ? ' "' + task.replace(/"/g, '\\"') + '"' : '';
    if (recipe !== '__default') {
      return 'bash run/' + recipe + '.sh' + q;
    }
    var build = 'docker build -t ' + data.image + ' .';
    if (data.dood) {
      return (
        build +
        '\ndocker logs -f "$(docker run -d --env-file .env' +
        ' -v /var/run/docker.sock:/var/run/docker.sock ' +
        data.image +
        q +
        ')"'
      );
    }
    return build + '\ndocker run --rm --env-file .env ' + data.image + q;
  }
  // Grow the task box to fit its content (it starts hidden, so also grow it
  // when step 2 is shown — a hidden textarea has no measurable scrollHeight).
  function autoGrow() {
    taskEl.style.height = 'auto';
    taskEl.style.height = taskEl.scrollHeight + 'px';
  }
  taskEl.value = data.defaultTask || '';
  function refreshCmd() {
    cmdEl.textContent = buildCmd(taskEl.value.trim());
  }
  taskEl.addEventListener('input', function () {
    autoGrow();
    refreshCmd();
    state.task = taskEl.value;
    persist();
  });
  refreshCmd();

  function showStep(n) {
    var panels = modal.querySelectorAll('[data-panel]');
    for (var i = 0; i < panels.length; i++) {
      panels[i].hidden = panels[i].getAttribute('data-panel') !== String(n);
    }
    var steps = modal.querySelectorAll('[data-step]');
    for (var j = 0; j < steps.length; j++) {
      steps[j].className = Number(steps[j].getAttribute('data-step')) <= n ? 'active' : '';
    }
    if (n === 2) autoGrow(); // measurable only now that the panel is visible
    state.step = n;
    persist(true);
  }
  function open() {
    recipe = recipeEl.value; // lock in the recipe chosen on the page
    refreshCmd();
    modal.hidden = false;
    state.open = true;
    state.recipe = recipe;
    persist(true);
    showStep(1);
  }
  function close() {
    modal.hidden = true;
    state.open = false;
    persist(true);
  }

  async function saveEnv(btn) {
    var values = {};
    var inputs = fields.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++) values[inputs[i].name] = inputs[i].value;
    btn.disabled = true;
    try {
      var r = await fetch('__env', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (r.ok) showStep(2);
      else alert('저장에 실패했습니다.');
    } finally {
      btn.disabled = false;
    }
  }

  var running = false;
  async function run() {
    if (running) return;
    running = true;
    showStep(3);
    logEl.textContent = '';
    // A ticking "실행 중… Ns" so a long-silent step (build, an LLM call the
    // container hasn't flushed yet) doesn't read as a hang.
    var startedAt = Date.now();
    statusEl.className = 'run-status busy';
    statusEl.textContent = '● 실행 중… 0s';
    state.status = 'running';
    state.log = '';
    persist(true);
    var timer = setInterval(function () {
      statusEl.textContent = '● 실행 중… ' + Math.round((Date.now() - startedAt) / 1000) + 's';
    }, 1000);
    try {
      var resp = await fetch('__run', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ task: taskEl.value.trim(), recipe: recipe }),
      });
      var reader = resp.body.getReader();
      var dec = new TextDecoder();
      for (;;) {
        var res = await reader.read();
        if (res.done) break;
        logEl.textContent += dec.decode(res.value, { stream: true });
        logEl.scrollTop = logEl.scrollHeight;
        state.log = logEl.textContent;
        persist(); // throttled
      }
    } catch (e) {
      logEl.textContent += '\n[client error] ' + e.message;
    }
    clearInterval(timer);
    statusEl.className = 'run-status';
    statusEl.textContent = '완료 · ' + Math.round((Date.now() - startedAt) / 1000) + 's';
    state.status = 'done';
    state.log = logEl.textContent;
    persist(true);
    running = false;
  }

  // Restore a prior session's wizard (survives a page refresh). A run that was
  // still streaming can't reconnect — show its partial log with a note.
  function restore() {
    if (!state.open) return;
    recipeEl.value = state.recipe;
    recipe = state.recipe;
    syncRecipeDesc();
    if (state.task) taskEl.value = state.task;
    refreshCmd();
    modal.hidden = false;
    if (state.step === 3) {
      logEl.textContent = state.log || '';
      statusEl.className = 'run-status';
      statusEl.textContent =
        state.status === 'running'
          ? '⚠ 새로고침으로 스트림이 끊겼습니다 — 컨테이너는 계속 실행 중일 수 있습니다. [다시 실행]으로 재실행하세요.'
          : state.status === 'done'
            ? '완료 (지난 실행 기록)'
            : '';
      showStep(3);
      logEl.scrollTop = logEl.scrollHeight;
    } else {
      showStep(state.step);
    }
  }

  document.getElementById('run-open').onclick = open;
  var closers = modal.querySelectorAll('[data-close]');
  for (var c = 0; c < closers.length; c++) closers[c].onclick = close;
  var nexts = modal.querySelectorAll('[data-next]');
  for (var n1 = 0; n1 < nexts.length; n1++)
    nexts[n1].onclick = function (ev) {
      saveEnv(ev.currentTarget);
    };
  var backs1 = modal.querySelectorAll('[data-back1]');
  for (var b1 = 0; b1 < backs1.length; b1++) backs1[b1].onclick = function () { showStep(1); };
  var backs2 = modal.querySelectorAll('[data-back2]');
  for (var b2 = 0; b2 < backs2.length; b2++) backs2[b2].onclick = function () { showStep(2); };
  var runs = modal.querySelectorAll('[data-run]');
  for (var r2 = 0; r2 < runs.length; r2++) runs[r2].onclick = run;
  modal.querySelector('.backdrop').onclick = close;

  restore();
})();
