export function initLoader() {
    const loader = document.getElementById('global-loader');
    const progressBar = document.getElementById('loader-progress');
    const percentageText = document.getElementById('loader-percentage');

    // Si no hay loader (porque no se puso en el HTML), no hacemos nada
    if (!loader) return;

    // Verificar si ya visitamos la página en esta sesión
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (hasVisited) {
        // Si ya visitamos, ocultamos el loader INMEDIATAMENTE
        loader.style.display = 'none';
        return;
    }

    // Si es la primera vez, marcamos como visitado
    sessionStorage.setItem('hasVisited', 'true');

    // Simular progreso
    let progress = 0;
    const interval = setInterval(() => {
        const increment = Math.max(1, (100 - progress) / 20);
        progress = Math.min(progress + increment, 90);
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (percentageText) percentageText.innerText = `${Math.round(progress)}%`;
    }, 100);

    window.addEventListener('load', () => {
        clearInterval(interval);
        if (progressBar) progressBar.style.width = '100%';
        if (percentageText) percentageText.innerText = '100%';

        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 500);
    });
}