// MENU TOGGLE
document.getElementById('menuToggle').addEventListener('click', () => {
  const menu = document.getElementById('menu');
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
});

// THEME TOGGLE
const themeToggle = document.getElementById('themeToggle');
function setTheme(mode) {
  if (mode === 'light') {
    document.documentElement.classList.add('light');
    themeToggle.textContent = '🌞';
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.remove('light');
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme', 'dark');
  }
}
setTheme(localStorage.getItem('theme') || 'dark');
themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.classList.contains('light');
  setTheme(isLight ? 'dark' : 'light');
});

// USER DATA
const loggedUser = JSON.parse(localStorage.getItem('user'));
if (!loggedUser) {
  window.location.href = 'onboarding.html';
}
const users = JSON.parse(localStorage.getItem('users') || '{}');
const currentUser = users[loggedUser.username] || {
  goal: 30,
  daysCompleted: [false, false, false, false, false, false, false],
  startTime: new Date().getTime()
};

// WEEK STREAK
const dayCircles = document.querySelectorAll('.day-circle');
function updateWeekStreak() {
  dayCircles.forEach((c, i) => {
    c.innerHTML = '';
    if (currentUser.daysCompleted[i]) {
      c.classList.add('completed');
      c.textContent = '+';
      c.classList.add('animate');
      confetti({ particleCount: 30, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => c.classList.remove('animate'), 500);
    } else {
      c.classList.remove('completed');
      c.textContent = '-';
    }
  });
}
updateWeekStreak();

// COUNTDOWN
const countdownEl = document.getElementById('countdown');
const bigCircle = document.getElementById('bigCircle');
let startTime = currentUser.startTime;

function updateCountdown() {
  const now = new Date().getTime();
  const diff = now - startTime;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  countdownEl.textContent = `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;

  const progress = Math.min((days / currentUser.goal) * 100, 100);
  if (progress < 30) bigCircle.textContent = 'Beginner';
  else if (progress < 60) bigCircle.textContent = 'Intermediate';
  else bigCircle.textContent = 'Advanced';
  bigCircle.style.transform = `scale(${0.9 + progress / 200})`;

  const progressBar = document.getElementById('progressBar');
  progressBar.style.width = progress < 1 ? '5%' : progress + '%';
  document.getElementById('progressText').textContent = Math.floor(progress) + '%';
}
setInterval(updateCountdown, 1000);
updateCountdown();

// ICONS
document.getElementById('meditate').addEventListener('click', () => window.location.href = 'breathing.html');
document.getElementById('reset').addEventListener('click', () => {
  startTime = new Date().getTime();
  currentUser.startTime = startTime;
  users[loggedUser.username] = currentUser;
  localStorage.setItem('users', JSON.stringify(users));
  updateCountdown();
});

// PANIC BUTTON
const panicBtn = document.getElementById('panicBtn');
const panicOverlay = document.getElementById('panicOverlay');
panicBtn.addEventListener('click', async () => {
  panicOverlay.style.display = 'flex';
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200, 100, 400]);
  }
  const audio = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
  audio.play();
});
function endPanic() {
  panicOverlay.style.display = 'none';
}
