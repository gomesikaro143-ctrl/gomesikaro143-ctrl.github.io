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
            { name: "O Conceito Booster", text: "Para que as gelatinas funcionem como inibidores de apetite, usamos 'Boosters'. São ingredientes que transformam uma gelatina simples em uma bomba de saciedade." },
            { name: "Psyllium - A Esponja", text: "Fibra natural que absorve água e vira uma esponja no estômago. Essencial para o Protocolo Gelatina." },
            { name: "Chia & Whey", text: "Chia libera um gel saciante e anti-inflamatório. O Whey garante a densidade proteica para firmar o corpo." }
        ]
    },
    receitas: {
        title: "Receitas do Protocolo",
        items: [
            { name: "Omelete Proteico Termogênico", ingredients: ["2 ovos", "Espinafre a gosto", "Queijo branco magro", "Pimenta preta", "Gengibre ralado", "Dose do Monjaro de Pobre"], instructions: "Bata os ovos com os temperos. Adicione o espinafre e queijo. Prepare em frigideira untada." },
            { name: "Frittata de Vegetais", ingredients: ["3 ovos", "Brócolis picado", "Pimentão em cubos", "Abobrinha ralada", "Dose do Monjaro de Pobre"], instructions: "Misture os vegetais e os ovos batidos. Asse em fogo baixo com tampa até firmar." },
            { name: "Torrada com Ovo Poché", ingredients: ["1 ovo", "Fatia de pão low carb", "Pasta de abacate", "Tomate cereja confit", "Dose do Monjaro de Pobre"], instructions: "Prepare o poché (água fervente, vinagre, redemoinho, 3 min). Sirva sobre a torrada com abacate." },
            { name: "Mounjaro de Pobre (Drink Mix)", ingredients: ["100g de psyllium em pó", "100g de chia em grãos", "100g de farinha de linhaça", "Água ou suco limão diet"], instructions: "Misture as 3 farinhas em um pote hermético. Tome 1 colher de sopa misturada em líquido 30 min antes do almoço e do jantar." }
        ]
    },
    aceleradoras: {
        title: "Aceleradoras de Metabolismo",
        items: [
            { name: "Turbo de Limão e Gengibre", text: "Termogênica potente para acelerar o metabolismo e queimar calorias passivamente logo pela manhã.<br><br><strong>Uso:</strong> 1 dose em jejum." },
            { name: "Chá Verde Energético", text: "Oxidação de gordura natural e energia sustentada ao longo do dia.<br><br><strong>Preparo:</strong> 10g gelatina incolor em 300ml de chá verde quente." }
        ]
    },
    drenagem: {
        title: "Drenagem Comestível",
        items: [
            { name: "Gelatina de Hibisco", text: "Fim da retenção de líquido e inchaço corporal. Prepare com morangos frescos ao fundo." },
            { name: "Melancia com Hortelã", text: "Hidratação máxima com efeito diurético natural. Bata no liquidificador e deixe gelando por 4h." }
        ]
    },
    sobremesas: {
        title: "Sobremesas Mata-Vontade",
        items: [
            { name: "Danoninho Proteico", text: "Textura cremosa idêntica ao original, mas anabólica. Use gelatina zero morango + iogurte natural." },
            { name: "Prestígio de Colher", text: "Mata a vontade de chocolate. Gelatina sem sabor dissolvida em leite de coco light com cacau 100%." }
        ]
    }
};

const appMain = document.getElementById('app-main');
const navItems = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('page-title');
const pageGreeting = document.getElementById('page-greeting');

// Dynamic Progress Ring System
function renderProgressRing(percent) {
    const degrees = (percent / 100) * 360;
    return `
        <div class="progress-ring-container">
            <div class="progress-ring" style="background: conic-gradient(var(--white) ${degrees}deg, rgba(255,255,255,0.2) 0deg);">
                <div class="progress-ring-content">
                    <h3>${percent}%</h3>
                    <span>Foco Diário</span>
                </div>
            </div>
        </div>
    `;
}

// Templates
const templates = {
    home: () => `
        <div class="view-animate">
            <section class="feature-buttons">
                <button class="feature-btn clickable" onclick="openModule('receitas')">
                    <i data-lucide="book-open"></i>
                    Protocolo 21D
                </button>
                <button class="feature-btn clickable" onclick="openModule('fundamentos')">
                    <i data-lucide="droplet"></i>
                    Drink Mounjaro
                </button>
            </section>

            ${renderProgressRing(state.progressPercent)}

            <section class="home-recipe-card glass-card clickable" onclick="openModule('receitas')">
                <div class="home-recipe-image" style="background-image: url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600')"></div>
                <div class="home-recipe-overlay">
                    <span class="tag">Destaque do Dia</span>
                    <h4>Torrada com Ovo Poché e Abacate</h4>
                </div>
            </section>

            <section class="categories-section" style="margin-top: 40px;">
                <div class="section-title-row">
                    <h3>Foco da Semana</h3>
                    <a href="#" class="ver-todas" onclick="renderView('content')">Ver Mais <i data-lucide="arrow-right" style="width:14px; vertical-align:middle;"></i></a>
                </div>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                    <div class="card clickable" style="flex-direction:column; padding:20px; text-align:center;" onclick="openModule('drenagem')">
                        <span style="font-size:3rem; margin-bottom:12px; display:block; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">🥑</span>
                        <h4 style="font-size:0.95rem; line-height:1.2;">Drenagem Intensa</h4>
                        <span class="muted" style="font-size:0.75rem; margin-top:6px; display:block;">Perca Retenção</span>
                    </div>
                    <div class="card clickable" style="flex-direction:column; padding:20px; text-align:center;" onclick="openModule('aceleradoras')">
                        <span style="font-size:3rem; margin-bottom:12px; display:block; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">🔥</span>
                        <h4 style="font-size:0.95rem; line-height:1.2;">Aceleradoras</h4>
                        <span class="muted" style="font-size:0.75rem; margin-top:6px; display:block;">Metabolismo</span>
                    </div>
                </div>
            </section>
        </div>
    `,
    content: () => {
        if (state.currentModule) {
            const mod = contentData[state.currentModule.id];
            return `
                <div class="view-animate module-detail" style="padding-top:10px;">
                    <button class="clickable" onclick="closeModule()" style="background:var(--white); border:none; color:var(--text-dark); padding:10px 20px; border-radius:30px; cursor:pointer; font-weight:700; font-size: 0.9rem; margin-bottom:25px; box-shadow: var(--shadow-card); display:flex; gap:8px; align-items:center;">
                        <i data-lucide="arrow-left" style="width: 16px;"></i> Voltar
                    </button>
                    
                    <h2 class="module-title" style="color:var(--white); margin-bottom:30px; font-size:1.8rem;">${mod.title}</h2>
                    
                    <div class="module-items" style="margin-top:10px;">
                        ${mod.items.map((item) => `
                            <div class="card content-item" style="margin-bottom:20px;">
                                <h4 style="font-size:1.2rem; color:var(--accent-primary); margin-bottom: 15px;">${item.name}</h4>
                                
                                ${item.ingredients ? `
                                    <h5 style="font-size:0.9rem; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted);">Ingredientes</h5>
                                    <ul class="recipe-ingredient-list">
                                        ${item.ingredients.map(ing => `
                                            <li class="recipe-ingredient-item" onclick="this.classList.toggle('checked')">
                                                <div class="custom-checkbox"></div>
                                                ${ing}
                                            </li>
                                        `).join('')}
                                    </ul>
                                ` : ''}

                                ${item.instructions ? `
                                    <h5 style="font-size:0.9rem; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); margin-top:20px;">Preparo</h5>
                                    <p style="margin-top:8px; color:var(--text-dark); line-height:1.6;">${item.instructions}</p>
                                ` : ''}

                                ${item.text ? `<p style="color:var(--text-dark); line-height:1.6;">${item.text}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        return `
            <div class="view-animate" style="padding-top:10px;">
                <h3 class="section-title" style="color:var(--white); margin-bottom:25px;">Biblioteca Premium</h3>
                <div class="module-list">
                    <div class="card clickable module-row" onclick="openModule('receitas')">
                        <div class="module-icon-wrap" style="color:#10B981; background:rgba(16,185,129,0.1);">
                            <i data-lucide="chef-hat"></i>
                        </div>
                        <div class="module-info">
                            <h4>Receitas do Protocolo</h4>
                            <span class="muted"><i data-lucide="check-circle-2" style="width:12px; color:#10B981;"></i> Completo • 10 itens</span>
                        </div>
                    </div>
                    
                    <div class="card clickable module-row" onclick="openModule('fundamentos')">
                        <div class="module-icon-wrap" style="color:var(--accent-primary); background:rgba(16,185,129,0.1);">
                            <i data-lucide="book"></i>
                        </div>
                        <div class="module-info">
                            <h4>Drink Mounjaro & Boosters</h4>
                            <span class="muted"><i data-lucide="library" style="width:12px;"></i> Fundamentos</span>
                        </div>
                    </div>
                    
                    <div class="card clickable module-row" onclick="openModule('aceleradoras')">
                        <div class="module-icon-wrap" style="color:#EF4444; background:rgba(239,68,68,0.1);">
                            <i data-lucide="flame"></i>
                        </div>
                        <div class="module-info">
                            <h4>Aceleradoras Táticas</h4>
                            <span class="muted"><i data-lucide="zap" style="width:12px;"></i> Queima Rápida</span>
                        </div>
                    </div>
                    
                    <div class="card clickable module-row" onclick="openModule('sobremesas')">
                        <div class="module-icon-wrap" style="color:#8B5CF6; background:rgba(139,92,246,0.1);">
                            <i data-lucide="cake"></i>
                        </div>
                        <div class="module-info">
                            <h4>Sobremesas Permitidas</h4>
                            <span class="muted"><i data-lucide="heart" style="width:12px;"></i> Sem Culpa</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    progress: () => `
        <div class="view-animate" style="padding-top:20px;">
            <div class="card" style="margin-bottom:20px; border-top: 4px solid var(--accent-primary);">
                <h3 style="margin-bottom:25px; text-align:center; font-size:1.4rem;">Seu Impacto Metabólico</h3>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; text-align:center;">
                    <div style="padding: 15px; background: var(--bg-light); border-radius: 12px;">
                        <span class="muted" style="font-size:0.75rem; font-weight:700; text-transform:uppercase;">Peso Eliminado</span>
                        <h4 style="font-size:1.8rem; color:var(--text-dark); margin-top:5px;">${state.weightLost} kg</h4>
                    </div>
                    <div style="padding: 15px; background: var(--bg-light); border-radius: 12px;">
                        <span class="muted" style="font-size:0.75rem; font-weight:700; text-transform:uppercase;">Sequência</span>
                        <h4 style="font-size:1.8rem; color:var(--accent-primary); margin-top:5px;">${state.currentDay} Dias</h4>
                    </div>
                </div>
            </div>
            
            <section class="card">
                <h3 style="margin-bottom:10px; font-size:1.1rem;">Consistência Semanal</h3>
                <p class="muted" style="font-size:0.85rem; margin-bottom:25px;">Seu pico de adesão foi na Quinta-feira.</p>
                
                <div class="bars" style="display:flex; align-items:flex-end; height:140px; gap:12px;">
                    ${[40, 55, 45, 95, 70, 85, 90].map((h, i) => `
                        <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:8px;">
                            <div class="bar" style="width:100%; height: ${h}%; background: ${h > 80 ? 'var(--primary-gradient)' : 'var(--bg-light)'}; border-radius:6px; transition: height 1s ease;"></div>
                            <span style="font-size:0.6rem; color:var(--text-muted); font-weight:700;">${['S','T','Q','Q','S','S','D'][i]}</span>
                        </div>
                    `).join('')}
                </div>
            </section>
        </div>
    `,
    tools:() => `
        <div class="view-animate" style="padding-top:10px;">
            <h3 class="section-title" style="color:var(--white); margin-bottom:25px;">Ferramentas Clínicas</h3>
            <div class="card clickable" style="margin-bottom:18px; display:flex; align-items:center; gap:18px;">
                <div class="module-icon-wrap" style="color:#0EA5E9; background:rgba(14,165,233,0.1);">
                    <i data-lucide="droplets"></i>
                </div>
                <div style="flex:1;">
                   <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                       <h4 style="font-size:1.05rem;">Hidratação</h4>
                       <span style="font-weight:700; color:#0EA5E9;">1.2L / 2.8L</span>
                   </div>
                   <div style="width:100%; height:6px; background:var(--bg-light); border-radius:10px; overflow:hidden;">
                        <div style="width:45%; height:100%; background:#0EA5E9; border-radius:10px;"></div>
                   </div>
                </div>
            </div>
            
            <div class="card clickable" style="margin-bottom:18px; display:flex; align-items:center; gap:18px;">
                <div class="module-icon-wrap" style="color:var(--accent-primary); background:rgba(16,185,129,0.1);">
                    <i data-lucide="target"></i>
                </div>
                <div>
                   <h4 style="font-size:1.05rem; margin-bottom:2px;">Calculadora de IMC e Meta</h4>
                   <span class="muted" style="font-size:0.85rem;">Revise sua estratégia semanal</span>
                </div>
            </div>
        </div>
    `,
    profile: () => `
        <div class="view-animate" style="padding-top:10px;">
            <div class="profile-header card">
                <div class="profile-avatar">IG</div>
                <h3 style="font-size:1.6rem; font-weight:800; letter-spacing:-0.05em; margin-bottom:5px;">${state.userName}</h3>
                <span style="display:inline-block; padding:5px 15px; background: rgba(255,215,0,0.15); color: #FFD700; border: 1px solid rgba(255,215,0,0.3); border-radius:20px; font-size:0.8rem; font-weight:700; letter-spacing:1px; text-transform:uppercase;">Account Premium</span>
                
                <div class="profile-stats-grid">
                    <div class="profile-stat-box">
                        <h4 style="font-size:1.3rem; margin-bottom:2px;">${state.currentDay}</h4>
                        <span class="muted" style="font-size:0.65rem; text-transform:uppercase;">Dias Totais</span>
                    </div>
                    <div class="profile-stat-box">
                        <h4 style="font-size:1.3rem; margin-bottom:2px;">${state.weightLost}kg</h4>
                        <span class="muted" style="font-size:0.65rem; text-transform:uppercase;">Gordura Off</span>
                    </div>
                    <div class="profile-stat-box">
                        <h4 style="font-size:1.3rem; margin-bottom:2px; color:var(--accent-primary);">ON</h4>
                        <span class="muted" style="font-size:0.65rem; text-transform:uppercase;">Metabolismo</span>
                    </div>
                </div>
                
                <h4 style="margin-top:35px; text-align:left; font-size:0.9rem; text-transform:uppercase; letter-spacing:1px; color: rgba(255,255,255,0.6); margin-bottom:10px;">Acesso Exclusivo</h4>
                
                <button class="vip-button" onclick="window.location.href='https://pay.cakto.com.br/33uskv3_815748'">
                    Desbloquear Acesso Vitalício + VIP
                </button>
            </div>

            <div class="card clickable" style="display:flex; justify-content:space-between; align-items:center; padding: 20px;">
                <span style="font-weight:700; color:#EF4444;">Encerrar Sessão</span>
                <i data-lucide="log-out" style="color:#EF4444;"></i>
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
    
    // Inject logic to handle Hero BG visibility
    const heroBg = document.querySelector('.hero-bg-container');
    if(viewName === 'profile') {
        heroBg.style.opacity = '0'; // Hide gradient on dark profile page
    } else {
        heroBg.style.opacity = '1';
    }

    appMain.innerHTML = templates[viewName]();
    
    // Update header context
    pageTitle.textContent = viewName === 'home' ? 'Dashboard' : 
                           viewName.charAt(0).toUpperCase() + viewName.slice(1).replace('Tools', 'Ferramentas');
    
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Interactive IA Button Logic
const iaButton = document.querySelector('.sticky-ia-button');
if(iaButton) {
    iaButton.innerHTML = `
        <div class="ia-status-dot"></div>
        <i data-lucide="bot" style="width:28px; height:28px;"></i>
    `;
    iaButton.addEventListener('click', () => {
        alert('Conectando à sua Nutricionista IA Privada... (Em breve)');
    });
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
