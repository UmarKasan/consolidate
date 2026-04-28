// ─── Seed default users if not already in localStorage ───────────────────────
(function seedUsers() {
  if (!localStorage.getItem('allUsers')) {
    const users = [
      { email: "admin@example.com",    password: "pass123" },
      { email: "coloader@example.com", password: "pass123" },
      { email: "freight@example.com",  password: "pass123" }
    ];
    localStorage.setItem('allUsers', JSON.stringify(users));
  }
})();

// ─── Constants ────────────────────────────────────────────────────────────────
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// ─── DOM helpers (resolved lazily so inline onclick= works at any time) ───────
function getEmailInput()    { return document.getElementById('email'); }
function getPasswordInput() { return document.getElementById('password'); }
function getLoginButton()   { return document.getElementById('login'); }
function getErrorBanner()   { return document.getElementById('error-banner'); }

// ─── Credential check ─────────────────────────────────────────────────────────
function checkCredentials(email, password) {
  try {
    const users = JSON.parse(localStorage.getItem('allUsers')) || [];
    return users.some(u => u.email === email && u.password === password);
  } catch {
    return false;
  }
}

// ─── Error display ────────────────────────────────────────────────────────────
function showError(message) {
  const banner = getErrorBanner();
  if (!banner) return;
  const span = banner.querySelector('span:last-child');
  if (span) span.textContent = message;
  banner.classList.remove('hidden');
  banner.classList.add('shake');
  banner.addEventListener('animationend', () => banner.classList.remove('shake'), { once: true });
}

function clearError() {
  const banner = getErrorBanner();
  if (!banner) return;
  banner.classList.add('hidden');
  const span = banner.querySelector('span:last-child');
  if (span) span.textContent = '';
}

// ─── Login handler (global — called by inline onclick in HTML) ────────────────
function handleLogin(e) {
  if (e) e.preventDefault();
  clearError();

  const emailInput    = getEmailInput();
  const passwordInput = getPasswordInput();
  const loginButton   = getLoginButton();

  const email    = emailInput    ? emailInput.value.trim()    : '';
  const password = passwordInput ? passwordInput.value.trim() : '';

  if (!email || !password) {
    showError('Please enter both email and password.');
    return;
  }

  if (checkCredentials(email, password)) {
    localStorage.setItem('isLoggedIn',    'true');
    localStorage.setItem('loggedInEmail', email);
    localStorage.setItem('lastLoginTime', Date.now().toString());

    if (loginButton) {
      loginButton.textContent = 'Redirecting\u2026';
      loginButton.disabled    = true;
    }

    window.location.href = '../pages/main.html';
  } else {
    showError('Username or password is wrong. Please try again.');
    if (passwordInput) {
      passwordInput.value = '';
      passwordInput.focus();
    }
  }
}

// ─── Persistent session check ─────────────────────────────────────────────────
function checkPersistentLogin() {
  const isLoggedIn    = localStorage.getItem('isLoggedIn');
  const lastLoginTime = localStorage.getItem('lastLoginTime');

  if (isLoggedIn === 'true' && lastLoginTime) {
    const elapsed = Date.now() - parseInt(lastLoginTime, 10);
    if (elapsed < SESSION_TIMEOUT_MS) {
      window.location.href = 'main.html';
      return true;
    }
    logout();
  }
  return false;
}

// ─── Logout helper ────────────────────────────────────────────────────────────
function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('loggedInEmail');
  localStorage.removeItem('lastLoginTime');
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (checkPersistentLogin()) return;

  // Enter key on either field triggers login
  [getEmailInput(), getPasswordInput()].forEach(input => {
    if (input) {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') handleLogin(e);
      });
    }
  });
});