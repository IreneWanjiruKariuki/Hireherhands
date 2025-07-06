const BASE_URL = 'http://127.0.0.1:5000';
let selectedSkills = [];

// ========== Skill Logic ==========
async function loadSkillsAsCheckboxes(containerId, toggleHandler) {
    try {
        const response = await fetch(`${BASE_URL}/skills`);
        if (!response.ok) throw new Error("Skills fetch failed");

        const data = await response.json();
        if (!Array.isArray(data.skills)) throw new Error("Malformed skills data");

        const container = document.getElementById(containerId);
        container.innerHTML = '';

        data.skills.forEach(skill => {
            const label = document.createElement('label');
            label.classList.add('skill-option');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = skill.skill_id;

            checkbox.addEventListener('change', function () {
                const id = parseInt(this.value);
                if (this.checked) {
                    if (!selectedSkills.includes(id)) selectedSkills.push(id);
                } else {
                    selectedSkills = selectedSkills.filter(s => s !== id);
                }

                console.log('Selected skills:', selectedSkills); 
            });

            label.appendChild(checkbox);
            label.append(` ${skill.skill_name}`);
            container.appendChild(label);
        });
    } catch (error) {
        console.error("Failed to load skills:", error);
    }
}


function toggleSkill(id) {
    if (selectedSkills.includes(id)) {
        selectedSkills = selectedSkills.filter(s => s !== id);
    } else {
        selectedSkills.push(id);
    }
}

async function prefillClientInfo() {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
        const res = await fetch(`${BASE_URL}/client/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load client info");

        // Match your HTML field IDs here
        document.getElementById('fullName').value = data.fullname || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('phone').value = data.phone?.replace(/^\+254/, '') || '';

        document.getElementById('fullName').readOnly = true;
        document.getElementById('email').readOnly = true;
        document.getElementById('phone').readOnly = true;

        localStorage.setItem('currentUser', JSON.stringify(data));
    } catch (err) {
        console.error("Autofill error:", err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    prefillClientInfo();
    loadSkillsAsCheckboxes('skillsContainer', toggleSkill);
    setupApplicationForm();
});



// ========== Form Handling ==========
function setupApplicationForm() {
    const form = document.getElementById('applicationForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const location = document.getElementById('location').value.trim();
        const idNumber = document.getElementById('id')?.value.trim();
        const rate = parseFloat(document.getElementById('hourlyRate')?.value || 0);
        const bio = document.getElementById('bio')?.value.trim();
        const token = localStorage.getItem('access_token');
        console.log("idNumber", idNumber);
        console.log("location", location);
        console.log("rate", rate);
        console.log("bio", bio);
        console.log("selectedSkills", selectedSkills);

        

        if (!token) {
            alert("You must be logged in to apply as a worker.");
            return;
        }

        if (!location || !bio || selectedSkills.length === 0) {
            alert("Please fill all required fields and select at least one skill.");
            return;
        }

        try {
            showLoading(true);

            const res = await fetch(`${BASE_URL}/worker/register`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bio,
                    location,
                    hourly_rate: rate,
                    id_number: idNumber,
                    skills: selectedSkills
                })
            });

            const data = await res.json();
            if (!res.ok) {
                if (data.error === "Worker already registered") {
                    alert("You have already submitted an application.");
                    return;
                }
                throw new Error(data.error || 'Failed to register as worker');
            }

            // Store application status in localStorage
            localStorage.setItem('worker_application_status', 'pending');

            alert('Application submitted. Await admin approval.');
            window.location.href = 'pending.html';
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            showLoading(false);
            selectedSkills = [];
            loadSkillsAsCheckboxes('skillsContainer', toggleSkill);
        }

    });
}

// ========== UI Helpers ==========
function showLoading(state) {
    document.getElementById('loading').style.display = state ? 'block' : 'none';
    document.getElementById('submitBtn').disabled = state;
}


