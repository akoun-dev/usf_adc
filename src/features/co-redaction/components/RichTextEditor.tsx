/**
 * Éditeur de texte riche basé sur CKEditor 5
 * Utilisé pour l'édition collaborative de documents
 */
import { CKEditorWrapper } from './CKEditorWrapper';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  editable?: boolean;
  placeholder?: string;
  className?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

export function RichTextEditor({
  content,
  onChange,
  editable = true,
  placeholder,
  className,
  onImageUpload,
}: RichTextEditorProps) {
  const { t } = useTranslation();

  return (
    <div className={cn('relative w-full', className)}>
      <CKEditorWrapper
        content={content}
        onChange={onChange}
        editable={editable}
        placeholder={placeholder || t('coRedaction.editorPlaceholder', 'Commencez à écrire...')}
        onImageUpload={onImageUpload}
      />
    </div>
  );
}
