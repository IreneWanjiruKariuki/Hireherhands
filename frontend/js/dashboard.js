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
function displayJobs(jobsToShow = null) {
    const jobsContainer = document.getElementById('jobsContainer');
    const jobs = jobsToShow || getJobsFromStorage();

    //console.log('Displaying jobs:', jobs);
    if (jobs.length === 0) {
        jobsContainer.innerHTML = `
        <div class="no-jobs">
            <h3>No jobs found</h3>
            <p>You haven't posted any jobs yet. Click "Create Job Post" to get started!</p>
        </div>
      `;
        return;
    }
    const jobsHTML = jobs.map(job => createJobCard(job)).join('');
    jobsContainer.innerHTML = jobsHTML; 
    //console.log('Jobs HTML generated:', jobsHTML); 
}
function filterJobs(status, event) {
    if (event) {
        event.preventDefault();
    } 
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    if (event) {
        event.target.classList.add('active');
    }
    const allJobs = getJobsFromStorage();
    let filteredJobs;
            
    if (status === 'all') {
        filteredJobs = allJobs;
    } else {
        filteredJobs = allJobs.filter(job => job.status === status);
    }

    displayJobs(filteredJobs);
}
function addNewJob(jobData) {
    const jobs = getJobsFromStorage();
    const newJob = {
        id: Date.now(), 
        ...jobData,
        datePosted: new Date().toISOString().split('T')[0],
        status: 'open'
     }; 
    jobs.unshift(newJob); 
    saveJobsToStorage(jobs);
            
    if (document.getElementById('jobsContainer')) {
        displayJobs();
    }
}
function checkForNewJobs() {
    displayJobs();
}

// Initialize dashboard when page loads
    document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loading...'); // Debug log
            
// Check if user is logged in and update welcome message
    updateWelcomeMessage();
            
// Initialize sample jobs if none exist
    const jobs = initializeSampleJobs();
    console.log('Initialized jobs:', jobs); // Debug log
            
// Display jobs
    displayJobs();
            
// Set up periodic check for new jobs (every 30 seconds)
    setInterval(checkForNewJobs, 30000);
});