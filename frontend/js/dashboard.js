function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}
function updateWelcomeMessage() {
    const user = getCurrentUser();
    const welcomeElement = document.getElementById('welcomeMessage');
            
    if (user && user.name) {
        welcomeElement.textContent = `Welcome , ${user.name}!`;
    } else {
        const defaultUser = {
            id: 'default-user',
            name: 'Default',
            email: 'Default@text.com'
        };
        localStorage.setItem('currentUser', JSON.stringify(defaultUser));
        welcomeElement.textContent = `Welcome back, ${defaultUser.name}!`;
    }
}
function getJobsFromStorage() {
    const jobs = localStorage.getItem('userJobs');
    return jobs ? JSON.parse(jobs) : [];
}
function saveJobsToStorage(jobs) {
    localStorage.setItem('userJobs', JSON.stringify(jobs));
}
function initializeSampleJobs() {
    const existingJobs = getJobsFromStorage();
    if (existingJobs.length === 0) {
        const sampleJobs = [{
            id: 1,
            title: "Construction of Modern House",
            description: "Looking for an experienced construction worker to build a modern 3-bedroom house with contemporary design. Must have experience with concrete work, roofing, and finishing.",
            budget: "ksh 150,000",
            status: "open",
            datePosted: "2024-01-15",
            location: "Nairobi, Kenya",
            category: "Construction",
            requirements: "5+ years experience, own tools, references required",
            duration: "3 months"
        },
        {
            id: 2,
            title: "Plumbing Installation Project",
            description: "Need a skilled plumber for complete plumbing installation in a new residential building. Includes water supply, drainage, and fixture installation.",
            budget: "ksh 45,000",
            status: "assigned",
            datePosted: "2024-01-10",
            location: "Mombasa, Kenya",
            category: "Plumbing",
            requirements: "Licensed plumber, 3+ years experience",
            duration: "1 month"
        },
        {
            id: 3,
            title: "Electrical Wiring for Office Building",
            description: "Seeking qualified electrician for complete electrical wiring of a 5-story office building. Must handle high-voltage installations and safety protocols.",
            budget: "ksh 80,000",
            status: "complete",
            datePosted: "2024-01-05",
            location: "Kisumu, Kenya",
            category: "Electrical",
            requirements: "Certified electrician, commercial experience",
            duration: "2 months"
        }];
        saveJobsToStorage(sampleJobs);
        return sampleJobs;
    }
    return existingJobs;
}
function createJobCard(job) {
    const statusClass = `status-${job.status}`;
    const formattedDate = new Date(job.datePosted).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return `
    <div class="job-card" data-status="${job.status}">
        <div class="job-header">
            <div>
                <div class="job-title">${job.title}</div>
                <div class="job-date">Posted on ${formattedDate}</div>
            </div>
                <span class="job-status ${statusClass}">${job.status.charAt(0).toUpperCase() + job.status.slice(1)}</span>
        </div>
        <div class="job-description">${job.description}</div>
        <div class="job-meta">
            <div class="job-budget">Budget: ${job.budget}</div>
            <a href="viewDetails.html?id=${job.id}" class="view-details-btn">View Details</a>
        </div>
    </div>
    `;
}