document.addEventListener('DOMContentLoaded', () => {
    // === PWA Logic ===
    function checkPWA() {
        const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);
        if (isInStandaloneMode()) return;

        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIos = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);

        const prompt = document.getElementById('pwa-install-prompt');
        const instructions = document.getElementById('pwa-instructions');
        
        if (!prompt || !instructions) return;

        if (isIos) {
            instructions.innerHTML = 'Toque em <b>Compartilhar <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg></b> e depois em <b>"Adicionar à Tela de Início"</b>.';
            prompt.style.display = 'block';
            setTimeout(() => prompt.style.display = 'none', 15000);
        } else if (isAndroid) {
            instructions.innerHTML = 'Toque nos <b>3 pontinhos <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></b> e selecione <b>"Adicionar à tela inicial"</b>.';
            prompt.style.display = 'block';
            setTimeout(() => prompt.style.display = 'none', 15000);
        }
    }
    
    // Mostra o pop-up após 3 segundos
    setTimeout(checkPWA, 3000);
});
