import { useState } from "react"
import { useTranslation } from "react-i18next"
import PageHero from "@/components/PageHero"
import { GraduationCap, Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTrainings, useCreateTraining, useUpdateTraining, useDeleteTraining } from "../hooks/useTrainings"
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog"
import { TrainingForm } from "../components/TrainingForm"
import { Training } from "../types"
import { toast } from "sonner"
import { getLangValue } from "@/types/i18n"

export default function AdminTrainingManager() {
    const { t, i18n } = useTranslation()
    const { data: trainings, isLoading } = useTrainings('all')
    const createTraining = useCreateTraining()
    const updateTraining = useUpdateTraining()
    const deleteTraining = useDeleteTraining()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingTraining, setEditingTraining] = useState<Training | null>(null)

    const handleOpenCreate = () => {
        setEditingTraining(null)
        setIsDialogOpen(true)
    }

    const handleOpenEdit = (training: Training) => {
        setEditingTraining(training)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (window.confirm(t('common.confirmDelete', 'Voulez-vous vraiment supprimer cette formation ?'))) {
            try {
                await deleteTraining.mutateAsync(id)
                toast.success(t('elearning.trainingDeleted', 'Formation supprimée avec succès'))
            } catch (error) {
                console.error('Error deleting training:', error)
                toast.error(t('common.errorOccurred', 'Une erreur est survenue'))
            }
        }
    }

    const handleSubmit = async (data: Partial<Training>) => {
        try {
            if (editingTraining) {
                await updateTraining.mutateAsync({ id: editingTraining.id, updates: data })
                toast.success(t('elearning.trainingUpdated', 'Formation mise à jour avec succès'))
            } else {
                await createTraining.mutateAsync(data)
                toast.success(t('elearning.trainingCreated', 'Formation créée avec succès'))
            }
            setIsDialogOpen(false)
        } catch (error) {
            console.error('Error saving training:', error)
            toast.error(t('common.errorOccurred', 'Une erreur est survenue'))
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <PageHero 
                    title={t('admin.elearningManagement', 'Gestion des Formations')}
                    description={t('admin.elearningManagementDesc', 'Créez et gérez les sessions de formation.')}
                    icon={<GraduationCap className="h-6 w-6 text-primary" />}
                />
                <Button onClick={handleOpenCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('elearning.addTraining', 'Nouvelle formation')}
                </Button>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-bold">{t('elearning.title', 'Titre')}</TableHead>
                            <TableHead className="font-bold">{t('elearning.type', 'Type')}</TableHead>
                            <TableHead className="font-bold">{t('elearning.startDate', 'Date de début')}</TableHead>
                            <TableHead className="font-bold">{t('elearning.status', 'Statut')}</TableHead>
                            <TableHead className="text-right font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {t('common.loading', 'Chargement...')}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : trainings?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    {t('elearning.noTrainings', 'Aucune formation trouvée.')}
                                </TableCell>
                            </TableRow>
                        ) : (
                            trainings?.map((training) => (
                                <TableRow key={training.id} className="group hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-medium">
                                        {getLangValue(training.title, i18n.language)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="capitalize">
                                            {training.type === 'online' ? t('elearning.online', 'En ligne') : t('elearning.onsite', 'Présentiel')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{training.start_date || '-'}</TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant={training.status === 'published' ? 'default' : training.status === 'draft' ? 'outline' : 'destructive'}
                                            className="capitalize"
                                        >
                                            {t(`elearning.${training.status}`)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => handleOpenEdit(training)}
                                                className="h-8 w-8 text-primary"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => handleDelete(training.id)}
                                                className="h-8 w-8 text-destructive"
                                                disabled={deleteTraining.isPending}
                                            >
                                                {deleteTraining.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingTraining ? t('elearning.editTraining', 'Modifier la formation') : t('elearning.createTraining', 'Créer une formation')}
                        </DialogTitle>
                        <DialogDescription>
                            {t('elearning.formDesc', 'Remplissez les détails ci-dessous pour gérer votre formation.')}
                        </DialogDescription>
                    </DialogHeader>
                    <TrainingForm 
                        initialData={editingTraining || undefined}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsDialogOpen(false)}
                        isSubmitting={createTraining.isPending || updateTraining.isPending}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
