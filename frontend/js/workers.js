const BASE_URL = 'http://127.0.0.1:5000';
let currentFilter = 'requests';
let currentPage = 1;
const itemsPerPage = 4;
let filteredWorkers = [];
let selectedWorkerId = null;
let allWorkers = [];

async function fetchWorkersFromBackend() {
    try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${BASE_URL}/admin/workers`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load workers");

        allWorkers = data.workers.map(w => ({
            id: w.worker_id,
            name: w.client.fullname,
            email: w.client.email,
            phone: w.client.phone,
            location: w.location,
            applicationDate: new Date(w.created_at).toISOString(),
            status: w.is_approved ? 'approved' : 'requests',
            skills: w.skills,
            rating: w.rating || 0,
            completedJobs: w.completed_jobs || 0,
            is_deleted: w.is_deleted || false
        }));

        filterAndDisplayWorkers();
    } catch (err) {
        console.error("Worker fetch error:", err);
        document.getElementById("workersList").innerHTML = `<div class="error">Error loading workers</div>`;
    }
}

function setFilter(status, event) {
    currentFilter = status;
    currentPage = 1;

    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    if (event) event.target.classList.add('active');

    const titleMap = {
        all: 'All Workers',
        requests: 'Worker Requests',
        approved: 'Approved Workers',
        rejected: 'Rejected Workers',
        deactivated: 'Deactivated Workers'
    };

    document.getElementById('sectionTitle').textContent = titleMap[status] || 'Workers';

    selectedWorkerId = null;
    document.getElementById('workerDetails').innerHTML = '<div class="no-selection">Select a worker to view details</div>';
    filterAndDisplayWorkers();
}

function filterAndDisplayWorkers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();

    let workers = allWorkers.filter(worker => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'deactivated') return worker.is_deleted;
        return worker.status === currentFilter && !worker.is_deleted;
    });

    if (searchTerm !== '') {
        workers = workers.filter(worker =>
            worker.name.toLowerCase().includes(searchTerm) ||
            worker.email.toLowerCase().includes(searchTerm) ||
            worker.skills.some(skill => skill.toLowerCase().includes(searchTerm))
        );
    }

    filteredWorkers = workers;
    displayWorkers();
}


function displayWorkers() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const workersToShow = filteredWorkers.slice(startIndex, endIndex);

    const workersList = document.getElementById('workersList');

    if (workersToShow.length === 0) {
        workersList.innerHTML = `
            <div class="no-workers">
                <h3>No ${currentFilter}</h3>
                <p>No workers found for this category or search term.</p>
            </div>`;
        updateWorkerCount();
        updatePagination();
        return;
    }
    workersList.innerHTML = workersToShow.map(worker => `
    <div class="worker-item ${selectedWorkerId === worker.id ? 'active' : ''} ${worker.is_deleted ? 'inactive' : ''}" onclick="selectWorker(${worker.id})">
        <div class="worker-info">
            <h4>${worker.name}</h4>
            <div class="worker-meta">${worker.skills.slice(0, 2).join(', ')}</div>
            <div class="worker-status status-${worker.status}">${worker.is_deleted ? 'inactive' : worker.status}</div>
        </div>
    </div>`).join('');


    updateWorkerCount();
    updatePagination();
}

function selectWorker(workerId) {
    selectedWorkerId = workerId;
    const worker = allWorkers.find(w => w.id === workerId);
    if (!worker) return;

    const workerDetails = document.getElementById('workerDetails');
    let detailsHTML = `
        <div class="detail-section">
            <h3>Worker Info</h3>
            <div class="detail-grid">
                <div class="detail-item"><div class="detail-label">Name</div><div class="detail-value">${worker.name}</div></div>
                <div class="detail-item"><div class="detail-label">Email</div><div class="detail-value">${worker.email}</div></div>
                <div class="detail-item"><div class="detail-label">Phone</div><div class="detail-value">${worker.phone}</div></div>
                <div class="detail-item"><div class="detail-label">Location</div><div class="detail-value">${worker.location}</div></div>
                <div class="detail-item"><div class="detail-label">Status</div><div class="detail-value">${worker.status}</div></div>
            </div>
        </div>
        <div class="detail-section">
        <h3>Skills</h3>
        <div class="skills-list">
            ${Array.isArray(worker.skills) && worker.skills.length
                ? worker.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')
                : '<span>No skills listed</span>'
            }
            </div>
        </div>

    `;

    if (worker.status === 'requests') {
        detailsHTML += `
            <div class="action-buttons">
                <button onclick="handleApproval(${worker.id}, 'approve')">Approve</button>
                <button onclick="handleApproval(${worker.id}, 'reject')">Reject</button>
            </div>
        `;
    }
    if (worker.status === 'approved') {
    detailsHTML += `
        <div class="action-buttons">
            <button onclick="toggleWorkerStatus(${worker.id})">
                ${worker.is_deleted ? "Reactivate" : "Deactivate"} Worker
            </button>
        </div>
    `;
}


    workerDetails.innerHTML = detailsHTML;
    displayWorkers();
}
async function toggleWorkerStatus(workerId) {
    const confirmAction = confirm("Are you sure you want to toggle this worker's account status?");
    if (!confirmAction) return;

    try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${BASE_URL}/admin/worker/${workerId}/toggle-status`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to toggle worker status");

        alert(data.message);
        selectedWorkerId = null;
        await fetchWorkersFromBackend();
    } catch (err) {
        console.error("Toggle error:", err);
        alert("Could not update worker status.");
    }
}

async function handleApproval(workerId, action) {
    const confirmAction = confirm(`Are you sure you want to ${action} this worker?`);
    if (!confirmAction) return;

    try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${BASE_URL}/admin/worker/${workerId}/decision`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update worker status");

        alert(data.message);
        selectedWorkerId = null;
        await fetchWorkersFromBackend();
    } catch (err) {
        console.error("Approval error:", err);
        alert(err.message);
    }
}

function updateWorkerCount() {
    const count = filteredWorkers.length;
    const text = currentFilter === 'requests' ? 'request' : currentFilter;
    document.getElementById('workerCount').textContent = `Showing ${count} ${text}${count !== 1 ? 's' : ''}`;
}

function updatePagination() {
    const totalPages = Math.ceil(filteredWorkers.length / itemsPerPage);
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayWorkers();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredWorkers.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayWorkers();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchWorkersFromBackend();
    document.getElementById('searchInput').addEventListener('input', filterAndDisplayWorkers);
});
