# 5. Onboarding em 3 Passos e Snackbars

## Sistema de Onboarding

```tsx
// components/Onboarding/OnboardingFlow.tsx
import React, { useState, useEffect } from 'react'
import { usePWA } from '../../hooks/usePWA'

interface OnboardingStep {
  id: string
  title: string
  description: string
  component: React.ComponentType<any>
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'team-selection',
    title: 'Escolha a Sua Equipa F1',
    description: 'Selecione a equipa que mais se identifica para personalizar a sua experiência',
    component: TeamSelectionStep
  },
  {
    id: 'preferences',
    title: 'Configure as Preferências',
    description: 'Defina o seu idioma e moeda para uma experiência personalizada',
    component: PreferencesStep
  },
  {
    id: 'pwa-install',
    title: 'Instale a Aplicação',
    description: 'Adicione o DriverPro F1 ao seu dispositivo para acesso rápido e funcionalidade offline',
    component: PWAInstallStep
  }
]

interface OnboardingFlowProps {
  onComplete: (config: OnboardingConfig) => void
}

interface OnboardingConfig {
  team: string
  language: string
  currency: string
  skipPWA: boolean
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [config, setConfig] = useState<Partial<OnboardingConfig>>({})
  const [isCompleting, setIsCompleting] = useState(false)

  const currentStepData = ONBOARDING_STEPS[currentStep]
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1
  const isFirstStep = currentStep === 0

  const handleNext = (stepData: any) => {
    setConfig(prev => ({ ...prev, ...stepData }))
    
    if (isLastStep) {
      completeOnboarding(stepData)
    } else {
      setCurrentStep(prev => prev + 1)
      showSnackbar(`Passo ${currentStep + 2} de ${ONBOARDING_STEPS.length}`, 'info')
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const completeOnboarding = async (finalStepData: any) => {
    setIsCompleting(true)
    
    const finalConfig: OnboardingConfig = {
      team: config.team || 'ferrari',
      language: config.language || 'pt',
      currency: config.currency || 'EUR',
      skipPWA: finalStepData.skipPWA || false,
      ...finalStepData
    }

    // Simular configuração
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    localStorage.setItem('onboardingCompleted', 'true')
    localStorage.setItem('userConfig', JSON.stringify(finalConfig))
    
    showSnackbar('Configuração concluída! Bem-vindo ao DriverPro F1 🏁', 'success')
    onComplete(finalConfig)
  }

  // Progress indicator com acessibilidade
  const progressPercentage = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100

  return (
    <div 
      className="onboarding-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      aria-describedby="onboarding-description"
    >
      <div className="onboarding-container">
        {/* Header com progresso */}
        <header className="onboarding-header">
          <div className="onboarding-progress">
            <div 
              className="progress-bar"
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Passo ${currentStep + 1} de ${ONBOARDING_STEPS.length}`}
            >
              <div 
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="progress-text">
              {currentStep + 1} de {ONBOARDING_STEPS.length}
            </span>
          </div>

          <h1 id="onboarding-title" className="onboarding-title">
            {currentStepData.title}
          </h1>
          
          <p id="onboarding-description" className="onboarding-description">
            {currentStepData.description}
          </p>
        </header>

        {/* Conteúdo do passo atual */}
        <main className="onboarding-content">
          <currentStepData.component 
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoBack={!isFirstStep}
            isLoading={isCompleting}
            currentData={config}
          />
        </main>
      </div>

      {/* Backdrop */}
      <div className="onboarding-backdrop" aria-hidden="true" />
    </div>
  )
}

// Passo 1: Seleção de Equipa
function TeamSelectionStep({ onNext, currentData }: any) {
  const [selectedTeam, setSelectedTeam] = useState(currentData.team || 'ferrari')

  const teams = [
    { id: 'ferrari', name: 'Ferrari', colors: { primary: '#DC143C', secondary: '#000000' }, emoji: '🏎️' },
    { id: 'redbull', name: 'Red Bull Racing', colors: { primary: '#1E3A8A', secondary: '#DC143C' }, emoji: '🔵' },
    { id: 'mercedes', name: 'Mercedes', colors: { primary: '#C0C0C0', secondary: '#000000' }, emoji: '⭐' },
    { id: 'mclaren', name: 'McLaren', colors: { primary: '#FF8C00', secondary: '#0080FF' }, emoji: '🧡' },
    { id: 'alpine', name: 'Alpine', colors: { primary: '#0080FF', secondary: '#FF1493' }, emoji: '🔷' },
    { id: 'astonmartin', name: 'Aston Martin', colors: { primary: '#228B22', secondary: '#FF1493' }, emoji: '💚' }
  ]

  const handleNext = () => {
    onNext({ team: selectedTeam })
    showSnackbar(`Equipa ${teams.find(t => t.id === selectedTeam)?.name} selecionada!`, 'success')
  }

  return (
    <div className="team-selection-step">
      <div className="teams-grid" role="radiogroup" aria-label="Escolher equipa F1">
        {teams.map(team => (
          <label key={team.id} className="team-option">
            <input
              type="radio"
              name="team"
              value={team.id}
              checked={selectedTeam === team.id}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="sr-only"
            />
            <div 
              className={`team-card ${selectedTeam === team.id ? 'selected' : ''}`}
              style={{
                '--team-primary': team.colors.primary,
                '--team-secondary': team.colors.secondary
              } as React.CSSProperties}
              aria-label={`Escolher equipa ${team.name}`}
            >
              <div className="team-emoji" aria-hidden="true">
                {team.emoji}
              </div>
              <h3 className="team-name">{team.name}</h3>
              <div className="team-colors">
                <div 
                  className="color-swatch"
                  style={{ backgroundColor: team.colors.primary }}
                  aria-hidden="true"
                />
                <div 
                  className="color-swatch"
                  style={{ backgroundColor: team.colors.secondary }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="step-actions">
        <button 
          className="btn btn-primary btn-large focusable"
          onClick={handleNext}
          aria-describedby="team-next-desc"
        >
          Continuar
        </button>
        <div id="team-next-desc" className="sr-only">
          Prosseguir para configuração de preferências
        </div>
      </div>
    </div>
  )
}

// Passo 2: Preferências
function PreferencesStep({ onNext, onPrevious, canGoBack, currentData }: any) {
  const [preferences, setPreferences] = useState({
    language: currentData.language || 'pt',
    currency: currentData.currency || 'EUR'
  })

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ]

  const currencies = [
    { code: 'EUR', name: 'Euro (€)', symbol: '€' },
    { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
    { code: 'GBP', name: 'British Pound (£)', symbol: '£' }
  ]

  const handleNext = () => {
    onNext(preferences)
    showSnackbar('Preferências configuradas!', 'success')
  }

  return (
    <div className="preferences-step">
      <div className="preferences-form">
        <div className="form-group">
          <label htmlFor="language-select" className="form-label">
            Idioma da Aplicação
          </label>
          <select
            id="language-select"
            className="form-select focusable"
            value={preferences.language}
            onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
            aria-describedby="language-desc"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          <div id="language-desc" className="form-help">
            Define o idioma da interface da aplicação
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="currency-select" className="form-label">
            Moeda
          </label>
          <select
            id="currency-select"
            className="form-select focusable"
            value={preferences.currency}
            onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
            aria-describedby="currency-desc"
          >
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} {currency.name}
              </option>
            ))}
          </select>
          <div id="currency-desc" className="form-help">
            Moeda utilizada para exibir valores e cálculos
          </div>
        </div>
      </div>

      <div className="step-actions">
        {canGoBack && (
          <button 
            className="btn btn-secondary focusable"
            onClick={onPrevious}
          >
            Voltar
          </button>
        )}
        
        <button 
          className="btn btn-primary btn-large focusable"
          onClick={handleNext}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

// Passo 3: Instalação PWA
function PWAInstallStep({ onNext, onPrevious, canGoBack, isLoading }: any) {
  const { installPrompt, installApp } = usePWA()
  const [installAttempted, setInstallAttempted] = useState(false)
  const [installResult, setInstallResult] = useState<'success' | 'failed' | null>(null)

  const handleInstall = async () => {
    if (installPrompt) {
      setInstallAttempted(true)
      
      try {
        const success = await installApp()
        setInstallResult(success ? 'success' : 'failed')
        
        if (success) {
          showSnackbar('App instalado com sucesso! 🎉', 'success')
        } else {
          showSnackbar('Instalação cancelada pelo utilizador', 'info')
        }
      } catch (error) {
        setInstallResult('failed')
        showSnackbar('Erro na instalação. Pode usar no browser', 'warning')
      }
    }
  }

  const handleSkip = () => {
    onNext({ skipPWA: true })
  }

  const handleFinish = () => {
    onNext({ skipPWA: false, installed: installResult === 'success' })
  }

  return (
    <div className="pwa-install-step">
      <div className="pwa-benefits">
        <h3>Vantagens da Instalação</h3>
        <ul className="benefits-list">
          <li>
            <span className="benefit-icon" aria-hidden="true">⚡</span>
            <div>
              <strong>Acesso Instantâneo</strong>
              <p>Ícone na tela inicial para abertura rápida</p>
            </div>
          </li>
          <li>
            <span className="benefit-icon" aria-hidden="true">📱</span>
            <div>
              <strong>Experiência Nativa</strong>
              <p>Interface similar a uma app mobile</p>
            </div>
          </li>
          <li>
            <span className="benefit-icon" aria-hidden="true">🔄</span>
            <div>
              <strong>Funcionalidade Offline</strong>
              <p>Acesso aos dados mesmo sem internet</p>
            </div>
          </li>
          <li>
            <span className="benefit-icon" aria-hidden="true">🔔</span>
            <div>
              <strong>Notificações Push</strong>
              <p>Alertas sobre tráfego e oportunidades</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="pwa-installation">
        {!installAttempted ? (
          <>
            {installPrompt ? (
              <button
                className="btn btn-primary btn-large focusable"
                onClick={handleInstall}
                aria-describedby="install-desc"
              >
                📱 Instalar DriverPro F1
              </button>
            ) : (
              <div className="install-unavailable">
                <p>Instalação não disponível neste browser</p>
                <p className="text-sm">Pode adicionar aos marcadores ou usar normalmente</p>
              </div>
            )}
            <div id="install-desc" className="sr-only">
              Instalar aplicação DriverPro F1 como PWA no dispositivo
            </div>
          </>
        ) : (
          <div className="install-result">
            {installResult === 'success' && (
              <div className="result-success">
                <span className="result-icon">✅</span>
                <h4>Instalação Concluída!</h4>
                <p>O DriverPro F1 foi adicionado ao seu dispositivo</p>
              </div>
            )}
            
            {installResult === 'failed' && (
              <div className="result-failed">
                <span className="result-icon">⚠️</span>
                <h4>Instalação Não Concluída</h4>
                <p>Pode continuar a usar a aplicação no browser</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="step-actions">
        {canGoBack && (
          <button 
            className="btn btn-secondary focusable"
            onClick={onPrevious}
            disabled={isLoading}
          >
            Voltar
          </button>
        )}

        <div className="final-actions">
          <button 
            className="btn btn-ghost focusable"
            onClick={handleSkip}
            disabled={isLoading}
          >
            Saltar
          </button>
          
          <button 
            className="btn btn-primary btn-large focusable"
            onClick={handleFinish}
            disabled={isLoading}
          >
            {isLoading ? 'A concluir...' : 'Começar 🏁'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

## Sistema de Snackbars

```tsx
// components/UI/Snackbar.tsx
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'

interface SnackbarMessage {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface SnackbarContextType {
  showSnackbar: (message: string, type?: SnackbarMessage['type'], duration?: number, action?: SnackbarMessage['action']) => void
  hideSnackbar: (id: string) => void
}

const SnackbarContext = createContext<SnackbarContextType | null>(null)

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<SnackbarMessage[]>([])

  const showSnackbar = (
    message: string, 
    type: SnackbarMessage['type'] = 'info', 
    duration: number = 5000,
    action?: SnackbarMessage['action']
  ) => {
    const id = `snackbar-${Date.now()}-${Math.random()}`
    
    const newMessage: SnackbarMessage = {
      id,
      message,
      type,
      duration,
      action
    }

    setMessages(prev => [...prev, newMessage])

    // Auto-hide após duração especificada
    if (duration > 0) {
      setTimeout(() => {
        hideSnackbar(id)
      }, duration)
    }
  }

  const hideSnackbar = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id))
  }

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <SnackbarContainer messages={messages} onHide={hideSnackbar} />
    </SnackbarContext.Provider>
  )
}

export function useSnackbar() {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider')
  }
  return context
}

// Função global para fácil acesso
let globalShowSnackbar: (message: string, type?: SnackbarMessage['type']) => void

export function showSnackbar(message: string, type?: SnackbarMessage['type']) {
  if (globalShowSnackbar) {
    globalShowSnackbar(message, type)
  }
}

// Container dos Snackbars
function SnackbarContainer({ 
  messages, 
  onHide 
}: { 
  messages: SnackbarMessage[]
  onHide: (id: string) => void 
}) {
  // Registar função global
  const { showSnackbar } = useSnackbar()
  
  useEffect(() => {
    globalShowSnackbar = showSnackbar
  }, [showSnackbar])

  if (messages.length === 0) return null

  return (
    <div 
      className="snackbar-container"
      role="region"
      aria-label="Notificações"
      aria-live="polite"
      aria-atomic="false"
    >
      {messages.map(message => (
        <SnackbarItem 
          key={message.id}
          message={message}
          onHide={onHide}
        />
      ))}
    </div>
  )
}

// Componente individual de Snackbar
function SnackbarItem({ 
  message, 
  onHide 
}: { 
  message: SnackbarMessage
  onHide: (id: string) => void 
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Animar entrada
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])

  const handleHide = () => {
    setIsExiting(true)
    setTimeout(() => {
      onHide(message.id)
    }, 300) // Duração da animação de saída
  }

  const getIcon = () => {
    switch (message.type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      default: return 'ℹ️'
    }
  }

  const getColors = () => {
    switch (message.type) {
      case 'success': return { bg: '#059669', text: '#ffffff' }
      case 'warning': return { bg: '#D97706', text: '#ffffff' }
      case 'error': return { bg: '#DC2626', text: '#ffffff' }
      default: return { bg: '#1E41FF', text: '#ffffff' }
    }
  }

  const colors = getColors()

  return (
    <div
      className={`snackbar ${isVisible ? 'visible' : ''} ${isExiting ? 'exiting' : ''}`}
      style={{
        '--snackbar-bg': colors.bg,
        '--snackbar-text': colors.text
      } as React.CSSProperties}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="snackbar-content">
        <span className="snackbar-icon" aria-hidden="true">
          {getIcon()}
        </span>
        
        <span className="snackbar-message">
          {message.message}
        </span>
      </div>

      <div className="snackbar-actions">
        {message.action && (
          <button
            className="snackbar-action focusable"
            onClick={() => {
              message.action?.onClick()
              handleHide()
            }}
          >
            {message.action.label}
          </button>
        )}
        
        <button
          className="snackbar-close focusable"
          onClick={handleHide}
          aria-label="Fechar notificação"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
```

## CSS para Onboarding e Snackbars

```css
/* Onboarding Styles */
.onboarding-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.onboarding-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
}

.onboarding-container {
  position: relative;
  background: var(--surface);
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
}

.onboarding-header {
  padding: 32px 32px 24px;
  text-align: center;
  border-bottom: 1px solid var(--border);
}

.onboarding-progress {
  margin-bottom: 24px;
}

.progress-bar {
  height: 6px;
  background: var(--surface-secondary);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--team-primary, #1E41FF), var(--team-secondary, #DC143C));
  transition: width 0.5s ease;
  border-radius: 3px;
}

.progress-text {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.onboarding-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.onboarding-description {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 600px;
  margin: 0 auto;
}

.onboarding-content {
  padding: 32px;
}

/* Team Selection Step */
.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.team-option {
  cursor: pointer;
}

.team-card {
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.team-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--team-primary);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.team-card:hover,
.team-card.selected {
  border-color: var(--team-primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.team-card:hover::before,
.team-card.selected::before {
  transform: scaleX(1);
}

.team-emoji {
  font-size: 32px;
  margin-bottom: 16px;
}

.team-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.team-colors {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.color-swatch {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--border);
}

/* Preferences Step */
.preferences-form {
  max-width: 400px;
  margin: 0 auto 32px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  font-size: 16px;
}

.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text-primary);
  font-size: 16px;
  transition: all 0.2s ease;
}

.form-select:focus {
  border-color: var(--team-primary, #1E41FF);
  outline: none;
  box-shadow: 0 0 0 4px rgba(30, 65, 255, 0.1);
}

.form-help {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 6px;
}

/* PWA Install Step */
.pwa-benefits {
  margin-bottom: 32px;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.benefits-list li {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: var(--surface-secondary);
  border-radius: 8px;
}

.benefit-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.benefits-list strong {
  display: block;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.benefits-list p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 14px;
}

.pwa-installation {
  text-align: center;
  margin-bottom: 32px;
}

.install-result {
  padding: 24px;
  border-radius: 12px;
  border: 2px solid var(--border);
}

.result-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

.final-actions {
  display: flex;
  gap: 12px;
}

/* Snackbar Styles */
.snackbar-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
  pointer-events: none;
}

.snackbar {
  background: var(--snackbar-bg);
  color: var(--snackbar-text);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: auto;
  min-width: 300px;
}

.snackbar.visible {
  transform: translateX(0);
  opacity: 1;
}

.snackbar.exiting {
  transform: translateX(100%);
  opacity: 0;
}

.snackbar-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.snackbar-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.snackbar-message {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.snackbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.snackbar-action {
  background: transparent;
  border: 1px solid currentColor;
  color: inherit;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
}

.snackbar-action:hover {
  background: rgba(255, 255, 255, 0.1);
}

.snackbar-close {
  background: transparent;
  border: none;
  color: inherit;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
}

.snackbar-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .onboarding-container {
    margin: 0;
    border-radius: 0;
    height: 100vh;
    max-height: none;
  }
  
  .teams-grid {
    grid-template-columns: 1fr;
  }
  
  .step-actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }
  
  .final-actions {
    justify-content: space-between;
    width: 100%;
  }
  
  .snackbar-container {
    top: auto;
    bottom: 24px;
    right: 16px;
    left: 16px;
    max-width: none;
  }
  
  .snackbar {
    min-width: auto;
  }
}
```