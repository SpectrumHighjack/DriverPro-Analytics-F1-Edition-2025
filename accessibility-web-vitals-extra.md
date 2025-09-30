# 10. Acessibilidade Extra & Web Vitals

## Modo Alto Contraste

```tsx
// components/Accessibility/HighContrastMode.tsx
import React, { useState, useEffect } from 'react'

export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false)

  useEffect(() => {
    // Verificar preferência salva
    const saved = localStorage.getItem('high-contrast')
    if (saved === 'true') {
      setIsHighContrast(true)
      applyHighContrast(true)
    }

    // Detectar preferência do sistema
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    if (mediaQuery.matches && !saved) {
      setIsHighContrast(true)
      applyHighContrast(true)
    }

    // Listener para mudanças
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('high-contrast')) {
        setIsHighContrast(e.matches)
        applyHighContrast(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const applyHighContrast = (enabled: boolean) => {
    document.documentElement.classList.toggle('high-contrast', enabled)
    
    // Atualizar meta theme-color para contraste máximo
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme && enabled) {
      metaTheme.setAttribute('content', '#000000')
    }
  }

  const toggleHighContrast = () => {
    const newValue = !isHighContrast
    setIsHighContrast(newValue)
    applyHighContrast(newValue)
    localStorage.setItem('high-contrast', newValue.toString())
  }

  return {
    isHighContrast,
    toggleHighContrast
  }
}

// Componente de controle
export function HighContrastToggle() {
  const { isHighContrast, toggleHighContrast } = useHighContrast()

  return (
    <button
      className="accessibility-control focusable"
      onClick={toggleHighContrast}
      aria-pressed={isHighContrast}
      aria-describedby="high-contrast-desc"
    >
      <span className="control-icon" aria-hidden="true">
        {isHighContrast ? '🔳' : '⚫'}
      </span>
      <span className="control-label">
        Alto Contraste
      </span>
      
      <div id="high-contrast-desc" className="sr-only">
        {isHighContrast 
          ? 'Desativar modo alto contraste' 
          : 'Ativar modo alto contraste para melhor visibilidade'
        }
      </div>
    </button>
  )
}
```

## Controlo de Tamanho de Fonte

```tsx
// components/Accessibility/FontSizeControl.tsx
import React, { useState, useEffect } from 'react'

type FontSize = 'small' | 'normal' | 'large' | 'extra-large'

const FONT_SIZES = {
  'small': { scale: 0.875, label: 'Pequena' },
  'normal': { scale: 1, label: 'Normal' },
  'large': { scale: 1.125, label: 'Grande' },
  'extra-large': { scale: 1.25, label: 'Extra Grande' }
}

export function useFontSize() {
  const [fontSize, setFontSize] = useState<FontSize>('normal')

  useEffect(() => {
    const saved = localStorage.getItem('font-size') as FontSize
    if (saved && FONT_SIZES[saved]) {
      setFontSize(saved)
      applyFontSize(saved)
    }
  }, [])

  const applyFontSize = (size: FontSize) => {
    const scale = FONT_SIZES[size].scale
    document.documentElement.style.setProperty('--font-scale', scale.toString())
    document.documentElement.setAttribute('data-font-size', size)
  }

  const changeFontSize = (size: FontSize) => {
    setFontSize(size)
    applyFontSize(size)
    localStorage.setItem('font-size', size)
    
    // Anunciar mudança para screen readers
    announceToScreenReader(`Tamanho de fonte alterado para ${FONT_SIZES[size].label}`)
  }

  return {
    fontSize,
    changeFontSize,
    availableSizes: FONT_SIZES
  }
}

export function FontSizeControl() {
  const { fontSize, changeFontSize, availableSizes } = useFontSize()

  return (
    <div className="font-size-control" role="group" aria-label="Controlo de tamanho de fonte">
      <label htmlFor="font-size-select" className="control-label">
        Tamanho da Fonte
      </label>
      
      <select
        id="font-size-select"
        value={fontSize}
        onChange={(e) => changeFontSize(e.target.value as FontSize)}
        className="font-size-select focusable"
        aria-describedby="font-size-help"
      >
        {Object.entries(availableSizes).map(([key, { label }]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      
      <div id="font-size-help" className="control-help">
        Ajustar tamanho do texto para melhor legibilidade
      </div>

      {/* Controles de botão alternativos */}
      <div className="font-size-buttons" role="group" aria-label="Botões de tamanho de fonte">
        <button
          className="font-control-btn focusable"
          onClick={() => decreaseFontSize()}
          aria-label="Diminuir tamanho da fonte"
          disabled={fontSize === 'small'}
        >
          A-
        </button>
        
        <button
          className="font-control-btn focusable"
          onClick={() => resetFontSize()}
          aria-label="Tamanho de fonte normal"
        >
          A
        </button>
        
        <button
          className="font-control-btn focusable"
          onClick={() => increaseFontSize()}
          aria-label="Aumentar tamanho da fonte"
          disabled={fontSize === 'extra-large'}
        >
          A+
        </button>
      </div>
    </div>
  )

  function decreaseFontSize() {
    const sizes = Object.keys(availableSizes) as FontSize[]
    const currentIndex = sizes.indexOf(fontSize)
    if (currentIndex > 0) {
      changeFontSize(sizes[currentIndex - 1])
    }
  }

  function increaseFontSize() {
    const sizes = Object.keys(availableSizes) as FontSize[]
    const currentIndex = sizes.indexOf(fontSize)
    if (currentIndex < sizes.length - 1) {
      changeFontSize(sizes[currentIndex + 1])
    }
  }

  function resetFontSize() {
    changeFontSize('normal')
  }
}
```

## Navegação Exclusiva por Teclado

```tsx
// components/Accessibility/KeyboardOnlyMode.tsx
import React, { useState, useEffect } from 'react'

export function useKeyboardOnlyMode() {
  const [isKeyboardOnly, setIsKeyboardOnly] = useState(false)
  const [showFocusOutlines, setShowFocusOutlines] = useState(false)

  useEffect(() => {
    let keyboardUsed = false

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        keyboardUsed = true
        setShowFocusOutlines(true)
        setIsKeyboardOnly(true)
        document.body.classList.add('keyboard-navigation')
      }
    }

    const handleMouseDown = () => {
      if (keyboardUsed) {
        keyboardUsed = false
        setShowFocusOutlines(false)
        setIsKeyboardOnly(false)
        document.body.classList.remove('keyboard-navigation')
      }
    }

    // Detectar se usuário prefere navegação por teclado
    const prefersKeyboard = localStorage.getItem('prefers-keyboard') === 'true'
    if (prefersKeyboard) {
      setIsKeyboardOnly(true)
      setShowFocusOutlines(true)
      document.body.classList.add('keyboard-navigation')
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  const enableKeyboardMode = () => {
    setIsKeyboardOnly(true)
    setShowFocusOutlines(true)
    document.body.classList.add('keyboard-navigation')
    localStorage.setItem('prefers-keyboard', 'true')
    announceToScreenReader('Modo navegação por teclado ativado')
  }

  const disableKeyboardMode = () => {
    setIsKeyboardOnly(false)
    setShowFocusOutlines(false)
    document.body.classList.remove('keyboard-navigation')
    localStorage.setItem('prefers-keyboard', 'false')
    announceToScreenReader('Modo navegação por teclado desativado')
  }

  return {
    isKeyboardOnly,
    showFocusOutlines,
    enableKeyboardMode,
    disableKeyboardMode
  }
}

// Utilitário para anúncios aos leitores de ecrã
function announceToScreenReader(message: string) {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}
```

## Web Vitals Dashboard

```tsx
// components/Performance/WebVitalsDashboard.tsx
import React, { useState, useEffect } from 'react'
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals'

interface WebVitalMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  description: string
}

export function WebVitalsDashboard() {
  const [vitals, setVitals] = useState<WebVitalMetric[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Coletar métricas Web Vitals
    const metrics: WebVitalMetric[] = []

    getCLS((metric) => {
      metrics.push({
        name: 'CLS',
        value: metric.value,
        rating: metric.rating,
        description: 'Cumulative Layout Shift - estabilidade visual'
      })
      updateMetrics([...metrics])
    })

    getFCP((metric) => {
      metrics.push({
        name: 'FCP',
        value: metric.value,
        rating: metric.rating,
        description: 'First Contentful Paint - primeiro conteúdo'
      })
      updateMetrics([...metrics])
    })

    getFID((metric) => {
      metrics.push({
        name: 'FID',
        value: metric.value,
        rating: metric.rating,
        description: 'First Input Delay - responsividade'
      })
      updateMetrics([...metrics])
    })

    getLCP((metric) => {
      metrics.push({
        name: 'LCP',
        value: metric.value,
        rating: metric.rating,
        description: 'Largest Contentful Paint - velocidade de carregamento'
      })
      updateMetrics([...metrics])
    })

    getTTFB((metric) => {
      metrics.push({
        name: 'TTFB',
        value: metric.value,
        rating: metric.rating,
        description: 'Time to First Byte - resposta do servidor'
      })
      updateMetrics([...metrics])
    })

    // Atalho para mostrar/esconder dashboard
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  const updateMetrics = (newMetrics: WebVitalMetric[]) => {
    setVitals(newMetrics)
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return '#059669'
      case 'needs-improvement': return '#D97706'
      case 'poor': return '#DC2626'
      default: return '#6B7280'
    }
  }

  const formatValue = (name: string, value: number) => {
    if (name === 'CLS') {
      return value.toFixed(3)
    }
    return `${Math.round(value)}ms`
  }

  if (!isVisible) {
    return (
      <div className="web-vitals-trigger">
        <button
          className="vitals-toggle focusable"
          onClick={() => setIsVisible(true)}
          aria-label="Mostrar métricas Web Vitals"
          title="Ctrl+Shift+P para alternar"
        >
          📊
        </button>
      </div>
    )
  }

  return (
    <div 
      className="web-vitals-dashboard"
      role="region"
      aria-label="Dashboard de métricas Web Vitals"
    >
      <div className="vitals-header">
        <h3>Web Vitals - Performance</h3>
        <button
          className="close-vitals focusable"
          onClick={() => setIsVisible(false)}
          aria-label="Fechar dashboard"
        >
          ✕
        </button>
      </div>

      <div className="vitals-grid">
        {vitals.map(metric => (
          <div 
            key={metric.name}
            className="vital-card"
            style={{ '--rating-color': getRatingColor(metric.rating) } as React.CSSProperties}
          >
            <div className="vital-header">
              <h4>{metric.name}</h4>
              <span 
                className={`rating-badge rating-${metric.rating}`}
                aria-label={`Classificação: ${metric.rating}`}
              >
                {metric.rating === 'good' ? '✅' : 
                 metric.rating === 'needs-improvement' ? '⚠️' : '❌'}
              </span>
            </div>

            <div className="vital-value">
              {formatValue(metric.name, metric.value)}
            </div>

            <div className="vital-description">
              {metric.description}
            </div>

            <div className="vital-bar">
              <div 
                className="vital-progress"
                style={{ 
                  backgroundColor: getRatingColor(metric.rating),
                  width: `${Math.min(100, (metric.value / getMaxValue(metric.name)) * 100)}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="vitals-footer">
        <p className="vitals-help">
          <kbd>Ctrl+Shift+P</kbd> para alternar | 
          Métricas atualizadas em tempo real
        </p>
      </div>
    </div>
  )

  function getMaxValue(name: string) {
    switch (name) {
      case 'CLS': return 0.25
      case 'FCP': return 3000
      case 'FID': return 300
      case 'LCP': return 4000
      case 'TTFB': return 1500
      default: return 1000
    }
  }
}
```

## Menu de Acessibilidade

```tsx
// components/Accessibility/AccessibilityMenu.tsx
import React, { useState } from 'react'
import { HighContrastToggle } from './HighContrastMode'
import { FontSizeControl } from './FontSizeControl'
import { useKeyboardOnlyMode } from './KeyboardOnlyMode'

export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { isKeyboardOnly, enableKeyboardMode, disableKeyboardMode } = useKeyboardOnlyMode()

  const toggleMenu = () => {
    setIsOpen(prev => !prev)
    if (!isOpen) {
      announceToScreenReader('Menu de acessibilidade aberto')
    }
  }

  return (
    <div className="accessibility-menu">
      <button
        className="accessibility-trigger focusable"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        aria-label="Abrir menu de acessibilidade"
      >
        <span className="trigger-icon" aria-hidden="true">♿</span>
        <span className="trigger-text">Acessibilidade</span>
      </button>

      {isOpen && (
        <div 
          id="accessibility-panel"
          className="accessibility-panel"
          role="menu"
          aria-label="Opções de acessibilidade"
        >
          <div className="panel-header">
            <h3>Opções de Acessibilidade</h3>
            <button
              className="close-panel focusable"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar menu"
            >
              ✕
            </button>
          </div>

          <div className="panel-content">
            {/* Alto Contraste */}
            <div className="accessibility-section">
              <h4>Visual</h4>
              <HighContrastToggle />
              <FontSizeControl />
            </div>

            {/* Navegação */}
            <div className="accessibility-section">
              <h4>Navegação</h4>
              <div className="control-group">
                <label className="control-label">Navegação por Teclado</label>
                <div className="toggle-buttons">
                  <button
                    className={`toggle-option ${isKeyboardOnly ? 'active' : ''} focusable`}
                    onClick={enableKeyboardMode}
                    aria-pressed={isKeyboardOnly}
                  >
                    Ativar
                  </button>
                  <button
                    className={`toggle-option ${!isKeyboardOnly ? 'active' : ''} focusable`}
                    onClick={disableKeyboardMode}
                    aria-pressed={!isKeyboardOnly}
                  >
                    Desativar
                  </button>
                </div>
              </div>
            </div>

            {/* Atalhos de Teclado */}
            <div className="accessibility-section">
              <h4>Atalhos de Teclado</h4>
              <div className="keyboard-shortcuts">
                <div className="shortcut-item">
                  <kbd>Tab</kbd>
                  <span>Navegar entre elementos</span>
                </div>
                <div className="shortcut-item">
                  <kbd>Enter</kbd>
                  <span>Ativar botões/links</span>
                </div>
                <div className="shortcut-item">
                  <kbd>Escape</kbd>
                  <span>Fechar modais/menus</span>
                </div>
                <div className="shortcut-item">
                  <kbd>Arrow Keys</kbd>
                  <span>Navegar em listas/menus</span>
                </div>
                <div className="shortcut-item">
                  <kbd>Ctrl+Shift+P</kbd>
                  <span>Web Vitals</span>
                </div>
              </div>
            </div>

            {/* Reset */}
            <div className="accessibility-section">
              <button
                className="reset-accessibility focusable"
                onClick={resetAccessibilitySettings}
              >
                Repor Configurações Padrão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  function resetAccessibilitySettings() {
    localStorage.removeItem('high-contrast')
    localStorage.removeItem('font-size')
    localStorage.removeItem('prefers-keyboard')
    
    document.documentElement.classList.remove('high-contrast')
    document.documentElement.style.removeProperty('--font-scale')
    document.body.classList.remove('keyboard-navigation')
    
    announceToScreenReader('Configurações de acessibilidade repostas')
    setIsOpen(false)
  }
}
```

## CSS para Acessibilidade Extra

```css
/* High Contrast Mode */
.high-contrast {
  --bg-primary: #000000 !important;
  --bg-secondary: #000000 !important;
  --surface: #000000 !important;
  --surface-secondary: #1a1a1a !important;
  --text-primary: #ffffff !important;
  --text-secondary: #ffffff !important;
  --border: #ffffff !important;
  --border-light: #ffffff !important;
  
  /* Cores de contraste máximo */
  --success-color: #00ff00 !important;
  --warning-color: #ffff00 !important;
  --error-color: #ff0000 !important;
  --info-color: #00ffff !important;
}

.high-contrast * {
  background-color: inherit;
  color: inherit;
  border-color: #ffffff;
}

.high-contrast img {
  filter: contrast(200%) brightness(150%);
}

/* Font Size Control */
:root {
  --font-scale: 1;
  --base-font-size: calc(16px * var(--font-scale));
}

[data-font-size="small"] { --font-scale: 0.875; }
[data-font-size="normal"] { --font-scale: 1; }
[data-font-size="large"] { --font-scale: 1.125; }
[data-font-size="extra-large"] { --font-scale: 1.25; }

body {
  font-size: var(--base-font-size);
}

h1 { font-size: calc(2rem * var(--font-scale)); }
h2 { font-size: calc(1.75rem * var(--font-scale)); }
h3 { font-size: calc(1.5rem * var(--font-scale)); }
h4 { font-size: calc(1.25rem * var(--font-scale)); }
h5 { font-size: calc(1.125rem * var(--font-scale)); }
h6 { font-size: calc(1rem * var(--font-scale)); }

.btn {
  font-size: calc(0.875rem * var(--font-scale));
  padding: calc(8px * var(--font-scale)) calc(16px * var(--font-scale));
}

/* Keyboard Navigation */
.keyboard-navigation *:focus-visible {
  outline: 3px solid #0066CC !important;
  outline-offset: 2px !important;
  box-shadow: 0 0 0 6px rgba(0, 102, 204, 0.2) !important;
}

.keyboard-navigation button:focus-visible,
.keyboard-navigation [role="button"]:focus-visible {
  outline: 3px solid #0066CC !important;
  background-color: rgba(0, 102, 204, 0.1) !important;
}

/* Web Vitals Dashboard */
.web-vitals-dashboard {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-lg);
  max-width: 400px;
  z-index: 1000;
}

.vitals-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.vitals-grid {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
}

.vital-card {
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-secondary);
}

.vital-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.vital-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--rating-color);
  margin-bottom: 4px;
}

.vital-description {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.vital-bar {
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.vital-progress {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.rating-badge {
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.rating-good { background: #059669; color: white; }
.rating-needs-improvement { background: #D97706; color: white; }
.rating-poor { background: #DC2626; color: white; }

/* Accessibility Menu */
.accessibility-menu {
  position: relative;
}

.accessibility-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.accessibility-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-lg);
  width: 320px;
  z-index: 1001;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.accessibility-section {
  margin-bottom: 20px;
}

.accessibility-section h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.control-group {
  margin-bottom: 16px;
}

.control-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
  color: var(--text-primary);
}

.toggle-buttons {
  display: flex;
  gap: 4px;
}

.toggle-option {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid var(--border);
  background: var(--surface-secondary);
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-option:first-child {
  border-radius: 6px 0 0 6px;
}

.toggle-option:last-child {
  border-radius: 0 6px 6px 0;
}

.toggle-option.active {
  background: var(--focus-ring);
  color: white;
  border-color: var(--focus-ring);
}

.keyboard-shortcuts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shortcut-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.shortcut-item kbd {
  background: var(--surface-secondary);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 6px;
  font-family: monospace;
  font-size: 10px;
}

.reset-accessibility {
  width: 100%;
  padding: 10px;
  background: var(--error-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.reset-accessibility:hover {
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 768px) {
  .web-vitals-dashboard {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .accessibility-panel {
    width: 280px;
  }
}

/* Print styles */
@media print {
  .web-vitals-dashboard,
  .accessibility-menu {
    display: none;
  }
}
```