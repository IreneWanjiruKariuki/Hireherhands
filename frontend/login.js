// Define the form and its elements
        const form = document.getElementById('loginForm');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const passwordToggle = document.getElementById('passwordToggle');
        const submitBtn = document.getElementById('submitBtn');
        const submitText = document.getElementById('submitText');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const roleSelect = document.getElementById('role');
        const roleError = document.getElementById('roleError');
        const emailSuccess = document.getElementById('emailSuccess');
        const roleSuccess = document.getElementById('roleSuccess');

        // Password visibility toggle
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
            // Remove any existing alerts
            const existingAlerts = document.querySelectorAll('.custom-alert');
            existingAlerts.forEach(alert => alert.remove());
            // Create alert elements
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

            // Add close functionality
            const closeBtn = alertEl.querySelector('.custom-alert-close');
            closeBtn.addEventListener('click', () => alertEl.remove());
            
            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                if (document.body.contains(alertEl)) {
                    alertEl.style.opacity = '0';
                    alertEl.style.transform = 'translate(-50%, -20px)';
                    alertEl.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
                    setTimeout(() => alertEl.remove(), 300);
                }
            }, 5000);
        }
        // Enhanced validation functions
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        function showSuccess(element, successElement, message) {
            element.classList.remove('error');
            element.classList.add('success');
            successElement.innerHTML = `
                <svg class="validation-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                ${message}
            `;
        }
        function showError(element, errorElement, message) {
            element.classList.remove('success');
            element.classList.add('error');
            errorElement.innerHTML = `
                <svg class="validation-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                ${message}`;
        }
        function clearValidation(element, errorElement, successElement) {
            element.classList.remove('error', 'success');
            errorElement.innerHTML = '';
            if (successElement) successElement.innerHTML = '';
        }

        // Real-time validation for email and role only
        emailInput.addEventListener('input', function() {
            clearValidation(emailInput, emailError, emailSuccess);
            
            if (this.value && validateEmail(this.value)) {
                showSuccess(emailInput, emailSuccess, 'Valid email address');
            }
        });

        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                showError(emailInput, emailError, 'Please enter a valid email address');
            }
        });
        // Clear error on password input
        passwordInput.addEventListener('input', function() {
            clearValidation(passwordInput, passwordError);
        });

        function validateForm() {
            let isValid = true;

            // Clear all previous validations
            clearValidation(emailInput, emailError, emailSuccess);
            clearValidation(roleSelect, roleError, roleSuccess);
            clearValidation(passwordInput, passwordError);

            // Email validation
            if (!emailInput.value.trim()) {
                showError(emailInput, emailError, 'Email is required');
                isValid = false;
            } else if (!validateEmail(emailInput.value)) {
                showError(emailInput, emailError, 'Please enter a valid email address');
                isValid = false;
            }
            // Basic password validation - just check if it's empty
            if (!passwordInput.value.trim()) {
                showError(passwordInput, passwordError, 'Password is required');
                isValid = false;
            }

            return isValid;
        }
        // Form submission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (!validateForm()) {
                return;
            }
            submitBtn.disabled = true;
            submitText.innerHTML = '<div class="loading"><div class="spinner"></div>Signing in...</div>';
        });


