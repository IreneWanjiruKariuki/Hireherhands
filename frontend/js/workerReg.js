let skills = [];

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