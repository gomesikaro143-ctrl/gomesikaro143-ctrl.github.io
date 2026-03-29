const state = {
    activeTab: 'home',
    userName: 'ikaro gomes',
    currentDay: 7,
    totalDays: 21,
    weightLost: 8,
    progressPercent: 44
};

const appMain = document.getElementById('app-main');
const navItems = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('page-title');

// Templates for different views
const templates = {
    home: () => `
        <div class="view-animate">
            <section class="card progress-card">
                <div class="flex-between">
                    <h3>Dia ${state.currentDay} de ${state.totalDays}</h3>
                    <span class="muted">${Math.round((state.currentDay/state.totalDays)*100)}% concluído</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${(state.currentDay/state.totalDays)*100}%"></div>
                </div>
            </section>

            <section class="feature-buttons">
                <button class="feature-btn highlight">
                    <i data-lucide="flame"></i>
                    <span>Mounjaro de Pobre</span>
                    <div class="glow-effect"></div>
                </button>
                <button class="feature-btn">
                    <img src="assets/poster.png" style="width: 50px; height: 50px; border-radius: 12px; object-fit: cover; margin-right: 15px;">
                    <span>Desafio 21D</span>
                </button>
            </section>

            <section class="daily-recipe">
                <h3 class="section-title">Receita do dia 🥗</h3>
                <div class="recipe-card card">
                    <div class="recipe-image-placeholder" style="background: url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400') center/cover;"></div>
                    <div class="recipe-info">
                        <h4>Torrada com Ovo Poché</h4>
                        <p class="muted">A combinação perfeita de proteínas e gorduras boas para o seu dia.</p>
                        <button class="small-btn">Ver receita</button>
                    </div>
                </div>
            </section>
        </div>
    `,
    content: () => `
        <div class="view-animate">
            <h3 class="section-title">Módulos do Curso</h3>
            <div class="module-list">
                ${['Mentalidade Blindada', 'O Protocolo Gelatina', 'Cardápio Semanal', 'Exercícios em Casa'].map((item, i) => `
                    <div class="card module-card">
                        <div class="module-icon">${i+1}</div>
                        <div class="module-info">
                            <h4>${item}</h4>
                            <span class="muted">12 aulas • 85% concluído</span>
                        </div>
                        <i data-lucide="chevron-right"></i>
                    </div>
                `).join('')}
            </div>
        </div>
    `,
    progress: () => `
        <div class="view-animate">
            <div class="stats-grid">
                <div class="card stat-item">
                    <span class="stat-label">Peso Perdido</span>
                    <span class="stat-value highlight-text">${state.weightLost} kg</span>
                </div>
                <div class="card stat-item">
                    <span class="stat-label">Dias Ativos</span>
                    <span class="stat-value highlight-text">${state.currentDay} dias</span>
                </div>
            </div>
            
            <section class="chart-box card">
                <h3>Sua Evolução</h3>
                <div class="chart-placeholder">
                    <!-- Simple bar visualization -->
                    <div class="bars">
                        ${[20, 35, 45, 60, 55, 75, 80].map(h => `<div class="bar" style="height: ${h}%"></div>`).join('')}
                    </div>
                </div>
            </section>
        </div>
    `,
    tools: () => `
        <div class="view-animate">
            <h3 class="section-title">Ferramentas Extras</h3>
            <div class="tools-grid">
                <div class="card tool-card">
                    <i data-lucide="calculator"></i>
                    <h4>Calculadora IMC</h4>
                </div>
                <div class="card tool-card">
                    <i data-lucide="droplet"></i>
                    <h4>Lembrete Água</h4>
                </div>
            </div>
        </div>
    `,
    profile: () => `
        <div class="view-animate">
            <div class="profile-header">
                <div class="avatar-large">IG</div>
                <h3>${state.userName}</h3>
                <span class="muted">Membro VIP desde Março 2024</span>
            </div>
            
            <div class="profile-stats card">
                <div class="stat-col">
                    <strong>${state.progressPercent}%</strong>
                    <span>Progresso</span>
                </div>
                <div class="stat-col line"></div>
                <div class="stat-col">
                    <strong>8kg</strong>
                    <span>Meta</span>
                </div>
            </div>

            <div class="profile-menu">
                <div class="menu-item"><i data-lucide="settings"></i> Configurações</div>
                <div class="menu-item"><i data-lucide="help-circle"></i> Suporte</div>
                <div class="menu-item logout"><i data-lucide="log-out"></i> Sair</div>
            </div>
        </div>
    `
};

// Functions
function renderView(viewName) {
    appMain.innerHTML = templates[viewName]();
    pageTitle.textContent = viewName.charAt(0).toUpperCase() + viewName.slice(1).replace('home', 'Início');
    
    // Re-initialize icons for new content
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Event Listeners
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const tab = item.getAttribute('data-tab');
        
        // Update active state
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Render
        renderView(tab);
    });
});

// Initial Render
renderView('home');
