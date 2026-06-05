const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'latt.json');

function load() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch {
    return { users: [], ratings: [], reviews: [], nextUserId: 1, nextRatingId: 1, nextReviewId: 1 };
  }
}

function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

const api = {
  findUserByEmail(email) {
    const data = load();
    return data.users.find(u => u.email === email) || null;
  },

  findUserById(id) {
    const data = load();
    return data.users.find(u => u.id === id) || null;
  },

  createUser(name, email, password) {
    const data = load();
    const id = data.nextUserId++;
    const user = { id, name, email, password, created_at: new Date().toISOString() };
    data.users.push(user);
    save(data);
    return user;
  },

  getRatingsBySection(sectionId) {
    const data = load();
    return data.ratings.filter(r => r.section_id === sectionId);
  },

  getUserRating(sectionId, userId) {
    const data = load();
    return data.ratings.find(r => r.section_id === sectionId && r.user_id === userId) || null;
  },

  upsertRating(userId, sectionId, score) {
    const data = load();
    const existing = data.ratings.find(r => r.section_id === sectionId && r.user_id === userId);
    if (existing) {
      existing.score = score;
      existing.created_at = new Date().toISOString();
    } else {
      const id = data.nextRatingId++;
      data.ratings.push({ id, user_id: userId, section_id: sectionId, score, created_at: new Date().toISOString() });
    }
    save(data);

    const all = data.ratings.filter(r => r.section_id === sectionId);
    const avg = all.reduce((s, r) => s + r.score, 0) / all.length;
    return { average: Math.round(avg * 10) / 10, count: all.length };
  },

  getAllRatingsSummary() {
    const data = load();
    const map = {};
    data.ratings.forEach(r => {
      if (!map[r.section_id]) map[r.section_id] = { total: 0, count: 0 };
      map[r.section_id].total += r.score;
      map[r.section_id].count++;
    });
    return Object.entries(map).map(([section_id, v]) => ({
      section_id,
      average: Math.round((v.total / v.count) * 10) / 10,
      count: v.count
    }));
  },

  createReview(userId, sectionId, text, score) {
    const data = load();
    const id = data.nextReviewId++;
    const review = { id, user_id: userId, section_id: sectionId, text, score, status: 'pending', created_at: new Date().toISOString() };
    data.reviews.push(review);
    save(data);
    return review;
  },

  getReviewsBySection(sectionId) {
    const data = load();
    return data.reviews
      .filter(r => r.section_id === sectionId && r.status === 'approved')
      .map(r => {
        const user = data.users.find(u => u.id === r.user_id);
        return { ...r, user_name: user ? user.name : '—' };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  getPendingReviews(sectionId) {
    const data = load();
    return data.reviews
      .filter(r => r.section_id === sectionId && r.status === 'pending')
      .map(r => {
        const user = data.users.find(u => u.id === r.user_id);
        return { ...r, user_name: user ? user.name : '—' };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  moderateReview(reviewId, status) {
    const data = load();
    const review = data.reviews.find(r => r.id === reviewId);
    if (!review) return null;
    review.status = status;
    save(data);
    return review;
  },

  deleteReview(reviewId, userId) {
    const data = load();
    const idx = data.reviews.findIndex(r => r.id === reviewId && r.user_id === userId);
    if (idx === -1) return false;
    data.reviews.splice(idx, 1);
    save(data);
    return true;
  }
};

module.exports = api;
