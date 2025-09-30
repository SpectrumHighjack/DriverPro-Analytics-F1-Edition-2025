# 6. Modo Noite/Dia Persistente

## Sistema de Tema Persistente

```tsx
// hooks/useTheme.ts
import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

type ThemeMode = 'light' | 'dark' | 'system'
type ActiveTheme = 'light' | 'dark'

interface ThemeContextType {
  themeMode: ThemeMode
  activeTheme: ActiveTheme
  setThemeMode: (mode: ThemeMode) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system')
  const [activeTheme, setActiveTheme] = useState<ActiveTheme>('light')

  // Detectar tema do sistema
  const getSystemTheme = (): ActiveTheme => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Calcular tema ativo baseado na configuração
  const calculateActiveTheme = (mode: ThemeMode): ActiveTheme => {
    switch (mode) {
      case 'light': return 'light'
      case 'dark': return 'dark'
      case 'system': return getSystemTheme()
      default: return 'light'
    }
  }

  // Aplicar tema no documento
  const applyTheme = (theme: ActiveTheme) => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    
    // Atualizar meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff')
    }
  }

  // Carregar tema persistido na inicialização
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode || 'system'
    setThemeModeState(savedMode)
    
    const calculatedTheme = calculateActiveTheme(savedMode)
    setActiveTheme(calculatedTheme)
    applyTheme(calculatedTheme)
  }, [])

  // Listener para mudanças do tema do sistema
  useEffect(() => {
    if (themeMode !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light'
      setActiveTheme(newTheme)
      applyTheme(newTheme)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeMode])

  // Função para definir tema
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode)
    localStorage.setItem('theme-mode', mode)
    
    const calculatedTheme = calculateActiveTheme(mode)
    setActiveTheme(calculatedTheme)
    applyTheme(calculatedTheme)
  }

  // Toggle simples entre light/dark
  const toggleTheme = () => {
    const newMode = activeTheme === 'light' ? 'dark' : 'light'
    setThemeMode(newMode)
  }

  return (
    <ThemeContext.Provider value={{
      themeMode,
      activeTheme,
      setThemeMode,
      toggleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

## Componente Toggle de Tema

```tsx
// components/UI/ThemeToggle.tsx
import React from 'react'
import { useTheme } from '../../hooks/useTheme'

interface ThemeToggleProps {
  variant?: 'icon' | 'switch' | 'dropdown'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function ThemeToggle({ 
  variant = 'icon', 
  size = 'md',
  showLabel = false 
}: ThemeToggleProps) {
  const { themeMode, activeTheme, setThemeMode, toggleTheme } = useTheme()

  if (variant === 'dropdown') {
    return <ThemeDropdown />
  }

  if (variant === 'switch') {
    return <ThemeSwitch size={size} showLabel={showLabel} />
  }

  // Variant 'icon' (padrão)
  return <ThemeIconToggle size={size} showLabel={showLabel} />
}

// Toggle com ícone simples
function ThemeIconToggle({ size, showLabel }: { size: string, showLabel: boolean }) {
  const { activeTheme, toggleTheme } = useTheme()
  
  const getIcon = () => {
    return activeTheme === 'dark' ? '☀️' : '🌙'
  }

  const getLabel = () => {
    return activeTheme === 'dark' ? 'Modo Claro' : 'Modo Escuro'
  }

  const sizeClasses = {
    sm: 'theme-toggle-sm',
    md: 'theme-toggle-md', 
    lg: 'theme-toggle-lg'
  }

  return (
    <button
      className={`theme-toggle theme-toggle-icon ${sizeClasses[size as keyof typeof sizeClasses]} focusable`}
      onClick={toggleTheme}
      aria-label={`Mudar para ${getLabel().toLowerCase()}`}
      aria-pressed={activeTheme === 'dark'}
      title={getLabel()}
    >
      <span className="theme-icon" aria-hidden="true">
        {getIcon()}
      </span>
      
      {showLabel && (
        <span className="theme-label">
          {getLabel()}
        </span>
      )}
      
      <span className="sr-only">
        Tema atual: {activeTheme === 'dark' ? 'escuro' : 'claro'}
      </span>
    </button>
  )
}

// Toggle com switch
function ThemeSwitch({ size, showLabel }: { size: string, showLabel: boolean }) {
  const { activeTheme, toggleTheme } = useTheme()
  
  return (
    <label className="theme-switch-container">
      {showLabel && (
        <span className="theme-switch-label">
          Modo Escuro
        </span>
      )}
      
      <div className={`theme-switch theme-switch-${size}`}>
        <input
          type="checkbox"
          checked={activeTheme === 'dark'}
          onChange={toggleTheme}
          className="theme-switch-input sr-only"
          aria-label="Alternar modo escuro"
        />
        
        <div className="theme-switch-slider">
          <div className="theme-switch-handle">
            <span className="switch-icon" aria-hidden="true">
              {activeTheme === 'dark' ? '🌙' : '☀️'}
            </span>
          </div>
        </div>
      </div>
    </label>
  )
}

// Dropdown com todas as opções
function ThemeDropdown() {
  const { themeMode, setThemeMode } = useTheme()
  
  const options = [
    { value: 'light', label: '☀️ Modo Claro', description: 'Sempre claro' },
    { value: 'dark', label: '🌙 Modo Escuro', description: 'Sempre escuro' },
    { value: 'system', label: '⚙️ Sistema', description: 'Seguir sistema' }
  ]

  return (
    <div className="theme-dropdown">
      <label htmlFor="theme-select" className="sr-only">
        Selecionar tema
      </label>
      
      <select
        id="theme-select"
        value={themeMode}
        onChange={(e) => setThemeMode(e.target.value as any)}
        className="theme-select focusable"
        aria-describedby="theme-select-desc"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <div id="theme-select-desc" className="theme-help">
        {options.find(opt => opt.value === themeMode)?.description}
      </div>
    </div>
  )
}
```

## CSS para Sistema de Tema

```css
/* Variáveis CSS para os temas */
:root {
  /* Modo Claro */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --surface: #ffffff;
  --surface-secondary: #f1f5f9;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #64748b;
  --border: #e2e8f0;
  --border-light: #f1f5f9;
  
  /* Estados */
  --focus-ring: #0066CC;
  --success-color: #059669;
  --warning-color: #D97706;
  --error-color: #DC2626;
  --info-color: #0369A1;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  
  /* Transitions */
  --transition-theme: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Modo Escuro */
[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --surface: #1e293b;
  --surface-secondary: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --border: #374151;
  --border-light: #4b5563;
  
  /* Shadows mais suaves no escuro */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
}

/* Aplicar transições em elementos */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

/* Base styles que respondem ao tema */
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: var(--transition-theme);
}

.surface {
  background-color: var(--surface);
  border-color: var(--border);
}

.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-tertiary { color: var(--text-tertiary); }

/* Theme Toggle Styles */
.theme-toggle {
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: var(--transition-theme);
  position: relative;
  overflow: hidden;
}

.theme-toggle:hover {
  border-color: var(--focus-ring);
  background: var(--surface-secondary);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

.theme-toggle-sm {
  padding: 6px;
  font-size: 14px;
}

.theme-toggle-md {
  padding: 8px 12px;
  font-size: 16px;
}

.theme-toggle-lg {
  padding: 12px 16px;
  font-size: 18px;
}

.theme-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.theme-toggle:hover .theme-icon {
  transform: scale(1.1);
}

.theme-label {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

/* Theme Switch Styles */
.theme-switch-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.theme-switch {
  position: relative;
  background: var(--border);
  border-radius: 50px;
  transition: var(--transition-theme);
}

.theme-switch-sm {
  width: 40px;
  height: 20px;
}

.theme-switch-md {
  width: 50px;
  height: 26px;
}

.theme-switch-lg {
  width: 60px;
  height: 30px;
}

.theme-switch-input:checked + .theme-switch-slider .theme-switch-handle {
  transform: translateX(24px);
}

.theme-switch-sm .theme-switch-input:checked + .theme-switch-slider .theme-switch-handle {
  transform: translateX(20px);
}

.theme-switch-lg .theme-switch-input:checked + .theme-switch-slider .theme-switch-handle {
  transform: translateX(30px);
}

.theme-switch-slider {
  width: 100%;
  height: 100%;
  position: relative;
  background: var(--border);
  border-radius: inherit;
  transition: var(--transition-theme);
}

.theme-switch-input:checked + .theme-switch-slider {
  background: var(--focus-ring);
}

.theme-switch-handle {
  position: absolute;
  top: 2px;
  left: 2px;
  background: var(--surface);
  border-radius: 50%;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}

.theme-switch-sm .theme-switch-handle {
  width: 16px;
  height: 16px;
}

.theme-switch-md .theme-switch-handle {
  width: 22px;
  height: 22px;
}

.theme-switch-lg .theme-switch-handle {
  width: 26px;
  height: 26px;
}

.switch-icon {
  font-size: 10px;
}

.theme-switch-md .switch-icon {
  font-size: 12px;
}

.theme-switch-lg .switch-icon {
  font-size: 14px;
}

/* Theme Dropdown */
.theme-dropdown {
  position: relative;
}

.theme-select {
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition-theme);
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 8px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 36px;
  min-width: 150px;
}

.theme-select:focus {
  border-color: var(--focus-ring);
  outline: none;
  box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
}

.theme-help {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* Detecção de preferência de movimento reduzido */
@media (prefers-reduced-motion: reduce) {
  .theme-toggle,
  .theme-switch-handle,
  .theme-icon {
    transition: none;
  }
}

/* Tema customizado por equipa */
[data-team="ferrari"] {
  --team-primary: #DC143C;
  --team-secondary: #000000;
}

[data-team="redbull"] {
  --team-primary: #1E3A8A;
  --team-secondary: #DC143C;
}

[data-team="mercedes"] {
  --team-primary: #C0C0C0;
  --team-secondary: #000000;
}

[data-team="mclaren"] {
  --team-primary: #FF8C00;
  --team-secondary: #0080FF;
}

[data-team="alpine"] {
  --team-primary: #0080FF;
  --team-secondary: #FF1493;
}

[data-team="astonmartin"] {
  --team-primary: #228B22;
  --team-secondary: #FF1493;
}

/* Override focus color com tema da equipa */
[data-team] {
  --focus-ring: var(--team-primary);
}

/* Estados especiais no modo escuro */
[data-theme="dark"] .theme-toggle {
  border-color: var(--border-light);
}

[data-theme="dark"] .theme-toggle:hover {
  border-color: var(--team-primary, var(--focus-ring));
  background: var(--surface-secondary);
}

/* Animation para mudança de tema */
@keyframes theme-transition {
  0% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

.theme-transition {
  animation: theme-transition 0.3s ease;
}
```

## Hook de Detecção de Tema do Sistema

```tsx
// hooks/useSystemTheme.ts
import { useState, useEffect } from 'react'

export function useSystemTheme() {
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Verificar suporte
    if (!window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    // Set initial value
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } 
    // Safari < 14
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [])

  return systemTheme
}
```

## Storage Utilities para Persistência

```tsx
// utils/themeStorage.ts
const THEME_STORAGE_KEY = 'driverpro-theme-mode'

export const ThemeStorage = {
  get(): 'light' | 'dark' | 'system' {
    if (typeof window === 'undefined') return 'system'
    
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored as 'light' | 'dark' | 'system'
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error)
    }
    
    return 'system'
  },

  set(mode: 'light' | 'dark' | 'system'): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode)
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
    }
  },

  remove(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(THEME_STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to remove theme from localStorage:', error)
    }
  }
}
```

## Integração com Header Principal

```tsx
// components/Layout/Header.tsx
import React from 'react'
import { ThemeToggle } from '../UI/ThemeToggle'

export function Header() {
  return (
    <header className="app-header">
      <div className="header-left">
        <img src="/assets/logos/driverpro-logo.svg" alt="DriverPro F1" className="app-logo" />
        <h1 className="app-title">DriverPro F1</h1>
      </div>

      <div className="header-center">
        <span className="current-page">Dashboard</span>
      </div>

      <div className="header-right">
        <ThemeToggle variant="icon" size="md" />
        
        <button className="menu-button focusable">
          <span className="menu-icon">⚙️</span>
          <span className="sr-only">Abrir menu</span>
        </button>
      </div>
    </header>
  )
}
```