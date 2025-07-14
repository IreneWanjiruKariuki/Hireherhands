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
            label.append(` ${skill.skill_name.toUpperCase()}`);
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

        let data;
        try {
            data = await res.json();
        } catch (err) {
            console.error("Failed to parse JSON:", err);
            data = {};
        }

        if (!res.ok) throw new Error(data.error || "Failed to load client info");

        document.getElementById('fullName').value = data.fullname || '';
        document.getElementById('email').value = data.email || '';
        if (data.gender?.toLowerCase() !== "female") {
            showErrorModal("Only female clients can apply to be workers.");
            return;
        }

        document.getElementById('phone').value = data.phone?.replace(/^\+254/, '') || '';
        document.getElementById('fullName').readOnly = true;
        document.getElementById('email').readOnly = true;
        document.getElementById('phone').readOnly = true;

        localStorage.setItem('currentUser', JSON.stringify(data));
    } catch (err) {
        console.error("Autofill error:", err);
    }
}

// ========== Modals ==========
function showErrorModal(message) {
    document.getElementById('errorModalMessage').textContent = message;
    document.getElementById('errorModal').style.display = 'flex';
}

function showSuccessModal(message) {
    const modal = document.getElementById('errorModal');
    modal.querySelector('h2').textContent = 'Thank you';
    modal.querySelector('#errorModalMessage').textContent = message;
    modal.style.display = 'flex';
    document.getElementById('closeModalBtn').onclick = () => {
        modal.style.display = 'none';
        window.location.href = 'pending.html';
    };
}

document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.getElementById('errorModal').style.display = 'none';
    window.location.href = "dashboard.html";
});

// ========== DOM Ready ==========
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/client/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load client");

        // Optional block check — disabled by default
        // if (data.worker_id) {
        //     showErrorModal("You have already submitted a worker application.");
        //     return;
        // }

        prefillClientInfo();
        loadSkillsAsCheckboxes('skillsContainer', toggleSkill);
        setupApplicationForm();
    } catch (err) {
        console.error("Worker check failed:", err);
        showErrorModal("There was a problem verifying your application status.");
    }
});

// ========== File Upload ==========
document.getElementById('certificate').addEventListener('change', function () {
    const fileName = this.files[0] ? this.files[0].name : "Choose file";
    document.getElementById('certificateLabel').textContent = fileName;
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

            const formData = new FormData();
            formData.append('bio', bio);
            formData.append('id_number', idNumber);
            formData.append('location', location);
            formData.append('hourly_rate', rate);
            selectedSkills.forEach(skillId => formData.append('skills', skillId));

            const experience = document.getElementById('experience')?.value;
            if (experience) {
                formData.append('experience_years', experience);
            }

            const fileInput = document.getElementById('certificate');
            const maxSize = 5 * 1024 * 1024;
            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                if (file.size > maxSize) {
                    alert("Certificate file is too large. Max 5MB.");
                    showLoading(false);
                    return;
                }
                formData.append('certificate', file);
            }

            const res = await fetch(`${BASE_URL}/worker/register`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();
            if (!res.ok) {
                if (data.error === "Worker already registered") {
                    showSuccessModal("You’ve already applied. Your application is pending review.");
                    return;
                }
                throw new Error(data.error || 'Failed to register as worker');
            }

            localStorage.setItem('worker_application_status', 'pending');
            showSuccessModal("Your application has been sent to the admin. We’ll be in touch soon.");
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


