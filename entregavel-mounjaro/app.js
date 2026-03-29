const state = {
    activeTab: 'home',
    currentModule: null, 
    userName: 'ikaro gomes',
    currentDay: 7,
    totalDays: 21,
    weightLost: 8,
    progressPercent: 44
};

const contentData = {
    fundamentos: {
        title: "Fundamentos & Boosters",
        items: [
            {
                name: "O Conceito Booster",
                text: "Para que as gelatinas funcionem como inibidores de apetite, usamos 'Boosters'. São ingredientes que transformam uma gelatina simples em uma bomba de saciedade que ocupa espaço no estômago por horas."
            },
            {
                name: "Psyllium - A Esponja",
                text: "Fibra natural que absorve água e vira uma esponja no seu estômago. Essencial para o Protocolo Gelatina."
            },
            {
                name: "Chia & Whey",
                text: "Chia libera um gel saciante e anti-inflamatório. O Whey Protein garante a densidade proteica para firmar o corpo enquanto você emagrece."
            }
        ]
    },
    aceleradoras: {
        title: "Aceleradoras de Metabolismo",
        items: [
            {
                name: "Turbo de Limão e Gengibre",
                text: "Termogênica potente para acelerar o metabolismo e queimar calorias passivamente logo pela manhã.<br><br><strong>Ingredientes:</strong> Gelatina incolor, suco de 1 limão, 1 colher de gengibre ralada."
            },
            {
                name: "Gelatina Pré-Treino (Beterraba)",
                text: "Vasodilatadora natural que melhora o desempenho no treino e garante saciedade prolongada.<br><br><strong>Ingredientes:</strong> 10g gelatina incolor, 200ml suco de laranja, 1 pedaço de beterraba crua."
            },
            {
                name: "Chá Verde Energético",
                text: "Oxidação de gordura natural e energia sustentada ao longo do dia.<br><br><strong>Ingredientes:</strong> 10g gelatina, 300ml de chá verde concentrado."
            }
        ]
    },
    drenagem: {
        title: "Drenagem Comestível",
        items: [
            {
                name: "Gelatina de Hibisco",
                text: "Fim da retenção de líquido e inchaço corporal.<br><br><strong>Ingredientes:</strong> 10g gelatina incolor, 400ml chá de hibisco, pedaços de morango."
            },
            {
                name: "Detox Verde (Couve)",
                text: "Limpeza hepática profunda e eliminação de toxinas.<br><br><strong>Ingredientes:</strong> 1 pct gelatina zero limão, 1 folha de couve, suco de 1/2 limão."
            },
            {
                name: "Melancia com Hortelã",
                text: "Hidratação máxima com efeito diurético natural.<br><br><strong>Ingredientes:</strong> 10g gelatina, 300ml suco de melancia, folhas de hortelã."
            }
        ]
    },
    sobremesas: {
        title: "Sobremesas Mata-Vontade",
        items: [
            {
                name: "Danoninho Proteico",
                text: "Textura cremosa idêntica ao original, mas anabólica e saciante.<br><br><strong>Ingredientes:</strong> Gelatina zero morango, 1 copo iogurte natural desnatado, 1 colher de ricota."
            },
            {
                name: "Prestígio de Colher",
                text: "Mata a vontade de chocolate e coco sem sair da dieta.<br><br><strong>Ingredientes:</strong> 10g gelatina, 200ml leite de coco light, cacau 100%, coco ralado."
            },
            {
                name: "Mousse de Maracujá com Chia",
                text: "Calmante natural que ajuda a dormir melhor e queima gordura no sono.<br><br><strong>Ingredientes:</strong> Gelatina zero maracujá, creme de leite leve, 1 colher de chia."
            }
        ]
    }
};

const appMain = document.getElementById('app-main');
const navItems = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('page-title');

// Templates
const templates = {
    home: () => `
        <div class="view-animate">
            <section class="card progress-card" style="margin-top:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3>Seu Progresso Atual</h3>
                    <span style="color:#64748B; font-weight:700;">Dia ${state.currentDay}/21</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${(state.currentDay/state.totalDays)*100}%"></div>
                </div>
            </section>

            <section class="feature-buttons">
                <button class="feature-btn highlight" onclick="openModule('fundamentos')">
                    <i data-lucide="zap"></i>
                    <span>O Truque da Gelatina</span>
                    <div class="glow-effect"></div>
                </button>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    <button class="feature-btn" onclick="renderView('content')" style="padding:15px; flex-direction:column; align-items:flex-start;">
                        <i data-lucide="book-open" style="width:30px; height:30px; margin-bottom:10px;"></i>
                        <span style="font-size:0.85rem;">Conteúdos</span>
                    </button>
                    <button class="feature-btn" onclick="window.open('https://www.canva.com/design/DAGnFBUMQ4s/yQQ7SSl0TBKWEbtD1Q-RFg/view', '_blank')" style="padding:15px; flex-direction:column; align-items:flex-start;">
                        <i data-lucide="award" style="width:30px; height:30px; margin-bottom:10px;"></i>
                        <span style="font-size:0.85rem;">Bônus: Mounjaro</span>
                    </button>
                </div>
            </section>

            <section class="daily-recipe">
                <h3 class="section-title">Recomendação do Dia 🌟</h3>
                <div class="recipe-card card" onclick="openModule('aceleradoras')">
                    <div class="recipe-image-placeholder" style="background: url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=400') center/cover; height: 140px;"></div>
                    <div class="recipe-info">
                        <h4>Gelatina Turbo Detox</h4>
                        <p class="muted">Ative o GLP-1 logo cedo com esta receita.</p>
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
                        ${mod.items.map((item) => `
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
                <h3 class="section-title">Módulos do Protocolo</h3>
                <div class="module-list">
                    <div class="card module-card" onclick="openModule('fundamentos')">
                        <div class="module-icon">💡</div>
                        <div class="module-info">
                            <h4>Fundamentos & Boosters</h4>
                            <span class="muted">Comece por aqui</span>
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
        <div class="view-animate" style="padding-top:10px;">
            <div class="stats-grid">
                <div class="card stat-item">
                    <span class="stat-label">Peso Perdido</span>
                    <span class="stat-value">${state.weightLost} kg</span>
                </div>
                <div class="card stat-item">
                    <span class="stat-label">Dias Ativos</span>
                    <span class="stat-value">${state.currentDay}</span>
                </div>
            </div>
            <section class="chart-box card" style="margin-top:20px;">
                <h3>Sua Evolução Semanal</h3>
                <div class="bars" style="display:flex; align-items:flex-end; height:100px; gap:8px; margin-top:20px;">
                    ${[30, 45, 40, 60, 55, 75, 80].map(h => `<div class="bar" style="height: ${h}%; flex:1; background: #E2E8F0; border-radius:4px;"></div>`).join('')}
                </div>
            </section>
        </div>
    `,
    profile: () => `
        <div class="view-animate" style="text-align:center;">
            <div class="avatar-large" style="width:70px; height:70px; background:var(--primary-gradient); border-radius:50%; margin:20px auto; display:flex; align-items:center; justify-content:center; color:white; font-weight:800; font-size:1.5rem;">IG</div>
            <h3>${state.userName}</h3>
            <p class="muted">Membro do Protocolo Gelatina</p>
            <div class="profile-menu" style="text-align:left; margin-top:30px;">
                <div class="card menu-item" style="margin-bottom:10px; cursor:pointer;" onclick="window.location.href='https://pay.cakto.com.br/33uskv3_815748'">💎 Módulo VIP: Acesso Vitalício</div>
                <div class="card menu-item" style="margin-bottom:10px; cursor:pointer;">⚙️ Suporte & Configurações</div>
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
                           viewName.charAt(0).toUpperCase() + viewName.slice(1);
    
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
