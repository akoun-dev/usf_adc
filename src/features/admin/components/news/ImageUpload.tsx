import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Image as ImageIcon, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onUploadComplete: (file: File, url: string) => void;
  uploadFunction: (file: File) => Promise<{ url: string }>;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  existingImages?: { url: string; file?: File }[];
}

export function ImageUpload({ 
  onUploadComplete, 
  uploadFunction, 
  maxSize = 5 * 1024 * 1024, 
  accept = 'image/*', 
  multiple = true, // Changed to true by default
  existingImages = [] 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [uploadedImages, setUploadedImages] = useState<{ url: string; file?: File }[]>(existingImages);
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    // Process all files
    for (const file of acceptedFiles) {
      // Validate file exists
      if (!file) {
        setError('Invalid file object');
        continue;
      }
      
      // Validate file size
      if (file.size > maxSize) {
        setError(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
        continue;
      }
      
      // Validate file type
      if (!file.type?.startsWith('image/')) {
        setError('Only image files are allowed');
        continue;
      }
      
      setError(null);
      setUploading(true);
      
      try {
        // Simulate progress (Supabase doesn't provide progress events for direct uploads)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const newProgress = prev + 10;
            return newProgress > 90 ? 90 : newProgress;
          });
        }, 200);
        
        const result = await uploadFunction(file);
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        // Add to uploaded images
        setUploadedImages(prev => [...prev, { url: result.url, file }]);
        onUploadComplete(file, result.url);
        
        setTimeout(() => {
          setUploading(false);
        }, 300);
      } catch (err) {
        setUploading(false);
        setError('Upload failed for some files. Please try again.');
        console.error('Upload error:', err);
      }
    }
  }, [maxSize, uploadFunction, onUploadComplete]);

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    multiple,
    maxSize,
  });

  return (
    <Card className="image-upload-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          {multiple ? 'Upload Images' : 'Upload Featured Image'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all mb-4",
            isDragActive ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300",
            uploading ? "opacity-50 cursor-not-allowed" : ""
          )}
        >
          <input {...getInputProps()} disabled={uploading} />
          <div className="flex flex-col items-center justify-center gap-4">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-500">
              {uploading ? 'Uploading...' : isDragActive ? 
                'Drop the images here' : 
                multiple ? 'Drag & drop images here, or click to browse (multiple files supported)' : 'Drag & drop an image here, or click to browse'}
            </p>
            <p className="text-xs text-gray-400">
              Max size: {(maxSize / 1024 / 1024).toFixed(0)}MB per file
            </p>
            {error && (
              <p className="text-xs text-red-500 mt-2">{error}</p>
            )}
          </div>
        </div>
        
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  {uploading && uploadProgress < 100 ? (
                    <Progress value={uploadProgress} className="h-1" />
                  ) : (
                    <div className="flex items-center justify-center gap-1 text-xs text-white bg-green-500/80 px-2 py-1 rounded">
                      <CheckCircle2 className="h-3 w-3" />
                      Uploaded
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {uploadedImages.length > 0 && (
          <div className="flex justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setUploadedImages([])}
            >
              <Trash2 className="h-3 w-3 mr-2" />
              Remove All Images
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}