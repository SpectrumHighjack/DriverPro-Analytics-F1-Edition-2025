# 8. Testes Automáticos

## Testes Jest/React Testing Library

### Teste dos KPIs do Dashboard

```tsx
// __tests__/components/Dashboard.test.tsx
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Dashboard } from '../src/components/Widgets/Dashboard/Dashboard'
import { ThemeProvider } from '../src/hooks/useTheme'

// Mock do contexto de tema
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  )
}

describe('Dashboard Component', () => {
  it('should render all KPI cards', async () => {
    renderWithTheme(<Dashboard />)
    
    // Verificar se todos os KPIs são renderizados
    await waitFor(() => {
      expect(screen.getByText('Ganhos Totais')).toBeInTheDocument()
      expect(screen.getByText('Corridas Completadas')).toBeInTheDocument()
      expect(screen.getByText('Rating Médio')).toBeInTheDocument()
      expect(screen.getByText('Tempo Online')).toBeInTheDocument()
      expect(screen.getByText('Eficiência de Combustível')).toBeInTheDocument()
      expect(screen.getByText('Zona Top Performance')).toBeInTheDocument()
    })
  })

  it('should display correct KPI values', async () => {
    renderWithTheme(<Dashboard />)
    
    await waitFor(() => {
      // Verificar valores dos KPIs (baseado em mock data)
      expect(screen.getByText('€67.50')).toBeInTheDocument()
      expect(screen.getByText('12')).toBeInTheDocument()
      expect(screen.getByText('4.7')).toBeInTheDocument()
      expect(screen.getByText('8.5h')).toBeInTheDocument()
    })
  })

  it('should show trend indicators', async () => {
    renderWithTheme(<Dashboard />)
    
    await waitFor(() => {
      // Verificar indicadores de tendência
      expect(screen.getByText('+5.2%')).toBeInTheDocument()
      expect(screen.getByText('+2')).toBeInTheDocument()
      expect(screen.getByText('+0.1')).toBeInTheDocument()
    })
  })

  it('should be accessible with screen readers', async () => {
    renderWithTheme(<Dashboard />)
    
    await waitFor(() => {
      // Verificar acessibilidade
      const kpiCards = screen.getAllByRole('article')
      expect(kpiCards).toHaveLength(6)
      
      // Verificar ARIA labels
      kpiCards.forEach(card => {
        expect(card).toHaveAttribute('aria-labelledby')
        expect(card).toHaveAttribute('aria-describedby')
      })
    })
  })

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Dashboard />)
    
    await waitFor(() => {
      const firstCard = screen.getAllByRole('article')[0]
      firstCard.focus()
      
      expect(document.activeElement).toBe(firstCard)
    })
    
    // Testar navegação por Tab
    await user.tab()
    const secondCard = screen.getAllByRole('article')[1]
    expect(document.activeElement).toBe(secondCard)
  })
})
```

### Teste do Sistema de Temas

```tsx
// __tests__/hooks/useTheme.test.tsx
import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../src/hooks/useTheme'

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

describe('useTheme Hook', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear()
    mockLocalStorage.setItem.mockClear()
  })

  it('should start with system theme mode', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    
    expect(result.current.themeMode).toBe('system')
    expect(result.current.activeTheme).toBe('light')
  })

  it('should toggle between light and dark themes', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    
    act(() => {
      result.current.toggleTheme()
    })
    
    expect(result.current.themeMode).toBe('dark')
    expect(result.current.activeTheme).toBe('dark')
    
    act(() => {
      result.current.toggleTheme()
    })
    
    expect(result.current.themeMode).toBe('light')
    expect(result.current.activeTheme).toBe('light')
  })

  it('should persist theme mode to localStorage', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    
    act(() => {
      result.current.setThemeMode('dark')
    })
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme-mode', 'dark')
  })

  it('should load saved theme from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('dark')
    
    const { result } = renderHook(() => useTheme(), { wrapper })
    
    expect(result.current.themeMode).toBe('dark')
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('theme-mode')
  })

  it('should apply theme to document', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    
    act(() => {
      result.current.setThemeMode('dark')
    })
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
```

### Teste do Onboarding

```tsx
// __tests__/components/Onboarding.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { OnboardingFlow } from '../src/components/Onboarding/OnboardingFlow'

// Mock do hook PWA
jest.mock('../src/hooks/usePWA', () => ({
  usePWA: () => ({
    installPrompt: true,
    installApp: jest.fn().mockResolvedValue(true)
  })
}))

describe('OnboardingFlow Component', () => {
  const mockOnComplete = jest.fn()

  beforeEach(() => {
    mockOnComplete.mockClear()
  })

  it('should render first step (team selection)', () => {
    render(<OnboardingFlow onComplete={mockOnComplete} />)
    
    expect(screen.getByText('Escolha a Sua Equipa F1')).toBeInTheDocument()
    expect(screen.getByText('Ferrari')).toBeInTheDocument()
    expect(screen.getByText('Red Bull Racing')).toBeInTheDocument()
    expect(screen.getByText('Mercedes')).toBeInTheDocument()
  })

  it('should show progress indicator', () => {
    render(<OnboardingFlow onComplete={mockOnComplete} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '33.33333333333333')
    expect(screen.getByText('1 de 3')).toBeInTheDocument()
  })

  it('should navigate between steps', async () => {
    const user = userEvent.setup()
    render(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Selecionar Ferrari e continuar
    await user.click(screen.getByLabelText('Escolher equipa Ferrari'))
    await user.click(screen.getByText('Continuar'))
    
    // Verificar se avançou para passo 2
    await waitFor(() => {
      expect(screen.getByText('Configure as Preferências')).toBeInTheDocument()
      expect(screen.getByText('2 de 3')).toBeInTheDocument()
    })
  })

  it('should allow going back to previous step', async () => {
    const user = userEvent.setup()
    render(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Ir para passo 2
    await user.click(screen.getByLabelText('Escolher equipa Ferrari'))
    await user.click(screen.getByText('Continuar'))
    
    await waitFor(() => {
      expect(screen.getByText('Configure as Preferências')).toBeInTheDocument()
    })
    
    // Voltar ao passo 1
    await user.click(screen.getByText('Voltar'))
    
    await waitFor(() => {
      expect(screen.getByText('Escolha a Sua Equipa F1')).toBeInTheDocument()
    })
  })

  it('should be accessible with keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Navegar pelos radio buttons das equipas
    const ferrariOption = screen.getByLabelText('Escolher equipa Ferrari')
    ferrariOption.focus()
    
    expect(document.activeElement).toBe(ferrariOption)
    
    // Usar setas para navegar
    await user.keyboard('{ArrowDown}')
    const redbullOption = screen.getByLabelText('Escolher equipa Red Bull Racing')
    expect(document.activeElement).toBe(redbullOption)
  })

  it('should complete onboarding and call callback', async () => {
    const user = userEvent.setup()
    render(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Passo 1: Selecionar equipa
    await user.click(screen.getByLabelText('Escolher equipa Ferrari'))
    await user.click(screen.getByText('Continuar'))
    
    // Passo 2: Configurar preferências
    await waitFor(() => {
      expect(screen.getByLabelText('Idioma da Aplicação')).toBeInTheDocument()
    })
    await user.click(screen.getByText('Continuar'))
    
    // Passo 3: PWA Installation
    await waitFor(() => {
      expect(screen.getByText('Instale a Aplicação')).toBeInTheDocument()
    })
    await user.click(screen.getByText('Começar 🏁'))
    
    // Verificar se callback foi chamado com configuração correta
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith({
        team: 'ferrari',
        language: 'pt',
        currency: 'EUR',
        skipPWA: true,
        installed: false
      })
    })
  })
})
```

## Testes de Acessibilidade com axe-core

```tsx
// __tests__/accessibility.test.tsx
import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Dashboard } from '../src/components/Widgets/Dashboard/Dashboard'
import { OnboardingFlow } from '../src/components/Onboarding/OnboardingFlow'
import { ThemeProvider } from '../src/hooks/useTheme'

expect.extend(toHaveNoViolations)

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  )
}

describe('Accessibility Tests', () => {
  it('Dashboard should not have accessibility violations', async () => {
    const { container } = renderWithProviders(<Dashboard />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('Onboarding should not have accessibility violations', async () => {
    const mockOnComplete = jest.fn()
    const { container } = render(
      <OnboardingFlow onComplete={mockOnComplete} />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have proper heading hierarchy', () => {
    renderWithProviders(<Dashboard />)
    
    // Verificar hierarquia de headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    
    // Primeiro heading deve ser h1
    expect(headings[0].tagName).toBe('H1')
    
    // Verificar se não há saltos na hierarquia
    let previousLevel = 1
    Array.from(headings).slice(1).forEach(heading => {
      const currentLevel = parseInt(heading.tagName.charAt(1))
      expect(currentLevel).toBeLessThanOrEqual(previousLevel + 1)
      previousLevel = currentLevel
    })
  })

  it('should have sufficient color contrast', async () => {
    const { container } = renderWithProviders(<Dashboard />)
    
    // axe-core verificará automaticamente contraste
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    })
    
    expect(results).toHaveNoViolations()
  })

  it('should have proper ARIA labels and roles', () => {
    renderWithProviders(<Dashboard />)
    
    // Verificar se todos os elementos interativos têm labels
    const buttons = document.querySelectorAll('button')
    buttons.forEach(button => {
      const hasLabel = button.getAttribute('aria-label') || 
                      button.getAttribute('aria-labelledby') ||
                      button.textContent?.trim()
      expect(hasLabel).toBeTruthy()
    })
    
    // Verificar se inputs têm labels
    const inputs = document.querySelectorAll('input')
    inputs.forEach(input => {
      const hasLabel = input.getAttribute('aria-label') ||
                      input.getAttribute('aria-labelledby') ||
                      document.querySelector(`label[for="${input.id}"]`)
      expect(hasLabel).toBeTruthy()
    })
  })
})
```

## Scripts Cypress E2E

```typescript
// cypress/e2e/navigation.cy.ts
describe('DriverPro F1 Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should complete onboarding flow', () => {
    // Verificar se onboarding aparece para novos usuários
    cy.get('[data-cy="onboarding-container"]').should('be.visible')
    
    // Passo 1: Selecionar equipa Ferrari
    cy.get('[data-cy="team-ferrari"]').click()
    cy.get('[data-cy="onboarding-next"]').click()
    
    // Passo 2: Configurar preferências
    cy.get('[data-cy="language-select"]').select('pt')
    cy.get('[data-cy="currency-select"]').select('EUR')
    cy.get('[data-cy="onboarding-next"]').click()
    
    // Passo 3: PWA (skip)
    cy.get('[data-cy="skip-pwa"]').click()
    
    // Verificar se chegou ao dashboard
    cy.get('[data-cy="dashboard-container"]').should('be.visible')
    cy.url().should('include', '/dashboard')
  })

  it('should navigate between widgets', () => {
    // Skip onboarding se já feito
    cy.window().then(win => {
      win.localStorage.setItem('onboardingCompleted', 'true')
    })
    
    cy.reload()
    
    // Navegar para Analytics
    cy.get('[data-cy="nav-analytics"]').click()
    cy.get('[data-cy="analytics-container"]').should('be.visible')
    
    // Navegar para HeatMap
    cy.get('[data-cy="nav-heatmap"]').click()
    cy.get('[data-cy="heatmap-container"]').should('be.visible')
    
    // Navegar para Tráfego
    cy.get('[data-cy="nav-traffic"]').click()
    cy.get('[data-cy="traffic-container"]').should('be.visible')
    
    // Voltar ao Dashboard
    cy.get('[data-cy="nav-dashboard"]').click()
    cy.get('[data-cy="dashboard-container"]').should('be.visible')
  })

  it('should toggle theme', () => {
    cy.get('[data-cy="theme-toggle"]').click()
    
    // Verificar se tema escuro foi aplicado
    cy.get('html').should('have.attr', 'data-theme', 'dark')
    
    // Toggle de volta
    cy.get('[data-cy="theme-toggle"]').click()
    cy.get('html').should('have.attr', 'data-theme', 'light')
  })

  it('should be responsive on mobile', () => {
    // Testar viewport mobile
    cy.viewport(390, 844)
    
    cy.get('[data-cy="dashboard-container"]').should('be.visible')
    
    // Navegar no mobile
    cy.get('[data-cy="nav-analytics"]').click()
    cy.get('[data-cy="analytics-container"]').should('be.visible')
    
    // Verificar se layout é apropriado para mobile
    cy.get('[data-cy="kpi-cards"]').should('have.css', 'grid-template-columns')
  })

  it('should work with keyboard navigation only', () => {
    // Navegar usando apenas teclado
    cy.get('body').tab()
    cy.focused().should('contain', 'Dashboard')
    
    // Navegar pelos widgets
    cy.focused().tab()
    cy.focused().should('contain', 'Analytics')
    
    // Ativar com Enter
    cy.focused().type('{enter}')
    cy.get('[data-cy="analytics-container"]').should('be.visible')
    
    // Testar navegação dentro do widget
    cy.get('body').tab()
    cy.focused().should('be.visible')
  })
})
```

```typescript
// cypress/e2e/pwa.cy.ts
describe('PWA Functionality', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should register service worker', () => {
    cy.window().should('have.property', 'navigator')
    cy.window().then(win => {
      expect(win.navigator.serviceWorker).to.exist
    })
    
    // Verificar se SW foi registrado
    cy.window().its('navigator.serviceWorker.controller').should('exist')
  })

  it('should show install prompt', () => {
    // Simular evento beforeinstallprompt
    cy.window().then(win => {
      const event = new Event('beforeinstallprompt')
      win.dispatchEvent(event)
    })
    
    cy.get('[data-cy="pwa-install-banner"]').should('be.visible')
    cy.get('[data-cy="install-app-button"]').should('be.visible')
  })

  it('should work offline', () => {
    // Simular modo offline
    cy.window().then(win => {
      // Mock navigator.onLine
      Object.defineProperty(win.navigator, 'onLine', {
        writable: true,
        value: false
      })
      
      // Disparar evento offline
      const event = new Event('offline')
      win.dispatchEvent(event)
    })
    
    // Verificar se app continua funcionando
    cy.get('[data-cy="dashboard-container"]').should('be.visible')
    
    // Navegar offline
    cy.get('[data-cy="nav-analytics"]').click()
    cy.get('[data-cy="analytics-container"]').should('be.visible')
    
    // Verificar indicador offline
    cy.get('[data-cy="offline-indicator"]').should('be.visible')
  })

  it('should cache important resources', () => {
    // Verificar se resources estão cached
    cy.window().then(async (win) => {
      const caches = await win.caches.keys()
      expect(caches).to.include.members([
        'driverpro-v1', // App shell cache
        'images',       // Images cache
        'api-cache'     // API cache
      ])
    })
  })
})
```

## Configuração Jest

```json
{
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/src/test/setup.ts"],
    "moduleNameMapping": {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/src/test/fileMock.ts"
    },
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "collectCoverageFrom": [
      "src/**/*.{ts,tsx}",
      "!src/**/*.d.ts",
      "!src/test/**/*"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:a11y": "jest --testPathPattern=accessibility",
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "test:e2e": "start-server-and-test dev http://localhost:5173 cypress:run",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```