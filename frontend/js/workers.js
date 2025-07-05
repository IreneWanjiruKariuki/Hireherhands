const workersData = [
    {
        id: 1,
        name: "Alex",
        email: "alex.t@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-15",
        status: "requests",
        experience: "5 years",
        skills: ["painting", "Plumbing", "cementing"],
        certifications: [
            {
                file: "aws-cert-alex.pdf"
            },
            {
                file: "react-cert-alex.pdf"
            }
        ]
    },
    {
        id: 2,
        name: "Maria Wangui",
        email: "maria.wangui@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-10",
        status: "approved",
        experience: "7 years",
        skills: ["painting", "Plumbing", "cementing"],
        rating: 4.8,
        completedJobs: 23,
        approvalDate: "2024-01-12"
    },
    {
        id: 3,
        name: "David Chege",
        email: "david.chege@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-08",
        status: "approved",
        experience: "4 years",
        skills: ["painting", "Plumbing", "cementing"],
        rating: 4.6,
        completedJobs: 18,
        approvalDate: "2024-01-10"
    },
    {
        id: 4,
        name: "Sarah Wilson",
        email: "sarah.wilson@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-05",
        status: "rejected",
        experience: "2 years",
        skills: ["painting", "Plumbing", "cementing"],
        rejectionDate: "2024-01-07",
        rejectionReason: "Insufficient experience for current project requirements"
    },
    {
        id: 5,
        name: "Jennifer odhiambo",
        email: "jennifer.odhiambo@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-20",
        status: "requests",
        experience: "6 years",
        skills: ["painting", "Plumbing", "cementing"],
        certifications: [
            {
                file: "google-data-cert-jennifer.pdf"
            },
            {
                file: "tensorflow-cert-jennifer.pdf"
            }
        ]
    },
    {
        id: 6,
        name: "Michael Bass",
        email: "michael.bass@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-18",
        status: "approved",
        experience: "8 years",
        skills: ["painting", "Plumbing", "cementing"],
        rating: 4.9,
        completedJobs: 31,
        approvalDate: "2024-01-20"
    },
    {
        id: 7,
        name: "Lisa Wangui",
        email: "lisa.wangui@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-22",
        status: "requests",
        experience: "3 years",
        skills: ["painting", "Plumbing", "cementing"],
        certifications: [
            {
                file: "vue-cert-lisa.pdf"
            }
        ]
    },
    {
        id: 8,
        name: "Robert Owen",
        email: "robert.owen@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-12",
        status: "approved",
        experience: "5 years",
        skills: ["painting", "Plumbing", "cementing"],
        rating: 4.7,
        completedJobs: 15,
        approvalDate: "2024-01-14"
    },
    {
        id: 9,
        name: "Emma Faith",
        email: "emma.faith@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-08",
        status: "rejected",
        experience: "2 years",
        skills: ["painting", "Plumbing", "cementing"],
        rejectionDate: "2024-01-10",
        rejectionReason: "Limited experience with required technologies"
    },
    {
        id: 10,
        name: "James",
        email: "james.@email.com",
        phone: "+254 746837772",
        location: "Nairobi, Kenya",
        applicationDate: "2024-01-25",
        status: "requests",
        experience: "4 years",
        skills: ["painting", "Plumbing", "cementing"],
        certifications: [
            {
                file: "angular-cert-james.pdf"
            },
            {
                file: "mongodb-cert-james.pdf"
            }
        ]
    }
];
let currentFilter = 'requests';
let currentPage = 1;
const itemsPerPage = 4;
let filteredWorkers = [];
let selectedWorkerId = null;

function setFilter(status) {
    currentFilter = status;
    currentPage = 1;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update section title
    const titles ={
        'requests': 'Worker Requests',
        'approved': 'Approved Workers',
        'rejected': 'Rejected Workers'
    };
    document.getElementById('sectionTitle').textContent = titles[status];
    
    selectedWorkerId = null;
    document.getElementById('workerDetails').innerHTML = '<div class="no-selection">Select a worker to view details</div>';
    
    filterAndDisplayWorkers();
}
function filterAndDisplayWorkers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    let workers = workersData.filter(worker => worker.status === currentFilter);

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
        if (currentFilter === 'requests' && filteredWorkers.length === 0) {
            workersList.innerHTML = `
                <div class="no-workers">
                    <h3>No Requests</h3>
                    <p>There are currently no worker requests to review.</p>
                </div>
            `;
        } else {
            workersList.innerHTML = `
                <div class="no-workers">
                    <h3>No Workers Found</h3>
                    <p>No workers found matching your search criteria.</p>
                </div>
            `;
        }
        updateWorkerCount();
        updatePagination();
        return;
    }
    workersList.innerHTML = workersToShow.map(worker => `
        <div class="worker-item ${selectedWorkerId === worker.id ? 'active' : ''}" onclick="selectWorker(${worker.id})">
            <div class="worker-info">
                <h4>${worker.name}</h4>
                <div class="worker-meta">${worker.experience} experience • ${worker.skills.slice(0, 2).join(', ')}</div>
                <div class="worker-status status-${worker.status}">${worker.status}</div>
            </div>
        </div>
    `).join('');
    updateWorkerCount();
    updatePagination();
}
function selectWorker(workerId) {
    selectedWorkerId = workerId;
    const worker = workersData.find(w => w.id === workerId);
    
    if (!worker) return;
    const workerDetails = document.getElementById('workerDetails');
    let detailsHTML = `
        <div class="detail-section">
            <h3>Worker Information</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Full Name</div>
                    <div class="detail-value">${worker.name}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${worker.email}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Phone</div>
                    <div class="detail-value">${worker.phone}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Experience</div>
                    <div class="detail-value">${worker.experience}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Application Date</div>
                    <div class="detail-value">${new Date(worker.applicationDate).toLocaleDateString()}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Status</div>
                    <div class="detail-value">
                        <span class="worker-status status-${worker.status}">${worker.status}</span>
                    </div>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Location</div>
                <div class="detail-value">${worker.location}</div>
            </div>
        </div>
        <div class="detail-section">
            <h3>Skills</h3>
            <div class="skills-list">
                ${worker.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
    `;
    if (worker.status === 'approved') {
        detailsHTML += `
            <div class="detail-section">
                <h3>Performance</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Rating</div>
                        <div class="detail-value">
                            <div class="star-rating">
                                ${generateStarRating(worker.rating)}
                                <span class="rating-text">${worker.rating}/5.0</span>
                            </div>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Completed Jobs</div>
                        <div class="detail-value">${worker.completedJobs}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Approval Date</div>
                        <div class="detail-value">${new Date(worker.approvalDate).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        `;
    }
    if (worker.status === 'requests' && worker.certifications) {
        detailsHTML += `
            <div class="detail-section">
                <h3>Certifications</h3>
                <div class="certifications-list">
                    ${worker.certifications.map(cert => `
                        <div class="certification-item">
                            <div class="cert-info">
                                <div class="cert-name">${cert.name}</div>
                                <div class="cert-issuer">${cert.issuer} • ${new Date(cert.date).toLocaleDateString()}</div>
                            </div>
                            <button class="view-cert-btn" onclick="viewCertification('${cert.file}')">View</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        detailsHTML += `
            <div class="action-buttons">
                <button class="approve-btn" onclick="approveWorker(${worker.id})">
                    ✓ Approve Worker
                </button>
                <button class="reject-btn" onclick="rejectWorker(${worker.id})">
                    ✗ Reject Worker
                </button>
            </div>
        `;
    }
    if (worker.status === 'rejected') {
        detailsHTML += `
            <div class="detail-section">
                <h3>Rejection Details</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Rejection Date</div>
                        <div class="detail-value">${new Date(worker.rejectionDate).toLocaleDateString()}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Reason</div>
                    <div class="detail-value">${worker.rejectionReason}</div>
                </div>
            </div>
        `;
    }
    workerDetails.innerHTML = detailsHTML;
    displayWorkers();
}
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
    
    let starsHTML = '';
    
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<span class="star">★</span>';
    }
    if (hasHalfStar) {
        starsHTML += '<span class="star">★</span>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<span class="star empty">★</span>';
    }
    return starsHTML;
}