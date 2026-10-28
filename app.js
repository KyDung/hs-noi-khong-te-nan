/* =====================================================================
   Trình chiếu "Học sinh nói KHÔNG với tệ nạn xã hội"
   - Điều hướng: → / Space / Enter / chuột / vuốt  (lùi: ← / Backspace)
   - Mỗi slide có nhiều "bước" (data-s) – nhấn thêm 1 lần sẽ hiện thêm 1 phần
   ===================================================================== */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Dữ liệu câu đố "Đuổi hình bắt chữ" ---------- */
const QUIZ = [
  { a: '<img src="img/ghost.png">',  b: '<img src="img/wine.png">',   ans: 'MA TÚY',            badge: 'no-drug' },
  { a: '<img src="img/flag.png">',   b: '<img src="img/silver.png">', ans: 'CỜ BẠC',            badge: 'no-bet' },
  { a: '<img src="img/bully.png">',  b: '<div style="position:relative;width:100%;height:100%"><img src="img/wifi.png" style="position:absolute;left:50%;top:0;width:44%;margin-left:-22%"><img src="img/globe.png" style="position:absolute;left:20%;bottom:0;width:60%"></div>', ans: 'BẠO LỰC MẠNG', badge: 'no-fight' },
  { a: '<img src="img/brain.png">',  b: '<img src="img/gamepad.png">', ans: 'NGHIỆN GAME',      badge: '' },
  { a: '<img src="img/fist.png">',   b: '<img src="img/schoolcartoon.png">', ans: 'BẠO LỰC HỌC ĐƯỜNG', badge: 'no-fight' },
  { a: '<img src="img/fish.png">',   b: '<img src="img/thermo.png">', ans: 'CÁ ĐỘ',             badge: 'no-bet' },
];

function buildQuiz() {
  const anchor = $('#quiz-anchor');
  QUIZ.forEach((q, i) => {
    const s = document.createElement('section');
    s.className = 'slide'; s.dataset.bg = 'quiz'; s.dataset.mood = 'quiz'; s.dataset.quiz = i;
    s.innerHTML = `
      ${q.badge ? `<div class="q-badge" data-s="0" data-fx="pop" data-float><img src="img/${q.badge}.png"></div>` : ''}
      <div class="q-banner" data-s="0" data-fx="drop">ĐUỔI HÌNH BẮT CHỮ</div>
      <div class="q-count" data-s="0" data-fx="right">Câu ${i + 1} / ${QUIZ.length}</div>

      <div class="q-card" data-s="0" data-fx="flip" data-d=".2" data-tilt="glass" data-float style="left:7rem">${q.a}</div>
      <div class="q-op"   data-s="0" data-fx="pop"  data-d=".5" style="left:31.5rem"><img src="img/plus.png"></div>
      <div class="q-card" data-s="0" data-fx="flip" data-d=".4" data-tilt="glass" data-float style="left:38rem">${q.b}</div>
      <div class="q-op"   data-s="0" data-fx="pop"  data-d=".7" style="left:62.5rem"><img src="img/equals.png"></div>
      <div class="q-ans"  data-s="0" data-fx="pop"  data-d=".9" style="left:69rem">
        <div class="flip" data-s="1" data-fx="flipcard">
          <div class="face front"><img src="img/qmark.png"></div>
          <div class="face back">${q.ans}</div>
        </div>
      </div>

      <div class="q-pill" data-s="0" data-fx="up" data-d="1.1" data-out="1">Đáp án là gì?</div>
      <div class="q-pill ans" data-s="1" data-fx="up" data-d=".5">Đáp án: ${q.ans}</div>
      <div class="q-note" data-s="0" data-fx="up" data-d="1.4" data-out="1">Nhấn để xem đáp án</div>`;
    anchor.before(s);
  });
  anchor.remove();
}

/* ---------- Hiệu ứng xuất hiện ---------- */
const FX = {
  up:    r => ({ from: { y: 60, opacity: 0 },                         to: { y: 0, opacity: 1, duration: .8, ease: 'power3.out' } }),
  left:  r => ({ from: { x: -150, opacity: 0 },                       to: { x: 0, opacity: 1, duration: .9, ease: 'power3.out' } }),
  right: r => ({ from: { x: 150, opacity: 0 },                        to: { x: 0, opacity: 1, duration: .9, ease: 'power3.out' } }),
  zoom:  r => ({ from: { scale: 1.7, opacity: 0 },                    to: { scale: 1, opacity: 1, duration: .9, ease: 'power4.out' } }),
  pop:   r => ({ from: { scale: 0, rotation: r - 25, opacity: 0 },    to: { scale: 1, rotation: r, opacity: 1, duration: .8, ease: 'back.out(2.2)' } }),
  rise:  r => ({ from: { y: 260, opacity: 0 },                        to: { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' } }),
  drop:  r => ({ from: { y: -420, rotation: r - 14, opacity: 0 },     to: { y: 0, rotation: r, opacity: 1, duration: 1.1, ease: 'bounce.out' } }),
  flip:  r => ({ from: { rotationX: -85, y: 50, opacity: 0, transformPerspective: 900 }, to: { rotationX: 0, y: 0, opacity: 1, duration: .85, ease: 'back.out(1.5)' } }),
  slam:  r => ({ from: { scale: 3.2, opacity: 0, transformOrigin: '100% 50%' }, to: { scale: 1, opacity: 1, duration: .45, ease: 'power4.in', onComplete: () => shake(14) } }),
  lineR: r => ({ from: { scaleX: 0, opacity: 1, transformOrigin: '100% 50%' }, to: { scaleX: 1, duration: .8, ease: 'power3.out' } }),
  line:  r => ({ from: { scaleX: 0, opacity: 1, transformOrigin: '0% 50%' }, to: { scaleX: 1, duration: .8, ease: 'power3.out' } }),
  note:  r => ({ from: { y: -120, rotation: r - 14, scale: .7, opacity: 0 }, to: { y: 0, rotation: r, scale: 1, opacity: 1, duration: 1, ease: 'back.out(2)' } }),
  finale:r => ({ from: { scale: .55, y: 90, opacity: 0 },             to: { scale: 1, y: 0, opacity: 1, duration: 1.5, ease: 'elastic.out(1,.55)', onStart: () => setTimeout(() => burst(innerWidth * .5, innerHeight * .8, 1.6), 350) } }),
  flipcard: r => ({ from: { rotationY: 0, opacity: 1 },               to: { rotationY: 180, opacity: 1, duration: 1, ease: 'back.out(1.3)', onStart: () => setTimeout(() => { burst(innerWidth * .74, innerHeight * .5, 1.5); shake(8); }, 450) } }),
};

function shake(a = 10) {
  gsap.fromTo('#stage', { x: -a }, { x: 0, duration: .7, ease: 'elastic.out(1,.15)' });
}

/* ---------- Trạng thái trình chiếu ---------- */
let slides = [], cur = -1, step = 0;

function decorate() {
  $$('[data-tilt]').forEach(el => {
    const w = document.createElement('div');
    w.className = 'tilt ' + (el.dataset.tilt || '');
    while (el.firstChild) w.appendChild(el.firstChild);
    el.appendChild(w);
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      w.style.transform = `perspective(900px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.04)`;
    });
    el.addEventListener('pointerleave', () => { w.style.transform = ''; });
  });
  $$('[data-float]').forEach(el => {
    const w = document.createElement('div');
    w.className = 'fl';
    w.style.animationDuration = (4 + Math.random() * 3).toFixed(2) + 's';
    w.style.animationDelay = (-Math.random() * 4).toFixed(2) + 's';
    while (el.firstChild) w.appendChild(el.firstChild);
    el.appendChild(w);
  });
}

function hideEl(el) {
  if (el.dataset.fx === 'flipcard') {
    gsap.killTweensOf(el); gsap.set(el, { clearProps: 'transform' }); gsap.set(el, { rotationY: 0, opacity: 1 });
    gsap.set($('.front', el), { opacity: 1 }); gsap.set($('.back', el), { opacity: 0 }); el._on = false; return;
  }
  const fx = FX[el.dataset.fx || 'up'](+el.dataset.rot || 0);
  gsap.killTweensOf(el);
  gsap.set(el, { clearProps: 'transform' });
  gsap.set(el, { ...fx.from, rotation: fx.from.rotation ?? (+el.dataset.rot || 0) });
  el._on = false;
}
function showEl(el, extraDelay) {
  if (el.dataset.fx === 'flipcard') {
    el._on = true; gsap.killTweensOf(el);
    gsap.timeline({ delay: extraDelay + .1 })
      .to(el, { rotationY: 90, transformPerspective: 1200, duration: .35, ease: 'power2.in' })
      .set($('.front', el), { opacity: 0 }).set($('.back', el), { opacity: 1 })
      .fromTo(el, { rotationY: -90 }, { rotationY: 0, duration: .6, ease: 'back.out(1.6)',
        onStart: () => { burst(innerWidth * .74, innerHeight * .5, 1.5); shake(8); } });
    return;
  }
  const fx = FX[el.dataset.fx || 'up'](+el.dataset.rot || 0);
  gsap.killTweensOf(el);
  gsap.fromTo(el, { ...fx.from, rotation: fx.from.rotation ?? (+el.dataset.rot || 0) },
    { rotation: +el.dataset.rot || 0, ...fx.to, delay: (+el.dataset.d || 0) + extraDelay });
  el._on = true;
}

function applyStep(sl, n, fresh) {
  let k = 0;
  sl._els.forEach(el => {
    const s = +el.dataset.s, out = el.dataset.out ? +el.dataset.out : Infinity;
    const want = s <= n && n < out;
    if (want && !el._on) showEl(el, fresh ? .25 : (s === n ? 0 : k++ * .05));
    else if (!want && el._on) hideEl(el);
  });
}

function setBG(name) {
  $$('#bg .bgl').forEach(l => gsap.to(l, { opacity: l.dataset.bg === name ? 1 : 0, duration: 1, ease: 'power2.inOut' }));
}

function goto(i, st = 0) {
  i = Math.max(0, Math.min(slides.length - 1, i));
  const dir = i >= cur ? 1 : -1;
  const old = slides[cur], nw = slides[i];
  if (i !== cur) {
    if (old) {
      gsap.killTweensOf(old);
      gsap.to(old, { opacity: 0, rotationY: -16 * dir, scale: .92, duration: .5, ease: 'power2.in',
        onComplete: () => { if (old !== slides[cur]) { old.classList.remove('active'); gsap.set(old, { clearProps: 'all' }); } } });
    }
    nw.classList.add('active');
    nw._els.forEach(hideEl);
    gsap.killTweensOf(nw);
    gsap.fromTo(nw, { opacity: 0, rotationY: 16 * dir, scale: 1.08 }, { opacity: 1, rotationY: 0, scale: 1, duration: .8, ease: 'power3.out', clearProps: 'transform' });
    setBG(nw.dataset.bg);
    setMood(nw.dataset.mood);
    camPunch();
    cur = i;
    step = Math.min(st, nw._max);
    applyStep(nw, step, true);
  } else {
    step = Math.min(st, nw._max);
    applyStep(nw, step, false);
  }
  updateHUD();
}

function next() { const sl = slides[cur]; if (step < sl._max) goto(cur, step + 1); else if (cur < slides.length - 1) goto(cur + 1, 0); }
function prev() { if (step > 0) goto(cur, step - 1); else if (cur > 0) goto(cur - 1, slides[cur - 1]._max); }

function updateHUD() {
  $('#bar').style.width = ((cur + (slides[cur]._max ? step / (slides[cur]._max + 1) : 0)) / slides.length * 100 + 100 / slides.length / 2) + '%';
  $$('#dots i').forEach((d, i) => d.classList.toggle('on', i === cur));
  $('#cnt').textContent = `${cur + 1} / ${slides.length}`;
  history.replaceState(null, '', '#' + (cur + 1) + (step ? '.' + step : ''));
}

/* ---------- Nền 3D (Three.js) ---------- */
const MOODS = {
  cover: { a: '#ffd23f', b: '#4da3ff', vy: .05,  vx: .02, spd: 1,   obj: .5 },
  dark:  { a: '#ff2a2a', b: '#ff9a3d', vy: .32,  vx: .04, spd: 1.6, obj: .18 },
  quiz:  { a: '#ffd23f', b: '#ff7a1c', vy: .07,  vx: .03, spd: 1.2, obj: .55 },
  why:   { a: '#ffd23f', b: '#7aa8ff', vy: .05,  vx: .02, spd: 1,   obj: .5 },
  cons:  { a: '#ff4d4d', b: '#ffb347', vy: -.04, vx: .03, spd: 1,   obj: .4 },
  skill: { a: '#5ee0ff', b: '#ffd23f', vy: .06,  vx: .03, spd: 1.1, obj: .5 },
  final: { a: '#ffd23f', b: '#6ee7a8', vy: .12,  vx: .02, spd: 1.3, obj: .55 },
};
let renderer, scene, camera, pts, ptsGeo, burstPts, burstGeo, burstState = [], burstHead = 0;
const mood = { a: new THREE.Color('#ffd23f'), b: new THREE.Color('#4da3ff'), vy: .05, vx: .02, spd: 1, obj: .5 };
let moodT = MOODS.cover;
const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
const N = 900, NB = 700, W = 46, H = 28, D = 24;

function sprite() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.35, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function initGL() {
  const canvas = $('#gl');
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); }
  catch (e) { canvas.style.display = 'none'; return false; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(55, 1, .1, 200); camera.position.z = 30;
  const tex = sprite();

  // bụi sáng
  ptsGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), size = new Float32Array(N), vel = new Float32Array(N * 3), mix = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    pos.set([(Math.random() - .5) * W * 2, (Math.random() - .5) * H * 2, (Math.random() - .5) * D * 2 - 4], i * 3);
    vel.set([(Math.random() - .5) * .02, Math.random() * .02, (Math.random() - .5) * .01], i * 3);
    size[i] = .12 + Math.pow(Math.random(), 3) * .9; mix[i] = Math.random();
  }
  ptsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  ptsGeo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
  ptsGeo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  ptsGeo.userData = { vel, mix };
  const mat = new THREE.ShaderMaterial({
    uniforms: { uMap: { value: tex }, uPx: { value: 900 } },
    vertexShader: 'attribute vec3 aColor;attribute float aSize;varying vec3 vC;uniform float uPx;void main(){vC=aColor;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=aSize*uPx/-mv.z;gl_Position=projectionMatrix*mv;}',
    fragmentShader: 'uniform sampler2D uMap;varying vec3 vC;void main(){vec4 t=texture2D(uMap,gl_PointCoord);gl_FragColor=vec4(vC,1.)*t.a;}',
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  pts = new THREE.Points(ptsGeo, mat); scene.add(pts);

  // pháo giấy
  burstGeo = new THREE.BufferGeometry();
  const bp = new Float32Array(NB * 3).fill(9999), bc = new Float32Array(NB * 3);
  burstGeo.setAttribute('position', new THREE.BufferAttribute(bp, 3));
  burstGeo.setAttribute('color', new THREE.BufferAttribute(bc, 3));
  burstPts = new THREE.Points(burstGeo, new THREE.PointsMaterial({ size: 1.1, map: tex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  burstPts.frustumCulled = false; scene.add(burstPts);
  for (let i = 0; i < NB; i++) burstState.push({ v: new THREE.Vector3(), life: 0, c: new THREE.Color() });

  resize(); addEventListener('resize', resize);
  return true;
}

function resize() {
  if (!renderer) return;
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  pts.material.uniforms.uPx.value = innerHeight * renderer.getPixelRatio() * .75;
}

function setMood(name) { moodT = MOODS[name] || MOODS.cover; }
function camPunch() { if (camera) gsap.fromTo(camera.position, { z: 38 }, { z: 30, duration: 1.8, ease: 'power3.out' }); }

const PALETTE = ['#ffd23f', '#ff4d6d', '#4dd2ff', '#ffffff', '#6ee7a8', '#ff9a3d', '#b28bff'].map(c => new THREE.Color(c));
function burst(px, py, power = 1) {
  if (!renderer) return;
  const v = new THREE.Vector3((px / innerWidth) * 2 - 1, -(py / innerHeight) * 2 + 1, .5).unproject(camera);
  const dir = v.sub(camera.position).normalize(), t = -camera.position.z / dir.z;
  const o = camera.position.clone().add(dir.multiplyScalar(t));
  const p = burstGeo.attributes.position.array;
  for (let k = 0; k < 220 * power; k++) {
    const i = burstHead = (burstHead + 1) % NB, s = burstState[i];
    const a = Math.random() * Math.PI * 2, u = Math.random() * 2 - 1, r = Math.sqrt(1 - u * u), sp = (.25 + Math.random() * .7) * power;
    s.v.set(r * Math.cos(a) * sp, r * Math.sin(a) * sp + .25, u * sp * .6);
    s.life = 1 + Math.random() * 1.2; s.c.copy(PALETTE[(Math.random() * PALETTE.length) | 0]);
    p.set([o.x, o.y, o.z], i * 3);
  }
}

const clock = new THREE.Clock();
function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
  // chuột
  mouse.sx += (mouse.x - mouse.sx) * .06; mouse.sy += (mouse.y - mouse.sy) * .06;
  const sl = slides[cur];
  if (sl) sl._px.forEach(el => { const d = +el.dataset.px; el.style.translate = `${(-mouse.sx * d).toFixed(1)}px ${(-mouse.sy * d * .6).toFixed(1)}px`; });
  if (!renderer) return;

  // mood
  const k = 1 - Math.pow(.02, dt);
  mood.a.lerp(new THREE.Color(moodT.a), k); mood.b.lerp(new THREE.Color(moodT.b), k);
  mood.vy += (moodT.vy - mood.vy) * k; mood.vx += (moodT.vx - mood.vx) * k; mood.spd += (moodT.spd - mood.spd) * k; mood.obj += (moodT.obj - mood.obj) * k;

  // bụi sáng
  const p = ptsGeo.attributes.position.array, c = ptsGeo.attributes.aColor.array, { vel, mix } = ptsGeo.userData;
  for (let i = 0; i < N; i++) {
    const j = i * 3;
    p[j]   += (vel[j]   + mood.vx * .5) * mood.spd * 60 * dt + Math.sin(t * .5 + i) * .004;
    p[j+1] += (vel[j+1] + mood.vy * .5) * mood.spd * 60 * dt;
    p[j+2] += vel[j+2] * 60 * dt;
    if (p[j+1] > H) p[j+1] = -H; else if (p[j+1] < -H) p[j+1] = H;
    if (p[j] > W) p[j] = -W; else if (p[j] < -W) p[j] = W;
    const m = mix[i], f = .55 + .45 * Math.sin(t * 1.3 + i * 1.7);
    c[j]   = (mood.a.r * (1 - m) + mood.b.r * m) * f;
    c[j+1] = (mood.a.g * (1 - m) + mood.b.g * m) * f;
    c[j+2] = (mood.a.b * (1 - m) + mood.b.b * m) * f;
  }
  ptsGeo.attributes.position.needsUpdate = ptsGeo.attributes.aColor.needsUpdate = true;

  // pháo giấy
  const bp = burstGeo.attributes.position.array, bc = burstGeo.attributes.color.array;
  for (let i = 0; i < NB; i++) {
    const s = burstState[i];
    if (s.life <= 0) { if (bp[i*3] < 9000) bp[i*3] = 9999; continue; }
    s.life -= dt; s.v.y -= .55 * dt; s.v.multiplyScalar(.985);
    bp[i*3] += s.v.x * 60 * dt * .6; bp[i*3+1] += s.v.y * 60 * dt * .6; bp[i*3+2] += s.v.z * 60 * dt * .6;
    const f = Math.max(0, Math.min(1, s.life));
    bc[i*3] = s.c.r * f; bc[i*3+1] = s.c.g * f; bc[i*3+2] = s.c.b * f;
  }
  burstGeo.attributes.position.needsUpdate = burstGeo.attributes.color.needsUpdate = true;

  camera.position.x += (mouse.sx * 2.5 - camera.position.x) * .05;
  camera.position.y += (-mouse.sy * 1.6 - camera.position.y) * .05;
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}

/* ---------- Khởi tạo ---------- */
function init() {
  buildQuiz();
  decorate();
  slides = $$('#stage .slide');
  slides.forEach(sl => {
    sl._els = $$('[data-s]', sl);
    sl._px = $$('[data-px]', sl);
    sl._max = Math.max(0, ...sl._els.map(e => +e.dataset.s));
    sl._els.forEach(hideEl);
  });
  $('#dots').innerHTML = slides.map(() => '<i></i>').join('');
  $$('#dots i').forEach((d, i) => d.addEventListener('click', e => { e.stopPropagation(); goto(i, 0); }));
  $('#next').onclick = e => { e.stopPropagation(); next(); };
  $('#prev').onclick = e => { e.stopPropagation(); prev(); };
  $('#fs').onclick = e => { e.stopPropagation(); toggleFS(); };

  addEventListener('keydown', e => {
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') goto(0, 0);
    else if (e.key === 'End') goto(slides.length - 1, slides[slides.length - 1]._max);
    else if (e.key.toLowerCase() === 'f') toggleFS();
  });
  $('#stage').addEventListener('click', e => { if (e.clientX < innerWidth * .12) prev(); else next(); });
  let tx = 0;
  addEventListener('pointerdown', e => { tx = e.clientX; });
  addEventListener('pointerup', e => { if (e.pointerType === 'touch') { const d = e.clientX - tx; if (d < -50) next(); else if (d > 50) prev(); } });

  let idle;
  addEventListener('pointermove', e => {
    mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = e.clientY / innerHeight * 2 - 1;
    $('#hud').classList.remove('hide'); $('#help').style.opacity = 1; document.body.style.cursor = '';
    clearTimeout(idle); idle = setTimeout(() => { $('#hud').classList.add('hide'); $('#help').style.opacity = 0; document.body.style.cursor = 'none'; }, 2800);
  });

  initGL();
  const m = location.hash.match(/^#(\d+)(?:\.(\d+))?/);
  goto(m ? +m[1] - 1 : 0, m && m[2] ? +m[2] : 0);
  loop();
}
function toggleFS() { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(); }

addEventListener('load', () => (document.fonts?.ready || Promise.resolve()).then(init));
