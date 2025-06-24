document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('access_token');
  fetch(`${BASE_URL}/skills`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .then(res => res.json())
  .then(data => {
    const dropdown = document.getElementById('jobCategory');
    data.skills.forEach(skill => {
      const option = document.createElement('option');
      option.value = skill.skill_id; // now value = ID
      option.textContent = skill.skill_name;
      dropdown.appendChild(option);
    });
  });
});

document.getElementById('jobPostingForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const btnText = document.getElementById('btnText');
    const successMessage = document.getElementById('successMessage');

    const formData = new FormData(this);
    const jobData = {
        skill_id: parseInt(formData.get('jobCategory')),
        description: formData.get('jobDescription'),
        location: formData.get('location'),
        budget: formData.get('budget'),
        scheduled_date: formData.get('scheduled_date'),
        scheduled_time: formData.get('scheduled_time')
    };

    if (!jobData.skill_id || !jobData.description || !jobData.location || 
        !jobData.budget || !jobData.scheduled_date || !jobData.scheduled_time) {
        alert('Please fill in all required fields');
        return;
    }

    const token = localStorage.getItem('access_token');

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

        successMessage.style.display = 'block';

        setTimeout(() => {
            localStorage.setItem('currentJobPosting', JSON.stringify(jobData));
            successMessage.style.display = 'block';
            setTimeout(() => {
                window.location.href = 'viewWorkers.html';
            }, 1500);
        }, 2000);
    } catch (err) {
        alert('Error: ' + err.message);
    } finally {
        submitBtn.disabled = false;
        btnText.textContent = 'Find Workers';
        loadingSpinner.style.display = 'none';
    }
});


// formatting for budget
document.getElementById('budget').addEventListener('input', function(e) {
    let value = e.target.value.replace(/,/g, '');
    if (value) {
        e.target.value = parseInt(value).toLocaleString();
    }
});

// character counter
const descriptionField = document.getElementById('jobDescription');
const maxLength = 500;
        
descriptionField.addEventListener('input', function(e) {
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

