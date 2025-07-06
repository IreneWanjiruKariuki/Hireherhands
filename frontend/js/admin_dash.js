const token = localStorage.getItem("access_token");
const role = localStorage.getItem("role");

if (!token || role !== "admin") {
    alert("Access denied. Only admins can access this page.");
    window.location.href = "login.html"; 
}
