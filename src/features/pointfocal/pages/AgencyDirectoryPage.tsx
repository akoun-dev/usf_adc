import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Search, MapPin, Phone, Mail, Globe, Users, FileText, Building2 } from "lucide-react"

function useMembres() {
    return useQuery({
        queryKey: ["membres-associes"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("membres_associes")
                .select(`
                    *,
                    country:countries(name_fr)
                `)
                .eq("est_actif", true)
                .order("nom")
            if (error) throw error
            return data
        },
    })
}

function usePartenaires() {
    return useQuery({
        queryKey: ["partenaires"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("partenaires")
                .select(`
                    *,
                    country:countries(name_fr)
                `)
                .eq("est_actif", true)
                .order("nom")
            if (error) throw error
            return data
        },
    })
}

function useProfiles() {
    return useQuery({
        queryKey: ["point-focaux-profiles"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select(`
                    *,
                    country:countries(name_fr)
                `)
                .order("full_name")
            if (error) throw error
            return data
        },
    })
}

const TYPE_COLORS: Record<string, string> = {
    agence: "bg-blue-100 text-blue-800",
    operateur: "bg-green-100 text-green-800",
    institution: "bg-purple-100 text-purple-800",
    association: "bg-orange-100 text-orange-800",
}

export default function AgencyDirectoryPage() {
    const { t } = useTranslation()
    const [search, setSearch] = useState("")
    const { data: membres = [], isLoading: membresLoading } = useMembres()
    const { data: partenaires = [], isLoading: partenairesLoading } = usePartenaires()
    const { data: profiles = [], isLoading: profilesLoading } = useProfiles()

    const filteredMembres = (membres || []).filter(m => {
        if (!search) return true
        const s = search.toLowerCase()
        return m.nom?.toLowerCase().includes(s) || m.nom_complet?.toLowerCase().includes(s)
    })

    const filteredPartenaires = (partenaires || []).filter(p => {
        if (!search) return true
        const s = search.toLowerCase()
        return p.nom?.toLowerCase().includes(s) || p.nom_complet?.toLowerCase().includes(s)
    })

    const filteredProfiles = (profiles || []).filter(p => {
        if (!search) return true
        const s = search.toLowerCase()
        return p.full_name?.toLowerCase().includes(s)
    })

    return (
        <div className="space-y-6 w-full">
            <div>
                <h1 className="text-2xl font-bold">{t("nav.directory", "Annuaire des Membres")}</h1>
                <p className="text-muted-foreground">
                    {t("directory.desc", "Annuaire des agences FSU et points focaux")}
                </p>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={t("common.search", "Rechercher...")}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            <Tabs defaultValue="agencies" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="agencies">
                        <Building2 className="mr-2 h-4 w-4" />
                        {t("directory.agencies", "Agences FSU")}
                    </TabsTrigger>
                    <TabsTrigger value="points">
                        <Users className="mr-2 h-4 w-4" />
                        {t("directory.pointsFocal", "Points Focaux")}
                    </TabsTrigger>
                    <TabsTrigger value="partners">
                        <Globe className="mr-2 h-4 w-4" />
                        {t("directory.partners", "Partenaires")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="agencies">
                    <div className="grid gap-4 md:grid-cols-2">
                        {membresLoading ? (
                            <Card className="col-span-2"><CardContent className="py-8 text-center">Loading...</CardContent></Card>
                        ) : filteredMembres.length === 0 ? (
                            <Card className="col-span-2">
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <Building2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                    <p>{t("common.noData")}</p>
                                </CardContent>
                            </Card>
                        ) : filteredMembres.map(membre => (
                            <Card key={membre.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{membre.nom}</CardTitle>
                                            <CardDescription>{membre.pays_id ? membre.country?.name_fr : ""}</CardDescription>
                                        </div>
                                        <Badge className={TYPE_COLORS[membre.type] || "bg-gray-100"}>
                                            {membre.type}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {membre.adresse && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">{membre.adresse}</span>
                                        </div>
                                    )}
                                    {membre.telephone_contact && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">{membre.telephone_contact}</span>
                                        </div>
                                    )}
                                    {membre.email_contact && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">{membre.email_contact}</span>
                                        </div>
                                    )}
                                    {membre.site_web && (
                                        <Button variant="link" size="sm" asChild className="px-0">
                                            <a href={membre.site_web} target="_blank" rel="noopener noreferrer">
                                                <Globe className="mr-1 h-4 w-4" />
                                                Site web
                                            </a>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="points">
                    <div className="grid gap-4 md:grid-cols-3">
                        {profilesLoading ? (
                            <Card className="col-span-3"><CardContent className="py-8 text-center">Loading...</CardContent></Card>
                        ) : filteredProfiles.length === 0 ? (
                            <Card className="col-span-3">
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                    <p>{t("common.noData")}</p>
                                </CardContent>
                            </Card>
                        ) : filteredProfiles.map(profile => (
                            <Card key={profile.id}>
                                <CardHeader className="flex flex-row items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{profile.full_name}</CardTitle>
                                        <CardDescription>{profile.country?.name_fr}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {profile.role?.name || "Point Focal"}
                                    </p>
                                    <Button variant="link" size="sm" className="px-0 mt-2">
                                        <Mail className="mr-1 h-4 w-4" />
                                        {t("directory.contact", "Contacter")}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="partners">
                    <div className="grid gap-4 md:grid-cols-2">
                        {partenairesLoading ? (
                            <Card className="col-span-2"><CardContent className="py-8 text-center">Loading...</CardContent></Card>
                        ) : filteredPartenaires.length === 0 ? (
                            <Card className="col-span-2">
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <Globe className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                    <p>{t("common.noData")}</p>
                                </CardContent>
                            </Card>
                        ) : filteredPartenaires.map(partner => (
                            <Card key={partner.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{partner.nom}</CardTitle>
                                            <CardDescription>{partner.pays_id ? partner.country?.name_fr : ""}</CardDescription>
                                        </div>
                                        <Badge variant="outline">{partner.type}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {partner.domaine && (
                                        <p className="text-sm text-muted-foreground">{partner.domaine}</p>
                                    )}
                                    {partner.email_contact && (
                                        <Button variant="link" size="sm" className="px-0 mt-2">
                                            <Mail className="mr-1 h-4 w-4" />
                                            {partner.email_contact}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}