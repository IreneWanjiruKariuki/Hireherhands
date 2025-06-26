function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

function updateWelcomeMessage() {
    const user = getCurrentUser();
    const welcomeElement = document.getElementById('welcomeMessage');

    if (user && user.fullname) {
        welcomeElement.textContent = `Welcome , ${user.fullname}!`;
    } else {
        welcomeElement.textContent = `Welcome!`;
    }
}

function createJobCard(job) {
    const statusClass = `status-${job.status}`;
    const formattedDate = new Date(job.datePosted).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return `
        <div class="job-card" data-status="${job.status}" data-id="${job.id}">
            <div class="job-header">
                <div>
                    <div class="job-title">${job.title}</div>
                    <div class="job-date">Posted on ${formattedDate}</div>
                </div>
                <span class="job-status ${statusClass}">${job.status.charAt(0).toUpperCase() + job.status.slice(1)}</span>
            </div>
            <div class="job-description">${job.description}</div>
            <div class="job-meta">
                <div class="job-budget">Budget: ${job.budget}</div>
                <button class="view-details-btn" onclick="showJobDetails('${job.id}')">View Details</button>
            </div>
        </div>
    `;
}
function showJobDetails(jobId) {
    const job = window.allJobs.find((j) => j.id == jobId)
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
        <span>${job.category || "General"}</span>
    </div>
    <div class="detail-item">
        <label>Description:</label>
        <span>${job.description}</span>
    </div>
    <div class="detail-item">
        <label>Location:</label>
        <span>${job.location || "Not specified"}</span>
    </div>
    <div class="detail-item">
        <label>Duration:</label>
        <span>${job.duration || "Not specified"}</span>
    </div>
    <div class="detail-item">
        <label>Budget:</label>
        <span>${job.budget}</span>
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
            <label>Assigned Worker:</label>
            <span>${job.assignedWorker || "Not assigned yet"}</span>
        </div>
        <div class="detail-item">
            <label>Date Posted:</label>
            <span>${new Date(job.datePosted).toLocaleDateString("en-US", {
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

function displayJobs(jobs = []) {
    const jobsContainer = document.getElementById('jobsContainer');

    if (jobs.length === 0) {
        jobsContainer.innerHTML = `
            <div class="no-jobs">
                <h3>No jobs found</h3>
                <p>You haven't posted any jobs yet. Click "Create Job Post" to get started!</p>
            </div>
        `;
        return;
    }

    const jobsHTML = jobs.map(job => createJobCard(job)).join('');
    jobsContainer.innerHTML = jobsHTML;
}

async function fetchClientJobs() {
    const user = getCurrentUser();
    if (!user || !user.token) {
        console.error("User not logged in or token missing.");
        return displayJobs([]);
    }

    try {
        const response = await fetch("http://localhost:5000/jobs/client-history", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch jobs.");
        }

        const data = await response.json();
        const jobs = data.jobs.map(job => ({
            id: job.job_id,
            title: job.skill?.name || "Untitled Job",
            description: job.description,
            budget: `ksh ${job.budget}`,
            status: job.status.toLowerCase(),
            datePosted: job.created_at,
            location: job.location,
        }));

        window.allJobs = jobs;
        displayJobs(jobs);

        // Scroll to last posted job if exists
        const lastPostedId = localStorage.getItem('lastPostedJobId');
        if (lastPostedId) {
            const el = document.querySelector(`.job-card[data-id="${lastPostedId}"]`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                el.style.outline = '2px solid #10b981'; // highlight
                setTimeout(() => el.style.outline = '', 3000);
            }
            localStorage.removeItem('lastPostedJobId'); // clean up
        }

    } catch (err) {
        console.error("Error fetching jobs:", err);
        displayJobs([]);
    }
}

function filterJobs(status, event) {
    if (event) {
        event.preventDefault();
        document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
        event.target.classList.add('active');
    }

    const allJobs = window.allJobs || [];
    if (status === 'all') {
        displayJobs(allJobs);
    } else {
        displayJobs(allJobs.filter(job => job.status === status));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard loading...');
    updateWelcomeMessage();
    fetchClientJobs();
});
