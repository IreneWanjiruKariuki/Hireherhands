const BASE_URL = 'http://127.0.0.1:5000';

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

console.log("Stored token:", localStorage.getItem("access_token"));

async function fetchAndRenderAnalytics() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    alert("Access denied. Not logged in.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/admin/analytics`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Analytics fetch failed");

    renderCharts(data);
  } catch (err) {
    console.error("Analytics error:", err);
    alert("Could not load analytics.");
  }
}


function renderCharts(data) {
    const summaryHTML = `
      <h3> Overrall Summary</h3>
      <ul>
        <li><strong>${data.clients.total}</strong> total clients:${data.clients.this_month} this month, ${data.clients.this_week} this week</li>
        <li><strong>${data.workers.total}</strong> workers: ${data.workers.approved} approved, ${data.workers.pending} pending</li>
        <li><strong>${data.jobs.completed}</strong> jobs completed, ${data.jobs.in_progress} in progress, ${data.jobs.open} open</li>
      </ul>
    `;
    document.getElementById("reportSummary").innerHTML = summaryHTML;
    new Chart(document.getElementById("clientSignupChart"), {
        type: 'bar',
        data: {
            labels: ['This Week', 'This Month', 'Total'],
            datasets: [{
                label: 'Client Signups',
                backgroundColor: '#667eea',
                data: [
                    data.clients.this_week || 0,
                    data.clients.this_month || 0,
                    data.clients.total || 0
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });


    // Client Gender Chart
    new Chart(document.getElementById("genderChart"), {
        type: "pie",
        data: {
            labels: ["Female Clients", "Male Clients"],
            datasets: [{
                data: [data.gender.female_clients, data.gender.male_clients],
                backgroundColor: ["#36a2eb", "#f87171"]
            }]
        }
    });

    // Top Skills Chart
    const topSkillNames = data.skills.top.map(s => s.name);
    const topSkillCounts = data.skills.top.map(s => s.count);

    new Chart(document.getElementById("skillChart"), {
        type: "bar",
        data: {
            labels: topSkillNames,
            datasets: [{
                label: "Workers per Skill",
                data: topSkillCounts,
                backgroundColor: "#8b5cf6"
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            responsive: true
        }
    });

    // Job Trend Line
    new Chart(document.getElementById("trendChart"), {
        type: "line",
        data: {
            labels: data.trends.months,
            datasets: [{
                label: "Jobs Created",
                data: data.trends.counts,
                borderColor: "#10b981",
                backgroundColor: "rgba(16,185,129,0.2)",
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } }
        }
    });

    // Job Status Chart
    new Chart(document.getElementById("jobStatusChart"), {
        type: "bar",
        data: {
            labels: ["Open", "Requested", "In Progress", "Worker Completed", "Completed"],
            datasets: [{
                label: "Jobs",
                backgroundColor: "#f59e0b",
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

    // Worker Approval Pie
    new Chart(document.getElementById("workerStatusChart"), {
        type: "pie",
        data: {
            labels: ["Approved", "Pending"],
            datasets: [{
                backgroundColor: ["#22c55e", "#facc15"],
                data: [data.workers.approved, data.workers.pending]
            }]
        },
        options: {
            responsive: true
        }
    });
}

function signOut() {
    localStorage.clear();
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    checkSession();
    fetchAndRenderAnalytics();
});
