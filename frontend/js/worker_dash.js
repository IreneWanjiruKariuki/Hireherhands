const BASE_URL = "http://localhost:5000";
let currentFilter = "all";
let originalBioText = "";
let originalRate = "";

document.addEventListener("DOMContentLoaded", () => {
  loadWorkerProfile();
  initializeBio();
  initializeRate();
  loadJobs();
});

async function loadWorkerProfile() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("Please login.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/worker/profile`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to load worker profile");

    const data = await res.json();

    document.getElementById("workerName").textContent = data.fullname;
    document.getElementById("workerPhone").textContent = data.phone;
    document.getElementById("workerEmail").textContent = data.email;
    document.getElementById("bioText").textContent = data.bio || "No bio set yet.";
    document.getElementById("hourlyRate").textContent = data.hourly_rate || "0";

    document.getElementById("bioEditor").value = data.bio || "";
    document.getElementById("rateInput").value = data.hourly_rate || "";

  } catch (err) {
    console.error(err);
    alert("Could not load profile.");
  }
}

function filterJobs(status, event) {
  if (event) {
    event.preventDefault();
    document.querySelectorAll(".filter-tab").forEach(tab => tab.classList.remove("active"));
    event.target.classList.add("active");
  }
  currentFilter = status;
  loadJobs();
}
function normalizeStatus(job) {
  return typeof job.status === 'object' && job.status?.value
    ? job.status.value
    : job.status;
}


async function loadJobs() {
  const container = document.getElementById("jobsContainer");
  const token = localStorage.getItem("access_token");

  container.innerHTML = '<div class="loading">Loading jobs...</div>';

  let endpoint = "/worker/jobs";
  if (currentFilter === "requests") endpoint = "/jobs/worker-requests";

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to fetch jobs");

    let jobs = (await res.json()).jobs || [];
    console.log("Loaded jobs:", jobs);

    
    if (currentFilter === "ongoing") {
      jobs = jobs.filter(job => normalizeStatus(job) === "in_progress");
    } else if (currentFilter === "completed") {
      jobs = jobs.filter(job => {
        const status = normalizeStatus(job);
        return status === "completed" || status === "worker_completed";
      });
    }
    if (jobs.length === 0) {
      container.innerHTML = '<div class="no-jobs">No jobs found for this filter.</div>';
      return;
    }

    container.innerHTML = jobs.map(job => createJobCard(job)).join("");

  } catch (err) {
    console.error("Error loading jobs:", err);
    container.innerHTML = '<div class="no-jobs">Failed to load jobs.</div>';
  }
}

function createJobCard(job) {
  const statusClass = `status-${job.status}`;
  const statusText = job.status.charAt(0).toUpperCase() + job.status.slice(1);
  const jobData = encodeURIComponent(JSON.stringify(job));

  let actionButtons = "";
  if (job.status === "requested") {
    actionButtons = `
      <button class="action-btn primary" onclick="acceptJob(${job.job_id})">Accept</button>
      <button class="action-btn" onclick="declineJob(${job.job_id})">Decline</button>
      <button class="action-btn" onclick='showJobDetails("${jobData}")'>View Details</button>
    `;
  } else if (job.status === "in_progress") {
    actionButtons = `
      <button class="action-btn primary" onclick="completeJob(${job.job_id})">Mark Complete</button>
      <button class="action-btn" onclick='showJobDetails("${jobData}")'>View Details</button>
    `;
  } else {
    actionButtons = `<button class="action-btn" onclick='showJobDetails("${jobData}")'>View Details</button>`;
  }

  return `
    <div class="job-card" data-status="${formatStatus(job.status)}">
      <div class="job-header">
        <div class="job-info">
          <h3 class="job-title">${job.skill?.name || "Untitled Job"}</h3>
          <p class="job-client">Client ID: ${job.client_id}</p>
        </div>
        <span class="job-status ${statusClass}">${statusText}</span>
      </div>
      <p class="job-description">${job.description}</p>
      <div class="job-meta">
        <span class="job-payment">KSh ${parseInt(job.budget).toLocaleString()}</span>
        <div class="job-actions">
          ${actionButtons}
        </div>
      </div>
    </div>
  `;
}

function showJobDetails(jobJson) {
  const job = JSON.parse(decodeURIComponent(jobJson));
  const popup = document.getElementById("jobDetailsPopup");
  const content = document.getElementById("jobDetailsContent");

  const scheduledDate = job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString("en-KE") : "Not scheduled";
  const scheduledTime = job.scheduled_time || "Not specified";

  content.innerHTML = `
    <div class="job-detail-grid">
      <div class="job-title">${job.skill?.skill_name || job.category || "Untitled Job"}</div>
      <div class="detail-item"><label>Description:</label><span>${job.description}</span></div>
      <div class="detail-item"><label>Location:</label><span>${job.location}</span></div>
      <div class="detail-item"><label>Budget:</label><span>${job.budget}</span></div>
      <div class="detail-item"><label>Scheduled Date:</label><span>${scheduledDate}</span></div>
      <div class="detail-item"><label>Scheduled Time:</label><span>${scheduledTime}</span></div>
      <div class="detail-item"><label>Status:</label><span>${formatStatus(job.status)}</span></div>
    </div>`;
  
  popup.style.display = "flex";
  document.body.style.overflow = "hidden";
}


async function acceptJob(jobId) {
  try {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}/accept`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
    if (!res.ok) throw new Error();
    alert("Job accepted successfully!");
    loadJobs();
  } catch {
    alert("Could not accept job.");
  }
}

async function declineJob(jobId) {
  if (!confirm("Are you sure you want to decline this job?")) return;
  try {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}/reject`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
    if (!res.ok) throw new Error();
    alert("Job declined. It will return to open jobs.");
    loadJobs();
  } catch {
    alert("Could not decline job.");
  }
}

async function completeJob(jobId) {
  try {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}/worker-complete`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
    if (!res.ok) throw new Error();
    alert("Job marked complete. Awaiting client confirmation.");
    loadJobs();
  } catch {
    alert("Could not complete job.");
  }
}

function closeJobDetails() {
  document.getElementById("jobDetailsPopup").style.display = "none";
  document.body.style.overflow = "auto";
}

document.addEventListener("click", (event) => {
  if (event.target === document.getElementById("jobDetailsPopup")) closeJobDetails();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeJobDetails();
});
async function rateClient(jobId, stars, clientId) {
  const token = localStorage.getItem("access_token");
  if (!clientId) return alert("Client info missing");

  const payload = {
    receiver_id: clientId,
    receiver_type: "client",
    stars: stars,
    feedback: ""  // optional for now
  };

  try {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}/rate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Failed to rate client");

    alert("Client rated successfully!");
    loadJobs(); // optional refresh
  } catch (err) {
    console.error(err);
    alert("Could not rate client.");
  }
}
function formatStatus(status) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

