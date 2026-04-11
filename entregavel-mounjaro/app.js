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
        <div class="day-card" onclick="toggleAccordion(${d})" style="cursor: pointer; border-radius: 16px; padding: 20px; transition: all 0.3s; position: relative; overflow: hidden; ${cardStyle}">
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
                
                <button onclick="toggleDay(event, ${d})" style="border: none; border-radius: 20px; padding: 8px 16px; font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.1); ${disableToggle} ${checkStyle}">
                    ${checkText}
                </button>
            </div>
            
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
// ----------------------------------------------------
// ABA DE CONTEÚDO (RECEITAS OFICIAIS)
// ----------------------------------------------------
const recipesCategories = ["Todas", "FIT", "Gelatinas", "Detox", "Beleza", "Relaxantes", "Shakes", "Almoço", "Jantar"];
const recipesDatabase = [
    {
        "id": 1,
        "name": "Gelatina Especial de Limão e Gengibre",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 1: Queima Gordura. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Gengibre, Adoçante natural stevia, Pedaços frescos de Limão",
        "instructions": "1. Prepare o chá de Gengibre quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Limão.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Gengibre para chá\n• Limão\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 1
    },
    {
        "id": 2,
        "name": "Chá Detox Noturno de Canela",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 1: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Canela, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Canela e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Canela\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 1
    },
    {
        "id": 3,
        "name": "Gelatina Especial de Abacaxi e Canela",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 2: Efeito Diurético. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Canela, Adoçante natural stevia, Pedaços frescos de Abacaxi",
        "instructions": "1. Prepare o chá de Canela quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Abacaxi.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Canela para chá\n• Abacaxi\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 2
    },
    {
        "id": 4,
        "name": "Chá Detox Noturno de Camomila",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 2: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Camomila, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Camomila e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Camomila\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 2
    },
    {
        "id": 5,
        "name": "Gelatina Especial de Maracujá e Camomila",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 3: Zero Inchaço. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Camomila, Adoçante natural stevia, Pedaços frescos de Maracujá",
        "instructions": "1. Prepare o chá de Camomila quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Maracujá.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Camomila para chá\n• Maracujá\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 3
    },
    {
        "id": 6,
        "name": "Chá Detox Noturno de Hibisco",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 3: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Hibisco, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Hibisco e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Hibisco\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 3
    },
    {
        "id": 7,
        "name": "Gelatina Especial de Uva e Hibisco",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 4: Mais Saciedade. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Hibisco, Adoçante natural stevia, Pedaços frescos de Uva",
        "instructions": "1. Prepare o chá de Hibisco quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Uva.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Hibisco para chá\n• Uva\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 4
    },
    {
        "id": 8,
        "name": "Chá Detox Noturno de Erva-Doce",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 4: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Erva-Doce, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Erva-Doce e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Erva-Doce\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 4
    },
    {
        "id": 9,
        "name": "Gelatina Especial de Mirtilo e Erva-Doce",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 5: Ação Antioxidante. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Erva-Doce, Adoçante natural stevia, Pedaços frescos de Mirtilo",
        "instructions": "1. Prepare o chá de Erva-Doce quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Mirtilo.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Erva-Doce para chá\n• Mirtilo\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 5
    },
    {
        "id": 10,
        "name": "Chá Detox Noturno de Alecrim",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 5: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Alecrim, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Alecrim e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Alecrim\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 5
    },
    {
        "id": 11,
        "name": "Gelatina Especial de Maçã e Alecrim",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 6: Detox Corporal. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Alecrim, Adoçante natural stevia, Pedaços frescos de Maçã",
        "instructions": "1. Prepare o chá de Alecrim quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Maçã.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Alecrim para chá\n• Maçã\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 6
    },
    {
        "id": 12,
        "name": "Chá Detox Noturno de Capim-Limão",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 6: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Capim-Limão, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Capim-Limão e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Capim-Limão\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 6
    },
    {
        "id": 13,
        "name": "Gelatina Especial de Kiwi e Capim-Limão",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 7: Seca Barriga. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Capim-Limão, Adoçante natural stevia, Pedaços frescos de Kiwi",
        "instructions": "1. Prepare o chá de Capim-Limão quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Kiwi.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Capim-Limão para chá\n• Kiwi\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 7
    },
    {
        "id": 14,
        "name": "Chá Detox Noturno de Cidreira",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 7: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Cidreira, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Cidreira e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Cidreira\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 7
    },
    {
        "id": 15,
        "name": "Gelatina Especial de Framboesa e Cidreira",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 8: Ação Termogênica. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Cidreira, Adoçante natural stevia, Pedaços frescos de Framboesa",
        "instructions": "1. Prepare o chá de Cidreira quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Framboesa.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Cidreira para chá\n• Framboesa\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 8
    },
    {
        "id": 16,
        "name": "Chá Detox Noturno de Matchá",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 8: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Matchá, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Matchá e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Matchá\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 8
    },
    {
        "id": 17,
        "name": "Gelatina Especial de Amora e Matchá",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 9: Reduz Fome Noturna. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Matchá, Adoçante natural stevia, Pedaços frescos de Amora",
        "instructions": "1. Prepare o chá de Matchá quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Amora.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Matchá para chá\n• Amora\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 9
    },
    {
        "id": 18,
        "name": "Chá Detox Noturno de Hortelã",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 9: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Hortelã, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Hortelã e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Hortelã\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 9
    },
    {
        "id": 19,
        "name": "Gelatina Especial de Morango e Hortelã",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 10: Acelera Metabolismo. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Hortelã, Adoçante natural stevia, Pedaços frescos de Morango",
        "instructions": "1. Prepare o chá de Hortelã quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Morango.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Hortelã para chá\n• Morango\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 10
    },
    {
        "id": 20,
        "name": "Chá Detox Noturno de Gengibre",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 10: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Gengibre, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Gengibre e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Gengibre\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 10
    },
    {
        "id": 21,
        "name": "Gelatina Especial de Limão e Gengibre",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 11: Queima Gordura. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Gengibre, Adoçante natural stevia, Pedaços frescos de Limão",
        "instructions": "1. Prepare o chá de Gengibre quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Limão.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Gengibre para chá\n• Limão\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 11
    },
    {
        "id": 22,
        "name": "Chá Detox Noturno de Canela",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 11: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Canela, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Canela e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Canela\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 11
    },
    {
        "id": 23,
        "name": "Gelatina Especial de Abacaxi e Canela",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 12: Efeito Diurético. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Canela, Adoçante natural stevia, Pedaços frescos de Abacaxi",
        "instructions": "1. Prepare o chá de Canela quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Abacaxi.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Canela para chá\n• Abacaxi\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 12
    },
    {
        "id": 24,
        "name": "Chá Detox Noturno de Camomila",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 12: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Camomila, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Camomila e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Camomila\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 12
    },
    {
        "id": 25,
        "name": "Gelatina Especial de Maracujá e Camomila",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 13: Zero Inchaço. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Camomila, Adoçante natural stevia, Pedaços frescos de Maracujá",
        "instructions": "1. Prepare o chá de Camomila quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Maracujá.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Camomila para chá\n• Maracujá\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 13
    },
    {
        "id": 26,
        "name": "Chá Detox Noturno de Hibisco",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 13: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Hibisco, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Hibisco e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Hibisco\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 13
    },
    {
        "id": 27,
        "name": "Gelatina Especial de Uva e Hibisco",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 14: Mais Saciedade. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Hibisco, Adoçante natural stevia, Pedaços frescos de Uva",
        "instructions": "1. Prepare o chá de Hibisco quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Uva.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Hibisco para chá\n• Uva\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 14
    },
    {
        "id": 28,
        "name": "Chá Detox Noturno de Erva-Doce",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 14: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Erva-Doce, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Erva-Doce e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Erva-Doce\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 14
    },
    {
        "id": 29,
        "name": "Gelatina Especial de Mirtilo e Erva-Doce",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 15: Ação Antioxidante. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Erva-Doce, Adoçante natural stevia, Pedaços frescos de Mirtilo",
        "instructions": "1. Prepare o chá de Erva-Doce quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Mirtilo.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Erva-Doce para chá\n• Mirtilo\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 15
    },
    {
        "id": 30,
        "name": "Chá Detox Noturno de Alecrim",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 15: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Alecrim, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Alecrim e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Alecrim\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 15
    },
    {
        "id": 31,
        "name": "Gelatina Especial de Maçã e Alecrim",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 16: Detox Corporal. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Alecrim, Adoçante natural stevia, Pedaços frescos de Maçã",
        "instructions": "1. Prepare o chá de Alecrim quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Maçã.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Alecrim para chá\n• Maçã\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 16
    },
    {
        "id": 32,
        "name": "Chá Detox Noturno de Capim-Limão",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 16: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Capim-Limão, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Capim-Limão e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Capim-Limão\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 16
    },
    {
        "id": 33,
        "name": "Gelatina Especial de Kiwi e Capim-Limão",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 17: Seca Barriga. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Capim-Limão, Adoçante natural stevia, Pedaços frescos de Kiwi",
        "instructions": "1. Prepare o chá de Capim-Limão quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Kiwi.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Capim-Limão para chá\n• Kiwi\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 17
    },
    {
        "id": 34,
        "name": "Chá Detox Noturno de Cidreira",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 17: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Cidreira, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Cidreira e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Cidreira\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 17
    },
    {
        "id": 35,
        "name": "Gelatina Especial de Framboesa e Cidreira",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 18: Ação Termogênica. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Cidreira, Adoçante natural stevia, Pedaços frescos de Framboesa",
        "instructions": "1. Prepare o chá de Cidreira quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Framboesa.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Cidreira para chá\n• Framboesa\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 18
    },
    {
        "id": 36,
        "name": "Chá Detox Noturno de Matchá",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 18: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Matchá, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Matchá e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Matchá\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 18
    },
    {
        "id": 37,
        "name": "Gelatina Especial de Amora e Matchá",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 19: Reduz Fome Noturna. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Matchá, Adoçante natural stevia, Pedaços frescos de Amora",
        "instructions": "1. Prepare o chá de Matchá quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Amora.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Matchá para chá\n• Amora\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 19
    },
    {
        "id": 38,
        "name": "Chá Detox Noturno de Hortelã",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 19: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Hortelã, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Hortelã e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Hortelã\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 19
    },
    {
        "id": 39,
        "name": "Gelatina Especial de Morango e Hortelã",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 20: Acelera Metabolismo. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Hortelã, Adoçante natural stevia, Pedaços frescos de Morango",
        "instructions": "1. Prepare o chá de Hortelã quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Morango.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Hortelã para chá\n• Morango\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 20
    },
    {
        "id": 40,
        "name": "Chá Detox Noturno de Gengibre",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 20: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Gengibre, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Gengibre e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Gengibre\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 20
    },
    {
        "id": 41,
        "name": "Gelatina Especial de Limão e Gengibre",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 21: Queima Gordura. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Gengibre, Adoçante natural stevia, Pedaços frescos de Limão",
        "instructions": "1. Prepare o chá de Gengibre quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Limão.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Gengibre para chá\n• Limão\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 21
    },
    {
        "id": 42,
        "name": "Chá Detox Noturno de Canela",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 21: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Canela, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Canela e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Canela\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 21
    },
    {
        "id": 43,
        "name": "Gelatina Especial de Abacaxi e Canela",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 22: Efeito Diurético. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Canela, Adoçante natural stevia, Pedaços frescos de Abacaxi",
        "instructions": "1. Prepare o chá de Canela quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Abacaxi.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Canela para chá\n• Abacaxi\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 22
    },
    {
        "id": 44,
        "name": "Chá Detox Noturno de Camomila",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 22: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Camomila, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Camomila e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Camomila\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 22
    },
    {
        "id": 45,
        "name": "Gelatina Especial de Maracujá e Camomila",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 23: Zero Inchaço. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Camomila, Adoçante natural stevia, Pedaços frescos de Maracujá",
        "instructions": "1. Prepare o chá de Camomila quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Maracujá.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Camomila para chá\n• Maracujá\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 23
    },
    {
        "id": 46,
        "name": "Chá Detox Noturno de Hibisco",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 23: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Hibisco, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Hibisco e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Hibisco\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 23
    },
    {
        "id": 47,
        "name": "Gelatina Especial de Uva e Hibisco",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 24: Mais Saciedade. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Hibisco, Adoçante natural stevia, Pedaços frescos de Uva",
        "instructions": "1. Prepare o chá de Hibisco quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Uva.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Hibisco para chá\n• Uva\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 24
    },
    {
        "id": 48,
        "name": "Chá Detox Noturno de Erva-Doce",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 24: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Erva-Doce, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Erva-Doce e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Erva-Doce\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 24
    },
    {
        "id": 49,
        "name": "Gelatina Especial de Mirtilo e Erva-Doce",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 25: Ação Antioxidante. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Erva-Doce, Adoçante natural stevia, Pedaços frescos de Mirtilo",
        "instructions": "1. Prepare o chá de Erva-Doce quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Mirtilo.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Erva-Doce para chá\n• Mirtilo\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 25
    },
    {
        "id": 50,
        "name": "Chá Detox Noturno de Alecrim",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 25: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Alecrim, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Alecrim e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Alecrim\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 25
    },
    {
        "id": 51,
        "name": "Gelatina Especial de Maçã e Alecrim",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 26: Detox Corporal. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Alecrim, Adoçante natural stevia, Pedaços frescos de Maçã",
        "instructions": "1. Prepare o chá de Alecrim quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Maçã.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Alecrim para chá\n• Maçã\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 26
    },
    {
        "id": 52,
        "name": "Chá Detox Noturno de Capim-Limão",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 26: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Capim-Limão, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Capim-Limão e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Capim-Limão\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 26
    },
    {
        "id": 53,
        "name": "Gelatina Especial de Kiwi e Capim-Limão",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 27: Seca Barriga. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Capim-Limão, Adoçante natural stevia, Pedaços frescos de Kiwi",
        "instructions": "1. Prepare o chá de Capim-Limão quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Kiwi.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Capim-Limão para chá\n• Kiwi\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 27
    },
    {
        "id": 54,
        "name": "Chá Detox Noturno de Cidreira",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 27: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Cidreira, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Cidreira e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Cidreira\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 27
    },
    {
        "id": 55,
        "name": "Gelatina Especial de Framboesa e Cidreira",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 28: Ação Termogênica. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Cidreira, Adoçante natural stevia, Pedaços frescos de Framboesa",
        "instructions": "1. Prepare o chá de Cidreira quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Framboesa.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Cidreira para chá\n• Framboesa\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 28
    },
    {
        "id": 56,
        "name": "Chá Detox Noturno de Matchá",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 28: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Matchá, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Matchá e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Matchá\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 28
    },
    {
        "id": 57,
        "name": "Gelatina Especial de Amora e Matchá",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 29: Reduz Fome Noturna. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Matchá, Adoçante natural stevia, Pedaços frescos de Amora",
        "instructions": "1. Prepare o chá de Matchá quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Amora.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Matchá para chá\n• Amora\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 29
    },
    {
        "id": 58,
        "name": "Chá Detox Noturno de Hortelã",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 29: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Hortelã, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Hortelã e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Hortelã\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 29
    },
    {
        "id": 59,
        "name": "Gelatina Especial de Morango e Hortelã",
        "category": "Gelatinas",
        "time": "15 min",
        "emoji": "🍮",
        "desc": "✨ Receita Oficial - Dia 30: Acelera Metabolismo. Combinação potente para ativar o termogênico natural do corpo antes do almoço.",
        "ingredients": "1 sachê (12g) de gelatina incolor, 250ml de chá de Hortelã, Adoçante natural stevia, Pedaços frescos de Morango",
        "instructions": "1. Prepare o chá de Hortelã quente.\n2. Dilua a gelatina incolor no chá quente mexendo bem para não empelotar.\n3. Adicione o adoçante a gosto e os pedaços de Morango.\n4. Leve à geladeira por 3 horas até firmar.",
        "shoppingList": "• Gelatina incolor sem sabor\n• Hortelã para chá\n• Morango\n• Stevia 100% natural",
        "schedule": "Meio-dia (Consumir 30 minutos antes do almoço)",
        "dayOfPlan": 30
    },
    {
        "id": 60,
        "name": "Chá Detox Noturno de Gengibre",
        "category": "Detox",
        "time": "10 min",
        "emoji": "🍵",
        "desc": "✨ Complemento - Dia 30: Limpa o fígado enquanto você dorme e prepara o intestino para a queima matinal.",
        "ingredients": "1 colher de sopa de Gengibre, 200ml de água filtrada, 1/2 limão espremido na hora",
        "instructions": "1. Ferva a água e desligue o fogo.\n2. Adicione a Gengibre e abafe (infusão) por 7 minutos.\n3. Coe e esprema o limão apenas no momento exato em que for beber.",
        "shoppingList": "• Erva Gengibre\n• Limões frescos",
        "schedule": "Noite (Consumir 40 minutos antes de dormir)",
        "dayOfPlan": 30
    },
    {
        "id": 61,
        "name": "Shake Saciedade de Morango",
        "category": "Shakes",
        "time": "5 min",
        "emoji": "🥤",
        "desc": "Substituição completa e nutritiva que tira a fome desesperadora da tarde.",
        "ingredients": "200ml de leite de amêndoas, 1 colher de Whey Protein ou Colágeno Verisol, 1 rodela de Morango, Gelo a gosto",
        "instructions": "Bata tudo no liquidificador até ficar muito cremoso. Beba imediatamente.",
        "shoppingList": "• Leite Vegetal (Amêndoas ou Coco)\n• Whey Protein\n• Morango",
        "schedule": "Lanche da tarde (Sempre que a fome apertar)"
    },
    {
        "id": 62,
        "name": "Shake Saciedade de Limão",
        "category": "Shakes",
        "time": "5 min",
        "emoji": "🥤",
        "desc": "Substituição completa e nutritiva que tira a fome desesperadora da tarde.",
        "ingredients": "200ml de leite de amêndoas, 1 colher de Whey Protein ou Colágeno Verisol, 1 rodela de Limão, Gelo a gosto",
        "instructions": "Bata tudo no liquidificador até ficar muito cremoso. Beba imediatamente.",
        "shoppingList": "• Leite Vegetal (Amêndoas ou Coco)\n• Whey Protein\n• Limão",
        "schedule": "Lanche da tarde (Sempre que a fome apertar)"
    },
    {
        "id": 63,
        "name": "Shake Saciedade de Abacaxi",
        "category": "Shakes",
        "time": "5 min",
        "emoji": "🥤",
        "desc": "Substituição completa e nutritiva que tira a fome desesperadora da tarde.",
        "ingredients": "200ml de leite de amêndoas, 1 colher de Whey Protein ou Colágeno Verisol, 1 rodela de Abacaxi, Gelo a gosto",
        "instructions": "Bata tudo no liquidificador até ficar muito cremoso. Beba imediatamente.",
        "shoppingList": "• Leite Vegetal (Amêndoas ou Coco)\n• Whey Protein\n• Abacaxi",
        "schedule": "Lanche da tarde (Sempre que a fome apertar)"
    },
    {
        "id": 64,
        "name": "Shake Saciedade de Maracujá",
        "category": "Shakes",
        "time": "5 min",
        "emoji": "🥤",
        "desc": "Substituição completa e nutritiva que tira a fome desesperadora da tarde.",
        "ingredients": "200ml de leite de amêndoas, 1 colher de Whey Protein ou Colágeno Verisol, 1 rodela de Maracujá, Gelo a gosto",
        "instructions": "Bata tudo no liquidificador até ficar muito cremoso. Beba imediatamente.",
        "shoppingList": "• Leite Vegetal (Amêndoas ou Coco)\n• Whey Protein\n• Maracujá",
        "schedule": "Lanche da tarde (Sempre que a fome apertar)"
    },
    {
        "id": 65,
        "name": "Shake Saciedade de Uva",
        "category": "Shakes",
        "time": "5 min",
        "emoji": "🥤",
        "desc": "Substituição completa e nutritiva que tira a fome desesperadora da tarde.",
        "ingredients": "200ml de leite de amêndoas, 1 colher de Whey Protein ou Colágeno Verisol, 1 rodela de Uva, Gelo a gosto",
        "instructions": "Bata tudo no liquidificador até ficar muito cremoso. Beba imediatamente.",
        "shoppingList": "• Leite Vegetal (Amêndoas ou Coco)\n• Whey Protein\n• Uva",
        "schedule": "Lanche da tarde (Sempre que a fome apertar)"
    },
    {
        "id": 66,
        "name": "Shake Saciedade de Mirtilo",
        "category": "Shakes",
        "time": "5 min",
        "emoji": "🥤",
        "desc": "Substituição completa e nutritiva que tira a fome desesperadora da tarde.",
        "ingredients": "200ml de leite de amêndoas, 1 colher de Whey Protein ou Colágeno Verisol, 1 rodela de Mirtilo, Gelo a gosto",
        "instructions": "Bata tudo no liquidificador até ficar muito cremoso. Beba imediatamente.",
        "shoppingList": "• Leite Vegetal (Amêndoas ou Coco)\n• Whey Protein\n• Mirtilo",
        "schedule": "Lanche da tarde (Sempre que a fome apertar)"
    },
    {
        "id": 67,
        "name": "Shake Saciedade de Maçã",
        "category": "Shakes",
        "time": "5 min",
        "emoji": "🥤",
        "desc": "Substituição completa e nutritiva que tira a fome desesperadora da tarde.",
        "ingredients": "200ml de leite de amêndoas, 1 colher de Whey Protein ou Colágeno Verisol, 1 rodela de Maçã, Gelo a gosto",
        "instructions": "Bata tudo no liquidificador até ficar muito cremoso. Beba imediatamente.",
        "shoppingList": "• Leite Vegetal (Amêndoas ou Coco)\n• Whey Protein\n• Maçã",
        "schedule": "Lanche da tarde (Sempre que a fome apertar)"
    },
    {
        "id": 68,
        "name": "Shake Saciedade de Kiwi",
        "category": "Shakes",
        "time": "5 min",
        "emoji": "🥤",
        "desc": "Substituição completa e nutritiva que tira a fome desesperadora da tarde.",
        "ingredients": "200ml de leite de amêndoas, 1 colher de Whey Protein ou Colágeno Verisol, 1 rodela de Kiwi, Gelo a gosto",
        "instructions": "Bata tudo no liquidificador até ficar muito cremoso. Beba imediatamente.",
        "shoppingList": "• Leite Vegetal (Amêndoas ou Coco)\n• Whey Protein\n• Kiwi",
        "schedule": "Lanche da tarde (Sempre que a fome apertar)"
    },
    {
        "id": 69,
        "name": "Shake Saciedade de Framboesa",
        "category": "Shakes",
        "time": "5 min",
        "emoji": "🥤",
        "desc": "Substituição completa e nutritiva que tira a fome desesperadora da tarde.",
        "ingredients": "200ml de leite de amêndoas, 1 colher de Whey Protein ou Colágeno Verisol, 1 rodela de Framboesa, Gelo a gosto",
        "instructions": "Bata tudo no liquidificador até ficar muito cremoso. Beba imediatamente.",
        "shoppingList": "• Leite Vegetal (Amêndoas ou Coco)\n• Whey Protein\n• Framboesa",
        "schedule": "Lanche da tarde (Sempre que a fome apertar)"
    },
    {
        "id": 70,
        "name": "Shake Saciedade de Amora",
        "category": "Shakes",
        "time": "5 min",
        "emoji": "🥤",
        "desc": "Substituição completa e nutritiva que tira a fome desesperadora da tarde.",
        "ingredients": "200ml de leite de amêndoas, 1 colher de Whey Protein ou Colágeno Verisol, 1 rodela de Amora, Gelo a gosto",
        "instructions": "Bata tudo no liquidificador até ficar muito cremoso. Beba imediatamente.",
        "shoppingList": "• Leite Vegetal (Amêndoas ou Coco)\n• Whey Protein\n• Amora",
        "schedule": "Lanche da tarde (Sempre que a fome apertar)"
    },
    {
        "id": 71,
        "name": "Almoço Low-Carb Grelhado",
        "category": "Almoço",
        "time": "30 min",
        "emoji": "🥗",
        "desc": "Proteína magra para reconstrução e pele firme enquanto emagrece.",
        "ingredients": "150g de peito de frango ou peixe branco, 1 xícara de vegetais verdes, Azeite, Sal e Ervas finas",
        "instructions": "Tempere a proteína apenas com sal, limão e ervas. Grelhe com 1 fio de azeite. Acompanhe com salada de folhas.",
        "shoppingList": "• Proteína Magra\n• Folhas Verdes\n• Azeite Extra Virgem",
        "schedule": "Almoço"
    },
    {
        "id": 72,
        "name": "Almoço Low-Carb Assado",
        "category": "Almoço",
        "time": "30 min",
        "emoji": "🥗",
        "desc": "Proteína magra para reconstrução e pele firme enquanto emagrece.",
        "ingredients": "150g de peito de frango ou peixe branco, 1 xícara de vegetais verdes, Azeite, Sal e Ervas finas",
        "instructions": "Tempere a proteína apenas com sal, limão e ervas. Grelhe com 1 fio de azeite. Acompanhe com salada de folhas.",
        "shoppingList": "• Proteína Magra\n• Folhas Verdes\n• Azeite Extra Virgem",
        "schedule": "Almoço"
    },
    {
        "id": 73,
        "name": "Almoço Low-Carb Grelhado",
        "category": "Almoço",
        "time": "30 min",
        "emoji": "🥗",
        "desc": "Proteína magra para reconstrução e pele firme enquanto emagrece.",
        "ingredients": "150g de peito de frango ou peixe branco, 1 xícara de vegetais verdes, Azeite, Sal e Ervas finas",
        "instructions": "Tempere a proteína apenas com sal, limão e ervas. Grelhe com 1 fio de azeite. Acompanhe com salada de folhas.",
        "shoppingList": "• Proteína Magra\n• Folhas Verdes\n• Azeite Extra Virgem",
        "schedule": "Almoço"
    },
    {
        "id": 74,
        "name": "Almoço Low-Carb Assado",
        "category": "Almoço",
        "time": "30 min",
        "emoji": "🥗",
        "desc": "Proteína magra para reconstrução e pele firme enquanto emagrece.",
        "ingredients": "150g de peito de frango ou peixe branco, 1 xícara de vegetais verdes, Azeite, Sal e Ervas finas",
        "instructions": "Tempere a proteína apenas com sal, limão e ervas. Grelhe com 1 fio de azeite. Acompanhe com salada de folhas.",
        "shoppingList": "• Proteína Magra\n• Folhas Verdes\n• Azeite Extra Virgem",
        "schedule": "Almoço"
    },
    {
        "id": 75,
        "name": "Almoço Low-Carb Grelhado",
        "category": "Almoço",
        "time": "30 min",
        "emoji": "🥗",
        "desc": "Proteína magra para reconstrução e pele firme enquanto emagrece.",
        "ingredients": "150g de peito de frango ou peixe branco, 1 xícara de vegetais verdes, Azeite, Sal e Ervas finas",
        "instructions": "Tempere a proteína apenas com sal, limão e ervas. Grelhe com 1 fio de azeite. Acompanhe com salada de folhas.",
        "shoppingList": "• Proteína Magra\n• Folhas Verdes\n• Azeite Extra Virgem",
        "schedule": "Almoço"
    },
    {
        "id": 76,
        "name": "Caldo Seca Barriga Noturno",
        "category": "Jantar",
        "time": "25 min",
        "emoji": "🥘",
        "desc": "Um jantar levíssimo que te fará acordar desinchada.",
        "ingredients": "1 chuchu, 1/2 cenoura rasa, 1 pitada de gengibre, 100g de frango desfiado, Pimenta preta",
        "instructions": "Cozinhe o chuchu e a cenoura até derreter, bata no liquidificador. Volte pra panela, adicione o frango e os temperos.",
        "shoppingList": "• Chuchu e Cenoura\n• Gengibre\n• Peito de frango",
        "schedule": "Jantar (até as 20h00)"
    },
    {
        "id": 77,
        "name": "Caldo Seca Barriga Noturno",
        "category": "Jantar",
        "time": "25 min",
        "emoji": "🥘",
        "desc": "Um jantar levíssimo que te fará acordar desinchada.",
        "ingredients": "1 chuchu, 1/2 cenoura rasa, 1 pitada de gengibre, 100g de frango desfiado, Pimenta preta",
        "instructions": "Cozinhe o chuchu e a cenoura até derreter, bata no liquidificador. Volte pra panela, adicione o frango e os temperos.",
        "shoppingList": "• Chuchu e Cenoura\n• Gengibre\n• Peito de frango",
        "schedule": "Jantar (até as 20h00)"
    },
    {
        "id": 78,
        "name": "Caldo Seca Barriga Noturno",
        "category": "Jantar",
        "time": "25 min",
        "emoji": "🥘",
        "desc": "Um jantar levíssimo que te fará acordar desinchada.",
        "ingredients": "1 chuchu, 1/2 cenoura rasa, 1 pitada de gengibre, 100g de frango desfiado, Pimenta preta",
        "instructions": "Cozinhe o chuchu e a cenoura até derreter, bata no liquidificador. Volte pra panela, adicione o frango e os temperos.",
        "shoppingList": "• Chuchu e Cenoura\n• Gengibre\n• Peito de frango",
        "schedule": "Jantar (até as 20h00)"
    },
    {
        "id": 79,
        "name": "Caldo Seca Barriga Noturno",
        "category": "Jantar",
        "time": "25 min",
        "emoji": "🥘",
        "desc": "Um jantar levíssimo que te fará acordar desinchada.",
        "ingredients": "1 chuchu, 1/2 cenoura rasa, 1 pitada de gengibre, 100g de frango desfiado, Pimenta preta",
        "instructions": "Cozinhe o chuchu e a cenoura até derreter, bata no liquidificador. Volte pra panela, adicione o frango e os temperos.",
        "shoppingList": "• Chuchu e Cenoura\n• Gengibre\n• Peito de frango",
        "schedule": "Jantar (até as 20h00)"
    },
    {
        "id": 80,
        "name": "Caldo Seca Barriga Noturno",
        "category": "Jantar",
        "time": "25 min",
        "emoji": "🥘",
        "desc": "Um jantar levíssimo que te fará acordar desinchada.",
        "ingredients": "1 chuchu, 1/2 cenoura rasa, 1 pitada de gengibre, 100g de frango desfiado, Pimenta preta",
        "instructions": "Cozinhe o chuchu e a cenoura até derreter, bata no liquidificador. Volte pra panela, adicione o frango e os temperos.",
        "shoppingList": "• Chuchu e Cenoura\n• Gengibre\n• Peito de frango",
        "schedule": "Jantar (até as 20h00)"
    }
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

        <!-- Recipe Details Bottom Sheet -->
        <div id="recipe-sheet-overlay" class="sheet-overlay" onclick="closeRecipeDialog(event)">
            <div class="bottom-sheet view-animate" id="recipe-sheet-content">
                <!-- Content injected via JS -->
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
            ${recipe.dayOfPlan ? '<span class="badge" style="background: linear-gradient(135deg, hsl(330, 80%, 55%), hsl(270, 91%, 65%)); color: white; border: none; font-weight: bold;"><i data-lucide="calendar" style="width:14px;height:14px; color: white;"></i> DIA ' + recipe.dayOfPlan + '</span>' : ''}
        </div>

        ${recipe.desc ? '<p class="sheet-desc" style="font-size: 0.95rem; line-height: 1.5; color: var(--text-muted); margin-bottom: 20px;">' + recipe.desc + '</p>' : ''}
        
        ${recipe.schedule ? `
        <div class="sheet-box" style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.4); margin-bottom: 12px; padding: 16px;">
            <span class="box-label" style="color: #10b981; font-weight: 800; font-size: 0.8rem; letter-spacing: 0.5px;">⏰ MELHOR HORÁRIO PARA TOMAR</span>
            <p style="font-weight: 600; font-size: 0.95rem; color: var(--foreground); margin-top: 6px;">${recipe.schedule}</p>
        </div>` : ''}

        ${recipe.shoppingList ? `
        <div class="sheet-box" style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.4); margin-bottom: 12px; padding: 16px;">
            <span class="box-label" style="color: #38bdf8; font-weight: 800; font-size: 0.8rem; letter-spacing: 0.5px;">🛒 LISTA DE COMPRAS</span>
            <p style="white-space: pre-line; color: var(--text-main); font-size: 0.95rem; margin-top: 6px; line-height: 1.6;">${recipe.shoppingList}</p>
        </div>` : ''}

        ${recipe.ingredients ? `
        <div class="sheet-box" style="margin-bottom: 12px; padding: 16px;">
            <span class="box-label" style="color: #d946ef; font-weight: 800; font-size: 0.8rem; letter-spacing: 0.5px;">INGREDIENTES</span>
            <p style="color: var(--text-main); font-size: 0.95rem; margin-top: 6px; line-height: 1.6;">${recipe.ingredients}</p>
        </div>` : ''}

        ${recipe.instructions ? `
        <div class="sheet-box" style="margin-bottom: 20px; padding: 16px;">
            <span class="box-label" style="color: #facc15; font-weight: 800; font-size: 0.8rem; letter-spacing: 0.5px;">MODO DE PREPARO (COMO FAZER)</span>
            <p style="white-space: pre-line; color: var(--text-main); font-size: 0.95rem; margin-top: 6px; line-height: 1.6;">${recipe.instructions}</p>
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
            
            // Força a exibição do popup de "Leia as Instruções" apenas no primeiro acesso do cliente
            if(!localStorage.getItem('sawAppNotifications')) {
                setTimeout(() => {
                    instModal.classList.add('show');
                    localStorage.setItem('sawAppNotifications', 'true');
                }, 600); // delay de segurança para animação principal terminar
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
