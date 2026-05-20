const navLinks = document.querySelectorAll('.nav-link');
const tabContents = document.querySelectorAll('.tab-content');

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navLinks.forEach(item => item.classList.remove('active'));
    tabContents.forEach(tab => tab.classList.remove('active-tab'));
    link.classList.add('active');
    const target = document.getElementById(link.dataset.tab);
    if (target) target.classList.add('active-tab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('hamburger')?.classList.remove('open');
    document.querySelector('nav')?.classList.remove('open');
  });
});

const loginModal = document.getElementById('loginModal');
const settingsModal = document.getElementById('settingsModal');

document.getElementById('openLogin').onclick = () => {
  loginModal.style.display = 'flex';
};

document.getElementById('closeLogin').onclick = () => {
  loginModal.style.display = 'none';
};

document.getElementById('openSettings').onclick = () => {
  settingsModal.style.display = 'flex';
};

document.getElementById('closeSettings').onclick = () => {
  settingsModal.style.display = 'none';
};

[loginModal, settingsModal].forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    loginModal.style.display = 'none';
    settingsModal.style.display = 'none';
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
