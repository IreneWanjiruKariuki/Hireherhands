document.getElementById('jobPostingForm').addEventListener('submit', function(e) {
    e.preventDefault();
            
    const submitBtn = document.getElementById('submitBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const btnText = document.getElementById('btnText');
    const successMessage = document.getElementById('successMessage');
            
    const formData = new FormData(this);
    const jobData = {
        category: formData.get('jobCategory'),
        description: formData.get('jobDescription'),
        location: formData.get('location'),
        duration: formData.get('duration'),
        budget: formData.get('budget')
    };
            
    if (!jobData.category || !jobData.description || !jobData.location || 
        !jobData.duration || !jobData.budget) {
        alert('Please fill in all required fields');
        return;
    }
            
    submitBtn.disabled = true;
    loadingSpinner.style.display = 'inline-block';
    btnText.textContent = 'Processing...';
            
    setTimeout(() => {
        localStorage.setItem('currentJobPosting', JSON.stringify(jobData));
        successMessage.style.display = 'block';
        setTimeout(() => {
            window.location.href = 'viewWorkers.html';
        }, 1500);
    }, 2000);
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