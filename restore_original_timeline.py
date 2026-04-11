import re
import os

paths = ["app.js", "entregavel-mounjaro/app.js", "novo-app-clonado/app.js"]

new_day_card_loop = """
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
"""

btn_potencializar = """
        <button onclick="window.potencializarResultados()" style="width: 100%; margin-top: 5px; margin-bottom: 20px; background: linear-gradient(135deg, #f59e0b, #d97706); border: none; border-radius: 12px; padding: 14px; color: white; font-weight: 800; font-size: 0.9rem; letter-spacing: 0.5px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3); transition: 0.3s; text-transform: uppercase;">
            <i data-lucide="zap" style="width: 18px; height: 18px;"></i>
            POTENCIALIZAR RESULTADOS
        </button>
    `;

    overlay.classList.add('show');
"""

# Restoring toggleDay signature
new_toggle_day = """window.toggleDay = function(dayNumber) {
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
}"""

for p in paths:
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f:
            c = f.read()

        # Revert toggleDay (remove event propagation logic)
        c = re.sub(r'window\.toggleDay\s*=\s*function\(e, dayNumber\)\s*\{.*?(?=window\.toggleAccordion)', new_toggle_day + "\n\n", c, flags=re.DOTALL)
        
        # We can remove toggleAccordion definition if we want, but keeping it is harmless
        # Let's replace the day loop in renderHome
        c = re.sub(r'let dayRecipes = \(typeof recipesDatabase.*?</div>\s*`;\s*(?=}\s*timelineHTML \+= `</div>`;)', new_day_card_loop, c, flags=re.DOTALL)

        # Inject Button directly into window.openRecipeDialog template END
        # Look for the end of the template literal inside openRecipeDialog:
        # </div>` : ''}\n    `;
        c = re.sub(r'</div>` : \'\'}\s*`;\s*overlay\.classList\.add\(\'show\'\);', btn_potencializar, c)

        with open(p, 'w', encoding='utf-8') as f:
            f.write(c)

        print("Patched UI back to classic with button inside modal:", p)

