const BASE_URL = 'http://127.0.0.1:5000';
const token = localStorage.getItem("access_token");
const role = localStorage.getItem("role");

if (!token || role !== "admin") {
    alert("Access denied. Only admins can access this page.");
    window.location.href = "login.html";
}

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

let clientsData = [];
let currentPage = 1;
const itemsPerPage = 4;
let filteredClients = [];
let selectedClientId = null;

function fetchClients() {
    const freshToken = localStorage.getItem("access_token");
    fetch(`${BASE_URL}/admin/clients`, {
        headers: {
            "Authorization": `Bearer ${freshToken}`
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("Failed to fetch clients");
        return res.json();
    })
    .then(data => {
        clientsData = (data.clients || []).map(c => ({
            ...c,
            is_deleted: c.is_deleted || false
        }));
        
        setClientFilter('all');
    })
    .catch(err => {
        console.error("Error loading clients:", err);
        document.getElementById("clientsList").innerHTML = "<div class='error'>Failed to load clients</div>";
    });
}
function setClientFilter(filter, event) {
    if (event) {
        document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
        event.target.classList.add('active');
    }

    if (filter === 'active') {
        filteredClients = clientsData.filter(c => !c.is_deleted);
    } else if (filter === 'deactivated') {
        filteredClients = clientsData.filter(c => c.is_deleted);
    } else {
        filteredClients = [...clientsData];
    }

    currentPage = 1;
    selectedClientId = null;
    document.getElementById('clientDetails').innerHTML = '<div class="no-selection">Select a client to view details and job history</div>';
    displayClients();
}


function displayClients() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const clientsToShow = filteredClients.slice(startIndex, endIndex);
    const clientsList = document.getElementById('clientsList');

    if (clientsToShow.length === 0) {
        clientsList.innerHTML = '<div class="no-results">No clients found matching your search criteria.</div>';
        updatePagination();
        return;
    }

    clientsList.innerHTML = clientsToShow.map(client => `
        <div class="client-item ${selectedClientId === client.client_id ? 'active' : ''}" onclick="selectClient(${client.client_id})">
            <div class="client-info">
                <h4>${client.fullname}</h4>
                <div class="client-meta">${client.email} • ${client.phone}</div>
            </div>
            <div class="client-status ${client.is_deleted ? 'status-inactive' : 'status-active'}">
                ${client.is_deleted ? 'inactive' : 'active'}
            </div>
        </div>
    `).join('');

    updateClientCount();
    updatePagination();
}

function selectClient(clientId) {
    selectedClientId = clientId;
    const client = clientsData.find(c => c.client_id === clientId);
    if (!client) return;

    const clientDetails = document.getElementById('clientDetails');

    clientDetails.innerHTML = `
        <div class="detail-section">
            <h3>Client Information</h3>
            <div class="detail-grid">
                <div class="detail-item"><div class="detail-label">Full Name</div><div class="detail-value">${client.fullname}</div></div>
                <div class="detail-item"><div class="detail-label">Email</div><div class="detail-value">${client.email}</div></div>
                <div class="detail-item"><div class="detail-label">Phone</div><div class="detail-value">${client.phone}</div></div>
                <div class="detail-item"><div class="detail-label">Joined</div><div class="detail-value">${client.created_at ? new Date(client.created_at).toLocaleDateString() : 'N/A'}</div></div>
            </div>
        </div>
        ${client.jobs ? renderJobHistory(client.jobs) : '<div class="job-history"><em>No job history available.</em></div>'}
        <div class="action-buttons" style="margin-top: 1rem;">
            <button onclick="toggleClientStatus(${client.client_id})">
                ${client.is_deleted ? 'Reactivate' : 'Deactivate'} Client
            </button>
        </div>
    `;

    displayClients();
}

function renderJobHistory(jobs) {
    return `
        <div class="detail-section job-history">
            <h3>Job History (${jobs.length} jobs)</h3>
            ${jobs.map(job => `
                <div class="job-item">
                    <div class="job-header">
                        <div class="job-title">${job.skill_name || 'Skill'}</div>
                        <div class="job-date">${job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Unknown'}</div>
                    </div>
                    <div class="job-description">${job.description || 'No description provided'}</div>
                    <div class="job-footer">
                        <span class="job-status job-${job.status}">${job.status}</span>
                        <strong>${job.budget ? `KES ${job.budget}` : 'N/A'}</strong>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

async function toggleClientStatus(clientId) {
    const confirmAction = confirm("Are you sure you want to toggle this client's account status?");
    if (!confirmAction) return;

    try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${BASE_URL}/admin/client/${clientId}/toggle-status`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to toggle client status");

        alert(data.message);
        fetchClients();  // Refresh after toggle
    } catch (err) {
        console.error("Toggle client error:", err);
        alert("Could not update client status.");
    }
}

function searchClients() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    if (searchTerm === '') {
        filteredClients = [...clientsData];
    } else {
        filteredClients = clientsData.filter(client =>
            client.fullname.toLowerCase().includes(searchTerm) ||
            client.email.toLowerCase().includes(searchTerm)
        );
    }
    currentPage = 1;
    selectedClientId = null;
    document.getElementById('clientDetails').innerHTML = '<div class="no-selection">Select a client to view details and job history</div>';
    displayClients();
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    filteredClients = [...clientsData];
    currentPage = 1;
    selectedClientId = null;
    document.getElementById('clientDetails').innerHTML = '<div class="no-selection">Select a client to view details and job history</div>';
    displayClients();
}

function updateClientCount() {
    const count = filteredClients.length;
    document.getElementById('clientCount').textContent = `Showing ${count} client${count !== 1 ? 's' : ''}`;
}

function updatePagination() {
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages || totalPages === 0;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayClients();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayClients();
    }
}

// Init after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    checkSession("admin");
    fetchClients();

    document.getElementById('searchInput')?.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') searchClients();
    });

    document.getElementById('clearBtn')?.addEventListener('click', clearSearch);
});
