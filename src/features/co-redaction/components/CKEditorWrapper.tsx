import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useCallback } from 'react';
import './ckeditor-styles.css';

interface CKEditorWrapperProps {
  content: string;
  onChange: (html: string) => void;
  editable?: boolean;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

export function CKEditorWrapper({
  content,
  onChange,
  editable = true,
  placeholder,
  onImageUpload,
}: CKEditorWrapperProps) {
  
  const handleEditorChange = useCallback((_event: any, editor: any) => {
    const data = editor.getData();
    onChange(data);
  }, [onChange]);

  const customColorPalette = [
    { color: '#1a365d', label: 'Navy' },
    { color: '#2b6cb0', label: 'Blue' },
    { color: '#4a5568', label: 'Gray' },
    { color: '#e53e3e', label: 'Red' },
    { color: '#38a169', label: 'Green' },
    { color: '#d69e2e', label: 'Yellow' },
  ];

  return (
    <div className="ckeditor-wrapper prose-none">
      <CKEditor
        editor={ClassicEditor}
        data={content}
        disabled={!editable}
        config={{
          placeholder: placeholder || 'Commencez à écrire...',
          toolbar: {
            items: [
              'heading',
              '|',
              'bold',
              'italic',
              'link',
              'bulletedList',
              'numberedList',
              '|',
              'outdent',
              'indent',
              '|',
              'imageUpload',
              'blockQuote',
              'insertTable',
              'mediaEmbed',
              'undo',
              'redo',
            ],
          },
          image: {
            toolbar: [
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side',
              '|',
              'toggleImageCaption',
              'imageTextAlternative',
            ],
          },
          table: {
            contentToolbar: [
              'tableColumn',
              'tableRow',
              'mergeTableCells',
            ],
          },
        }}
        onChange={handleEditorChange}
        onReady={(editor) => {
          // Customizing the editor UI
          const toolbarElement = editor.ui.view.toolbar.element;
          if (toolbarElement) {
            toolbarElement.style.border = 'none';
            toolbarElement.style.background = 'transparent';
          }

          // Handle image upload adapter
          if (onImageUpload) {
            editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
              return {
                upload: async () => {
                  const file = await loader.file;
                  const url = await onImageUpload(file);
                  return { default: url };
                },
              };
            };
          }
        }}
      />
    </div>
  );
}
