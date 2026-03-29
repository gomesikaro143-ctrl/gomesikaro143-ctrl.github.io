const state = {
    activeTab: 'home',
    currentModule: null, // Track if a sub-module is open
    userName: 'ikaro gomes',
    currentDay: 7,
    totalDays: 21,
    weightLost: 8,
    progressPercent: 44
};

const contentData = {
    ebook: {
        title: "Capítulos do E-book",
        items: [
            {
                name: "O Poder Oculto do Ovo",
                text: "O ovo é considerado por nutricionistas o alimento mais completo da natureza após o leite materno. Ele contém proteínas de altíssima qualidade (albumina), Vitaminas K, D, Complexo B, Colina (essencial para o cérebro) e Ômega 3. No nosso protocolo, ele é a base sacietogênica que impede a fome durante o processo."
            },
            {
                name: "O Monjaro de Pobre - A Fórmula",
                text: "Nossa 'Fórmula Caseira' não é um remédio, mas uma combinação estratégica de nutrientes que imita a ação dos hormônios sacietógenos. Ao combinar a proteína do ovo com fibras específicas e termogênicos naturais (pimenta, gengibre), criamos um ambiente metabólico propício para a queima de gordura visceral."
            },
            {
                name: "Fase 1: Detox e Adaptação",
                text: "Nos primeiros 7 dias, o foco é limpar o organismo e reduzir a inflamação celular. Você sentirá uma redução drástica no inchaço abdominal e um aumento súbito na energia diária. É a fase onde o corpo 'aprende' a usar gordura como fonte primária de combustível."
            }
        ]
    },
    recipes: {
        title: "Receitas do Protocolo",
        items: [
            {
                name: "Omelete Proteico Termogênico",
                text: "<strong>Ingredientes:</strong> 2 ovos, punhado de espinafre, 1 fatia de queijo branco, pimenta do reino e gengibre ralado.<br><br><strong>Preparo:</strong> Bata os ovos com os temperos. Refogue o espinafre rapidamente e despeje os ovos. Doure dos dois lados e sirva quente."
            },
            {
                name: "Frittata de Vegetais",
                text: "<strong>Ingredientes:</strong> 3 ovos, brócolis cozido, pimentão picado e abobrinha ralada.<br><br><strong>Preparo:</strong> Misture tudo em uma tigela. Coloque em uma frigideira antiaderente tampada em fogo baixo até firmar. Ótima opção para o almoço!"
            },
            {
                name: "Bolinho de Ovo Fit",
                text: "<strong>Ingredientes:</strong> 2 ovos, 1 colher de farinha de amêndoas, pitada de canela e gotas de xilitol.<br><br><strong>Preparo:</strong> Misture bem e leve ao micro-ondas por 2 minutos em um bowl pequeno. Finalize com canela por cima."
            }
        ]
    },
    dieta: {
        title: "Plano Diário 21D",
        items: [
            {
                name: "Cronograma Sugerido",
                text: "<strong>08:00</strong> - Água com limão e 1 dose do Protocolo.<br><strong>12:00</strong> - Almoço Proteico (Omelete ou Frittata).<br><strong>16:00</strong> - Lanche Leve (Castanhas ou Ovo cozido).<br><strong>20:00</strong> - Jantar (Sopa de legumes com proteínas)."
            }
        ]
    }
};

const appMain = document.getElementById('app-main');
const navItems = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('page-title');
const headerAvatar = document.getElementById('header-avatar');

// Templates
const templates = {
    home: () => `
        <div class="view-animate">
            <section class="card progress-card">
                <div class="flex-between" style="display:flex; justify-content:space-between; align-items:center;">
                    <h3>Dia ${state.currentDay} de ${state.totalDays}</h3>
                    <span class="muted" style="color: #64748B; font-size: 0.8rem;">${Math.round((state.currentDay/state.totalDays)*100)}%</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${(state.currentDay/state.totalDays)*100}%"></div>
                </div>
            </section>

            <section class="feature-buttons">
                <button class="feature-btn highlight" onclick="window.open('https://www.canva.com/design/DAGnFBUMQ4s/yQQ7SSl0TBKWEbtD1Q-RFg/view', '_blank')">
                    <i data-lucide="flame"></i>
                    <span>Mounjaro de Pobre</span>
                    <div class="glow-effect"></div>
                </button>
                <button class="feature-btn" onclick="renderView('content')">
                    <img src="assets/poster.png" style="width: 50px; height: 50px; border-radius: 12px; object-fit: cover; margin-right: 15px;">
                    <span>Desafio 21D</span>
                </button>
            </section>

            <section class="daily-recipe">
                <h3 class="section-title">Receita do dia 🥗</h3>
                <div class="recipe-card card">
                    <div class="recipe-image-placeholder" style="background: url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400') center/cover; height: 150px;"></div>
                    <div class="recipe-info">
                        <h4>Torrada com Ovo Poché</h4>
                        <p class="muted">Proteína e saciedade para começar bem.</p>
                        <button class="small-btn" onclick="openModule('recipes', 2)">Ver receita</button>
                    </div>
                </div>
            </section>
        </div>
    `,
    content: () => {
        if (state.currentModule) {
            const mod = contentData[state.currentModule.id];
            return `
                <div class="view-animate module-detail">
                    <button class="back-link" onclick="closeModule()">← Voltar</button>
                    <h2 class="module-title">${mod.title}</h2>
                    <div class="module-items">
                        ${mod.items.map((item, idx) => `
                            <div class="card content-item">
                                <h4>${item.name}</h4>
                                <p>${item.text}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        return `
            <div class="view-animate">
                <h3 class="section-title">Módulo de Acesso</h3>
                <div class="module-list">
                    <div class="card module-card" onclick="openModule('ebook')">
                        <div class="module-icon">📖</div>
                        <div class="module-info">
                            <h4>Capítulos do E-book</h4>
                            <span class="muted">Exclusivo • 100% lido</span>
                        </div>
                    </div>
                    <div class="card module-card" onclick="openModule('recipes')">
                        <div class="module-icon">🍳</div>
                        <div class="module-info">
                            <h4>Receitas do Protocolo</h4>
                            <span class="muted">Saudável • 5 Receitas</span>
                        </div>
                    </div>
                    <div class="card module-card" onclick="openModule('dieta')">
                        <div class="module-icon">📅</div>
                        <div class="module-info">
                            <h4>Plano Diário 21D</h4>
                            <span class="muted">Organização • Cronograma</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    progress: () => `
        <div class="view-animate">
            <div class="stats-grid">
                <div class="card stat-item">
                    <span class="stat-label">Peso Perdido</span>
                    <span class="stat-value">${state.weightLost} kg</span>
                </div>
                <div class="card stat-item">
                    <span class="stat-label">Dias Ativos</span>
                    <span class="stat-value">${state.currentDay} dias</span>
                </div>
            </div>
            <section class="chart-box card" style="margin-top:20px;">
                <h3>Sua Evolução</h3>
                <div class="bars" style="display:flex; align-items:flex-end; height:100px; gap:8px; margin-top:20px;">
                    ${[20, 35, 45, 60, 55, 75, 80].map(h => `<div class="bar" style="height: ${h}%; flex:1; background: #E2E8F0; border-radius:4px;"></div>`).join('')}
                </div>
            </section>
        </div>
    `,
    profile: () => `
        <div class="view-animate" style="text-align:center;">
            <div class="avatar-large" style="width:80px; height:80px; background:var(--primary-gradient); border-radius:50%; margin:20px auto; display:flex; align-items:center; justify-content:center; color:white; font-weight:800; font-size:1.5rem;">IG</div>
            <h3>${state.userName}</h3>
            <p class="muted">Aluno Premium</p>
            <div class="profile-menu" style="text-align:left; margin-top:30px;">
                <div class="card menu-item" style="margin-bottom:10px; cursor:pointer;" onclick="window.location.href='https://pay.cakto.com.br/33uskv3_815748'">💎 Upgrade para VIP</div>
                <div class="card menu-item" style="margin-bottom:10px; cursor:pointer;">⚙️ Configurações</div>
            </div>
        </div>
    `,
    tools: () => `
        <div class="view-animate">
            <h3 class="section-title">Calculadora de Água 💧</h3>
            <section class="card">
                <p>Baseado no seu peso, você deve beber:</p>
                <h2 style="color:var(--accent-orange); margin:10px 0;">2.8L / dia</h2>
                <button class="small-btn">Configurar Lembrete</button>
            </section>
        </div>
    `
};

// State functions
window.openModule = (moduleId) => {
    state.currentModule = { id: moduleId };
    renderView('content');
};

window.closeModule = () => {
    state.currentModule = null;
    renderView('content');
};

function renderView(viewName) {
    state.activeTab = viewName;
    appMain.innerHTML = templates[viewName]();
    pageTitle.textContent = viewName.charAt(0).toUpperCase() + viewName.slice(1).replace('Home', 'Início');
    
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Navigation Listeners
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const tab = item.getAttribute('data-tab');
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        state.currentModule = null; // Reset sub-navigation when switching tabs
        renderView(tab);
    });
});

// Initial Render
renderView('home');
