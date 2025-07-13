const BASE_URL = "http://localhost:5000";
let currentFilter = "all";

function showAccessModal(message, redirectUrl) {
  const modal = document.getElementById("accessModal");
  const messageElem = document.getElementById("accessModalMessage");
  const button = document.getElementById("accessModalBtn");

  if (modal && messageElem && button) {
    messageElem.textContent = message;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    button.onclick = () => {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
      window.location.href = redirectUrl;
    };
  }
}

function checkSession() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    showAccessModal("Your session has expired. Please log in again.", "login.html");
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      showAccessModal("Your session has expired. Please log in again.", "login.html");
    }
  } catch (err) {
    console.error("Token decode failed:", err);
    showAccessModal("Session invalid. Please log in again.", "login.html");
  }
}

// ✅ This runs before loading profile or jobs
async function verifyWorkerAccess() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    showAccessModal("Please login first.", "login.html");
    return false;
  }

  try {
    const res = await fetch(`${BASE_URL}/worker/profile`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.status === 403) {
      const data = await res.json();
      if (data.error?.includes("pending")) {
        showAccessModal("Your worker application is still pending approval.", "pending.html");
      } else {
        showAccessModal("Access denied.", "dashboard.html");
      }
      return false;
    }

    if (!res.ok) {
      showAccessModal("Only Approved Workers can access the Worker.", "dashboard.html");
      return false;
    }

    const data = await res.json();
    localStorage.setItem("currentUser", JSON.stringify({ ...data, is_worker: true, status: "approved" }));
    return true;

  } catch (err) {
    console.error("Worker check failed:", err);
    showAccessModal("Error verifying worker access.", "dashboard.html");
    return false;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  checkSession();

  const accessGranted = await verifyWorkerAccess();
  if (!accessGranted) return;

  // ✅ User is verified worker
  loadWorkerProfile();
  initializeBio();
  initializeRate();
  loadJobs();

  // Optional: Protect the dashboard button too
  const workerBtn = document.getElementById('workerDashBtn');
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

  if (workerBtn) {
    if (!currentUser.is_worker) {
      workerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert("Only registered workers can access the Worker Dashboard. Please apply first.");
        window.location.href = "workerReg.html";
      });
    } else if (currentUser.status !== 'approved') {
      workerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert("Your worker application is still pending approval.");
        window.location.href = "pending.html";
      });
    }
  }
});



function showSessionModal() {
    const modal = document.getElementById("sessionModal");
    if (modal) {
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    }
}

function redirectToLogin() {
    localStorage.clear();
    window.location.href = "login.html";
}

async function loadWorkerProfile() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    showErrorModal("Please login.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/worker/profile`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
    const data = await res.json();
    if (res.status === 403 && data.error?.includes("pending approval")) {
        localStorage.setItem('worker_application_status', 'pending');
        alert("Your application is still pending approval.");
        window.location.href = 'pending.html';
        return;
    }
    throw new Error("Failed to load worker profile");
}


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
    showErrorModal("Could not load profile.");
  }
}
function normalizeStatus(job) {
  const status = job?.status;
  if (typeof status === 'object' && status?.value) return status.value;
  return typeof status === 'string' ? status : '';
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


async function loadJobs() {
  const container = document.getElementById("jobsContainer");
  const token = localStorage.getItem("access_token");
  container.innerHTML = '<div class="loading">Loading jobs...</div>';

  let endpoint = "/worker/jobs";
  if (currentFilter === "requests") endpoint = "/jobs/worker-requests";

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch jobs");

    const responseData = await res.json();
    console.log("Raw API response:", responseData);

    let jobs = responseData.jobs || [];
    console.log("Jobs returned:", jobs);

    if (currentFilter !== 'all' && currentFilter !== 'requests') {
      jobs = jobs.filter(job => {
        const currentStatus = normalizeStatus(job).toLowerCase();
        const originalStatus = normalizeStatus({ status: job.original_status }).toLowerCase();
        return currentStatus === currentFilter || originalStatus === currentFilter;
      });
    }

    container.innerHTML = jobs.length > 0
      ? jobs.map(createJobCard).join("")
      : '<div class="no-jobs">No jobs found for this filter.</div>';

  } catch (err) {
    console.error("Error loading jobs:", err);
    container.innerHTML = '<div class="no-jobs">Failed to load jobs.</div>';
  }
}
function toggleBioEdit() {
  document.getElementById("bioText").style.display = "none";
  document.getElementById("bioEditor").style.display = "block";
  document.querySelector(".bio-actions").style.display = "flex";
}

function cancelBioEdit() {
  document.getElementById("bioEditor").style.display = "none";
  document.querySelector(".bio-actions").style.display = "none";
  document.getElementById("bioText").style.display = "block";
}
function toggleRateEdit() {
  document.querySelector(".rate-display").style.display = "none";
  document.querySelector(".rate-editor").style.display = "flex";
}

function cancelRateEdit() {
  document.querySelector(".rate-editor").style.display = "none";
  document.querySelector(".rate-display").style.display = "flex";
}
function saveBio() {
  const newBio = document.getElementById("bioEditor").value;
  document.getElementById("bioText").textContent = newBio;
  cancelBioEdit();
}

/*async function saveRate() {
  await saveProfileChanges(); 
  document.getElementById("hourlyRate").textContent = document.getElementById("rateInput").value;
  cancelRateEdit();
}*/
async function saveBio() {
    const newBio = document.getElementById("bioEditor").value;
    // Assume you have an API call here to save the bio to the backend
    // For now, let's just update the UI and then call the saveProfileChanges
    // You should integrate the actual API call here.
    await saveProfileChanges(); // This will save both bio and rate
    document.getElementById("bioText").textContent = newBio;
    cancelBioEdit();
    loadWorkerProfile(); // Add this line to refresh
}

async function saveRate() {
    await saveProfileChanges();
    document.getElementById("hourlyRate").textContent = document.getElementById("rateInput").value;
    cancelRateEdit();
    loadWorkerProfile(); // Add this line to refresh
}

function createJobCard(job) {
  const statusClass = `status-${job.status}`;
  const statusText = job.original_status === "worker_completed"
    ? "Completed ⏳ Pending Client Confirmation"
    : formatStatus(job.status);

  // Format scheduled time if available
  const scheduledInfo = job.scheduled_date 
    ? `
      <div class="job-schedule">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        ${new Date(job.scheduled_date).toLocaleDateString("en-KE", {month: 'short', day: 'numeric'})}
        ${job.scheduled_time ? `• ${job.scheduled_time}` : ''}
      </div>
    `
    : '';

  let actionButtons = "";
  if (job.original_status === "requested") {
    actionButtons = `
      <button class="action-btn primary" onclick="acceptJob(${job.job_id})">Accept</button>
      <button class="action-btn" onclick="declineJob(${job.job_id})">Decline</button>
    `;
  } else if (job.original_status === "in_progress") {
    actionButtons = `
      <button class="action-btn primary" onclick="completeJob(${job.job_id})">Mark Complete</button>
    `;
  }

  const jobData = encodeURIComponent(JSON.stringify(job));
  actionButtons += `<button class="action-btn" onclick='showJobDetails("${jobData}")'>View Details</button>`;
  


  return `
    <div class="job-card" data-status="${job.status}">
      <div class="job-header">
        <div class="job-info">
          <h3 class="job-title">${job.skill?.skill_name || "Untitled Job"}</h3>
          <p class="job-client">Client: ${job.client_name || `ID ${job.client_id}`}</p>
          ${scheduledInfo}
        </div>
        <span class="job-status ${statusClass}">${statusText}</span>
      </div>
      <p class="job-description">${job.description || "No description provided"}</p>
      <div class="job-meta">
        <span class="job-payment">KSh ${parseInt(job.budget || 0).toLocaleString()}</span>
        <div class="job-actions">${actionButtons}</div>
      </div>
    </div>
  `;
}

function showJobDetails(jobJson) {
  const job = JSON.parse(decodeURIComponent(jobJson));
  console.log("Job details:", job);
  const jobStatus = normalizeStatus(job).toLowerCase();
  const popup = document.getElementById("jobDetailsPopup");
  const content = document.getElementById("jobDetailsContent");

  // Format dates and times
  const scheduledDate = job.scheduled_date 
    ? new Date(job.scheduled_date).toLocaleDateString("en-KE", {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      }) 
    : "Not scheduled";
    
  const scheduledTime = job.scheduled_time 
    ? new Date(`1970-01-01T${job.scheduled_time}`).toLocaleTimeString("en-KE", {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : "Not specified";

  // Check for worker assignment
  const assignedWorker = job.worker_id 
    ? `Assigned to Worker ID: ${job.worker_id}` 
    : job.assigned_worker 
      ? `Assigned to: ${job.assigned_worker.name || 'Worker'}` 
      : "Not assigned yet";

  content.innerHTML = `
    <div class="job-detail-grid">
      <div class="job-title">${job.skill?.skill_name || job.title || "Untitled Job"}</div>
      <div class="detail-item">
        <label>Description:</label>
        <span>${job.description || "No description provided"}</span>
      </div>
      <div class="detail-item">
        <label>Location:</label>
        <span>
          ${job.location || "Not specified"}
          ${job.road ? `, ${job.road}` : ""}
          ${job.building_name ? `, ${job.building_name}` : ""}
          ${job.house_number ? `, ${job.house_number}` : ""}
        </span>
      </div>
      <div class="detail-item">
        <label>Budget:</label>
        <span>KSh ${parseInt(job.budget || 0).toLocaleString()}</span>
      </div>
      <div class="detail-item">
        <label>Duration:</label>
        <span>${job.duration || "Not specified"}</span>
      </div>
      <div class="detail-item">
        <label>Scheduled Date:</label>
        <span>${scheduledDate}</span>
      </div>
      <div class="detail-item">
        <label>Scheduled Time:</label>
        <span>${scheduledTime}</span>
      </div>
      <div class="detail-item">
        <label>Client:</label>
        <span>${job.client_name || `Client ID: ${job.client_id}`}</span>
      </div>
      ${jobStatus !== "completed" && job.client_phone ? `
      <div class="detail-item">
        <label>Client Phone:</label>
        <span>${job.client_phone}</span>
      </div>
` : ""}

      <div class="detail-item">
        <label>Status:</label>
        <span class="status-badge status-${job.status}">
          ${formatStatus(job.status)}
          ${job.original_status === 'worker_completed' ? ' (Pending client confirmation)' : ''}
        </span>
      </div>
    </div>`;

  popup.style.display = "flex";
  document.body.style.overflow = "hidden";
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

async function acceptJob(jobId) {
  try {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}/accept`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
    if (!res.ok) throw new Error();
    showErrorModal("Job accepted successfully!", 'success');
    filterJobs("in_progress");

  } catch {
    showErrorModal("Could not accept job.");
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
    showErrorModal("Job declined. It will return to open jobs.");
    loadJobs();
  } catch {
    showErrorModal("Could not decline job.");
  }
}

async function completeJob(jobId) {
  try {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}/worker-complete`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
    if (!res.ok) throw new Error();
    showErrorModal("Job marked complete. Awaiting client confirmation.",'success');
    loadJobs();
  } catch {
    showErrorModal("Could not complete job.");
  }
}
async function saveProfileChanges() {
  const token = localStorage.getItem("access_token");
  const bio = document.getElementById("bioEditor").value;
  const rate = document.getElementById("rateInput").value;

  try {
    const res = await fetch(`${BASE_URL}/worker/profile`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
        body: JSON.stringify({ bio: bio, hourly_rate: rate })
    });


    if (!res.ok) {
      throw new Error("Failed to update profile");
    }

    showMessageModal("Profile updated successfully.", 'success');

  } catch (err) {
    console.error(err);
    showErrorModal("Could not update profile.");
  }
}

function formatStatus(status) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
// Ensure this function is present and correct
function showErrorModal(message) {
    const modal = document.getElementById("errorModal");
    const messageElem = document.getElementById("errorModalMessage");
    const closeButton = document.getElementById("errorModalCloseBtn"); // This is your "OK" button

    if (modal && messageElem && closeButton) {
        messageElem.textContent = message;
        modal.style.display = "flex";
        document.body.style.overflow = "hidden"; // Prevent scrolling

        // Crucial: Attach the click handler to the close button
        closeButton.onclick = () => {
            modal.style.display = "none";
            document.body.style.overflow = "auto"; // Re-enable scrolling
        };
    } else {
        // Fallback for debugging if modal elements aren't found
        console.error("Error: Modal elements not found for showErrorModal. Message:", message);
        alert("Error: " + message);
    }
}


