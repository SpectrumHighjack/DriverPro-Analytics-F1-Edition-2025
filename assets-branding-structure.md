# 2. Assets Organizados & Branding

## Estrutura de Assets

```
/assets
├── /images
│   ├── /teams
│   │   ├── ferrari-bg.webp
│   │   ├── redbull-bg.webp
│   │   ├── mercedes-bg.webp
│   │   ├── mclaren-bg.webp
│   │   ├── alpine-bg.webp
│   │   └── astonmartin-bg.webp
│   ├── /helmets
│   │   ├── ferrari-helmet.svg
│   │   ├── redbull-helmet.svg
│   │   ├── mercedes-helmet.svg
│   │   ├── mclaren-helmet.svg
│   │   ├── alpine-helmet.svg
│   │   └── astonmartin-helmet.svg
│   ├── /logos
│   │   ├── driverpro-logo.svg
│   │   ├── driverpro-logo-dark.svg
│   │   ├── driverpro-icon.svg
│   │   └── driverpro-wordmark.svg
│   └── /placeholders
│       ├── loading-skeleton.svg
│       ├── empty-state-map.svg
│       └── no-data-chart.svg
├── /icons
│   ├── /pwa
│   │   ├── icon-192x192.png
│   │   ├── icon-512x512.png
│   │   └── apple-touch-icon.png
│   └── /widgets
│       ├── dashboard-icon.svg
│       ├── analytics-icon.svg
│       ├── heatmap-icon.svg
│       ├── traffic-icon.svg
│       ├── business-icon.svg
│       └── account-icon.svg
└── /fonts
    ├── F1-Display-Regular.woff2
    └── F1-Display-Bold.woff2
```

## Logo SVG Adaptativo

```svg
<!-- driverpro-logo.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60">
  <defs>
    <style>
      .logo-text { fill: var(--logo-color, #1E41FF); }
      .logo-accent { fill: var(--accent-color, #DC143C); }
      .logo-lines { stroke: var(--accent-color, #DC143C); stroke-width: 2; fill: none; }
    </style>
  </defs>
  
  <!-- Bandeira Checkered Simplificada -->
  <g id="flag">
    <rect x="10" y="15" width="8" height="8" fill="var(--logo-color, #1E41FF)"/>
    <rect x="18" y="23" width="8" height="8" fill="var(--logo-color, #1E41FF)"/>
    <rect x="10" y="31" width="8" height="8" fill="var(--logo-color, #1E41FF)"/>
    <rect x="18" y="15" width="8" height="8" fill="white"/>
    <rect x="10" y="23" width="8" height="8" fill="white"/>
    <rect x="18" y="31" width="8" fill="white"/>
  </g>
  
  <!-- Linhas de Velocidade -->
  <g id="speed-lines">
    <path class="logo-lines" d="M30 20 Q45 18 60 20"/>
    <path class="logo-lines" d="M30 30 Q50 28 70 30"/>
    <path class="logo-lines" d="M30 40 Q45 42 60 40"/>
  </g>
  
  <!-- Texto -->
  <text x="80" y="25" class="logo-text" font-family="'F1-Display', sans-serif" font-size="14" font-weight="bold">DRIVERPRO</text>
  <text x="80" y="42" class="logo-accent" font-family="'F1-Display', sans-serif" font-size="10">F1 EDITION PLUS</text>
</svg>
```

## Logo Variante Dark Mode

```svg
<!-- driverpro-logo-dark.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60">
  <defs>
    <style>
      .logo-text-dark { fill: #ffffff; }
      .logo-accent-dark { fill: #DC143C; }
      .logo-lines-dark { stroke: #ffffff; stroke-width: 2; fill: none; }
    </style>
  </defs>
  
  <!-- Bandeira Checkered Invertida -->
  <g id="flag-dark">
    <rect x="10" y="15" width="8" height="8" fill="#ffffff"/>
    <rect x="18" y="23" width="8" height="8" fill="#ffffff"/>
    <rect x="10" y="31" width="8" height="8" fill="#ffffff"/>
    <rect x="18" y="15" width="8" height="8" fill="#333333"/>
    <rect x="10" y="23" width="8" height="8" fill="#333333"/>
    <rect x="18" y="31" width="8" fill="#333333"/>
  </g>
  
  <!-- Linhas de Velocidade Brancas -->
  <g id="speed-lines-dark">
    <path class="logo-lines-dark" d="M30 20 Q45 18 60 20"/>
    <path class="logo-lines-dark" d="M30 30 Q50 28 70 30"/>
    <path class="logo-lines-dark" d="M30 40 Q45 42 60 40"/>
  </g>
  
  <!-- Texto Branco -->
  <text x="80" y="25" class="logo-text-dark" font-family="'F1-Display', sans-serif" font-size="14" font-weight="bold">DRIVERPRO</text>
  <text x="80" y="42" class="logo-accent-dark" font-family="'F1-Display', sans-serif" font-size="10">F1 EDITION PLUS</text>
</svg>
```

## Prompts para Geração de Assets

### Backgrounds F1 (Midjourney/DALL-E)

```
Ferrari Background:
"Professional Formula 1 racing car in Ferrari red color, dynamic motion blur, sleek aerodynamic design, modern F1 cockpit, racing circuit background, high contrast lighting, cinematic composition, no visible logos or copyrighted elements, photorealistic style, 1920x1080 resolution"

Red Bull Background:
"Blue and silver Formula 1 racing car with dynamic speed lines, aerodynamic wings, modern cockpit design, racing track environment, professional motorsport photography style, high contrast blue and white lighting, no copyrighted logos, clean composition, 1920x1080"

Mercedes Background:  
"Silver metallic Formula 1 car with sleek aerodynamic design, modern racing cockpit, professional track environment, high-tech carbon fiber details, dynamic motion blur, silver and black color scheme, no visible trademarks, photorealistic racing photography, 1920x1080"

McLaren Background:
"Orange Formula 1 racing car with blue accents, aerodynamic body design, modern cockpit, racing circuit background, dynamic speed motion, professional motorsport photography, bright orange and blue color palette, no copyrighted elements, 1920x1080 resolution"

Alpine Background:
"Blue Formula 1 car with pink accents, sleek aerodynamic design, modern racing cockpit, professional track environment, French racing heritage inspired, blue and pink color scheme, dynamic composition, no visible logos, photorealistic style, 1920x1080"

Aston Martin Background:
"Green Formula 1 racing car with sophisticated design, aerodynamic body, modern cockpit, luxury motorsport aesthetic, racing circuit background, green and silver color palette, professional racing photography, no copyrighted trademarks, 1920x1080 resolution"
```

### Capacetes F1 (Vector/SVG)

```
Ferrari Helmet:
"Minimalist racing helmet icon in red and white, side view profile, modern F1 style visor, sleek aerodynamic design, vector illustration style, simple geometric shapes, no copyrighted logos, suitable for avatar use, SVG format"

Red Bull Helmet:
"Racing helmet icon in blue and red colors, side profile view, modern aerodynamic design, F1 style visor, vector illustration, clean geometric shapes, professional motorsport aesthetic, no trademarks, avatar suitable, SVG format"

Mercedes Helmet:
"Silver and black racing helmet icon, side view profile, modern F1 aerodynamic style, sleek visor design, vector illustration, minimalist geometric approach, professional racing aesthetic, no copyrighted elements, SVG suitable"

McLaren Helmet:
"Orange and blue racing helmet icon, side profile view, modern aerodynamic F1 design, vector illustration style, clean geometric shapes, vibrant color scheme, professional motorsport look, no logos, avatar ready, SVG format"

Alpine Helmet:
"Blue and pink racing helmet icon, side view profile, modern F1 aerodynamic style, sleek design, vector illustration, elegant color combination, minimalist geometric approach, no copyrighted elements, SVG format"

Aston Martin Helmet:
"Green racing helmet icon with sophisticated design, side profile view, modern F1 aerodynamic style, luxury aesthetic, vector illustration, clean geometric shapes, professional appearance, no trademarks, SVG suitable"
```

## Asset Manager Utility

```typescript
// utils/assetManager.ts
interface TeamAssets {
  background: string
  helmet: string
  colors: {
    primary: string
    secondary: string
  }
}

const TEAM_ASSETS: Record<string, TeamAssets> = {
  ferrari: {
    background: '/assets/images/teams/ferrari-bg.webp',
    helmet: '/assets/images/helmets/ferrari-helmet.svg',
    colors: { primary: '#DC143C', secondary: '#000000' }
  },
  redbull: {
    background: '/assets/images/teams/redbull-bg.webp', 
    helmet: '/assets/images/helmets/redbull-helmet.svg',
    colors: { primary: '#1E3A8A', secondary: '#DC143C' }
  },
  mercedes: {
    background: '/assets/images/teams/mercedes-bg.webp',
    helmet: '/assets/images/helmets/mercedes-helmet.svg', 
    colors: { primary: '#C0C0C0', secondary: '#000000' }
  },
  mclaren: {
    background: '/assets/images/teams/mclaren-bg.webp',
    helmet: '/assets/images/helmets/mclaren-helmet.svg',
    colors: { primary: '#FF8C00', secondary: '#0080FF' }
  },
  alpine: {
    background: '/assets/images/teams/alpine-bg.webp',
    helmet: '/assets/images/helmets/alpine-helmet.svg',
    colors: { primary: '#0080FF', secondary: '#FF1493' }
  },
  astonmartin: {
    background: '/assets/images/teams/astonmartin-bg.webp',
    helmet: '/assets/images/helmets/astonmartin-helmet.svg',
    colors: { primary: '#228B22', secondary: '#FF1493' }
  }
}

export function getTeamAssets(teamId: string): TeamAssets {
  return TEAM_ASSETS[teamId] || TEAM_ASSETS.ferrari
}

export function applyTeamTheme(teamId: string) {
  const assets = getTeamAssets(teamId)
  const root = document.documentElement
  
  root.style.setProperty('--team-primary', assets.colors.primary)
  root.style.setProperty('--team-secondary', assets.colors.secondary)
  root.style.setProperty('--team-background', `url(${assets.background})`)
  
  // Atualizar meta theme-color
  const metaTheme = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement
  if (metaTheme) {
    metaTheme.content = assets.colors.primary
  }
}

export function preloadTeamAssets(teamId: string) {
  const assets = getTeamAssets(teamId)
  
  // Preload background image
  const bgLink = document.createElement('link')
  bgLink.rel = 'preload'
  bgLink.as = 'image'
  bgLink.href = assets.background
  document.head.appendChild(bgLink)
}
```

## Script de Setup Assets

```bash
#!/bin/bash
# setup-assets.sh

echo "🏁 DriverPro F1 - Setup de Assets"

# Criar estrutura de diretórios
mkdir -p assets/images/{teams,helmets,logos,placeholders}
mkdir -p assets/icons/{pwa,widgets}
mkdir -p assets/fonts

# Download de fontes F1 (placeholder URLs)
echo "📁 Baixando fontes..."
curl -o assets/fonts/F1-Display-Regular.woff2 "https://example.com/f1-font-regular.woff2"
curl -o assets/fonts/F1-Display-Bold.woff2 "https://example.com/f1-font-bold.woff2"

# Gerar ícones PWA placeholder
echo "🎨 Gerando ícones PWA..."
convert -size 192x192 xc:"#1E41FF" -fill white -gravity center -pointsize 48 -annotate +0+0 "F1" assets/icons/pwa/icon-192x192.png
convert -size 512x512 xc:"#1E41FF" -fill white -gravity center -pointsize 128 -annotate +0+0 "F1" assets/icons/pwa/icon-512x512.png

echo "✅ Setup de assets concluído!"
```