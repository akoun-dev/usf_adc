import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MapPin, Search, LocateFixed } from 'lucide-react'

interface ProjectMapTabProps {
  project: any
  onLocationChange: (lat: number, lng: number) => void
}

export function ProjectMapTab({ project, onLocationChange }: ProjectMapTabProps) {
  const { t } = useTranslation()
  const [location, setLocation] = useState({
    lat: project.latitude || -18.8792,
    lng: project.longitude || 47.5079
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (project.latitude && project.longitude) {
      setLocation({
        lat: project.latitude,
        lng: project.longitude
      })
    }
  }, [project.latitude, project.longitude])

  const handleMapClick = (e: any) => {
    const newLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    }
    setLocation(newLocation)
    onLocationChange(newLocation.lat, newLocation.lng)
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setLocation(newLocation)
          onLocationChange(newLocation.lat, newLocation.lng)
          setIsLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setIsLoading(false)
        }
      )
    }
  }

  const handleSearch = () => {
    // In a real implementation, this would use a geocoding API
    console.log('Searching for:', searchQuery)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('project.location', 'Localisation du projet')}</CardTitle>
        <CardDescription>{t('project.locationDesc', 'Visualiser et modifier la localisation géographique')}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('project.searchLocation', 'Rechercher un lieu...')}
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
            {isLoading ? t('common.locating', 'Localisation...') : t('project.useCurrentLocation', 'Ma position')}
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
        <div className="border rounded-lg overflow-hidden h-96">
          <div className="w-full h-full bg-muted relative">
            {/* Simple map placeholder - in a real app, this would be a Google Maps or Leaflet component */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4">
                <MapPin className="h-12 w-12 mx-auto mb-2 text-primary" />
                <p className="text-muted-foreground">
                  {t('project.mapPlaceholder', 'Carte interactive - Cliquez pour définir la localisation')}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {t('project.coordinates', 'Coordonnées actuelles')}: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              </div>
            </div>

            {/* In a real implementation, you would use a map library like Google Maps or Leaflet */}
            {/* Example with Google Maps: */}
            {/* <GoogleMap
              center={location}
              zoom={12}
              onClick={handleMapClick}
              mapContainerStyle={{ width: '100%', height: '100%' }}
            >
              <Marker position={location} />
            </GoogleMap> */}
          </div>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-muted rounded-lg text-sm">
          <p className="text-muted-foreground">
            {t('project.mapInstructions', 'Cliquez sur la carte pour définir la localisation exacte du projet. Vous pouvez également utiliser la recherche ou votre position actuelle.')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}