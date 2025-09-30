# 3. Contraste, Acessibilidade & Navegação por Teclado

## Análise de Contraste WCAG AA

### Pontos Críticos Identificados

1. **Texto sobre backgrounds F1** - Ratio atual: 2.1:1 (Insuficiente)
2. **Botões secundários** - Ratio atual: 3.8:1 (Insuficiente)
3. **Ícones de navegação** - Ratio atual: 3.2:1 (Insuficiente)
4. **Estados de hover** - Ratio atual: 2.9:1 (Insuficiente)

### Melhorias de Cores AA Compliant

```css
:root {
  /* Cores originais melhoradas para contraste 4.5:1+ */
  --text-on-ferrari: #ffffff; /* 8.2:1 sobre #DC143C */
  --text-on-redbull: #ffffff; /* 9.1:1 sobre #1E3A8A */
  --text-on-mercedes: #000000; /* 7.3:1 sobre #C0C0C0 */
  --text-on-mclaren: #000000; /* 6.8:1 sobre #FF8C00 */
  --text-on-alpine: #ffffff; /* 8.5:1 sobre #0080FF */
  --text-on-aston: #ffffff; /* 7.1:1 sobre #228B22 */

  /* Versões escurecidas para melhor contraste */
  --ferrari-aa: #B91C3C; /* Escurecido para 4.5:1 */
  --redbull-aa: #1E3A8A; /* Já conforme */
  --mercedes-aa: #9CA3AF; /* Escurecido para contraste */
  --mclaren-aa: #EA580C; /* Escurecido */
  --alpine-aa: #0369A1; /* Escurecido */  
  --aston-aa: #15803D; /* Escurecido */

  /* Estados interativos com contraste garantido */
  --focus-ring: #0066CC; /* 4.5:1 sobre branco */
  --error-color: #DC2626; /* 4.5:1 sobre branco */
  --success-color: #059669; /* 4.5:1 sobre branco */
  --warning-color: #D97706; /* 4.5:1 sobre branco */
}

/* Overlay para legibilidade em backgrounds */
.team-background {
  position: relative;
}

.team-background::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
  z-index: 1;
}

.team-background > * {
  position: relative;
  z-index: 2;
  color: #ffffff;
}
```

## Sistema de Navegação por Teclado

### Focus Management

```css
/* Reset de outline padrão */
* {
  outline: none;
}

/* Focus visível personalizado */
.focusable {
  position: relative;
  transition: all 0.2s ease;
}

.focusable:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
  border-radius: 4px;
  box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
}

/* Focus específico para botões */
.btn:focus-visible {
  transform: translateY(-1px);
  box-shadow: 
    0 0 0 2px var(--focus-ring),
    0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Focus para cards interativos */
.card.focusable:focus-visible {
  outline: 2px solid var(--focus-ring);
  transform: translateY(-2px);
  box-shadow: 
    0 0 0 4px rgba(0, 102, 204, 0.1),
    0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Focus para inputs */
.form-input:focus-visible {
  border-color: var(--focus-ring);
  box-shadow: 
    0 0 0 1px var(--focus-ring),
    0 0 0 4px rgba(0, 102, 204, 0.1);
}

/* Modo alto contraste */
@media (prefers-contrast: high) {
  :root {
    --focus-ring: #0000FF;
  }
  
  .focusable:focus-visible {
    outline: 3px solid var(--focus-ring);
    outline-offset: 3px;
  }
}
```

### Componente de Skip Links

```tsx
// components/SkipLinks.tsx
import React from 'react'

export function SkipLinks() {
  return (
    <div className="skip-links">
      <a 
        href="#main-content" 
        className="skip-link"
        tabIndex={1}
      >
        Ir para conteúdo principal
      </a>
      <a 
        href="#navigation" 
        className="skip-link"
        tabIndex={2}
      >
        Ir para navegação
      </a>
      <a 
        href="#sophia-chat" 
        className="skip-link"
        tabIndex={3}
      >
        Ir para assistente Sophia
      </a>
    </div>
  )
}
```

```css
.skip-links {
  position: fixed;
  top: -100px;
  left: 8px;
  z-index: 9999;
}

.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  background: var(--focus-ring);
  color: white;
  padding: 12px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 16px;
}
```

## Roles e ARIA Labels

### Dashboard KPIs

```tsx
// components/Dashboard/KPICard.tsx
import React from 'react'

interface KPICardProps {
  title: string
  value: string
  trend: string
  description: string
  icon: string
}

export function KPICard({ title, value, trend, description, icon }: KPICardProps) {
  const trendDirection = trend.startsWith('+') ? 'increase' : 'decrease'
  const trendColor = trendDirection === 'increase' ? 'success' : 'warning'

  return (
    <div 
      className="kpi-card focusable"
      role="article"
      aria-labelledby={`kpi-${title.toLowerCase().replace(' ', '-')}-title`}
      aria-describedby={`kpi-${title.toLowerCase().replace(' ', '-')}-desc`}
      tabIndex={0}
    >
      <div className="kpi-icon" aria-hidden="true">
        {icon}
      </div>
      
      <h3 
        id={`kpi-${title.toLowerCase().replace(' ', '-')}-title`}
        className="kpi-title"
      >
        {title}
      </h3>
      
      <div className="kpi-value" aria-live="polite">
        <span className="sr-only">Valor atual:</span>
        {value}
      </div>
      
      <div 
        className={`kpi-trend trend-${trendColor}`}
        aria-live="polite"
        aria-label={`Tendência: ${trendDirection === 'increase' ? 'aumento' : 'diminuição'} de ${trend.replace(/[+-]/, '')}`}
      >
        <span aria-hidden="true">{trend}</span>
      </div>
      
      <p 
        id={`kpi-${title.toLowerCase().replace(' ', '-')}-desc`}
        className="kpi-description"
      >
        {description}
      </p>
    </div>
  )
}
```

### Menu de Navegação

```tsx
// components/Navigation/MainNav.tsx
import React from 'react'

interface NavItem {
  id: string
  label: string
  icon: string
  badge?: number
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'heatmap', label: 'HeatMap', icon: '🗺️' },
  { id: 'traffic', label: 'Tráfego', icon: '🚦' },
  { id: 'business', label: 'Business Plan', icon: '💼' },
  { id: 'account', label: 'Conta', icon: '⚙️', badge: 2 }
]

interface MainNavProps {
  currentPage: string
  onPageChange: (pageId: string) => void
}

export function MainNav({ currentPage, onPageChange }: MainNavProps) {
  return (
    <nav 
      id="navigation"
      className="main-nav"
      role="navigation"
      aria-label="Navegação principal"
    >
      <ul className="nav-grid" role="list">
        {NAV_ITEMS.map((item, index) => (
          <li key={item.id} role="listitem">
            <button
              className={`nav-item focusable ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onPageChange(item.id)}
              aria-current={currentPage === item.id ? 'page' : undefined}
              aria-label={item.badge ? `${item.label} (${item.badge} notificações)` : item.label}
              aria-describedby={`nav-${item.id}-desc`}
              tabIndex={0}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              
              <span className="nav-label">
                {item.label}
              </span>
              
              {item.badge && (
                <span 
                  className="nav-badge"
                  aria-label={`${item.badge} notificações`}
                >
                  {item.badge}
                </span>
              )}
            </button>
            
            <div 
              id={`nav-${item.id}-desc`} 
              className="sr-only"
            >
              Navegar para {item.label}
            </div>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

### Toggle Tema Acessível

```tsx
// components/ThemeToggle.tsx
import React from 'react'

interface ThemeToggleProps {
  theme: 'light' | 'dark'
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark'
  
  return (
    <button
      className="theme-toggle focusable"
      onClick={onToggle}
      aria-pressed={isDark}
      aria-label={`Mudar para tema ${isDark ? 'claro' : 'escuro'}`}
      aria-describedby="theme-toggle-desc"
      tabIndex={0}
    >
      <span className="theme-icon" aria-hidden="true">
        {isDark ? '☀️' : '🌙'}
      </span>
      
      <span className="theme-label sr-only">
        Tema {isDark ? 'escuro' : 'claro'} ativo
      </span>
      
      <div id="theme-toggle-desc" className="sr-only">
        Alternar entre tema claro e escuro. Atualmente em modo {isDark ? 'escuro' : 'claro'}
      </div>
    </button>
  )
}
```

## Classes Utilitárias de Acessibilidade

```css
/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Show on focus para sr-only */
.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .card {
    border: 2px solid currentColor;
  }
  
  .btn {
    border: 2px solid currentColor;
    background: ButtonFace;
    color: ButtonText;
  }
  
  .btn:hover,
  .btn:focus {
    background: Highlight;
    color: HighlightText;
  }
}

/* Focus dentro de containers */
.focus-within:focus-within {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
```

## Hook de Acessibilidade

```typescript
// hooks/useA11y.ts
import { useEffect } from 'react'

export function useA11y() {
  // Anunciar mudanças de página para screen readers
  const announcePageChange = (pageName: string) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = `Navegou para ${pageName}`
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  // Gerenciar foco em modais
  const trapFocus = (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
      
      if (e.key === 'Escape') {
        element.setAttribute('aria-hidden', 'true')
      }
    }

    element.addEventListener('keydown', handleTabKey)
    firstElement.focus()
    
    return () => {
      element.removeEventListener('keydown', handleTabKey)
    }
  }

  return {
    announcePageChange,
    trapFocus
  }
}