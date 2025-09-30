# 4. Widgets: HeatMap, Tráfego e Gráficos

## HeatMap com React-Leaflet

### Componente Principal

```tsx
// components/Widgets/HeatMap/HeatMap.tsx
import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { LatLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix para ícones do Leaflet
import L from 'leaflet'
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

interface HeatMapPoint {
  id: string
  lat: number
  lng: number
  demand: 'low' | 'medium' | 'high'
  earnings: number
  rides: number
  zone: string
}

const LISBOA_CENTER: [number, number] = [38.7223, -9.1393]

const MOCK_DATA: HeatMapPoint[] = [
  { id: '1', lat: 38.7223, lng: -9.1393, demand: 'high', earnings: 85, rides: 15, zone: 'Centro' },
  { id: '2', lat: 38.6979, lng: -9.2076, demand: 'medium', earnings: 65, rides: 10, zone: 'Belém' },
  { id: '3', lat: 38.7635, lng: -9.0982, demand: 'high', earnings: 80, rides: 12, zone: 'Parque das Nações' },
  { id: '4', lat: 38.6966, lng: -9.4252, demand: 'medium', earnings: 70, rides: 8, zone: 'Cascais' },
  { id: '5', lat: 38.7977, lng: -9.3687, demand: 'low', earnings: 55, rides: 6, zone: 'Sintra' },
  { id: '6', lat: 38.6794, lng: -9.1554, demand: 'medium', earnings: 60, rides: 9, zone: 'Almada' }
]

const getDemandColor = (demand: string) => {
  switch (demand) {
    case 'high': return '#DC143C'
    case 'medium': return '#FF8C00'
    case 'low': return '#228B22'
    default: return '#666666'
  }
}

export function HeatMap() {
  const [data, setData] = useState<HeatMapPoint[]>(MOCK_DATA)
  const [opacity, setOpacity] = useState(0.8)
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const refreshData = async () => {
    setLoading(true)
    
    // Simular API call
    setTimeout(() => {
      // Randomizar um pouco os dados para simular mudanças
      const updatedData = MOCK_DATA.map(point => ({
        ...point,
        earnings: point.earnings + (Math.random() - 0.5) * 10,
        rides: point.rides + Math.floor((Math.random() - 0.5) * 4)
      }))
      
      setData(updatedData)
      setLastUpdate(new Date())
      setLoading(false)
    }, 1000)
  }

  const recenterMap = () => {
    // Implementado via ref para o mapa
    window.dispatchEvent(new CustomEvent('recenterMap'))
  }

  return (
    <div className="heatmap-widget" role="region" aria-label="Mapa de calor de demanda">
      {/* Controles */}
      <div className="heatmap-controls">
        <div className="controls-row">
          <div className="opacity-control">
            <label htmlFor="opacity-slider" className="control-label">
              Transparência: {Math.round(opacity * 100)}%
            </label>
            <input
              id="opacity-slider"
              type="range"
              min="0.2"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="opacity-slider focusable"
              aria-describedby="opacity-desc"
            />
            <div id="opacity-desc" className="sr-only">
              Ajustar transparência dos marcadores de demanda
            </div>
          </div>

          <div className="map-actions">
            <button
              className="btn btn-secondary focusable"
              onClick={recenterMap}
              aria-label="Recentrar mapa em Lisboa"
            >
              📍 Recentrar Lisboa
            </button>
            
            <button
              className="btn btn-primary focusable"
              onClick={refreshData}
              disabled={loading}
              aria-label={loading ? "Atualizando dados..." : "Atualizar dados"}
            >
              {loading ? '🔄' : '🔄'} Refresh
            </button>
          </div>
        </div>

        <div className="last-update">
          <span aria-live="polite">
            Última atualização: {lastUpdate.toLocaleTimeString('pt-PT')}
          </span>
        </div>
      </div>

      {/* Legenda */}
      <div className="heatmap-legend" role="img" aria-label="Legenda do mapa">
        <h4>Níveis de Demanda</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#DC143C' }}></span>
            <span>Alta (12+ viagens/hora)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#FF8C00' }}></span>
            <span>Média (6-12 viagens/hora)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#228B22' }}></span>
            <span>Baixa (< 6 viagens/hora)</span>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="map-container">
        <MapContainer
          center={LISBOA_CENTER}
          zoom={11}
          className="heatmap"
          aria-label="Mapa interativo de Lisboa com pontos de demanda"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          <RecenterMapHandler />
          
          {data.map(point => (
            <Marker
              key={point.id}
              position={[point.lat, point.lng]}
              opacity={opacity}
            >
              <Popup>
                <div className="marker-popup">
                  <h5>{point.zone}</h5>
                  <div className="popup-stats">
                    <div className="stat">
                      <strong>Ganhos:</strong> €{point.earnings.toFixed(0)}/dia
                    </div>
                    <div className="stat">
                      <strong>Viagens:</strong> {point.rides}/dia
                    </div>
                    <div className="stat">
                      <strong>Demanda:</strong> 
                      <span className={`demand-badge demand-${point.demand}`}>
                        {point.demand === 'high' ? 'Alta' : 
                         point.demand === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}

// Componente para recentrar mapa
function RecenterMapHandler() {
  const map = useMap()

  useEffect(() => {
    const handleRecenter = () => {
      map.setView(LISBOA_CENTER, 11)
    }

    window.addEventListener('recenterMap', handleRecenter)
    return () => window.removeEventListener('recenterMap', handleRecenter)
  }, [map])

  return null
}
```

## Widget de Tráfego

```tsx
// components/Widgets/Traffic/TrafficWidget.tsx
import React, { useState, useEffect } from 'react'

interface TrafficZone {
  id: string
  name: string
  status: 'fluent' | 'moderate' | 'dense'
  avgSpeed: number
  incidents: number
  prediction30min: 'improving' | 'stable' | 'worsening'
  lastUpdate: Date
}

const TRAFFIC_ZONES: TrafficZone[] = [
  {
    id: 'centro',
    name: 'Centro Histórico',
    status: 'dense',
    avgSpeed: 15,
    incidents: 3,
    prediction30min: 'stable',
    lastUpdate: new Date()
  },
  {
    id: 'belem',
    name: 'Belém',
    status: 'moderate', 
    avgSpeed: 25,
    incidents: 1,
    prediction30min: 'improving',
    lastUpdate: new Date()
  },
  {
    id: 'pn',
    name: 'Parque das Nações',
    status: 'fluent',
    avgSpeed: 35,
    incidents: 0,
    prediction30min: 'stable',
    lastUpdate: new Date()
  },
  {
    id: 'cascais',
    name: 'Cascais',
    status: 'moderate',
    avgSpeed: 30,
    incidents: 2,
    prediction30min: 'worsening',
    lastUpdate: new Date()
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'fluent': return '#059669'
    case 'moderate': return '#D97706'
    case 'dense': return '#DC2626'
    default: return '#6B7280'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'fluent': return 'Fluido'
    case 'moderate': return 'Moderado'
    case 'dense': return 'Denso'
    default: return 'Desconhecido'
  }
}

const getPredictionIcon = (prediction: string) => {
  switch (prediction) {
    case 'improving': return '📈'
    case 'stable': return '➡️'
    case 'worsening': return '📉'
    default: return '❓'
  }
}

const getPredictionText = (prediction: string) => {
  switch (prediction) {
    case 'improving': return 'Melhorando'
    case 'stable': return 'Estável'
    case 'worsening': return 'Piorando'
    default: return 'Incerto'
  }
}

export function TrafficWidget() {
  const [zones, setZones] = useState<TrafficZone[]>(TRAFFIC_ZONES)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Auto-refresh a cada 2 minutos
    const interval = setInterval(() => {
      updateTrafficData()
    }, 120000)

    return () => clearInterval(interval)
  }, [])

  const updateTrafficData = async () => {
    setLoading(true)

    // Simular API call
    setTimeout(() => {
      const updatedZones = zones.map(zone => ({
        ...zone,
        avgSpeed: zone.avgSpeed + (Math.random() - 0.5) * 10,
        incidents: Math.max(0, zone.incidents + Math.floor((Math.random() - 0.5) * 2)),
        lastUpdate: new Date()
      }))

      setZones(updatedZones)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="traffic-widget" role="region" aria-label="Estado do tráfego em Lisboa">
      <div className="widget-header">
        <h2>Tráfego em Tempo Real</h2>
        <button
          className="btn btn-sm btn-secondary focusable"
          onClick={updateTrafficData}
          disabled={loading}
          aria-label={loading ? "Atualizando tráfego..." : "Atualizar dados de tráfego"}
        >
          {loading ? '🔄' : '🔄'}
        </button>
      </div>

      <div className="traffic-zones" role="list">
        {zones.map(zone => (
          <TrafficCard key={zone.id} zone={zone} />
        ))}
      </div>

      {/* Explicação dos estados */}
      <div className="traffic-legend">
        <h4>Estados de Tráfego</h4>
        <div className="legend-explanations">
          <div className="explanation">
            <span className="status-badge" style={{ backgroundColor: '#059669' }}>Fluido</span>
            <span>Velocidade média > 30 km/h, poucos obstáculos</span>
          </div>
          <div className="explanation">
            <span className="status-badge" style={{ backgroundColor: '#D97706' }}>Moderado</span>
            <span>Velocidade média 20-30 km/h, tráfego regular</span>
          </div>
          <div className="explanation">
            <span className="status-badge" style={{ backgroundColor: '#DC2626' }}>Denso</span>
            <span>Velocidade média < 20 km/h, congestionamento</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente individual de zona
function TrafficCard({ zone }: { zone: TrafficZone }) {
  return (
    <div 
      className="traffic-card focusable"
      role="listitem"
      tabIndex={0}
      aria-labelledby={`traffic-${zone.id}-title`}
      aria-describedby={`traffic-${zone.id}-details`}
    >
      <div className="card-header">
        <h3 id={`traffic-${zone.id}-title`}>{zone.name}</h3>
        <span 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(zone.status) }}
          aria-label={`Estado: ${getStatusText(zone.status)}`}
        >
          {getStatusText(zone.status)}
        </span>
      </div>

      <div id={`traffic-${zone.id}-details`} className="card-content">
        <div className="traffic-stats">
          <div className="stat">
            <span className="stat-label">Velocidade Média</span>
            <span className="stat-value">{Math.round(zone.avgSpeed)} km/h</span>
          </div>
          
          <div className="stat">
            <span className="stat-label">Incidentes</span>
            <span className="stat-value">{zone.incidents}</span>
          </div>
        </div>

        <div className="prediction">
          <span className="prediction-label">Previsão 30min:</span>
          <span 
            className="prediction-value"
            aria-label={`Previsão: ${getPredictionText(zone.prediction30min)}`}
          >
            {getPredictionIcon(zone.prediction30min)} {getPredictionText(zone.prediction30min)}
          </span>
        </div>

        <div className="last-update">
          <small aria-live="polite">
            Atualizado: {zone.lastUpdate.toLocaleTimeString('pt-PT')}
          </small>
        </div>
      </div>
    </div>
  )
}
```

## Gráfico de Linha com Chart.js

```tsx
// components/Widgets/Analytics/LineChart.tsx
import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface LineChartProps {
  title: string
  data: number[]
  labels: string[]
  color?: string
  gradient?: boolean
}

export function LineChart({ title, data, labels, color = '#1E41FF', gradient = true }: LineChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderColor: color,
        backgroundColor: gradient 
          ? (ctx: any) => {
              const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400)
              gradient.addColorStop(0, `${color}40`)
              gradient.addColorStop(1, `${color}00`)
              return gradient
            }
          : `${color}20`,
        borderWidth: 3,
        fill: gradient,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // Removemos para usar descrição textual
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const
        },
        color: 'var(--text-primary)'
      },
      tooltip: {
        backgroundColor: 'var(--surface)',
        titleColor: 'var(--text-primary)',
        bodyColor: 'var(--text-secondary)',
        borderColor: 'var(--border)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: any) => `${context[0].label}`,
          label: (context: any) => `${title}: €${context.parsed.y.toFixed(2)}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'var(--text-secondary)'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'var(--border-light)'
        },
        ticks: {
          color: 'var(--text-secondary)',
          callback: (value: any) => `€${value}`
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  }

  // Calcular estatísticas para descrição textual
  const max = Math.max(...data)
  const min = Math.min(...data)
  const avg = data.reduce((a, b) => a + b, 0) / data.length
  const trend = data[data.length - 1] > data[0] ? 'crescente' : 'decrescente'

  return (
    <div className="line-chart-container">
      <div className="chart-wrapper" role="img" aria-labelledby={`chart-${title.toLowerCase().replace(' ', '-')}-title`}>
        <Line data={chartData} options={options} />
      </div>
      
      {/* Descrição textual para acessibilidade */}
      <div 
        id={`chart-${title.toLowerCase().replace(' ', '-')}-title`}
        className="chart-description sr-only"
      >
        Gráfico de linha mostrando {title.toLowerCase()} ao longo do tempo. 
        Valor máximo: €{max.toFixed(2)}, 
        valor mínimo: €{min.toFixed(2)}, 
        média: €{avg.toFixed(2)}. 
        Tendência {trend}.
      </div>

      {/* Estatísticas visuais */}
      <div className="chart-stats" aria-hidden="true">
        <div className="stat">
          <span className="stat-label">Máximo</span>
          <span className="stat-value">€{max.toFixed(0)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Mínimo</span>
          <span className="stat-value">€{min.toFixed(0)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Média</span>
          <span className="stat-value">€{avg.toFixed(0)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Tendência</span>
          <span className={`stat-value trend-${trend}`}>
            {trend === 'crescente' ? '📈' : '📉'} {trend}
          </span>
        </div>
      </div>
    </div>
  )
}
```

## CSS para os Widgets

```css
/* HeatMap Styles */
.heatmap-widget {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.heatmap-controls {
  background: var(--surface);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.opacity-control {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
}

.opacity-slider {
  width: 100%;
  accent-color: var(--team-primary, #1E41FF);
}

.map-actions {
  display: flex;
  gap: 8px;
}

.heatmap-legend {
  background: var(--surface);
  padding: 12px;
  border-radius: 6px;
  border: 1px solid var(--border);
}

.legend-items {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.map-container {
  flex: 1;
  min-height: 400px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.heatmap {
  width: 100%;
  height: 100%;
}

/* Traffic Widget Styles */
.traffic-widget {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.traffic-zones {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.traffic-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s ease;
}

.traffic-card:hover,
.traffic-card:focus-within {
  border-color: var(--team-primary, #1E41FF);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
}

.traffic-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.prediction {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

/* Line Chart Styles */
.line-chart-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-wrapper {
  height: 300px;
  position: relative;
}

.chart-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  background: var(--surface);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.chart-stats .stat {
  text-align: center;
}

.trend-crescente {
  color: var(--success-color, #059669);
}

.trend-decrescente {
  color: var(--error-color, #DC2626);
}

/* Responsive */
@media (max-width: 768px) {
  .controls-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .legend-items {
    flex-direction: column;
    gap: 8px;
  }
  
  .traffic-zones {
    grid-template-columns: 1fr;
  }
  
  .chart-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
```