import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents, useCreateEvent, useUpdateEvent, useEventById } from '../hooks/useContentManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { RichTextEditor } from '../components/news/RichTextEditor';
import { ImageUpload } from '../components/news/ImageUpload';
import { ImageGallery } from '../components/news/ImageGallery';
import { StatusBadge } from '../components/news/StatusBadge';
import { Save, ArrowLeft, Calendar, MapPin, Tag, Image as ImageIcon, LayoutGrid, Eye, FileText, Users, DollarSign, Globe } from 'lucide-react';
import { EventStatus as EventStatusType, EventType as EventTypeType } from '../types';

export type EventStatus = EventStatusType;
export type EventType = EventTypeType;

export interface EnhancedEvent {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  location?: string;
  event_type: EventType;
  status: EventStatus;
  max_participants?: number;
  registration_url?: string;
  price?: string;
  image_url?: string;
  organizer?: string;
  is_public: boolean;
  country_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  gallery_images?: { id?: string; image_url: string; caption?: string; alt_text?: string }[];
}

export function EventFormPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('content');

  // Data fetching
  const { data: eventData, isLoading: isEventLoading, error: eventError } = useEventById(id || '');
  const { data: events } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  // Form state
  const [formData, setFormData] = useState<Partial<EnhancedEvent>>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    event_type: 'conference',
    status: 'draft',
    max_participants: 0,
    registration_url: '',
    price: '',
    image_url: '',
    organizer: '',
    is_public: true,
  });

  const [galleryImages, setGalleryImages] = useState<{ id?: string; image_url: string; caption?: string; alt_text?: string }[]>([]);

  // Initialize form with event data
  useEffect(() => {
    if (eventData) {
      setFormData({
        title: eventData.title,
        description: eventData.description || '',
        start_date: eventData.start_date || '',
        end_date: eventData.end_date || '',
        location: eventData.location || '',
        event_type: eventData.event_type || 'conference',
        status: eventData.status || 'draft',
        max_participants: eventData.max_participants || 0,
        registration_url: eventData.registration_url || '',
        price: eventData.price || '',
        image_url: eventData.image_url || '',
        organizer: eventData.organizer || '',
        is_public: eventData.is_public ?? true,
      });
      
      if (eventData.gallery_images) {
        setGalleryImages(eventData.gallery_images);
      }
    }
  }, [eventData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleRichTextChange = (content: string) => {
    setFormData(prev => ({ ...prev, description: content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData = {
        ...formData,
        start_date: formData.start_date,
        end_date: formData.end_date,
        max_participants: formData.max_participants ? Number(formData.max_participants) : null,
        gallery_images: galleryImages,
      };

      if (id) {
        await updateEvent.mutateAsync({ id, ...submitData });
      } else {
        await createEvent.mutateAsync(submitData);
      }
      navigate('/admin/events');
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleUploadImage = async (file: File) => {
    try {
      console.log('Uploading file:', file);
      // TODO: Implement actual image upload for events
      // This is a placeholder - need to implement proper storage upload
      return { url: URL.createObjectURL(file) };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  if (isEventLoading) {
    return (
      <div className="w-full max-w-none" style={{ margin: '-1rem', width: 'calc(100% + 2rem)' }}>
        <div className="p-4 lg:p-6 pt-6 lg:pt-8" style={{ width: '100%' }}>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3">{t('common.loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  if (eventError) {
    return (
      <div className="w-full max-w-none" style={{ margin: '-1rem', width: 'calc(100% + 2rem)' }}>
        <div className="p-4 lg:p-6 pt-6 lg:pt-8" style={{ width: '100%' }}>
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-destructive mb-2">{t('common.error')}</h3>
            <p className="text-destructive/80">
              {eventError.message?.includes('not found') 
                ? t('event.notFound')
                : t('event.loadError')}
            </p>
            <Button 
              onClick={() => navigate('/admin/events')} 
              className="mt-4" 
              variant="outline"
            >
              {t('common.back', 'Retour à la liste')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none" style={{ margin: '-1rem', width: 'calc(100% + 2rem)' }}>
      <div className="p-4 lg:p-6 pt-6 lg:pt-8" style={{ width: '100%' }}>
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/admin/events')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Button>

          <div className="flex items-center gap-4">
            {formData.status && <StatusBadge status={formData.status as EventStatus} />}
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={createEvent.isPending || updateEvent.isPending}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {id ? t('common.update', 'Mettre à jour') : t('common.save', 'Enregistrer')}
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {id ? t('admin.editEvent') : t('admin.createEvent')}
          </h1>
          <p className="text-muted-foreground">
            {id ? t('admin.editEventDesc') : t('admin.createEventDesc')}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 w-full" style={{ width: '100%' }}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 w-full" style={{ width: '100%' }}>
            <TabsTrigger value="content" className="gap-2">
              <FileText className="h-4 w-4" />
              {t('admin.content')}
            </TabsTrigger>
            <TabsTrigger value="details" className="gap-2">
              <Calendar className="h-4 w-4" />
              {t('admin.details')}
            </TabsTrigger>
            <TabsTrigger value="media" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              {t('admin.media')}
            </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              {t('admin.gallery')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Tag className="h-4 w-4" />
              {t('admin.settings')}
            </TabsTrigger>
            <TabsTrigger value="registration" className="gap-2">
              <Users className="h-4 w-4" />
              {t('admin.registration')}
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="h-4 w-4" />
              {t('admin.preview')}
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4" style={{ width: '100%' }}>
              <div>
                <Label htmlFor="title">{t('event.title')}</Label>
                <Input 
                  id="title" 
                  value={formData.title || ''} 
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label>{t('event.description')}</Label>
                <RichTextEditor
                  value={formData.description}
                  onChange={handleRichTextChange}
                  uploadImage={handleUploadImage}
                  placeholder={t('event.writeDescription')}
                />
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4" style={{ width: '100%' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">{t('event.startDate')}</Label>
                  <Input 
                    id="start_date" 
                    type="datetime-local" 
                    value={formData.start_date || ''} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">{t('event.endDate')}</Label>
                  <Input 
                    id="end_date" 
                    type="datetime-local" 
                    value={formData.end_date || ''} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">{t('event.location')}</Label>
                <div className="flex gap-2">
                  <Select 
                    value={formData.location?.startsWith('online') ? 'online' : 'physical'} 
                    onValueChange={(value) => {
                      setFormData(prev => ({
                        ...prev,
                        location: value === 'online' ? 'online' : ''
                      }));
                    }}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder={t('event.locationType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">{t('event.online')}</SelectItem>
                      <SelectItem value="physical">{t('event.physical')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    id="location" 
                    value={formData.location?.startsWith('online') ? '' : formData.location || ''} 
                    onChange={handleInputChange}
                    placeholder={t('event.locationPlaceholder', 'Ex: Dakar, Sénégal')}
                    disabled={formData.location?.startsWith('online')}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="organizer">{t('event.organizer')}</Label>
                <Input 
                  id="organizer" 
                  value={formData.organizer || ''} 
                  onChange={handleInputChange}
                  placeholder={t('event.organizerPlaceholder')}
                />
              </div>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-4" style={{ width: '100%' }}>
              <div>
                <Label>{t('event.featuredImage')}</Label>
                <ImageUpload
                  onUploadComplete={(file, url) => {
                    setFormData(prev => ({ ...prev, image_url: url }));
                  }}
                  uploadFunction={handleUploadImage}
                  multiple={false}
                  existingImages={formData.image_url ? [{ url: formData.image_url }] : []}
                />
              </div>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" style={{ width: '100%' }}>
              <ImageGallery
                images={galleryImages}
                onAddImage={async (file) => {
                  try {
                    const result = await handleUploadImage(file);
                    setGalleryImages(prev => [...prev, {
                      image_url: result.url,
                      caption: '',
                      alt_text: ''
                    }]);
                  } catch (error) {
                    console.error('Error adding gallery image:', error);
                  }
                }}
                onUpdateImage={(id, data) => {
                  setGalleryImages(prev => prev.map(img => 
                    img.id === id ? { ...img, ...data } : img
                  ));
                }}
                onDeleteImage={(id) => {
                  setGalleryImages(prev => prev.filter(img => img.id !== id));
                }}
                onReorder={(newOrder) => {
                  setGalleryImages(newOrder);
                }}
                uploadFunction={handleUploadImage}
              />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4" style={{ width: '100%' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event_type">{t('event.eventType')}</Label>
                  <Select 
                    value={formData.event_type || 'conference'} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, event_type: value as EventType }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conference">{t('event.conference')}</SelectItem>
                      <SelectItem value="webinar">{t('event.webinar')}</SelectItem>
                      <SelectItem value="workshop">{t('event.workshop')}</SelectItem>
                      <SelectItem value="training">{t('event.training')}</SelectItem>
                      <SelectItem value="meeting">{t('event.meeting')}</SelectItem>
                      <SelectItem value="other">{t('event.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">{t('event.status')}</Label>
                  <Select 
                    value={formData.status || 'draft'} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as EventStatus }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">{t('event.draft')}</SelectItem>
                      <SelectItem value="in_review">{t('event.inReview')}</SelectItem>
                      <SelectItem value="published">{t('event.published')}</SelectItem>
                      <SelectItem value="archived">{t('event.archived')}</SelectItem>
                      <SelectItem value="cancelled">{t('event.cancelled')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max_participants">{t('event.maxParticipants')}</Label>
                  <Input 
                    id="max_participants" 
                    type="number" 
                    value={formData.max_participants || 0} 
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="price">{t('event.price')}</Label>
                  <div className="flex gap-2">
                    <Select 
                      value={formData.price === 'gratuit' || formData.price === 'free' ? 'free' : 'paid'} 
                      onValueChange={(value) => {
                        setFormData(prev => ({
                          ...prev,
                          price: value === 'free' ? 'gratuit' : ''
                        }));
                      }}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder={t('event.priceType')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">{t('event.free')}</SelectItem>
                        <SelectItem value="paid">{t('event.paid')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      id="price" 
                      value={formData.price === 'gratuit' || formData.price === 'free' ? '' : formData.price || ''} 
                      onChange={handleInputChange}
                      placeholder={t('event.pricePlaceholder', 'Ex: 50000 FCFA')}
                      disabled={formData.price === 'gratuit' || formData.price === 'free'}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox 
                  id="is_public" 
                  checked={formData.is_public || false} 
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: !!checked }))}
                />
                <Label htmlFor="is_public">{t('event.isPublic')}</Label>
              </div>
            </TabsContent>

            {/* Registration Tab */}
            <TabsContent value="registration" className="space-y-4" style={{ width: '100%' }}>
              <div>
                <Label htmlFor="registration_url">{t('event.registrationUrl', "URL d'inscription")}</Label>
                <Input 
                  id="registration_url" 
                  value={formData.registration_url || ''} 
                  onChange={handleInputChange}
                  placeholder={t('event.registrationUrlPlaceholder', 'https://...')}
                />
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{t('event.registrationManagement')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('event.registrationManagementDesc')}
                </p>
              </div>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" style={{ width: '100%' }}>
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">{t('admin.eventPreview')}</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">{t('event.title', 'Titre')}</h4>
                    <p>{formData.title || t('common.notAvailable', '-')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">{t('event.description', 'Description')}</h4>
                    <div>{formData.description || t('common.notAvailable', '-')}</div>
                  </div>
                  <div>
                    <h4 className="font-medium">{t('event.details')}</h4>
                    <p><strong>{t('event.startDate', 'Début')}: </strong>{formData.start_date ? new Date(formData.start_date).toLocaleString() : t('common.notAvailable', '-')}</p>
                    <p><strong>{t('event.endDate', 'Fin')}: </strong>{formData.end_date ? new Date(formData.end_date).toLocaleString() : t('common.notAvailable', '-')}</p>
                    <p><strong>{t('event.location')}: </strong>{formData.location || t('common.notAvailable', '-')}</p>
                    <p><strong>{t('event.organizer')}: </strong>{formData.organizer || t('common.notAvailable', '-')}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Fixed save button */}
            <div className="fixed bottom-4 right-4 z-50">
              <Button 
                type="submit" 
                size="lg" 
                className="gap-2 shadow-lg"
                disabled={createEvent.isPending || updateEvent.isPending}
              >
                <Save className="h-4 w-4" />
                {id ? t('common.update', 'Mettre à jour') : t('common.save', 'Enregistrer')}
              </Button>
            </div>
          </form>
        </Tabs>
      </div>
    </div>
  );
}