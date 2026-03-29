const state = {
    activeTab: 'home',
    currentModule: null, 
    userName: 'ikaro gomes',
    currentDay: 7,
    totalDays: 21,
    weightLost: 8.2,
    progressPercent: 33
};

const contentData = {
    fundamentos: {
        title: "Fundamentos & Boosters",
        items: [
            { name: "O Conceito Booster", text: "Para que as gelatinas funcionem como inibidores de apetite, usamos 'Boosters'. São ingredientes que transformam uma gelatina simples em uma bomba de saciedade que ocupa espaço no estômago por horas." },
            { name: "Psyllium - A Esponja", text: "Fibra natural que absorve água e vira uma esponja no seu estômago. Essencial para o Protocolo Gelatina." },
            { name: "Chia & Whey", text: "Chia libera um gel saciante e anti-inflamatório. O Whey Protein garante a densidade proteica para firmar o corpo enquanto você emagrece." }
        ]
    },
    aceleradoras: {
        title: "Aceleradoras de Metabolismo",
        items: [
            { name: "Turbo de Limão e Gengibre", text: "Termogênica potente para acelerar o metabolismo e queimar calorias passivamente logo pela manhã.<br><br><strong>Ingredientes:</strong> Gelatina incolor, suco de 1 limão, 1 colher de gengibre ralada." },
            { name: "Gelatina Pré-Treino (Beterraba)", text: "Vasodilatadora natural que melhora o desempenho no treino e garante saciedade prolongada.<br><br><strong>Ingredientes:</strong> 10g gelatina incolor, 200ml suco de laranja, 1 pedaço de beterraba crua." },
            { name: "Chá Verde Energético", text: "Oxidação de gordura natural e energia sustentada ao longo do dia.<br><br><strong>Ingredientes:</strong> 10g gelatina, 300ml de chá verde concentrado." }
        ]
    },
    drenagem: {
        title: "Drenagem Comestível",
        items: [
            { name: "Gelatina de Hibisco", text: "Fim da retenção de líquido e inchaço corporal.<br><br><strong>Ingredientes:</strong> 10g gelatina incolor, 400ml chá de hibisco, pedaços de morango." },
            { name: "Detox Verde (Couve)", text: "1 pct gelatina zero limão, 1 folha de couve, suco de 1/2 limão." },
            { name: "Melancia com Hortelã", text: "Hidratação máxima com efeito diurético natural.<br><br><strong>Ingredientes:</strong> 10g gelatina, 300ml suco de melancia, folhas de hortelã." }
        ]
    },
    sobremesas: {
        title: "Sobremesas Mata-Vontade",
        items: [
            { name: "Danoninho Proteico", text: "Textura cremosa idêntica ao original, mas anabólica e saciante.<br><br><strong>Ingredientes:</strong> Gelatina zero morango, 1 copo iogurte natural desnatado, 1 colher de ricota." },
            { name: "Prestígio de Colher", text: "Mata a vontade de chocolate e coco sem sair da dieta.<br><br><strong>Ingredientes:</strong> 10g gelatina, 200ml leite de coco light, cacau 100%, coco ralado." },
            { name: "Mousse de Maracujá com Chia", text: "Calmante natural que ajuda a dormir melhor e queima gordura no sono.<br><br><strong>Ingredientes:</strong> Gelatina zero maracujá, creme de leite leve, 1 colher de chia." }
        ]
    }
};

const appMain = document.getElementById('app-main');
const navItems = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('page-title');
const pageGreeting = document.getElementById('page-greeting');

// Templates
const templates = {
    home: () => `
        <div class="view-animate">
            <section class="feature-buttons">
                <button class="feature-btn" onclick="openModule('fundamentos')">
                    <i data-lucide="flame" style="width:18px;"></i>
                    Mounjaro de Pobre
                </button>
                <button class="feature-btn" onclick="openModule('aceleradoras')">
                    <i data-lucide="book-open" style="width:18px;"></i>
                    Desafio 21D
                </button>
            </section>

            <section class="home-recipe-card">
                <div class="home-recipe-image" style="background-image: url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=400')"></div>
                <div class="home-recipe-content">
                    <p class="muted" style="font-size: 0.8rem; margin-bottom: 4px;">Receita do dia:</p>
                    <h4 style="font-size: 1.1rem; font-weight: 800;">Torrada com Ovo Poché</h4>
                </div>
            </section>

            <section class="progress-section">
                <div class="progress-header">
                    <h3>Dia ${state.currentDay}/${state.totalDays}</h3>
                    <span>${state.progressPercent}% completo</span>
                </div>
                <div class="main-progress-bar-container">
                    <div class="main-progress-bar-fill" style="width: ${state.progressPercent}%"></div>
                </div>
                <p class="progress-subtext">Progresso dia ${state.currentDay}/${state.totalDays}</p>
            </section>

            <section class="categories-section">
                <div class="section-title-row">
                    <h3>Receitas em Destaque</h3>
                    <a href="#" class="ver-todas" onclick="renderView('content')">Ver todas <i data-lucide="chevron-right" style="width:14px; vertical-align:middle; display:inline-block;"></i></a>
                </div>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                    <div class="card module-card" style="flex-direction:column; padding:15px; text-align:center;" onclick="openModule('drenagem')">
                        <span style="font-size:2.5rem; margin-bottom:10px;">🥑</span>
                        <h4 style="font-size:0.9rem;">Torrada de Abacate</h4>
                        <span class="muted" style="font-size:0.7rem;">97 receitas</span>
                    </div>
                    <div class="card module-card" style="flex-direction:column; padding:15px; text-align:center;" onclick="openModule('aceleradoras')">
                        <span style="font-size:2.5rem; margin-bottom:10px;">🥗</span>
                        <h4 style="font-size:0.9rem;">Salada Proteica</h4>
                        <span class="muted" style="font-size:0.7rem;">210 receitas</span>
                    </div>
                </div>
            </section>

            <section class="card" style="margin-top:20px; text-align:center; background: var(--primary-gradient); color:white; border:none;">
                <h3 style="margin-bottom:5px;">Continue Focado!</h3>
                <p style="font-size:0.85rem;">Você está a 14 dias de completar o desafio! 💪</p>
            </section>
        </div>
    `,
    content: () => {
        if (state.currentModule) {
            const mod = contentData[state.currentModule.id];
            return `
                <div class="view-animate module-detail" style="padding-top:20px;">
                    <button class="back-link" onclick="closeModule()" style="background:rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.3); color:white; padding:8px 15px; border-radius:10px; cursor:pointer; font-weight:700; margin-bottom:20px;">← Voltar</button>
                    <h2 class="module-title" style="color:white; margin-bottom:30px;">${mod.title}</h2>
                    <div class="module-items" style="margin-top:10px;">
                        ${mod.items.map((item) => `
                            <div class="card content-item" style="margin-bottom:15px;">
                                <h4>${item.name}</h4>
                                <p>${item.text}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        return `
            <div class="view-animate" style="padding-top:20px;">
                <h3 class="section-title" style="color:white; margin-bottom:20px;">Módulos do Protocolo</h3>
                <div class="module-list" style="margin-top:10px;">
                    <div class="card module-card" onclick="openModule('fundamentos')">
                        <div class="module-icon">💡</div>
                        <div class="module-info">
                            <h4>Fundamentos & Boosters</h4>
                            <span class="muted">Exclusivo • 100% lido</span>
                        </div>
                    </div>
                    <div class="card module-card" onclick="openModule('aceleradoras')">
                        <div class="module-icon">🔥</div>
                        <div class="module-info">
                            <h4>Aceleradoras de Metabolismo</h4>
                            <span class="muted">Turbine sua queima</span>
                        </div>
                    </div>
                    <div class="card module-card" onclick="openModule('drenagem')">
                        <div class="module-icon">💧</div>
                        <div class="module-info">
                            <h4>Drenagem Comestível</h4>
                            <span class="muted">Elimine o inchaço</span>
                        </div>
                    </div>
                    <div class="card module-card" onclick="openModule('sobremesas')">
                        <div class="module-icon">🍰</div>
                        <div class="module-info">
                            <h4>Sobremesas Mata-Vontade</h4>
                            <span class="muted">Doces permitidos</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    progress: () => `
        <div class="view-animate" style="padding-top:20px;">
            <div class="card" style="margin-bottom:20px;">
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; text-align:center;">
                    <div>
                        <span class="muted" style="font-size:0.75rem;">Peso Perdido</span>
                        <h4 style="font-size:1.5rem; color:var(--accent-orange);">${state.weightLost} kg</h4>
                    </div>
                    <div>
                        <span class="muted" style="font-size:0.75rem;">Dias Ativos</span>
                        <h4 style="font-size:1.5rem; color:var(--accent-orange);">${state.currentDay}</h4>
                    </div>
                </div>
            </div>
            <section class="card">
                <h3 style="margin-bottom:20px; font-size:1rem;">Histórico Semanal</h3>
                <div class="bars" style="display:flex; align-items:flex-end; height:120px; gap:10px;">
                    ${[30, 45, 40, 60, 55, 75, 80].map(h => `<div class="bar" style="height: ${h}%; flex:1; background: #F1F5F9; border-radius:4px;"></div>`).join('')}
                </div>
            </section>
        </div>
    `,
    tools:() => `
        <div class="view-animate" style="padding-top:20px;">
            <h3 class="section-title" style="color:white; margin-bottom:20px;">Ferramentas de Suporte</h3>
            <div class="card" style="margin-bottom:15px; display:flex; align-items:center; gap:15px; cursor:pointer;">
                <div class="module-icon">💧</div>
                <div>
                   <h4>Calculadora de Água</h4>
                   <span class="muted">Beba 2.8L por dia</span>
                </div>
            </div>
            <div class="card" style="margin-bottom:15px; display:flex; align-items:center; gap:15px; cursor:pointer;">
                <div class="module-icon">⚖️</div>
                <div>
                   <h4>Meta de Peso</h4>
                   <span class="muted">Faltam 4.5kg</span>
                </div>
            </div>
        </div>
    `,
    profile: () => `
        <div class="view-animate" style="padding-top:20px;">
            <div class="card" style="text-align:center; padding-top:40px; position:relative;">
                <div style="width:80px; height:80px; background:var(--primary-gradient); border-radius:50%; margin:0 auto 15px; display:flex; align-items:center; justify-content:center; color:white; font-size:1.8rem; font-weight:800; border:4px solid white; box-shadow: var(--shadow-card);">IG</div>
                <h3>${state.userName}</h3>
                <p class="muted" style="margin-bottom:25px;">Desafio 21D Premium</p>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; border-top:1px solid #F1F5F9; padding-top:20px;">
                    <div style="border-right:1px solid #F1F5F9;">
                        <h4 style="font-size:1.1rem;">${state.currentDay}</h4>
                        <span class="muted" style="font-size:0.65rem;">Dias</span>
                    </div>
                    <div style="border-right:1px solid #F1F5F9;">
                        <h4 style="font-size:1.1rem;">${state.weightLost}kg</h4>
                        <span class="muted" style="font-size:0.65rem;">Perda</span>
                    </div>
                    <div>
                        <h4 style="font-size:1.1rem;">${state.progressPercent}%</h4>
                        <span class="muted" style="font-size:0.65rem;">Foco</span>
                    </div>
                </div>

                <button class="vip-button" onclick="window.location.href='https://pay.cakto.com.br/33uskv3_815748'">
                    💎 ACESSO VITALÍCIO + MÓDULO VIP
                </button>

                <div style="margin-top:30px; text-align:left; border-top:1px solid #F1F5F9; padding-top:15px;">
                   <div style="padding:15px 0; border-bottom:1px solid #F1F5F9; color:#EF4444; font-weight:600; cursor:pointer;">Sair da conta</div>
                </div>
            </div>
        </div>
    `
};

// Functions
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
    
    // Update header context
    pageTitle.textContent = viewName === 'home' ? 'Dashboard' : 
                           viewName.charAt(0).toUpperCase() + viewName.slice(1).replace('Tools', 'Ferramentas');
    
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
        state.currentModule = null;
        renderView(tab);
    });
});

// Initial Render
renderView('home');
