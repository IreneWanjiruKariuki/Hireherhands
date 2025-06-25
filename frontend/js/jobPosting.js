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


// Load job skills into dropdown
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
}

document.addEventListener('DOMContentLoaded', () => {
    loadSkillsToDropdown('jobCategory');
});

document.getElementById('jobPostingForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const btnText = document.getElementById('btnText');
    const successMessage = document.getElementById('successMessage');

    const formData = new FormData(this);
    const skillId = parseInt(formData.get('jobCategory'));
    const selectedOption = document.querySelector(`#jobCategory option[value="${skillId}"]`);

    if (!selectedOption) {
        alert('Invalid job category selected.');
        return;
    }

    const rawBudget = formData.get('budget').replace(/,/g, '');
    const parsedBudget = parseInt(rawBudget, 10);
    if (Number.isNaN(parsedBudget) || parsedBudget < 100) {
        alert('Please enter a valid budget (min 100).');
        return;
    }

    const jobData = {
        skill_id: skillId,
        category: selectedOption.textContent.toLowerCase(),
        description: formData.get('jobDescription'),
        location: formData.get('location'),
        duration: formData.get('duration'),
        budget: parsedBudget,
        scheduled_date: formData.get('scheduled_date'),
        scheduled_time: formData.get('scheduled_time')
    };

    // Ensure all fields are filled
    const allFieldsFilled = Object.values(jobData).every(val => val && val.toString().trim() !== '');
    if (!allFieldsFilled) {
        alert('Please fill in all required fields');
        return;
    }

    const token = localStorage.getItem('access_token');
    if (isTokenExpired(token)) {
        alert('Session expired. Please log in again.');
        window.location.href = 'login.html';  // or whatever your login page is
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
            console.error('Job post failed response:', data); // ← debug
            throw new Error(data.message || JSON.stringify(data) || 'Job post failed');
        }


        console.log("Job posted successfully:", data);
        console.log("Redirecting to viewWorkers.html...");

        localStorage.setItem('currentJobPosting', JSON.stringify(jobData));
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

// Budget input formatting (e.g. 1,000 instead of 1000)
document.getElementById('budget').addEventListener('input', function (e) {
    let value = e.target.value.replace(/,/g, '');
    if (value) {
        const parsed = parseInt(value, 10);
        if (!Number.isNaN(parsed)) {
            e.target.value = parsed.toLocaleString();
        }
    }
});

// Character counter for job description
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
