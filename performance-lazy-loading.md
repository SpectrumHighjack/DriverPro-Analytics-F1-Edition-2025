# 7. Lazy Loading, Performance & Imagens Otimizadas

## Lazy Loading com React.lazy e Suspense

```tsx
// components/LazyWidgets.tsx
import React, { Suspense } from 'react'

// Lazy loading de widgets principais
const Dashboard = React.lazy(() => import('./Widgets/Dashboard/Dashboard'))
const Analytics = React.lazy(() => import('./Widgets/Analytics/Analytics'))
const HeatMap = React.lazy(() => import('./Widgets/HeatMap/HeatMap'))
const Traffic = React.lazy(() => import('./Widgets/Traffic/TrafficWidget'))
const BusinessPlan = React.lazy(() => import('./Widgets/BusinessPlan/BusinessPlan'))
const Account = React.lazy(() => import('./Widgets/Account/AccountSettings'))

// Componente de loading skeleton
function WidgetSkeleton() {
  return (
    <div className="widget-skeleton" role="status" aria-label="Carregando widget">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-actions"></div>
      </div>
      <div className="skeleton-content">
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
        <div className="skeleton-chart"></div>
      </div>
      <span className="sr-only">Carregando conteúdo...</span>
    </div>
  )
}

// Router com lazy loading
export function AppRoutes({ currentWidget }: { currentWidget: string }) {
  const renderWidget = () => {
    switch (currentWidget) {
      case 'dashboard':
        return (
          <Suspense fallback={<WidgetSkeleton />}>
            <Dashboard />
          </Suspense>
        )
      case 'analytics':
        return (
          <Suspense fallback={<WidgetSkeleton />}>
            <Analytics />
          </Suspense>
        )
      case 'heatmap':
        return (
          <Suspense fallback={<WidgetSkeleton />}>
            <HeatMap />
          </Suspense>
        )
      case 'traffic':
        return (
          <Suspense fallback={<WidgetSkeleton />}>
            <Traffic />
          </Suspense>
        )
      case 'business':
        return (
          <Suspense fallback={<WidgetSkeleton />}>
            <BusinessPlan />
          </Suspense>
        )
      case 'account':
        return (
          <Suspense fallback={<WidgetSkeleton />}>
            <Account />
          </Suspense>
        )
      default:
        return (
          <Suspense fallback={<WidgetSkeleton />}>
            <Dashboard />
          </Suspense>
        )
    }
  }

  return (
    <div className="widget-container">
      {renderWidget()}
    </div>
  )
}
```

## Otimização de Imagens

```tsx
// components/UI/OptimizedImage.tsx
import React, { useState, useRef, useEffect } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  lazy?: boolean
  placeholder?: string
  formats?: ('webp' | 'avif' | 'jpg' | 'png')[]
  sizes?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  lazy = true,
  placeholder,
  formats = ['webp', 'avif', 'jpg'],
  sizes
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(!lazy)
  const imgRef = useRef<HTMLImageElement>(null)

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (!lazy || isInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px' // Carregar 50px antes de aparecer
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [lazy, isInView])

  // Gerar sources para diferentes formatos
  const generateSources = () => {
    const baseName = src.replace(/\.[^/.]+$/, '')
    
    return formats.map(format => ({
      format,
      srcSet: `${baseName}.${format}`,
      type: `image/${format}`
    }))
  }

  const sources = generateSources()

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(true)
  }

  return (
    <div 
      className={`optimized-image-container ${className}`}
      style={{ width, height }}
    >
      {isInView ? (
        <picture>
          {sources.map(source => (
            <source
              key={source.format}
              srcSet={source.srcSet}
              type={source.type}
              sizes={sizes}
            />
          ))}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`optimized-image ${isLoaded ? 'loaded' : ''} ${hasError ? 'error' : ''}`}
            onLoad={handleLoad}
            onError={handleError}
            loading={lazy ? 'lazy' : 'eager'}
            decoding="async"
          />
        </picture>
      ) : (
        <div 
          ref={imgRef}
          className="image-placeholder"
          style={{ 
            width, 
            height,
            backgroundColor: '#f1f5f9',
            backgroundImage: placeholder ? `url(${placeholder})` : 'none'
          }}
          aria-label={`Carregando: ${alt}`}
        />
      )}
      
      {!isLoaded && isInView && (
        <div className="image-loading" aria-hidden="true">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  )
}
```

## Prefetch de Rotas

```tsx
// hooks/usePrefetch.ts
import { useEffect } from 'react'

const PREFETCH_PRIORITY = {
  dashboard: 1,
  analytics: 2,
  heatmap: 3,
  traffic: 4,
  business: 5,
  account: 6
}

export function usePrefetch() {
  useEffect(() => {
    // Prefetch de rotas com prioridade
    const prefetchRoutes = async () => {
      const routes = Object.keys(PREFETCH_PRIORITY).sort(
        (a, b) => PREFETCH_PRIORITY[a as keyof typeof PREFETCH_PRIORITY] - 
                 PREFETCH_PRIORITY[b as keyof typeof PREFETCH_PRIORITY]
      )

      for (const route of routes) {
        try {
          // Prefetch com delay para não bloquear thread principal
          await new Promise(resolve => setTimeout(resolve, 100))
          
          switch (route) {
            case 'dashboard':
              import('../components/Widgets/Dashboard/Dashboard')
              break
            case 'analytics':
              import('../components/Widgets/Analytics/Analytics')
              break
            case 'heatmap':
              import('../components/Widgets/HeatMap/HeatMap')
              break
            case 'traffic':
              import('../components/Widgets/Traffic/TrafficWidget')
              break
            case 'business':
              import('../components/Widgets/BusinessPlan/BusinessPlan')
              break
            case 'account':
              import('../components/Widgets/Account/AccountSettings')
              break
          }
        } catch (error) {
          console.warn(`Failed to prefetch ${route}:`, error)
        }
      }
    }

    // Delay inicial para não interferir com carregamento inicial
    const timeout = setTimeout(prefetchRoutes, 2000)
    return () => clearTimeout(timeout)
  }, [])

  // Prefetch de assets específicos
  const prefetchAssets = (assets: string[]) => {
    assets.forEach(asset => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = asset
      document.head.appendChild(link)
    })
  }

  return { prefetchAssets }
}
```

## Performance Monitoring

```tsx
// utils/performance.ts
interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {}
  
  constructor() {
    this.initObservers()
  }

  private initObservers() {
    // Observar Core Web Vitals
    if ('web-vitals' in window || this.supportsPerformanceObserver()) {
      this.observeLCP()
      this.observeFID()
      this.observeCLS()
      this.observeFCP()
      this.observeTTFB()
    }
  }

  private supportsPerformanceObserver(): boolean {
    return 'PerformanceObserver' in window
  }

  private observeLCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as any
      this.metrics.lcp = lastEntry.startTime
      this.reportMetric('LCP', lastEntry.startTime)
    })

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      console.warn('LCP observation not supported')
    }
  }

  private observeFID() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        this.metrics.fid = entry.processingStart - entry.startTime
        this.reportMetric('FID', entry.processingStart - entry.startTime)
      })
    })

    try {
      observer.observe({ entryTypes: ['first-input'] })
    } catch (e) {
      console.warn('FID observation not supported')
    }
  }

  private observeCLS() {
    let clsValue = 0
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      this.metrics.cls = clsValue
      this.reportMetric('CLS', clsValue)
    })

    try {
      observer.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      console.warn('CLS observation not supported')
    }
  }

  private observeFCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime
          this.reportMetric('FCP', entry.startTime)
        }
      })
    })

    try {
      observer.observe({ entryTypes: ['paint'] })
    } catch (e) {
      console.warn('FCP observation not supported')
    }
  }

  private observeTTFB() {
    const navigation = performance.getEntriesByType('navigation')[0] as any
    if (navigation) {
      this.metrics.ttfb = navigation.responseStart - navigation.requestStart
      this.reportMetric('TTFB', this.metrics.ttfb)
    }
  }

  private reportMetric(name: string, value: number) {
    // Reportar métricas (console para desenvolvimento, analytics para produção)
    if (process.env.NODE_ENV === 'development') {
      const status = this.getMetricStatus(name, value)
      console.log(`🏁 ${name}: ${value.toFixed(2)}ms - ${status}`)
    }
    
    // Em produção, enviar para analytics
    // this.sendToAnalytics(name, value)
  }

  private getMetricStatus(name: string, value: number): string {
    const thresholds = {
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 600, poor: 1500 }
    }

    const threshold = thresholds[name as keyof typeof thresholds]
    if (!threshold) return 'Unknown'

    if (value <= threshold.good) return '✅ Good'
    if (value <= threshold.poor) return '⚠️ Needs Improvement'
    return '❌ Poor'
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics }
  }

  // Hook para React component
  usePerformanceMetrics() {
    return this.metrics
  }
}

export const performanceMonitor = new PerformanceMonitor()

// Hook para usar no React
export function usePerformance() {
  return performanceMonitor.getMetrics()
}
```

## Otimização de Bundle

```typescript
// vite.config.ts (configuração atualizada)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        runtimeCaching: [
          // Cache de imagens
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp|avif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
              }
            }
          },
          // Cache de fontes
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    // Code splitting por chunk
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'map-vendor': ['leaflet', 'react-leaflet'],
          
          // Feature chunks
          'dashboard': ['./src/components/Widgets/Dashboard'],
          'analytics': ['./src/components/Widgets/Analytics'],
          'maps': ['./src/components/Widgets/HeatMap'],
        }
      }
    },
    // Otimizações
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // Otimizações de desenvolvimento
  server: {
    hmr: {
      overlay: false
    }
  }
})
```

## CSS para Loading States

```css
/* Skeleton Loading Styles */
.widget-skeleton {
  padding: 24px;
  background: var(--surface);
  border-radius: 12px;
  border: 1px solid var(--border);
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.skeleton-title {
  width: 200px;
  height: 28px;
  background: linear-gradient(90deg, var(--border) 25%, var(--border-light) 50%, var(--border) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-actions {
  width: 80px;
  height: 32px;
  background: linear-gradient(90deg, var(--border) 25%, var(--border-light) 50%, var(--border) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.skeleton-card {
  height: 120px;
  background: linear-gradient(90deg, var(--border) 25%, var(--border-light) 50%, var(--border) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

.skeleton-chart {
  grid-column: 1 / -1;
  height: 300px;
  background: linear-gradient(90deg, var(--border) 25%, var(--border-light) 50%, var(--border) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Optimized Image Styles */
.optimized-image-container {
  position: relative;
  overflow: hidden;
}

.optimized-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.optimized-image.loaded {
  opacity: 1;
}

.optimized-image.error {
  opacity: 0.5;
  filter: grayscale(100%);
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.image-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--team-primary, #1E41FF);
  border-radius: 50%;
  animation: spinner 0.8s linear infinite;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

/* Performance optimizations */
.widget-container {
  contain: layout style paint;
  will-change: contents;
}

.focusable:focus-visible {
  transform: translateZ(0); /* Force hardware acceleration */
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .optimized-image,
  .loading-spinner,
  .skeleton-title,
  .skeleton-actions,
  .skeleton-card,
  .skeleton-chart {
    animation: none;
    transition: none;
  }
}
```

## Image Optimization Script

```bash
#!/bin/bash
# optimize-images.sh

echo "🖼️ Otimizando imagens para DriverPro F1..."

# Criar diretórios de saída
mkdir -p assets/images/optimized/{webp,avif}

# Converter para WebP (quality 80)
for img in assets/images/teams/*.{jpg,jpeg,png}; do
  if [ -f "$img" ]; then
    filename=$(basename "$img" | cut -d. -f1)
    cwebp -q 80 "$img" -o "assets/images/optimized/webp/${filename}.webp"
    echo "✅ Convertido $img para WebP"
  fi
done

# Converter para AVIF (quality 50, mais comprimido)
for img in assets/images/teams/*.{jpg,jpeg,png}; do
  if [ -f "$img" ]; then
    filename=$(basename "$img" | cut -d. -f1)
    # Usar ffmpeg para AVIF se disponível
    if command -v ffmpeg &> /dev/null; then
      ffmpeg -i "$img" -c:v libaom-av1 -crf 30 "assets/images/optimized/avif/${filename}.avif" -y
      echo "✅ Convertido $img para AVIF"
    fi
  fi
done

echo "🏁 Otimização de imagens concluída!"
```