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
