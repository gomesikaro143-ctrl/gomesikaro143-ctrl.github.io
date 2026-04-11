import os
import re

paths = ["app.js", "entregavel-mounjaro/app.js", "novo-app-clonado/app.js"]

new_toggle_day = """window.toggleDay = function(e, dayNumber) {
    if(e) e.stopPropagation();
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

new_accordion = """window.toggleAccordion = function(d) {
    const content = document.getElementById('content-dia-' + d);
    if (!content) return;
    
    if(content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'flex';
        void content.offsetWidth;
        content.style.opacity = '1';
    } else {
        content.style.opacity = '0';
        setTimeout(() => { content.style.display = 'none'; }, 300);
    }
}"""

for p in paths:
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f:
            c = f.read()
        
        # 1. Update toggleDay
        c = re.sub(r'window\.toggleDay\s*=\s*function\(dayNumber\)\s*\{.*?(?=window\.toggleAccordion)', new_toggle_day + "\n\n", c, flags=re.DOTALL)
        
        # 2. Update toggleAccordion
        c = re.sub(r'window\.toggleAccordion\s*=\s*function\(d\)\s*\{.*?(?=window\.potencializarResultados)', new_accordion + "\n\n", c, flags=re.DOTALL)
        
        # 3. Make card clickable and fix cursor
        c = c.replace('class="day-card" style="border-radius', 'class="day-card" onclick="toggleAccordion(${d})" style="cursor: pointer; border-radius')
        
        # 4. Remove btn-abrir-dia
        c = re.sub(r'<button id="btn-abrir-dia-\$\{d\}".*?</button>\s*', '', c, flags=re.DOTALL)
        
        # 5. Update toggleDay calls
        c = c.replace('onclick="toggleDay(${d})"', 'onclick="toggleDay(event, ${d})"')
        
        with open(p, 'w', encoding='utf-8') as f:
            f.write(c)
        print("Patched UI clicks in", p)
