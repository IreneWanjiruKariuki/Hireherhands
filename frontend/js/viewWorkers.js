let filteredWorkers = [];
let currentJob = null;

document.addEventListener('DOMContentLoaded', function () {
    loadJobData();
    setupFilters();
});

function loadJobData() {
    const jobData = localStorage.getItem('currentJobPosting');
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
            <span class="job-detail-label">Category:</span>
            <span class="job-detail-value">${job.category.charAt(0).toUpperCase() + job.category.slice(1)}</span>
        </div>
        <div class="job-detail">
            <span class="job-detail-label">Location:</span>
            <span class="job-detail-value">${job.location}</span>
        </div>
        <div class="job-detail">
            <span class="job-detail-label">Duration:</span>
            <span class="job-detail-value">${job.duration}</span>
        </div>
        <div class="job-detail">
            <span class="job-detail-label">Budget:</span>
            <span class="job-detail-value">KSh ${parseInt(job.budget).toLocaleString()}</span>
        </div>
    `;
}

async function fetchWorkersByJob(job) {
    try {
        const response = await fetch("http://localhost:5000/workers/match", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getCurrentUser()?.token}`
            },
            body: JSON.stringify(job)
        });
        if (!response.ok) throw new Error("Failed to fetch workers");
        const data = await response.json();
        filteredWorkers = data.workers || [];
        displayWorkers(filteredWorkers);
    } catch (err) {
        console.error("Error fetching workers:", err);
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
                    <div class="worker-category">${worker.category.charAt(0).toUpperCase() + worker.category.slice(1)} Specialist</div>
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

    if (experienceFilter) {
        filtered = filtered.filter(worker => worker.experience === experienceFilter);
    }
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
        const response = await fetch("http://localhost:5000/jobs/select-worker", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getCurrentUser()?.token}`
            },
            body: JSON.stringify({
                job_id: currentJob.id,
                worker_id: workerId
            })
        });
        if (!response.ok) throw new Error("Failed to contact worker.");
        alert("Worker has been contacted. You'll be notified upon response.");
        window.location.href = "dashboard.html";
    } catch (err) {
        console.error("Contact failed:", err);
        alert("Failed to contact worker. Try again.");
    }
}
