const BASE_URL = "http://localhost:5000";
let filteredWorkers = [];
let currentJob = null;

document.addEventListener('DOMContentLoaded', function () {
    loadJobData();
    setupFilters();
});

function loadJobData() {
    const jobData = localStorage.getItem('lastPostedJobData');
    if (jobData) {
        currentJob = JSON.parse(jobData);
        displayJobSummary(currentJob);
        fetchWorkersByJob(currentJob);
    }
}

function displayJobSummary(job) {
    const jobDetails = document.getElementById('jobDetails');
    jobDetails.innerHTML = `
        <div class="job-detail">
        <span class="job-detail-label">Skill:</span>
        <span class="job-detail-value">${job.title}</span>
        </div>
        <div class="job-detail">
            <span class="job-detail-label">Location:</span>
            <span class="job-detail-value">${job.location}</span>
        </div>
        <div class="job-detail">
            <span class="job-detail-label">Duration:</span>
            <span class="job-detail-value">${job.duration || "Not specified"}</span>
        </div>
        <div class="job-detail">
            <span class="job-detail-label">Budget:</span>
            <span class="job-detail-value">KSh ${parseInt(job.budget).toLocaleString()}</span>
        </div>
    `;
}

async function fetchWorkersByJob(job) {
    if (!job?.id) {
        console.error("Job ID is missing. Cannot fetch workers.");
        return displayWorkers([]);
    }

    try {
        const token = localStorage.getItem('access_token'); 
        if (!token) throw new Error("No auth token found.");

        const response = await fetch(`http://localhost:5000/jobs/${job.id}/workers`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Backend error:", text);
            throw new Error("Server error: " + text);
        }

        const data = await response.json();
        filteredWorkers = (data.matched_workers || []).map(worker => ({
            id: worker.worker_id,
            name: worker.name || "Unnamed Worker",
            bio: worker.bio || "",
            location: worker.location || "Unknown",
            rate: worker.hourly_rate || 0,
            rating: worker.rating || 0,
            reviews: worker.reviews || 0,
            category: worker.category || "general",
            availability: "Available",
            experience: worker.experience_level || "unknown",
            skills: worker.skills || []
        }));

        console.log("Fetched workers:", filteredWorkers); 
        displayWorkers(filteredWorkers);
    } catch (err) {
        console.error("Error fetching workers:", err.message);
        filteredWorkers = [];
        displayWorkers([]);
    }
}

function displayWorkers(workersToShow) {
    const workersGrid = document.getElementById('workersGrid');
    const noWorkers = document.getElementById('noWorkers');

    if (!workersToShow || workersToShow.length === 0) {
        workersGrid.style.display = 'none';
        noWorkers.style.display = 'block';
        return;
    }

    workersGrid.style.display = 'grid';
    noWorkers.style.display = 'none';

    workersGrid.innerHTML = workersToShow.map(worker => createWorkerCard(worker)).join('');
}

function createWorkerCard(worker) {
    const stars = '★'.repeat(Math.floor(worker.rating)) + '☆'.repeat(5 - Math.floor(worker.rating));
    const initials = worker.name.split(' ').map(n => n[0]).join('');

    return `
        <div class="worker-card">
            <div class="worker-header">
                <div class="worker-avatar">${initials}</div>
                <div class="worker-info">
                    <h4>${worker.name}</h4>
                    <div class="worker-category">${worker.category ? worker.category.charAt(0).toUpperCase() + worker.category.slice(1) : "General"} Specialist</div>
                </div>
            </div>
            <div class="worker-rating">
                <span class="stars">${stars}</span>
                <span class="rating-text">${worker.rating} (${worker.reviews} reviews)</span>
            </div>
            <div class="worker-details">
                <div class="detail-row"><span class="detail-label">Experience:</span><span class="detail-value">${worker.experience}</span></div>
                <div class="detail-row"><span class="detail-label">Location:</span><span class="detail-value">${worker.location}</span></div>
                <div class="detail-row"><span class="detail-label">Rate:</span><span class="detail-value">KSh ${worker.rate.toLocaleString()}/day</span></div>
                <div class="detail-row"><span class="detail-label">Availability:</span><span class="detail-value">${worker.availability}</span></div>
            </div>
            <div class="worker-skills">
                <div class="detail-label">Skills:</div>
                <div class="skills-list">
                   ${worker.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            <button class="contact-btn" onclick="contactWorker(${worker.id})">Contact ${worker.name.split(' ')[0]}</button>
        </div>
    `;
}

function setupFilters() {
    const experienceFilter = document.getElementById('experienceFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const budgetFilter = document.getElementById('budgetFilter');

    [experienceFilter, ratingFilter, budgetFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    const experienceFilter = document.getElementById('experienceFilter').value;
    const ratingFilter = parseFloat(document.getElementById('ratingFilter').value) || 0;
    const budgetFilter = parseInt(document.getElementById('budgetFilter').value) || Infinity;

    let filtered = [...filteredWorkers];

    /*if (experienceFilter) {
        filtered = filtered.filter(worker => worker.experience === experienceFilter);
    }*/
    if (ratingFilter > 0) {
        filtered = filtered.filter(worker => worker.rating >= ratingFilter);
    }
    if (budgetFilter < Infinity) {
        filtered = filtered.filter(worker => worker.rate <= budgetFilter);
    }
    displayWorkers(filtered);
}

async function contactWorker(workerId) {
    if (!currentJob) return;
    try {
        const response = await fetch(`http://localhost:5000/jobs/${currentJob.id}/request`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('access_token')}`

            },
            body: JSON.stringify({ worker_id: workerId })
        });
        if (!response.ok) throw new Error("Failed to contact worker.");
        alert("Worker has been contacted. You'll be notified upon response.");
        window.location.href = "dashboard.html";
    } catch (err) {
        console.error("Contact failed:", err);
        alert("Failed to contact worker. Try again.");
    }
}

function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

