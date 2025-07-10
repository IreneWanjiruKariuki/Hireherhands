let modalRedirectUrl = null;

function showErrorModal(message, redirectUrl = null) {
  document.getElementById('errorModalMessage').textContent = message;
  document.getElementById('errorModal').style.display = 'flex';
  modalRedirectUrl = redirectUrl;
}

document.getElementById('closeModalBtn').addEventListener('click', () => {
  document.getElementById('errorModal').style.display = 'none';
  if (modalRedirectUrl) {
    window.location.href = modalRedirectUrl;
  }
});


