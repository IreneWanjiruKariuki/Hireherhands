const BASE_URL = 'http://127.0.0.1:5000';

function isTokenExpired(token) {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return Date.now() >= payload.exp * 1000;
    } catch (e) {
        return true;
    }
}
async function loadSkills() {
    const res = await fetch('http://127.0.0.1:5000/skills');
    const data = await res.json();

    const skillSelect = document.getElementById('skillSelect');
    data.skills.forEach(skill => {
        const option = document.createElement('option');
        option.value = skill.skill_id;
        option.textContent = `${skill.name} (${skill.category})`;
        skillSelect.appendChild(option);
    });
}

async function loadSkillsToDropdown(dropdownId) {
    const token = localStorage.getItem('access_token');
    try {
        const res = await fetch(`${BASE_URL}/skills`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();

        const dropdown = document.getElementById(dropdownId);
        dropdown.innerHTML = '';
        data.skills.forEach(skill => {
            const option = document.createElement('option');
            option.value = skill.skill_id;
            option.textContent = skill.skill_name;
            dropdown.appendChild(option);
        });
    } catch (err) {
        console.error('Failed to load skills:', err);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadSkillsToDropdown('skillSelect');
});

document.getElementById('jobPostingForm').addEventListener('submit', async function (e) {
    const form = document.getElementById('jobPostingForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();  
        return;  
    }

    e.preventDefault();  // Now we manually handle submission only if form is valid


    const token = localStorage.getItem('access_token');
    if (isTokenExpired(token)) {
        alert('Session expired. Please log in again.');
        window.location.href = 'login.html';
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const btnText = document.getElementById('btnText');
    const successMessage = document.getElementById('successMessage');

    const skillSelect = document.getElementById('skillSelect');
    const selectedOption = skillSelect.options[skillSelect.selectedIndex];
    const skill_id = parseInt(skillSelect.value);
    

    const jobData = {
        skill_id: skill_id,
        description: document.getElementById('jobDescription').value,
        budget: parseFloat(document.getElementById('budget').value.replace(/,/g, '')),
        location: document.getElementById('location').value,
        road: document.getElementById('road').value.trim(),
        building_name: document.getElementById('building_name').value.trim(),
        house_number: document.getElementById('house_number').value.trim(),
        duration: document.getElementById('duration').value,
        scheduled_date: document.getElementById('scheduled_date').value || null,
        scheduled_time: document.getElementById('scheduled_time').value || null

    };
    
    if (!jobData.scheduled_date || !jobData.scheduled_time) {
        alert("Please select a scheduled date and time");
        return;
    }

    const allFieldsFilled = Object.values(jobData).every(val => val && val.toString().trim() !== '');
    if (!allFieldsFilled) {
        alert('Please fill in all required fields');
        return;
    }

    submitBtn.disabled = true;
    loadingSpinner.style.display = 'inline-block';
    btnText.textContent = 'Processing...';

    try {
        const response = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(jobData)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Job post failed');
        }

        const postedJob = {
            id:data.job.job_id,
            skill_name: data.job.skill?.skill_name || data.job.skill_name || selectedOption.textContent,
            description: data.job.description,
            budget: data.job.budget,
            status: (data.job.status || 'unknown').toLowerCase(),
            datePosted: data.job.created_at,
            location: data.job.location,
            duration: data.job.duration,
            scheduledDate: data.job.scheduled_date,
            scheduledTime: data.job.scheduled_time,
            assignedWorker: data.job.worker_name || "Not assigned yet",
            assignedWorkerId: data.job.worker_id || null,
            worker_completion_confirmed: false,
            workerRating: 0,
            workerFeedback: ""
        };

        localStorage.setItem('lastPostedJobData', JSON.stringify(postedJob));

        successMessage.style.display = 'block';
        setTimeout(() => {
            window.location.href = 'viewWorkers.html';
        }, 2000);

    } catch (err) {
        alert('Error: ' + err.message);
        console.error(err);
    } finally {
        submitBtn.disabled = false;
        btnText.textContent = 'Find Workers';
        loadingSpinner.style.display = 'none';
    }
});

// Budget input formatting
document.getElementById('budget').addEventListener('input', function (e) {
    let value = e.target.value.replace(/,/g, '');
    if (value) {
        const parsed = parseInt(value, 10);
        if (!Number.isNaN(parsed)) {
            e.target.value = parsed.toLocaleString();
        }
    }
});

// Character counter for description
const descriptionField = document.getElementById('jobDescription');
const maxLength = 500;

descriptionField.addEventListener('input', function (e) {
    const remaining = maxLength - e.target.value.length;
    let counter = document.getElementById('charCounter');

    if (!counter) {
        counter = document.createElement('div');
        counter.id = 'charCounter';
        counter.style.cssText = 'font-size: 0.875rem; color: #6b7280; text-align: right; margin-top: 0.5rem;';
        e.target.parentNode.appendChild(counter);
    }

    counter.textContent = `${remaining} characters remaining`;
    counter.style.color = remaining < 50 ? '#dc2626' : '#6b7280';
});
