document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const countryCodeSelect = document.getElementById('countryCode');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
            
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const passwordError = document.getElementById('passwordError');
            
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    // Password visibility
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
                
        const icon = type === 'password' 
        ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
        : '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
                
        passwordToggle.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icon}</svg>`;
    });

    // Show custom alert
    function showAlert(title, message, type = 'error') {
        const existingAlerts = document.querySelectorAll('.custom-alert');
        existingAlerts.forEach(alert => alert.remove());
        const alertEl = document.createElement('div');
        alertEl.className = `custom-alert ${type === 'success' ? 'success' : ''}`;

        const iconSvg = type === 'success' 
        ? '<svg class="custom-alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        : '<svg class="custom-alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
                
        alertEl.innerHTML = `
        ${iconSvg}
        <div class="custom-alert-content">
            <div class="custom-alert-title">${title}</div>
            <div class="custom-alert-message">${message}</div>
        </div>
        <button class="custom-alert-close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
        </button>
        `;

        document.body.appendChild(alertEl);
                
        const closeBtn = alertEl.querySelector('.custom-alert-close');
        closeBtn.addEventListener('click', () => alertEl.remove());
                
        setTimeout(() => {
            if (document.body.contains(alertEl)) {
                alertEl.style.opacity = '0';
                alertEl.style.transform = 'translate(-50%, -20px)';
                alertEl.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
                setTimeout(() => alertEl.remove(), 300);
            }
        }, 5000);
    }
    // Validation functions for email, phone, and password
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    function validatePhone(phone) {
        return phone.length >= 6 && /^[0-9\s\-\+$$$$]+$/.test(phone);
    }
    function checkPasswordStrength(password) {
                let strength = 0;
                let feedback = [];

                if (password.length >= 8) strength++;
                else feedback.push('at least 8 characters');

                if (/[a-z]/.test(password)) strength++;
                else feedback.push('lowercase letter');

                if (/[A-Z]/.test(password)) strength++;
                else feedback.push('uppercase letter');

                if (/[0-9]/.test(password)) strength++;
                else feedback.push('number');

                if (/[^a-zA-Z0-9]/.test(password)) strength++;
                else feedback.push('special character');

                return { strength, feedback };
            }
});