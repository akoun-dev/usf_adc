import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MapPin, Search, LocateFixed } from 'lucide-react'

// Fix Leaflet marker icons issues with Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

interface ProjectMapTabProps {
  project: any
  onLocationChange: (lat: number, lng: number) => void
}

export function ProjectMapTab({ project, onLocationChange }: ProjectMapTabProps) {
  const { t } = useTranslation()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  
  const [location, setLocation] = useState({
    lat: project?.latitude || 5.3484, // Par défaut: Abidjan si non défini
    lng: project?.longitude || -4.0305
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    mapRef.current = L.map(mapContainerRef.current).setView([location.lat, location.lng], 6)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current)

    markerRef.current = L.marker([location.lat, location.lng], {
      draggable: true
    }).addTo(mapRef.current)

    markerRef.current.on('dragend', (e) => {
      const marker = e.target
      const pos = marker.getLatLng()
      updateLocation(pos.lat, pos.lng)
    })

    mapRef.current.on('click', (e) => {
      const { lat, lng } = e.latlng
      updateLocation(lat, lng)
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Sync with project data
  useEffect(() => {
    if (project?.latitude && project?.longitude) {
      const newLat = Number(project.latitude)
      const newLng = Number(project.longitude)
      
      if (newLat !== location.lat || newLng !== location.lng) {
        updateLocation(newLat, newLng, true)
      }
    }
  }, [project?.latitude, project?.longitude])

  const updateLocation = (lat: number, lng: number, silent = false) => {
    const newPos = { lat, lng }
    setLocation(newPos)
    
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng])
    }
    
    if (!silent) {
      onLocationChange(lat, lng)
    }

    if (mapRef.current && silent) {
      mapRef.current.setView([lat, lng], mapRef.current.getZoom())
    }
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          updateLocation(latitude, longitude)
          if (mapRef.current) {
            mapRef.current.flyTo([latitude, longitude], 13)
          }
          setIsLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setIsLoading(false)
        }
      )
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        const newLat = parseFloat(lat)
        const newLon = parseFloat(lon)
        
        updateLocation(newLat, newLon)
        if (mapRef.current) {
          mapRef.current.flyTo([newLat, newLon], 12)
        }
      } else {
        alert(t('admin.locationNotFound', 'Lieu non trouvé'))
      }
    } catch (error) {
      console.error('Geocoding error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('project.location', 'Localisation du projet')}</CardTitle>
        <CardDescription>{t('admin.mapInstructions', 'Visualiser et modifier la localisation géographique')}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('admin.searchLocation', 'Rechercher un lieu...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>
            {t('common.search', 'Rechercher')}
          </Button>
          <Button
            onClick={handleUseCurrentLocation}
            disabled={isLoading}
            variant="outline"
          >
            <LocateFixed className="h-4 w-4 mr-2" />
            {isLoading ? t('common.locating', 'Localisation...') : t('admin.useCurrentLocation', 'Ma position')}
          </Button>
        </div>

        {/* Current Coordinates */}
        <div className="flex flex-col sm:flex-row gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{t('project.latitude', 'Latitude')}: </span>
            <span>{location.lat.toFixed(6)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{t('project.longitude', 'Longitude')}: </span>
            <span>{location.lng.toFixed(6)}</span>
          </div>
        </div>

        {/* Map Container */}
        <div className="border rounded-lg overflow-hidden h-96 relative">
          <div ref={mapContainerRef} className="w-full h-full z-0" />
          
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
              <p className="text-sm font-medium animate-pulse">{t('common.loading', 'Chargement...')}</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="p-3 bg-muted rounded-lg text-sm">
          <p className="text-muted-foreground">
            {t('admin.mapInstructions', 'Cliquez sur la carte pour définir la localisation exacte du projet ou faites glisser le marqueur.')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}