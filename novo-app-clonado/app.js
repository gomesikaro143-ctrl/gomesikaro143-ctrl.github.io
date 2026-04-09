// Estado Global Inicial
const DEFAULT_STATE = {
    user: {
        name: "Guerreira",
        progress: 0,
        currentDay: 1,
        weightLost: 0,
        daysLeft: 29
    },
    activeTab: 'home'
};

let state = { ...DEFAULT_STATE };

// Elementos da DOM
const appMain = document.getElementById('app-main');
const navItems = document.querySelectorAll('.nav-item');

// Navegação Principal
function renderView(viewName) {
    state.activeTab = viewName;
    
    // Atualiza botão ativo na navegação inferior dinamicamente
    const currentNavItems = document.querySelectorAll('.nav-item');
    currentNavItems.forEach(item => {
        if (item.dataset.tab === viewName) item.classList.add('active');
        else item.classList.remove('active');
    });

    // Renderiza o conteúdo da aba
    switch(viewName) {
        case 'home': renderHome(); break;
        case 'content': renderContent(); break;
        case 'tools': renderTools(); break;
        case 'progress': renderProgress(); break;
        case 'profile': renderProfile(); break;
        default: renderHome();
    }
    
    // Atualiza ícones do Lucide
    if (window.lucide) lucide.createIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------
// PÁGINA INICIAL (Mounjaro Clone Idêntico)
// ----------------------------------------------------
function renderHome() {
    appMain.innerHTML = `
        <div class="view-animate">
            
            <!-- Botões Principais -->
            <button class="btn-menu btn-yellow" onclick="renderView('content')">
                <i data-lucide="book-open" style="width: 18px; height: 18px;"></i>
                ACESSAR RECEITAS COMPLETAS
            </button>
            <button class="btn-menu btn-yellow" onclick="renderView('content')">
                <i data-lucide="file-text" style="width: 18px; height: 18px;"></i>
                ACESSAR INSTRUÇÕES
            </button>
            <button class="btn-menu btn-gradient">
                <i data-lucide="crown" style="width: 18px; height: 18px;"></i>
                CONHECER ACOMPANHAMENTO EXCLUSIVO
            </button>
            <button class="btn-menu btn-pink">
                <i data-lucide="shield" style="width: 18px; height: 18px;"></i>
                CONHECER PROGRAMA ANTI FLACIDEZ
            </button>

            <!-- Círculo de Progresso -->
            <div class="progress-circle-container">
                <div class="progress-circle">
                    <span class="circle-title">Dia 1</span>
                    <span class="circle-subtitle">de 30</span>
                </div>
            </div>

            <!-- Cards de Status -->
            <div class="status-grid">
                <div class="status-card">
                    <i data-lucide="flame" style="color: var(--btn-pink); width: 24px; height: 24px;"></i>
                    <span class="status-value">-0kg</span>
                    <span class="status-label">Peso perdido</span>
                </div>
                <div class="status-card">
                    <i data-lucide="calendar" style="color: var(--btn-yellow); width: 24px; height: 24px;"></i>
                    <span class="status-value">29</span>
                    <span class="status-label">Dias restantes</span>
                </div>
            </div>

        </div>
    `;
}

// ----------------------------------------------------
// ABA DE CONTEÚDO (RECEITAS)
// ----------------------------------------------------
function renderContent() {
    appMain.innerHTML = `
        <div class="view-animate" style="min-height: 80vh; display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <i data-lucide="utensils-crossed" style="width: 60px; height: 60px; color: var(--text-muted); opacity: 0.5; margin-bottom: 20px;"></i>
            <h3 style="color: var(--btn-yellow); text-align: center; margin-bottom: 10px;">Receitas (Extratadas)</h3>
            <p style="color: var(--text-muted); text-align: center; font-size: 0.9rem;">
                A base de dados será injetada aqui.
            </p>
        </div>
    `;
}

// ----------------------------------------------------
// ABAS PLACEHOLDERS
// ----------------------------------------------------
function renderProgress() {
    appMain.innerHTML = `<div class="view-animate"><div class="status-card" style="margin-top: 50px;"><p class="text-center text-muted">Progresso em construção.</p></div></div>`;
}

function renderTools() {
    appMain.innerHTML = `<div class="view-animate"><div class="status-card" style="margin-top: 50px;"><p class="text-center text-muted">Nutri em construção.</p></div></div>`;
}

function renderProfile() {
    appMain.innerHTML = `<div class="view-animate"><div class="status-card" style="margin-top: 50px;"><p class="text-center text-muted">Perfil em construção.</p></div></div>`;
}


// Lógica da Roleta / Modal de Prêmio
function handlePrizeModal() {
    const modal = document.getElementById('prize-modal');
    const closeBtn = document.getElementById('close-modal');
    const prizeText = document.getElementById('prize-text-area');
    const prizeIcon = document.getElementById('prize-icon');

    // Verifica localstorage pra não irritar o usuario toda vez (Mas pra efeito clone, vai mostrar na primeira)
    if (!localStorage.getItem('prize_shown_v1')) {
        setTimeout(() => {
            modal.classList.add('show');
            
            // Depois que a animação da roleta terminar (2.5s), mostra o texto do prêmio
            setTimeout(() => {
                prizeText.style.display = 'block';
                // Efeito sonoro mágico ou vibração pode ser acionado aqui (Opcional)
                if(navigator.vibrate) navigator.vibrate([100, 50, 100]);
            }, 2500);

            localStorage.setItem('prize_shown_v1', 'true');
        }, 800); // Mostra 800ms após entrar no app
    }

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });
}

// Controle do Modal de Instruções
window.closeInstructionsModal = function() {
    document.getElementById('instructions-modal').classList.remove('show');
    // Dispara a roleta só depos que fecharem os avisos de instrucao obrigatória
    handlePrizeModal();
};

window.goToInstructions = function() {
    document.getElementById('instructions-modal').classList.remove('show');
    renderView('content'); // leva para alguma tela que tiver as instruções
};


// Configuração do Splash Screen de Entrada Automática
function initSplashScreen() {
    const splash = document.getElementById('splash-screen');
    const appContainer = document.getElementById('app-container');
    const instModal = document.getElementById('instructions-modal');

    // Aguarda barra de progresso (2.5s) e entra
    setTimeout(() => {
        // Efeito de saída (fade out & zoom in leve)
        splash.style.opacity = '0';
        splash.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            splash.style.display = 'none';
            // Revela o App 
            appContainer.style.visibility = 'visible';
            appContainer.style.opacity = '1';
            appContainer.style.filter = 'blur(0px)';
            
            // Força a exibição do popup de "Leia as Instruções" idêntico ao site original
            setTimeout(() => {
                instModal.classList.add('show');
            }, 600); // delay de segurança para animação principal terminar
            
        }, 800);
    }, 2800); // 2.5s loading + 300ms suspance
}

// Ação ao aceitar o prêmio
window.claimPrize = function() {
    document.getElementById('prize-modal').classList.remove('show');
    // Navegar para o checkout ou página de bônus, conforme o site original faz.
    // Opcional: alert("Prêmio resgatado! Você ganhou 90% OFF");
    renderView('content');
};

// Event Listeners Iniciais
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    
    // Inicializa a Tela de Entrada
    initSplashScreen();
    
    // O modal do premio agora só é chamado DEPOIS de clicar no botão "Entrar" no splash.
    // (removido daqui para não tocar antes do tempo)
    
    // Carrega a tela inicial
    renderView('home');
    
    // Configura cliques da navegação
    navItems.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = btn.dataset.tab || btn.closest('.nav-item').dataset.tab;
            if(tab) renderView(tab);
        });
        btn.addEventListener('touchstart', (e) => {
            const tab = btn.dataset.tab || btn.closest('.nav-item').dataset.tab;
            if(tab) renderView(tab);
        }, {passive: true});
    });
});
