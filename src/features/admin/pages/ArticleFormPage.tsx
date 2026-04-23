import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useNewsById, useCreateNews, useUpdateNews, useNewsCategories, useUploadNewsImage } from '../hooks/useContentManagement';
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
import { ArticlePreview } from '../components/news/ArticlePreview';
import { StatusBadge } from '../components/news/StatusBadge';
import { Save, ArrowLeft, Globe, Languages, Tag, Image as ImageIcon, LayoutGrid, Eye, FileText } from 'lucide-react';
import { EnhancedNewsArticle, NewsCategory, NewsStatus } from '../types';

export function ArticleFormPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('content');
  const [language, setLanguage] = useState('fr');
  
  // Data fetching
  const { data: article, isLoading: isArticleLoading } = useNewsById(id || '');
  const { data: categories } = useNewsCategories();
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const uploadImage = useUploadNewsImage();
  
  // Form state
  const [formData, setFormData] = useState<Partial<EnhancedNewsArticle>>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    source: '',
    status: 'draft',
    meta_description: '',
    meta_keywords: '',
    slug: '',
    sort_order: 0,
    is_featured: false,
    allow_comments: true,
    language: 'fr',
    is_public: false,
  });
  
  const [galleryImages, setGalleryImages] = useState<{ id?: string; image_url: string; caption?: string; alt_text?: string }[]>([]);
  
  // Initialize form with article data
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        excerpt: article.excerpt || '',
        content: article.content || '',
        category: article.category || '',
        source: article.source || '',
        image_url: article.image_url || '',
        featured_image: article.featured_image || '',
        status: article.status || 'draft',
        meta_description: article.meta_description || '',
        meta_keywords: article.meta_keywords || '',
        slug: article.slug || '',
        sort_order: article.sort_order || 0,
        is_featured: article.is_featured || false,
        allow_comments: article.allow_comments || true,
        language: article.language || 'fr',
        is_public: article.is_public || false,
      });
    }
  }, [article]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const handleRichTextChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };
  
  const handleImageUpload = async (file: File, url: string) => {
    setFormData(prev => ({ ...prev, featured_image: url }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (id) {
        await updateNews.mutateAsync({ id, ...formData });
      } else {
        await createNews.mutateAsync(formData);
      }
      navigate('/admin/news');
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };
  
  const handleUploadImage = async (file: File) => {
    try {
      console.log('Uploading file:', file); // Debug log
      if (!file) {
        throw new Error('No file provided');
      }
      const result = await uploadImage.mutateAsync({
        file,
        bucketName: 'article-images',
        newsId: id || 'temp'
      });
      return { url: result.url };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };
  
  return (
    <div className="w-full max-w-none" style={{ margin: '-1rem', width: 'calc(100% + 2rem)' }}>
      <div className="p-4 lg:p-6 pt-6 lg:pt-8" style={{ width: '100%' }}>
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/admin/news')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('common.back', 'Retour')}
          </Button>
          
          <div className="flex items-center gap-4">
            {formData.status && <StatusBadge status={formData.status as NewsStatus} />}
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={createNews.isPending || updateNews.isPending}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {id ? t('common.update', 'Mettre à jour') : t('common.save', 'Enregistrer')}
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {id ? t('admin.editArticle', 'Modifier l\'article') : t('admin.createArticle', 'Créer un nouvel article')}
          </h1>
          <p className="text-muted-foreground">
            {id ? t('admin.editArticleDesc', 'Modifiez les détails de votre article') : t('admin.createArticleDesc', 'Créez un nouvel article avec un contenu riche et des images')}
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 w-full" style={{ width: '100%' }}>
            <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 w-full" style={{ width: '100%' }}>
              <TabsTrigger value="content" className="gap-2">
                <FileText className="h-4 w-4" />
                {t('admin.content', 'Contenu')}
              </TabsTrigger>
              <TabsTrigger value="seo" className="gap-2">
                <Eye className="h-4 w-4" />
                SEO
              </TabsTrigger>
              <TabsTrigger value="media" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                {t('admin.media', 'Médias')}
              </TabsTrigger>
              <TabsTrigger value="gallery" className="gap-2">
                <LayoutGrid className="h-4 w-4" />
                {t('admin.gallery', 'Galerie')}
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Tag className="h-4 w-4" />
                {t('admin.settings', 'Paramètres')}
              </TabsTrigger>
              <TabsTrigger value="translations" className="gap-2">
                <Languages className="h-4 w-4" />
                {t('admin.translations', 'Traductions')}
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="h-4 w-4" />
                {t('admin.preview', 'Aperçu')}
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Content Tab */}
              <TabsContent value="content" className="space-y-4" style={{ width: '100%' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">{t('news.title', 'Titre')}</Label>
                    <Input 
                      id="title" 
                      value={formData.title || ''} 
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">{t('news.slug', 'Slug')}</Label>
                    <Input 
                      id="slug" 
                      value={formData.slug || ''} 
                      onChange={handleInputChange}
                      placeholder="article-title"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="excerpt">{t('news.excerpt', 'Extrait')}</Label>
                  <Textarea 
                    id="excerpt" 
                    value={formData.excerpt || ''} 
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Brève description de l'article..."
                  />
                </div>
                
                <div>
                  <Label>{t('news.content', 'Contenu principal')}</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={handleRichTextChange}
                    uploadImage={handleUploadImage}
                    placeholder={t('news.writeContent', 'Écrivez le contenu de votre article ici...')}
                  />
                </div>
              </TabsContent>
              
              {/* SEO Tab */}
              <TabsContent value="seo" className="space-y-4" style={{ width: '100%' }}>
                <div>
                  <Label htmlFor="meta_description">{t('news.metaDescription', 'Meta Description')}</Label>
                  <Textarea 
                    id="meta_description" 
                    value={formData.meta_description || ''} 
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Description pour le SEO (160 caractères max)..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="meta_keywords">{t('news.metaKeywords', 'Meta Keywords')}</Label>
                  <Input 
                    id="meta_keywords" 
                    value={formData.meta_keywords || ''} 
                    onChange={handleInputChange}
                    placeholder="mot-clé1, mot-clé2, mot-clé3"
                  />
                </div>
              </TabsContent>
              
              {/* Media Tab */}
              <TabsContent value="media" className="space-y-4" style={{ width: '100%' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t('news.featuredImage', 'Image à la une')}</Label>
                    <ImageUpload
                      onUploadComplete={(file, url) => {
                        setFormData(prev => ({ ...prev, featured_image: url }));
                      }}
                      uploadFunction={handleUploadImage}
                      multiple={false}
                      existingImages={formData.featured_image ? [{ url: formData.featured_image }] : []}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image_url">{t('news.additionalImage', 'Image supplémentaire')}</Label>
                    <Input 
                      id="image_url" 
                      value={formData.image_url || ''} 
                      onChange={handleInputChange}
                      placeholder="https://..."
                    />
                  </div>
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
                    <Label htmlFor="category">{t('news.category', 'Catégorie')}</Label>
                    <Select 
                      value={formData.category || ''} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('news.selectCategory', 'Sélectionner une catégorie')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((cat: NewsCategory) => (
                          <SelectItem key={cat.id} value={cat.name_fr}>{cat.name_fr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="source">{t('news.source', 'Source')}</Label>
                    <Input 
                      id="source" 
                      value={formData.source || ''} 
                      onChange={handleInputChange}
                      placeholder="ANSUT, UAT, etc."
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">{t('news.status', 'Statut')}</Label>
                    <Select 
                      value={formData.status || 'draft'} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as NewsStatus }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">{t('news.draft', 'Brouillon')}</SelectItem>
                        <SelectItem value="in_review">{t('news.inReview', 'En révision')}</SelectItem>
                        <SelectItem value="published">{t('news.published', 'Publié')}</SelectItem>
                        <SelectItem value="archived">{t('news.archived', 'Archivé')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="language">{t('news.language', 'Langue')}</Label>
                    <Select 
                      value={formData.language || 'fr'} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">{t('common.french', 'Français')}</SelectItem>
                        <SelectItem value="en">{t('common.english', 'Anglais')}</SelectItem>
                        <SelectItem value="pt">{t('common.portuguese', 'Português')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="is_public" 
                      checked={formData.is_public || false} 
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: !!checked }))}
                    />
                    <Label htmlFor="is_public">{t('news.isPublic', 'Public')}</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="is_featured" 
                      checked={formData.is_featured || false} 
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: !!checked }))}
                    />
                    <Label htmlFor="is_featured">{t('news.isFeatured', 'À la une')}</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="allow_comments" 
                      checked={formData.allow_comments || true} 
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allow_comments: !!checked }))}
                    />
                    <Label htmlFor="allow_comments">{t('news.allowComments', 'Autoriser les commentaires')}</Label>
                  </div>
                </div>
              </TabsContent>
              
              {/* Translations Tab */}
              <TabsContent value="translations" style={{ width: '100%' }}>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">{t('admin.translations', 'Traductions')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('admin.translationsDesc', 'Gérez les traductions de cet article dans différentes langues')}
                  </p>
                  <div className="border rounded-lg p-6">
                    <p className="text-center text-gray-500 py-8">
                      {t('admin.translationsComingSoon', 'La gestion des traductions sera implémentée prochainement')}
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              {/* Preview Tab */}
              <TabsContent value="preview" style={{ width: '100%' }}>
                <ArticlePreview 
                  article={formData} 
                  onPublish={handleSubmit}
                  onSaveDraft={handleSubmit}
                />
              </TabsContent>
              
              {/* Fixed save button */}
              <div className="fixed bottom-4 right-4 z-50">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="gap-2 shadow-lg"
                  disabled={createNews.isPending || updateNews.isPending}
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