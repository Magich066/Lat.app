const navLinks = document.querySelectorAll('.nav-link');
const tabContents = document.querySelectorAll('.tab-content');
const API = 'http://localhost:3001/api';

function openTab(tabId) {
    navLinks.forEach(item => item.classList.remove('active'));
    tabContents.forEach(tab => tab.classList.remove('active-tab'));

    const activeLink = document.querySelector(`.nav-link[data-tab="${tabId}"]`);
    if (activeLink) activeLink.classList.add('active');

    const target = document.getElementById(tabId);
    if (target) target.classList.add('active-tab');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('hamburger')?.classList.remove('open');
    document.querySelector('nav')?.classList.remove('open');
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    openTab(link.dataset.tab);
  });
});

document.querySelectorAll('[data-open-tab]').forEach(button => {
  button.addEventListener('click', () => { openTab(button.dataset.openTab); });
});

const loginModal = document.getElementById('loginModal');
const settingsModal = document.getElementById('settingsModal');
const detailModal = document.getElementById('detailModal');
const detailTitle = document.getElementById('detailTitle');
const detailMeta = document.getElementById('detailMeta');
const detailBody = document.getElementById('detailBody');
const detailTab = document.getElementById('detail-tab');
const pageDetailTitle = document.getElementById('pageDetailTitle');
const pageDetailMeta = document.getElementById('pageDetailMeta');
const pageDetailBody = document.getElementById('pageDetailBody');
const detailCover = document.getElementById('detailCover');
const detailBack = document.getElementById('detailBack');
const registerBtn = document.getElementById('registerBtn');
const registerMessage = document.getElementById('registerMessage');
const profileBtn = document.getElementById('openLogin');
let previousTabId = 'home-tab';

function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem('lattUser'));
  } catch {
    return null;
  }
}

const profileForm = document.getElementById('profileForm');
const profileInfo = document.getElementById('profileInfo');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const profileDate = document.getElementById('profileDate');
const logoutBtn = document.getElementById('logoutBtn');
const authBtn = document.getElementById('authBtn');
const authLoginTab = document.getElementById('authLoginTab');
const authRegisterTab = document.getElementById('authRegisterTab');
const authTitle = document.getElementById('authTitle');
const regName = document.getElementById('regName');
const regEmail = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');
let isLoginMode = true;

const languageToggle = document.getElementById('languageToggle');

function applyLanguage() {
  const isEn = languageToggle.checked;
  document.querySelectorAll('[data-ru]').forEach(el => {
    const key = isEn ? 'data-en' : 'data-ru';
    const val = el.getAttribute(key);
    if (val !== null && el.tagName !== 'TITLE') {
      el.textContent = val;
    }
  });
  document.querySelectorAll('[data-ru-placeholder]').forEach(el => {
    el.placeholder = isEn
      ? el.getAttribute('data-en-placeholder')
      : el.getAttribute('data-ru-placeholder');
  });
}

languageToggle.addEventListener('change', applyLanguage);

authLoginTab.addEventListener('click', () => {
  isLoginMode = true;
  authLoginTab.classList.add('active');
  authRegisterTab.classList.remove('active');
  regName.style.display = 'none';
  authBtn.textContent = languageToggle.checked ? 'Log In' : 'Войти';
  authTitle.textContent = languageToggle.checked ? 'Sign In' : 'Вход в аккаунт';
  registerMessage.textContent = '';
});

authRegisterTab.addEventListener('click', () => {
  isLoginMode = false;
  authRegisterTab.classList.add('active');
  authLoginTab.classList.remove('active');
  regName.style.display = '';
  authBtn.textContent = languageToggle.checked ? 'Sign Up' : 'Зарегистрироваться';
  authTitle.textContent = languageToggle.checked ? 'Registration' : 'Регистрация';
  registerMessage.textContent = '';
});

const authBtnHandler = async () => {
  const email = regEmail.value.trim();
  const password = regPassword.value;

  if (isLoginMode) {
    if (!email.includes('@') || !password) {
      registerMessage.textContent = languageToggle.checked ? 'Enter email and password.' : 'Введите email и пароль.';
      return;
    }
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        registerMessage.textContent = err.error || 'Ошибка входа';
        return;
      }
      const user = await res.json();
      localStorage.setItem('lattUser', JSON.stringify({ ...user, createdAt: user.created_at }));
      updateProfileButton();
      registerMessage.textContent = languageToggle.checked ? 'Logged in!' : 'Вход выполнен!';
      setTimeout(() => { loginModal.style.display = 'none'; }, 900);
    } catch {
      registerMessage.textContent = languageToggle.checked ? 'Connection error.' : 'Ошибка соединения с сервером';
    }
  } else {
    const name = regName.value.trim();
    if (name.length < 2 || !email.includes('@') || password.length < 6) {
      registerMessage.textContent = languageToggle.checked
        ? 'Enter a name, valid email and password from 6 characters.'
        : 'Введите имя, корректный email и пароль от 6 символов.';
      return;
    }
    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        registerMessage.textContent = err.error || 'Ошибка регистрации';
        return;
      }
      const user = await res.json();
      localStorage.setItem('lattUser', JSON.stringify({ ...user, createdAt: user.created_at }));
      updateProfileButton();
      registerMessage.textContent = languageToggle.checked ? 'Registration completed!' : 'Регистрация выполнена!';
      setTimeout(() => { loginModal.style.display = 'none'; }, 900);
    } catch {
      registerMessage.textContent = languageToggle.checked ? 'Connection error.' : 'Ошибка соединения с сервером';
    }
  }
};

authBtn.addEventListener('click', authBtnHandler);

function updateProfileButton() {
  const user = getSavedUser();
  if (!user?.name) return;
  profileBtn.textContent = user.name;
  profileBtn.setAttribute('data-ru', user.name);
  profileBtn.setAttribute('data-en', user.name);
}

function showProfileView() {
  const user = getSavedUser();
  if (user?.name) {
    profileForm.style.display = 'none';
    profileInfo.style.display = 'flex';
    profileInfo.style.flexDirection = 'column';
    profileInfo.style.gap = '12px';
    profileName.textContent = user.name;
    profileEmail.textContent = user.email;
    profileDate.textContent = new Date(user.createdAt).toLocaleDateString();
  } else {
    profileForm.style.display = 'flex';
    profileForm.style.flexDirection = 'column';
    profileForm.style.gap = '18px';
    profileInfo.style.display = 'none';
  }
}

profileBtn.onclick = () => {
  showProfileView();
  loginModal.style.display = 'flex';
};

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('lattUser');
  profileBtn.textContent = 'Профиль';
  profileBtn.setAttribute('data-ru', 'Профиль');
  profileBtn.setAttribute('data-en', 'Profile');
  showProfileView();
  registerMessage.textContent = '';
  regName.value = ''; regEmail.value = ''; regPassword.value = '';
});

document.getElementById('closeLogin').onclick = () => { loginModal.style.display = 'none'; };
document.getElementById('openSettings').onclick = () => { settingsModal.style.display = 'flex'; };
document.getElementById('closeSettings').onclick = () => { settingsModal.style.display = 'none'; };
document.getElementById('closeDetail')?.addEventListener('click', () => { if (detailModal) detailModal.style.display = 'none'; });

detailBack.addEventListener('click', () => {
  tabContents.forEach(tab => tab.classList.remove('active-tab'));
  document.getElementById(previousTabId)?.classList.add('active-tab');
  navLinks.forEach(item => item.classList.toggle('active', item.dataset.tab === previousTabId));
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

[loginModal, settingsModal, detailModal].filter(Boolean).forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    loginModal.style.display = 'none';
    settingsModal.style.display = 'none';
    if (detailModal) detailModal.style.display = 'none';
  }
});

const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('light-theme');
});

const animToggle = document.getElementById('animToggle');

animToggle.addEventListener('change', () => {
  document.querySelectorAll('.fade-up').forEach(el => {
    if (animToggle.checked) {
      if (isElementInViewport(el)) el.classList.add('show');
    } else {
      el.classList.remove('show');
    }
  });
});

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight - 60;
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up').forEach(el => {
  if (animToggle.checked) observer.observe(el);
});

const partnerBoxes = document.querySelectorAll('.partners-grid .fade-up');
partnerBoxes.forEach((el, i) => {
  el.classList.add('show');
  el.style.transitionDelay = (i * 0.08) + 's';
  setTimeout(() => {
    el.style.transitionDelay = '';
  }, 900 + i * 80);
});

const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('nav');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
  });
}

// --- NEWS SOURCE FIX ---
document.querySelectorAll('.news-source').forEach(link => {
  const href = link.getAttribute('href');
  if (href && href !== '#' && href !== '') {
    link.addEventListener('click', e => { e.stopPropagation(); });
  } else {
    link.removeAttribute('href');
    link.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const card = link.closest('.card, .tournament-card');
      if (card) openDetail(card);
    });
  }
});

// --- RATINGS ---
async function setSectionRating(card, score) {
  const user = getSavedUser();
  if (!user?.id) {
    const msg = languageToggle.checked
      ? 'You need to register to leave a review'
      : 'Нужно зарегистрироваться, чтобы оставить отзыв';
    alert(msg);
    openTab('home-tab');
    setTimeout(() => profileBtn.click(), 300);
    return;
  }

  const sectionId = card.dataset.sectionId;
  card.querySelectorAll('[data-score]').forEach(button => {
    button.classList.toggle('active', Number(button.dataset.score) <= score);
  });

  try {
    const res = await fetch(`${API}/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
      body: JSON.stringify({ section_id: sectionId, score })
    });

    if (!res.ok) {
      const err = await res.json();
      if (res.status === 401) {
        const msg = languageToggle.checked
          ? 'You need to register to leave a review'
          : 'Нужно зарегистрироваться, чтобы оставить отзыв';
        alert(msg);
        profileBtn.click();
      } else {
        alert(err.error || 'Ошибка');
      }
      return;
    }

    const data = await res.json();
    const value = card.querySelector('.rating-value');
    if (value) {
      const label = languageToggle.checked ? `Rating: ${data.average}/5 (${data.count})` : `Оценка: ${data.average}/5 (${data.count})`;
      value.textContent = label;
      value.setAttribute('data-ru', `Оценка: ${data.average}/5 (${data.count})`);
      value.setAttribute('data-en', `Rating: ${data.average}/5 (${data.count})`);
    }
  } catch {
    alert('Ошибка соединения с сервером');
  }
}

async function loadSectionRatings() {
  try {
    const res = await fetch(`${API}/ratings`);
    if (!res.ok) return;
    const all = await res.json();
    all.forEach(item => {
      const card = document.querySelector(`[data-section-id="${item.section_id}"]`);
      if (!card) return;
      const value = card.querySelector('.rating-value');
      if (value) {
        const label = languageToggle.checked ? `Rating: ${item.average}/5 (${item.count})` : `Оценка: ${item.average}/5 (${item.count})`;
        value.textContent = label;
        value.setAttribute('data-ru', `Оценка: ${item.average}/5 (${item.count})`);
        value.setAttribute('data-en', `Rating: ${item.average}/5 (${item.count})`);
      }
      const stars = Number(item.average);
      card.querySelectorAll('[data-score]').forEach(button => {
        button.classList.toggle('active', Number(button.dataset.score) <= Math.round(stars));
      });
    });
  } catch {}
}

let sectionRatingsInitialized = false;

function initSectionRatings() {
  if (sectionRatingsInitialized) { loadSectionRatings(); return; }
  sectionRatingsInitialized = true;
  document.querySelectorAll('.section-card').forEach(card => {
    card.querySelectorAll('[data-score]').forEach(button => {
      button.addEventListener('click', e => {
        e.stopPropagation();
        setSectionRating(card, Number(button.dataset.score));
      });
    });
  });
  loadSectionRatings();
}

openTab = (function(orig) {
  return function(tabId) {
    orig(tabId);
    if (tabId === 'fighters-tab') initFighterFilter();
    if (tabId === 'sections-tab') initSectionRatings();
    if (tabId === 'news-tab') initNewsFeatures();
  };
})(openTab);

// --- FIGHTER FILTER ---
function initFighterFilter() {
  const filterContainer = document.getElementById('fighterFilter');
  if (!filterContainer || filterContainer.dataset.initialized) return;
  filterContainer.dataset.initialized = '1';

  const fighters = document.querySelectorAll('.fighter-card');
  const weights = [...new Set(Array.from(fighters).map(f => f.dataset.weight).filter(Boolean))].sort();
  const regions = [...new Set(Array.from(fighters).map(f => f.dataset.region).filter(Boolean))].sort();
  const ages = [...new Set(Array.from(fighters).map(f => f.dataset.age).filter(Boolean))].sort();

  filterContainer.innerHTML = `
    <div class="filter-group">
      <select id="filterWeight">
        <option value="">${languageToggle.checked ? 'All weights' : 'Все веса'}</option>
        ${weights.map(w => `<option value="${w}">${w}</option>`).join('')}
      </select>
      <select id="filterRegion">
        <option value="">${languageToggle.checked ? 'All regions' : 'Все регионы'}</option>
        ${regions.map(r => `<option value="${r}">${r}</option>`).join('')}
      </select>
      <select id="filterAge">
        <option value="">${languageToggle.checked ? 'All ages' : 'Все возрасты'}</option>
        ${ages.map(a => `<option value="${a}">${a}</option>`).join('')}
      </select>
      <button class="secondary-btn" id="resetFilter">${languageToggle.checked ? 'Reset' : 'Сбросить'}</button>
    </div>
  `;

  function applyFighterFilter() {
    const w = document.getElementById('filterWeight')?.value || '';
    const r = document.getElementById('filterRegion')?.value || '';
    const a = document.getElementById('filterAge')?.value || '';
    fighters.forEach(f => {
      const mw = !w || f.dataset.weight === w;
      const mr = !r || f.dataset.region === r;
      const ma = !a || f.dataset.age === a;
      f.style.display = (mw && mr && ma) ? '' : 'none';
    });
  }

  setTimeout(() => {
    document.getElementById('filterWeight')?.addEventListener('change', applyFighterFilter);
    document.getElementById('filterRegion')?.addEventListener('change', applyFighterFilter);
    document.getElementById('filterAge')?.addEventListener('change', applyFighterFilter);
    document.getElementById('resetFilter')?.addEventListener('click', () => {
      document.getElementById('filterWeight').value = '';
      document.getElementById('filterRegion').value = '';
      document.getElementById('filterAge').value = '';
      applyFighterFilter();
    });
  }, 50);
}

// --- NEWS FILTER + SHOW MORE ---
function initNewsFeatures() {
  const container = document.getElementById('newsFilter');
  const grid = document.querySelector('.news-grid');
  const allCards = grid ? Array.from(grid.querySelectorAll('.news-card')) : [];
  const showMoreBtn = document.getElementById('showMoreNews');
  if (!container || !allCards.length) return;
  if (container.dataset.initialized) return;
  container.dataset.initialized = '1';

  if (container.querySelector('.news-filter-chips')) return;

  const visibleBase = 5;
  const categories = [...new Set(allCards.map(c => c.dataset.category).filter(Boolean))].sort();
  const labelMap = {
    tournaments: languageToggle.checked ? 'Tournaments' : 'Турниры',
    juniors: languageToggle.checked ? 'Juniors' : 'Юниоры',
    region: languageToggle.checked ? 'Regions' : 'Регионы'
  };

  let activeCategory = '';
  let visibleCount = visibleBase;

  container.innerHTML = `
    <div class="news-filter-chips">
      <button class="news-filter-chip active" data-category="">${languageToggle.checked ? 'All' : 'Все'}</button>
      ${categories.map(c => `<button class="news-filter-chip" data-category="${c}">${labelMap[c] || c}</button>`).join('')}
    </div>
  `;

  function applyNewsFilter() {
    visibleCount = visibleBase;
    const totalVisible = allCards.filter(c => !activeCategory || c.dataset.category === activeCategory).length;
    let visible = 0;
    allCards.forEach(card => {
      const inCategory = !activeCategory || card.dataset.category === activeCategory;
      card.classList.remove('hidden-news');
      if (!inCategory) {
        card.classList.add('hidden-news');
        return;
      }
      visible++;
      if (visible > visibleCount) card.classList.add('hidden-news');
    });
    showMoreBtn.style.display = visibleCount < totalVisible ? '' : 'none';
  }

  container.querySelectorAll('.news-filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      activeCategory = chip.dataset.category;
      container.querySelectorAll('.news-filter-chip').forEach(c => c.classList.toggle('active', c === chip));
      applyNewsFilter();
    });
  });

  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      const totalVisible = allCards.filter(c => !activeCategory || c.dataset.category === activeCategory).length;
      if (visibleCount < totalVisible) {
        visibleCount = Math.min(visibleCount + 5, totalVisible);
        applyNewsFilter();
      }
    });
  }

  applyNewsFilter();
}

// --- DETAIL ---
function textFrom(el, selector) {
  return el.querySelector(selector)?.textContent.trim() || '';
}

function detailKeyFrom(card) {
  const title = card.querySelector('h3, h2');
  return title?.getAttribute('data-ru') || title?.textContent.trim() || '';
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function paragraphsToHtml(paragraphs) {
  return paragraphs
    .filter(Boolean)
    .map(item => `<p>${escapeHtml(item)}</p>`)
    .join('');
}

const wrestlingImages = Object.freeze({
  action: 'images/wrestling-action.svg',
  olympicFinal: 'images/wrestling-final.svg',
  matTraining: 'images/wrestling-training.svg',
  youthMat: 'images/wrestling-youth.svg',
  gym: 'images/wrestling-gym.svg',
  teamWarmup: 'images/wrestling-team.svg',
  sadulaev: 'images/sadulaev.png',
  sidakov: 'images/sidakov.png',
  uguev: 'images/uguev.png',
  saytiyev: 'images/saytiev.png',
  naifonov: 'images/naifonov.png',
  batirov: 'images/batirov.png',
  gatsalov: 'images/gatsalov.png',
  ramonov: 'images/ramonov.png',
  mevloev: 'images/mevloev.png',
  tsokaev: 'images/tsokaev.png',
  kudukhov: 'images/kudukhov.png'
});

const defaultDetail = Object.freeze({
  news: {
    image: wrestlingImages.action,
    paragraphs: [
      'В подробной карточке собрана главная суть новости: кто выступал, где проходило событие, какой вес или возрастная группа были важны и почему результат заметен для вольной борьбы.',
      'Для молодых борцов такие новости полезны как ориентир: по ним видно, какие регионы сильны, какие весовые категории дают конкуренцию и насколько важны стабильные выступления на протяжении всего турнира.',
      'После чтения новости стоит смотреть не только на медали, но и на путь спортсмена: сетку, качество соперников, умение бороться в концовке и готовность выдерживать несколько схваток за день.'
    ]
  },
  tournament: {
    image: wrestlingImages.olympicFinal,
    paragraphs: [
      'Турнирная карточка показывает не только дату и место. Важно понимать уровень соревнований, состав участников, весовые категории и то, какую задачу решают спортсмены: набор опыта, отбор или проверку формы.',
      'Перед стартом борец готовит вес, форму, документы, разминку и план на первую схватку. Ошибки в подготовке часто стоят не меньше, чем ошибка на ковре.',
      'После турнира полезно разобрать каждую схватку: где удалось навязать свою борьбу, где соперник забрал инициативу и какие действия нужно повторить на тренировках.'
    ]
  },
  fighter: {
    image: wrestlingImages.action,
    paragraphs: [
      'В подробной карточке борца важны не только титулы. Обращайте внимание на стиль: стойку, работу руками, проходы в ноги, защиту у края ковра и умение удерживать темп до конца периода.',
      'У сильных вольников почти всегда есть базовые качества: дисциплина веса, постоянная работа над захватами, силовая выносливость и холодная голова в сложных ситуациях.',
      'Такую карточку можно использовать как мини-разбор: взять один элемент из стиля спортсмена и попробовать отработать его на тренировке под контролем тренера.'
    ]
  },
  section: {
    image: wrestlingImages.gym,
    paragraphs: [
      'При выборе секции смотрите не только на название. Важны тренер, дисциплина в зале, безопасность на ковре, регулярность тренировок и понятная программа для новичков.',
      'Хорошая борцовская группа постепенно учит стойке, страховке, базовым проходам, защите ног, работе у края ковра и уважению к партнёру.',
      'Рейтинг на карточке можно использовать как личную отметку: насколько удобно расписание, понятны ли требования тренера и есть ли прогресс после нескольких недель занятий.'
    ]
  },
  tip: {
    image: wrestlingImages.matTraining,
    paragraphs: [
      'Совет работает только тогда, когда его применяют регулярно. Лучше взять один пункт на неделю, обсудить его с тренером и проверить результат на нескольких тренировках.',
      'Для вольной борьбы особенно важна системность: сон, питание, разминка, базовая техника и спокойный разбор ошибок после схваток.',
      'Если совет касается здоровья, веса или травмы, решение нужно принимать вместе с тренером, родителями и врачом, а не через силу.'
    ]
  }
});

const detailContent = Object.freeze({
  'Борцы из семи стран поднялись на пьедестал Мемориала Алиева': { image: 'images/news-aliyev.jpg', paragraphs: ['В Каспийске завершился 56-й международный турнир по вольной борьбе памяти пятикратного чемпиона мира Али Алиева. Соревнования прошли 16-17 мая и собрали сильный состав участников из России и зарубежных стран.', 'По итогам двух дней борьбы на пьедестал почёт поднялись спортсмены из семи стран мира. Это подтверждает высокий международный статус Мемориала Алиева.', 'Российские борцы выступили успешно во всех весовых категориях, заняв лидирующие позиции по количеству наград. Полные результаты турнира доступны на сайте Федерации спортивной борьбы России.'] },
  'Абдурахманов, Монгуш, Дзираев, Нурмагомедов, Пшеничников и Хизриев — победители Спартакиады': { image: 'images/news-spartakiada.webp', paragraphs: ['С 8 по 11 сентября в Уфе проходила II Всероссийская спартакиада по спортивной борьбе «Спартакиада народов России». В соревнованиях по вольной борьбе определились победители во всех весовых категориях.', 'Золото завоевали: Магомед Абдурахманов (Санкт-Петербург, до 57 кг), Чаяан Монгуш (Иркутская область, до 65 кг), Алан Дзираев (Северная Осетия, до 74 кг), Абдулхамид Нурмагомедов (Дагестан, до 86 кг), Константин Пшеничников (Кемеровская область, до 97 кг) и Зелимхан Хизриев (Санкт-Петербург, до 130 кг).', 'Серебряные медали взяли Осман Султанов, Магомедариф Магомедов, Гаджимурад Гаджиев, Руслан Черткоев, Мустафагаджи Малачдибиров и Балдан Цыжипов. Бронзу завоевали Мурат Пкин, Эзир Тюлюш, Умар Умаров, Аслан Каболов, Тамерлан Тапсиев и Арсен Габараев.', 'Спартакиада проходит при поддержке Российского союза спортсменов и является одним из главных внутренних стартов сезона для российских борцов.'] },
  'В Каспийске прошёл Мемориал Алиева': { image: 'images/news-aliyev.jpg', paragraphs: ['56-й международный турнир по вольной борьбе памяти пятикратного чемпиона мира Али Алиева прошёл в Каспийске 16-17 мая. Турнир носит имя одного из величайших борцов в истории отечественного спорта.', 'В соревнованиях приняли участие сильнейшие вольники из регионов России, а также спортсмены из зарубежных стран. На турнире выступили борцы из семи стран мира.', 'Победители и призёры определялись во всех весовых олимпийских категориях. Мемориал Алиева традиционно считается одним из ключевых этапов подготовки российских борцов к международным стартам.', 'Федерация спортивной борьбы России опубликовала полные результаты соревнований, включая все призовые места в каждой весовой категории.'] },
  'Максим Монгуш выиграл первенство Европы U-17': { image: 'images/news-mongush.jpg', paragraphs: ['Российский борец Максим Монгуш стал победителем первенства Европы U-17 по вольной борьбе, завоевав золотую медаль в весовой категории до 65 кг.', 'Осман Темирсултанов также поднялся на пьедестал почёта, завоевав серебро в своей весовой категории. Асильдер Аслуев стал бронзовым призёром турнира.', 'Юношеское первенство Европы является важным этапом для молодых борцов: медали здесь дают не только признание, но и опыт выступлений на международном уровне на пути в большой спорт.', 'Победа Монгуша подтверждает силу российской школы вольной борьбы в юношеском возрасте и даёт импульс для дальнейшего прогресса спортсмена.'] },
  'Борцы Ингушетии взяли пять медалей во Владикавказе': { image: 'images/news-vladikavkaz.jpg', paragraphs: ['Сборная Ингушетии по греко-римской борьбе завоевала пять медалей на открытом турнире, посвящённом памяти Заслуженного тренера России Роберта Гучмазова. Соревнования прошли во Владикавказе во Дворце спорта «Манеж».', 'Золотые награды в свои весовые категории завоевали Мухамад Балаев (41 кг), Магомед-Саид Евлоев (51 кг) и Билал Мержоев (75 кг).', 'Бронзовыми призёрами в весовой категории до 45 кг стали Мехди Илиев и Абубакр Хашиев.', 'Соревнования собрали более 400 борцов в трёх возрастных группах (8-9, 10-11 и 12-14 лет) из регионов России, а также Грузии и Казахстана. Делегацию Ингушетии сопровождали тренеры Ислам Хамхоев, Усман Евлоев и Зелимхан Евлоев.'] },
  'Магомед-Тагир Ханиев завоевал серебро турнира «Мухаммед Мало»': { image: 'images/news-khaniev.jpg', paragraphs: ['Ингушский борец Магомед-Тагир Ханиев стал серебряным призёром престижного рейтингового турнира по вольной борьбе «Мухаммед Мало», выступая в весовой категории до 97 кг.', 'На пути к финалу Ханиев одержал яркие победы: в 1/8 финала он досрочно победил бронзового призёра чемпионата Европы Ричарда Вега из Венгрии (10:2), а в четвертьфинале уверенно одолел олимпийского чемпиона Кайла Снайдера из США (10:4).', 'В решающей схватке Ханиев уступил Абдулрашиду Садулаеву со счётом 10:4, но серебро на столь значимом международном старте подтверждает его место среди сильнейших борцов мира в своём весе.'] },
  'Зелимхан Чаниев выиграл первенство России U-21': { image: 'images/news-chaniev.jpg', paragraphs: ['Воспитанник клуба «Вольник» Зелимхан Чаниев стал победителем первенства России по вольной борьбе среди юниоров до 21 года, которое проходило во Владикавказе с 12 по 15 февраля.', 'Чаниев завоевал победу в весовой категории до 61 кг, одолев на пути к золоту пятерых соперников. В решающей схватке он победил представителя Чеченской республики Усмана Индирбаева со счётом 7:6.', 'Всего на турнире за призовые места и путёвки на первенства Европы и мира боролись более 350 спортсменов со всей страны.', 'Значительную долю в результат атлета внесли его наставники Руслан Тумгоев и Адам Чербижев.'] },
  'Международный турнир памяти Ахмата Кадырова': { image: 'images/news-grozny.png', paragraphs: ['С 14 по 17 сентября в Грозном пройдёт Международный турнир по вольной борьбе, посвящённый памяти Первого Президента Чеченской Республики, Героя России Ахмата Абдулхамидовича Кадырова.', 'В этом году на ковры выйдут 173 спортсмена: 97 представителей зарубежных стран и 76 российских борцов. В соревнованиях примут участие борцы из 12 стран — Ирана, Турции, Таджикистана, Армении, Кыргызстана, Беларуси, Казахстана, Узбекистана, Азербайджана, Монголии, Бахрейна и Греции.', 'Победители и призёры соревнований, а также тренеры победителей будут награждены медалями и денежными призами: 1 место — 5 000 $ (тренеру — 2 000 $), 2 место — 3 000 $, 3 место — 1 000 $.', 'Программа: 15 сентября — предварительные поединки во всех весовых категориях (11:00) и полуфиналы (17:00). 16 сентября — утешительные поединки и схватки за бронзу (11:00), торжественная церемония открытия (17:30), финальные поединки (18:15) и церемония награждения (20:15).'] },
  'Первенство Северного Кавказа по вольной борьбе': { image: wrestlingImages.youthMat, paragraphs: ['Назрань примет первенство Северного Кавказа по вольной борьбе среди юношей и юниоров. Турнир является отборочным этапом к первенству России.', 'На ковры Дворца спорта выйдут сильнейшие спортсмены регионов СКФО: Республики Ингушетии, Чеченской Республики, Дагестана, Северной Осетии — Алании, Кабардино-Балкарии, Карачаево-Черкесии и Ставропольского края.', 'Для молодых борцов это главный шанс отобраться на всероссийский финал и заявить о себе на уровне национальной сборной.'] },
  'Международный турнир в Магасе': { image: wrestlingImages.olympicFinal, paragraphs: ['Традиционный международный турнир по вольной борьбе в Магасе — один из главных стартов сезона в Ингушетии. Соревнования посвящены памяти героев республики.', 'Ожидается участие сборных России, Азербайджана, Армении и Грузии, а также сильнейших клубов и спортсменов из регионов Северного Кавказа.', 'Турнир даёт ингушским борцам возможность помериться силами с сильнейшими спортсменами ближнего зарубежья на домашней арене.'] },
  'Первенство Ингушетии': { image: wrestlingImages.matTraining, paragraphs: ['Республиканские соревнования по вольной борьбе во всех возрастных группах — главный отборочный старт сезона в Ингушетии.', 'Первенство определяет состав сборной республики на всероссийские соревнования и первенства округа в новом сезоне.', 'Для юных борцов Ингушетии турнир — первая серьёзная проверка: здесь закладываются основа дисциплины, соревновательный опыт и первые значимые победы.'] },
  'Мемориал Али Алиева': { image: wrestlingImages.olympicFinal, paragraphs: ['Турнир посвящён памяти Али Алиева и остаётся сильной площадкой для вольников. Здесь ценятся опыт, характер и умение быстро перестраиваться под соперника.', 'Для спортсмена это возможность проверить форму в условиях высокой конкуренции, а для тренера — увидеть, какие действия стабильно проходят под давлением.', 'Главные зоны внимания: борьба за первый балл, защита ног, активность у края ковра и способность удержать преимущество во втором периоде.'] },
  'Первенство Европы U-17': { image: wrestlingImages.youthMat, paragraphs: ['Юношеское первенство Европы показывает уровень ближайшего резерва. В этом возрасте спортсмены уже должны уверенно владеть базой и уметь выполнять план на схватку.', 'Сильное выступление в U-17 помогает борцу получить международный опыт до перехода во взрослую борьбу, где темп и цена ошибки выше.', 'Для тренировки после такого турнира полезно выбрать одну тему: атаки в ноги, защита от проходов, выход из партера или работа за пределами центра.'] },
  'Турнир «Мухаммед Мало»': { image: wrestlingImages.action, paragraphs: ['Рейтинговый турнир важен тем, что каждый результат влияет на позицию спортсмена и его дальнейший соревновательный календарь.', 'Вес до 97 кг требует сочетания силы и подвижности. Побеждает не просто самый мощный, а тот, кто лучше контролирует дистанцию и не отдаёт лёгкие баллы.', 'Для подготовки к таким стартам тренеры обычно усиливают работу над выносливостью, защитой ног, контратаками и умением бороться при минимальном счёте.'] },
  'Первенство России до 21 года': { image: wrestlingImages.youthMat, paragraphs: ['Категория до 21 года — переход между юношеской и взрослой борьбой. Здесь уже недостаточно одной скорости: нужна тактика, терпение и стабильность.', 'Такие соревнования помогают понять, кто готов к более высоким стартам и кто способен выдерживать давление сильной сетки.', 'После первенства важно не просто запомнить место, а разобрать схватки: где потеряны баллы, где не хватило движения и какие атаки нужно закреплять.'] },
  'Первенство России в Назрани': { image: wrestlingImages.gym, paragraphs: ['Соревнования в Назрани важны для развития борцовской среды региона: домашняя площадка даёт молодым спортсменам пример большого турнира рядом с ними.', 'Даже если событие связано с греко-римской борьбой, организация турнира, дисциплина команд и соревновательный опыт полезны для всей борцовской школы.', 'Для секций региона такие старты становятся мотивацией: дети видят сильных спортсменов, тренеры получают ориентиры, а клубы укрепляют соревновательную культуру.'] },
  'Кавказские турниры по вольной борьбе': { image: wrestlingImages.teamWarmup, paragraphs: ['Кавказские турниры ценятся плотной конкуренцией. На одной площадке могут встретиться спортсмены из Дагестана, Осетии, Чечни, Ингушетии и соседних регионов.', 'Для вольника это хорошая проверка характера: разные школы дают разный темп, разные захваты и разные способы давления.', 'Регулярные старты в регионе помогают быстрее расти, потому что спортсмен привыкает к сильным соперникам и учится бороться без страха перед именами.'] },
  'Абдулрашид Садулаев': { image: wrestlingImages.sadulaev, paragraphs: ['Садулаев известен мощной борьбой в верхних весах, давлением в стойке и умением быстро переводить преимущество в баллы.', 'Его стиль полезно изучать по эпизодам: вход в контакт, контроль корпуса соперника, работа после первого действия и спокойствие в решающие секунды.', 'Для молодых борцов главный урок — сила должна идти вместе с техникой. Даже физически сильный спортсмен обязан держать стойку, дистанцию и дисциплину.'] },
  'Заурбек Сидаков': { image: wrestlingImages.sidakov, paragraphs: ['Сидаков выделяется тактической борьбой, грамотной работой в концовках и умением не раскрывать лишние возможности для контратаки.', 'В весе до 74 кг особенно важны скорость рук, чувство дистанции и способность мгновенно переходить от защиты к атаке.', 'Его схватки хорошо смотреть тем, кто хочет понять, как выигрывать не только за счёт мощи, но и за счёт терпения, выбора момента и контроля счёта.'] },
  'Заур Угуев': { image: wrestlingImages.uguev, paragraphs: ['Угуев — пример лёгкого веса, где решают взрывная скорость, проходы в ноги и стабильная защита от ответных атак.', 'Его борьба показывает, как важно не останавливаться после первого касания ноги: атаку нужно завершать контролем и положением, которое даёт баллы.', 'Для юных вольников это хороший ориентир по работе ног, реакции и умению сохранять темп на протяжении всей схватки.'] },
  'Бувайсар Сайтиев': { image: wrestlingImages.saytiyev, paragraphs: ['Бувайсар Сайтиев считается одним из величайших борцов вольного стиля благодаря технике, пластичности и способности читать соперника.', 'Его стиль ценен тем, что он часто побеждал не грубой силой, а таймингом, углами атаки и умением заставлять соперника ошибаться.', 'Для тренировки можно взять один принцип: не идти прямо в силу соперника, а менять направление, работать руками и создавать удобный момент для прохода.'] },
  'Артур Найфонов': { image: wrestlingImages.naifonov, paragraphs: ['Найфонов выступает в среднем весе, где нужно сочетать силовую борьбу, гибкость и готовность держать высокий темп.', 'Его сильная сторона — плотный контакт и давление, которое заставляет соперника защищаться и ошибаться у края ковра.', 'Для молодых спортсменов полезно смотреть, как он сохраняет позицию после атаки и не отдаёт сопернику лёгкий выход из опасного положения.'] },
  'Мавлет Батиров': { image: wrestlingImages.batirov, paragraphs: ['Батиров известен выступлениями в лёгких весах, где цена каждой секунды особенно высока. Там нельзя долго готовить атаку без движения.', 'Его сильная сторона — взрывное начало действия и умение быстро переводить скорость в результативный проход.', 'Для тренировки это пример того, что скорость должна быть точной: атаковать нужно из правильной стойки, с контролем рук и готовностью продолжить борьбу.'] },
  'Бесик Кудухов': { image: wrestlingImages.action, paragraphs: ['Кудухов запомнился высоким темпом, атакующей манерой и постоянным давлением на соперника.', 'Его борьба показывает, насколько важны движение, смена уровней и готовность атаковать сериями, а не одним отдельным проходом.', 'Для юных борцов это пример того, что активность должна быть осмысленной: каждое движение должно создавать угрозу или улучшать позицию.'] },
  'Хаджимурад Гацалов': { image: wrestlingImages.gatsalov, paragraphs: ['Гацалов известен выступлениями в тяжёлых категориях, где решают контроль корпуса, мощная стойка и умение навязать свой темп.', 'В тяжёлых весах ошибка часто приводит к большим потерям, поэтому особенно важны дисциплина рук и аккуратность при входе в атаку.', 'Его стиль полезен для изучения тем, кто хочет понять, как сочетать силу, выносливость и позиционную борьбу.'] },
  'Сослан Рамонов': { image: wrestlingImages.ramonov, paragraphs: ['Рамонов известен скоростной борьбой, гибкой техникой и умением быстро менять направление атаки.', 'В весе до 65 кг важно не только быстро пройти в ноги, но и удержать соперника, не дать ему развернуться и забрать ответный балл.', 'Его схватки полезно смотреть для понимания движения: как борец создаёт угол, как работает руками и как продолжает атаку после первой защиты соперника.'] },
  'Магомед Евлоев': { image: wrestlingImages.action, paragraphs: ['Магомед Евлоев — перспективный ингушский борец вольного стиля. Выступает в весовой категории до 74 кг, где ценится сочетание скорости и силовой выносливости.', 'Регулярные выступления на всероссийских турнирах помогают ему набирать опыт и подниматься в рейтингах. Агрессивный стиль и плотная борьба — его визитная карточка.', 'Для молодых спортсменов Ингушетии он пример того, как системная работа и дисциплина выводят на уровень чемпионата России.'] },
  'Али Цокаев': { image: wrestlingImages.youthMat, paragraphs: ['Али Цокаев — молодой ингушский борец вольного стиля, показывающий стабильные результаты на региональных и всероссийских соревнованиях.', 'Выступает в лёгких весах (61-65 кг), где решают скорость, взрывная работа ног и умение быстро переключаться между атакой и защитой.', 'Его карточка полезна для начинающих борцов: она показывает, что даже без олимпийских титулов можно быть сильным спортсменом и представлять свой регион на высоком уровне.'] },
  'Магомед-Тагир Ханиев': { image: wrestlingImages.action, paragraphs: ['Ханиев представляет Ингушетию в весе до 97 кг, где особенно важны сила, устойчивость и умение работать против крупных соперников.', 'Серебро на рейтинговом турнире показывает, что спортсмен способен выдерживать турнирную нагрузку и доходить до решающих схваток.', 'Для молодых вольников его карточка полезна как пример: региональный спортсмен может расти через регулярные старты, дисциплину веса и работу над базовой техникой.'] },
  'СК «Ади Ахмад»': { image: wrestlingImages.gym, paragraphs: [
      'Спортивный клуб «Ади Ахмад» (ГБУДО «СШ имени Ади Ахмада») — известная спортивная школа в Ингушетии, специализирующаяся на греко-римской борьбе и шахматах. Воспитанники клуба регулярно становятся победителями и призёрами всероссийских и международных соревнований.',
      'Расположение: Республика Ингушетия, Сунженский район, станица Троицкая, ул. Колхозная (также ул. Багаева), д. 36А. Директор школы — Харсиев Исса Аликович. Большой вклад в развитие клуба и подготовку борцов вносит президент Федерации спортивной борьбы Ингушетии Руслан Белхороев.',
      'Греко-римская борьба — основное направление клуба. Клуб является кузницей кадров для сборной республики и России. Среди известных воспитанников, показывающих высокие результаты на первенствах России и Европы — Исмаил Барахоев, Рамазан Арапханов, Зелимхан Цуров, Мухаммад Евлоев и другие.',
      'В Троицкой также действует сильная шахматная секция «Ади-Ахмад». Здесь проводятся крупные гроссмейстерские турниры и матчи с участием мировых звёзд (Бориса Гельфанда, Эрнесто Инаркиева). При клубе функционирует современный тренажёрный зал для общих тренировок.'
    ] },
  'Борцовская секция Нестеровской': { image: wrestlingImages.teamWarmup, paragraphs: ['Секция для школьников должна строиться вокруг регулярности: разминка, базовые упражнения, техника в стойке и простые задания на каждую тренировку.', 'На первых этапах важнее качество движений, чем победы. Хороший тренер следит, чтобы ребёнок правильно падал, держал стойку и не боялся контакта.', 'Соревнования для такой группы нужны как опыт, а не как давление. После старта важно спокойно разобрать ошибки и сохранить желание тренироваться.'] },
  'Борцовская секция Сурхахи': { image: wrestlingImages.matTraining, paragraphs: ['Начальная подготовка в секции должна формировать привычку к дисциплине: приходить вовремя, слушать тренера, уважать партнёра и работать без лишней грубости.', 'Для вольной борьбы база включает стойку, перемещения, защиту ног, простые проходы и умение бороться у края ковра.', 'Если ребёнок только начинает, первые месяцы лучше оценивать не по медалям, а по посещаемости, вниманию на тренировке и уверенности в движениях.'] },
  'ДС «Магас» Назрань': { image: wrestlingImages.gym, paragraphs: ['Дворец спорта «Магас» имени Берда Евлоева в Назрани — одна из главных спортивных арен Ингушетии. Здесь регулярно проходят первенства России по греко-римской борьбе.', 'Зал оборудован современными коврами, раздевалками и трибунами для зрителей. Инфраструктура позволяет проводить соревнования всероссийского уровня.', 'Для местных спортсменов это возможность тренироваться и выступать на домашней арене, не выезжая за пределы республики.'] },
  'Борцовский зал Карабулак': { image: wrestlingImages.matTraining, paragraphs: ['Секция в Карабулаке ориентирована на подготовку борцов вольного стиля. Тренировки проводятся для детей и взрослых в вечернее время.', 'Основное внимание уделяется базовой технике: стойке, перемещениям, защите ног и простым проходам. Тренеры работают с начинающими.', 'Участие в республиканских соревнованиях помогает спортсменам получать опыт и проверять свой уровень на фоне других секций Ингушетии.'] },
  'Родителям: поддержка без давления': { image: wrestlingImages.teamWarmup, paragraphs: ['Поддержка без давления помогает ребёнку не бояться ошибок. В борьбе поражение часто даёт больше материала для роста, чем лёгкая победа.', 'После схватки лучше сначала дать спортсмену выдохнуть, а затем спросить: что получилось, где было трудно и что он хочет исправить на тренировке.', 'Родительская задача — сохранить интерес и дисциплину, а не заменить тренера подсказками и оценками с трибуны.'] },
  'Родителям: режим и восстановление': { image: wrestlingImages.gym, paragraphs: ['Режим напрямую влияет на борьбу: без сна и нормального питания спортсмен хуже держит темп, медленнее реагирует и чаще получает травмы.', 'Юному борцу нужна стабильность: вода, обычная еда, достаточный отдых и отсутствие резких диет перед соревнованиями.', 'Если появилась боль, её нельзя игнорировать. Лучше пропустить часть нагрузки и разобраться с причиной, чем усугубить травму.'] },
  'Родителям: контакт с тренером': { image: wrestlingImages.matTraining, paragraphs: ['Хороший контакт с тренером помогает родителям понимать, какие задачи сейчас стоят перед спортсменом: техника, дисциплина, вес или подготовка к старту.', 'Во время схватки подсказки должны идти от тренера. Лишние голоса сбивают ребёнка и мешают ему выполнять план.', 'После соревнований стоит обсуждать не только место, но и поведение: готовность слушать, бороться до конца и уважать соперников.'] },
  'Вольникам: база техники': { image: wrestlingImages.action, paragraphs: ['База вольника начинается со стойки. Если стойка разваливается, проходы становятся предсказуемыми, а защита ног запаздывает.', 'Каждый проход должен иметь продолжение: захват, движение корпусом, перевод соперника и контроль после падения.', 'Тренируйте не только любимую атаку, но и выходы из неудачной попытки. На соревнованиях соперник редко даст идеальную ситуацию.'] },
  'Вольникам: физика и дисциплина': { image: wrestlingImages.gym, paragraphs: ['Физика в борьбе — это не только сила. Нужны шея, корпус, хват, взрывная работа ног и выносливость, чтобы не проседать во втором периоде.', 'Дневник веса и самочувствия помогает увидеть, когда нагрузка слишком высокоая, а когда спортсмен готов прибавлять.', 'Дисциплина важнее редких тяжёлых тренировок. Регулярная работа над базой даёт больше, чем попытка резко наверстать всё перед турниром.'] },
  'Вольникам: соревнования': { image: wrestlingImages.youthMat, paragraphs: ['Соревнования начинаются до выхода на ковёр: вес, форма, документы, питание, разминка и понимание времени первой схватки.', 'Разминка должна включать движение, дыхание, реакцию, несколько привычных атак и короткие эпизоды с партнёром.', 'После турнира запишите две ошибки и два сильных действия. Так тренировка после старта будет точкой, а не просто тяжёлой.'] }
});

function metaFrom(card) {
  const meta = card.querySelector('.news-meta, .fighter-stats, .section-meta');
  if (!meta) return '';
  return Array.from(meta.children)
    .map(item => item.textContent.trim())
    .filter(Boolean)
    .join(' · ');
}

function bodyFrom(card) {
  const listItems = Array.from(card.querySelectorAll('li'))
    .map(item => item.textContent.trim())
    .filter(Boolean);
  const details = detailFor(card);

  if (listItems.length) {
    return paragraphsToHtml([...listItems, ...details.paragraphs]);
  }

  const paragraphs = Array.from(card.querySelectorAll('p'))
    .map(item => item.textContent.trim())
    .filter(Boolean);

  const addr = card.querySelector('.section-address')?.textContent.trim();
  if (addr) paragraphs.push(addr);

  const contact = card.querySelector('.section-contacts')?.textContent.trim();
  if (contact) paragraphs.push(contact);

  const rating = card.querySelector('.rating-value')?.textContent.trim();
  if (rating) paragraphs.push(rating);

  return paragraphsToHtml([...paragraphs, ...details.paragraphs]);
}

function detailFor(card) {
  const custom = detailContent[detailKeyFrom(card)];
  if (custom) return custom;

  if (card.classList.contains('news-card')) {
    return defaultDetail.news;
  }

  if (card.classList.contains('tournament-card')) {
    return defaultDetail.tournament;
  }

  if (card.classList.contains('fighter-card')) {
    return defaultDetail.fighter;
  }

  if (card.classList.contains('section-card')) {
    return defaultDetail.section;
  }

  if (card.classList.contains('tip-card')) {
    return defaultDetail.tip;
  }

  return { image: '', paragraphs: [] };
}

function imageFrom(card) {
  if (card.classList.contains('fighter-card')) {
    const imageNode = card.querySelector('.fighter-img');
    if (imageNode) {
      const inline = imageNode.style.backgroundImage;
      const match = inline.match(/url\(["']?([^"')]+)["']?\)/);
      if (match) return match[1];
    }
  }

  const details = detailFor(card);
  if (details.image) return details.image;

  const imageNode = card.querySelector('.fighter-img');
  if (imageNode) {
    const inline = imageNode.style.backgroundImage;
    const match = inline.match(/url\(["']?([^"')]+)["']?\)/);
    if (match) return match[1];
  }

  if (card.classList.contains('news-card')) {
    return defaultDetail.news.image;
  }

  if (card.classList.contains('tournament-card')) {
    return defaultDetail.tournament.image;
  }

  if (card.classList.contains('section-card')) {
    return defaultDetail.section.image;
  }

  if (card.classList.contains('tip-card')) {
    return defaultDetail.tip.image;
  }

  return '';
}

function openDetail(card) {
  const title = textFrom(card, 'h3') || textFrom(card, 'h2');
  const meta = metaFrom(card);
  const body = bodyFrom(card);
  const image = imageFrom(card);

  const active = document.querySelector('.tab-content.active-tab');
  if (active?.id && active.id !== 'detail-tab') previousTabId = active.id;

  pageDetailTitle.textContent = title;
  pageDetailMeta.textContent = meta;
  pageDetailBody.innerHTML = body || '<p>Подробная информация добавляется.</p>';
  detailCover.style.backgroundImage = image
    ? `linear-gradient(rgba(5,8,22,0.08), rgba(5,8,22,0.72)), url("${image}")`
    : '';

  tabContents.forEach(tab => tab.classList.remove('active-tab'));
  detailTab.classList.add('active-tab');
  navLinks.forEach(item => item.classList.remove('active'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.news-card, .tournament-card, .fighter-card, .section-card, .tip-card').forEach(card => {
  card.tabIndex = 0;
  card.setAttribute('role', 'button');

  card.addEventListener('click', e => {
    if (e.target.closest('[data-score]')) return;
    if (e.target.closest('.news-source')) return;
    e.preventDefault();
    openDetail(card);
  });

  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDetail(card);
    }
  });
});

updateProfileButton();
