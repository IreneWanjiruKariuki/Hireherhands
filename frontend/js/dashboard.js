/*const BASE_URL = 'http://127.0.0.1:5000';

// Error display helper
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
                <span class="job-status ${statusClass}">${formatStatus(job.status)}</span>
            </div>
            <div class="job-description">${job.description}</div>
            <div class="job-meta">
                <div class="job-budget">Budget: ${job.budget}</div>
                <button class="view-details-btn" onclick="showJobDetails('${job.id}')">View Details</button>

            </div>
        </div>
    `;
}
function normalizeStatus(status) {
    return typeof status === 'object' ? status?.value : status;
}


function showJobDetails(jobId) {
    const job = window.allJobs.find((j) => j.id == jobId);
    if (!job) return;

    const popup = document.getElementById("jobDetailsPopup");
    const content = document.getElementById("jobDetailsContent");

    const scheduledDate = job.scheduledDate
        ? new Date(job.scheduledDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "Not scheduled";

    const scheduledTime = job.scheduledTime || "Not specified";

    let assignedWorkerSection = "";
    if (job.assignedWorker && job.assignedWorker !== "Not assigned yet") {
        assignedWorkerSection = `
            <div class="worker-info">
                <span>${job.assignedWorker}</span>
                <a href="message.html?worker=${encodeURIComponent(job.assignedWorker)}" class="message-btn" title="Send Message to Worker">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                </a>
            </div>
        `;
    } else {
        assignedWorkerSection = `<span>${job.assignedWorker || "Not assigned yet"}</span>`;
    }
    
    let completionApprovalSection = "";
    if (normalizeStatus(job.status) === "worker_completed") {
        completionApprovalSection = `
            <div class="detail-item">
                <button class="approve-completion-btn" onclick="approveJobCompletion(${job.id})">
                    Confirm Job Completion
                </button>
            </div>
        `;
    }
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
        <div class="detail-item"><label>Job Title:</label><span>${job.title}</span></div>
        <div class="detail-item"><label>Category:</label><span>${job.category || "General"}</span></div>
        <div class="detail-item"><label>Description:</label><span>${job.description}</span></div>
        <div class="detail-item"><label>Location:</label><span>${job.location || "Not specified"}</span></div>
        <div class="detail-item"><label>Duration:</label><span>${job.duration || "Not specified"}</span></div>
        <div class="detail-item"><label>Budget:</label><span>${job.budget}</span></div>
        <div class="detail-item"><label>Scheduled Date:</label><span>${scheduledDate}</span></div>
        <div class="detail-item"><label>Scheduled Time:</label><span>${scheduledTime}</span></div>
        <div class="detail-item"><label>Status:</label><span class="status-badge status-${job.status}">${formatStatus(job.status)}</span></div>
        <div class="detail-item"><label>Assigned Worker:</label>${assignedWorkerSection}</div>
        <div class="detail-item"><label>Date Posted:</label><span>${new Date(job.datePosted).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span></div>
        ${completionApprovalSection}
        ${ratingSection}
    </div>
    `;

    popup.style.display = "flex";
    document.body.style.overflow = "hidden";
}
}

function closeJobDetails() {
    const popup = document.getElementById("jobDetailsPopup");
    popup.style.display = "none";
    document.body.style.overflow = "auto";
}

document.addEventListener("click", (event) => {
    const popup = document.getElementById("jobDetailsPopup");
    if (event.target === popup) {
        closeJobDetails();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeJobDetails();
    }
});

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

    let jobsHTML = '';
    for (const job of jobs) {
        try {
            if (!job.title) throw new Error(`Missing job title for job ID: ${job.id}`);
            jobsHTML += createJobCard(job);
        } catch (err) {
            showError(`Error displaying job: ${err.message}`);
        }
    }

    jobsContainer.innerHTML = jobsHTML;
}

async function fetchClientJobs() {
    const token = localStorage.getItem('access_token');
    const user = getCurrentUser();

    if (!user || !token) {
        showError("User not logged in or token missing.");
        return displayJobs([]);
    }

    try {
        const injectedJob = localStorage.getItem('lastPostedJobData');
        let jobs = [];

        if (injectedJob) {
            const newJob = JSON.parse(injectedJob);
            jobs = [{
                ...newJob,
                status: 'open',
                budget: `KSh ${parseInt(newJob.budget)}`,
                datePosted: newJob.datePosted || new Date().toISOString()
            }];
            localStorage.removeItem('lastPostedJobData');
        }

        const response = await fetch(`${BASE_URL}/client/jobs`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const apiJobs = data.jobs.map(job => ({
                id: job.job_id,
                title: job.skill?.skill_name || "Untitled Job",
                description: job.description,
                budget: `KSh ${job.budget}`,
                status: typeof job.status === 'object' && job.status !== null
                ? job.status.value.toLowerCase()
                : (job.status || 'unknown').toLowerCase(),
                datePosted: job.created_at,
                location: job.location,
                category: job.skill?.category,
                duration: job.duration,
                scheduledDate: job.scheduled_date,
                scheduledTime: job.scheduled_time,
                assignedWorker: job.worker_id ? "Worker Assigned" : "Not assigned yet",
                assignedWorkerId: job.worker_id || null,
                worker_completion_confirmed: job.worker_completion_confirmed || false

            }));

            if (injectedJob) {
                const newJobId = JSON.parse(injectedJob).id;
                if (!apiJobs.some(j => j.id === newJobId)) {
                    jobs = [...jobs, ...apiJobs];
                } else {
                    jobs = apiJobs;
                }
            } else {
                jobs = apiJobs;
            }
        }

        window.allJobs = jobs;
        displayJobs(jobs);

    } catch (err) {
        showError(`Failed to fetch jobs: ${err.message}`);
        displayJobs(window.allJobs || []);
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

async function openDetailsModal(jobId) {
    const token = localStorage.getItem('access_token');

    try {
        const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (!res.ok) throw new Error("Failed to fetch job details.");

        const job = await res.json();

        document.getElementById('modalTitle').textContent = job.skill?.name || "Untitled Job";
        document.getElementById('modalDescription').textContent = job.description || "No description available.";
        document.getElementById('modalBudget').textContent = `Budget: KSh ${job.budget || 0}`;
        document.getElementById('modalStatus').textContent = `Status: ${formatStatus(job.status)}`;

        document.getElementById('jobDetailsModal').style.display = 'block';

    } catch (err) {
        showError(`Error loading job details: ${err.message}`);
    }
}

function formatStatus(status) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard loading...');
    updateWelcomeMessage();
    fetchClientJobs();
});
async function approveJobCompletion(jobId) {
    const token = localStorage.getItem('access_token');
    try {
        const res = await fetch(`${BASE_URL}/jobs/${jobId}/client-complete`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to confirm job completion");
        
        alert("Job marked as completed!");
        fetchClientJobs();  // Refresh the list
        closeJobDetails(); // Close the popup
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

    if (selectedStars < 1 || selectedStars > 5) {
        return alert("Please select a valid rating.");
    }

    const payload = {
        receiver_id: job.assignedWorkerId,
        receiver_type: "worker",
        stars: selectedStars,
        feedback: feedback
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

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to submit rating");
        }

        alert("Thank you for your rating!");
        job.workerRating = selectedStars;
        job.workerFeedback = feedback;
        showJobDetails(jobId);
    } catch (err) {
        console.error(err);
        alert("Could not submit rating.");
    }
}*/
const BASE_URL = 'http://127.0.0.1:5000';

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
                <span class="job-status ${statusClass}">${formatStatus(job.status)}</span>
            </div>
            <div class="job-description">${job.description}</div>
            <div class="job-meta">
                <div class="job-budget">Budget: ${job.budget}</div>
                <button class="view-details-btn" onclick="showJobDetails('${job.id}')">View Details</button>
            </div>
        </div>
    `;
}


function normalizeStatus(status) {
    return typeof status === 'object' ? status?.value : status;
}

function showJobDetails(jobId) {
    const job = window.allJobs.find((j) => j.id == jobId);
    if (!job) return;

    const popup = document.getElementById("jobDetailsPopup");
    const content = document.getElementById("jobDetailsContent");

    const scheduledDate = job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    }) : "Not scheduled";
    const scheduledTime = job.scheduledTime || "Not specified";

    let assignedWorkerSection = job.assignedWorker && job.assignedWorker !== "Not assigned yet"
        ? `<div class="worker-info">
                <span>${job.assignedWorker}</span>
                <a href="message.html?worker=${encodeURIComponent(job.assignedWorker)}" class="message-btn" title="Send Message to Worker">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                </a>
            </div>`
        : `<span>${job.assignedWorker || "Not assigned yet"}</span>`;

    let completionApprovalSection = normalizeStatus(job.status) === "worker_completed" ?
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
            <div class="detail-item"><label>Job Title:</label><span>${job.title}</span></div>
            <div class="detail-item"><label>Category:</label><span>${job.category || "General"}</span></div>
            <div class="detail-item"><label>Description:</label><span>${job.description}</span></div>
            <div class="detail-item"><label>Location:</label><span>${job.location || "Not specified"}</span></div>
            <div class="detail-item"><label>Duration:</label><span>${job.duration || "Not specified"}</span></div>
            <div class="detail-item"><label>Budget:</label><span>${job.budget}</span></div>
            <div class="detail-item"><label>Scheduled Date:</label><span>${scheduledDate}</span></div>
            <div class="detail-item"><label>Scheduled Time:</label><span>${scheduledTime}</span></div>
            <div class="detail-item"><label>Status:</label><span class="status-badge status-${job.status}">${formatStatus(job.status)}</span></div>
            <div class="detail-item"><label>Assigned Worker:</label>${assignedWorkerSection}</div>
            <div class="detail-item"><label>Date Posted:</label><span>${new Date(job.datePosted).toLocaleDateString("en-US")}</span></div>
            ${completionApprovalSection}
            ${ratingSection}
        </div>`;

    popup.style.display = "flex";
    document.body.style.overflow = "hidden";
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
                <p>You haven't posted any jobs yet. Click \"Create Job Post\" to get started!</p>
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
        const jobs = data.jobs.map(job => ({
            id: job.job_id,
            title: job.skill?.skill_name || "Untitled Job",
            description: job.description,
            budget: `KSh ${job.budget}`,
            status: normalizeStatus(job.status)?.toLowerCase() || "unknown",
            datePosted: job.created_at,
            location: job.location,
            category: job.skill?.category,
            duration: job.duration,
            scheduledDate: job.scheduled_date,
            scheduledTime: job.scheduled_time,
            assignedWorker: job.worker_id ? "Worker Assigned" : "Not assigned yet",
            assignedWorkerId: job.worker_id || null,
            worker_completion_confirmed: job.worker_completion_confirmed || false
        }));

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
    displayJobs(window.allJobs.filter(job => normalizeStatus(job.status) === status));
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

document.addEventListener('DOMContentLoaded', () => {
    updateWelcomeMessage();
    fetchClientJobs();
});
