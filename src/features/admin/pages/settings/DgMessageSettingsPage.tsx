import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Upload, Loader2, Globe, Building2, MapPin, Phone, Mail, Plus, Trash2 } from "lucide-react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"
import { supabase } from "@/integrations/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { translateToFourLang } from "../../services/translate.service"
import { Languages, Sparkles } from "lucide-react"


export default function DgMessageSettingsPage() {
    const navigate = useNavigate()
    const { user, hasRole } = useAuth()
    const { toast } = useToast()
    const { t, i18n } = useTranslation()
    const isSuperAdmin = hasRole("super_admin")
    
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [countries, setCountries] = useState<any[]>([])
    const [selectedCountryId, setSelectedCountryId] = useState<string>("")
    const [agencies, setAgencies] = useState<any[]>([])
    const [selectedAgencyId, setSelectedAgencyId] = useState<string>("new")
    
    const [formData, setFormData] = useState({
        dg_name: "",
        fsu_name: "",
        dg_message: { fr: "", en: "", pt: "", ar: "" } as any,
        dg_photo_url: "",
        agency_type: "agency",
        latitude: "",
        longitude: "",
        headquarters: "",
        contact_phone: "",
        contact_email: ""
    })
    const [isTranslating, setIsTranslating] = useState(false)


    const fetchAgencies = useCallback(async (countryId: string) => {
        const { data, error } = await supabase
            .from("fsu_agencies")
            .select("*")
            .eq("country_id", countryId)
            .order("created_at")

        if (data) {
            setAgencies(data)
            if (data.length > 0) {
                const first = data[0]
                setSelectedAgencyId(first.id)
                const dgMsg = typeof first.dg_message === 'object' && first.dg_message !== null
                    ? first.dg_message 
                    : { fr: first.dg_message || "", en: "", pt: "", ar: "" }

                setFormData({
                    dg_name: first.dg_name || "",
                    fsu_name: first.fsu_name || "",
                    dg_message: dgMsg,
                    dg_photo_url: first.dg_photo_url || "",
                    agency_type: first.agency_type || "agency",
                    latitude: first.latitude?.toString() || "",
                    longitude: first.longitude?.toString() || "",
                    headquarters: first.headquarters || "",
                    contact_phone: first.contact_phone || "",
                    contact_email: first.contact_email || ""
                })
            } else {
                setSelectedAgencyId("new")
                resetForm()
            }
        }
    }, [])

    const resetForm = () => {
        setFormData({
            dg_name: "",
            fsu_name: "",
            dg_message: { fr: "", en: "", pt: "", ar: "" },
            dg_photo_url: "",
            agency_type: "agency",
            latitude: "",
            longitude: "",
            headquarters: "",
            contact_phone: "",
            contact_email: ""
        })
    }

    const handleAgencyChange = (id: string) => {
        setSelectedAgencyId(id)
        if (id === "new") {
            resetForm()
        } else {
            const agency = agencies.find(a => a.id === id)
            if (agency) {
                const dgMsg = typeof agency.dg_message === 'object' && agency.dg_message !== null
                    ? agency.dg_message 
                    : { fr: agency.dg_message || "", en: "", pt: "", ar: "" }

                setFormData({
                    dg_name: agency.dg_name || "",
                    fsu_name: agency.fsu_name || "",
                    dg_message: dgMsg,
                    dg_photo_url: agency.dg_photo_url || "",
                    agency_type: agency.agency_type || "agency",
                    latitude: agency.latitude?.toString() || "",
                    longitude: agency.longitude?.toString() || "",
                    headquarters: agency.headquarters || "",
                    contact_phone: agency.contact_phone || "",
                    contact_email: agency.contact_email || ""
                })
            }
        }
    }

    const fetchInitialData = useCallback(async () => {
        try {
            setLoading(true)
            
            // Fetch countries for Super Admin dropdown
            if (isSuperAdmin) {
                const { data: countriesData } = await supabase
                    .from("countries")
                    .select("id, name_fr, code_iso")
                    .order("name_fr")
                setCountries(countriesData || [])
            }

            // Get the target country ID
            let targetCountryId = ""
            if (isSuperAdmin) {
                const { data: firstCountry } = await supabase
                    .from("countries")
                    .select("id")
                    .limit(1)
                    .single()
                targetCountryId = firstCountry?.id || ""
            } else {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("country_id")
                    .eq("id", user?.id)
                    .single()
                targetCountryId = profile?.country_id || ""
            }

            if (targetCountryId) {
                setSelectedCountryId(targetCountryId)
                await fetchAgencies(targetCountryId)
            }
        } catch (error) {
            console.error("Error fetching initial data:", error)
        } finally {
            setLoading(false)
        }
    }, [isSuperAdmin, user?.id, fetchAgencies])

    useEffect(() => {
        fetchInitialData()
    }, [fetchInitialData])

    const handleCountryChange = (id: string) => {
        setSelectedCountryId(id)
        fetchAgencies(id)
    }

    const handleSave = async () => {
        if (!selectedCountryId) return

        try {
            setSaving(true)
            
            // Auto-translation logic
            let finalMessage = formData.dg_message
            const currentLang = i18n.language.split('-')[0] // handle fr-FR etc
            const currentText = typeof formData.dg_message === 'object' 
                ? formData.dg_message[currentLang] || formData.dg_message['fr']
                : formData.dg_message

            if (currentText) {
                setIsTranslating(true)
                const targetLangs = ['fr', 'en', 'pt', 'ar'].filter(l => l !== currentLang)
                
                toast({
                    title: t("admin.translating", "Traduction en cours..."),
                    description: t("admin.translatingDesc", "Génération automatique des versions multilingues.")
                })

                const translations = await translateToFourLang(currentLang, currentText)
                
                finalMessage = {
                    ...formData.dg_message,
                    [currentLang]: currentText,
                    ...translations
                }
                setIsTranslating(false)
            }

            const payload = {
                country_id: selectedCountryId,
                ...formData,
                dg_message: finalMessage,
                latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                longitude: formData.longitude ? parseFloat(formData.longitude) : null,
                updated_at: new Date().toISOString()
            }

            let result
            if (selectedAgencyId === "new") {
                result = await supabase
                    .from("fsu_agencies")
                    .insert([payload])
                    .select()
                    .single()
            } else {
                result = await supabase
                    .from("fsu_agencies")
                    .update(payload)
                    .eq("id", selectedAgencyId)
                    .select()
                    .single()
            }

            if (result.error) throw result.error

            toast({
                title: t("common.success"),
                description: t("admin.dgMessageUpdated", "Les informations de l'agence ont été mises à jour avec succès.")
            })
            
            await fetchAgencies(selectedCountryId)
            if (result.data) setSelectedAgencyId(result.data.id)

        } catch (error) {
            console.error("Error saving agency data:", error)
            toast({
                title: t("common.error"),
                description: t("common.errorOccurred"),
                variant: "destructive"
            })
        } finally {
            setSaving(false)
            setIsTranslating(false)
        }
    }

    const handleDelete = async () => {
        if (selectedAgencyId === "new") return
        if (!confirm(t("common.confirmDelete", "Êtes-vous sûr de vouloir supprimer cette agence ?"))) return

        try {
            setSaving(true)
            const { error } = await supabase
                .from("fsu_agencies")
                .delete()
                .eq("id", selectedAgencyId)

            if (error) throw error

            toast({
                title: t("common.success"),
                description: t("admin.agencyDeleted", "L'agence a été supprimée.")
            })
            
            await fetchAgencies(selectedCountryId)
        } catch (error) {
            console.error("Error deleting agency:", error)
            toast({
                title: t("common.error"),
                description: t("common.errorOccurred"),
                variant: "destructive"
            })
        } finally {
            setSaving(false)
        }
    }

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !selectedCountryId) return

        try {
            setSaving(true)
            const fileExt = file.name.split('.').pop()
            const fileName = `${selectedCountryId}-${Math.random()}.${fileExt}`
            const filePath = `photos/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('dg-photos')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('dg-photos')
                .getPublicUrl(filePath)

            setFormData(prev => ({ ...prev, dg_photo_url: publicUrl }))
            
            toast({
                title: t("common.success"),
                description: t("admin.photoUploaded", "Photo téléchargée avec succès.")
            })
        } catch (error) {
            console.error("Error uploading photo:", error)
            toast({
                title: t("common.error"),
                description: t("admin.uploadError", "Erreur lors du téléchargement de la photo."),
                variant: "destructive"
            })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/admin/settings')}
                        className="hover:bg-primary/10 hover:text-primary"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-primary">
                            {t("admin.agencyManagement", "Gestion des Agences")}
                        </h1>
                        <p className="text-muted-foreground">
                            {t("admin.agencyManagementDesc", "Gérez les informations des agences, les responsables et leurs messages.")}
                        </p>
                    </div>
                </div>
                <Button onClick={() => handleAgencyChange("new")} variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    {t("admin.addAgency", "Ajouter une agence")}
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-6">
                    {isSuperAdmin && (
                        <Card className="bg-white/50 backdrop-blur-md border-primary/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Globe className="h-5 w-5 text-primary" />
                                    {t("admin.selectCountry", "Pays")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select value={selectedCountryId} onValueChange={handleCountryChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("admin.chooseCountry", "Choisir un pays")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map(c => (
                                            <SelectItem key={c.id} value={c.id}>
                                                {c.name_fr}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                {t("admin.agenciesList", "Liste des agences")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {agencies.length === 0 && (
                                <p className="text-sm text-muted-foreground italic py-4">
                                    {t("admin.noAgencies", "Aucune agence enregistrée pour ce pays.")}
                                </p>
                            )}
                            {agencies.map(a => (
                                <button
                                    key={a.id}
                                    onClick={() => handleAgencyChange(a.id)}
                                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                                        selectedAgencyId === a.id 
                                        ? 'bg-primary/5 border-primary text-primary font-medium ring-2 ring-primary/10' 
                                        : 'hover:bg-muted border-transparent'
                                    }`}
                                >
                                    <div className="text-sm font-bold truncate">{a.fsu_name}</div>
                                    <div className="text-xs opacity-70 truncate">{a.dg_name}</div>
                                </button>
                            ))}
                            <Button 
                                variant="ghost" 
                                className={`w-full justify-start gap-2 h-12 ${selectedAgencyId === 'new' ? 'bg-primary/5 text-primary' : ''}`}
                                onClick={() => handleAgencyChange("new")}
                            >
                                <Plus className="h-4 w-4" />
                                {t("admin.addNew", "Nouvel enregistrement")}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t("admin.photo", "Photo du Responsable")}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="aspect-[4/5] rounded-3xl border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center overflow-hidden bg-muted/50 relative group transition-all hover:border-primary/50">
                                {formData.dg_photo_url ? (
                                    <img
                                        src={formData.dg_photo_url}
                                        alt="DG"
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="text-center p-6">
                                        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground">
                                            {t("admin.noPhoto", "Aucune photo")}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <Input
                                type="file"
                                id="photo_upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                            />
                            <Button
                                variant="outline"
                                className="w-full rounded-xl"
                                onClick={() => document.getElementById('photo_upload')?.click()}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                {t("admin.upload", "Télécharger")}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                {selectedAgencyId === "new" ? t("admin.newAgency", "Nouvelle Agence") : t("admin.editAgency", "Modifier l'agence")}
                            </CardTitle>
                            {selectedAgencyId !== "new" && (
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={handleDelete}>
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="fsu_name">{t("admin.agencyName", "Nom de l'institution")}</Label>
                                    <Input
                                        id="fsu_name"
                                        value={formData.fsu_name}
                                        onChange={e => setFormData({ ...formData, fsu_name: e.target.value })}
                                        placeholder="Ex: ANSUT, ARTCI, UAT..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="agency_type">{t("admin.agencyType", "Type")}</Label>
                                    <Select 
                                        value={formData.agency_type} 
                                        onValueChange={v => setFormData({ ...formData, agency_type: v })}
                                    >
                                        <SelectTrigger id="agency_type">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="agency">{t("admin.typeAgency", "Agence dédiée")}</SelectItem>
                                            <SelectItem value="regulator">{t("admin.typeRegulator", "Régulateur")}</SelectItem>
                                            <SelectItem value="ministry">{t("admin.typeMinistry", "Ministère")}</SelectItem>
                                            <SelectItem value="institution">{t("admin.typeInstitution", "Institution")}</SelectItem>
                                            <SelectItem value="organization">{t("admin.typeOrganization", "Organisme")}</SelectItem>
                                            <SelectItem value="public_service">{t("admin.typePublicService", "Service public")}</SelectItem>
                                            <SelectItem value="private_service">{t("admin.typePrivateService", "Service privé")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dg_name">{t("admin.dgName", "Nom du Responsable (DG / SG / Ministre)")}</Label>
                                <Input
                                    id="dg_name"
                                    value={formData.dg_name}
                                    onChange={e => setFormData({ ...formData, dg_name: e.target.value })}
                                    placeholder="Ex: M. John Omo"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="dg_message">{t("admin.dgMessage", "Mot de bienvenue")}</Label>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Languages className="h-3 w-3" />
                                        <span>{t("admin.autoTranslateActive", "Traduction auto active (EN, PT, AR)")}</span>
                                    </div>
                                </div>
                                <div className="relative">
                                    <Textarea
                                        id="dg_message"
                                        className="min-h-[150px] pr-10"
                                        value={typeof formData.dg_message === 'object' ? (formData.dg_message[i18n.language.split('-')[0]] || formData.dg_message['fr'] || "") : formData.dg_message}
                                        onChange={e => {
                                            const newVal = e.target.value
                                            const lang = i18n.language.split('-')[0]
                                            setFormData(prev => ({
                                                ...prev,
                                                dg_message: typeof prev.dg_message === 'object' 
                                                    ? { ...prev.dg_message, [lang]: newVal } 
                                                    : { fr: newVal, en: "", pt: "", ar: "" }
                                            }))
                                        }}
                                        placeholder={t("admin.dgMessagePlaceholder", "Saisissez le mot de bienvenue dans votre langue active...")}
                                    />
                                    {isTranslating && (
                                        <div className="absolute top-2 right-2">
                                            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground italic">
                                    {t("admin.translationHint", "Le message sera automatiquement traduit vers les autres langues lors de l'enregistrement.")}
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        {t("admin.latitude", "Latitude")}
                                    </Label>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={formData.latitude}
                                        onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                                        placeholder="5.3484"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        {t("admin.longitude", "Longitude")}
                                    </Label>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={formData.longitude}
                                        onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                                        placeholder="-4.0305"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-primary" />
                                    {t("admin.headquarters", "Siège social")}
                                </Label>
                                <Input
                                    value={formData.headquarters}
                                    onChange={e => setFormData({ ...formData, headquarters: e.target.value })}
                                    placeholder="Ex: Abidjan, Côte d'Ivoire"
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-primary" />
                                        {t("admin.contactPhone", "Contact téléphonique")}
                                    </Label>
                                    <Input
                                        value={formData.contact_phone}
                                        onChange={e => setFormData({ ...formData, contact_phone: e.target.value })}
                                        placeholder="+225 27..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-primary" />
                                        {t("admin.contactEmail", "Email de contact")}
                                    </Label>
                                    <Input
                                        type="email"
                                        value={formData.contact_email}
                                        onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                                        placeholder="contact@agence.ci"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-6">
                                <Button
                                    onClick={handleSave}
                                    disabled={saving || !selectedCountryId}
                                    className="bg-primary hover:bg-primary/90 px-12 h-12 rounded-xl shadow-lg shadow-primary/20"
                                >
                                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    {selectedAgencyId === "new" ? t("common.create", "Créer l'agence") : t("common.save", "Enregistrer les modifications")}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
