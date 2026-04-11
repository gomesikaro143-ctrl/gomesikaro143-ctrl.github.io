import re
import os

paths = ["app.js", "entregavel-mounjaro/app.js", "novo-app-clonado/app.js"]

new_functions = """// Configurações e Persistência do App
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

function getInitialState() {"""

new_initial_state = """    const name = localStorage.getItem(STORAGE_KEYS.NAME) || "Guerreira";
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
}"""

new_render_home = """function renderHome() {
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
        
        // Disable click for locked
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
            ${(isCurrent || isCompleted) ? recipesHTML : ''}
        </div>
        `;
    }
    timelineHTML += `</div>`;

    appMain.innerHTML = `
        <div class="view-animate">
            <button class="btn-menu btn-yellow" onclick="window.open('ebook_gelatina_mounjaro_final.pdf', '_blank')">
                <i data-lucide="book-open" style="width: 18px; height: 18px;"></i>
                ACESSAR RECEITAS COMPLETAS
            </button>
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
}"""

for p in paths:
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8") as f:
            c = f.read()
        
        # 1. Update getInitialState
        c = re.sub(r'function getInitialState\(\) \{.*?(?=\nlet state = getInitialState\(\);)', lambda x: new_functions + "\n" + new_initial_state, c, flags=re.DOTALL)
        
        # 2. Update renderHome
        c = re.sub(r'function renderHome\(\) \{.*?(?=\n\}[\r\n]+//)', lambda x: new_render_home, c, flags=re.DOTALL)
        
        with open(p, "w", encoding="utf-8") as f:
            f.write(c)
        print(f"Updated {p}")
