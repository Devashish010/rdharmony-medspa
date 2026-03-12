/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */
const SERVICES = [
  {id:'botox',name:'Botox & Dysport',icon:'💉',cat:'Injectables',desc:'Smooth fine lines and restore youthful expression with precision-administered neuromodulators. Natural results, every time.',price:'From $9/unit',duration:'30–60 min',popular:true,
   details:'Botox and Dysport are neurotoxins that temporarily relax targeted facial muscles, smoothing wrinkles and preventing new lines from forming. Common areas include forehead, crow\'s feet, frown lines, brow lift, and lip flip.',
   bullets:['Results last 3–6 months','No downtime required','Natural-looking results','Preventive anti-aging benefits','Same-day return to activities']},
  {id:'prp-face',name:'PRP — Face',icon:'✨',cat:'PRP Therapy',desc:'Platelet-Rich Plasma facial rejuvenation. Harness your body\'s own healing power for remarkable skin renewal and radiance.',price:'From $450',duration:'60–90 min',
   details:'PRP facial treatments use your own platelet-rich plasma to stimulate collagen production, improve skin texture, reduce fine lines, and restore a youthful glow. Often combined with microneedling for enhanced results.',
   bullets:['Uses your own blood — 100% natural','Stimulates collagen & elastin','Improves texture and tone','Minimal downtime','Long-lasting results 6–12+ months']},
  {id:'prp-hair',name:'PRP — Hair Restoration',icon:'🌱',cat:'PRP Therapy',desc:'PRP scalp injections to stimulate dormant hair follicles, reduce shedding, and promote natural hair regrowth.',price:'From $550',duration:'60–90 min',
   details:'PRP hair restoration involves injecting platelet-rich plasma directly into the scalp to awaken dormant follicles, increase hair count, and strengthen existing strands. Most effective for androgenic alopecia and early hair loss.',
   bullets:['Clinically proven for hair loss','No surgery required','Stimulates new hair growth','Reduces shedding','Series of 3–4 treatments recommended']},
  {id:'chemical-peel',name:'Chemical Peels',icon:'🧴',cat:'Skin Treatments',desc:'Customized chemical exfoliation addressing pigmentation, texture, acne, and aging with clinical-grade precision.',price:'From $180',duration:'30–45 min',
   details:'Medical-grade chemical peels remove damaged outer layers of skin to reveal fresher, more even-toned skin beneath. We offer a range of peels from light to deep depending on your skin concerns and tolerance.',
   bullets:['Treats hyperpigmentation','Reduces acne and scarring','Improves skin texture','Stimulates cell turnover','Customized to your skin type']},
  {id:'microneedling',name:'Microneedling',icon:'⚡',cat:'Skin Treatments',desc:'Precision micro-injuries stimulate collagen production for firmer, smoother, more youthful skin.',price:'From $350',duration:'60 min',
   details:'Microneedling creates controlled micro-channels in the skin to trigger the body\'s natural healing response, boosting collagen and elastin production. Can be combined with PRP for maximum results.',
   bullets:['Reduces fine lines and wrinkles','Improves acne scarring','Tightens and firms skin','Minimal downtime','Safe for most skin types']},
  {id:'iv-therapy',name:'IV Iron Infusion',icon:'💧',cat:'IV Therapy',desc:'Replenish iron stores intravenously. Faster than oral supplements, administered by our licensed medical professionals.',price:'From $180',duration:'45–60 min',
   details:'IV iron infusion delivers iron directly into the bloodstream, bypassing digestive absorption issues. Ideal for patients with diagnosed iron deficiency anaemia who cannot tolerate oral supplements.',
   bullets:['Instant bioavailability','No GI side effects','Physician-supervised','Lab review included','Maintenance plans available']}
];

const REVIEWS_DEFAULT = [
  {id:1,name:'Sarah M.',avatar:'S',treatment:'Botox & PRP',rating:5,text:'Absolutely incredible experience. The team came to my home and the results were better than any clinic I\'ve visited. My skin has never looked this radiant.',date:'2026-02-14',approved:true},
  {id:2,name:'Jennifer K.',avatar:'J',treatment:'Regular Client',rating:5,text:'The mobile service is a game changer. Professional, discreet, and the results speak for themselves. I\'ve been a client for over a year and couldn\'t be happier.',date:'2026-01-28',approved:true},
  {id:3,name:'Amira R.',avatar:'A',treatment:'IV Therapy',rating:5,text:'After my IV iron infusion therapy, I felt like a completely different person. Knowledgeable, compassionate, and made me feel completely at ease.',date:'2026-03-01',approved:true},
  {id:4,name:'Priya T.',avatar:'P',treatment:'Chemical Peel',rating:5,text:'I\'ve tried many spas but RD Harmony is on another level. The chemical peel was perfect — no harsh reaction, beautiful glow for weeks after.',date:'2026-02-20',approved:true},
  {id:5,name:'Lisa N.',avatar:'L',treatment:'PRP Hair',rating:5,text:'Started PRP hair treatments 4 months ago. Already seeing significant regrowth. The practitioner is incredibly skilled and caring.',date:'2026-01-10',approved:true},
  {id:6,name:'Yasmin A.',avatar:'Y',treatment:'Microneedling',rating:5,text:'My acne scars have reduced dramatically after 3 microneedling sessions. Worth every penny. The convenience of in-home service is unmatched.',date:'2026-02-05',approved:true}
];

// Seed reviews if first visit
if (!localStorage.getItem('rdh_reviews')) DB.setReviews(REVIEWS_DEFAULT);

let selectedTime = '', currentRatingVal = 0;

/* ═══════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════ */
let currentPage = 'home';
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (!el) { toast('Page not found', 'error'); return; }
  el.classList.add('active');
  currentPage = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const nav = document.getElementById('nav');
  const darkPages = ['home', 'services', 'admin'];
  if (darkPages.includes(page) && window.scrollY < 80) nav.classList.remove('scrolled');
  else nav.classList.add('scrolled');

  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const active = document.querySelector(`.nav-links a[onclick*="'${page}'"]`);
  if (active) active.classList.add('active');

  if (page === 'home') initHome();
  if (page === 'services') initAllServices();
  if (page === 'treatments') initTreatments();
  if (page === 'testimonials') { renderAllReviews(); initReveal(); }
  if (page === 'booking') { initBookingForm(); initReveal(); }
  if (page === 'admin') checkAdminAuth();
  initReveal();
}

/* ═══ NAV SCROLL ═══ */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  const lightPages = ['about', 'contact', 'booking', 'treatments', 'testimonials', 'iv'];
  if (window.scrollY > 70) nav.classList.add('scrolled');
  else { if (lightPages.includes(currentPage)) nav.classList.add('scrolled'); else nav.classList.remove('scrolled'); }
});

/* ═══ HAMBURGER ═══ */
function toggleDrawer() {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('nav-drawer').classList.toggle('open');
  document.getElementById('drawer-overlay').classList.toggle('open');
  document.body.classList.toggle('modal-open');
}

/* ═══ MODAL ═══ */
function openModal(id) { document.getElementById(id).classList.add('open'); document.body.classList.add('modal-open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); document.body.classList.remove('modal-open'); }

/* ═══════════════════════════════════════
   TOAST
═══════════════════════════════════════ */
function toast(msg, type = 'success') {
  const tc = document.getElementById('toast-container');
  const t = document.createElement('div'); t.className = 'toast ' + type; t.textContent = msg;
  tc.appendChild(t); setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3500);
}

/* ═══════════════════════════════════════
   REVEAL ANIMATIONS
═══════════════════════════════════════ */
function initReveal() {
  const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }), { threshold: .1 });
  document.querySelectorAll('.reveal:not(.in)').forEach(el => obs.observe(el));
}

/* ═══════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════ */
function initHome() {
  const items = ['Botox & Dysport', 'PRP for Face & Hair', 'Chemical Peels', 'IV Iron Infusion', 'Microneedling', 'Skin Rejuvenation', 'Mobile Services GTA'];
  const track = document.getElementById('mtrack');
  if (track) track.innerHTML = [...items, ...items].map(i => `<div class="marquee-item">${i}</div>`).join('');

  const pc = document.getElementById('particles');
  if (pc && !pc.hasChildNodes()) {
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('div');
      p.style.cssText = `position:absolute;width:${1 + Math.random() * 2.5}px;height:${1 + Math.random() * 2.5}px;background:var(--gold-light);border-radius:50%;opacity:0;left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation:partFloat ${4 + Math.random() * 4}s ease-in infinite;animation-delay:${Math.random() * 6}s`;
      pc.appendChild(p);
    }
    const s = document.createElement('style');
    s.textContent = '@keyframes partFloat{0%{opacity:0;transform:translateY(0) scale(0)}20%{opacity:.8;transform:translateY(-18px) scale(1)}80%{opacity:.3}100%{opacity:0;transform:translateY(-100px) scale(.4)}}';
    document.head.appendChild(s);
  }

  const container = document.getElementById('home-services');
  if (container) container.innerHTML = SERVICES.slice(0, 6).map(s => renderServiceCard(s)).join('');

  const rv = document.getElementById('home-reviews');
  const reviews = DB.getReviews().filter(r => r.approved).slice(0, 3);
  if (rv) rv.innerHTML = reviews.map(r => renderReviewCard(r)).join('');

  const card = document.querySelector('.hero-float-card');
  if (card) document.addEventListener('mousemove', e => { const dx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2); const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2); card.style.transform = `translateY(-50%) rotateY(${dx * 10}deg) rotateX(${-dy * 6}deg)`; });

  setTimeout(() => {
    document.querySelectorAll('.svc-card').forEach(c => {
      c.addEventListener('mousemove', e => { const r = c.getBoundingClientRect(); const x = e.clientX - r.left - r.width / 2; const y = e.clientY - r.top - r.height / 2; c.style.transform = `translateY(-7px) rotateX(${-y * .04}deg) rotateY(${x * .04}deg)`; });
      c.addEventListener('mouseleave', () => { c.style.transform = ''; });
    });
  }, 300);
  initReveal();
}

function renderServiceCard(s) {
  return `<div class="svc-card">
    ${s.popular ? '<div class="svc-badge">Popular</div>' : ''}
    <div class="svc-icon">${s.icon}</div>
    <h3>${s.name}</h3>
    <p>${s.desc}</p>
    <span class="svc-price">${s.price} <small>· ${s.duration}</small></span>
    <a href="#" class="svc-link" onclick="navigate('booking');return false">Book Now</a>
  </div>`;
}

function renderReviewCard(r) {
  return `<div class="review-card">
    <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
    <p>"${r.text}"</p>
    <div class="review-author">
      <div class="author-av">${r.avatar}</div>
      <div><div class="author-name">${r.name}</div><div class="author-tag">${r.treatment}</div></div>
    </div>
  </div>`;
}

/* ═══════════════════════════════════════
   SERVICES PAGE
═══════════════════════════════════════ */
function initAllServices() {
  const c = document.getElementById('all-services');
  if (c) {
    c.innerHTML = SERVICES.map(s => renderServiceCard(s)).join('');
    setTimeout(() => {
      document.querySelectorAll('.svc-card').forEach(card => {
        card.addEventListener('mousemove', e => { const r = card.getBoundingClientRect(); const x = e.clientX - r.left - r.width / 2; const y = e.clientY - r.top - r.height / 2; card.style.transform = `translateY(-7px) rotateX(${-y * .04}deg) rotateY(${x * .04}deg)`; });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
      });
    }, 100);
  }
}

/* ═══════════════════════════════════════
   TREATMENTS PAGE
═══════════════════════════════════════ */
function initTreatments() {
  const tabs = document.getElementById('treatment-tabs');
  const panels = document.getElementById('treatment-panels');
  if (!tabs || !panels) return;
  tabs.innerHTML = SERVICES.map((s, i) => `<button class="tab-btn${i === 0 ? ' active' : ''}" onclick="switchTreatmentTab(${i},this)">${s.name}</button>`).join('');
  panels.innerHTML = SERVICES.map((s, i) => `<div class="treatment-content${i === 0 ? ' active' : ''}" id="tc-${i}">
    <div class="treatment-card-lg">
      <div class="tc-header">
        <div class="tc-icon-title"><div class="tc-icon">${s.icon}</div><div class="tc-title-wrap"><h3>${s.name}</h3><p>${s.cat} · ${s.duration}</p></div></div>
        <div class="tc-price-tag">${s.price}<small>per session</small></div>
      </div>
      <div class="tc-body">
        <p>${s.details}</p>
        <h4 style="font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:400;margin:20px 0 12px">Key Benefits</h4>
        <div class="tc-bullets">${s.bullets.map(b => `<div class="tc-bullet">${b}</div>`).join('')}</div>
      </div>
      <div class="tc-footer">
        <div style="display:flex;gap:8px;flex-wrap:wrap">${[s.cat, 'Mobile Service', 'GTA/Oakville'].map(t => `<span class="tc-tag">${t}</span>`).join('')}</div>
        <button class="book-this-btn" onclick="navigate('booking')">Book ${s.name} →</button>
      </div>
    </div>
  </div>`).join('');
}

function switchTreatmentTab(i, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.treatment-content').forEach(c => c.classList.remove('active'));
  document.getElementById('tc-' + i).classList.add('active');
}

/* ═══════════════════════════════════════
   TESTIMONIALS PAGE
═══════════════════════════════════════ */
function renderAllReviews() {
  const c = document.getElementById('all-reviews');
  const reviews = DB.getReviews().filter(r => r.approved);
  if (c) c.innerHTML = reviews.map(r => renderReviewCard(r)).join('');
}

function setRating(v) {
  currentRatingVal = v;
  document.querySelectorAll('.star-btn').forEach((b, i) => b.classList.toggle('lit', i < v));
}

function submitReview() {
  const name = document.getElementById('rv-name').value.trim();
  const treatment = document.getElementById('rv-treatment').value.trim();
  const text = document.getElementById('rv-text').value.trim();
  let valid = true;

  document.getElementById('rv-name-err').textContent = '';
  document.getElementById('rv-rating-err').textContent = '';
  document.getElementById('rv-text-err').textContent = '';

  if (!name) { document.getElementById('rv-name-err').textContent = 'Name is required'; valid = false; }
  if (!currentRatingVal) { document.getElementById('rv-rating-err').textContent = 'Please select a rating'; valid = false; }
  if (text.length < 20) { document.getElementById('rv-text-err').textContent = 'Please write at least 20 characters'; valid = false; }
  if (!valid) return;

  const review = { id: Date.now(), name, avatar: name[0].toUpperCase(), treatment: treatment || 'RD Harmony Client', rating: currentRatingVal, text, date: new Date().toISOString().split('T')[0], approved: true };
  DB.pushReview(review);
  renderAllReviews();
  document.getElementById('rv-name').value = '';
  document.getElementById('rv-treatment').value = '';
  document.getElementById('rv-text').value = '';
  setRating(0);
  currentRatingVal = 0;
  toast('Thank you for your review! 🌟');
}

/* ═══════════════════════════════════════
   BOOKING FORM
═══════════════════════════════════════ */
function initBookingForm() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('bk-date').min = today;

  const sel = document.getElementById('bk-service');
  sel.innerHTML = '<option value="">Select a treatment...</option>' + SERVICES.map(s => `<option value="${s.name}">${s.name} — ${s.price}</option>`).join('');

  document.getElementById('booking-form-wrap').style.display = 'block';
  document.getElementById('booking-success').style.display = 'none';
  selectedTime = '';
}

async function updateTimeSlots() {
  const svc = document.getElementById('bk-service').value;
  const date = document.getElementById('bk-date').value;
  const container = document.getElementById('time-slots');

  if (!svc || !date) { container.innerHTML = '<p style="color:var(--mid);font-size:13px">Select a service and date first.</p>'; return; }

  container.innerHTML = '<p style="color:var(--mid);font-size:13px">Loading available times...</p>';

  try {
    const booked = await DB.getBookingsByDate(date);
    const bookedTimes = booked.map(b => b.time);
    const slots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
    container.innerHTML = slots.map(s => {
      const taken = bookedTimes.includes(s);
      return `<button class="time-slot${taken ? ' taken' : ''}" onclick="selectTime('${s}',this)" ${taken ? 'disabled' : ''}>${s}${taken ? ' ✗' : ''}</button>`;
    }).join('');
    selectedTime = '';
  } catch (err) {
    console.error('Failed to load time slots:', err);
    container.innerHTML = '<p style="color:#e55;font-size:13px">Could not load times. Please try again.</p>';
  }
}

function selectTime(t, btn) {
  selectedTime = t;
  document.querySelectorAll('.time-slot').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

async function submitBooking() {
  const fields = [
    { id: 'bk-fname', errId: 'bk-fname-err', msg: 'First name required' },
    { id: 'bk-lname', errId: 'bk-lname-err', msg: 'Last name required' },
    { id: 'bk-email', errId: 'bk-email-err', msg: 'Valid email required', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    { id: 'bk-phone', errId: 'bk-phone-err', msg: 'Phone number required' },
    { id: 'bk-address', errId: 'bk-address-err', msg: 'Address required' }
  ];
  let valid = true;
  fields.forEach(f => {
    const el = document.getElementById(f.id); const err = document.getElementById(f.errId);
    err.textContent = '';
    if (!el.value.trim() || (f.regex && !f.regex.test(el.value))) { err.textContent = f.msg; valid = false; el.classList.add('error'); }
    else el.classList.remove('error');
  });

  const svcEl = document.getElementById('bk-service');
  const svcErr = document.getElementById('bk-service-err');
  svcErr.textContent = '';
  if (!svcEl.value) { svcErr.textContent = 'Please select a treatment'; valid = false; }

  const dateEl = document.getElementById('bk-date');
  const dateErr = document.getElementById('bk-date-err');
  dateErr.textContent = '';
  if (!dateEl.value) { dateErr.textContent = 'Please select a date'; valid = false; }

  const timeErr = document.getElementById('bk-time-err');
  timeErr.textContent = '';
  if (!selectedTime) { timeErr.textContent = 'Please select a time slot'; valid = false; }

  const consentEl = document.getElementById('bk-consent');
  const consentErr = document.getElementById('bk-consent-err');
  consentErr.textContent = '';
  if (!consentEl.checked) { consentErr.textContent = 'Please accept the terms to continue'; valid = false; }

  if (!valid) return;

  const btn = document.getElementById('bk-submit');
  btn.disabled = true;
  btn.classList.add('loading');

  const booking = {
    fname: document.getElementById('bk-fname').value.trim(),
    lname: document.getElementById('bk-lname').value.trim(),
    email: document.getElementById('bk-email').value.trim(),
    phone: document.getElementById('bk-phone').value.trim(),
    service: svcEl.value,
    date: dateEl.value,
    time: selectedTime,
    address: document.getElementById('bk-address').value.trim(),
    notes: document.getElementById('bk-notes').value.trim(),
    status: 'pending'
  };

  try {
    await DB.insertBooking(booking);
    document.getElementById('booking-form-wrap').style.display = 'none';
    document.getElementById('booking-success').style.display = 'block';
    toast('Booking confirmed! We\'ll reach out within 2 hours. ✅');
  } catch (err) {
    console.error('Booking failed:', err);
    toast('Could not submit booking. Please try again.', 'error');
    btn.disabled = false;
    btn.classList.remove('loading');
  }
}

/* ═══════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════ */
async function submitContact() {
  const fields = [
    { id: 'ct-fname', errId: 'ct-fname-err', msg: 'First name required' },
    { id: 'ct-lname', errId: 'ct-lname-err', msg: 'Last name required' },
    { id: 'ct-email', errId: 'ct-email-err', msg: 'Valid email required', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    { id: 'ct-msg', errId: 'ct-msg-err', msg: 'Please write a message (min 10 chars)', minLen: 10 }
  ];
  let valid = true;
  fields.forEach(f => {
    const el = document.getElementById(f.id); const err = document.getElementById(f.errId);
    err.textContent = '';
    if (!el.value.trim() || (f.regex && !f.regex.test(el.value)) || (f.minLen && el.value.trim().length < f.minLen)) { err.textContent = f.msg; valid = false; el.classList.add('error'); }
    else el.classList.remove('error');
  });
  const subj = document.getElementById('ct-subject');
  const subjErr = document.getElementById('ct-subject-err');
  subjErr.textContent = '';
  if (!subj.value) { subjErr.textContent = 'Please select a topic'; valid = false; }
  if (!valid) return;

  const msg = {
    name: document.getElementById('ct-fname').value.trim() + ' ' + document.getElementById('ct-lname').value.trim(),
    email: document.getElementById('ct-email').value.trim(),
    subject: subj.value,
    message: document.getElementById('ct-msg').value.trim()
  };

  try {
    await DB.insertMessage(msg);
    toast('Message sent! We\'ll reply within a few hours. ✉️');
    ['ct-fname', 'ct-lname', 'ct-email', 'ct-msg'].forEach(id => { document.getElementById(id).value = ''; });
    subj.value = '';
  } catch (err) {
    console.error('Message failed:', err);
    toast('Could not send message. Please try again.', 'error');
  }
}

/* ═══════════════════════════════════════
   ADMIN
═══════════════════════════════════════ */
const ADMIN_CREDS = { email: 'admin@rdharmony.com', password: 'admin123' };

function adminLogin() {
  const email = document.getElementById('adm-email').value;
  const pw = document.getElementById('adm-pw').value;
  const err = document.getElementById('adm-err');
  if (email === ADMIN_CREDS.email && pw === ADMIN_CREDS.password) {
    DB.setAdminAuth(true);
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dash').style.display = 'block';
    loadAdminDashboard();
    toast('Welcome back, Admin! 👋');
  } else {
    err.textContent = 'Invalid credentials. Try admin@rdharmony.com / admin123';
  }
}

function adminLogout() {
  DB.setAdminAuth(false);
  document.getElementById('admin-login').style.display = 'flex';
  document.getElementById('admin-dash').style.display = 'none';
}

function checkAdminAuth() {
  if (DB.getAdminAuth()) {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dash').style.display = 'block';
    loadAdminDashboard();
  } else {
    document.getElementById('admin-login').style.display = 'flex';
    document.getElementById('admin-dash').style.display = 'none';
  }
}

async function loadAdminDashboard() {
  document.getElementById('dash-date').textContent = new Date().toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  let bookings = [], messages = [];
  try { bookings = await DB.getBookings(); } catch (e) { console.error('Failed to load bookings:', e); }
  try { messages = await DB.getMessages(); } catch (e) { console.error('Failed to load messages:', e); }
  const reviews = DB.getReviews();

  const stats = [
    { val: bookings.filter(b => b.status !== 'cancelled').length, lbl: 'Total Bookings', ch: '+3 this week' },
    { val: bookings.filter(b => b.status === 'pending').length, lbl: 'Pending', ch: 'Needs attention' },
    { val: messages.length, lbl: 'Messages', ch: messages.length > 0 ? 'Unread' : 'All caught up' },
    { val: reviews.filter(r => r.approved).length, lbl: 'Reviews', ch: '⭐ 5.0 average' }
  ];
  document.getElementById('admin-stats').innerHTML = stats.map(s => `<div class="admin-stat"><div class="stat-val">${s.val}</div><div class="stat-lbl">${s.lbl}</div><div class="stat-change">${s.ch}</div></div>`).join('');

  renderBookingsTable('recent-bk-tbody', bookings.slice(0, 5));
  renderBookingsTable('all-bk-tbody', bookings);

  const clientMap = {};
  bookings.forEach(b => {
    if (!clientMap[b.email]) clientMap[b.email] = { name: b.fname + ' ' + b.lname, email: b.email, phone: b.phone, count: 0, last: b.date };
    clientMap[b.email].count++;
    if (b.date > clientMap[b.email].last) clientMap[b.email].last = b.date;
  });
  document.getElementById('clients-tbody').innerHTML = Object.values(clientMap).map(c => `<tr><td>${c.name}</td><td>${c.email}</td><td>${c.phone}</td><td>${c.count}</td><td>${c.last}</td></tr>`).join('');

  document.getElementById('messages-tbody').innerHTML = messages.map(m => `<tr><td>${m.name}</td><td>${m.email}</td><td>${m.subject}</td><td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.message}</td><td>${m.created_at ? m.created_at.split('T')[0] : ''}</td></tr>`).join('');

  document.getElementById('admin-reviews-tbody').innerHTML = reviews.map(r => `<tr><td>${r.name}</td><td>${'★'.repeat(r.rating)}</td><td>${r.treatment}</td><td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.text}</td><td>${r.date}</td><td><button class="admin-action-btn" onclick="deleteReview(${r.id})">Delete</button></td></tr>`).join('');

  document.getElementById('services-tbody').innerHTML = SERVICES.map(s => `<tr><td>${s.icon} ${s.name}</td><td>${s.cat}</td><td>${s.duration}</td><td>${s.price}</td></tr>`).join('');
}

function renderBookingsTable(tbodyId, bookings) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const isAll = tbodyId === 'all-bk-tbody';
  tbody.innerHTML = bookings.map(b => `<tr>
    <td>${isAll ? `<span style="color:var(--sage-light);font-size:11px">${b.id || ''}</span><br/>` : ''}${b.fname} ${b.lname}</td>
    ${isAll ? `<td style="font-size:12px">${b.email}</td>` : ''}
    <td>${b.service}</td>
    <td>${b.date}</td>
    <td>${b.time}</td>
    ${isAll ? `<td style="font-size:12px;max-width:140px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${b.address}</td>` : ''}
    <td><span class="status-badge status-${b.status}">${b.status}</span></td>
    <td>
      <select style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;padding:4px 8px;border-radius:4px;font-size:11px;cursor:none" onchange="updateBookingStatus('${b.id}',this.value)">
        <option value="pending"${b.status === 'pending' ? ' selected' : ''}>Pending</option>
        <option value="confirmed"${b.status === 'confirmed' ? ' selected' : ''}>Confirmed</option>
        <option value="cancelled"${b.status === 'cancelled' ? ' selected' : ''}>Cancel</option>
      </select>
    </td>
  </tr>`).join('');
}

async function updateBookingStatus(id, status) {
  try {
    await DB.updateBookingStatus(id, status);
    toast(`Booking updated → ${status}`);
    await loadAdminDashboard();
  } catch (err) {
    console.error('Status update failed:', err);
    toast('Failed to update status', 'error');
  }
}

function deleteReview(id) {
  if (!confirm('Delete this review?')) return;
  const reviews = DB.getReviews().filter(r => r.id !== id);
  DB.setReviews(reviews);
  loadAdminDashboard();
  toast('Review deleted', 'error');
}

function showAdminTab(tab, btn) {
  document.querySelectorAll('.admin-nav-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('[id^="tab-"]').forEach(t => t.style.display = 'none');
  document.getElementById('tab-' + tab).style.display = 'block';
}

function filterTable(input, tbodyId) {
  const q = input.value.toLowerCase();
  const rows = document.querySelectorAll('#' + tbodyId + ' tr');
  rows.forEach(r => { r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none'; });
}

async function exportCSV() {
  try {
    const bookings = await DB.getBookings();
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Service', 'Date', 'Time', 'Address', 'Status', 'Created'];
    const rows = bookings.map(b => [b.id, b.fname, b.lname, b.email, b.phone, b.service, b.date, b.time, `"${b.address}"`, b.status, b.created_at]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'rdharmony-bookings.csv'; a.click();
    toast('Bookings exported as CSV 📊');
  } catch (err) {
    toast('Export failed', 'error');
  }
}

/* ═══════════════════════════════════════
   LOADER + INIT
═══════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('out');
    navigate('home');
  }, 1900);
});

document.getElementById('nav').style.top = '38px';
