# DriverPro Analytics – F1 Edition Plus

> Aplicação PWA premium para análise de performance de condução com tema Formula 1, desenvolvida com React 18, TypeScript e tecnologias modernas.

## 🏁 Características Principais

- ✅ **PWA Completo** - Instalável, funciona offline, notificações push
- ✅ **React 18 + TypeScript** - Stack moderno e type-safe
- ✅ **Mobile-First Responsive** - Design otimizado para todos os dispositivos
- ✅ **Acessibilidade WCAG 2.1 AA** - Contraste mínimo 4.5:1, navegação por teclado
- ✅ **6 Temas F1 Autênticos** - Ferrari, Red Bull, Mercedes, McLaren, Alpine, Aston Martin
- ✅ **IA Sophia Simulada** - Assistente virtual contextual por equipa
- ✅ **Modo Dia/Noite** - Persistente com detecção automática do sistema
- ✅ **Performance Otimizada** - Lazy loading, code splitting, imagens WebP/AVIF

## 🚀 Instalação Rápida

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/driverpro-f1-plus.git
cd driverpro-f1-plus

# Instalar dependências
npm install

# Configurar assets (opcional)
npm run setup:assets

# Iniciar desenvolvimento
npm run dev
```

## 📦 Stack Tecnológica

### Core
- **React 18** - Biblioteca UI moderna
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultra-rápido
- **React Router** - Navegação SPA

### UI & Design
- **CSS Custom Properties** - Sistema de design tokens
- **Grid/Flexbox** - Layout responsivo
- **Animations 60fps** - Transições suaves
- **Dark/Light Themes** - Modos persistentes

### PWA & Performance
- **Vite PWA Plugin** - Service worker automático
- **IndexedDB** - Storage offline
- **Web Vitals** - Métricas de performance
- **React.lazy** - Code splitting

### Data & Charts
- **Chart.js + react-chartjs-2** - Gráficos interativos
- **React Leaflet** - Mapas de Lisboa
- **Context API** - Gestão de estado
- **LocalStorage** - Persistência de configurações

### Testing & Quality
- **Jest + RTL** - Testes unitários
- **Cypress** - Testes E2E
- **axe-core** - Auditoria de acessibilidade
- **ESLint + Prettier** - Code quality

## 🎯 Funcionalidades

### 1. Dashboard
- 6 KPIs principais com micro-tendências
- Tooltips explicativos
- Estados de loading skeleton
- Acessibilidade completa

### 2. Analytics
- Gráficos Chart.js responsivos
- Legendas clicáveis
- Descrições textuais para screen readers
- Export preparado (PDF/CSV)

### 3. HeatMap
- Mapa de Lisboa com React-Leaflet
- Marcadores de demanda em tempo real
- Slider de transparência
- Auto-refresh 30s

### 4. Tráfego
- Estados por zona (Fluido/Moderado/Denso)
- Previsões 30min
- Badges coloridos
- Explicação textual dos estados

### 5. Business Plan
- Calculadora financeira avançada
- Inputs acessíveis com máscaras
- Fórmula sempre visível
- Projeções detalhadas

### 6. Conta & Configurações
- Seleção de equipa F1 com preview
- Idioma: PT-PT/EN/ES
- Moeda: EUR/USD/GBP
- Gestão de PWA e cache

## 🎨 Temas F1

Cada equipa oferece experiência única:

| Equipa | Cores Primárias | Personalidade Sophia |
|--------|----------------|---------------------|
| **Ferrari** | Vermelho + Preto | Entusiástica: "Ciao! Forza Ferrari! 🏎️" |
| **Red Bull** | Azul + Vermelho | Energética: "Ready to fly? 💨" |
| **Mercedes** | Prata + Preto | Profissional: "Precisão e performance ⚡" |
| **McLaren** | Laranja + Azul | Inovadora: "Papaya power! 🧡" |
| **Alpine** | Azul + Rosa | Elegante: "Bonjour! Esprit Alpine 💙" |
| **Aston Martin** | Verde + Rosa | Sofisticada: "Excellence in motion 💚" |

## 🛠️ Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor desenvolvimento (http://localhost:5173)
npm run dev:host         # Servidor com acesso rede local

# Build & Deploy
npm run build           # Build produção
npm run preview         # Preview build local
npm run deploy:netlify  # Deploy Netlify
npm run deploy:vercel   # Deploy Vercel

# Testes
npm run test            # Testes unitários
npm run test:watch      # Testes modo watch
npm run test:coverage   # Relatório cobertura
npm run test:a11y       # Testes acessibilidade
npm run cypress:open    # Cypress interface
npm run cypress:run     # Cypress headless
npm run test:e2e        # E2E completo
npm run test:all        # Todos os testes

# Assets & Qualidade
npm run setup:assets    # Download e otimização assets
npm run optimize:images # Converter WebP/AVIF
npm run lint           # ESLint
npm run lint:fix       # ESLint + fix
npm run format         # Prettier
npm run type-check     # TypeScript check

# PWA & Análise
npm run analyze        # Bundle analyzer
npm run lighthouse     # Auditoria Lighthouse
npm run pwa:debug      # Debug service worker
```

## 📱 PWA Instalação

### Automática
1. Visita a aplicação
2. Clica no prompt "Instalar DriverPro F1"
3. Confirma instalação

### Manual (Chrome)
1. Menu → Mais ferramentas → Instalar DriverPro F1
2. Ícone aparece na área de trabalho
3. Funciona offline

### Manual (Safari iOS)
1. Botão partilha
2. "Adicionar ao ecrã principal"
3. Confirma adição

## 🎛️ Configuração

### Variáveis de Ambiente

```bash
# .env.local
VITE_APP_TITLE="DriverPro Analytics F1+"
VITE_API_BASE_URL="https://api.driverpro.com"
VITE_MAPBOX_TOKEN="your_mapbox_token"
VITE_ANALYTICS_ID="your_analytics_id"
VITE_APP_VERSION="1.0.0"
```

### Personalização de Temas

```css
/* src/styles/themes.css */
:root {
  /* Sobrescrever cores da equipa */
  --ferrari-primary: #DC143C;
  --ferrari-secondary: #000000;
  
  /* Personalizar componentes */
  --border-radius: 8px;
  --shadow-intensity: 0.1;
  --animation-duration: 0.3s;
}
```

### Dados Mock Personalizar

```typescript
// src/data/mockData.ts
export const LISBOA_ZONES = [
  {
    id: 'centro',
    name: 'Centro Histórico', 
    avgEarnings: 75,
    // ... seus dados
  }
]
```

## 🚀 Deploy

### Netlify (Recomendado)

```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables
VITE_APP_TITLE=DriverPro Analytics F1+
```

### Vercel

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

### Servidor Próprio

```bash
# Build para produção
npm run build

# Upload pasta dist/ para servidor
# Configurar headers para PWA:
# Service-Worker-Allowed: /
# Cache-Control para assets
```

## 🔧 Troubleshooting

### PWA Não Instala
```bash
# Verificar HTTPS
echo "PWA requer HTTPS em produção"

# Verificar manifest
curl https://seu-site.com/manifest.json

# Debug service worker
# DevTools → Application → Service Workers
```

### Performance Lenta
```bash
# Verificar bundle size
npm run analyze

# Otimizar imagens
npm run optimize:images

# Limpar cache
# DevTools → Application → Storage → Clear storage
```

### Temas Não Aplicam
```javascript
// Verificar localStorage
console.log(localStorage.getItem('theme-mode'))
console.log(localStorage.getItem('userConfig'))

// Reset configurações
localStorage.clear()
location.reload()
```

### Mapa Não Carrega
```bash
# Verificar token Mapbox
echo $VITE_MAPBOX_TOKEN

# Verificar network
# DevTools → Network → filtrar "tile"
```

### Testes Falham
```bash
# Limpar cache Jest
npm run test -- --clearCache

# Atualizar snapshots
npm run test -- --updateSnapshot

# Debug específico
npm run test -- --testNamePattern="Dashboard"
```

## 📊 Métricas de Performance

### Web Vitals Target
- **FCP** < 1.8s ✅
- **LCP** < 2.5s ✅
- **FID** < 100ms ✅
- **CLS** < 0.1 ✅
- **TTI** < 3.5s ✅

### Bundle Size
- **Initial** < 150KB ✅
- **Gzip** < 50KB ✅
- **Each widget** < 25KB ✅

### Accessibility Score
- **WCAG 2.1 AA** 100% ✅
- **Contrast** 4.5:1+ ✅
- **Keyboard** Navegação completa ✅

## 🤝 Contribuir

1. Fork do repositório
2. Criar branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Pull Request

### Convenções

- **Commits**: [Conventional Commits](https://conventionalcommits.org/)
- **Código**: ESLint + Prettier automático
- **Testes**: Cobertura mínima 80%
- **Acessibilidade**: Sem violações axe-core

## 📄 Licença

MIT License - ver [LICENSE](LICENSE) para detalhes.

## 🏆 Credits

- **Imagens F1**: Copyright-free de Unsplash/Pexels
- **Ícones**: Heroicons + Font Awesome
- **Fontes**: Inter (Google Fonts)
- **Mapas**: OpenStreetMap
- **Dados**: Mock baseados em Lisboa real

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/driverpro-f1-plus/issues)
- **Discord**: [DriverPro Community](https://discord.gg/driverpro)
- **Email**: suporte@driverpro.com
- **Docs**: [docs.driverpro.com](https://docs.driverpro.com)

---

<div align="center">
  <p><strong>🏁 Desenvolvido com ❤️ para a comunidade TVDE portuguesa</strong></p>
  <p>
    <a href="https://driverpro-f1.netlify.app">Demo Live</a> •
    <a href="#instalação-rápida">Instalação</a> •
    <a href="#funcionalidades">Features</a> •
    <a href="#deploy">Deploy</a>
  </p>
</div>