// modal.js
let modalRedirectUrl = null;

// Rename the function for more general use
function showMessageModal(message, type = 'error', redirectUrl = null) {
    const modal = document.getElementById('errorModal'); // Keep this ID for now, we'll just change content
    const messageElem = document.getElementById('errorModalMessage');
    const titleElem = modal.querySelector('h2'); // Select the h2 inside the modal
    const closeButton = document.getElementById('errorModalCloseBtn');

    if (modal && messageElem && titleElem && closeButton) {
        messageElem.textContent = message;
        modalRedirectUrl = redirectUrl;

        // Set title and potentially add a class for styling
        if (type === 'success') {
            titleElem.textContent = "Success!";
            // Add a class for success styling
            modal.classList.remove('error-modal');
            modal.classList.add('success-modal');
            closeButton.textContent = "OK"; // Or "Got It!"
        } else { // Default to error
            titleElem.textContent = "Error!";
            // Add a class for error styling
            modal.classList.remove('success-modal');
            modal.classList.add('error-modal');
            closeButton.textContent = "OK";
        }

        modal.style.display = 'flex';
        document.body.style.overflow = "hidden"; // Prevent background scrolling

        closeButton.onclick = () => {
            console.log("Modal button clicked!"); // For debugging
            modal.style.display = 'none';
            document.body.style.overflow = "auto"; // Re-enable background scrolling
            
            // Clean up classes
            modal.classList.remove('success-modal', 'error-modal');

            if (modalRedirectUrl) {
                window.location.href = modalRedirectUrl;
            }
            modalRedirectUrl = null; // Reset for next use
        };
    } else {
        console.error("Error: One or more modal elements for showMessageModal were not found.");
        alert(`${type.toUpperCase()}: ${message}`); // Fallback
    }
}

// Ensure the event listener from the previous fix is set up correctly in worker_dash.js
// OR if you are using the addEventListener approach from the previous solution, keep this:
document.getElementById('errorModalCloseBtn').addEventListener('click', () => {
    console.log("OK button clicked (via addEventListener)!"); // For debugging
    document.getElementById('errorModal').style.display = 'none';
    document.body.style.overflow = "auto"; // Re-enable background scrolling
    // Clean up classes on close if using this listener
    document.getElementById('errorModal').classList.remove('success-modal', 'error-modal');
    if (modalRedirectUrl) {
        window.location.href = modalRedirectUrl;
    }
    modalRedirectUrl = null;
});


