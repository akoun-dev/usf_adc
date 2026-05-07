import { useTranslation } from "react-i18next"
import PageHero from "@/components/PageHero"
import { GraduationCap, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTrainings } from "../hooks/useTrainings"
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AdminTrainingManager() {
    const { t } = useTranslation()
    const { data: trainings, isLoading } = useTrainings('all')

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <PageHero 
                    title={t('admin.eventsManagement', 'Gestion des Formations')}
                    description={t('admin.eventsManagementDesc', 'Créez et gérez les sessions de formation.')}
                    icon={<GraduationCap className="h-6 w-6 text-primary" />}
                />
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('elearning.addTraining', 'Nouvelle formation')}
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('elearning.title')}</TableHead>
                            <TableHead>{t('elearning.type')}</TableHead>
                            <TableHead>{t('elearning.startDate')}</TableHead>
                            <TableHead>{t('elearning.status')}</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trainings?.map((training) => (
                            <TableRow key={training.id}>
                                <TableCell className="font-medium">{training.title}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{t(`elearning.${training.type}`)}</Badge>
                                </TableCell>
                                <TableCell>{training.start_date}</TableCell>
                                <TableCell>
                                    <Badge>{training.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">{t('common.edit')}</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
