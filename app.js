// DriverPro Analytics F1 Edition Plus - Main Application
class DriverProApp {
    constructor() {
        this.state = {
            currentTeam: 'ferrari',
            currentPage: 'dashboard',
            theme: 'light',
            language: 'pt',
            currency: 'EUR',
            isOnboardingComplete: false,
            isAppInstalled: false,
            sophiaChatOpen: false,
            sophiaGreetingSent: false
        };

        this.teams = {
            ferrari: {
                name: "Ferrari",
                colors: { primary: "#DC143C", secondary: "#000000" },
                sophia_greeting: "Ciao! Como posso ajudar na sua estratégia hoje? Forza Ferrari! 🏁",
                sophia_personality: "enthusiastic"
            },
            redbull: {
                name: "Red Bull Racing",
                colors: { primary: "#1E3A8A", secondary: "#DC143C" },
                sophia_greeting: "Ready to fly? Vamos acelerar os seus resultados! 💨",
                sophia_personality: "energetic"
            },
            mercedes: {
                name: "Mercedes",
                colors: { primary: "#C0C0C0", secondary: "#000000" },
                sophia_greeting: "Precisão e performance. Como posso otimizar a sua condução? ⚡",
                sophia_personality: "professional"
            },
            mclaren: {
                name: "McLaren",
                colors: { primary: "#FF8C00", secondary: "#0080FF" },
                sophia_greeting: "Let's push the boundaries! Papaya power nas estradas! 🧡",
                sophia_personality: "innovative"
            },
            alpine: {
                name: "Alpine",
                colors: { primary: "#0080FF", secondary: "#FF1493" },
                sophia_greeting: "Bonjour! Esprit Alpine para maximizar os ganhos! 💙",
                sophia_personality: "elegant"
            },
            astonmartin: {
                name: "Aston Martin",
                colors: { primary: "#228B22", secondary: "#FF1493" },
                sophia_greeting: "Excellence in motion. Vamos elevar o seu jogo? 💚",
                sophia_personality: "sophisticated"
            }
        };

        this.mockData = {
            kpis: {
                dailyEarnings: { current: 67.50, trend: "+5.2%", target: 75 },
                completedRides: { current: 12, trend: "+2", target: 15 },
                avgRating: { current: 4.7, trend: "+0.1", target: 4.8 },
                onlineTime: { current: "8.5h", trend: "+0.5h", target: "9h" },
                fuelEfficiency: { current: "6.2L/100km", trend: "-0.3L", target: "6.0L" },
                topZone: { current: "Parque das Nações", earnings: "€80/dia", rides: 15 }
            },
            chartData: {
                weeklyEarnings: [45, 52, 67, 58, 71, 69, 63],
                ridesByZone: [15, 8, 12, 6, 4, 7],
                rideTypes: { business: 35, leisure: 45, airport: 20 }
            }
        };

        this.charts = {};
        this.currentStep = 1;
        this.deferredPrompt = null;

        this.init();
    }

    init() {
        this.loadState();
        this.registerServiceWorker();
        this.setupPWA();
        this.setupEventListeners();
        this.setupOnboarding();
        this.applyTheme();
        this.initializeApp();
    }

    // State Management
    loadState() {
        const savedState = localStorage.getItem('driverpro-state');
        if (savedState) {
            this.state = { ...this.state, ...JSON.parse(savedState) };
        }
    }

    saveState() {
        localStorage.setItem('driverpro-state', JSON.stringify(this.state));
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.saveState();
    }

    // PWA Setup
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            const swCode = `
                const CACHE_NAME = 'driverpro-f1-v1';
                const urlsToCache = [
                    '/',
                    '/style.css',
                    '/app.js',
                    'https://cdn.jsdelivr.net/npm/chart.js'
                ];

                self.addEventListener('install', event => {
                    event.waitUntil(
                        caches.open(CACHE_NAME)
                            .then(cache => cache.addAll(urlsToCache))
                    );
                });

                self.addEventListener('fetch', event => {
                    event.respondWith(
                        caches.match(event.request)
                            .then(response => {
                                if (response) {
                                    return response;
                                }
                                return fetch(event.request);
                            })
                    );
                });
            `;

            const blob = new Blob([swCode], { type: 'application/javascript' });
            const swURL = URL.createObjectURL(blob);

            navigator.serviceWorker.register(swURL)
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }
    }

    setupPWA() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', () => {
            this.setState({ isAppInstalled: true });
            this.showToast('Aplicação instalada com sucesso!', 'success');
        });
    }

    showInstallButton() {
        const installBtn = document.getElementById('installPWA');
        if (installBtn) {
            installBtn.style.display = 'block';
        }
    }

    installPWA() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    this.showToast('Instalação iniciada...', 'info');
                }
                this.deferredPrompt = null;
            });
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Loading screen
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 2000);
        });

        // Onboarding
        this.setupOnboardingListeners();

        // Navigation
        this.setupNavigationListeners();

        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Sophia chat
        this.setupSophiaListeners();

        // Business plan
        this.setupBusinessPlanListeners();

        // Account settings
        this.setupAccountListeners();

        // Modal
        this.setupModalListeners();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }

    setupOnboardingListeners() {
        // Team selection
        document.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('click', () => {
                const team = card.dataset.team;
                if (team) {
                    this.selectTeam(team);
                }
            });
        });

        // Navigation buttons
        document.getElementById('onboardingNext')?.addEventListener('click', () => {
            this.nextOnboardingStep();
        });

        document.getElementById('onboardingPrev')?.addEventListener('click', () => {
            this.prevOnboardingStep();
        });

        // PWA installation
        document.getElementById('installPWA')?.addEventListener('click', () => {
            this.installPWA();
        });

        document.getElementById('skipInstall')?.addEventListener('click', () => {
            this.completeOnboarding();
        });
    }

    setupNavigationListeners() {
        // Menu toggle
        document.getElementById('menuToggle')?.addEventListener('click', () => {
            this.toggleNavMenu();
        });

        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                if (page) {
                    this.navigateToPage(page);
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const navMenu = document.getElementById('navMenu');
            const menuToggle = document.getElementById('menuToggle');
            
            if (navMenu && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.add('hidden');
            }
        });
    }

    setupSophiaListeners() {
        document.getElementById('sophiaToggle')?.addEventListener('click', () => {
            this.toggleSophiaChat();
        });

        document.getElementById('sophiaClose')?.addEventListener('click', () => {
            this.closeSophiaChat();
        });

        document.getElementById('sophiaSend')?.addEventListener('click', () => {
            this.sendSophiaMessage();
        });

        document.getElementById('sophiaInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendSophiaMessage();
            }
        });

        document.getElementById('sophiaInput')?.addEventListener('input', (e) => {
            const sendBtn = document.getElementById('sophiaSend');
            if (sendBtn) {
                sendBtn.disabled = !e.target.value.trim();
            }
        });
    }

    setupBusinessPlanListeners() {
        const hoursSlider = document.getElementById('hoursPerDay');
        hoursSlider?.addEventListener('input', () => {
            this.updateBusinessPlan();
        });

        document.querySelectorAll('#business input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateBusinessPlan();
            });
        });

        document.getElementById('avgRidePrice')?.addEventListener('input', () => {
            this.updateBusinessPlan();
        });

        document.getElementById('fixedCosts')?.addEventListener('input', () => {
            this.updateBusinessPlan();
        });
    }

    setupAccountListeners() {
        document.getElementById('changeTeam')?.addEventListener('click', () => {
            this.openTeamModal();
        });

        document.getElementById('lightMode')?.addEventListener('click', () => {
            this.setTheme('light');
        });

        document.getElementById('darkMode')?.addEventListener('click', () => {
            this.setTheme('dark');
        });

        document.getElementById('clearCache')?.addEventListener('click', () => {
            this.clearCache();
        });

        document.getElementById('reinstallPWA')?.addEventListener('click', () => {
            this.showInstallPrompt();
        });

        document.getElementById('accountLanguage')?.addEventListener('change', (e) => {
            this.setState({ language: e.target.value });
        });

        document.getElementById('accountCurrency')?.addEventListener('change', (e) => {
            this.setState({ currency: e.target.value });
        });
    }

    setupModalListeners() {
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', () => {
                this.closeModal();
            });
        });

        document.querySelectorAll('.modal-team-card').forEach(card => {
            card.addEventListener('click', () => {
                const team = card.dataset.team;
                if (team) {
                    this.selectTeamFromModal(team);
                }
            });
        });
    }

    // Application Initialization
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                this.showOnboardingOrApp();
            }, 500);
        }
    }

    showOnboardingOrApp() {
        if (!this.state.isOnboardingComplete) {
            this.showOnboarding();
        } else {
            this.showApp();
        }
    }

    initializeApp() {
        if (this.state.isOnboardingComplete) {
            this.updateTeamDisplay();
            this.initializeCharts();
            this.updateBusinessPlan();
            this.initializeSophiaChat();
        }
    }

    // Onboarding
    setupOnboarding() {
        this.updateOnboardingStep();
    }

    showOnboarding() {
        document.getElementById('onboarding')?.classList.remove('hidden');
        document.getElementById('app')?.classList.add('hidden');
    }

    selectTeam(teamId) {
        this.setState({ currentTeam: teamId, sophiaGreetingSent: false });
        
        // Update UI
        document.querySelectorAll('.team-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        document.querySelector(`[data-team="${teamId}"]`)?.classList.add('selected');
        
        // Enable next button
        const nextBtn = document.getElementById('onboardingNext');
        if (nextBtn && this.currentStep === 1) {
            nextBtn.disabled = false;
        }

        this.applyTheme();
    }

    nextOnboardingStep() {
        if (this.currentStep < 3) {
            this.currentStep++;
            this.updateOnboardingStep();
        } else {
            this.completeOnboarding();
        }
    }

    prevOnboardingStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateOnboardingStep();
        }
    }

    updateOnboardingStep() {
        // Update steps
        document.querySelectorAll('.onboarding-step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
        });

        // Update dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === this.currentStep);
        });

        // Update buttons
        const prevBtn = document.getElementById('onboardingPrev');
        const nextBtn = document.getElementById('onboardingNext');

        if (prevBtn) prevBtn.disabled = this.currentStep === 1;
        if (nextBtn) {
            nextBtn.disabled = this.currentStep === 1 && !this.state.currentTeam;
            nextBtn.textContent = this.currentStep === 3 ? 'Finalizar' : 'Seguinte';
        }
    }

    completeOnboarding() {
        this.setState({ isOnboardingComplete: true });
        
        // Save preferences from onboarding
        const language = document.getElementById('language')?.value;
        const currency = document.getElementById('currency')?.value;
        
        if (language) this.setState({ language });
        if (currency) this.setState({ currency });

        this.showApp();
        this.showToast('Bem-vindo ao DriverPro F1!', 'success');
    }

    showApp() {
        document.getElementById('onboarding')?.classList.add('hidden');
        document.getElementById('app')?.classList.remove('hidden');
        this.initializeApp();
    }

    // Navigation
    toggleNavMenu() {
        const navMenu = document.getElementById('navMenu');
        navMenu?.classList.toggle('hidden');
    }

    navigateToPage(pageId) {
        this.setState({ currentPage: pageId });
        
        // Update pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId)?.classList.add('active');

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageId}"]`)?.classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            analytics: 'Analytics',
            heatmap: 'HeatMap',
            traffic: 'Tráfego',
            business: 'Business Plan',
            account: 'Conta'
        };
        
        const titleElement = document.getElementById('pageTitle');
        if (titleElement) {
            titleElement.textContent = titles[pageId] || pageId;
        }

        // Hide navigation menu
        document.getElementById('navMenu')?.classList.add('hidden');

        // Initialize page-specific content
        if (pageId === 'analytics') {
            this.initializeCharts();
        }
    }

    // Theme Management
    applyTheme() {
        document.documentElement.setAttribute('data-team', this.state.currentTeam);
        document.documentElement.setAttribute('data-color-scheme', this.state.theme);
        
        // Update theme toggle icon
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.state.theme === 'dark' ? '☀️' : '🌙';
        }

        // Update theme toggle buttons
        document.getElementById('lightMode')?.classList.toggle('active', this.state.theme === 'light');
        document.getElementById('darkMode')?.classList.toggle('active', this.state.theme === 'dark');
    }

    toggleTheme() {
        const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.setState({ theme });
        this.applyTheme();
    }

    updateTeamDisplay() {
        const team = this.teams[this.state.currentTeam];
        if (!team) return;

        // Update current team display
        const teamNameElement = document.getElementById('currentTeamName');
        if (teamNameElement) {
            teamNameElement.textContent = team.name;
        }

        // Update avatars with team colors
        document.querySelectorAll('.team-avatar svg, .sophia-avatar svg').forEach(svg => {
            svg.setAttribute('fill', team.colors.primary);
        });
    }

    // Charts
    initializeCharts() {
        setTimeout(() => {
            this.createEarningsChart();
            this.createZonesChart();
            this.createRidesChart();
        }, 100);
    }

    createEarningsChart() {
        const canvas = document.getElementById('earningsChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (this.charts.earnings) {
            this.charts.earnings.destroy();
        }

        this.charts.earnings = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Ganhos Diários (€)',
                    data: this.mockData.chartData.weeklyEarnings,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '€' + value;
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Ganhos Semanais'
                    }
                }
            }
        });
    }

    createZonesChart() {
        const canvas = document.getElementById('zonesChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (this.charts.zones) {
            this.charts.zones.destroy();
        }

        this.charts.zones = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Centro', 'Belém', 'P. Nações', 'Cascais', 'Sintra', 'Almada'],
                datasets: [{
                    label: 'Corridas por Zona',
                    data: this.mockData.chartData.ridesByZone,
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Distribuição por Zona'
                    }
                }
            }
        });
    }

    createRidesChart() {
        const canvas = document.getElementById('ridesChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (this.charts.rides) {
            this.charts.rides.destroy();
        }

        this.charts.rides = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Negócios', 'Lazer', 'Aeroporto'],
                datasets: [{
                    data: [
                        this.mockData.chartData.rideTypes.business,
                        this.mockData.chartData.rideTypes.leisure,
                        this.mockData.chartData.rideTypes.airport
                    ],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: 'Tipos de Viagem'
                    }
                }
            }
        });
    }

    // Sophia AI Chat
    initializeSophiaChat() {
        // Clear any existing messages and show team-specific greeting
        const messagesContainer = document.getElementById('sophiaMessages');
        if (messagesContainer && !this.state.sophiaGreetingSent) {
            messagesContainer.innerHTML = '';
            this.showSophiaGreeting();
        }
    }

    toggleSophiaChat() {
        const chatWindow = document.getElementById('sophiaChatWindow');
        if (chatWindow) {
            chatWindow.classList.toggle('hidden');
            this.state.sophiaChatOpen = !chatWindow.classList.contains('hidden');
            
            if (this.state.sophiaChatOpen) {
                document.getElementById('sophiaInput')?.focus();
            }
        }
    }

    closeSophiaChat() {
        document.getElementById('sophiaChatWindow')?.classList.add('hidden');
        this.state.sophiaChatOpen = false;
    }

    showSophiaGreeting() {
        const team = this.teams[this.state.currentTeam];
        if (team && !this.state.sophiaGreetingSent) {
            setTimeout(() => {
                this.addSophiaMessage(team.sophia_greeting);
                this.setState({ sophiaGreetingSent: true });
            }, 1000);
        }
    }

    sendSophiaMessage() {
        const input = document.getElementById('sophiaInput');
        const message = input?.value.trim();
        
        if (!message) return;

        this.addUserMessage(message);
        input.value = '';
        document.getElementById('sophiaSend').disabled = true;

        // Simulate AI response
        setTimeout(() => {
            const response = this.generateSophiaResponse(message);
            this.addSophiaMessage(response);
        }, 1000);
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('sophiaMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'sophia-message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">${this.escapeHtml(message)}</div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addSophiaMessage(message) {
        const messagesContainer = document.getElementById('sophiaMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'sophia-message';
        messageDiv.innerHTML = `
            <div class="message-content">${this.escapeHtml(message)}</div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    generateSophiaResponse(userMessage) {
        const team = this.teams[this.state.currentTeam];
        const lowerMessage = userMessage.toLowerCase();

        // Context-based responses
        if (lowerMessage.includes('ganho') || lowerMessage.includes('dinheiro')) {
            return `Com base nos dados, recomendo focar no ${this.mockData.kpis.topZone.current} durante os horários de pico (18h-20h). Potencial de +€15/dia! 💰`;
        }
        
        if (lowerMessage.includes('zona') || lowerMessage.includes('onde')) {
            return `As melhores zonas agora são: Parque das Nações (€80/dia) e Centro (€75/dia). Evite Sintra nas próximas 2 horas. 📍`;
        }
        
        if (lowerMessage.includes('combustível') || lowerMessage.includes('gasolina')) {
            return `Está a 6.2L/100km, quase na meta! Dica: acelere suavemente e use o cruise control em autoestradas. 🚗`;
        }
        
        if (lowerMessage.includes('rating') || lowerMessage.includes('avaliação')) {
            return `4.7⭐ é excelente! Para chegar a 4.8: ofereça água, mantenha o carro limpo e confirme sempre o destino. 🌟`;
        }

        // Team-specific responses
        const teamResponses = {
            ferrari: [
                "Forza! Vamos conquistar as estradas de Lisboa! 🏁",
                "Paixão e velocidade, essa é a Ferrari way! ❤️",
                "Estratégia perfeita para dominar o grid urbano! 🏆"
            ],
            redbull: [
                "Red Bull gives you wings! Vamos voar pelos ganhos! 💨",
                "Energy e performance - combinação perfeita! ⚡",
                "Ready to maximize? Let's do this! 🚀"
            ],
            mercedes: [
                "Precisão alemã para resultados consistentes. 🎯",
                "Performance otimizada, como nos boxes da Mercedes! 🔧",
                "Engenharia de excelência aplicada à condução! ⚙️"
            ],
            mclaren: [
                "Papaya power! Inovação e velocidade! 🧡",
                "McLaren style: push the limits responsibly! 🏎️",
                "Orange crush na corrida pelos melhores ganhos! 🥇"
            ],
            alpine: [
                "Bonjour! Elegância francesa nas estradas! 💙",
                "Esprit Alpine: eficiência com estilo! ✨",
                "Magnifique performance hoje! Continue assim! 🇫🇷"
            ],
            astonmartin: [
                "Excellence in motion, como sempre! 💚",
                "Aston Martin sophistication nas suas decisões! 🏁",
                "Luxury performance para resultados premium! 💎"
            ]
        };

        const responses = teamResponses[this.state.currentTeam] || teamResponses.ferrari;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Business Plan Calculator
    updateBusinessPlan() {
        const hoursPerDay = parseInt(document.getElementById('hoursPerDay')?.value) || 8;
        const avgRidePrice = parseFloat(document.getElementById('avgRidePrice')?.value) || 12.50;
        const fixedCosts = parseFloat(document.getElementById('fixedCosts')?.value) || 800;

        // Update hours display
        const rangeValue = document.querySelector('.range-value');
        if (rangeValue) {
            rangeValue.textContent = `${hoursPerDay} horas`;
        }

        // Calculate working days
        const checkedDays = document.querySelectorAll('#business input[type="checkbox"]:checked').length;
        
        // Business logic
        const ridesPerHour = 1.5; // Average rides per hour
        const dailyRides = hoursPerDay * ridesPerHour;
        const weeklyRides = dailyRides * checkedDays;
        const monthlyRides = weeklyRides * 4.33; // Average weeks per month
        
        const grossRevenue = monthlyRides * avgRidePrice;
        const netProfit = grossRevenue - fixedCosts;

        // Update UI
        const projectionElement = document.getElementById('monthlyProjection');
        if (projectionElement) {
            projectionElement.textContent = `€${Math.round(netProfit)}`;
        }

        const breakdown = document.querySelector('.result-breakdown');
        if (breakdown) {
            breakdown.innerHTML = `
                <div>Receita Bruta: €${Math.round(grossRevenue)}</div>
                <div>Custos Fixos: €${Math.round(fixedCosts)}</div>
                <div class="result-net">Lucro Líquido: €${Math.round(netProfit)}</div>
            `;
        }
    }

    // Modal Management
    openTeamModal() {
        const modal = document.getElementById('teamModal');
        modal?.classList.remove('hidden');
        
        // Highlight current team
        document.querySelectorAll('.modal-team-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.team === this.state.currentTeam);
        });
    }

    closeModal() {
        document.getElementById('teamModal')?.classList.add('hidden');
    }

    selectTeamFromModal(teamId) {
        this.setState({ currentTeam: teamId, sophiaGreetingSent: false });
        this.applyTheme();
        this.updateTeamDisplay();
        this.closeModal();
        
        // Clear Sophia chat and show new greeting
        const messagesContainer = document.getElementById('sophiaMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
        
        // Show Sophia greeting for new team
        const team = this.teams[teamId];
        if (team) {
            setTimeout(() => {
                this.addSophiaMessage(team.sophia_greeting);
                this.setState({ sophiaGreetingSent: true });
            }, 500);
        }
        
        this.showToast(`Tema alterado para ${this.teams[teamId].name}!`, 'success');
    }

    // Utility Functions
    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
        toast.innerHTML = `${icon} ${this.escapeHtml(message)}`;
        
        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, duration);
    }

    clearCache() {
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }
        localStorage.clear();
        this.showToast('Cache limpo com sucesso!', 'success');
    }

    showInstallPrompt() {
        if (this.deferredPrompt) {
            this.installPWA();
        } else {
            this.showToast('PWA já instalado ou não disponível', 'info');
        }
    }

    handleKeyboardNavigation(e) {
        // Escape key closes modals and menus
        if (e.key === 'Escape') {
            this.closeModal();
            document.getElementById('navMenu')?.classList.add('hidden');
            this.closeSophiaChat();
        }

        // Tab navigation support
        if (e.key === 'Tab') {
            // Ensure proper focus management
            const focusableElements = document.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            // Add focus ring for accessibility
            focusableElements.forEach(el => {
                el.addEventListener('focus', () => {
                    el.classList.add('focus-visible');
                });
                el.addEventListener('blur', () => {
                    el.classList.remove('focus-visible');
                });
            });
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // HeatMap functionality
    setupHeatMap() {
        const recenterBtn = document.getElementById('recenterBtn');
        const transparencySlider = document.getElementById('transparencySlider');

        recenterBtn?.addEventListener('click', () => {
            this.showToast('Mapa recentrado em Lisboa', 'success');
        });

        transparencySlider?.addEventListener('input', (e) => {
            const opacity = e.target.value / 100;
            const markers = document.querySelectorAll('.marker');
            markers.forEach(marker => {
                marker.style.opacity = opacity;
            });
        });

        // Auto-refresh simulation
        setInterval(() => {
            this.updateHeatMapData();
        }, 30000); // 30 seconds
    }

    updateHeatMapData() {
        // Simulate real-time data updates
        const markers = document.querySelectorAll('.marker');
        markers.forEach(marker => {
            const classes = ['high', 'medium', 'low'];
            const currentClass = classes.find(c => marker.classList.contains(c));
            marker.classList.remove(currentClass);
            
            const newClass = classes[Math.floor(Math.random() * classes.length)];
            marker.classList.add(newClass);
        });
    }
}

// Initialize the application
const app = new DriverProApp();

// Export for PWA manifest
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        app.setupHeatMap();
    });
}

// Accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Saltar para conteúdo principal';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content landmark
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('role', 'main');
    }

    // Add ARIA labels where needed
    document.querySelectorAll('.nav-item').forEach(item => {
        if (!item.getAttribute('aria-label')) {
            const text = item.querySelector('span')?.textContent;
            if (text) {
                item.setAttribute('aria-label', `Navegar para ${text}`);
            }
        }
    });

    // Add live region for dynamic content
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        
        console.log(`DriverPro F1 loaded in ${loadTime}ms`);
        
        // Log Core Web Vitals if available
        if ('web-vitals' in window) {
            // This would typically use the web-vitals library
            console.log('Core Web Vitals monitoring enabled');
        }
    });
}

// Export the app instance for debugging
window.DriverProApp = app;