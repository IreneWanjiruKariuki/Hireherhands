const BASE_URL = 'http://127.0.0.1:5000';
function checkSession(requiredRole = null) {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token) {
        alert("Session expired. Please login again.");
        localStorage.clear();
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
            return;
        }
    } catch (err) {
        console.error("Invalid token", err);
        localStorage.clear();
        window.location.href = "login.html";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    checkSession("client");
    fetchClientJobs();
    updateWelcomeMessage();
});

function showError(message) {
    const errorBox = document.getElementById('errorMessage');
    if (errorBox) {
        errorBox.textContent = message;
        errorBox.style.display = 'block';
        setTimeout(() => {
            errorBox.style.display = 'none';
        }, 10000);
    }
    console.error(message);
}

function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

function updateWelcomeMessage() {
    const user = getCurrentUser();
    const welcomeElement = document.getElementById('welcomeMessage');
    welcomeElement.textContent = user && user.fullname ? `Welcome , ${user.fullname}!` : `Welcome!`;
}

function formatStatus(status) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function normalizeStatus(status) {
    return typeof status === 'object' ? status?.value : status;
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
                    <div class="job-title">${job.skill_name?.toUpperCase() || "Skill not loaded"}</div>
                    <div class="job-date">Posted on ${formattedDate}</div>
                </div>
                <span class="job-status ${statusClass}">${formatStatus(job.status)}</span>
                ${job.status === 'open' ? `
                    <button class="find-workers-btn" onclick="findWorkersForJob(${job.id})">
                    Find Workers
                    </button>
                ` : ''}

            </div>
            ${job.original_status === 'worker_completed' ? '<span class="pending-confirmation-tag">⏳ Pending Client Confirmation</span>' : ''}
            <div class="job-description">${job.description}</div>
            <div class="job-meta">
                <div class="job-budget">Budget: KSh ${parseInt(job.budget).toLocaleString()}</div>
                <button class="view-details-btn" onclick="showJobDetails('${job.id}')">View Details</button>
            </div>
        </div>
    `;
}

function showJobDetails(jobId) {
    const job = window.allJobs.find((j) => j.id == jobId);
    if (!job) return;

    const popup = document.getElementById("jobDetailsPopup");
    const content = document.getElementById("jobDetailsContent");

    /*const scheduledDate = job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    }) : "Not scheduled";

    const scheduledTime = job.scheduledTime && typeof job.scheduledTime === 'string'
    ? job.scheduledTime.slice(0, 5)
    : "Not specified";*/
    let scheduledDate = "Not scheduled";
    if (job.scheduledDate && !isNaN(Date.parse(job.scheduledDate))) {
        scheduledDate = new Date(job.scheduledDate).toLocaleDateString("en-KE", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }
    let scheduledTime = "Not specified";
    if (job.scheduledTime && typeof job.scheduledTime === "string" && job.scheduledTime.length >= 5) {
        scheduledTime = job.scheduledTime.slice(0, 5);
    }


    let workerPhoneLine = job.status !== "completed" && job.worker_phone
    ? `<div class="detail-item"><label>Worker Phone:</label><span>${job.worker_phone}</span></div>`
    : "";

    let assignedWorkerSection = job.assignedWorker && job.assignedWorker !== "Not assigned yet"
    ? `<div class="worker-info">
            <span>${job.assignedWorker}</span>
            <a href="message.html?worker=${encodeURIComponent(job.assignedWorker)}" class="message-btn" title="Send Message to Worker">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
            </a>
        </div>
        ${workerPhoneLine}`
        
    : `<span>${job.assignedWorker || "Not assigned yet"}</span>`;
  
    let completionApprovalSection = normalizeStatus(job.original_status) === "worker_completed" ?
        `<div class="detail-item">
            <button class="approve-completion-btn" onclick="approveJobCompletion(${job.id})">
                Confirm Job Completion
            </button>
        </div>` : "";

    let ratingSection = "";
    if (normalizeStatus(job.status) === "completed") {
        const currentRating = job.workerRating || 0;
        const currentFeedback = job.workerFeedback || "";
        ratingSection = `
            <div class="detail-item">
                <label>Rate Worker:</label>
                <div class="rating-section">
                    <div class="star-rating" data-job-id="${job.id}">
                        ${[1, 2, 3, 4, 5].map(star => `
                            <span class="star ${star <= currentRating ? "filled" : ""}" 
                                  data-rating="${star}" 
                                  onclick="setRating(${job.id}, ${star})">★</span>
                        `).join("")}
                    </div>
                    <textarea id="ratingFeedback-${job.id}" placeholder="Leave feedback (optional)">${currentFeedback}</textarea>
                    <button onclick="submitRating(${job.id})" class="submit-rating-btn">Submit</button>
                    <span class="rating-text">${currentRating > 0 ? `${currentRating}/5 stars` : "Click to rate"}</span>
                </div>
            </div>
        `;
    }

    content.innerHTML = `
    <div class="job-detail-grid">
        <div class="detail-item"><label>Skill:</label><span class="job-detail-value">${job.skill_name?.toUpperCase()}</span></div> 
        <div class="detail-item"><label>Description:</label><span>${job.description}</span></div>
        <div class="detail-item"><label>Location:</label><span>${job.location || "Not specified"}</span></div>
        ${job.road ? `<div class="detail-item"><label>Road:</label><span>${job.road}</span></div>` : ''}
        ${job.building_name ? `<div class="detail-item"><label>Building Name:</label><span>${job.building_name}</span></div>` : ''}
        ${job.house_number ? `<div class="detail-item"><label>House Number:</label><span>${job.house_number}</span></div>` : ''}
        <div class="detail-item"><label>Duration:</label><span>${job.duration || "Not specified"}</span></div>
        <div class="detail-item"><label>Budget:</label><span>${job.budget}</span></div>
        <div class="detail-item"><label>Scheduled Date:</label><span>${scheduledDate}</span></div>
        <div class="detail-item"><label>Scheduled Time:</label><span>${scheduledTime}</span></div>
        <div class="detail-item">
            <label>Status:</label>
            <span class="status-badge status-${job.status}">
                ${formatStatus(job.status)}
                ${job.original_status === 'worker_completed' ? ' - Pending Client Confirmation' : ''}
            </span>
        </div>
        <div class="detail-item"><label>Assigned Worker:</label>${assignedWorkerSection}</div>
        <div class="detail-item"><label>Date Posted:</label><span>${new Date(job.datePosted).toLocaleDateString("en-US")}</span></div>
        ${completionApprovalSection}
        ${ratingSection}
    </div>`;

    popup.style.display = "flex";
    document.body.style.overflow = "hidden";
}
function findWorkersForJob(jobId) {
    const job = window.allJobs.find(j => j.id === jobId);
    if (!job) return alert("Job not found.");

    // Save job details in local storage for the next page
    localStorage.setItem('lastPostedJobData', JSON.stringify(job));

    // Redirect to your view_workers.html page
    window.location.href = "viewWorkers.html";
}

function closeJobDetails() {
    const popup = document.getElementById("jobDetailsPopup");
    popup.style.display = "none";
    document.body.style.overflow = "auto";
}

document.addEventListener("click", (event) => {
    const popup = document.getElementById("jobDetailsPopup");
    if (event.target === popup) closeJobDetails();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeJobDetails();
});

function displayJobs(jobs = []) {
    const jobsContainer = document.getElementById('jobsContainer');
    if (jobs.length === 0) {
        jobsContainer.innerHTML = `
            <div class="no-jobs">
                <h3>No jobs found</h3>
                <p>You haven't posted any jobs yet. Click "Create Job Post" to get started!</p>
            </div>`;
        return;
    }
    jobsContainer.innerHTML = jobs.map(createJobCard).join('');
}

async function fetchClientJobs() {
    const token = localStorage.getItem('access_token');
    const user = getCurrentUser();
    if (!user || !token) return showError("User not logged in or token missing.");

    try {
        const response = await fetch(`${BASE_URL}/client/jobs`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Failed to fetch jobs");

        const data = await response.json();
        const jobs = data.jobs.map(job => {
            return {
                id: job.job_id,
                skill_name: job.skill?.skill_name || null,
                description: job.description,
                budget: `${job.budget}`,
                status: job.status?.toLowerCase?.() || "unknown",
                original_status: job.original_status?.toLowerCase?.() || job.status?.toLowerCase?.() || "unknown",
                datePosted: job.created_at ? new Date(job.created_at) : null,
                location: job.location,
                road: job.road,
                building_name: job.building_name,
                house_number: job.house_number,
                duration: job.duration,
                scheduledDate: job.scheduled_date,  
                scheduledTime: job.scheduled_time,
                assignedWorker: job.worker_name || "Not assigned yet",
                assignedWorkerId: job.worker_id || null,
                worker_completion_confirmed: job.worker_completion_confirmed || false,
                workerRating: job.workerRating || 0,
                workerFeedback: job.workerFeedback || ""
            };
        });


        window.allJobs = jobs;
        displayJobs(jobs);
    } catch (err) {
        showError(`Failed to fetch jobs: ${err.message}`);
    }
}

function filterJobs(status, event) {
    if (event) {
        event.preventDefault();
        document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
        event.target.classList.add('active');
    }
    displayJobs(
        status === 'all'
            ? window.allJobs
            : window.allJobs.filter(job => normalizeStatus(job.status) === status)
    );
}

async function approveJobCompletion(jobId) {
    const token = localStorage.getItem('access_token');
    try {
        const res = await fetch(`${BASE_URL}/jobs/${jobId}/client-complete`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to confirm job completion");

        alert("Job marked as completed!");
        fetchClientJobs();
        closeJobDetails();
    } catch (err) {
        showError(err.message || "Error completing job.");
    }
}

function setRating(jobId, stars) {
    const ratingContainer = document.querySelector(`.star-rating[data-job-id="${jobId}"]`);
    if (!ratingContainer) return;
    ratingContainer.setAttribute("data-selected", stars);
    [...ratingContainer.querySelectorAll('.star')].forEach((el, i) => {
        el.classList.toggle("filled", i < stars);
    });
}

async function submitRating(jobId) {
    const token = localStorage.getItem('access_token');
    const job = window.allJobs.find(j => j.id === jobId);
    if (!job || !job.assignedWorkerId) return alert("Invalid job or no worker assigned.");

    const ratingContainer = document.querySelector(`.star-rating[data-job-id="${jobId}"]`);
    const selectedStars = parseInt(ratingContainer?.getAttribute("data-selected")) || 0;
    const feedback = document.getElementById(`ratingFeedback-${jobId}`).value.trim();

    if (selectedStars < 1 || selectedStars > 5) return alert("Please select a valid rating.");

    try {
        const res = await fetch(`${BASE_URL}/jobs/${jobId}/rate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                receiver_id: job.assignedWorkerId,
                receiver_type: "worker",
                stars: selectedStars,
                feedback
            })
        });

        if (!res.ok) throw new Error("Failed to submit rating");

        alert("Thank you for your rating!");
        job.workerRating = selectedStars;
        job.workerFeedback = feedback;
        showJobDetails(jobId);
    } catch (err) {
        console.error(err);
        alert("Could not submit rating.");
    }
}
