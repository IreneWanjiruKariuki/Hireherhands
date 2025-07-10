const BASE_URL = 'http://127.0.0.1:5000';
const token = localStorage.getItem('access_token');
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const statusMessage = document.getElementById('statusMessage');

function populateProfileFields() {
    if (currentUser) {
        nameInput.value = currentUser.fullname || '';
        emailInput.value = currentUser.email || '';
        phoneInput.value = currentUser.phone || '';
    }
}

async function fetchLatestProfile() {
    try {
        const res = await fetch(`${BASE_URL}/client/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();
        if (res.ok) {
            nameInput.value = data.fullname;
            emailInput.value = data.email;
            phoneInput.value = data.phone;
            localStorage.setItem('currentUser', JSON.stringify(data));
        } else {
            throw new Error(data.error || 'Could not fetch profile');
        }
    } catch (err) {
        console.error(err);
        statusMessage.textContent = err.message;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateProfileFields();
    fetchLatestProfile();

    document.getElementById('editBtn').addEventListener('click', () => {
        nameInput.disabled = false;
        emailInput.disabled = false;
        phoneInput.disabled = false;
        document.getElementById('saveBtn').style.display = 'inline-block';
        document.getElementById('cancelBtn').style.display = 'inline-block';
        document.getElementById('editBtn').style.display = 'none';
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        populateProfileFields();
        nameInput.disabled = true;
        emailInput.disabled = true;
        phoneInput.disabled = true;
        document.getElementById('saveBtn').style.display = 'none';
        document.getElementById('cancelBtn').style.display = 'none';
        document.getElementById('editBtn').style.display = 'inline-block';
    });

    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const updatedData = {
            fullname: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim()
        };

        try {
            const res = await fetch(`${BASE_URL}/client/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Update failed');

            localStorage.setItem('currentUser', JSON.stringify(updatedData));
            statusMessage.textContent = "Profile updated successfully!";
            statusMessage.style.color = 'green';

            nameInput.disabled = true;
            emailInput.disabled = true;
            phoneInput.disabled = true;
            document.getElementById('saveBtn').style.display = 'none';
            document.getElementById('cancelBtn').style.display = 'none';
            document.getElementById('editBtn').style.display = 'inline-block';
        } catch (err) {
            console.error(err);
            statusMessage.textContent = err.message;
            statusMessage.style.color = 'red';
        }
    });

    document.getElementById('deleteAccountBtn').addEventListener('click', async () => {
        const confirmDelete = confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${BASE_URL}/client/profile`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message || 'Failed to delete account');

            alert("Your account has been deleted.");
            localStorage.clear();
            window.location.href = 'login.html';
        } catch (err) {
            console.error(err);
            statusMessage.textContent = err.message;
            statusMessage.classList.remove('success');
            statusMessage.classList.add('error');
            statusMessage.style.display = 'block';
        }
    });
});



