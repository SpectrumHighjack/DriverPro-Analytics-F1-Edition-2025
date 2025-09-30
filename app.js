/**
 * DriverPro Analytics V9 - F1 Edition - FIXED NAVIGATION VERSION
 * Enhanced with real F1 imagery, professional logo, and fully functional navigation
 * Critical bug fixes for button interactions and screen navigation
 */

// Enhanced F1 API Integration Classes
class UberF1API {
    constructor(clientId, clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.accessToken = null;
        this.isConnected = false;
        this.baseURL = 'https://api.uber.com/v1.2';
        this.f1Mode = true;
    }

    async authenticate() {
        try {
            await new Promise(resolve => setTimeout(resolve, 1200));
            this.accessToken = 'f1_uber_token_' + Date.now();
            this.isConnected = true;
            console.log('🏎️ Uber F1 API connected successfully');
            return true;
        } catch (error) {
            console.error('🚨 Uber F1 API authentication failed:', error);
            this.isConnected = false;
            return false;
        }
    }

    async getCurrentF1Surge(lat = 38.7223, lng = -9.1393) {
        if (!this.isConnected) return null;
        const f1Zones = [
            { area: 'DRS Zone Centro', multiplier: 1.5 + Math.random() * 0.5, lat: 38.7223, lng: -9.1393, f1_status: 'DRS Active' },
            { area: 'Pit Lane Aeroporto', multiplier: 1.8 + Math.random() * 0.7, lat: 38.7756, lng: -9.1354, f1_status: 'Safety Car' },
            { area: 'Chicane Belém', multiplier: 1.4 + Math.random() * 0.4, lat: 38.6979, lng: -9.2071, f1_status: 'Normal Racing' }
        ];
        return { surge_zones: f1Zones, timestamp: new Date(), f1_mode: true };
    }
}

// Enhanced DriverPro F1 Application Class - FIXED VERSION
class DriverProF1App {
    constructor() {
        console.log('🏎️ DriverProF1App V9 constructor starting...');
        
        // Core F1 properties
        this.currentScreen = 'landing';
        this.currentWidget = 'dashboard';
        this.currentF1Theme = 'red-bull';
        this.currentUser = null;
        this.selectedPlan = null;
        this.isAuthenticated = false;
        this.isAnnualBilling = false;
        this.appVersion = 'V9';
        this.f1Edition = true;
        
        // F1 Theme configurations
        this.f1Themes = {
            'red-bull': { name: 'Red Bull Racing', primaryColor: '#0C1B43', accentColor: '#FFB81C' },
            'ferrari': { name: 'Ferrari', primaryColor: '#DC143C', accentColor: '#FFD700' },
            'williams': { name: 'Williams', primaryColor: '#005AFF', accentColor: '#FFFFFF' },
            'alpine': { name: 'Alpine', primaryColor: '#0090FF', accentColor: '#FF1E8C' },
            'aston-martin': { name: 'Aston Martin', primaryColor: '#006F62', accentColor: '#00D9C0' },
            'haas': { name: 'Haas', primaryColor: '#B6BABD', accentColor: '#ED1C24' }
        };
        
        // Technical properties
        this.isOnline = navigator.onLine;
        this.isInitialized = false;
        this.professionalLogo = 'https://pplx-res.cloudinary.com/image/upload/v1758598860/dalle3_images/vn7hhwblnbft2azvhx4q.png';
        
        // Event listeners status
        this.listenersAttached = false;
        
        console.log('🏎️ DriverProF1App V9 constructor completed');
    }

    async init() {
        try {
            console.log('🏁 Initializing DriverPro Analytics V9 F1 Edition...');
            
            // Wait for DOM to be fully ready
            await this.waitForDOM();
            
            // Setup event listeners with retry mechanism - CRITICAL FIX
            await this.setupEventListenersWithRetry();
            
            // Apply current F1 theme
            this.applyF1Theme(this.currentF1Theme);
            
            // Show initial screen
            this.showScreen(this.currentScreen);
            
            this.isInitialized = true;
            console.log('🏆 ✅ DriverPro Analytics V9 F1 Edition initialized successfully!');
            
        } catch (error) {
            console.error('🚨 Critical F1 Initialization Error:', error);
            this.handleError('Critical F1 Initialization Error', error);
        }
    }

    async waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                // Add a small delay to ensure all elements are rendered
                setTimeout(resolve, 100);
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(resolve, 100);
                });
            }
        });
    }

    // CRITICAL FIX: Enhanced event listener setup with better error handling
    async setupEventListenersWithRetry() {
        console.log('🔧 Setting up F1 event listeners with retry mechanism...');
        
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts && !this.listenersAttached) {
            attempts++;
            console.log(`🏎️ F1 Event listener setup attempt ${attempts}/${maxAttempts}`);
            
            try {
                await this.setupAllEventListeners();
                
                // Verify critical buttons exist and are functional
                if (this.verifyCriticalElements()) {
                    this.listenersAttached = true;
                    console.log('✅ F1 Event listeners successfully attached and verified');
                    break;
                } else {
                    console.warn(`⚠️ Element verification failed on attempt ${attempts}`);
                    if (attempts < maxAttempts) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
            } catch (error) {
                console.error(`🚨 Event listener setup attempt ${attempts} failed:`, error);
                if (attempts < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
        
        if (!this.listenersAttached) {
            console.error('❌ Failed to attach event listeners after all attempts');
            // Don't throw error, continue with basic functionality
            this.setupBasicFallbackListeners();
        }
    }

    async setupAllEventListeners() {
        console.log('🔧 Setting up all F1 event listeners...');
        
        // Setup all event listeners
        this.setupLandingListeners();
        this.setupPlanListeners();
        this.setupAuthListeners();
        this.setupAppListeners();
        this.setupThemeListeners();
        this.setupKeyboardNavigation();
        
        console.log('✅ All F1 event listeners setup completed');
    }

    verifyCriticalElements() {
        console.log('🔍 Verifying critical elements...');
        
        const criticalElements = [
            'get-started-btn',
            'existing-account-btn'
        ];
        
        let allFound = true;
        
        criticalElements.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                console.error(`🚨 Critical element missing: ${id}`);
                allFound = false;
            } else {
                console.log(`✓ Found critical element: ${id}`);
            }
        });
        
        return allFound;
    }

    // FIXED: Landing screen event listeners with robust error handling
    setupLandingListeners() {
        console.log('🏁 Setting up F1 landing screen listeners...');
        
        // Get Started Button - MAIN FIX
        this.setupButton('get-started-btn', (e) => {
            console.log('🏁 ✅ Get Started button clicked!');
            e.preventDefault();
            e.stopPropagation();
            
            this.showToast('🏁 Entrando na pista F1...', 'success');
            this.showScreen('plan');
        });

        // Existing Account Button - FIXED
        this.setupButton('existing-account-btn', (e) => {
            console.log('🏁 ✅ Existing account button clicked!');
            e.preventDefault();
            e.stopPropagation();
            
            this.showToast('🏎️ Acessando cockpit F1...', 'info');
            this.showScreen('auth');
        });
        
        console.log('🏁 Landing screen listeners setup completed');
    }

    // FIXED: Plan selection listeners
    setupPlanListeners() {
        console.log('🏆 Setting up F1 plan selection listeners...');
        
        // Plan selection buttons
        const planButtons = document.querySelectorAll('.select-plan');
        console.log(`🏎️ Found ${planButtons.length} plan selection buttons`);
        
        planButtons.forEach((btn, index) => {
            this.setupButton(btn, (e) => {
                console.log(`🏁 ✅ Plan button ${index + 1} clicked!`);
                e.preventDefault();
                e.stopPropagation();
                
                const planCard = btn.closest('.plan-card');
                if (planCard) {
                    const planId = planCard.dataset.plan;
                    console.log(`🏆 Plan selected: ${planId}`);
                    this.showToast(`🏁 Plano F1 ${planId} selecionado!`, 'success');
                    this.selectPlan(planId);
                } else {
                    console.error('🚨 Plan card not found for button');
                }
            });
        });
        
        // Back button
        this.setupButton('back-to-landing', (e) => {
            console.log('🏁 ✅ Back to landing clicked');
            e.preventDefault();
            this.showToast('🏎️ Voltando ao grid F1...', 'info');
            this.showScreen('landing');
        });
        
        console.log('🏆 Plan selection listeners setup completed');
    }

    // FIXED: Authentication listeners
    setupAuthListeners() {
        console.log('🔐 Setting up F1 authentication listeners...');
        
        const signinForm = document.getElementById('signin-form-element');
        if (signinForm) {
            signinForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('🏁 ✅ Sign in form submitted');
                this.handleSignIn();
            });
            
            console.log('✅ Sign in form listener attached');
        }
        
        // OAuth buttons
        ['google', 'microsoft'].forEach(provider => {
            this.setupButton(`${provider}-signin`, (e) => {
                console.log(`🏁 ✅ ${provider} OAuth clicked`);
                e.preventDefault();
                this.showToast(`🏎️ Conectando F1 via ${provider}...`, 'info');
                this.handleOAuthSignIn(provider);
            });
        });
        
        console.log('🔐 Authentication listeners setup completed');
    }

    // FIXED: Application listeners
    setupAppListeners() {
        console.log('🏎️ Setting up main application listeners...');
        
        // Logout button
        this.setupButton('logout-btn', (e) => {
            console.log('🏁 ✅ Logout clicked');
            e.preventDefault();
            this.showToast('🏎️ Saindo da pista F1...', 'info');
            this.handleLogout();
        });
        
        // Widget selector
        const widgetSelector = document.getElementById('widget-selector');
        if (widgetSelector) {
            widgetSelector.addEventListener('change', (e) => {
                const selectedWidget = e.target.value;
                console.log(`🏁 Widget changed to: ${selectedWidget}`);
                this.showToast(`🏎️ Mudando para ${selectedWidget} F1...`, 'info');
                this.showWidget(selectedWidget);
            });
            
            console.log('✅ Widget selector listener attached');
        }
        
        console.log('🏎️ Main application listeners setup completed');
    }

    // FIXED: Theme listeners
    setupThemeListeners() {
        console.log('🎨 Setting up F1 theme listeners...');
        
        const f1TeamSelect = document.getElementById('f1-team-select');
        if (f1TeamSelect) {
            f1TeamSelect.addEventListener('change', (e) => {
                const selectedTheme = e.target.value;
                console.log(`🏁 Theme changed to: ${selectedTheme}`);
                this.applyF1Theme(selectedTheme);
                this.showToast(`🏎️ Tema F1 ${this.f1Themes[selectedTheme]?.name} aplicado!`, 'success');
            });
            
            console.log('✅ F1 Theme selector listener attached');
        } else {
            console.warn('⚠️ F1 theme selector not found');
        }
        
        console.log('🎨 F1 Theme listeners setup completed');
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Handle escape key if needed
            }
        });
    }

    // Utility method for robust button setup
    setupButton(elementOrId, clickHandler) {
        let element;
        
        if (typeof elementOrId === 'string') {
            element = document.getElementById(elementOrId);
            if (!element) {
                console.warn(`⚠️ Button element not found: ${elementOrId}`);
                return;
            }
        } else {
            element = elementOrId;
        }
        
        // Remove any existing listeners by cloning the element
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
        
        // Add visual feedback
        const handleClick = (e) => {
            // Add click effect
            newElement.style.transform = 'scale(0.95)';
            setTimeout(() => {
                newElement.style.transform = 'scale(1)';
            }, 150);
            
            // Call the handler
            clickHandler(e);
        };
        
        // Attach listeners for multiple interaction types
        newElement.addEventListener('click', handleClick);
        newElement.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleClick(e);
        });
        
        console.log(`✅ Button listener attached: ${elementOrId}`);
    }

    // Fallback listeners for basic functionality
    setupBasicFallbackListeners() {
        console.log('🔧 Setting up basic fallback listeners...');
        
        // Use direct DOM manipulation as fallback
        setTimeout(() => {
            const getStartedBtn = document.getElementById('get-started-btn');
            if (getStartedBtn) {
                getStartedBtn.onclick = () => {
                    console.log('🏁 Fallback: Get Started clicked');
                    this.showScreen('plan');
                };
            }
            
            const existingAccountBtn = document.getElementById('existing-account-btn');
            if (existingAccountBtn) {
                existingAccountBtn.onclick = () => {
                    console.log('🏁 Fallback: Existing account clicked');
                    this.showScreen('auth');
                };
            }
        }, 500);
    }

    // FIXED: Navigation methods with enhanced transitions
    showScreen(screenId) {
        console.log(`🏁 🔄 Showing screen: ${screenId}`);
        
        const targetScreen = document.getElementById(`${screenId}-screen`);
        if (!targetScreen) {
            console.error(`🚨 Screen not found: ${screenId}-screen`);
            return;
        }
        
        // Hide all screens
        const allScreens = document.querySelectorAll('.screen');
        allScreens.forEach(screen => {
            screen.classList.remove('active');
            screen.style.display = 'none';
        });
        
        // Show target screen with animation
        targetScreen.style.display = 'block';
        targetScreen.style.opacity = '0';
        targetScreen.classList.add('active');
        
        // Animate in
        setTimeout(() => {
            targetScreen.style.opacity = '1';
        }, 50);
        
        this.currentScreen = screenId;
        
        console.log(`🏆 ✅ Screen ${screenId} is now active`);
        
        // Initialize screen-specific functionality
        if (screenId === 'app') {
            setTimeout(() => {
                this.initializeApp();
            }, 300);
        }
    }

    showWidget(widgetId) {
        console.log(`🏁 🔄 Showing widget: ${widgetId}`);
        
        const widgets = document.querySelectorAll('.widget');
        const targetWidget = document.getElementById(`widget-${widgetId}`);
        
        if (!targetWidget) {
            console.error(`🚨 Widget not found: widget-${widgetId}`);
            return;
        }
        
        // Hide all widgets
        widgets.forEach(widget => {
            widget.classList.remove('active');
            widget.style.display = 'none';
        });
        
        // Show target widget
        targetWidget.style.display = 'block';
        targetWidget.classList.add('active');
        
        this.currentWidget = widgetId;
        
        // Update selector
        const selector = document.getElementById('widget-selector');
        if (selector && selector.value !== widgetId) {
            selector.value = widgetId;
        }
        
        console.log(`🏆 ✅ Widget ${widgetId} is now active`);
    }

    // Plan selection
    selectPlan(planId) {
        console.log(`🏆 ✅ Selecting plan: ${planId}`);
        
        this.selectedPlan = planId;
        
        // Visual feedback
        document.querySelectorAll('.plan-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`[data-plan="${planId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        // Navigate to auth screen
        setTimeout(() => {
            console.log('🏁 ✅ Navigating to auth screen after plan selection');
            this.showScreen('auth');
        }, 800);
    }

    // Authentication handling
    async handleSignIn() {
        console.log('🔐 🏁 Processing sign in...');
        
        const email = document.getElementById('signin-email')?.value;
        const password = document.getElementById('signin-password')?.value;
        
        if (!email || !password) {
            this.showToast('🚨 Por favor, preencha todos os campos', 'error');
            return;
        }
        
        console.log(`🏎️ Attempting login with email: ${email}`);
        
        // Show loading state
        const submitBtn = document.getElementById('signin-submit');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-loading">🏁 Entrando na pista...</span>';
        }
        
        try {
            // Simulate authentication delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Create demo user
            this.currentUser = {
                email: email,
                name: 'F1 Demo Driver',
                plan: this.selectedPlan || 'pro',
                trial_days_remaining: 13,
                f1_driver_level: 'Pro Driver',
                f1_team: this.currentF1Theme
            };
            
            this.isAuthenticated = true;
            console.log('🏆 ✅ Authentication successful');
            
            // Navigate to app
            this.showScreen('app');
            this.showToast('🏁 Welcome to the F1 grid! 🏆', 'success');
            
        } catch (error) {
            console.error('🚨 Authentication failed:', error);
            this.showToast(error.message || '🚨 Erro ao fazer login', 'error');
        } finally {
            // Restore button state
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span class="btn-text">🏁 Entrar na Pista</span>';
            }
        }
    }

    handleOAuthSignIn(provider) {
        console.log(`🔐 🏁 OAuth sign in with ${provider}`);
        
        this.showToast(`🏎️ Redirecionando para ${provider}...`, 'info');
        
        setTimeout(() => {
            this.currentUser = {
                email: `driver@${provider}.com`,
                name: `${provider} F1 Driver`,
                plan: this.selectedPlan || 'pro',
                trial_days_remaining: 13,
                f1_driver_level: 'Champion',
                f1_team: this.currentF1Theme
            };
            
            this.isAuthenticated = true;
            this.showScreen('app');
            this.showToast('🏁 Login F1 realizado com sucesso! 🏆', 'success');
        }, 1500);
    }

    handleLogout() {
        console.log('🔐 🏁 Handling logout');
        
        this.currentUser = null;
        this.isAuthenticated = false;
        
        this.showScreen('landing');
        this.showToast('🏁 Logout F1 realizado com sucesso', 'success');
    }

    // F1 Theme system
    applyF1Theme(themeId) {
        console.log(`🎨 Applying F1 theme: ${themeId}`);
        
        const theme = this.f1Themes[themeId];
        if (!theme) {
            console.error(`🚨 Theme not found: ${themeId}`);
            return;
        }
        
        // Update body theme attribute
        document.body.setAttribute('data-theme', themeId);
        this.currentF1Theme = themeId;
        
        // Update team name in header
        const teamNameElement = document.getElementById('current-f1-team');
        if (teamNameElement) {
            teamNameElement.textContent = theme.name;
        }
        
        // Update theme selector
        const themeSelector = document.getElementById('f1-team-select');
        if (themeSelector && themeSelector.value !== themeId) {
            themeSelector.value = themeId;
        }
        
        console.log(`🏆 ✅ Theme ${theme.name} applied successfully`);
    }

    initializeApp() {
        console.log('🏁 🚀 Initializing main application...');
        
        this.showWidget('dashboard');
        this.updateUserInterface();
        
        // Initialize charts
        setTimeout(() => {
            this.initializeCharts();
        }, 500);
        
        console.log('🏆 ✅ Main application initialized');
    }

    updateUserInterface() {
        if (!this.currentUser) return;
        
        const trialDaysElement = document.getElementById('trial-days');
        if (trialDaysElement) {
            trialDaysElement.textContent = `${this.currentUser.trial_days_remaining} dias`;
        }
        
        // Update team name
        const teamNameElement = document.getElementById('current-f1-team');
        if (teamNameElement && this.currentUser.f1_team) {
            const theme = this.f1Themes[this.currentUser.f1_team];
            teamNameElement.textContent = theme?.name || 'Red Bull Racing';
        }
    }

    // Chart initialization
    initializeCharts() {
        if (typeof Chart === 'undefined') return;
        this.createRealtimeEarningsChart();
    }

    createRealtimeEarningsChart() {
        const canvas = document.getElementById('realtime-earnings-chart');
        if (!canvas || typeof Chart === 'undefined') return;
        
        const ctx = canvas.getContext('2d');
        
        // Initialize with sample data
        const now = new Date();
        const labels = [];
        const data = [];
        
        for (let i = 19; i >= 0; i--) {
            const time = new Date(now.getTime() - (i * 5 * 60000));
            labels.push(time.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }));
            data.push(Math.round(Math.random() * 40 + 30));
        }
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Prize Money F1 (€)',
                    data,
                    borderColor: '#FFB81C',
                    backgroundColor: 'rgba(255, 184, 28, 0.15)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#DC143C',
                    pointHoverBorderColor: '#FFB81C'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 750 },
                scales: {
                    x: { 
                        display: true, 
                        grid: { display: false }
                    },
                    y: {
                        display: true,
                        grid: { color: 'rgba(255, 184, 28, 0.1)' },
                        ticks: { 
                            callback: value => '€' + value
                        }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    // Error handling
    handleError(type, error) {
        console.error(`🚨 ${type}:`, error);
        
        if (type.includes('Critical') || type.includes('Fatal')) {
            const errorBoundary = document.getElementById('error-boundary');
            const errorMessage = document.getElementById('error-message');
            if (errorBoundary && errorMessage) {
                errorMessage.textContent = `🏁 ${error?.message || error || 'Erro crítico da aplicação.'}`;
                errorBoundary.classList.remove('hidden');
            }
        } else if (this.isInitialized) {
            this.showToast('🚨 Ocorreu um erro. A aplicação continuará funcionando.', 'warning');
        }
    }

    // Toast notifications
    showToast(message, type = 'success') {
        const toast = document.getElementById('notification-toast');
        const toastMessage = document.querySelector('.toast-message') || document.querySelector('.f1-toast-message');
        const toastIcon = document.querySelector('.toast-icon') || document.querySelector('.f1-toast-icon');
        
        if (!toast || !toastMessage || !toastIcon) {
            console.log(`Toast: ${message}`);
            return;
        }
        
        const icons = { 
            success: '🏆', 
            error: '🚨', 
            warning: '⚠️', 
            info: '🏁' 
        };
        
        toastMessage.textContent = message;
        toastIcon.textContent = icons[type] || icons.success;
        toast.className = `notification-toast ${type}`;
        
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);
    }
}

// ENHANCED INITIALIZATION with better error handling
function initializeApp() {
    console.log('🏁 🚀 DOM ready, initializing DriverPro Analytics V9...');
    
    try {
        if (window.driverProApp) {
            console.log('🏎️ App already initialized, skipping...');
            return;
        }
        
        window.driverProApp = new DriverProF1App();
        window.driverProApp.init().then(() => {
            console.log('🏆 ✅ DriverPro Analytics V9 initialized successfully!');
        }).catch(error => {
            console.error('🚨 ❌ Initialization failed:', error);
            showFallbackError(error);
        });
        
    } catch (error) {
        console.error('🚨 ❌ Critical initialization error:', error);
        showFallbackError(error);
    }
}

function showFallbackError(error) {
    console.error('Showing fallback error:', error);
    // Keep the app functional even with errors
    setTimeout(() => {
        const getStartedBtn = document.getElementById('get-started-btn');
        if (getStartedBtn) {
            getStartedBtn.onclick = () => {
                const planScreen = document.getElementById('plan-screen');
                const landingScreen = document.getElementById('landing-screen');
                if (planScreen && landingScreen) {
                    landingScreen.classList.remove('active');
                    planScreen.classList.add('active');
                }
            };
        }
    }, 1000);
}

// Multiple initialization strategies
console.log('🔧 Setting up initialization strategies...');

// Immediate initialization if DOM is ready
if (document.readyState === 'loading') {
    console.log('🏎️ DOM loading - setting up DOMContentLoaded listener');
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    console.log('🏆 DOM ready - immediate initialization');
    setTimeout(initializeApp, 100);
}

// Fallback initialization
window.addEventListener('load', () => {
    console.log('🌐 Window load event triggered');
    if (!window.driverProApp) {
        console.log('🔄 Fallback initialization triggered');
        setTimeout(initializeApp, 200);
    }
});

// Emergency initialization
setTimeout(() => {
    if (!window.driverProApp) {
        console.log('⚡ Emergency initialization triggered');
        initializeApp();
    }
}, 2000);

// Export for global access
window.DriverProF1App = DriverProF1App;

console.log('🏆 📱 DriverPro Analytics V9 script loaded successfully');