import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

const BUCKET_NAME = "countries-logos"

interface CountryLogoUploadProps {
    value?: string
    onChange: (path: string) => void
    countryCode?: string
    label?: string
    disabled?: boolean
}

export function CountryLogoUpload({
    value,
    onChange,
    countryCode,
    label = "Logo du pays",
    disabled = false
}: CountryLogoUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Initialize preview from value
    useEffect(() => {
        if (value) {
            // If it's a full URL (external flag), use it directly
            if (value.startsWith('http')) {
                setPreview(value)
            } else {
                // Otherwise, get it from Supabase Storage
                const { data } = supabase.storage
                    .from(BUCKET_NAME)
                    .getPublicUrl(value)
                if (data?.publicUrl) {
                    setPreview(data.publicUrl)
                }
            }
        } else {
            setPreview(null)
        }
    }, [value])

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                title: "Erreur",
                description: "Veuillez sélectionner une image (JPG, PNG, WebP...)",
                variant: "destructive"
            })
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Erreur",
                description: "L'image ne doit pas dépasser 5MB",
                variant: "destructive"
            })
            return
        }

        // Show local preview
        const localPreview = URL.createObjectURL(file)
        setPreview(localPreview)

        setUploading(true)
        try {
            // Generate unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${countryCode || 'country'}-${Date.now()}.${fileExt}`

            // Upload file
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: true
                })

            if (uploadError) {
                throw uploadError
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(fileName)

            if (urlData?.publicUrl) {
                onChange(fileName)
                toast({
                    title: "Succès",
                    description: "Logo téléchargé avec succès"
                })
            }
        } catch (error) {
            console.error('Upload error:', error)
            toast({
                title: "Erreur",
                description: "Impossible de télécharger le logo",
                variant: "destructive"
            })
            setPreview(null)
        } finally {
            setUploading(false)
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleRemove = () => {
        setPreview(null)
        onChange('')
    }

    const isExternalUrl = value?.startsWith('http')

    return (
        <div className="space-y-2">
            <Label>{label}</Label>

            <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="relative group">
                    {preview ? (
                        <div className="relative w-24 h-24 rounded-lg border overflow-hidden bg-muted">
                            <img
                                src={preview}
                                alt="Logo du pays"
                                className="w-full h-full object-cover"
                            />
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="absolute top-1 right-1 p-1 bg-background/80 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                    )}
                </div>

                {/* Upload controls */}
                <div className="flex-1 space-y-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        onChange={handleFileSelect}
                        disabled={disabled || uploading}
                        className="hidden"
                    />

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={disabled || uploading}
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Téléchargement...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Choisir une image
                                </>
                            )}
                        </Button>

                        {isExternalUrl && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    // Switch from external URL to upload
                                    handleRemove()
                                }}
                            >
                                Remplacer l'URL externe
                            </Button>
                        )}
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                            Formats acceptés: PNG, JPG, WebP, SVG
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Taille maximale: 5MB
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Dimensions recommandées: 200x200px
                        </p>
                    </div>

                    {isExternalUrl && !preview?.includes('supabase') && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                            <p className="text-xs text-blue-800 dark:text-blue-200">
                                ℹ️ URL externe détectée. Téléchargez une image personnalisée pour la remplacer.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
