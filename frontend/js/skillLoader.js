const BASE_URL = 'http://127.0.0.1:5000';

async function loadSkillsToDropdown(dropdownId) {
    const token = localStorage.getItem('access_token');
    try {
        const res = await fetch(`${BASE_URL}/skills`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        const data = await res.json();

        const dropdown = document.getElementById(dropdownId);
        dropdown.innerHTML = ''; // Clear existing
        data.skills.forEach(skill => {
            const option = document.createElement('option');
            option.value = skill.skill_id;
            option.textContent = skill.skill_name;
            dropdown.appendChild(option);
        });
    } catch (err) {
        console.error('Failed to load skills into dropdown:', err);
    }
}

async function loadSkillsAsCheckboxes(containerId, toggleHandler) {
    try {
        const response = await fetch(`${BASE_URL}/skills`);
        const data = await response.json();

        const container = document.getElementById(containerId);
        container.innerHTML = '';

        data.skills.forEach(skill => {
            const label = document.createElement('label');
            label.classList.add('skill-option');
            label.innerHTML = `
                <input type="checkbox" value="${skill.skill_id}" onchange="${toggleHandler.name}(${skill.skill_id})">
                ${skill.skill_name}
            `;
            container.appendChild(label);
        });
    } catch (error) {
        console.error("Failed to load skills as checkboxes:", error);
    }
}
