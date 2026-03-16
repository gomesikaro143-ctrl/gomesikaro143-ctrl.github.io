/**
 * Protocolo Gelatina - Quiz Funnel Logic
 */

const AppState = {
    currentStep: -1, // -1 means landing page
    userName: '',
    answers: {},
    totalSteps: 10 // Approximate steps for progress bar
};

// --- DOM Elements ---
const landingPage = document.getElementById('landing-page');
const quizPage = document.getElementById('quiz-page');
const loadingPage = document.getElementById('loading-page');
const resultsPage = document.getElementById('results-page');
const checkoutPage = document.getElementById('checkout-page');

const header = document.getElementById('app-header');
const backBtn = document.getElementById('back-btn');
const progressContainer = document.getElementById('progress-container');
const progressBarFill = document.getElementById('progress-bar-fill');
const questionContainer = document.getElementById('question-container');

// --- Quiz Questions Data ---
const quizQuestions = [
    {
        id: 'start_prompt',
        title: 'Vamos começar sua jornada! 🚀',
        subtitle: 'Para criarmos o seu protocolo ideal, precisamos de algumas informações rápidas.',
        type: 'info',
        buttonText: 'Vamos lá! 💪'
    },
    {
        id: 'gender',
        title: 'Qual o seu sexo?',
        subtitle: 'Isso nos ajuda a calcular seu metabolismo.',
        type: 'single',
        options: [
            { text: 'Mulher', icon: '👩' },
            { text: 'Homem', icon: '👨' }
        ]
    },
    {
        id: 'age',
        title: 'Qual a sua idade?',
        type: 'single',
        options: [
            { text: '18 - 27 anos', icon: '✨' },
            { text: '28 - 39 anos', icon: '🌟' },
            { text: '40 - 55 anos', icon: '💫' },
            { text: 'Mais de 55', icon: '👑' }
        ]
    },
    {
        id: 'name',
        title: 'Como podemos te chamar?',
        subtitle: 'Queremos personalizar sua experiência.',
        type: 'input_text',
        placeholder: 'Seu primeiro nome',
        buttonText: 'Continuar'
    },
    {
        id: 'goal_weight',
        title: 'Quantos quilos você deseja perder?',
        type: 'single',
        options: [
            { text: '1 a 5 kg', icon: '📉' },
            { text: '6 a 10 kg', icon: '🏃‍♀️' },
            { text: '11 a 20 kg', icon: '🔥' },
            { text: 'Mais de 20 kg', icon: '🚀' }
        ]
    },
    {
        id: 'target_areas',
        title: 'Onde a gordura mais te incomoda?',
        subtitle: 'Selecione todas as opções aplicáveis.',
        type: 'multi',
        options: [
            { text: 'Barriga', icon: '🤰' },
            { text: 'Braços', icon: '💪' },
            { text: 'Pernas/Coxas', icon: '🦵' },
            { text: 'Papada', icon: '👱‍♀️' }
        ],
        buttonText: 'Continuar'
    },
    {
        id: 'barrier',
        title: 'DYNAMIC_NAME_1', // Will be replaced before render
        subtitle: 'Seja sincera...',
        type: 'single',
        options: [
            { text: 'Falta de tempo', icon: '⏳' },
            { text: 'Ansiedade / Fome Emocional', icon: '🥺' },
            { text: 'Metabolismo Lento', icon: '🐢' },
            { text: 'Não gosto de exercícios', icon: '🛋️' }
        ]
    },
    {
        id: 'weight_input',
        title: 'Qual é o seu peso atual?',
        subtitle: 'Precisamos disso para calcular seu IMC',
        type: 'stepper',
        unit: 'kg',
        defaultValue: 75,
        min: 40,
        max: 200,
        step: 0.5,
        buttonText: 'Continuar'
    },
    {
        id: 'height_input',
        title: 'Qual é a sua altura?',
        subtitle: 'Precisamos disso para calcular seu IMC',
        type: 'stepper',
        unit: 'cm',
        defaultValue: 165,
        min: 140,
        max: 220,
        step: 1,
        buttonText: 'Continuar'
    },
    {
        id: 'commitment',
        title: 'Você está pronta para se comprometer?',
        subtitle: 'O protocolo funciona, mas exige que você siga o passo a passo.',
        type: 'info',
        buttonText: '✅ Sim, eu me comprometo!'
    }
];

AppState.totalSteps = quizQuestions.length;

// --- Flow Management Functions ---

function initApp() {
    document.getElementById('start-btn').addEventListener('click', startQuiz);
    backBtn.addEventListener('click', goBack);
    document.getElementById('continue-to-checkout-btn').addEventListener('click', showCheckoutPage);
    
    // Simulate Video Player click
    document.querySelector('.video-placeholder').addEventListener('click', function() {
        this.innerHTML = '<p style="color:var(--primary-green); padding: 1rem;">O vídeo está sendo reproduzido... (Simulação)</p>';
        document.getElementById('continue-to-checkout-btn').classList.remove('hidden'); // Show button after "watching"
    });
}

function startQuiz() {
    landingPage.classList.remove('active');
    landingPage.classList.add('hidden');
    
    header.classList.remove('hidden');
    progressContainer.classList.remove('hidden');
    quizPage.classList.remove('hidden');
    quizPage.classList.add('active');
    
    AppState.currentStep = 0;
    renderCurrentQuestion();
}

function goBack() {
    if(AppState.currentStep > 0) {
        AppState.currentStep--;
        renderCurrentQuestion();
    } else if (AppState.currentStep === 0) {
        // Go back to landing
        quizPage.classList.remove('active');
        quizPage.classList.add('hidden');
        header.classList.add('hidden');
        progressContainer.classList.add('hidden');
        
        landingPage.classList.remove('hidden');
        landingPage.classList.add('active');
        AppState.currentStep = -1;
    }
}

function updateProgress() {
    const progressPerc = ((AppState.currentStep + 1) / AppState.totalSteps) * 100;
    progressBarFill.style.width = `${progressPerc}%`;
}

function renderCurrentQuestion() {
    updateProgress();
    questionContainer.innerHTML = '';
    
    const q = quizQuestions[AppState.currentStep];
    
    // Replace Dynamic Name
    let titleToRender = q.title;
    if (titleToRender === 'DYNAMIC_NAME_1') {
        titleToRender = `${AppState.userName || 'Maria'}, o que mais te impede de emagrecer?`;
    }

    // Build Header
    const headerHtml = `
        <div class="quiz-header">
            <h2 class="quiz-title">${titleToRender}</h2>
            ${q.subtitle ? `<p class="quiz-subtitle">${q.subtitle}</p>` : ''}
        </div>
    `;
    
    questionContainer.insertAdjacentHTML('beforeend', headerHtml);

    // Build Content based on Type
    const optionsWrapper = document.createElement('div');
    optionsWrapper.className = 'options-container';

    if (q.type === 'single' || q.type === 'multi') {
        q.options.forEach((opt, index) => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.dataset.index = index;
            card.dataset.value = opt.text;
            
            let content = '';
            if (q.type === 'multi') {
                content += `<div class="option-checkbox"></div>`;
            }
            content += `<span class="option-icon">${opt.icon}</span>`;
            content += `<span class="option-text">${opt.text}</span>`;
            
            card.innerHTML = content;
            
            card.addEventListener('click', function() {
                if (q.type === 'single') {
                    // Answer and auto advance
                    AppState.answers[q.id] = this.dataset.value;
                    advanceNext();
                } else if (q.type === 'multi') {
                    this.classList.toggle('selected');
                }
            });
            optionsWrapper.appendChild(card);
        });
        questionContainer.appendChild(optionsWrapper);
        
        if(q.type === 'multi') {
            appendContinueButton(q.buttonText, () => {
                const selected = Array.from(optionsWrapper.querySelectorAll('.selected')).map(el => el.dataset.value);
                if(selected.length > 0) {
                    AppState.answers[q.id] = selected;
                    advanceNext();
                } else {
                    alert('Por favor, selecione pelo menos uma opção.');
                }
            });
        }
    } 
    else if (q.type === 'info') {
        appendContinueButton(q.buttonText, advanceNext);
    }
    else if (q.type === 'input_text') {
        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container mt-4';
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = q.placeholder;
        input.className = 'btn'; // Reuse some basic styles
        input.style.border = '2px solid var(--border-color)';
        input.style.background = 'white';
        input.style.color = 'var(--text-main)';
        input.style.outline = 'none';
        
        inputContainer.appendChild(input);
        questionContainer.appendChild(inputContainer);
        
        appendContinueButton(q.buttonText, () => {
            if(input.value.trim().length > 1) {
                AppState.userName = input.value.trim();
                AppState.answers[q.id] = AppState.userName;
                advanceNext();
            } else {
                alert('Por favor, digite seu nome.');
            }
        });
    }
    else if (q.type === 'stepper') {
        let currentValue = q.defaultValue;
        
        const container = document.createElement('div');
        container.className = 'input-container';
        
        container.innerHTML = `
            <div class="number-input-group">
                <span class="stepper-val" id="stepper-display-${q.id}">${currentValue}</span>
                <span class="unit">${q.unit}</span>
            </div>
            <div class="stepper-controls">
                <button class="stepper-btn" id="dec-${q.id}">-</button>
                <button class="stepper-btn" id="inc-${q.id}">+</button>
            </div>
        `;
        questionContainer.appendChild(container);
        
        const display = document.getElementById(`stepper-display-${q.id}`);
        document.getElementById(`dec-${q.id}`).addEventListener('click', () => {
            if(currentValue > q.min) currentValue -= q.step;
            display.innerText = currentValue;
        });
        document.getElementById(`inc-${q.id}`).addEventListener('click', () => {
            if(currentValue < q.max) currentValue += q.step;
            display.innerText = currentValue;
        });
        
        appendContinueButton(q.buttonText, () => {
            AppState.answers[q.id] = currentValue;
            advanceNext();
        });
    }

    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function appendContinueButton(text, callback) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary mt-4';
    btn.innerText = text;
    btn.addEventListener('click', callback);
    questionContainer.appendChild(btn);
}

function advanceNext() {
    if (AppState.currentStep < AppState.totalSteps - 1) {
        AppState.currentStep++;
        renderCurrentQuestion();
    } else {
        // Finished Quiz
        showLoadingScreen();
    }
}

function showLoadingScreen() {
    quizPage.classList.remove('active');
    quizPage.classList.add('hidden');
    header.classList.add('hidden'); // Hide progress bar

    loadingPage.classList.remove('hidden');
    loadingPage.classList.add('active');
    
    // Simulate Loading progression
    const loadingText = document.getElementById('loading-text');
    setTimeout(() => { loadingText.innerText = "Calculando seu IMC..."; }, 1500);
    setTimeout(() => { loadingText.innerText = "Avaliando metabolismo..."; }, 3000);
    setTimeout(() => { showResultsPage(); }, 4500);
}

function showResultsPage() {
    loadingPage.classList.remove('active');
    loadingPage.classList.add('hidden');
    
    resultsPage.classList.remove('hidden');
    resultsPage.classList.add('active');
    
    // Inject Name
    document.getElementById('user-name-display').innerText = AppState.userName || 'Amiga';
    
    // Hide continue to checkout button initially until they "watch video" (Simulated by click on player)
    document.getElementById('continue-to-checkout-btn').classList.add('hidden');
}

function showCheckoutPage() {
    resultsPage.classList.remove('active');
    resultsPage.classList.add('hidden');
    
    checkoutPage.classList.remove('hidden');
    checkoutPage.classList.add('active');
    
    startCountdown();
}

function startCountdown() {
    let minutes = 14;
    let seconds = 59;
    const interval = setInterval(() => {
        seconds--;
        if(seconds < 0) {
            minutes--;
            seconds = 59;
        }
        if(minutes < 0) {
            clearInterval(interval);
            return;
        }
        document.getElementById('countdown').innerText = `${minutes}:${seconds < 10 ? '0': ''}${seconds}`;
    }, 1000);
}

// Initial Boot
document.addEventListener('DOMContentLoaded', initApp);
