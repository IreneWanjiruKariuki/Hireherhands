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