/*const jobsData = [

    {
        id: 1,
        title: "Westlands Office Complex Construction",
        description: "Construction of a 15-story modern office complex in Westlands, Nairobi with underground parking and modern amenities.",
        status: "ongoing",
        client: "Nairobi Property Developers Ltd",
        assignedWorker: "John Mwangi",
        deadline: "2024-08-15",
        budget: "KSh 450,000"
    },
    {
        id: 2,
        title: "Mombasa Road Residential Apartments",
        description: "Development of 200-unit affordable housing project along Mombasa Road with recreational facilities.",
        status: "pending",
        client: "Kenya Housing Corporation",
        assignedWorker: null,
        deadline: "2024-12-01",
        budget: "KSh 800,000"
    },
    {
        id: 3,
        title: "Kisumu Shopping Mall Renovation",
        description: "Complete renovation and modernization of existing shopping mall in Kisumu CBD including new facade and interior design.",
        status: "complete",
        client: "Lakeside Retail Group",
        assignedWorker: "Grace Wanjiku",
        deadline: "2024-01-30",
        budget: "KSh 120,000"
    },
    {
        id: 4,
        title: "Nakuru Industrial Warehouse",
        description: "Construction of large-scale industrial warehouse facility in Nakuru for agricultural produce storage.",
        status: "ongoing",
        client: "Rift Valley Agro Ltd",
        assignedWorker: "Peter Kiprotich",
        deadline: "2024-06-20",
        budget: "KSh 85,000"
    },
    {
        id: 5,
        title: "Eldoret Hospital Extension",
        description: "Extension of existing hospital facility in Eldoret including new maternity wing and modern medical equipment installation.",
        status: "pending",
        client: "Uasin Gishu County Government",
        assignedWorker: null,
        deadline: "2024-10-15",
        budget: "KSh 300,000"
    },
    {
        id: 6,
        title: "Karen Luxury Villas Project",
        description: "Construction of 25 luxury villas in Karen with modern architecture, swimming pools, and landscaped gardens.",
        status: "complete",
        client: "Premium Homes Kenya",
        assignedWorker: "Mary Njeri",
        deadline: "2024-02-10",
        budget: "KSh 650,000"
    },
    {
        id: 7,
        title: "Thika Road Bridge Construction",
        description: "Construction of pedestrian bridge over Thika Road to improve safety and traffic flow in the area.",
        status: "ongoing",
        client: "Kenya National Highways Authority",
        assignedWorker: "Samuel Ochieng",
        deadline: "2024-05-30",
        budget: "KSh 45,000"
    },
    {
        id: 8,
        title: "Machakos Water Treatment Plant",
        description: "Construction of modern water treatment facility to serve Machakos town and surrounding areas.",
        status: "pending",
        client: "Machakos Water & Sewerage Company",
        assignedWorker: null,
        deadline: "2024-11-20",
        budget: "KSh 180,000"
    }
];
let currentFilter = 'all';
let currentSearchTerm = '';

function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

function createJobCard(job, searchTerm = '') {
    return `
        <div class="job-card" data-status="${job.status}">
            <div class="job-header">
                <div>
                    <h3 class="job-title">${highlightSearchTerm(job.title, searchTerm)}</h3>
                </div>
                <span class="job-status status-${job.status}">${job.status}</span>
            </div>
            
            <div class="job-info">
                <div class="job-info-item">
                    <span class="job-info-label">Client:</span>
                    <span class="job-info-value">${highlightSearchTerm(job.client, searchTerm)}</span>
                </div>
                <div class="job-info-item">
                    <span class="job-info-label">Assigned Worker:</span>
                    <span class="job-info-value ${!job.assignedWorker ? 'no-worker' : ''}">
                        ${job.assignedWorker ? highlightSearchTerm(job.assignedWorker, searchTerm) : 'No assigned worker'}
                    </span>
                </div>
                <div class="job-info-item">
                    <span class="job-info-label">Deadline:</span>
                    <span class="job-info-value">${job.deadline}</span>
                </div>
                <div class="job-info-item">
                    <span class="job-info-label">Budget:</span>
                    <span class="job-info-value">${job.budget}</span>
                </div>
            </div>
            
            <p class="job-description">${highlightSearchTerm(job.description, searchTerm)}</p>
        </div>
    `;
}
function filterJobs() {
    let filteredJobs = jobsData;

    if (currentSearchTerm) {
        filteredJobs = filteredJobs.filter(job => {
            const searchFields = [
                job.title,
                job.description,
                job.client,
                job.assignedWorker || ''
            ].join(' ').toLowerCase();
            
            return searchFields.includes(currentSearchTerm.toLowerCase());
        });
    }
    if (currentFilter !== 'all') {
        filteredJobs = filteredJobs.filter(job => job.status === currentFilter);
    }
    return filteredJobs;
}
function renderJobs() {
    const jobsGrid = document.getElementById('jobsGrid');
    const filteredJobs = filterJobs();

    if (filteredJobs.length === 0) {
        const noResultsMessage = currentSearchTerm 
            ? `No jobs found matching "${currentSearchTerm}"` 
            : 'No jobs match the selected filter criteria.';
        
        jobsGrid.innerHTML = `
            <div class="no-results">
                <h3>No jobs found</h3>
                <p>${noResultsMessage}</p>
                ${currentSearchTerm ? '<p>Try adjusting your search terms or clearing the search.</p>' : ''}
            </div>
        `;
        return;
    }

    jobsGrid.innerHTML = filteredJobs.map(job => createJobCard(job, currentSearchTerm)).join('');
}
function searchJob() {
    const searchInput = document.getElementById('searchInput');
    currentSearchTerm = searchInput.value.trim();
    renderJobs();
}
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    currentSearchTerm = '';
    renderJobs();
    searchInput.focus();
}
function setupSearchInput() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchJob();
        }
    });
}
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const status = button.getAttribute('data-status');
            currentFilter = status;
            renderJobs();
        });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    renderJobs();
    setupFilters();
    setupSearchInput();
}); */

// admin_jobs.js
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
