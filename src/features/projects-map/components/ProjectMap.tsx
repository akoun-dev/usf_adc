import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import type { Project } from '../types';
import { PROJECT_STATUS_COLORS } from '../types';
import { useTranslation } from 'react-i18next';

// Project themes with icons and colors
const PROJECT_THEMES = {
  connectivity: { icon: '📡', color: '#3b82f6' },
  health: { icon: '🏥', color: '#ef4444' },
  education: { icon: '🎓', color: '#f59e0b' },
  energy: { icon: '⚡', color: '#10b981' },
  agriculture: { icon: '🌾', color: '#84cc16' },
  default: { icon: '📍', color: '#6366f1' },
};

// Detect project theme from title/description
function detectProjectTheme(project: Project): keyof typeof PROJECT_THEMES {
  const text = `${project.title} ${project.description || ''}`.toLowerCase();

  if (text.match(/santé|health|médical|hôpital|clinique|soins/)) return 'health';
  if (text.match(/éducation|education|école|écol|school|université|formation|teacher/)) return 'education';
  if (text.match(/énergie|energy|solaire|electric|électr|power/)) return 'energy';
  if (text.match(/agricultur|pêche|ferm|rural|crop|livestock/)) return 'agriculture';
  return 'connectivity';
}

function createPopupContent(project: Project, t: (key: string) => string): string {
  const statusLabels: Record<string, string> = {
    planned: t('public.map.status.planned'),
    in_progress: t('public.map.status.in_progress'),
    completed: t('public.map.status.completed'),
    suspended: t('public.map.status.suspended'),
  };
  const budget = project.budget
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(project.budget)
    : '—';

  const theme = detectProjectTheme(project);
  const themeInfo = PROJECT_THEMES[theme];

  return `
    <div style="min-width:280px;font-family:system-ui,sans-serif">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span style="font-size:24px;">${themeInfo.icon}</span>
        <div style="flex:1;">
          <h3 style="margin:0;font-size:15px;font-weight:700;color:#1a1a1a;line-height:1.3;">${project.title}</h3>
          <p style="margin:2px 0 0;font-size:12px;color:#666;">${project.countries?.name_fr || ''} ${project.region ? '· ' + project.region : ''}</p>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <span style="display:inline-block;padding:4px 10px;border-radius:9999px;font-size:11px;font-weight:600;color:white;background:${PROJECT_STATUS_COLORS[project.status]}">
          ${statusLabels[project.status] || project.status}
        </span>
        <span style="font-size:11px;color:#888;background:${themeInfo.color}20;padding:4px 8px;border-radius:4px;">${themeInfo.icon} ${theme === 'connectivity' ? t('public.map.themes.connectivity') : theme === 'health' ? t('public.map.themes.health') : theme === 'education' ? t('public.map.themes.education') : theme === 'energy' ? t('public.map.themes.energy') : theme === 'agriculture' ? t('public.map.themes.agriculture') : t('public.map.themes.project')}</span>
      </div>
      <div style="display:grid;grid-cols:2;gap:6px;padding:10px;background:#f8fafc;border-radius:6px;margin-bottom:10px;">
        <div>
          <div style="font-size:10px;color:#64748b;text-transform:uppercase;">${t('public.map.budget')}</div>
          <div style="font-size:13px;font-weight:600;color:#1e293b;">${budget}</div>
        </div>
        <div>
          <div style="font-size:10px;color:#64748b;text-transform:uppercase;">${t('public.map.status.label')}</div>
          <div style="font-size:13px;font-weight:600;color:#1e293b;">${statusLabels[project.status]}</div>
        </div>
      </div>
      ${project.description ? `<p style="margin:0 0 10px;font-size:12px;color:#64748b;line-height:1.5;">${project.description.slice(0, 100)}${project.description.length > 100 ? '…' : ''}</p>` : ''}
      <a
        href="/projets-pays/${project.country_id}#${project.id}"
        style="display:block;text-align:center;background:linear-gradient(135deg,#10b981 0%,#059669 100%);color:white;padding:10px 16px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;box-shadow:0 4px 12px rgba(16,185,129,0.3);transition:all 0.2s;"
        onmouseover="this.style.transform='translateY(-1px)'"
        onmouseout="this.style.transform='translateY(0)'"
      >
        ${t('public.map.viewProject')} →
      </a>
    </div>
  `;
}

function createThemedIcon(project: Project, mapMode: 'carte' | 'satellite' = 'carte') {
  const theme = detectProjectTheme(project);
  const themeInfo = PROJECT_THEMES[theme];
  const statusColor = PROJECT_STATUS_COLORS[project.status];

  // Enhanced contrast for satellite mode
  const isSatellite = mapMode === 'satellite';
  const borderWidth = isSatellite ? 4 : 3;
  const boxShadow = isSatellite
    ? '0 4px 16px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.8), 0 0 0 4px rgba(0,0,0,0.3)'
    : '0 3px 10px rgba(0,0,0,0.3)';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
      ">
        <div style="
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid ${statusColor};
          filter: ${isSatellite ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' : 'none'};
        "></div>
        <div style="
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 28px;
          height: 28px;
          background: ${statusColor};
          border: ${borderWidth}px solid white;
          border-radius: 50%;
          box-shadow: ${boxShadow};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        ">${themeInfo.icon}</div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

interface Props {
  projects: Project[];
  selectedProjectId?: string | null;
  onProjectClick?: (project: Project) => void;
  mapMode?: 'carte' | 'satellite';
}

export function ProjectMap({ projects, selectedProjectId, onProjectClick, mapMode = 'carte' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());
  const { t } = useTranslation();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current).setView([5, 20], 3);

    // Create tile layer based on map mode
    const tileUrl = mapMode === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution = mapMode === 'satellite'
      ? '&copy; <a href="https://www.esri.com/">Esri</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    tileLayerRef.current = L.tileLayer(tileUrl, { attribution }).addTo(mapRef.current);

    clusterRef.current = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
    });
    mapRef.current.addLayer(clusterRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      clusterRef.current = null;
      tileLayerRef.current = null;
    };
  }, [mapMode]);

  // Update tile layer when map mode changes
  useEffect(() => {
    const map = mapRef.current;
    const tileLayer = tileLayerRef.current;
    if (!map || !tileLayer) return;

    const tileUrl = mapMode === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    tileLayer.setUrl(tileUrl);
  }, [mapMode]);

  useEffect(() => {
    const map = mapRef.current;
    const cluster = clusterRef.current;
    if (!map || !cluster) return;

    cluster.clearLayers();
    markersMapRef.current.clear();

    const geoProjects = projects.filter((p) => p.latitude && p.longitude);

    geoProjects.forEach((project) => {
      const marker = L.marker([project.latitude!, project.longitude!], {
        icon: createThemedIcon(project, mapMode),
      }).bindPopup(createPopupContent(project, t), {
        maxWidth: 350,
        className: 'custom-popup'
      });

      if (onProjectClick) {
        marker.on('click', () => onProjectClick(project));
      }

      cluster.addLayer(marker);
      markersMapRef.current.set(project.id, marker);
    });

    if (geoProjects.length > 0) {
      const bounds = L.latLngBounds(geoProjects.map((p) => [p.latitude!, p.longitude!] as L.LatLngTuple));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });
    }
  }, [projects, onProjectClick, mapMode, t]);

  // Fly to selected project
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedProjectId) return;
    const marker = markersMapRef.current.get(selectedProjectId);
    if (marker) {
      const latLng = marker.getLatLng();
      map.flyTo(latLng, 8, { duration: 0.8 });
      marker.openPopup();
    }
  }, [selectedProjectId]);

  return <div ref={containerRef} className="h-full w-full rounded-lg" style={{ minHeight: '400px' }} />;
}
