document.cookie = "cookieName=cookieValue; SameSite=None; Secure";

window.addEventListener('load', async () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
});