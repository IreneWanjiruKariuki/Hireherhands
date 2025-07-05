const jobsData = [
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