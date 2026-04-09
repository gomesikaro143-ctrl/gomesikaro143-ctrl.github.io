// Estado Global Inicial com Persistência Local
const STORAGE_KEYS = {
    NAME: 'gm_user_name',
    WEIGHT: 'gm_user_weight',
    AGE: 'gm_user_age',
    START_DATE: 'gm_user_start_date'
};

function getInitialState() {
    const name = localStorage.getItem(STORAGE_KEYS.NAME) || "Guerreira";
    const weight = localStorage.getItem(STORAGE_KEYS.WEIGHT) || "0kg";
    const age = localStorage.getItem(STORAGE_KEYS.AGE) || "";
    const startDateStr = localStorage.getItem(STORAGE_KEYS.START_DATE);
    
    let currentDay = 1;
    let daysLeft = 29;

    if (startDateStr) {
        const start = new Date(startDateStr);
        const now = new Date();
        const diffTime = Math.abs(now - start);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        currentDay = diffDays + 1;
        daysLeft = Math.max(0, 30 - currentDay);
    }

    return {
        user: {
            name: name,
            age: age,
            weight: weight,
            currentDay: Math.min(currentDay, 30),
            daysLeft: daysLeft,
            progress: Math.floor((currentDay / 30) * 100)
        },
        activeTab: 'home'
    };
}

let state = getInitialState();

// Elementos da DOM
const appMain = document.getElementById('app-main');
const navItems = document.querySelectorAll('.nav-item');

// Navegação Principal com Suporte ao Botão Voltar (History API)
function renderView(viewName, pushHistory = true) {
    state.activeTab = viewName;

    // Registra a rota no histórico nativo do celular
    if(pushHistory) {
        history.pushState({ tab: viewName }, '', `#${viewName}`);
    }
    
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
    
    // Atualiza o Header Dinamicamente
    updateHeader();

    // Atualiza ícones do Lucide
    if (window.lucide) lucide.createIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateHeader() {
    const greetingEl = document.querySelector('.header-content h1');
    if (greetingEl) {
        greetingEl.innerHTML = `${state.user.name}! 👋`;
    }
}

// ----------------------------------------------------
// PÁGINA INICIAL (Mounjaro Clone Idêntico)
// ----------------------------------------------------
function renderHome() {
    appMain.innerHTML = `
        <div class="view-animate">
            
            <!-- Botões Principais -->
            <button class="btn-menu btn-yellow" onclick="window.open('ebook_gelatina_mounjaro_final.pdf', '_blank')">
                <i data-lucide="book-open" style="width: 18px; height: 18px;"></i>
                ACESSAR RECEITAS COMPLETAS
            </button>
            <button class="btn-menu btn-yellow" onclick="window.open('https://protocolo-gelatina-app.vercel.app/obrigado.html', '_blank')">
                <i data-lucide="file-text" style="width: 18px; height: 18px;"></i>
                ACESSAR INSTRUÇÕES
            </button>
            <button class="btn-menu btn-gradient" onclick="window.open('https://pay.kirvano.com/d07c776b-2a48-491b-8b75-790115a11a08', '_blank')">
                <i data-lucide="crown" style="width: 18px; height: 18px;"></i>
                CONHECER ACOMPANHAMENTO EXCLUSIVO
            </button>
            <button class="btn-menu btn-pink" onclick="window.open('https://protocolo-gelatina-app.vercel.app/upsell1.html', '_blank')">
                <i data-lucide="shield" style="width: 18px; height: 18px;"></i>
                CONHECER PROGRAMA ANTI FLACIDEZ
            </button>

            <!-- Círculo de Progresso -->
            <div class="progress-circle-container">
                <div class="progress-circle">
                    <span class="circle-title">Dia ${state.user.currentDay}</span>
                    <span class="circle-subtitle">de 30</span>
                </div>
            </div>

            <!-- Cards de Status -->
            <div class="status-grid">
                <div class="status-card">
                    <i data-lucide="scale" style="color: var(--btn-pink); width: 24px; height: 24px;"></i>
                    <span class="status-value">${state.user.weight}</span>
                    <span class="status-label">Peso atual</span>
                </div>
                <div class="status-card">
                    <i data-lucide="calendar" style="color: var(--btn-yellow); width: 24px; height: 24px;"></i>
                    <span class="status-value">${state.user.daysLeft}</span>
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
// ABA DE CONTEÚDO (RECEITAS OFICIAIS)
// ----------------------------------------------------
const recipesCategories = ["Todas","FIT","Gelatinas","Detox","Beleza","Relaxantes","Shakes","Almoço","Jantar"];
const recipesDatabase = [
    {id:100,name:"Gelatina FIT de Morango com Whey",category:"FIT",time:"15 min",emoji:"🍓",desc:"Alta em proteína, sacia e ajuda na recuperação muscular. Apenas 80 kcal por porção.",ingredients:"10g gelatina incolor, 200ml água, 1 scoop whey de morango, 5 morangos picados, adoçante a gosto",instructions:"Hidrate a gelatina em 50ml de água fria. Aqueça 150ml de água e dissolva a gelatina. Misture o whey já frio. Adicione os morangos picados, leve à geladeira por 3h."},
    {id:101,name:"Gelatina FIT de Café com Canela",category:"FIT",time:"20 min",emoji:"☕",desc:"Termogênica natural! Acelera o metabolismo e dá energia. 45 kcal por porção.",ingredients:"10g gelatina incolor, 250ml café forte sem açúcar, 1 col. chá de canela em pó, adoçante, pitada de cacau",instructions:"Hidrate a gelatina em água fria. Aqueça o café e dissolva a gelatina. Adicione canela e cacau. Adoce a gosto e leve à geladeira por 4h."},
    {id:102,name:"Gelatina FIT de Iogurte com Limão",category:"FIT",time:"10 min",emoji:"🍋",desc:"Cremosa, leve e probiótica. Melhora a flora intestinal. 65 kcal.",ingredients:"10g gelatina incolor, 200ml iogurte natural desnatado, suco de 1 limão, raspas de limão, adoçante",instructions:"Hidrate a gelatina e dissolva em 3 col. de água quente. Misture ao iogurte com suco e raspas. Adoce e refrigere por 3h."},
    {id:103,name:"Gelatina FIT de Maçã e Canela",category:"FIT",time:"25 min",emoji:"🍎",desc:"Sabor de torta de maçã sem culpa! Rica em fibras. 55 kcal.",ingredients:"10g gelatina incolor, 250ml chá de maçã, 1 maçã picada, canela, 1 col. chia",instructions:"Faça o chá de maçã e dissolva a gelatina. Adicione a maçã picada, chia e canela. Leve à geladeira por 4h."},
    {id:104,name:"Gelatina FIT de Cacau Zero",category:"FIT",time:"15 min",emoji:"🍫",desc:"Mata a vontade de chocolate! Antioxidante.",ingredients:"10g gelatina incolor, 250ml leite desnatado, 2 col. cacau em pó, adoçante",instructions:"Hidrate a gelatina. Aqueça o leite com cacau. Dissolva a gelatina, adoce e leve à geladeira por 3h."},
    {id:105,name:"Gelatina FIT de Coco com Abacaxi",category:"FIT",time:"20 min",emoji:"🥥",desc:"Refrescante! Combate inchaço e retenção.",ingredients:"10g gelatina incolor, 200ml leite de coco light, 100g abacaxi picado, adoçante",instructions:"Hidrate a gelatina. Aqueça o leite de coco e dissolva. Adicione abacaxi picado, adoce e refrigere por 4h."},
    {id:106,name:"Gelatina de Frutas Vermelhas e Chia",category:"FIT",time:"15 min",emoji:"🫐"},
    {id:107,name:"Gelatina de Chá Verde com Gengibre",category:"FIT",time:"20 min",emoji:"🍵"},
    {id:10,name:"Gelatina de Abacaxi com Hortelã",category:"Detox",time:"20 min",emoji:"🍍",desc:"Combate a retenção de líquidos e melhora a digestão.",ingredients:"10g gelatina incolor, 300ml suco de abacaxi, hortelã, 1 col. chia",instructions:""},
    {id:11,name:"Gelatina Verde de Couve e Limão",category:"Detox",time:"25 min",emoji:"🥬",desc:"Rica em clorofila e vitamina C, ideal para limpar o fígado.",ingredients:"10g gelatina, 200ml água de coco, 1 folha de couve, suco de 1 limão, psyllium",instructions:""},
    {id:12,name:"Gelatina de Melancia e Gengibre",category:"Detox",time:"20 min",emoji:"🍉",desc:"Hidratação e ação anti-inflamatória.",ingredients:"",instructions:""},
    {id:13,name:"Gelatina de Frutas Vermelhas Antioxidante",category:"Beleza",time:"20 min",emoji:"🍒",desc:"Combate radicais livres e previne envelhecimento.",ingredients:"10g gelatina, 300ml chá de hibisco, frutas vermelhas, colágeno",instructions:""},
    {id:14,name:"Gelatina de Maracujá com Camomila",category:"Relaxantes",time:"25 min",emoji:"🌸",desc:"Calmante natural. Reduz ansiedade e melhora o sono.",ingredients:"10g gelatina, 200ml chá de camomila, polpa de maracujá, adoçante",instructions:""},
    {id:15,name:"Gelatina de Banana com Canela",category:"Relaxantes",time:"20 min",emoji:"🍌"},
    {id:2,name:"Shake Detox Verde",category:"Shakes",time:"5 min",emoji:"🥤"},
    {id:5,name:"Frango Grelhado com Legumes",category:"Almoço",time:"30 min",emoji:"🍗"},
    {id:6,name:"Salmão ao Forno",category:"Jantar",time:"25 min",emoji:"🐟"}
];

let globalActiveCategory = 'Todas';
let globalSearchQuery = '';

function renderContent() {
    state.activeTab = 'content';
    
    // Filtragem
    let filteredList = recipesDatabase.filter(r => {
        let textMatch = r.name.toLowerCase().includes(globalSearchQuery.toLowerCase());
        let catMatch = (globalActiveCategory === 'Todas') || (r.category === globalActiveCategory);
        return textMatch && catMatch;
    });

    const activeCatStyle = `background: linear-gradient(135deg, hsl(340, 65%, 55%), hsl(350, 70%, 60%)); color: white; box-shadow: 0 0 15px rgba(236,72,153,0.3); border-color: transparent;`;
    const inactiveCatStyle = `background: rgba(255,255,255,0.05); color: #a1a1aa; border: 1px solid rgba(255,255,255,0.1);`;

    const chipsHtml = recipesCategories.map(cat => `
        <button class="category-chip" 
            style="${cat === globalActiveCategory ? activeCatStyle : inactiveCatStyle}"
            onclick="setRecipeCategory('${cat}')">
            ${cat}
        </button>
    `).join('');

    const gridHtml = filteredList.map(recipe => `
        <div class="recipe-card-new" onclick="openRecipeDialog(${recipe.id})">
            <div class="recipe-emoji-bg">
                <span>${recipe.emoji}</span>
            </div>
            <div class="recipe-info">
                <h3 class="r-title">${recipe.name}</h3>
                <div class="r-meta">
                    <span><i data-lucide="clock" style="width: 12px; height: 12px;"></i> ${recipe.time}</span>
                    <i data-lucide="heart" style="width: 14px; height: 14px; color: #a1a1aa;"></i>
                </div>
            </div>
        </div>
    `).join('');

    appMain.innerHTML = `
        <div class="view-animate recipes-page-container">
            <h1 class="page-title" style="font-family: 'Playfair Display'; margin-bottom: 20px;">Receitas</h1>
            
            <div class="search-box">
                <i data-lucide="search" class="search-icon"></i>
                <input type="text" id="recipe-search-input" class="search-input" placeholder="Buscar receitas..." value="${globalSearchQuery}" onkeyup="setRecipeSearch(this.value)">
            </div>

            <div class="category-chips-container">
                ${chipsHtml}
            </div>

            <div class="recipes-grid">
                ${gridHtml.length > 0 ? gridHtml : '<p style="color: #a1a1aa; grid-column: span 2; text-align: center;">Nenhuma receita encontrada.</p>'}
            </div>
        </div>
    `;

    if (window.lucide) lucide.createIcons();
}

window.setRecipeCategory = function(cat) {
    globalActiveCategory = cat;
    renderContent();
};

window.setRecipeSearch = function(query) {
    globalSearchQuery = query;
    renderContent();
    // Re-focus input
    const input = document.getElementById('recipe-search-input');
    if(input) { input.focus(); }
};

window.openRecipeDialog = function(id) {
    const recipe = recipesDatabase.find(r => r.id === id);
    if(!recipe) return;

    const overlay = document.getElementById('recipe-sheet-overlay');
    const sheet = document.getElementById('recipe-sheet-content');

    sheet.innerHTML = `
        <div class="sheet-drag-handle"></div>
        <div class="sheet-emoji-circle">${recipe.emoji}</div>
        <h2 class="sheet-title">${recipe.name}</h2>
        
        <div class="sheet-meta-badges">
            <span class="badge"><i data-lucide="clock" style="width:14px;height:14px;"></i> ${recipe.time}</span>
            <span class="badge">${recipe.category}</span>
        </div>

        ${recipe.desc ? `<p class="sheet-desc">${recipe.desc}</p>` : ''}
        
        ${recipe.ingredients ? `
        <div class="sheet-box">
            <span class="box-label" style="color: #d946ef;">INGREDIENTES</span>
            <p>${recipe.ingredients}</p>
        </div>` : ''}

        ${recipe.instructions ? `
        <div class="sheet-box">
            <span class="box-label" style="color: #facc15;">MODO DE PREPARO</span>
            <p>${recipe.instructions}</p>
        </div>` : ''}
    `;

    overlay.classList.add('show');
    if (window.lucide) lucide.createIcons();
};

window.closeRecipeDialog = function(e) {
    // Only close if clicking the dark overlay bg, not the sheet itself
    if(e.target.id === 'recipe-sheet-overlay') {
        e.target.classList.remove('show');
    }
};

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
    appMain.innerHTML = `
        <div class="view-animate profile-page">
            <h1 class="page-title" style="font-family: 'Playfair Display'; margin-bottom: 25px;">Seu Perfil</h1>
            
            <div class="profile-header-card" style="background: var(--card-bg); border-radius: 20px; padding: 25px; text-align: center; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 20px;">
                <div class="profile-avatar" style="width: 80px; height: 80px; background: var(--btn-magenta-grad); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 2rem;">👤</div>
                <h2 style="font-size: 1.5rem; color: white; margin-bottom: 5px;">${state.user.name}</h2>
                <span style="color: var(--text-muted); font-size: 0.9rem;">No Protocolo há ${state.user.currentDay} dias</span>
            </div>

            <div class="profile-stats-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px;">
                <div class="status-card" style="align-items: flex-start; text-align: left; padding: 15px;">
                    <span style="color: var(--text-muted); font-size: 0.75rem; font-weight: 600;">PESO INICIAL</span>
                    <span style="font-size: 1.2rem; color: #facc15; font-weight: 700; margin-top: 5px;">${state.user.weight}</span>
                </div>
                <div class="status-card" style="align-items: flex-start; text-align: left; padding: 15px;">
                    <span style="color: var(--text-muted); font-size: 0.75rem; font-weight: 600;">IDADE</span>
                    <span style="font-size: 1.2rem; color: #facc15; font-weight: 700; margin-top: 5px;">${state.user.age || '--'} anos</span>
                </div>
            </div>

            <div class="menu-list" style="display: flex; flex-direction: column; gap: 10px;">
                <div class="menu-item" style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i data-lucide="bell" style="width: 18px; height: 18px; color: var(--text-muted);"></i>
                        <span style="font-size: 0.95rem;">Notificações</span>
                    </div>
                    <i data-lucide="chevron-right" style="width: 16px; height: 16px; color: var(--text-muted);"></i>
                </div>
                <div class="menu-item" onclick="logoutApp()" style="background: rgba(239, 68, 68, 0.05); padding: 15px; border-radius: 12px; display: flex; align-items: center; gap: 12px; border: 1px solid rgba(239, 68, 68, 0.1); color: #ef4444; margin-top: 20px; cursor: pointer;">
                    <i data-lucide="log-out" style="width: 18px; height: 18px;"></i>
                    <span style="font-size: 0.95rem; font-weight: 600;">Sair e Reiniciar Protocolo</span>
                </div>
            </div>
        </div>
    `;
    if (window.lucide) lucide.createIcons();
}

window.logoutApp = function() {
    if (confirm("Tem certeza que deseja sair? Seus dados serão limpos e você terá que fazer o quiz novamente.")) {
        localStorage.clear();
        location.reload();
    }
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

// Ação ao aceitar o prêmio -> Agora leva para o QUIZ
window.claimPrize = function() {
    document.getElementById('prize-modal').classList.remove('show');
    
    // Se o usuário já tiver nome (já fez o quiz), pula
    if (localStorage.getItem(STORAGE_KEYS.NAME)) {
        renderView('home');
    } else {
        document.getElementById('quiz-modal').classList.add('show');
    }
};

window.submitQuiz = function() {
    const name = document.getElementById('user-name-input').value.trim();
    const age = document.getElementById('user-age-input').value.trim();
    const weight = document.getElementById('user-weight-input').value.trim();

    if (!name || !weight) {
        alert("Por favor, preencha seu nome e peso para continuar! 🎀");
        return;
    }

    // Salva no LocalStorage
    localStorage.setItem(STORAGE_KEYS.NAME, name);
    localStorage.setItem(STORAGE_KEYS.WEIGHT, weight);
    localStorage.setItem(STORAGE_KEYS.AGE, age);
    localStorage.setItem(STORAGE_KEYS.START_DATE, new Date().toISOString());

    // Fecha Modal de Quiz
    document.getElementById('quiz-modal').classList.remove('show');

    // Inicia Setup Loading
    startAppSetup();
};

function startAppSetup() {
    const loadingScreen = document.getElementById('setup-loading-screen');
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');
    const loadingSub = document.getElementById('loading-subtext');

    loadingScreen.classList.add('show');

    const stages = [
        { progress: 20, text: "Analisando seu metabolismo...", sub: "Processando dados de idade e peso." },
        { progress: 50, text: `Personalizando para ${localStorage.getItem(STORAGE_KEYS.NAME)}...`, sub: "Calculando doses ideais de gelatina." },
        { progress: 85, text: "Criando seu cronograma de 30 dias!", sub: "Quase pronto..." },
        { progress: 100, text: "Protocolo Gerado com Sucesso! 🎀", sub: "Redirecionando..." }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
        if (currentStage >= stages.length) {
            clearInterval(interval);
            setTimeout(() => {
                // Atualiza o estado global com os novos dados
                state = getInitialState();
                loadingScreen.classList.remove('show');
                renderView('home');
            }, 800);
            return;
        }

        const stage = stages[currentStage];
        loadingBar.style.width = stage.progress + "%";
        loadingText.innerText = stage.text;
        loadingSub.innerText = stage.sub;
        currentStage++;
    }, 1200);
}

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
    window.open('https://protocolo-gelatina-app.vercel.app/obrigado.html', '_blank');
    document.getElementById('instructions-modal').classList.remove('show');
    
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
    
    // Inicia a primeira tela e guarda no histórico
    if(!window.location.hash) {
        history.replaceState({ tab: 'home' }, '', '#home');
        renderView('home', false);
    } else {
        const initialTab = window.location.hash.substring(1);
        renderView(initialTab, false);
    }
    
    // Suporte mágico ao Botão "Voltar" do Android/iPhone
    window.addEventListener('popstate', (e) => {
        // 1. Força o fechamento de qualquer modal/janela que estiver aberta por cima
        document.querySelectorAll('.modal-overlay.show, .sheet-overlay.show').forEach(el => {
            el.classList.remove('show');
        });
        
        // 2. Retorna para a tela exata que o cliente estava testando antes
        if(e.state && e.state.tab) {
            renderView(e.state.tab, false);
        } else {
            renderView('home', false);
        }
    });    
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
