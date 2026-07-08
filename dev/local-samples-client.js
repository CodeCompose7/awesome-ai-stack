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

  // Step 2 — the command preview updates live as the task is edited. DooD
  // samples show the detached + `docker logs -f` form (matching the README and
  // what actually runs): a foreground run is swallowed by nested Docker.
  function buildCmd(task) {
    var build = 'docker build -t ' + data.image + ' .';
    var q = task ? ' "' + task + '"' : '';
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
  taskEl.value = data.defaultTask || '';
  function refreshCmd() {
    cmdEl.textContent = buildCmd(taskEl.value.trim());
  }
  taskEl.addEventListener('input', refreshCmd);
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
  }
  function open() {
    modal.hidden = false;
    showStep(1);
  }
  function close() {
    modal.hidden = true;
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
    try {
      var resp = await fetch('__run', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ task: taskEl.value.trim() }),
      });
      var reader = resp.body.getReader();
      var dec = new TextDecoder();
      for (;;) {
        var res = await reader.read();
        if (res.done) break;
        logEl.textContent += dec.decode(res.value, { stream: true });
        logEl.scrollTop = logEl.scrollHeight;
      }
    } catch (e) {
      logEl.textContent += '\n[client error] ' + e.message;
    }
    running = false;
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
})();
