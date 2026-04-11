// Estado Global Inicial com Persistência Local
const STORAGE_KEYS = {
    NAME: 'gm_user_name',
    WEIGHT: 'gm_user_weight',
    AGE: 'gm_user_age',
    START_DATE: 'gm_user_start_date'
};

// Configurações e Persistência do App
window.editWeight = function() {
    let currentWeight = state.user.weight.replace('kg','').trim();
    let newWeight = prompt("Parabéns pelo esforço no seu Plano! Qual o seu novo peso alcançado (ex: 75.5)?", currentWeight);
    if(newWeight !== null && newWeight.trim() !== "") {
        let wNum = parseFloat(newWeight.replace(',', '.'));
        if(!isNaN(wNum)) {
            let finalStr = wNum + "kg";
            state.user.weight = finalStr;
            localStorage.setItem(STORAGE_KEYS.WEIGHT, finalStr);
            renderView('home', false);
        }
    }
}

window.toggleDay = function(dayNumber) {
    let completed = state.user.completedDays || [];
    if(completed.includes(dayNumber)) {
        completed = completed.filter(d => d !== dayNumber);
    } else {
        completed.push(dayNumber);
    }
    state.user.completedDays = completed;
    localStorage.setItem('gm_completed_days', JSON.stringify(completed));
    
    let maxCompleted = completed.length > 0 ? Math.max(...completed) : 0;
    state.user.currentDay = Math.min(30, maxCompleted + 1);
    state.user.daysLeft = Math.max(0, 30 - state.user.currentDay);
    
    renderView('home', false);
}

window.toggleAccordion = function(d) {
    const content = document.getElementById('content-dia-' + d);
    const btn = document.getElementById('btn-abrir-dia-' + d);
    if (!content || !btn) return;
    
    if(content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'flex';
        // force reflow
        void content.offsetWidth;
        content.style.opacity = '1';
        btn.innerHTML = `Fechar Dia ${d} <i data-lucide="chevron-up" style="width: 16px; height: 16px;"></i>`;
    } else {
        content.style.opacity = '0';
        setTimeout(() => { content.style.display = 'none'; }, 300);
        btn.innerHTML = `Abrir Dia ${d} <i data-lucide="chevron-down" style="width: 16px; height: 16px;"></i>`;
    }
    if (window.lucide) window.lucide.createIcons();
}

window.potencializarResultados = function() {
    alert("Ação em breve!");
}

function getInitialState() {
    const name = localStorage.getItem(STORAGE_KEYS.NAME) || "Guerreira";
    const weight = localStorage.getItem(STORAGE_KEYS.WEIGHT) || "0kg";
    const age = localStorage.getItem(STORAGE_KEYS.AGE) || "";
    const startDateStr = localStorage.getItem(STORAGE_KEYS.START_DATE);
    
    const completedDaysStr = localStorage.getItem('gm_completed_days');
    let completedDaysArr = [];
    if(completedDaysStr) {
        try { completedDaysArr = JSON.parse(completedDaysStr); } catch(e) {}
    }

    let currentDay = 1;
    let daysLeft = 29;

    if(completedDaysArr.length > 0) {
        currentDay = Math.max(...completedDaysArr) + 1;
    } else if (startDateStr) {
        const start = new Date(startDateStr);
        const now = new Date();
        const diffTime = Math.abs(now - start);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        currentDay = diffDays + 1;
    }
    
    currentDay = Math.min(30, currentDay);
    daysLeft = Math.max(0, 30 - currentDay);

    return {
        user: {
            name: name,
            age: age,
            weight: weight,
            currentDay: currentDay,
            daysLeft: daysLeft,
            progress: Math.floor((currentDay / 30) * 100),
            completedDays: completedDaysArr
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
    let timelineHTML = `<div class="timeline-container" style="margin-top: 30px; display: flex; flex-direction: column; gap: 15px; padding-bottom: 40px;">
        <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.1rem; color: var(--btn-yellow); margin-bottom: 5px;">Seu Protocolo Diário</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: -10px; margin-bottom: 5px;">Marque os dias concluídos para avançar na sua jornada!</p>
    `;

    for(let d=1; d<=30; d++) {
        let isCompleted = state.user.completedDays.includes(d);
        let isCurrent = d === state.user.currentDay;
        
        let cardStyle = isCompleted ? "background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.5); opacity: 0.75;" 
                     : (isCurrent ? "background: linear-gradient(135deg, rgba(219, 39, 119, 0.15), var(--card-bg)); border: 1px solid rgba(219, 39, 119, 0.7); box-shadow: 0 4px 15px rgba(219, 39, 119, 0.25);" 
                     : "background: var(--card-bg); border: 1px dashed rgba(255, 255, 255, 0.1); opacity: 0.45; filter: grayscale(1);");
        
        let disableToggle = (!isCompleted && !isCurrent) ? "pointer-events: none;" : "";
        let checkStyle = isCompleted ? "background: #10b981; color: white;" : (isCurrent ? "background: var(--btn-pink); color: white;" : "background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.2);");
        let checkText = isCompleted ? "<i data-lucide='check' style='width: 14px; height: 14px;'></i> Concluído" : "Dar Check";
        
        let dayRecipes = (typeof recipesDatabase !== 'undefined') ? recipesDatabase.filter(r => r.dayOfPlan == d) : [];
        let recipesHTML = '';
        if(dayRecipes.length > 0) {
            recipesHTML = `<div style="display: flex; gap: 8px; margin-top: 15px;">`;
            dayRecipes.forEach(rec => {
                recipesHTML += `
                <div onclick="window.openRecipeDialog(${rec.id})" style="flex: 1; background: rgba(0,0,0,0.3); border-radius: 12px; padding: 10px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.2s;">
                    <span style="font-size: 1.4rem; padding-bottom: 2px;">${rec.emoji}</span>
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-main); line-height: 1.1;">${rec.name}</span>
                        <span style="font-size: 0.65rem; color: var(--btn-yellow); font-weight: 600; margin-top: 2px;">Abrir Receita</span>
                    </div>
                </div>`;
            });
            recipesHTML += `</div>`;
        }
        
        timelineHTML += `
        <div class="day-card" style="border-radius: 16px; padding: 20px; transition: all 0.3s; position: relative; overflow: hidden; ${cardStyle}">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 42px; height: 42px; border-radius: 12px; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: 'Outfit'; font-size: 1.1rem; color: ${isCurrent ? 'var(--btn-yellow)' : 'inherit'};">
                        ${d}
                    </div>
                    <div>
                        <h4 style="margin: 0; font-size: 1.1rem; color: var(--text-main);">Dia ${d}</h4>
                        <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: ${isCurrent ? '600' : '400'};">${isCompleted ? 'Finalizado com sucesso!' : (isCurrent ? 'Seu foco de hoje!' : 'Bloqueado')}</span>
                    </div>
                </div>
                
                <button onclick="toggleDay(${d})" style="border: none; border-radius: 20px; padding: 8px 16px; font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.1); ${disableToggle} ${checkStyle}">
                    ${checkText}
                </button>
            </div>
            
            <button id="btn-abrir-dia-${d}" onclick="toggleAccordion(${d})" style="width: 100%; margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; color: var(--text-main); font-weight: 600; cursor: pointer; font-family: 'Outfit'; display: flex; justify-content: center; align-items: center; gap: 5px; transition: 0.2s;">
                Abrir Dia ${d} <i data-lucide="chevron-down" style="width: 16px; height: 16px;"></i>
            </button>
            
            <div id="content-dia-${d}" style="display: none; flex-direction: column; opacity: 0; transition: opacity 0.3s; margin-top: 5px;">
                ${recipesHTML}
                <button onclick="potencializarResultados()" style="width: 100%; margin-top: 15px; background: linear-gradient(135deg, #f59e0b, #d97706); border: none; border-radius: 12px; padding: 12px; color: white; font-weight: 800; font-size: 0.85rem; letter-spacing: 0.5px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3); transition: 0.2s; text-transform: uppercase;">
                    <i data-lucide="zap" style="width: 16px; height: 16px;"></i>
                    POTENCIALIZAR RESULTADOS
                </button>
            </div>
        </div>
        `;
    }
    timelineHTML += `</div>`;

    appMain.innerHTML = `
        <div class="view-animate">
            <button class="btn-menu btn-yellow" onclick="window.open('ebook_gelatina_mounjaro_final.pdf', '_blank')">
                <i data-lucide="book-open" style="width: 18px; height: 18px;"></i>
                ACESSAR AS 3 RECEITAS MAIS FAMOSAS
            </button>
            <p style="text-align: center; color: var(--text-muted); font-size: 0.8rem; margin-top: -8px; margin-bottom: 12px; font-style: italic;">✨ Rola pra baixo! Mais de 200 receitas bônus na aba inferior.</p>
            
            <button class="btn-menu btn-yellow" onclick="window.open('https://protocolo-gelatina-app.vercel.app/obrigado.html', '_blank')">
                <i data-lucide="file-text" style="width: 18px; height: 18px;"></i>
                ACESSAR INSTRUÇÕES
            </button>
            <button class="btn-menu btn-gradient" onclick="window.open('https://vip-mentoria-site.vercel.app', '_blank')">
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
                <div class="status-card" onclick="editWeight()" style="cursor: pointer; position: relative; background: linear-gradient(135deg, rgba(219,39,119,0.1), var(--card-bg)); border: 1px solid rgba(219,39,119,0.3); transition: 0.2s;" onmousedown="this.style.transform='scale(0.95)'" onmouseup="this.style.transform='scale(1)'">
                    <div style="position: absolute; top: 12px; right: 12px;"><i data-lucide="edit-2" style="width: 14px; height: 14px; color: var(--btn-pink); opacity: 0.8;"></i></div>
                    <i data-lucide="scale" style="color: var(--btn-pink); width: 24px; height: 24px;"></i>
                    <span class="status-value">${state.user.weight}</span>
                    <span class="status-label">Seu Peso Atual</span>
                </div>
                <div class="status-card">
                    <i data-lucide="calendar" style="color: var(--btn-yellow); width: 24px; height: 24px;"></i>
                    <span class="status-value">${state.user.daysLeft}</span>
                    <span class="status-label">Dias Restantes</span>
                </div>
            </div>

            <!-- Timeline Injetada -->
            ${timelineHTML}

        </div>
    `;
}
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
            
            // Força a exibição do popup de "Leia as Instruções" apenas no primeiro acesso
            if(!localStorage.getItem('sawAppNotifications')) {
                setTimeout(() => {
                    instModal.classList.add('show');
                    localStorage.setItem('sawAppNotifications', 'true');
                }, 600); // delay de segurança
            }
            
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
