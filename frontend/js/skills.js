const BASE_URL = 'http://127.0.0.1:5000';
let selectedSkillId = null;
let allSkills = [];
let currentSkillWorkers = [];

document.addEventListener("DOMContentLoaded", () => {
    loadAllSkills();
    document.getElementById("addSkillForm").addEventListener("submit", handleAddSkill);
    document.getElementById("searchInput").addEventListener("input", handleSearchInput);
});

async function loadAllSkills() {
    try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${BASE_URL}/admin/skills`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load skills");

        allSkills = data.skills;
        renderSkills(allSkills);
    } catch (err) {
        console.error("Error loading skills:", err);
    }
}

function renderSkills(skills) {
    const list = document.getElementById("skillsList");
    list.innerHTML = "";
    skills.forEach(skill => {
        const li = document.createElement("li");
        li.className = "skill-item";
        li.innerHTML = `
            <strong>${skill.skill_name.toUpperCase()}</strong>
            <span class="badge ${skill.is_active ? 'active' : 'inactive'}">
                ${skill.is_active ? 'Active' : 'Inactive'}
            </span>
            <button onclick="toggleSkillStatus(${skill.skill_id})">Toggle</button>
            <button onclick="loadSkillDetails(${skill.skill_id})">View</button>
        `;
        list.appendChild(li);
    });
}

function handleSearchInput() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = allSkills.filter(skill =>
        skill.skill_name.toUpperCase().includes(query)
    );
    renderSkills(filtered);
}

async function toggleSkillStatus(skillId) {
    const confirmAction = confirm("Are you sure you want to toggle this skill's status?");
    if (!confirmAction) return;

    try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${BASE_URL}/admin/skills/${skillId}/toggle-status`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Toggle failed");

        alert(data.message);
        await loadAllSkills();
    } catch (err) {
        console.error("Toggle error:", err);
        alert("Failed to toggle skill.");
    }
}

async function loadSkillDetails(skillId) {
    selectedSkillId = skillId;
    document.getElementById("skillDetailsSection").style.display = "block";
    await loadWorkersForSkill(skillId);
    await loadJobsForSkill(skillId);
}

async function loadWorkersForSkill(skillId) {
    try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${BASE_URL}/admin/skills/${skillId}/workers`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load workers");

        currentSkillWorkers = data.workers;

        const container = document.getElementById("skillWorkers");
        container.innerHTML = `<h3>Workers with this skill</h3>`;

        if (!data.workers.length) {
            container.innerHTML += `<p>No workers found for this skill.</p>`;
            return;
        }

        // Search bar for filtering workers
        container.innerHTML += `
            <input type="text" id="workerSearch" placeholder="Search workers..." />
            <ul id="workerList"></ul>
        `;

        document.getElementById("workerSearch").addEventListener("input", filterWorkerList);
        renderWorkerList(currentSkillWorkers);
    } catch (err) {
        console.error("Worker fetch error:", err);
    }
}

function renderWorkerList(workers) {
    const list = document.getElementById("workerList");
    list.innerHTML = "";
    workers.forEach(w => {
        const li = document.createElement("li");
        li.innerHTML = `${w.fullname} (${w.email}, ${w.phone})`;
        list.appendChild(li);
    });
}

function filterWorkerList() {
    const query = document.getElementById("workerSearch").value.toLowerCase();
    const filtered = currentSkillWorkers.filter(w =>
        w.fullname.toLowerCase().includes(query) ||
        w.email.toLowerCase().includes(query) ||
        w.phone.includes(query)
    );
    renderWorkerList(filtered);
}

async function loadJobsForSkill(skillId) {
    try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${BASE_URL}/admin/skills/${skillId}/jobs`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load jobs");

        const container = document.getElementById("skillJobs");
        container.innerHTML = `<h3>Jobs for this skill</h3>`;
        if (!data.jobs.length) {
            container.innerHTML += `<p>No jobs found for this skill.</p>`;
            return;
        }

        const list = document.createElement("ul");
        data.jobs.forEach(j => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${j.description}</strong> (${j.status})<br>
                Budget: ${j.budget} | Client: ${j.client_name || 'N/A'} | Worker: ${j.worker_name || 'Unassigned'}
            `;
            list.appendChild(li);
        });
        container.appendChild(list);
    } catch (err) {
        console.error("Job fetch error:", err);
    }
}

async function handleAddSkill(e) {
    e.preventDefault();
    const name = document.getElementById("skillName").value.trim();
    if (!name) return alert("Skill name is required.");

    try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${BASE_URL}/admin/skills`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add skill");

        alert("Skill added.");
        document.getElementById("skillName").value = "";
        await loadAllSkills();
    } catch (err) {
        console.error("Add skill error:", err);
        alert("Failed to add skill.");
    }
}
