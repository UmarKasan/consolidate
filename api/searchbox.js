// api/searchbox.js (Client-side AJAX/LocalStorage logic)
document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.getElementById('seachbox');

  if (!searchButton) {
    console.error("Search button with ID 'seachbox' not found.");
    return;
  }

  searchButton.addEventListener('click', function(event) {
    event.preventDefault();

    // Check localStorage for login status.
    // Expects 'isLoggedIn' to be set to the string 'true' on successful login.
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
      console.log("User is logged in. Redirecting to main.html");
      // Redirect the current window to main.html
      window.location.href = 'pages/main.html';
    } else {
      console.log("User is not logged in. Redirecting to login.html");
      // Redirect the current window to login.html
      window.location.href = 'pages/login.html';
    }
  });
});
