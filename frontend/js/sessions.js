const BASE_URL = 'http://127.0.0.1:5000';

function checkSession(requiredRole = "admin") {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token || role !== requiredRole) {
        showErrorModal("Access denied. Please login as admin.", "login.html");
        return false;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            localStorage.clear();
            showErrorModal("Session expired. Please login again.", "login.html");
            return false;
        }
    } catch (e) {
        localStorage.clear();
        showErrorModal("Invalid session. Please login again.", "login.html");
        return false;
    }

    return true;
}
