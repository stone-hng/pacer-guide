'use strict';

(() => {
  const gate = document.getElementById('entry-gate');
  const guide = document.getElementById('guide-content');
  const answer = document.getElementById('entry-answer');
  const entryError = document.getElementById('entry-error');
  document.getElementById('entry-form').addEventListener('submit', event => {
    event.preventDefault();
    const normalized = answer.value.replace(/\s/g, '').toLowerCase();
    if (!['krc', '카카오러닝클럽', '카런클'].includes(normalized)) {
      entryError.textContent = '다시 한번 확인해주세요.';
      answer.setAttribute('aria-invalid', 'true');
      answer.focus();
      return;
    }
    gate.hidden = true;
    guide.hidden = false;
    const courseVideo = document.getElementById('course-video-player');
    courseVideo.src = courseVideo.dataset.src;
    answer.value = '';
    const main = document.getElementById('main');
    main.setAttribute('tabindex', '-1');
    main.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
    renderScroll();
  });
  answer.addEventListener('input', () => {
    answer.removeAttribute('aria-invalid');
    entryError.textContent = '';
  });
  const targets = [45, 50, 55, 60, 65, 70];
  const storageKey = 'pacer-guide-v1';
  let target = 60;
  let checks = [];
  let storageAvailable = true;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (saved && targets.includes(saved.target)) target = saved.target;
    if (saved && Array.isArray(saved.checks)) checks = saved.checks.filter(v => typeof v === 'string');
  } catch { storageAvailable = false; }

  const time = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  const pace = seconds => `${Math.floor(seconds / 60)}′${String(seconds % 60).padStart(2, '0')}″`;
  const speak = seconds => `${Math.floor(seconds / 60)}분${seconds % 60 ? ` ${seconds % 60}초` : ''}`;
  const setAll = (selector, value) => document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
  const checkboxes = [...document.querySelectorAll('.check-items input')];
  const storageNote = document.getElementById('storage-note');

  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify({ target, checks: checkboxes.filter(el => el.checked).map(el => el.value) })); }
    catch { storageAvailable = false; }
    storageNote.textContent = storageAvailable ? '체크 상태는 이 브라우저에만 저장됩니다.' : '현재 화면에서만 유지됩니다. 브라우저 저장소를 사용할 수 없습니다.';
  }

  function renderCheckpoint() {
    const range = document.getElementById('km-range');
    const km = Number(range.value);
    const seconds = target * 6 * km;
    document.getElementById('km-value').value = String(km);
    document.getElementById('checkpoint-time').textContent = time(seconds);
    range.setAttribute('aria-valuetext', `${km}km, 목표 ${speak(seconds)}`);
  }

  function renderPace() {
    const perKm = target * 6;
    setAll('[data-target]', target);
    setAll('[data-pace]', pace(perKm));
    setAll('[data-half]', time(perKm * 5));
    setAll('[data-finish]', time(target * 60));
    setAll('[data-third]', time(perKm * 3));
    document.getElementById('early-time').textContent = time(perKm * 3 - 15);
    document.getElementById('spoken-pace').textContent = speak(perKm);
    document.querySelectorAll('input[name=target]').forEach(el => { el.checked = Number(el.value) === target; });
    const rows = document.getElementById('split-rows');
    rows.replaceChildren(...Array.from({ length: 10 }, (_, i) => {
      const row = document.createElement('tr');
      const heading = document.createElement('th');
      const value = document.createElement('td');
      heading.scope = 'row';
      heading.textContent = `${i + 1} km`;
      value.textContent = time(perKm * (i + 1));
      row.append(heading, value);
      return row;
    }));
    renderCheckpoint();
  }

  document.querySelectorAll('input[name=target]').forEach(input => {
    input.addEventListener('change', () => {
      const next = Number(input.value);
      if (!targets.includes(next)) return;
      target = next;
      renderPace();
      save();
    });
  });
  document.getElementById('km-range').addEventListener('input', renderCheckpoint);

  const metrics = {
    elapsed: ['경과 시간이 기준입니다.', '공식 km 표지를 통과할 때 목표 누적 시간과 비교하세요. 급수나 혼잡으로 늦어진 시간도 포함해야 하므로 자동 일시정지는 끕니다.'],
    lap: ['최근 구간의 속도를 살피세요.', '현재 랩 시작 이후의 평균입니다. 전체 평균보다 최근 속도를 살피기에 유용합니다. 단, 새 랩 직후에는 데이터가 적으므로 숫자 한 번에 급가감속하지 마세요.'],
    distance: ['GPS 거리는 보조 정보입니다.', '공식 3km 표지에서 시계가 3.05km여도, 경과 시간이 목표와 같으면 계획대로입니다. 화면 거리만 맞추려고 속도를 바꾸지 마세요.']
  };
  document.querySelectorAll('[data-metric]').forEach(button => {
    button.addEventListener('click', () => {
      const selected = metrics[button.dataset.metric];
      document.querySelectorAll('[data-metric]').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
      document.getElementById('metric-title').textContent = selected[0];
      document.getElementById('metric-copy').textContent = selected[1];
    });
  });

  const cases = {
    gps: { answer: 'keep', good: '맞습니다. 공식 거리 표지와 누적 시간으로 보면 계획대로입니다. GPS 거리 차이만으로 페이스를 바꾸지 않습니다.', retry: '시계의 GPS 거리는 공식 거리와 다를 수 있어요. 이 상황은 공식 표지의 누적 시간이 목표와 같으므로 페이스를 유지합니다.' },
    water: { answer: 'keep', good: '맞습니다. 두 페이서 모두 목표 페이스를 유지합니다. 참가자가 다시 합류했을 때 같은 속도로 달릴 수 있도록 하되, 무리한 추격을 유도하지 않습니다.', retry: '기다리기 위해 페이스를 바꾸면 기준점이 달라집니다. 두 명 모두 원래 페이스로 계속 가고, 참가자에게는 본인 상태에 맞춰 달리도록 안내합니다.' },
    early: { answer: 'settle', good: '맞습니다. 구간 페이스를 확인하고 목표 페이스로 부드럽게 돌아옵니다. 시간을 더 벌거나 15초를 없애려고 갑자기 느려지거나 멈추지 않습니다.', retry: '초반에 시간을 벌어두는 것은 이븐 페이싱의 목표가 아닙니다. 과속 중인지 확인하고 목표 페이스로 부드럽게 돌아옵니다.' }
  };
  document.querySelectorAll('[data-case]').forEach(button => {
    button.addEventListener('click', () => {
      const entry = cases[button.dataset.case];
      const correct = entry.answer === button.dataset.answer;
      document.querySelectorAll(`[data-case="${button.dataset.case}"]`).forEach(el => {
        el.setAttribute('aria-pressed', String(el === button));
        el.classList.toggle('correct', el === button && correct);
      });
      const feedback = document.getElementById(`feedback-${button.dataset.case}`);
      feedback.textContent = correct ? entry.good : entry.retry;
      feedback.classList.toggle('good', correct);
    });
  });

  function renderChecks() {
    const count = checkboxes.filter(input => input.checked).length;
    document.getElementById('check-count').textContent = `${count} / ${checkboxes.length}${count === checkboxes.length ? ' · 준비 완료' : ''}`;
  }
  checkboxes.forEach(input => {
    input.checked = checks.includes(input.value);
    input.addEventListener('change', () => { renderChecks(); save(); });
  });
  document.getElementById('reset-checks').addEventListener('click', () => {
    checkboxes.forEach(input => { input.checked = false; });
    renderChecks(); save();
  });

  const index = document.querySelector('.index');
  const toggle = document.getElementById('index-toggle');
  const navLinks = [...document.querySelectorAll('.index-links>a')];
  index.classList.add('enhanced');
  function closeIndex() { index.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  toggle.addEventListener('click', () => {
    const open = index.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  index.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeIndex(); toggle.focus(); }
  });
  navLinks.forEach(link => link.addEventListener('click', () => {
    closeIndex();
    if (matchMedia('(max-width: 999px)').matches) {
      const section = document.querySelector(link.getAttribute('href'));
      section.setAttribute('tabindex', '-1');
      section.focus({ preventScroll: true });
    }
  }));
  document.addEventListener('click', event => { if (!index.contains(event.target)) closeIndex(); });
  const chapters = [...document.querySelectorAll('.chapter')];
  let framePending = false;
  function renderScroll() {
    framePending = false;
    const threshold = window.innerWidth < 1000 ? 150 : 180;
    let active = chapters[0];
    for (const chapter of chapters) { if (chapter.getBoundingClientRect().top <= threshold) active = chapter; }
    navLinks.forEach(link => {
      const current = link.hash === `#${active.id}`;
      if (current) {
        link.setAttribute('aria-current', 'location');
        document.getElementById('current-section').textContent = `${link.children[0].textContent} · ${link.childNodes[1].textContent.trim()}`;
      } else link.removeAttribute('aria-current');
    });
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 1;
    document.getElementById('reading-progress').style.width = `${fraction * 100}%`;
  }
  function scheduleScroll() { if (!framePending) { framePending = true; requestAnimationFrame(renderScroll); } }
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll);
  document.querySelectorAll('details').forEach(el => el.addEventListener('toggle', scheduleScroll));

  let printedDetails = [];
  window.addEventListener('beforeprint', () => {
    printedDetails = [...document.querySelectorAll('details:not([open])')];
    printedDetails.forEach(el => { el.open = true; });
  });
  window.addEventListener('afterprint', () => { printedDetails.forEach(el => { el.open = false; }); });
  renderPace(); renderChecks(); renderScroll();
  if (!storageAvailable) storageNote.textContent = '현재 화면에서만 유지됩니다. 브라우저 저장소를 사용할 수 없습니다.';
})();
