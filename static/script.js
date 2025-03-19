window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;

    // Add class to BODY element directly
    document.body.classList.add('page-loaded');
    document.querySelectorAll('store-page').forEach(store => {
        store.classList.add('loaded');
        store.loadProducts();
    });
    
    // Start fade-out animation
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
});