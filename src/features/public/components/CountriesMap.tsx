import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockMemberCountries } from '../data/mockCountries';
import { AFRICAN_COUNTRIES_GEOJSON, getCountryGeoJSON } from '../data/africanCountriesGeoJSON';
import type { Project } from '@/features/projects-map/types';

interface Props {
    projectsByCountry: Record<string, Project[]>;
    onCountryClick?: (countryCode: string) => void;
    selectedCountryCode?: string | null;
    mapMode?: 'carte' | 'satellite';
}

const COUNTRY_COLORS = {
    member: '#3388ff',
    selected: '#ff6b35',
    hover: '#6699ff',
    noProjects: '#cccccc',
};

// Calculate marker size based on project count
function getMarkerSize(projectCount: number): number {
    if (projectCount === 0) return 8;
    if (projectCount <= 3) return 12;
    if (projectCount <= 10) return 18;
    if (projectCount <= 20) return 25;
    return 32;
}


// Get centroid from GeoJSON polygon
function getCountryCentroid(geoData: GeoJSON.Feature): { lat: number; lng: number } | null {
    if (!geoData.geometry || geoData.geometry.type !== 'Polygon') return null;

    const coords = geoData.geometry.coordinates[0];
    let totalLat = 0;
    let totalLng = 0;
    let count = 0;

    for (const coord of coords) {
        totalLng += coord[0];
        totalLat += coord[1];
        count++;
    }

    return { lat: totalLat / count, lng: totalLng / count };
}

export function CountriesMap({ projectsByCountry, onCountryClick, selectedCountryCode, mapMode = 'carte' }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const tileLayerRef = useRef<L.TileLayer | null>(null);
    const layerGroupRef = useRef<L.LayerGroup | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || mapRef.current) return;

        // Vérifier que le conteneur a une taille
        const rect = container.getBoundingClientRect();
        console.log('[CountriesMap] Container size:', rect.width, 'x', rect.height);

        if (rect.width === 0 || rect.height === 0) {
            console.error('[CountriesMap] Container has no size!');
            return;
        }

        try {
            const map = L.map(container, {
                center: [5, 20] as L.LatLngExpression,
                zoom: 3,
                minZoom: 2,
                zoomControl: true,
            });

            // Create tile layer based on map mode
            const tileUrl = mapMode === 'satellite'
                ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            const attribution = mapMode === 'satellite'
                ? '&copy; <a href="https://www.esri.com/">Esri</a>'
                : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

            tileLayerRef.current = L.tileLayer(tileUrl, { attribution }).addTo(map);

            const layerGroup = L.layerGroup().addTo(map);
            mapRef.current = map;
            layerGroupRef.current = layerGroup;
            setIsReady(true);

            console.log('[CountriesMap] ✅ Map initialized successfully at', [5, 20]);
        } catch (error) {
            console.error('[CountriesMap] ❌ Error initializing map:', error);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                tileLayerRef.current = null;
                layerGroupRef.current = null;
                setIsReady(false);
            }
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
        const layerGroup = layerGroupRef.current;
        if (!map || !layerGroup || !isReady) {
            console.log('[CountriesMap] Waiting for map to be ready...');
            return;
        }

        console.log('[CountriesMap] 🗺️ Rendering countries map with points...');
        console.log('[CountriesMap] Countries with projects:', Object.keys(projectsByCountry));

        layerGroup.clearLayers();

        const bounds: L.LatLngBoundsExpression = [];
        let countriesRendered = 0;

        mockMemberCountries.forEach((country) => {
            const geoData = getCountryGeoJSON(country.code);
            if (!geoData) {
                console.warn(`[CountriesMap] ⚠️ No GeoJSON for ${country.code}`);
                return;
            }

            const countryProjects = projectsByCountry[country.code] || [];
            const projectCount = countryProjects.length;
            const isSelected = selectedCountryCode === country.code;

            console.log(`[CountriesMap] 📍 ${country.code}: ${projectCount} projects`);

            const centroid = getCountryCentroid(geoData.geojson);
            if (!centroid) {
                console.warn(`[CountriesMap] ⚠️ No centroid for ${country.code}`);
                return;
            }

            try {
                const markerSize = getMarkerSize(projectCount);
                const fillColor = projectCount > 0 ? COUNTRY_COLORS.member : COUNTRY_COLORS.noProjects;

                // Enhanced contrast for satellite mode
                const isSatellite = mapMode === 'satellite';
                const strokeColor = isSelected
                    ? COUNTRY_COLORS.selected
                    : (isSatellite ? '#ffeb3b' : '#ffffff'); // Yellow stroke on satellite for visibility
                const strokeWidth = isSelected ? 4 : (isSatellite ? 3 : 2);
                const fillOpacity = isSelected ? 0.9 : (isSatellite ? 0.85 : 0.7);

                // Create circle marker
                const marker = L.circleMarker([centroid.lat, centroid.lng], {
                    radius: markerSize,
                    fillColor: fillColor,
                    color: strokeColor,
                    weight: strokeWidth,
                    opacity: 1,
                    fillOpacity: fillOpacity,
                });

                // Calculate project stats for this country
                const countryProjects = projectsByCountry[country.code] || [];
                const activeCount = countryProjects.filter(p => p.status === 'in_progress').length;
                const completedCount = countryProjects.filter(p => p.status === 'completed').length;
                const totalBudget = countryProjects.reduce((sum, p) => sum + (p.budget || 0), 0);

                // Create popup content with enhanced information
                const popupContent = document.createElement('div');
                popupContent.style.cssText = 'min-width: 280px; font-family: system-ui, sans-serif;';
                popupContent.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <img src="${country.flagUrl}" alt="${country.name}" style="width: 48px; height: 32px; object-fit: cover; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.15);" />
            <div style="flex: 1;">
              <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #1a1a1a;">${country.name}</h3>
              <p style="margin: 2px 0 0; font-size: 13px; color: #666; font-weight: 500;">${country.region}</p>
            </div>
          </div>

          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 10px; text-align: center; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
            <div style="font-size: 32px; font-weight: 700;">${projectCount}</div>
            <div style="font-size: 13px; opacity: 0.95;">projet${projectCount > 1 ? 's' : ''} FSU</div>
            ${projectCount > 0 ? `
              <div style="margin-top: 8px; font-size: 12px; opacity: 0.9;">
                <span style="color: #86efac;">● ${activeCount} en cours</span>
                ${completedCount > 0 ? `<span style="margin-left: 8px; color: #fcd34d;">● ${completedCount} terminés</span>` : ''}
              </div>
            ` : ''}
          </div>

          ${projectCount > 0 ? `
            <div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 12px; border: 1px solid #e2e8f0;">
              <div style="display: grid; grid-cols: 2; gap: 8px; font-size: 13px;">
                <div>
                  <div style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Budget FSU</div>
                  <div style="font-weight: 600; color: #1e293b;">${country.fsuBudget}</div>
                </div>
                <div>
                  <div style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Population</div>
                  <div style="font-weight: 600; color: #1e293b;">${country.population}</div>
                </div>
                <div>
                  <div style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Établi en</div>
                  <div style="font-weight: 600; color: #1e293b;">${country.fsuEstablished}</div>
                </div>
                <div>
                  <div style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Coordinateur</div>
                  <div style="font-weight: 600; color: #1e293b; font-size: 12px;">${country.coordinator.split(' ')[0]}</div>
                </div>
              </div>
            </div>
          ` : ''}

          <a href="/projets-pays/${country.code}" style="display: block; text-align: center; background: linear-gradient(135deg, #3388ff 0%, #2563eb 100%); color: white; padding: 12px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; box-shadow: 0 4px 12px rgba(51, 136, 255, 0.3); transition: all 0.2s;">
            Voir tous les projets →
          </a>
        `;

                marker.bindPopup(popupContent, { maxWidth: 300 });

                // Click handler
                marker.on('click', () => {
                    console.log(`[CountriesMap] 🖱️ Clicked on ${country.code}`);
                    onCountryClick?.(country.code);
                });

                // Hover effect
                marker.on('mouseover', function () {
                    if (!isSelected && projectCount > 0) {
                        this.setStyle({
                            fillColor: COUNTRY_COLORS.hover,
                            fillOpacity: 0.9,
                            weight: 4
                        });
                    }
                });

                marker.on('mouseout', function () {
                    this.setStyle({
                        fillColor: fillColor,
                        fillOpacity: fillOpacity,
                        weight: strokeWidth,
                        color: strokeColor
                    });
                });

                marker.addTo(layerGroup);
                countriesRendered++;
                bounds.push([centroid.lat, centroid.lng]);

            } catch (error) {
                console.error(`[CountriesMap] ❌ Error rendering ${country.code}:`, error);
            }
        });

        console.log(`[CountriesMap] ✅ Rendered ${countriesRendered} country points`);

        if (bounds.length > 0) {
            try {
                //map.fitBounds(bounds, { padding: [50, 50], maxZoom: 5 });
                map.fitBounds(bounds, {
                    paddingTopLeft: [50, 50],
                    paddingBottomRight: [50, 120], // 👈 plus d’espace en bas
                    maxZoom: 5,
                });

                // 👇 offset manuel
                /*const center = map.getCenter();
                const zoom = map.getZoom();

                const offsetY = 10; // ajuste ici
                const point = map.project(center, zoom);
                const newPoint = point.subtract([0, offsetY]);
                const newCenter = map.unproject(newPoint, zoom);

                map.setView(newCenter, zoom);*/

                console.log('[CountriesMap] ✅ Bounds fitted');
            } catch (error) {
                console.error('[CountriesMap] ❌ Error fitting bounds:', error);
            }
        }
    }, [selectedCountryCode, onCountryClick, projectsByCountry, isReady, mapMode]);

    return (
        <div className="relative w-full h-full">
            <div
                ref={containerRef}
                className="w-full h-full rounded-lg overflow-hidden"
            />
            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/20 rounded-lg">
                    <div className="text-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
