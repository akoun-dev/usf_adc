import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, Tag, Image as ImageIcon, Globe, User } from 'lucide-react';
import { NewsStatus, EnhancedNewsArticle } from '../../types';

interface ArticlePreviewProps {
  article: Partial<EnhancedNewsArticle>;
  onPublish?: () => void;
  onSaveDraft?: () => void;
}

const statusColors: Record<NewsStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  in_review: 'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-yellow-100 text-yellow-800',
};

const statusLabels: Record<NewsStatus, string> = {
  draft: 'Draft',
  in_review: 'In Review',
  published: 'Published',
  archived: 'Archived',
};

export function ArticlePreview({ article, onPublish, onSaveDraft }: ArticlePreviewProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="article-preview">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Article Preview</CardTitle>
          <div className="flex items-center gap-2">
            {article.status && (
              <Badge className={statusColors[article.status] || 'bg-gray-100'}>
                {statusLabels[article.status]}
              </Badge>
            )}
            {article.is_public && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Public
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Featured Image */}
        {article.featured_image && (
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={article.featured_image}
              alt={article.title || 'Article featured image'}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              <ImageIcon className="h-3 w-3 inline mr-1" />
              Featured Image
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold mb-2">{article.title || 'Untitled Article'}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {article.author && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{article.author}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(article.published_at)}</span>
            </div>
            {article.read_time && (
              <span>{article.read_time} read</span>
            )}
          </div>
        </div>

        {/* Category and Tags */}
        <div className="flex flex-wrap gap-2">
          {article.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {article.category}
            </Badge>
          )}
          {article.meta_keywords && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {article.meta_keywords}
            </Badge>
          )}
        </div>

        {/* Excerpt */}
        {article.excerpt && (
          <div className="prose max-w-none">
            <p className="text-gray-600 italic">{article.excerpt}</p>
          </div>
        )}

        {/* Content Preview */}
        {article.content && (
          <div className="prose max-w-none border-t pt-4">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        )}

        {/* SEO Info */}
        <div className="border-t pt-4 space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Eye className="h-4 w-4" />
            SEO Information
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            {article.meta_description && (
              <div>
                <strong>Meta Description:</strong> {article.meta_description}
              </div>
            )}
            {article.slug && (
              <div>
                <strong>Slug:</strong> {article.slug}
              </div>
            )}
            {article.language && (
              <div>
                <strong>Language:</strong> {article.language.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t pt-4 flex justify-end gap-2">
          {onSaveDraft && (
            <Button variant="outline" onClick={onSaveDraft}>
              Save as Draft
            </Button>
          )}
          {onPublish && (
            <Button onClick={onPublish}>
              {article.status === 'published' ? 'Update' : 'Publish'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}