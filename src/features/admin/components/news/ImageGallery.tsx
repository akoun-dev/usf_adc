import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Image as ImageIcon, Pencil, Trash2, GripVertical, Eye, X, Upload } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface GalleryImage {
  id: string;
  image_url: string;
  caption?: string;
  alt_text?: string;
  sort_order: number;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  onAddImage: (file: File) => Promise<void>;
  onUpdateImage: (id: string, data: { caption?: string; alt_text?: string }) => void;
  onDeleteImage: (id: string) => void;
  onReorder: (images: GalleryImage[]) => void;
  uploadFunction: (file: File) => Promise<{ url: string }>;
}

interface SortableImageProps {
  image: GalleryImage;
  onEdit: (image: GalleryImage) => void;
  onDelete: (id: string) => void;
}

function SortableImage({ image, onEdit, onDelete }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative group">
      <Card className="overflow-hidden">
        <div className="relative aspect-square bg-gray-100">
          <img
            src={image.image_url}
            alt={image.alt_text || 'Gallery image'}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-6 w-6"
              onClick={() => onEdit(image)}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-6 w-6"
              onClick={() => onDelete(image.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <div
            {...listeners}
            className="absolute top-2 left-2 cursor-move text-gray-400 hover:text-gray-600"
          >
            <GripVertical className="h-4 w-4" />
          </div>
        </div>
        <CardContent className="p-2">
          {image.caption && (
            <p className="text-xs text-gray-500 truncate">{image.caption}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function ImageGallery({ 
  images,
  onAddImage,
  onUpdateImage,
  onDeleteImage,
  onReorder,
  uploadFunction
}: ImageGalleryProps) {
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleAddImage = async (file: File) => {
    setUploading(true);
    try {
      await onAddImage(file);
    } catch (error) {
      console.error('Error adding image:', error);
    } finally {
      setUploading(false);
    }
  };
  
  const handleAddMultipleImages = async (files: File[]) => {
    setUploading(true);
    try {
      for (const file of files) {
        await onAddImage(file);
      }
    } catch (error) {
      console.error('Error adding images:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleEditImage = (image: GalleryImage) => {
    setEditingImage(image);
    setIsDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingImage) {
      onUpdateImage(editingImage.id, {
        caption: editingImage.caption,
        alt_text: editingImage.alt_text,
      });
      setIsDialogOpen(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file); // Debug log
      await handleAddImage(file);
    } else {
      console.error('No file selected');
    }
  };

  return (
    <Card className="image-gallery">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Image Gallery
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={uploading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? 'Edit Image' : 'Add New Image'}
              </DialogTitle>
            </DialogHeader>
            {editingImage ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="caption">Caption</Label>
                  <Input
                    id="caption"
                    value={editingImage.caption || ''}
                    onChange={(e) => 
                      setEditingImage({ ...editingImage, caption: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="alt-text">Alt Text (for accessibility)</Label>
                  <Input
                    id="alt-text"
                    value={editingImage.alt_text || ''}
                    onChange={(e) => 
                      setEditingImage({ ...editingImage, alt_text: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSaveEdit}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <label className="flex flex-col items-center justify-center gap-4 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleAddMultipleImages(Array.from(e.target.files));
                        }
                      }}
                      className="sr-only"
                      disabled={uploading}
                      multiple
                    />
                    <Upload className="h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {uploading ? 'Uploading...' : 'Click to upload or drag and drop (multiple files supported)'}
                    </p>
                    <p className="text-xs text-gray-400">
                      Max size: 5MB per file, JPG/PNG recommended
                    </p>
                  </label>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <ImageIcon className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">No images in gallery</p>
            <p className="text-xs mt-1">Add images to create a gallery for this article</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <SortableImage
                key={image.id}
                image={image}
                onEdit={handleEditImage}
                onDelete={onDeleteImage}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}