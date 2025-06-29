const BASE_URL = "http://localhost:5000";
document.addEventListener("DOMContentLoaded", () => {
  loadWorkerProfile();  // load name, email, phone, etc.
  loadJobs();           // your existing job loader
  initializeBio();
  initializeRate();
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

    // Set values dynamically
    document.getElementById("workerName").textContent = data.fullname;
    document.getElementById("workerPhone").textContent = data.phone;
    document.getElementById("workerEmail").textContent = data.email;
    document.getElementById("bioText").textContent = data.bio || "No bio set yet.";
    document.getElementById("hourlyRate").textContent = data.hourly_rate || "0";

    // Sync editors
    document.getElementById("bioEditor").value = data.bio || "";
    document.getElementById("rateInput").value = data.hourly_rate || "";

  } catch (err) {
    console.error(err);
    alert("Could not load profile.");
  }
}

const jobsData = [
  {
    id: 1,
    title: "Kitchen Faucet Repair",
    client: "Sarah Johnson",
    description: "Kitchen faucet is leaking and needs immediate repair. Located in downtown area.",
    status: "requests",
    payment: "$120",
    date: "2024-01-15",
  },
  {
    id: 2,
    title: "Bathroom Tile Installation",
    client: "Mike Chen",
    description: "Need to install new tiles in master bathroom. Materials provided.",
    status: "ongoing",
    payment: "$450",
    date: "2024-01-10",
  },
  {
    id: 3,
    title: "Electrical Outlet Installation",
    client: "Emma Davis",
    description: "Install 3 new electrical outlets in home office. Safety inspection required.",
    status: "completed",
    payment: "$180",
    date: "2024-01-05",
  },
  {
    id: 4,
    title: "Deck Staining",
    client: "Robert Wilson",
    description: "Large deck needs cleaning and staining. Weather-dependent work.",
    status: "requests",
    payment: "$300",
    date: "2024-01-12",
  },
  {
    id: 5,
    title: "Garage Door Repair",
    client: "Lisa Anderson",
    description: "Garage door opener not working properly. Spring replacement may be needed.",
    status: "completed",
    payment: "$220",
    date: "2023-12-28",
  },
]
let currentFilter = "all"
let originalBioText = ""
let originalRate = ""

document.addEventListener("DOMContentLoaded", () => {
  loadJobs()
  initializeBio()
  initializeRate()
})

function showJobDetails(jobId) {
  const job = jobsData.find((j) => j.id === jobId)
  if (!job) return

  const popup = document.getElementById("jobDetailsPopup")
  const content = document.getElementById("jobDetailsContent")

  const scheduledDate = job.scheduledDate
    ? new Date(job.scheduledDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not scheduled"

  const scheduledTime = job.scheduledTime || "Not specified"
  content.innerHTML = `
  <div class="job-detail-grid">
    <div class="detail-item">
      <label>Job Title:</label>
      <span>${job.title}</span>
    </div>
    <div class="detail-item">
      <label>Category:</label>
      <span>${job.category}</span>
    </div>
    <div class="detail-item">
      <label>Description:</label>
      <span>${job.description}</span>
    </div>
    <div class="detail-item">
      <label>Location:</label>
      <span>${job.location}</span>
    </div>
    <div class="detail-item">
      <label>Duration:</label>
      <span>${job.duration}</span>
    </div>
    <div class="detail-item">
      <label>Payment:</label>
      <span>${job.payment}</span>
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
      <label>Status:</label>
      <span class="status-badge status-${job.status}">${job.status.charAt(0).toUpperCase() + job.status.slice(1)}</span>
    </div>
    <div class="detail-item">
      <label>Client:</label>
      <div class="client-info">
        <span>${job.client}</span>
        <a href="message.html?client=${encodeURIComponent(job.client)}" class="message-btn" title="Send Message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </a>
      </div>
    </div>
    <div class="detail-item">
      <label>Date Posted:</label>
      <span>${new Date(job.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}</span>
    </div>
  </div>
  `
  popup.style.display = "flex"
  document.body.style.overflow = "hidden"
}

function closeJobDetails() {
  const popup = document.getElementById("jobDetailsPopup")
  popup.style.display = "none"
  document.body.style.overflow = "auto"
}

// Close popup when clicking outside
document.addEventListener("click", (event) => {
  const popup = document.getElementById("jobDetailsPopup")
  if (event.target === popup) {
    closeJobDetails()
  }
})

// Close popup with esc key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeJobDetails()
  }
})

function toggleBioEdit() {
  const bioText = document.getElementById("bioText")
  const bioEditor = document.getElementById("bioEditor")
  const bioActions = document.querySelector(".bio-actions")
  const editBtn = document.querySelector(".bio-card .edit-btn")

  originalBioText = bioText.textContent
  bioEditor.value = originalBioText

  bioText.style.display = "none"
  bioEditor.style.display = "block"
  bioActions.style.display = "flex"
  editBtn.style.display = "none"
}

function saveBio() {
  const bioText = document.getElementById("bioText")
  const bioEditor = document.getElementById("bioEditor")
  const bioActions = document.querySelector(".bio-actions")
  const editBtn = document.querySelector(".bio-card .edit-btn")

  bioText.textContent = bioEditor.value

  bioText.style.display = "block"
  bioEditor.style.display = "none"
  bioActions.style.display = "none"
  editBtn.style.display = "flex"

  console.log("Bio saved:", bioEditor.value)
}

function cancelBioEdit() {
  const bioText = document.getElementById("bioText")
  const bioEditor = document.getElementById("bioEditor")
  const bioActions = document.querySelector(".bio-actions")
  const editBtn = document.querySelector(".bio-card .edit-btn")

  bioText.style.display = "block"
  bioEditor.style.display = "none"
  bioActions.style.display = "none"
  editBtn.style.display = "flex"
}
function initializeBio() {
  const bioEditor = document.getElementById("bioEditor")
  const bioText = document.getElementById("bioText")
  bioEditor.value = bioText.textContent
}
function toggleRateEdit() {
  const rateDisplay = document.querySelector(".rate-display")
  const rateEditor = document.querySelector(".rate-editor")
  const editBtn = document.querySelector(".rate-card .edit-btn")
  const rateInput = document.getElementById("rateInput")
  const currentRate = document.getElementById("hourlyRate")

  originalRate = currentRate.textContent
  rateInput.value = originalRate

  rateDisplay.style.display = "none"
  rateEditor.style.display = "block"
  editBtn.style.display = "none"
  rateInput.focus()
}
function saveRate() {
  const rateDisplay = document.querySelector(".rate-display")
  const rateEditor = document.querySelector(".rate-editor")
  const editBtn = document.querySelector(".rate-card .edit-btn")
  const rateInput = document.getElementById("rateInput")
  const currentRate = document.getElementById("hourlyRate")

  if (rateInput.value && rateInput.value > 0) {
    currentRate.textContent = rateInput.value

    rateDisplay.style.display = "flex"
    rateEditor.style.display = "none"
    editBtn.style.display = "flex"

    console.log("Rate saved:", rateInput.value)
  } else {
    alert("Please enter a valid hourly rate")
  }
}

function cancelRateEdit() {
  const rateDisplay = document.querySelector(".rate-display")
  const rateEditor = document.querySelector(".rate-editor")
  const editBtn = document.querySelector(".rate-card .edit-btn")

  rateDisplay.style.display = "flex"
  rateEditor.style.display = "none"
  editBtn.style.display = "flex"
}
function initializeRate() {
  const rateInput = document.getElementById("rateInput")
  const currentRate = document.getElementById("hourlyRate")
  rateInput.value = currentRate.textContent
}

//Job display functions
function filterJobs(status, event) {
  if (event) {
    event.preventDefault()

    document.querySelectorAll(".filter-tab").forEach((tab) => {
      tab.classList.remove("active")
    })
    event.target.classList.add("active")
  }
  currentFilter = status
  loadJobs()
}

function loadJobs() {
  const container = document.getElementById("jobsContainer")

  container.innerHTML = '<div class="loading">Loading jobs...</div>'
  setTimeout(() => {
    const filteredJobs = currentFilter === "all" ? jobsData : jobsData.filter((job) => job.status === currentFilter)
    if (filteredJobs.length === 0) {
      container.innerHTML = '<div class="no-jobs">No jobs found for this filter.</div>'
      return
    }
    container.innerHTML = filteredJobs.map((job) => createJobCard(job)).join("")
  }, 500)
}
function createJobCard(job) {
  const statusClass = `status-${job.status}`
  const statusText = job.status.charAt(0).toUpperCase() + job.status.slice(1)

  let actionButtons = ""
  if (job.status === "requests") {
    actionButtons = `
    <button class="action-btn primary" onclick="acceptJob(${job.id})">Accept</button>
    <button class="action-btn" onclick="declineJob(${job.id})">Decline</button>
    <button class="action-btn" onclick="showJobDetails(${job.id})">View Details</button>
    `
  } else if (job.status === "ongoing") {
    actionButtons = `
    <button class="action-btn primary" onclick="completeJob(${job.id})">Mark Complete</button>
    <button class="action-btn" onclick="showJobDetails(${job.id})">View Details</button>
    `
  } else {
    actionButtons = `
    <button class="action-btn" onclick="showJobDetails(${job.id})">View Details</button>
    `
  }
  return `
  <div class="job-card" data-status="${job.status}">
    <div class="job-header">
      <div class="job-info">
        <h3 class="job-title">${job.title}</h3>
        <div class="client-section">
          <p class="job-client">Client: ${job.client}</p>
          <a href="message.html?client=${encodeURIComponent(job.client)}" class="message-icon" title="Send Message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </a>
        </div>
      </div>
      <span class="job-status ${statusClass}">${statusText}</span>
    </div>
    <p class="job-description">${job.description}</p>
    <div class="job-meta">
      <span class="job-payment">${job.payment}</span>
      <div class="job-actions">
        ${actionButtons}
      </div>
    </div>
  </div>
  `
}
function acceptJob(jobId) {
  const job = jobsData.find((j) => j.id === jobId)
  if (job) {
    job.status = "ongoing"
    loadJobs()
    console.log("Job accepted:", jobId)
  }
}
function declineJob(jobId) {
  if (confirm("Are you sure you want to decline this job?")) {
    const jobIndex = jobsData.findIndex((j) => j.id === jobId)
    if (jobIndex > -1) {
      jobsData.splice(jobIndex, 1)
      loadJobs()
      console.log("Job declined:", jobId)
    }
  }
}
function completeJob(jobId) {
  const job = jobsData.find((j) => j.id === jobId)
  if (job) {
    job.status = "completed"
    loadJobs()
    console.log("Job completed:", jobId)
  }
}
<<<<<<< HEAD:frontend/js/worker-dash.js
=======
function viewJobDetails(jobId) {
  const job = jobsData.find((j) => j.id === jobId)
  if (job) {
    alert(
      `Job Details:\n\nTitle: ${job.title}\nClient: ${job.client}\nDescription: ${job.description}\nPayment: ${job.payment}\nDate: ${job.date}`,
    )
  }
}
/*const BASE_URL = 'http://127.0.0.1:5000'; // or your deployed API

document.addEventListener("DOMContentLoaded", () => {
  loadWorkerProfile();
  loadWorkerJobs();
});

// --- Load Worker Info ---
async function loadWorkerProfile() {
  const token = localStorage.getItem("access_token");
  if (!token) return alert("Please login");

  try {
    const res = await fetch(`${BASE_URL}/worker/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to load worker profile");

    const data = await res.json();
    document.getElementById("workerName").textContent = data.fullname;
    document.getElementById("workerEmail").textContent = data.email;
    document.getElementById("workerPhone").textContent = data.phone;
    document.getElementById("bioText").textContent = data.bio || "No bio provided yet.";
    document.getElementById("hourlyRate").textContent = data.hourly_rate || "0";

    document.getElementById("bioEditor").value = data.bio || "";
    document.getElementById("rateInput").value = data.hourly_rate || "";

  } catch (err) {
    console.error(err);
    alert("Error loading profile");
  }
}

// --- Save Bio ---
async function saveBio() {
  const newBio = document.getElementById("bioEditor").value.trim();
  const token = localStorage.getItem("access_token");

  try {
    const res = await fetch(`${BASE_URL}/worker/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ bio: newBio })
    });

    if (!res.ok) throw new Error("Failed to save bio");

    document.getElementById("bioText").textContent = newBio;
    cancelBioEdit();

  } catch (err) {
    alert("Failed to update bio");
    console.error(err);
  }
}

// --- Save Hourly Rate ---
async function saveRate() {
  const newRate = parseFloat(document.getElementById("rateInput").value.trim());
  const token = localStorage.getItem("access_token");

  if (isNaN(newRate) || newRate < 0) return alert("Invalid rate");

  try {
    const res = await fetch(`${BASE_URL}/worker/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ hourly_rate: newRate })
    });

    if (!res.ok) throw new Error("Failed to save rate");

    document.getElementById("hourlyRate").textContent = newRate;
    cancelRateEdit();

  } catch (err) {
    alert("Failed to update rate");
    console.error(err);
  }
}

// --- Load Jobs ---
async function loadWorkerJobs() {
  const token = localStorage.getItem("access_token");
  const container = document.getElementById("jobsContainer");

  container.innerHTML = '<div class="loading">Loading jobs...</div>';

  try {
    const res = await fetch(`${BASE_URL}/worker/jobs`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch jobs");

    const data = await res.json();
    const jobs = data.jobs || [];

    if (jobs.length === 0) {
      container.innerHTML = '<div class="no-jobs">No jobs found for this worker.</div>';
      return;
    }

    container.innerHTML = jobs.map(createJobCard).join("");

  } catch (err) {
    console.error(err);
    container.innerHTML = '<div class="error">Failed to load jobs</div>';
  }
}

function createJobCard(job) {
  const status = job.status.toLowerCase();
  const statusClass = `status-${status}`;
  const statusText = status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return `
    <div class="job-card" data-status="${status}">
      <div class="job-header">
        <div class="job-info">
          <h3 class="job-title">${job.skill?.skill_name || "Unknown"}</h3>
          <p class="job-client">Location: ${job.location}</p>
        </div>
        <span class="job-status ${statusClass}">${statusText}</span>
      </div>
      <p class="job-description">${job.description}</p>
      <div class="job-meta">
        <span class="job-payment">KSh ${job.budget}</span>
        <div class="job-actions">
          <button class="action-btn" onclick="viewJobDetails(${job.job_id})">View Details</button>
        </div>
      </div>
    </div>
  `;
}*/
>>>>>>> 5356c7a91561c924e0b39cf8821ba8ac3f04762b:frontend/js/worker_dash.js
