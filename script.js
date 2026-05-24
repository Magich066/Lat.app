const navLinks = document.querySelectorAll('.nav-link');
const tabContents = document.querySelectorAll('.tab-content');

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
  button.addEventListener('click', () => {
    openTab(button.dataset.openTab);
  });
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
  document.getElementById('regName').value = '';
  document.getElementById('regEmail').value = '';
  document.getElementById('regPassword').value = '';
});

document.getElementById('closeLogin').onclick = () => {
  loginModal.style.display = 'none';
};

document.getElementById('openSettings').onclick = () => {
  settingsModal.style.display = 'flex';
};

document.getElementById('closeSettings').onclick = () => {
  settingsModal.style.display = 'none';
};

document.getElementById('closeDetail').onclick = () => {
  detailModal.style.display = 'none';
};

detailBack.addEventListener('click', () => {
  tabContents.forEach(tab => tab.classList.remove('active-tab'));
  document.getElementById(previousTabId)?.classList.add('active-tab');
  navLinks.forEach(item => item.classList.toggle('active', item.dataset.tab === previousTabId));
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

if (registerBtn) {
  registerBtn.addEventListener('click', () => {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;

    if (name.length < 2 || !email.includes('@') || password.length < 6) {
      registerMessage.textContent = languageToggle?.checked
        ? 'Enter a name, valid email and password from 6 characters.'
        : 'Введите имя, корректный email и пароль от 6 символов.';
      return;
    }

    localStorage.setItem('lattUser', JSON.stringify({
      name,
      email,
      createdAt: new Date().toISOString()
    }));

    registerMessage.textContent = languageToggle?.checked
      ? 'Registration completed. Profile saved in this browser.'
      : 'Регистрация выполнена. Профиль сохранён в этом браузере.';
    updateProfileButton();

    setTimeout(() => {
      loginModal.style.display = 'none';
    }, 900);
  });
}

[loginModal, settingsModal, detailModal].forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    loginModal.style.display = 'none';
    settingsModal.style.display = 'none';
    detailModal.style.display = 'none';
  }
});

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

const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('nav');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
  });
}

function setSectionRating(card, score) {
  const id = card.dataset.sectionId;
  card.querySelectorAll('[data-score]').forEach(button => {
    button.classList.toggle('active', Number(button.dataset.score) <= score);
  });

  const value = card.querySelector('.rating-value');
  if (value) {
    value.textContent = languageToggle.checked ? `Rating: ${score}/5` : `Оценка: ${score}/5`;
    value.setAttribute('data-ru', `Оценка: ${score}/5`);
    value.setAttribute('data-en', `Rating: ${score}/5`);
  }

  if (id) localStorage.setItem(`sectionRating:${id}`, String(score));
}

document.querySelectorAll('.section-card').forEach(card => {
  const saved = Number(localStorage.getItem(`sectionRating:${card.dataset.sectionId}`));
  if (saved) setSectionRating(card, saved);

  card.querySelectorAll('[data-score]').forEach(button => {
    button.addEventListener('click', e => {
      e.stopPropagation();
      setSectionRating(card, Number(button.dataset.score));
    });
  });
});

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
  gazimagomedov: 'images/gazimagomedov.svg',
  mevloev: 'images/mevloev.png',
  tsokaev: 'images/tsokaev.png',
  kudukhov: 'images/kudukhov.png',
  zhumalov: 'images/zhumalov.svg',
  kurugliev: 'images/kurugliev.svg',
  rashidov: 'images/rashidov.svg'
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
  'Максим Монгуш выиграл первенство Европы U-17': {
    image: wrestlingImages.youthMat,
    paragraphs: [
      'Эта новость важна для юношеской борьбы: победа в категории до 65 кг показывает, что спортсмен уже умеет выдерживать международный темп и серию напряжённых схваток.',
      'Для возраста U-17 особенно ценны дисциплина веса, быстрый вход в борьбу с первых секунд и способность не терять концентрацию после успешного действия.',
      'Такие результаты помогают тренерам видеть, какие качества нужно развивать у молодых вольников: базовую стойку, защиту ног, работу за пределами центра ковра и психологическую устойчивость.'
    ]
  },
  'В Каспийске прошёл Мемориал Алиева': {
    image: wrestlingImages.olympicFinal,
    paragraphs: [
      'Мемориал Али Алиева - один из заметных турниров для борцов вольного стиля на Северном Кавказе. Каспийск традиционно собирает сильных спортсменов и тренеров.',
      'Для участников такой старт проверяет не только технику, но и готовность бороться против разных школ: дагестанской, осетинской, чеченской, ингушской и зарубежной.',
      'Зрителю стоит смотреть на плотность схваток, работу в партере и концовки периодов: именно там часто видно, кто лучше готов физически и тактически.'
    ]
  },
  'Магомед-Тагир Ханиев завоевал серебро': {
    image: wrestlingImages.action,
    paragraphs: [
      'Серебро на рейтинговом турнире в весе до 97 кг - серьёзный результат, потому что тяжёлые категории требуют мощной физики, контроля позиции и осторожной работы против контратак.',
      'Путь до финала показывает, что спортсмен выдержал несколько схваток и смог сохранить качество борьбы на фоне усталости.',
      'Для молодых борцов здесь важный урок: медаль начинается не в финале, а в подготовке, весовом режиме, разминке и умении бороться каждый эпизод до свистка.'
    ]
  },
  'Зелимхан Чаниев отличился на первенстве России': {
    image: wrestlingImages.youthMat,
    paragraphs: [
      'Первенство России до 21 года - этап, где юниоры уже сталкиваются с почти взрослой конкуренцией. Здесь важны не только скорость, но и зрелая тактика.',
      'Для представителя региона сильное выступление означает шанс закрепиться в поле зрения тренеров и получить опыт против борцов из разных школ.',
      'Особенно полезно разбирать такие старты по видео: как спортсмен входит в захват, где выбирает атаку и как защищает преимущество в концовке.'
    ]
  },
  'Определились победители Мемориала Алиева': {
    image: wrestlingImages.olympicFinal,
    paragraphs: [
      'Итоги крупного турнира показывают реальную расстановку сил: кто готов к сезону, какие веса наиболее конкурентны и какие регионы привезли сильные составы.',
      'Для борцов и тренеров список победителей полезен как ориентир перед следующими сборами и стартами. Он помогает понять, с кем придётся встречаться дальше.',
      'В подробностях таких турниров важны не только чемпионы, но и призёры: часто именно они через следующий сезон становятся главными претендентами на золото.'
    ]
  },
  'Борцы Ингушетии выступили во Владикавказе': {
    image: wrestlingImages.teamWarmup,
    paragraphs: [
      'Выездной турнир во Владикавказе полезен для команды тем, что спортсмены получают опыт вне привычного зала и встречаются с другими стилями борьбы.',
      'Для тренеров такие старты показывают, кто готов к более сильным соревнованиям, кто умеет держать вес и кто сохраняет дисциплину на выезде.',
      'Командный формат важен для молодых борцов: рядом есть партнёры, тренеры и пример старших спортсменов, а значит проще учиться правильно готовиться к схватке.'
    ]
  },
  'Мемориал Али Алиева': {
    image: wrestlingImages.olympicFinal,
    paragraphs: [
      'Турнир посвящён памяти Али Алиева и остаётся сильной площадкой для вольников. Здесь ценятся опыт, характер и умение быстро перестраиваться под соперника.',
      'Для спортсмена это возможность проверить форму в условиях высокой конкуренции, а для тренера - увидеть, какие действия стабильно проходят под давлением.',
      'Главные зоны внимания: борьба за первый балл, защита ног, активность у края ковра и способность удержать преимущество во втором периоде.'
    ]
  },
  'Первенство Европы U-17': {
    image: wrestlingImages.youthMat,
    paragraphs: [
      'Юношеское первенство Европы показывает уровень ближайшего резерва. В этом возрасте спортсмены уже должны уверенно владеть базой и уметь выполнять план на схватку.',
      'Сильное выступление в U-17 помогает борцу получить международный опыт до перехода во взрослую борьбу, где темп и цена ошибки выше.',
      'Для тренировки после такого турнира полезно выбрать одну тему: атаки в ноги, защита от проходов, выход из партера или работа за пределами центра.'
    ]
  },
  'Турнир «Мухаммед Мало»': {
    image: wrestlingImages.action,
    paragraphs: [
      'Рейтинговый турнир важен тем, что каждый результат влияет на позицию спортсмена и его дальнейший соревновательный календарь.',
      'Вес до 97 кг требует сочетания силы и подвижности. Побеждает не просто самый мощный, а тот, кто лучше контролирует дистанцию и не отдаёт лёгкие баллы.',
      'Для подготовки к таким стартам тренеры обычно усиливают работу над выносливостью, защитой ног, контратаками и умением бороться при минимальном счёте.'
    ]
  },
  'Первенство России до 21 года': {
    image: wrestlingImages.youthMat,
    paragraphs: [
      'Категория до 21 года - переход между юношеской и взрослой борьбой. Здесь уже недостаточно одной скорости: нужна тактика, терпение и стабильность.',
      'Такие соревнования помогают понять, кто готов к более высоким стартам и кто способен выдерживать давление сильной сетки.',
      'После первенства важно не просто запомнить место, а разобрать схватки: где потеряны баллы, где не хватило движения и какие атаки нужно закреплять.'
    ]
  },
  'Первенство России в Назрани': {
    image: wrestlingImages.gym,
    paragraphs: [
      'Соревнования в Назрани важны для развития борцовской среды региона: домашняя площадка даёт молодым спортсменам пример большого турнира рядом с ними.',
      'Даже если событие связано с греко-римской борьбой, организация турнира, дисциплина команд и соревновательный опыт полезны для всей борцовской школы.',
      'Для секций региона такие старты становятся мотивацией: дети видят сильных спортсменов, тренеры получают ориентиры, а клубы укрепляют соревновательную культуру.'
    ]
  },
  'Кавказские турниры по вольной борьбе': {
    image: wrestlingImages.teamWarmup,
    paragraphs: [
      'Кавказские турниры ценятся плотной конкуренцией. На одной площадке могут встретиться спортсмены из Дагестана, Осетии, Чечни, Ингушетии и соседних регионов.',
      'Для вольника это хорошая проверка характера: разные школы дают разный темп, разные захваты и разные способы давления.',
      'Регулярные старты в регионе помогают быстрее расти, потому что спортсмен привыкает к сильным соперникам и учится бороться без страха перед именами.'
    ]
  },
  'Абдулрашид Садулаев': {
    image: wrestlingImages.sadulaev,
    paragraphs: [
      'Садулаев известен мощной борьбой в верхних весах, давлением в стойке и умением быстро переводить преимущество в баллы.',
      'Его стиль полезно изучать по эпизодам: вход в контакт, контроль корпуса соперника, работа после первого действия и спокойствие в решающие секунды.',
      'Для молодых борцов главный урок - сила должна идти вместе с техникой. Даже физически сильный спортсмен обязан держать стойку, дистанцию и дисциплину.'
    ]
  },
  'Заурбек Сидаков': {
    image: wrestlingImages.sidakov,
    paragraphs: [
      'Сидаков выделяется тактической борьбой, грамотной работой в концовках и умением не раскрывать лишние возможности для контратаки.',
      'В весе до 74 кг особенно важны скорость рук, чувство дистанции и способность мгновенно переходить от защиты к атаке.',
      'Его схватки хорошо смотреть тем, кто хочет понять, как выигрывать не только за счёт мощи, но и за счёт терпения, выбора момента и контроля счёта.'
    ]
  },
  'Заур Угуев': {
    image: wrestlingImages.uguev,
    paragraphs: [
      'Угуев - пример лёгкого веса, где решают взрывная скорость, проходы в ноги и стабильная защита от ответных атак.',
      'Его борьба показывает, как важно не останавливаться после первого касания ноги: атаку нужно завершать контролем и положением, которое даёт баллы.',
      'Для юных вольников это хороший ориентир по работе ног, реакции и умению сохранять темп на протяжении всей схватки.'
    ]
  },
  'Бувайсар Сайтиев': {
    image: wrestlingImages.saytiyev,
    paragraphs: [
      'Бувайсар Сайтиев считается одним из величайших борцов вольного стиля благодаря технике, пластичности и способности читать соперника.',
      'Его стиль ценен тем, что он часто побеждал не грубой силой, а таймингом, углами атаки и умением заставлять соперника ошибаться.',
      'Для тренировки можно взять один принцип: не идти прямо в силу соперника, а менять направление, работать руками и создавать удобный момент для прохода.'
    ]
  },
  'Артур Найфонов': {
    image: wrestlingImages.naifonov,
    paragraphs: [
      'Найфонов выступает в среднем весе, где нужно сочетать силовую борьбу, гибкость и готовность держать высокий темп.',
      'Его сильная сторона - плотный контакт и давление, которое заставляет соперника защищаться и ошибаться у края ковра.',
      'Для молодых спортсменов полезно смотреть, как он сохраняет позицию после атаки и не отдаёт сопернику лёгкий выход из опасного положения.'
    ]
  },
  'Мавлет Батиров': {
    image: wrestlingImages.batirov,
    paragraphs: [
      'Батиров известен выступлениями в лёгких весах, где цена каждой секунды особенно высока. Там нельзя долго готовить атаку без движения.',
      'Его сильная сторона - взрывное начало действия и умение быстро переводить скорость в результативный проход.',
      'Для тренировки это пример того, что скорость должна быть точной: атаковать нужно из правильной стойки, с контролем рук и готовностью продолжить борьбу.'
    ]
  },
  'Бесик Кудухов': {
    image: wrestlingImages.action,
    paragraphs: [
      'Кудухов запомнился высоким темпом, атакующей манерой и постоянным давлением на соперника.',
      'Его борьба показывает, насколько важны движение, смена уровней и готовность атаковать сериями, а не одним отдельным проходом.',
      'Для юных борцов это пример того, что активность должна быть осмысленной: каждое движение должно создавать угрозу или улучшать позицию.'
    ]
  },
  'Хаджимурад Гацалов': {
    image: wrestlingImages.gatsalov,
    paragraphs: [
      'Гацалов известен выступлениями в тяжёлых категориях, где решают контроль корпуса, мощная стойка и умение навязать свой темп.',
      'В тяжёлых весах ошибка часто приводит к большим потерям, поэтому особенно важны дисциплина рук и аккуратность при входе в атаку.',
      'Его стиль полезен для изучения тем, кто хочет понять, как сочетать силу, выносливость и позиционную борьбу.'
    ]
  },
  'Сослан Рамонов': {
    image: wrestlingImages.ramonov,
    paragraphs: [
      'Рамонов известен скоростной борьбой, гибкой техникой и умением быстро менять направление атаки.',
      'В весе до 65 кг важно не только быстро пройти в ноги, но и удержать соперника, не дать ему развернуться и забрать ответный балл.',
      'Его схватки полезно смотреть для понимания движения: как борец создаёт угол, как работает руками и как продолжает атаку после первой защиты соперника.'
    ]
  },
  'Магомед Евлоев': {
    image: wrestlingImages.action,
    paragraphs: [
      'Магомед Евлоев — перспективный ингушский борец вольного стиля. Выступает в весовой категории до 74 кг, где ценится сочетание скорости и силовой выносливости.',
      'Регулярные выступления на всероссийских турнирах помогают ему набирать опыт и подниматься в рейтингах. Агрессивный стиль и плотная борьба — его визитная карточка.',
      'Для молодых спортсменов Ингушетии он пример того, как системная работа и дисциплина выводят на уровень чемпионата России.'
    ]
  },
  'Али Цокаев': {
    image: wrestlingImages.youthMat,
    paragraphs: [
      'Али Цокаев — молодой ингушский борец вольного стиля, показывающий стабильные результаты на региональных и всероссийских соревнованиях.',
      'Выступает в лёгких весах (61-65 кг), где решают скорость, взрывная работа ног и умение быстро переключаться между атакой и защитой.',
      'Его карточка полезна для начинающих борцов: она показывает, что даже без олимпийских титулов можно быть сильным спортсменом и представлять свой регион на высоком уровне.'
    ]
  },
  'Магомедрасул Газимагомедов': {
    image: wrestlingImages.gazimagomedov,
    paragraphs: [
      'Газимагомедов выступает в средних весах, где важны физическая мощь, плотный захват и умение контролировать позицию после атаки.',
      'Его борьба показывает, что проход в ноги - только начало эпизода. Дальше нужно удержать соперника, не дать ему выйти и завершить действие баллами.',
      'Для тренировок полезно смотреть, как он соединяет силовое давление с техническими продолжениями.'
    ]
  },
  'Магомед-Тагир Ханиев': {
    image: wrestlingImages.action,
    paragraphs: [
      'Ханиев представляет Ингушетию в весе до 97 кг, где особенно важны сила, устойчивость и умение работать против крупных соперников.',
      'Серебро на рейтинговом турнире показывает, что спортсмен способен выдерживать турнирную нагрузку и доходить до решающих схваток.',
      'Для молодых вольников его карточка полезна как пример: региональный спортсмен может расти через регулярные старты, дисциплину веса и работу над базовой техникой.'
    ]
  },
  'Разамбек Жамалов': {
    image: wrestlingImages.zhumalov,
    paragraphs: [
      'Разамбек Жамалов — дагестанский борец вольного стиля, чемпион мира 2024 года в весе до 74 кг. Его путь к титулу прошёл через сильных соперников и плотные схватки.',
      'В весе до 74 кг ценятся не только скорость и сила, но и тактическое мышление: умение распределять силы на несколько дней турнира и перестраиваться под разных соперников.',
      'Для молодых вольников его пример показывает, что чемпионский титул — это результат системной работы, дисциплины веса и готовности бороться на пределе возможностей.'
    ]
  },
  'Даурен Куруглиев': {
    image: wrestlingImages.kurugliev,
    paragraphs: [
      'Даурен Куруглиев — дагестанский борец вольного стиля, чемпион мира и Европы в весе до 86 кг. Известен мощной физической подготовкой и агрессивной манерой ведения схватки.',
      'В среднем весе конкуренция особенно высока, поэтому стабильные победы на крупных турнирах говорят о высоком уровне спортсмена и его способности держать форму на протяжении всего сезона.',
      'Его стиль полезен для изучения: плотный контакт, постоянное давление и умение использовать физическое преимущество без потери техники.'
    ]
  },
  'Гаджимурад Рашидов': {
    image: wrestlingImages.rashidov,
    paragraphs: [
      'Гаджимурад Рашидов — дагестанский борец вольного стиля, чемпион мира в весе до 65 кг. Отличается взрывной скоростью, техничными проходами в ноги и стабильностью на крупных турнирах.',
      'Лёгкий вес требует максимальной подвижности, быстрых решений и идеальной работы ног. Рашидов показывает, как сочетать скорость с точностью действий.',
      'Для юных борцов его схватки — хороший учебный материал по атакам ног, защите от контрприёмов и умению сохранять темп до финального свистка.'
    ]
  },
  'СК «Ади Ахмад»': {
    image: wrestlingImages.gym,
    paragraphs: [
      'Секция такого типа должна давать спортсмену базу: стойку, страховку, дисциплину на ковре, работу в парах и понимание правил соревнований.',
      'Для детей и юниоров особенно важен постепенный рост нагрузки. Новичка нельзя сразу бросать в жёсткие схватки без техники и контроля безопасности.',
      'Родителям стоит смотреть на атмосферу в зале: как тренер объясняет ошибки, как старшие помогают младшим и есть ли участие в местных турнирах.'
    ]
  },
  'Борцовская секция Нестеровской': {
    image: wrestlingImages.teamWarmup,
    paragraphs: [
      'Секция для школьников должна строиться вокруг регулярности: разминка, базовые упражнения, техника в стойке и простые задания на каждую тренировку.',
      'На первых этапах важнее качество движений, чем победы. Хороший тренер следит, чтобы ребёнок правильно падал, держал стойку и не боялся контакта.',
      'Соревнования для такой группы нужны как опыт, а не как давление. После старта важно спокойно разобрать ошибки и сохранить желание тренироваться.'
    ]
  },
  'Борцовская секция Сурхахи': {
    image: wrestlingImages.matTraining,
    paragraphs: [
      'Начальная подготовка в секции должна формировать привычку к дисциплине: приходить вовремя, слушать тренера, уважать партнёра и работать без лишней грубости.',
      'Для вольной борьбы база включает стойку, перемещения, защиту ног, простые проходы и умение бороться у края ковра.',
      'Если ребёнок только начинает, первые месяцы лучше оценивать не по медалям, а по посещаемости, вниманию на тренировке и уверенности в движениях.'
    ]
  },
  'Родителям: поддержка без давления': {
    image: wrestlingImages.teamWarmup,
    paragraphs: [
      'Поддержка без давления помогает ребёнку не бояться ошибок. В борьбе поражение часто даёт больше материала для роста, чем лёгкая победа.',
      'После схватки лучше сначала дать спортсмену выдохнуть, а затем спросить: что получилось, где было трудно и что он хочет исправить на тренировке.',
      'Родительская задача - сохранить интерес и дисциплину, а не заменить тренера подсказками и оценками с трибуны.'
    ]
  },
  'Родителям: режим и восстановление': {
    image: wrestlingImages.gym,
    paragraphs: [
      'Режим напрямую влияет на борьбу: без сна и нормального питания спортсмен хуже держит темп, медленнее реагирует и чаще получает травмы.',
      'Юному борцу нужна стабильность: вода, обычная еда, достаточный отдых и отсутствие резких диет перед соревнованиями.',
      'Если появилась боль, её нельзя игнорировать. Лучше пропустить часть нагрузки и разобраться с причиной, чем усугубить травму.'
    ]
  },
  'Родителям: контакт с тренером': {
    image: wrestlingImages.matTraining,
    paragraphs: [
      'Хороший контакт с тренером помогает родителям понимать, какие задачи сейчас стоят перед спортсменом: техника, дисциплина, вес или подготовка к старту.',
      'Во время схватки подсказки должны идти от тренера. Лишние голоса сбивают ребёнка и мешают ему выполнять план.',
      'После соревнований стоит обсуждать не только место, но и поведение: готовность слушать, бороться до конца и уважать соперников.'
    ]
  },
  'Вольникам: база техники': {
    image: wrestlingImages.action,
    paragraphs: [
      'База вольника начинается со стойки. Если стойка разваливается, проходы становятся предсказуемыми, а защита ног запаздывает.',
      'Каждый проход должен иметь продолжение: захват, движение корпусом, перевод соперника и контроль после падения.',
      'Тренируйте не только любимую атаку, но и выходы из неудачной попытки. На соревнованиях соперник редко даст идеальную ситуацию.'
    ]
  },
  'Вольникам: физика и дисциплина': {
    image: wrestlingImages.gym,
    paragraphs: [
      'Физика в борьбе - это не только сила. Нужны шея, корпус, хват, взрывная работа ног и выносливость, чтобы не проседать во втором периоде.',
      'Дневник веса и самочувствия помогает увидеть, когда нагрузка слишком высокая, а когда спортсмен готов прибавлять.',
      'Дисциплина важнее редких тяжёлых тренировок. Регулярная работа над базой даёт больше, чем попытка резко наверстать всё перед турниром.'
    ]
  },
  'Вольникам: соревнования': {
    image: wrestlingImages.youthMat,
    paragraphs: [
      'Соревнования начинаются до выхода на ковёр: вес, форма, документы, питание, разминка и понимание времени первой схватки.',
      'Разминка должна включать движение, дыхание, реакцию, несколько привычных атак и короткие эпизоды с партнёром.',
      'После турнира запишите две ошибки и два сильных действия. Так тренировка после старта будет точной, а не просто тяжёлой.'
    ]
  },
  'ДС «Магас» Назрань': {
    image: wrestlingImages.gym,
    paragraphs: [
      'Дворец спорта «Магас» имени Берда Евлоева в Назрани — одна из главных спортивных арен Ингушетии. Здесь регулярно проходят первенства России по греко-римской борьбе.',
      'Зал оборудован современными коврами, раздевалками и трибунами для зрителей. Инфраструктура позволяет проводить соревнования всероссийского уровня.',
      'Для местных спортсменов это возможность тренироваться и выступать на домашней арене, не выезжая за пределы республики.'
    ]
  },
  'Борцовский зал Карабулак': {
    image: wrestlingImages.matTraining,
    paragraphs: [
      'Секция в Карабулаке ориентирована на подготовку борцов вольного стиля. Тренировки проводятся для детей и взрослых в вечернее время.',
      'Основное внимание уделяется базовой технике: стойке, перемещениям, защите ног и простым проходам. Тренеры работают с начинающими.',
      'Участие в республиканских соревнованиях помогает спортсменам получать опыт и проверять свой уровень на фоне других секций Ингушетии.'
    ]
  }
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

document.querySelectorAll('.news-source').forEach(link => {
  link.removeAttribute('href');
  link.removeAttribute('target');
  link.addEventListener('click', e => {
    e.preventDefault();
    const card = link.closest('.news-card, .tournament-card');
    if (card) openDetail(card);
  });
});

updateProfileButton();
