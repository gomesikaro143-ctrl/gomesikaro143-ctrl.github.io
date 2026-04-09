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

            <!-- Novas Seções (Receita, Dica, Hidratação) -->
            <div class="daily-sections" style="margin-top: 25px; display: flex; flex-direction: column; gap: 15px;">
                
                <!-- Receita do Dia -->
                <div class="recipe-card" style="background: linear-gradient(135deg, rgba(219, 39, 119, 0.2), var(--card-bg)); border: 1px solid rgba(219, 39, 119, 0.3); border-radius: 16px; padding: 20px; position: relative; overflow: hidden; cursor: pointer;" onclick="renderView('content')">
                    <div style="position: absolute; top: -10px; right: -10px; font-size: 5rem; opacity: 0.1;">🍮</div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <i data-lucide="star" style="color: var(--btn-yellow); width: 16px; height: 16px;"></i>
                        <span style="color: var(--btn-yellow); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em;">RECEITA DO DIA</span>
                    </div>
                    <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 5px; font-family: 'Outfit', sans-serif;">Gelatina de Morango</h3>
                    <div style="display: flex; align-items: center; gap: 5px; color: var(--text-muted); font-size: 0.85rem;">
                        <i data-lucide="clock" style="width: 14px; height: 14px;"></i> 15 min de preparo
                    </div>
                </div>

                <!-- Dica do Protocolo -->
                <div class="tip-card" style="background: var(--card-bg); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <i data-lucide="lightbulb" style="color: #a855f7; width: 18px; height: 18px;"></i>
                        <span style="color: #a855f7; font-size: 0.85rem; font-weight: 700;">DICA DO PROTOCOLO</span>
                    </div>
                    <p style="color: var(--text-main); font-size: 0.95rem; font-style: italic; line-height: 1.5; opacity: 0.9;">"Beba 1 copo de água 30 minutos antes do almoço para potencializar os efeitos da gelatina e aumentar a saciedade."</p>
                </div>

                <!-- Hidratação -->
                <div class="hydration-card" style="background: var(--card-bg); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 16px; padding: 20px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="droplet" style="color: #38bdf8; width: 18px; height: 18px;"></i>
                            <span style="color: white; font-weight: 700; font-size: 1rem;">Hidratação Diária</span>
                        </div>
                        <span style="color: #38bdf8; font-weight: 700; font-size: 0.9rem;">0 / 8 copos</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; cursor: pointer;">
                        <!-- Gotas de Água Placeholder -->
                        ${[1,2,3,4,5,6,7,8].map(i => `
                            <div style="width: 35px; height: 45px; border-radius: 20px; border: 1px dashed rgba(56, 189, 248, 0.5); display: flex; align-items: center; justify-content: center; color: rgba(56, 189, 248, 0.5); font-size: 0.9rem; transition: background 0.3s; cursor: pointer;:hover{background:rgba(56,189,248,0.2)}">💧</div>
                        `).join('')}
                    </div>
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


// Lógica da Roleta Real e Sorteio
window.triggerRoulette = function() {
    const giftModal = document.getElementById('gift-offer-modal');
    const prizeModal = document.getElementById('prize-modal');

    // Esconde a oferta do presente central e abre o container da roleta
    if(giftModal) { giftModal.classList.remove('show'); }
    prizeModal.classList.add('show');
};

window.closeRoulette = function() {
    document.getElementById('prize-modal').classList.remove('show');
};

window.startWheelSpin = function() {
    const wheel = document.getElementById('wheel-board');
    const prizeText = document.getElementById('prize-text-area');
    const btnSpin = document.getElementById('btn-spin-wheel');
    const btnClaim = document.getElementById('btn-claim-spin');

    // Desativa botão para não clicar 2x
    btnSpin.style.pointerEvents = 'none';
    btnSpin.style.opacity = '0.5';

    // Roda a roleta!
    wheel.classList.add('spinning');
    
    // Aguarda terminar o giro (transição CSS dura 3.5s)
    setTimeout(() => {
        prizeText.style.display = 'block';
        btnSpin.style.display = 'none'; // Esconde botão de girar
        btnClaim.style.display = 'flex'; // Exibe o de resgatar
        
        if(navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }, 3600);
};

window.closeGiftOffer = function() {
    document.getElementById('gift-offer-modal').classList.remove('show');
};

// Ação ao aceitar o prêmio
window.claimPrize = function() {
    document.getElementById('prize-modal').classList.remove('show');
    renderView('content');
};

// Controle do Modal de Instruções
window.closeInstructionsModal = function() {
    document.getElementById('instructions-modal').classList.remove('show');
    // Em vez de estourar a roleta central, aciona o Modal do Presente
    setTimeout(() => {
        const giftModal = document.getElementById('gift-offer-modal');
        if(giftModal) { giftModal.classList.add('show'); }
    }, 800);
};

window.goToInstructions = function() {
    document.getElementById('instructions-modal').classList.remove('show');
    renderView('content'); // leva para alguma tela que tiver as instruções
    
    setTimeout(() => {
        const giftModal = document.getElementById('gift-offer-modal');
        if(giftModal) { giftModal.classList.add('show'); }
    }, 2000);
};

// Gerador de Estrelas no Fundo
function initParticles() {
    const bg = document.getElementById('particles-bg');
    if(!bg) return;
    for(let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        // Random propriedades
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 5;
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = x + 'vw';
        particle.style.top = y + 'vh';
        particle.style.setProperty('--duration', duration + 's');
        particle.style.animationDelay = delay + 's';
        
        bg.appendChild(particle);
    }
}


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


// Event Listeners Iniciais
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    
    // Inicia Particulas de Fundo Estrelado
    initParticles();
    
    // Inicializa a Tela de Entrada
    initSplashScreen();
    
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
