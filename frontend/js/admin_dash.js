const BASE_URL = 'http://127.0.0.1:5000';

document.addEventListener("DOMContentLoaded", () => {
  if (!checkSession("admin")) return;

  // Page-specific admin dashboard logic goes here
  console.log("Admin authenticated. Ready to load dashboard data...");
  // You can fetch metrics or summaries here if needed
});

function checkSession(requiredRole = "admin") {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role"); // ← use this instead

  if (!token || role !== requiredRole) {
    localStorage.clear();
    showErrorModal("Access denied. Please login as admin.", "login.html");
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      localStorage.clear();
      showErrorModal("Session expired. Please login again.", "login.html");
      return false;
    }
  } catch {
    localStorage.clear();
    showErrorModal("Invalid session. Please login again.", "login.html");
    return false;
  }

  return true;
}


function signOut() {
  localStorage.clear();
  window.location.href = "login.html";
}

// Optional: Helper modal function if not already in modal.js
function showErrorModal(message, redirectUrl) {
  alert(message);
  if (redirectUrl) window.location.href = redirectUrl;
}
