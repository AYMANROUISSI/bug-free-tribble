// ---------- Hero terminal: types a developer object ----------
const lines = [
  '<span class="k">const</span> developer = {',
  '  name: <span class="s">"Ayman Rouissi"</span>,',
  '  role: <span class="s">"Full-Stack Developer"</span>,',
  '  location: <span class="s">"Hay Baraka, Moulay Rachid"</span>,',
  '  stack: [<span class="s">"JavaScript"</span>, <span class="s">"React"</span>, <span class="s">"Node.js"</span>],',
  '  learning: <span class="s">"Rust"</span>,',
  '  openToWork: <span class="s">true</span>,',
  '  coffeePerDay: <span class="s">3</span>',
  '};',
  '',
  'developer.<span class="k">hire</span>(); <span class="k">// ready when you are</span>'
];

const typed = document.getElementById('typed');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function typeLines() {
  if (reduceMotion) {
    typed.innerHTML = lines.join('\n');
    return;
  }
  let line = 0, char = 0, html = '';

  function tick() {
    if (line >= lines.length) return;
    const current = lines[line];
    // Skip over HTML tags instantly so markup is never split
    if (current[char] === '<') {
      char = current.indexOf('>', char) + 1;
    } else {
      char++;
    }
    typed.innerHTML = html + current.slice(0, char);
    if (char >= current.length) {
      html += current + '\n';
      line++;
      char = 0;
      setTimeout(tick, 220);
    } else {
      setTimeout(tick, 28);
    }
  }
  tick();
}
typeLines();

// ---------- Mobile menu ----------
const toggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

toggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  toggle.firstElementChild.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
});

navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.firstElementChild.className = 'fa-solid fa-bars';
  })
);

// ---------- Navbar border on scroll ----------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ---------- Highlight the current section in the navbar ----------
const links = navLinks.querySelectorAll('a');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('main section[id]').forEach(s => observer.observe(s));

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// =========================================================
// More animation
// =========================================================

// ---------- Scroll progress bar ----------
const bar = document.createElement('div');
bar.className = 'progress';
document.body.prepend(bar);
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ---------- Hero name: letters drop in one by one ----------
const h1 = document.querySelector('.hero h1');
if (h1 && !reduceMotion) {
  const text = h1.textContent;
  h1.setAttribute('aria-label', text);
  h1.innerHTML = [...text].map((c, i) =>
    c === ' ' ? ' ' : `<span class="ch" aria-hidden="true" style="animation-delay:${0.2 + i * 0.06}s">${c}</span>`
  ).join('');
}

if (!reduceMotion) {
  document.documentElement.classList.add('js');

  // ---------- Scroll reveals, a different direction per element type ----------
  const rules = [
    ['h2',                 { y: '20px' }],
    ['.about-grid > *',    { y: '30px' }],
    ['.t-item',            { x: '-40px', y: '0px' }],
    ['.skill-group h3',    { y: '16px' }],
    ['.chips li',          { y: '0px', s: '.5' }],
    ['.project',           { y: '0px', alt: true }],
    ['.footer > p, .footer > a', { y: '24px' }],
    ['.socials li',        { y: '0px', s: '.4' }]
  ];

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('in');
      io.unobserve(el);
      // Hand control back to normal hover styles once the reveal is done
      const delay = parseFloat(el.style.getPropertyValue('--d')) || 0;
      setTimeout(() => el.classList.remove('reveal', 'in'), (delay + 1.2) * 1000);
    });
  }, { threshold: 0.15 });

  rules.forEach(([selector, o]) => {
    document.querySelectorAll(selector).forEach(el => {
      const i = Array.from(el.parentElement.children).indexOf(el);
      el.classList.add('reveal');
      el.style.setProperty('--d', (i * 0.08) + 's');
      if (o.y !== undefined) el.style.setProperty('--y', o.y);
      if (o.x !== undefined) el.style.setProperty('--x', o.x);
      if (o.s !== undefined) el.style.setProperty('--s', o.s);
      if (o.alt) el.style.setProperty('--x', i % 2 ? '60px' : '-60px');
      io.observe(el);
    });
  });

  // Timeline lines grow when they scroll into view
  const tio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); tio.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.timeline').forEach(t => tio.observe(t));

  // ---------- Hero background: particle network that reacts to the mouse ----------
  const cv = document.createElement('canvas');
  cv.className = 'bg-canvas';
  cv.setAttribute('aria-hidden', 'true');
  document.body.prepend(cv);
  const ctx = cv.getContext('2d');
  const mouse = { x: -999, y: -999 };
  let w, h, pts = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // sharp on retina / 4K screens
    w = window.innerWidth;
    h = window.innerHeight;
    cv.width = w * dpr;
    cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(70, Math.floor((w * h) / 20000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4
    }));
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 16.67, 3); // 1 = one frame at 60fps
    last = now;
    if (window.scrollY < window.innerHeight) { // only draw while the hero is visible
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const dx = p.x - mouse.x, dy = p.y - mouse.y, md = Math.hypot(dx, dy);
        if (md < 120) { p.x += (dx / md) * 1.5 * dt; p.y += (dy / md) * 1.5 * dt; } // dots flee the cursor
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = 'rgba(252,241,208,0.6)';
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2); ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(252,241,208,${0.22 * (1 - d / 130)})`;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // ---------- Terminal tilts toward the cursor ----------
  const term = document.querySelector('.terminal');
  if (term && window.matchMedia('(hover: hover)').matches) {
    term.addEventListener('mousemove', e => {
      if (document.activeElement && document.activeElement.id === 'termIn') return; // no tilt while typing
      const r = term.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      term.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg)`;
    });
    term.addEventListener('mouseleave', () => { term.style.transform = ''; });
  }
}

// =========================================================
// Interactive terminal: visitors can type real commands
// =========================================================
(function () {
  const input = document.getElementById('termIn');
  const out = document.getElementById('termOut');
  if (!input || !out) return;

  const EMAIL = 'aymanrouissi.off@gmail.com';
  const sections = ['about', 'education', 'skills', 'experience', 'projects'];
  const history = [];
  let pos = 0;

  const commands = {
    help: () => [
      'Available commands:',
      '  about        who I am',
      '  skills       my tech stack',
      '  projects     what I have built',
      '  contact      how to reach me',
      '  goto <name>  jump to a section',
      '  whoami | ls | clear',
      '  sudo hire ayman'
    ].join('\n'),
    about: () => 'Ayman Rouissi, full-stack developer from Hay Baraka, Moulay Rachid.\nI turn messy problems into simple, reliable products.',
    skills: () => 'frontend : HTML, CSS, JavaScript, React\nbackend  : Node.js, Python, SQL, REST APIs\ntools    : Git, GitHub, Docker, Linux',
    projects: () => 'TaskFlow, WeatherLens, ShortLink\nType "goto projects" to see them.',
    contact: () => EMAIL + '\nTip: try "sudo hire ayman" ;)',
    whoami: () => 'visitor (future colleague?)',
    ls: () => 'about/  education/  skills/  experience/  projects/  contact.txt',
    goto: (arg) => {
      if (!sections.includes(arg)) return 'usage: goto <' + sections.join(' | ') + '>';
      document.getElementById(arg).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      return 'Jumping to ' + arg + '...';
    }
  };

  function print(text, cls) {
    const div = document.createElement('div');
    if (cls) div.className = cls;
    div.textContent = text;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  }

  function run(raw) {
    const line = raw.trim();
    if (!line) return;
    history.push(line);
    pos = history.length;
    print('$ ' + line, 'cmd');

    const [name, ...rest] = line.toLowerCase().split(/\s+/);
    const arg = rest.join(' ');

    if (name === 'clear') { out.textContent = ''; return; }
    if (name === 'sudo' && arg === 'hire ayman') {
      print('Permission granted. Opening your mail app...');
      setTimeout(() => { window.location.href = 'mailto:' + EMAIL + '?subject=Let%27s%20work%20together'; }, 700);
      return;
    }
    if (commands[name]) print(commands[name](arg));
    else print('command not found: ' + name + '. Type "help".');
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { run(input.value); input.value = ''; }
    else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault(); pos = Math.max(0, pos - 1); input.value = history[pos] || '';
    } else if (e.key === 'ArrowDown' && history.length) {
      e.preventDefault(); pos = Math.min(history.length, pos + 1); input.value = history[pos] || '';
    }
  });

  // Click anywhere on the terminal to start typing
  document.querySelector('.terminal').addEventListener('click', () => input.focus({ preventScroll: true }));
})();