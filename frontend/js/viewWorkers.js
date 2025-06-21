// Sample worker data
const workers = [{
    id: 1,
    name: "John Kamau",
    category: "construction",
    experience: "experienced",
    rating: 4.8,
    reviews: 45,
    location: "Nairobi",
    rate: 2500,
    availability: "Available",
    skills: ["Concrete Work", "Roofing", "Foundation", "Masonry"],
    description: "Experienced construction worker with 8 years in residential and commercial projects."
},
{
    id: 2,
    name: "Mary Wanjiku",
    category: "plumbing",
    experience: "expert",
    rating: 4.9,
    reviews: 67,
    location: "Nairobi",
    rate: 3000,
    availability: "Available",
    skills: ["Pipe Installation", "Water Systems", "Drainage", "Repairs"],
    description: "Licensed plumber with 12 years experience in residential and commercial plumbing."
},
{
    id: 3,
    name: "Peter Ochieng",
    category: "electrical",
    experience: "experienced",
    rating: 4.7,
    reviews: 38,
    location: "Kisumu",
    rate: 2800,
    availability: "Available",
    skills: ["Wiring", "Panel Installation", "Lighting", "Safety Systems"],
    description: "Certified electrician specializing in residential and office electrical systems."
},
{
    id: 4,
    name: "Grace Mutua",
    category: "painting",
    experience: "intermediate",
    rating: 4.6,
    reviews: 29,
    location: "Mombasa",
    rate: 1800,
    availability: "Available",
    skills: ["Interior Painting", "Exterior Painting", "Wall Preparation", "Color Consultation"],
    description: "Professional painter with 5 years experience in residential and commercial projects."
},
{
    id: 5,
    name: "David Kiprop",
    category: "carpentry",
    experience: "expert",
    rating: 4.9,
    reviews: 52,
    location: "Nairobi",
    rate: 2200,
    availability: "Available",
    skills: ["Custom Furniture", "Cabinet Making", "Door Installation", "Wood Finishing"],
    description: "Master carpenter with 15 years experience in custom woodwork and furniture."
},
{
    id: 6,
    name: "Sarah Akinyi",
    category: "cleaning",
    experience: "intermediate",
    rating: 4.5,
    reviews: 34,
    location: "Nairobi",
    rate: 1200,
    availability: "Available",
    skills: ["Deep Cleaning", "Office Cleaning", "Window Cleaning", "Carpet Cleaning"],
    description: "Professional cleaner with 4 years experience in residential and commercial cleaning."
},
{
    id: 7,
    name: "Michael Otieno",
    category: "roofing",
    experience: "experienced",
    rating: 4.7,
    reviews: 41,
    location: "Kisumu",
    rate: 2600,
    availability: "Available",
    skills: ["Metal Roofing", "Tile Installation", "Roof Repair", "Waterproofing"],
    description: "Roofing specialist with 9 years experience in all types of roofing systems."
},
{
    id: 8,
    name: "Jane Nyong'o",
    category: "landscaping",
    experience: "intermediate",
    rating: 4.4,
    reviews: 26,
    location: "Nairobi",
    rate: 1500,
    availability: "Available",
    skills: ["Garden Design", "Plant Care", "Irrigation", "Lawn Maintenance"],
    description: "Landscape designer with 6 years experience in residential and commercial landscaping."
}];
let filteredWorkers = [...workers];
let currentJob = null;


document.addEventListener('DOMContentLoaded', function() {
    loadJobData();
    displayWorkers(filteredWorkers);
    setupFilters();
});
function loadJobData() {
    const jobData = localStorage.getItem('currentJobPosting');
    if (jobData) {
        currentJob = JSON.parse(jobData);
        displayJobSummary(currentJob);
        filterWorkersByJob(currentJob);
    }
}
function displayJobSummary(job) {
    const jobDetails = document.getElementById('jobDetails');
    jobDetails.innerHTML = `
        <div class="job-detail">
            <span class="job-detail-label">Category:</span>
            <span class="job-detail-value">${job.category.charAt(0).toUpperCase() + job.category.slice(1)}</span>
        </div>
        <div class="job-detail">
            <span class="job-detail-label">Location:</span>
            <span class="job-detail-value">${job.location}</span>
        </div>
        <div class="job-detail">
            <span class="job-detail-label">Duration:</span>
            <span class="job-detail-value">${job.duration}</span>
        </div>
        <div class="job-detail">
            <span class="job-detail-label">Budget:</span>
            <span class="job-detail-value">KSh ${parseInt(job.budget).toLocaleString()}</span>
        </div>
    `;
}
function filterWorkersByJob(job) {
    filteredWorkers = workers.filter(worker => {
        // Filter by category
        if (job.category !== 'other' && worker.category !== job.category) {
            return false;
        }
        // Filter by location
        const jobLocation = job.location.toLowerCase();
        const workerLocation = worker.location.toLowerCase();
        if (!workerLocation.includes(jobLocation.split(',')[0].toLowerCase())) {}
                
        return true;
    });  
    displayWorkers(filteredWorkers);
}
