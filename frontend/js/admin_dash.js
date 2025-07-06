const BASE_URL = 'http://127.0.0.1:5000';

// 🔒 Session check
function checkSession() {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
        alert("Access denied. Admin only.");
        window.location.href = "login.html";
        return;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            localStorage.clear();
            alert("Session expired. Please login again.");
            window.location.href = "login.html";
        }
    } catch (e) {
        localStorage.clear();
        window.location.href = "login.html";
    }
}

// 📈 Fetch + render analytics
async function fetchAndRenderAnalytics() {
    const token = localStorage.getItem("access_token");

    try {
        const res = await fetch(`${BASE_URL}/admin/analytics`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Analytics fetch failed");

        renderCharts(data);
    } catch (err) {
        console.error("Analytics error:", err);
        alert("Could not load analytics.");
    }
}

// 📊 Chart rendering
function renderCharts(data) {
    const clientCtx = document.getElementById('clientSignupChart');
    const workerCtx = document.getElementById('workerStatusChart');
    const jobCtx = document.getElementById('jobStatusChart');
    const summaryHTML = `
    <h3>📋 Monthly System Summary</h3>
    <ul>
    <li><strong>${data.clients.this_month}</strong> clients signed up this month 
    (<strong>${data.clients.this_week}</strong> this week, total: <strong>${data.clients.total}</strong>)
    </li>
    <li><strong>${data.jobs.completed}</strong> jobs completed, 
        <strong>${data.jobs.in_progress}</strong> in progress, 
        <strong>${data.jobs.open}</strong> open
    </li>
    <li><strong>${data.workers.approved}</strong> workers approved, 
        <strong>${data.workers.pending}</strong> pending review 
        (total: <strong>${data.workers.total}</strong>)
    </li>
  </ul>
`;

document.getElementById("reportSummary").innerHTML = summaryHTML;


    // Clients bar
    new Chart(clientCtx, {
        type: 'bar',
        data: {
            labels: ['Total', 'This Week', 'This Month'],
            datasets: [{
                label: 'Clients',
                backgroundColor: '#667eea',
                data: [
                    data.clients.total,
                    data.clients.this_week,
                    data.clients.this_month
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }
        }
    });

    // Workers pie
    new Chart(workerCtx, {
        type: 'pie',
        data: {
            labels: ['Approved', 'Pending'],
            datasets: [{
                label: 'Workers',
                backgroundColor: ['#28a745', '#ffc107'],
                data: [data.workers.approved, data.workers.pending]
            }]
        },
        options: { responsive: true }
    });

    // Jobs bar
    new Chart(jobCtx, {
        type: 'bar',
        data: {
            labels: ['Open', 'Requested', 'In Progress', 'Worker Completed', 'Completed'],
            datasets: [{
                label: 'Jobs',
                backgroundColor: '#764ba2',
                data: [
                    data.jobs.open || 0,
                    data.jobs.requested || 0,
                    data.jobs.in_progress || 0,
                    data.jobs.worker_completed || 0,
                    data.jobs.completed || 0
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }
        }
    });
}

// 🚪 Sign out
function signOut() {
    localStorage.clear();
    window.location.href = "login.html";
}

// ✅ Final init
document.addEventListener("DOMContentLoaded", () => {
    checkSession();
    fetchAndRenderAnalytics();
});

