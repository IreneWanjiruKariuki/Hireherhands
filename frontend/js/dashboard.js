function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}
function updateWelcomeMessage() {
    const user = getCurrentUser();
    const welcomeElement = document.getElementById('welcomeMessage');
            
    if (user && user.name) {
        welcomeElement.textContent = `Welcome , ${user.name}!`;
    } else {
        const defaultUser = {
            id: 'default-user',
            name: 'Default',
            email: 'Default@text.com'
        };
        localStorage.setItem('currentUser', JSON.stringify(defaultUser));
        welcomeElement.textContent = `Welcome back, ${defaultUser.name}!`;
    }
}