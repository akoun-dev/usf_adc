import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Training } from '../types';
import { Loader2, Save } from 'lucide-react';

interface TrainingFormProps {
    initialData?: Partial<Training>;
    onSubmit: (data: Partial<Training>) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

export function TrainingForm({ initialData, onSubmit, onCancel, isSubmitting }: TrainingFormProps) {
    const { t } = useTranslation();
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Partial<Training>>({
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            type: initialData?.type || 'online',
            start_date: initialData?.start_date || '',
            end_date: initialData?.end_date || '',
            trainer: initialData?.trainer || '',
            capacity: initialData?.capacity || 0,
            location: initialData?.location || '',
            status: initialData?.status || 'draft',
        }
    });

    const currentType = watch('type');
    const currentStatus = watch('status');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">{t('elearning.title', 'Titre de la formation')}</Label>
                    <Input
                        id="title"
                        {...register('title', { required: true })}
                        placeholder="Ex: Introduction à la cybersécurité"
                    />
                    {errors.title && <span className="text-xs text-destructive">{t('common.required', 'Ce champ est requis')}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">{t('elearning.type', 'Type')}</Label>
                        <Select 
                            value={currentType} 
                            onValueChange={(v) => setValue('type', v as 'online' | 'onsite')}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="online">{t('elearning.online', 'En ligne')}</SelectItem>
                                <SelectItem value="onsite">{t('elearning.onsite', 'Présentiel')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">{t('elearning.status', 'Statut')}</Label>
                        <Select 
                            value={currentStatus} 
                            onValueChange={(v) => setValue('status', v as 'draft' | 'published' | 'archived')}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">{t('elearning.draft', 'Brouillon')}</SelectItem>
                                <SelectItem value="published">{t('elearning.published', 'Publié')}</SelectItem>
                                <SelectItem value="archived">{t('elearning.archived', 'Archivé')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="start_date">{t('elearning.startDate', 'Date de début')}</Label>
                        <Input
                            id="start_date"
                            type="date"
                            {...register('start_date')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="end_date">{t('elearning.endDate', 'Date de fin')}</Label>
                        <Input
                            id="end_date"
                            type="date"
                            {...register('end_date')}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="trainer">{t('elearning.trainer', 'Formateur')}</Label>
                        <Input
                            id="trainer"
                            {...register('trainer')}
                            placeholder="Nom du formateur"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="capacity">{t('elearning.capacity', 'Capacité')}</Label>
                        <Input
                            id="capacity"
                            type="number"
                            {...register('capacity', { valueAsNumber: true })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location">{t('elearning.location', 'Lieu')}</Label>
                    <Input
                        id="location"
                        {...register('location')}
                        placeholder={currentType === 'online' ? 'Lien de la réunion' : 'Adresse physique'}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">{t('elearning.description', 'Description')}</Label>
                    <Textarea
                        id="description"
                        {...register('description')}
                        rows={4}
                        placeholder="Description détaillée de la formation..."
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    {t('common.cancel', 'Annuler')}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {initialData ? t('common.update', 'Mettre à jour') : t('common.create', 'Créer')}
                </Button>
            </div>
        </form>
    );
}
