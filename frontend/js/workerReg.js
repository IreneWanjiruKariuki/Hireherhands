/*let skills = [];

function addSkill() {
    const skillInput = document.getElementById('skillInput');
    const skill = skillInput.value.trim();
    
    if (skill && !skills.includes(skill)) {
        skills.push(skill);
        updateSkillsDisplay();
        skillInput.value = '';
        clearError('skillsError');
    }
}

function updateSkillsDisplay() {
    const container = document.getElementById('skillsContainer');
    container.innerHTML = '';
    
    skills.forEach((skill, index) => {
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            ${skill}
            <button type="button" class="remove-skill" onclick="removeSkill(${index})">×</button>
        `;
        container.appendChild(skillTag);
    });
}

function removeSkill(index) {
    skills.splice(index, 1);
    updateSkillsDisplay();
}
document.getElementById('skillInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addSkill();
    }
});

function handleFileUpload(input, infoId) {
    const file = input.files[0];
    const infoDiv = document.getElementById(infoId);
    
    if (file) {
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        if (fileSize > 5) {
            alert('File size must be less than 5MB');
            input.value = '';
            infoDiv.style.display = 'none';
            return;
        }
        
        infoDiv.innerHTML = `
            <strong>Selected file:</strong> ${file.name}<br>
            <strong>Size:</strong> ${fileSize} MB<br>
            <strong>Type:</strong> ${file.type}
        `;
        infoDiv.style.display = 'block';
    } else {
        infoDiv.style.display = 'none';
    }
}
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-$$$$]{7,15}$/;
    return re.test(phone.trim());
}

function validateURL(url) {
    if (!url) return true; // Optional field
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function showError(fieldId, message) {
    const errorDiv = document.getElementById(fieldId + 'Error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '#e53e3e';
    }
}

function clearError(fieldId) {
    const errorDiv = document.getElementById(fieldId);
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
    const field = document.getElementById(fieldId.replace('Error', ''));
    if (field) {
        field.style.borderColor = '#e8f5e8';
    }
}

//Form validation
function validateForm() {
    let isValid = true;
    
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });
    document.querySelectorAll('input, textarea, select').forEach(field => {
        field.style.borderColor = '#e8f5e8';
    });

    const fullName = document.getElementById('fullName').value.trim();
    if (!fullName) {
        showError('fullName', 'Full name is required');
        isValid = false;
    } else if (fullName.length < 2) {
        showError('fullName', 'Full name must be at least 2 characters');
        isValid = false;
    }

    const email = document.getElementById('email').value.trim();
    if (!email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    const phone = document.getElementById('phone').value.trim();
    if (!phone) {
        showError('phone', 'Phone number is required');
        isValid = false;
    } else if (!validatePhone(phone)) {
        showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }

    const location = document.getElementById('location').value.trim();
    if (!location) {
        showError('location', 'Location is required');
        isValid = false;
    }

    if (skills.length === 0) {
        showError('skills', 'Please add at least one skill');
        isValid = false;
    }

    const portfolio = document.getElementById('portfolio').value.trim();
    if (portfolio && !validateURL(portfolio)) {
        showError('portfolio', 'Please enter a valid URL');
        isValid = false;
    }

    return isValid;
}   

//Form submission handler
document.getElementById('applicationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    // loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('submitBtn').disabled = true;

    const formData = new FormData(this);
    const countryCode = document.getElementById('countryCode').value;
    const phoneNumber = document.getElementById('phone').value;
    const fullPhoneNumber = countryCode + ' ' + phoneNumber;

    console.log('Form submitted with data:', {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: fullPhoneNumber,
        location: formData.get('location'),
        skills: skills,
        portfolio: formData.get('portfolio')
    });

    // Simulate form submission
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('submitBtn').disabled = false;

        document.getElementById('successMessage').style.display = 'block';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });

        document.getElementById('applicationForm').reset();
        skills = [];
        updateSkillsDisplay();
        document.querySelectorAll('.file-info').forEach(info => {
            info.style.display = 'none';
        });

        setTimeout(() => {
            document.getElementById('successMessage').style.display = 'none';
        }, 5000);

    }, 2000);
});
document.getElementById('fullName').addEventListener('blur', function() {
    const value = this.value.trim();
    if (value && value.length >= 2) {
        clearError('fullNameError');
    }
});
document.getElementById('email').addEventListener('blur', function() {
    const value = this.value.trim();
    if (value && validateEmail(value)) {
        clearError('emailError');
    }
});
document.getElementById('phone').addEventListener('blur', function() {
    const value = this.value.trim();
    if (value && validatePhone(value)) {
        clearError('phoneError');
    }
});
document.getElementById('location').addEventListener('blur', function() {
    const value = this.value.trim();
    if (value) {
        clearError('locationError');
    }
});
document.getElementById('portfolio').addEventListener('blur', function() {
    const value = this.value.trim();
    if (!value || validateURL(value)) {
        clearError('portfolioError');
    }
}); */
const BASE_URL = 'http://127.0.0.1:5000';
let selectedSkills = [];

// Fetch skills from API and display as checkboxes
async function loadSkills() {
    try {
        const response = await fetch(`${BASE_URL}/skills`);
        const data = await response.json();

        const container = document.getElementById('skillsContainer');
        container.innerHTML = '';

        data.skills.forEach(skill => {
            const label = document.createElement('label');
            label.classList.add('skill-option');
            label.innerHTML = `
                <input type="checkbox" value="${skill.skill_id}" onchange="toggleSkill(${skill.skill_id})">
                ${skill.skill_name}
            `;
            container.appendChild(label);
        });
    } catch (error) {
        console.error("Failed to load skills:", error);
    }
}

// Handle skill selection
function toggleSkill(id) {
    if (selectedSkills.includes(id)) {
        selectedSkills = selectedSkills.filter(s => s !== id);
    } else {
        selectedSkills.push(id);
    }
}

// Main form logic
document.addEventListener('DOMContentLoaded', () => {
    loadSkills();

    const form = document.getElementById('applicationForm');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const bio = "Submitted via form"; // Optional: pull from a <textarea id="bio">
        const location = document.getElementById('location').value.trim();
        const rate = parseFloat(document.getElementById('hourlyRate')?.value || 0);
        const token = localStorage.getItem('access_token');

        if (!token) {
            alert("You must be logged in to apply as a worker.");
            return;
        }

        if (!location || selectedSkills.length === 0) {
            alert("Please fill all required fields and select at least one skill.");
            return;
        }

        try {
            document.getElementById('loading').style.display = 'block';
            document.getElementById('submitBtn').disabled = true;

            // Register worker with attached skills
            const res = await fetch(`${BASE_URL}/worker/register`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bio: bio,
                    location: location,
                    hourly_rate: rate,
                    skills: selectedSkills
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to register as worker');

            alert('Your application was submitted. An admin will review and approve your profile. You will be notified once approved.');
            form.reset();
            selectedSkills = [];
            loadSkills();
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('submitBtn').disabled = false;
        }
    });
});
