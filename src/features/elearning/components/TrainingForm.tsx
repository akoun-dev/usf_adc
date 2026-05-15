import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Training } from '../types';
import { Loader2, Save, Languages } from 'lucide-react';
import { translateToFourLang } from '@/features/admin/services/translate.service';
import { toast } from 'sonner';

interface TrainingFormProps {
    initialData?: Partial<Training>;
    onSubmit: (data: Partial<Training>) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

export function TrainingForm({ initialData, onSubmit, onCancel, isSubmitting }: TrainingFormProps) {
    const { t } = useTranslation();
    const [currentLang, setCurrentLang] = useState('fr');
    const [isTranslating, setIsTranslating] = useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Partial<Training>>({
        defaultValues: {
            title: initialData?.title || { fr: '', en: '', pt: '', ar: '' },
            description: initialData?.description || { fr: '', en: '', pt: '', ar: '' },
            type: initialData?.type || 'online',
            start_date: initialData?.start_date || '',
            end_date: initialData?.end_date || '',
            trainer: initialData?.trainer || '',
            capacity: initialData?.capacity || 0,
            location: initialData?.location || '',
            status: initialData?.status || 'draft',
            image_url: initialData?.image_url || '',
        }
    });

    const currentType = watch('type');
    const currentStatus = watch('status');
    const formData = watch();

    const handleTranslate = async () => {
        try {
            const currentTitle = formData.title?.[currentLang];
            const currentDesc = formData.description?.[currentLang];

            if (!currentTitle && !currentDesc) {
                toast.error(t('admin.noContentToTranslate', 'Aucun contenu à traduire'));
                return;
            }

            setIsTranslating(true);
            toast.info(t('admin.translating', 'Traduction en cours...'));

            if (currentTitle) {
                const translatedTitle = await translateToFourLang(currentLang, currentTitle);
                setValue('title', translatedTitle);
            }
            if (currentDesc) {
                const translatedDesc = await translateToFourLang(currentLang, currentDesc);
                setValue('description', translatedDesc);
            }

            toast.success(t('admin.translationSuccess', 'Traduction terminée'));
        } catch (error) {
            console.error('Translation error:', error);
            toast.error(t('admin.translationError', 'Erreur lors de la traduction'));
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid gap-4">
                <div className="flex justify-between items-center bg-muted/30 p-2 rounded-md mb-2">
                    <Tabs value={currentLang} onValueChange={setCurrentLang} className="w-auto">
                        <TabsList>
                            <TabsTrigger value="fr">Français</TabsTrigger>
                            <TabsTrigger value="en">English</TabsTrigger>
                            <TabsTrigger value="pt">Português</TabsTrigger>
                            <TabsTrigger value="ar">العربية</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleTranslate} 
                        disabled={isTranslating}
                        className="flex items-center gap-2"
                    >
                        {isTranslating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
                        {t('admin.autoTranslate', 'Traduire automatiquement')}
                    </Button>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="title">{t('elearning.title', 'Titre de la formation')} ({currentLang.toUpperCase()})</Label>
                    <Input
                        id="title"
                        value={formData.title?.[currentLang] || ''}
                        onChange={(e) => setValue(`title.${currentLang}`, e.target.value)}
                        placeholder="Ex: Introduction à la cybersécurité"
                    />
                    {!formData.title?.fr && currentLang === 'fr' && <p className="text-sm text-destructive">{t('common.required', 'Champ requis')}</p>}
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
                    <Label htmlFor="image_url">{t('elearning.imageUrl', 'URL de l\'image')}</Label>
                    <Input
                        id="image_url"
                        {...register('image_url')}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">{t('elearning.description', 'Description')} ({currentLang.toUpperCase()})</Label>
                    <Textarea
                        id="description"
                        value={formData.description?.[currentLang] || ''}
                        onChange={(e) => setValue(`description.${currentLang}`, e.target.value)}
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
