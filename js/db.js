/* ═══════════════════════════════════════
   DATABASE LAYER
   ─────────────────────────────────────
   - bookings + messages → Firebase Firestore
   - reviews + adminAuth  → localStorage (unchanged)
═══════════════════════════════════════ */

// Firebase client (loaded via CDN in index.html)
firebase.initializeApp(FIREBASE_CONFIG);
const _db = firebase.firestore();

/* ── localStorage helpers (reviews, admin auth) ── */
const Local = {
  get(key, def = []) {
    try { return JSON.parse(localStorage.getItem('rdh_' + key)) || def; } catch { return def; }
  },
  set(key, val) { localStorage.setItem('rdh_' + key, JSON.stringify(val)); },
  push(key, item) { const d = Local.get(key); d.push(item); Local.set(key, d); return item; }
};

/* ── Firestore: bookings + messages ── */
const DB = {
  /* ---------- BOOKINGS ---------- */
  async insertBooking(booking) {
    const payload = { ...booking, created_at: new Date().toISOString() };
    const ref = await _db.collection('bookings').add(payload);
    return { id: ref.id, ...payload };
  },

  async getBookings() {
    const snap = await _db.collection('bookings').orderBy('created_at', 'desc').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  async getBookingsByDate(date) {
    const snap = await _db.collection('bookings').where('date', '==', date).get();
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(b => b.status !== 'cancelled')
      .map(b => ({ time: b.time, status: b.status }));
  },

  async updateBookingStatus(id, status) {
    await _db.collection('bookings').doc(id).update({ status });
  },

  /* ---------- MESSAGES ---------- */
  async insertMessage(msg) {
    const payload = { ...msg, created_at: new Date().toISOString() };
    const ref = await _db.collection('messages').add(payload);
    return { id: ref.id, ...payload };
  },

  async getMessages() {
    const snap = await _db.collection('messages').orderBy('created_at', 'desc').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  /* ---------- REVIEWS (localStorage) ---------- */
  getReviews()         { return Local.get('reviews', []); },
  pushReview(review)   { return Local.push('reviews', review); },
  setReviews(reviews)  { Local.set('reviews', reviews); },

  /* ---------- ADMIN AUTH (localStorage) ---------- */
  getAdminAuth()       { return Local.get('adminAuth', false); },
  setAdminAuth(val)    { Local.set('adminAuth', val); }
};
