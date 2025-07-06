const BASE_URL = 'http://127.0.0.1:5000';
const token = localStorage.getItem("access_token");
const role = localStorage.getItem("role");

if (!token || role !== "admin") {
    alert("Access denied. Only admins can access this page.");
    window.location.href = "login.html";
}

let clientsData = [];
let currentPage = 1;
const itemsPerPage = 4;
let filteredClients = [];
let selectedClientId = null;

function fetchClients() {
    fetch(`${BASE_URL}/admin/clients`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("Failed to fetch clients");
        return res.json();
    })
    .then(data => {
        clientsData = data.clients || [];
        filteredClients = [...clientsData];
        displayClients();
    })
    .catch(err => {
        console.error("Error loading clients:", err);
        document.getElementById("clientsList").innerHTML = "<div class='error'>Failed to load clients</div>";
    });
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
            <div class="client-status status-active">active</div>
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
                <div class="detail-item">
                    <div class="detail-label">Full Name</div>
                    <div class="detail-value">${client.fullname}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${client.email}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Phone</div>
                    <div class="detail-value">${client.phone}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Joined</div>
                    <div class="detail-value">${client.created_at ? new Date(client.created_at).toLocaleDateString() : 'N/A'}</div>
                </div>
            </div>
        </div>
        ${client.jobs ? renderJobHistory(client.jobs) : '<div class="job-history"><em>No job history available.</em></div>'}
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
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
                        <span class="job-status job-${job.status}">${job.status}</span>
                        <strong>${job.budget ? `KES ${job.budget}` : 'N/A'}</strong>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
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
    const clientCount = document.getElementById('clientCount');
    clientCount.textContent = `Showing ${filteredClients.length} client${filteredClients.length !== 1 ? 's' : ''}`;
}

function updatePagination() {
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
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

document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchClients();
    }
});

fetchClients();
