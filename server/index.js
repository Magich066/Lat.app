const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const SALT_ROUNDS = 10;

function getUserId(req) {
  const id = req.headers['x-user-id'];
  return id ? Number(id) : null;
}

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Имя должно быть минимум 2 символа' });
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Некорректный email' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Пароль должен быть минимум 6 символов' });
  }

  if (db.findUserByEmail(email)) {
    return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
  }

  const hashed = bcrypt.hashSync(password, SALT_ROUNDS);
  const user = db.createUser(name, email, hashed);

  res.json({ id: user.id, name: user.name, email: user.email, created_at: user.created_at });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }

  const user = db.findUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Неверный email или пароль' });
  }

  res.json({ id: user.id, name: user.name, email: user.email, created_at: user.created_at });
});

app.get('/api/profile', (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Не авторизован' });

  const user = db.findUserById(userId);
  if (!user) return res.status(401).json({ error: 'Пользователь не найден' });

  res.json({ id: user.id, name: user.name, email: user.email, created_at: user.created_at });
});

app.post('/api/ratings', (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Необходимо зарегистрироваться, чтобы оставить оценку' });
  }

  const { section_id, score } = req.body;
  if (!section_id || !score || score < 1 || score > 5) {
    return res.status(400).json({ error: 'Некорректные данные оценки' });
  }

  const result = db.upsertRating(userId, section_id, score);
  res.json({ section_id, ...result });
});

app.get('/api/ratings/:sectionId', (req, res) => {
  const { sectionId } = req.params;
  const userId = getUserId(req);

  const ratings = db.getRatingsBySection(sectionId);
  const avg = ratings.length
    ? Math.round((ratings.reduce((s, r) => s + r.score, 0) / ratings.length) * 10) / 10
    : null;
  const userScore = userId ? db.getUserRating(sectionId, userId) : null;

  res.json({
    section_id: sectionId,
    average: avg,
    count: ratings.length,
    userScore: userScore ? userScore.score : null
  });
});

app.get('/api/ratings', (req, res) => {
  res.json(db.getAllRatingsSummary());
});

// --- REVIEWS ---
app.post('/api/reviews', (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Необходимо зарегистрироваться, чтобы оставить отзыв' });
  }

  const { section_id, text, score } = req.body;
  if (!section_id || !text || text.length < 10) {
    return res.status(400).json({ error: 'Текст отзыва должен быть минимум 10 символов' });
  }

  const review = db.createReview(userId, section_id, text, score || null);
  res.json(review);
});

app.get('/api/reviews/:sectionId', (req, res) => {
  const { sectionId } = req.params;
  const approved = db.getReviewsBySection(sectionId);
  const pending = db.getPendingReviews(sectionId);
  res.json({ approved, pending });
});

app.put('/api/reviews/:id/moderate', (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Статус должен быть approved или rejected' });
  }
  const review = db.moderateReview(Number(req.params.id), status);
  if (!review) return res.status(404).json({ error: 'Отзыв не найден' });
  res.json(review);
});

app.delete('/api/reviews/:id', (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Не авторизован' });
  const ok = db.deleteReview(Number(req.params.id), userId);
  if (!ok) return res.status(404).json({ error: 'Отзыв не найден или не принадлежит вам' });
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Latt.app server running on http://localhost:${PORT}`);
});
