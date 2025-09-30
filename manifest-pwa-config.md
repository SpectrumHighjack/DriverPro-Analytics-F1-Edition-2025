# 1. Manifest & PWA Completo

## manifest.json

```json
{
  "name": "DriverPro Analytics - F1 Edition Plus",
  "short_name": "DriverPro F1",
  "description": "Aplicação PWA para análise de performance de condução com tema F1",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#1E41FF",
  "background_color": "#ffffff",
  "scope": "/",
  "lang": "pt-PT",
  "dir": "ltr",
  "categories": ["productivity", "business", "utilities"],
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png", 
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-180x180.png",
      "sizes": "180x180",
      "type": "image/png",
      "purpose": "apple-touch-icon"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/dashboard-mobile.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshots/dashboard-desktop.png", 
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    }
  ],
  "shortcuts": [
    {
      "name": "Dashboard",
      "short_name": "Dashboard",
      "description": "Ver KPIs principais",
      "url": "/dashboard",
      "icons": [{ "src": "/icons/dashboard-96x96.png", "sizes": "96x96" }]
    },
    {
      "name": "Analytics", 
      "short_name": "Gráficos",
      "description": "Ver análise detalhada",
      "url": "/analytics",
      "icons": [{ "src": "/icons/analytics-96x96.png", "sizes": "96x96" }]
    }
  ]
}
```

## Service Worker com Vite PWA Plugin

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'DriverPro Analytics - F1 Edition Plus',
        short_name: 'DriverPro F1',
        description: 'Aplicação PWA para análise de performance de condução',
        theme_color: '#1E41FF',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512', 
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.driverpro\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
              },
              cacheKeyWillBeUsed: async ({request}) => {
                return `${request.url}?version=1`
              }
            }
          }
        ]
      }
    })
  ]
})
```

### Instalação

```bash
npm install vite-plugin-pwa workbox-window -D
```

### Hook para PWA

```typescript
// hooks/usePWA.ts
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useState, useEffect } from 'react'

export function usePWA() {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [offlineReady, setOfflineReady] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<any>(null)

  const {
    needRefresh: [needRefreshFlag, setNeedRefreshFlag],
    offlineReady: [offlineReadyFlag, setOfflineReadyFlag],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    }
  })

  // Detectar evento de instalação
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const installApp = async () => {
    if (!installPrompt) return false
    
    installPrompt.prompt()
    const result = await installPrompt.userChoice
    
    if (result.outcome === 'accepted') {
      setInstallPrompt(null)
      return true
    }
    return false
  }

  return {
    needRefresh: needRefreshFlag,
    offlineReady: offlineReadyFlag,
    updateServiceWorker,
    installPrompt: !!installPrompt,
    installApp
  }
}
```

### Testar Offline

```bash
# 1. Build da aplicação
npm run build

# 2. Servir localmente
npm run preview

# 3. Abrir DevTools → Application → Service Workers
# 4. Marcar "Offline" e recarregar
# 5. Verificar funcionalidade offline
```

## Componente de Instalação PWA

```tsx
import React from 'react'
import { usePWA } from '../hooks/usePWA'

export function PWAInstallPrompt() {
  const { installPrompt, installApp, needRefresh, updateServiceWorker } = usePWA()

  if (needRefresh) {
    return (
      <div className="pwa-update-banner">
        <p>Nova versão disponível!</p>
        <button onClick={() => updateServiceWorker(true)}>
          Atualizar
        </button>
      </div>
    )
  }

  if (installPrompt) {
    return (
      <div className="pwa-install-banner">
        <div className="pwa-install-content">
          <h3>Instalar DriverPro F1</h3>
          <p>Acesso rápido e funcionalidade offline</p>
          <div className="pwa-install-actions">
            <button 
              className="btn-primary"
              onClick={installApp}
            >
              Instalar App
            </button>
            <button 
              className="btn-secondary"
              onClick={() => setInstallPrompt(null)}
            >
              Agora Não
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
```