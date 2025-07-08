const BASE_URL = 'http://127.0.0.1:5000';
let currentFilter = 'all';
let currentSearchTerm = '';
window.adminJobs = [];

// SESSION CHECK
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

        if (requiredRole && role !== requiredRole) {
            alert("Access denied.");
            window.location.href = "login.html";
        }
    } catch (err) {
        console.error("Invalid token", err);
        localStorage.clear();
        window.location.href = "login.html";
    }
}


async function secureFetch(url, options = {}) {
    const token = localStorage.getItem("access_token");
    const headers = {
        ...(options.headers || {}),
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
        alert("Session expired or unauthorized. Please login again.");
        localStorage.clear();
        window.location.href = "login.html";
        return Promise.reject("Unauthorized");
    }

    return res;
}

function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

function createJobCard(job, searchTerm = '') {
    const statusClass = `status-${job.status}`;
    return `
        <div class="job-card" data-status="${job.status}">
            <div class="job-header">
                <div>
                    <h3 class="job-title">${highlightSearchTerm(job.title || job.skill_name || 'Untitled Job', searchTerm)}</h3>
                </div>
                <span class="job-status ${statusClass}">${formatStatus(job.status)}</span>
            </div>
            <div class="job-info">
                <div class="job-info-item">
                   <span class="job-info-label">Client:</span>
                   <span class="job-info-value">${job.client_name || 'Unknown'}</span>
                </div>
                <div class="job-info-item">
                    <span class="job-info-label">Assigned Worker:</span>
                    <span class="job-info-value ${!job.worker_name ? 'no-worker' : ''}">
                        ${job.worker_name || 'Not assigned yet'}
                    </span>
                </div>
                <div class="job-info-item">
                    <span class="job-info-label">Deadline:</span>
                    <span class="job-info-value">${job.scheduled_date || 'Not scheduled'}</span>
                </div>
                <div class="job-info-item">
                    <span class="job-info-label">Budget:</span>
                    <span class="job-info-value">KSh ${parseInt(job.budget || 0).toLocaleString()}</span>
                </div>
            </div>
            <p class="job-description">${highlightSearchTerm(job.description || 'No description provided', searchTerm)}</p>
        </div>
    `;
}

function filterJobs() {
    let filtered = window.adminJobs;

    if (currentSearchTerm) {
        const term = currentSearchTerm.toLowerCase();
        filtered = filtered.filter(job => {
            const fields = [
                job.title || job.skill_name || '',
                job.description || '',
                job.client_name || '',
                job.worker_name || ''
            ].join(' ').toLowerCase();
            return fields.includes(term);
        });
    }

    if (currentFilter !== 'all') {
        filtered = filtered.filter(job => job.status === currentFilter);
    }

    return filtered;
}

function renderJobs() {
    const jobsGrid = document.getElementById('jobsGrid');
    const jobs = filterJobs();

    if (jobs.length === 0) {
        const msg = currentSearchTerm
            ? `No jobs found matching "${currentSearchTerm}"`
            : 'No jobs match the selected filter criteria.';
        jobsGrid.innerHTML = `
            <div class="no-results">
                <h3>No jobs found</h3>
                <p>${msg}</p>
                ${currentSearchTerm ? '<p>Try adjusting your search terms or clearing the search.</p>' : ''}
            </div>
        `;
        return;
    }

    jobsGrid.innerHTML = jobs.map(job => createJobCard(job, currentSearchTerm)).join('');
}

function searchJob() {
    currentSearchTerm = document.getElementById('searchInput').value.trim();
    renderJobs();
}

function clearSearch() {
    const input = document.getElementById('searchInput');
    input.value = '';
    currentSearchTerm = '';
    renderJobs();
    input.focus();
}

function setupSearchInput() {
    const input = document.getElementById('searchInput');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchJob();
    });
}

function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.getAttribute('data-status');
            renderJobs();
        });
    });
}

function formatStatus(status) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

async function fetchAdminJobs() {
    try {
        const res = await secureFetch(`${BASE_URL}/admin/jobs`);
        const data = await res.json();
        window.adminJobs = data.jobs;
        renderJobs();
    } catch (err) {
        console.error('Failed to load admin jobs:', err);
        document.getElementById('jobsGrid').innerHTML = `<div class="no-results"><p>Error loading jobs</p></div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    fetchAdminJobs();
    setupFilters();
    setupSearchInput();
});
