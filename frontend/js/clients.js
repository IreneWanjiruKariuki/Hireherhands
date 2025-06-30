//Sample data for clients
const clientsData = [
    {
        id: 1,
        name: "John Onyango",
        email: "john.onyango@email.com",
        phone: "+254 712394567",
        location: "Nairobi, Kenya",
        registrationDate: "2023-01-15",
        status: "active",
        totalJobs: 8,
        jobHistory: [
            {
                id: 101,
                category: "Painting",
                description: "Full wall painting for office renovation",
                startDate: "2024-01-15",
                endDate: "2024-02-28",
                status: "completed",
                value: "$5,500"
            },
            {
                id: 102,
                category: "plumbing",
                description: "Installation of new plumbing system in office",
                startDate: "2024-03-01",
                endDate: "2024-05-15",
                status: "ongoing",
                value: "$12,000"
            }
        ]
    },
    {
        id: 2,
        name: "Sarah Mwangi",
        email: "sarah.j@M.com",
        phone: "+254 712394567",
        location: "Nairobi, Kenya",
        registrationDate: "2023-03-22",
        status: "active",
        totalJobs: 5,
        jobHistory: [
            {
                id: 201,
                category: "Painting",
                description: "Full wall painting for office renovation",
                startDate: "2023-11-01",
                endDate: "2023-12-15",
                status: "completed",
                value: "$8,200"
            },
            {
                id: 202,
                category: "plumbing",
                description: "Installation of new plumbing system in office",
                startDate: "2024-01-10",
                endDate: "2024-01-25",
                status: "completed",
                value: "$3,500"
            }
        ]
    },
    {
        id: 3,
        name: "Michael Owen",
        email: "m.owen@startup.com",
        phone: "+254 712394567",
        location: "Nairobi, Kenya",
        registrationDate: "2023-06-10",
        status: "inactive",
        totalJobs: 3,
        jobHistory: [
            {
                id: 301,
                category: "plumbing",
                description: "Installation of new plumbing system in office",
                startDate: "2023-08-01",
                endDate: "2023-10-30",
                status: "completed",
                value: "$15,000"
            }
        ]
    },
    {
        id: 4,
        name: "Emily Kariuki",
        email: "emily.kariuki@gmail.com",
        phone: "+254 712394567",
        location: "Nairobi, Kenya",
        registrationDate: "2023-08-05",
        status: "active",
        totalJobs: 12,
        jobHistory: [
            {
                id: 401,
                category: "Painting",
                description: "Full wall painting for office renovation",
                startDate: "2023-09-15",
                endDate: "2023-11-30",
                status: "completed",
                value: "$9,800"
            },
            {
                id: 402,
                category: "plumbing",
                description: "Installation of new plumbing system in office",
                startDate: "2024-02-01",
                endDate: "2024-04-15",
                status: "ongoing",
                value: "$7,500"
            }
        ]
    },
    {
        id: 5,
        name: "Robert Wangui",
        email: "r.wangui@gmail.com",
        phone: "+254 712394567",
        location: "Nairobi, Kenya",
        registrationDate: "2023-09-12",
        status: "active",
        totalJobs: 6,
        jobHistory: [
            {
                id: 501,
                category: "Painting",
                description: "Full wall painting for office renovation",
                startDate: "2023-10-01",
                endDate: "2023-12-20",
                status: "completed",
                value: "$11,200"
            }
        ]
    },
    {
        id: 6,
        name: "Lisa Tanui",
        email: "lisa.t@nui.com",
        phone: "+254 712394567",
        location: "Nairobi, Kenya",
        registrationDate: "2023-11-18",
        status: "active",
        totalJobs: 4,
        jobHistory: [
            {
                id: 601,
                category: "plumbing",
                description: "Installation of new plumbing system in office",
                startDate: "2024-01-05",
                endDate: "2024-03-20",
                status: "ongoing",
                value: "$13,500"
            }
        ]
    }
];
let currentPage = 1;
const itemsPerPage = 4;
let filteredClients = [...clientsData];
let selectedClientId = null;

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
        <div class="client-item ${selectedClientId === client.id ? 'active' : ''}" onclick="selectClient(${client.id})">
            <div class="client-info">
                <h4>${client.name}</h4>
                <div class="client-meta">${client.company} • ${client.totalJobs} jobs</div>
            </div>
            <div class="client-status status-${client.status}">${client.status}</div>
        </div>
    `).join('');
    
    updateClientCount();
    updatePagination();
}
function selectClient(clientId) {
    selectedClientId = clientId;
    const client = clientsData.find(c => c.id === clientId);
    
    if (!client) return;
    
    const clientDetails = document.getElementById('clientDetails');
    clientDetails.innerHTML = `
    <div class="detail-section">
        <h3>Client Information</h3>
        <div class="detail-grid">
            <div class="detail-item">
                <div class="detail-label">Full Name</div>
                <div class="detail-value">${client.name}</div>
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
                <div class="detail-label">Registration Date</div>
                <div class="detail-value">${new Date(client.registrationDate).toLocaleDateString()}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Status</div>
                <div class="detail-value">
                    <span class="client-status status-${client.status}">${client.status}</span>
                </div>
            </div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Address</div>
            <div class="detail-value">${client.locatio}</div>
        </div>
    </div>
    <div class="detail-section job-history">
        <h3>Job History (${client.jobHistory.length} jobs)</h3>
        ${client.jobHistory.map(job => `
            <div class="job-item">
                <div class="job-header">
                    <div class="job-title">${job.category}</div>
                    <div class="job-date">${new Date(job.startDate).toLocaleDateString()} - ${job.endDate ? new Date(job.endDate).toLocaleDateString() : 'Ongoing'}</div>
                </div>
                <div class="job-description">${job.description}</div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
                    <span class="job-status job-${job.status}">${job.status}</span>
                    <strong>${job.value}</strong>
                </div>
            </div>
        `).join('')}
    </div>
    `;
    displayClients();
}
function searchClients() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredClients = [...clientsData];
    } else {
        filteredClients = clientsData.filter(client => 
            client.name.toLowerCase().includes(searchTerm) ||
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