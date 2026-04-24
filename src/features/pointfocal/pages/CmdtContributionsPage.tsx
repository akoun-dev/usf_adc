import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import {
    FileText, Send, Clock, Users, History, Plus, Edit3, Download, Share2, UserPlus, Eye, CheckCircle
} from "lucide-react"

function useContributions(status?: string) {
    return useQuery({
        queryKey: ["cmdt-contributions", status],
        queryFn: async () => {
            let query = supabase
                .from("cmdt_contributions")
                .select(`
                    *,
                    country:countries(name_fr)
                `)
                .order("is_pinned", { ascending: false })
                .order("updated_at", { ascending: false })
            
            if (status) {
                query = query.eq("status", status)
            }
            
            const { data, error } = await query
            if (error) throw error
            return data
        },
    })
}

function useUserContributions() {
    return useQuery({
        queryKey: ["user-cmdt-contributions"],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return []
            
            const { data, error } = await supabase
                .from("cmdt_contributions")
                .select(`
                    *,
                    country:countries(name_fr)
                `)
                .eq("created_by", user.id)
                .order("updated_at", { ascending: false })
            if (error) throw error
            return data
        },
    })
}

function useContributionHistory(contributionId: string) {
    return useQuery({
        queryKey: ["cmdt-contribution-history", contributionId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("document_versions")
                .select("*")
                .eq("document_id", contributionId)
                .order("created_at", { ascending: false })
            if (error) throw error
            return data
        },
        enabled: !!contributionId,
    })
}

const TEMPLATES = [
    { id: "declaration", name: "Declaration politique", description: "Modele de declaration institutionnelle" },
    { id: "rapport", name: "Rapport de situation", description: "Modele de rapport national" },
    { id: "recommandations", name: "Recommandations", description: "Modele de recommandations techniques" },
    { id: "compte_rendu", name: "Compte rendu", description: "Modele de compte rendu de reunion" },
    { id: "note", name: "Note de synthese", description: "Modele de veille reglementaire" },
]

const STATUS_COLORS: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    review: "bg-yellow-100 text-yellow-800",
    pending: "bg-orange-100 text-orange-800",
    validated: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
}

export default function CmdtContributionsPage() {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const [selectedContribution, setSelectedContribution] = useState<any>(null)
    const [newDocOpen, setNewDocOpen] = useState(false)
    
    const { data: allContributions = [], isLoading: allLoading } = useContributions()
    const { data: drafts = [], isLoading: draftsLoading } = useContributions("draft")
    const { data: inReview = [], isLoading: reviewLoading } = useContributions("review")
    const { data: pending = [], isLoading: pendingLoading } = useContributions("pending")
    const { data: validated = [], isLoading: validatedLoading } = useContributions("validated")
    const { data: userContributions = [], isLoading: userLoading } = useUserContributions()

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const { data: { user } } = await supabase.auth.getUser()
            const { error } = await supabase.from("cmdt_contributions").insert({
                ...data,
                created_by: user?.id,
                status: "draft",
                version: "v1",
            })
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cmdt-contributions"] })
            toast.success("Contribution creee")
            setNewDocOpen(false)
        },
    })

    const submitMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("cmdt_contributions")
                .update({ status: "pending", submitted_at: new Date().toISOString() })
                .eq("id", id)
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cmdt-contributions"] })
            toast.success("Contribution soumise")
        },
    })

    const getStatusBadge = (status: string) => (
        <Badge className={STATUS_COLORS[status] || "bg-gray-100"}>
            {status === "draft" ? "Brouillon" : 
             status === "review" ? "En revue" :
             status === "pending" ? "En attente" :
             status === "validated" ? "Valide" : "Rejete"}
        </Badge>
    )

    const stats = {
        draft: drafts?.length || 0,
        review: inReview?.length || 0,
        pending: pending?.length || 0,
        validated: validated?.length || 0,
    }

    return (
        <div className="space-y-6 w-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{t("nav.cmdt25", "Contributions CMDT-25")}</h1>
                    <p className="text-muted-foreground">
                        {t("cmdt25.desc", "Module de co-redaction collaborative")}
                    </p>
                </div>
                <Dialog open={newDocOpen} onOpenChange={setNewDocOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            {t("cmdt25.newContribution", "Nouvelle contribution")}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{t("cmdt25.createNew", "Creer une nouvelle contribution")}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label>{t("cmdt25.title", "Titre")}</Label>
                                <Input placeholder="Titre de la contribution..." />
                            </div>
                            <div>
                                <Label>{t("cmdt25.template", "Modele")}</Label>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    {TEMPLATES.map(template => (
                                        <Card key={template.id} className="cursor-pointer hover:shadow-md">
                                            <CardContent className="p-3">
                                                <p className="font-medium text-sm">{template.name}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Label>{t("cmdt25.description", "Description")}</Label>
                                <Textarea placeholder="Description de la contribution..." />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setNewDocOpen(false)}>
                                    {t("common.cancel", "Annuler")}
                                </Button>
                                <Button onClick={() => createMutation.mutate({})}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t("cmdt25.create", "Creer")}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{t("cmdt25.drafts", "Brouillons")}</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.draft}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{t("cmdt25.inReview", "En revue")}</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.review}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{t("cmdt25.pendingValidation", "En attente")}</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.pending}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{t("cmdt25.validated", "Valides")}</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.validated}</div></CardContent>
                </Card>
            </div>

            <Tabs defaultValue="documents" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="documents">
                        <FileText className="mr-2 h-4 w-4" />
                        {t("cmdt25.documents", "Documents")}
                    </TabsTrigger>
                    <TabsTrigger value="editor">
                        <Edit3 className="mr-2 h-4 w-4" />
                        {t("cmdt25.editor", "Editeur")}
                    </TabsTrigger>
                    <TabsTrigger value="history">
                        <History className="mr-2 h-4 w-4" />
                        {t("cmdt25.history", "Historique")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="documents">
                    <div className="grid gap-4 md:grid-cols-2">
                        {allLoading ? (
                            <Card className="col-span-2"><CardContent className="py-8 text-center">Loading...</CardContent></Card>
                        ) : (allContributions || []).length === 0 ? (
                            <Card className="col-span-2">
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                    <p>{t("common.noData")}</p>
                                </CardContent>
                            </Card>
                        ) : (allContributions || []).map(contribution => (
                            <Card key={contribution.id} className="hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => setSelectedContribution(contribution)}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-base">{contribution.title}</CardTitle>
                                            <CardDescription>
                                                {contribution.profiles?.full_name || contribution.created_by} • {new Date(contribution.updated_at).toLocaleDateString()}
                                            </CardDescription>
                                        </div>
                                        {getStatusBadge(contribution.status)}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <History className="h-3 w-3" />
                                                {contribution.version}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="h-3 w-3" />
                                                {contribution.collaborators?.length || 0}
                                            </span>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" title="Exporter">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" title="Partager">
                                                <Share2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="editor">
                    {selectedContribution ? (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>{selectedContribution.title}</CardTitle>
                                        <CardDescription>
                                            {selectedContribution.version} • Derniere modification {new Date(selectedContribution.updated_at).toLocaleDateString()}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {(selectedContribution.collaborators || []).join(", ")}
                                        </Badge>
                                        <Button variant="outline" size="sm">
                                            <UserPlus className="mr-1 h-4 w-4" />
                                            {t("cmdt25.invite", "Inviter")}
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="min-h-[400px] p-4 border rounded-lg bg-muted/30">
                                    <p className="text-muted-foreground text-center py-20">
                                        {t("cmdt25.editorPlaceholder", "Editeur collaboratif en temps reel")}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>Sauvegarde automatique</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline">Enregistrer</Button>
                                        <Button onClick={() => submitMutation.mutate(selectedContribution.id)}>
                                            <Send className="mr-2 h-4 w-4" />
                                            Soumettre a validation
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                <Edit3 className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                <p>Selectionnez un document a editer</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("cmdt25.versionHistory", "Historique des versions")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedContribution ? (
                                <div className="text-sm text-muted-foreground">
                                    <p>Historique pour: {selectedContribution.title}</p>
                                </div>
                            ) : (
                                <p className="text-muted-foreground">Selectionnez un document pour voir l'historique</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}