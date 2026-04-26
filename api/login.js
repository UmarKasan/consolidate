// api/login.js (Client-side AJAX/LocalStorage logic)
document.addEventListener('DOMContentLoaded', function() {
  const loginButton = document.getElementById('login');
  const username = document.getElementById('username');
  const password = document.getElementById('password');

  // --- MOCK USER DATA ---
    // For demonstration, we define two user credentials.
    const MOCK_USERS = [
        { username: 'user@container.com', password: 'password123', role: 'basic' },
        { username: 'freight@stupid.com', password: 'password123', role: 'basic' },
        { username: 'admin@console.com', password: 'adminpass', role: 'administrator' }
    ];

    if (!loginForm || !messageElement) {
        console.error("Login form or message element not found. Please check your HTML structure.");
        return;
    }

    // Clear any previous messages
    messageElement.textContent = '';

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission/page reload

        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();

        // 1. Attempt to validate credentials against mock users
        const userFound = MOCK_USERS.find(user => user.username === usernameInput && user.password === passwordInput);

        if (userFound) {
            // Success path
            localStorage.setItem('authToken', 'mock_token_' + userFound.role);
            localStorage.setItem('userRole', userFound.role);
            // ... success logic ...
        setTimeout(() => {
            console.log("Login successful. Redirecting to dashboard...");
            window.location.href = 'pages/main.html';
    }, 1500);

        } else {
            // Failure path
            messageElement.textContent = 'Invalid username or password. Please try again.';
            messageElement.style.color = 'red';
            console.warn("Login failed attempt for user: " + usernameInput);
        }
    });
});
