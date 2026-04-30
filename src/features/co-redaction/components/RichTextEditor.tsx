/**
 * Éditeur de texte riche basé sur TipTap
 * Utilisé pour l'édition collaborative de documents
 */
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { useCallback, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  RemoveFormatting,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

// Extension underline custom (TipTap n'inclut pas Underline par défaut)
import { Extension } from '@tiptap/core';
import TextStyle from '@tiptap/extension-text-style';

const UnderlineExtension = Extension.create({
  name: 'underline',
  addOptions() {
    return { HTMLAttributes: {} };
  },
  parseHTML() {
    return [{ tag: 'u' }, { style: 'text-decoration=underline' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['u', HTMLAttributes, 0];
  },
  addCommands() {
    return {
      setUnderline: () => ({ commands }) => {
        return commands.setMark('underline');
      },
      toggleUnderline: () => ({ commands }) => {
        return commands.toggleMark('underline');
      },
      unsetUnderline: () => ({ commands }) => {
        return commands.unsetMark('underline');
      },
    };
  },
  addKeyboardShortcuts() {
    return {
      'Mod-u': () => this.editor.commands.toggleUnderline(),
      'Mod-U': () => this.editor.commands.toggleUnderline(),
    };
  },
});

// Extension pour l'alignement
const TextAlignExtension = Extension.create({
  name: 'textAlign',
  addOptions() {
    return { types: ['heading', 'paragraph'] };
  },
  addCommands() {
    return {
      setTextAlign: (align: string) => ({ commands }) => {
        return commands.updateAttributes('paragraph', { style: `text-align: ${align}` });
      },
    };
  },
});

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

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextStyle,
      UnderlineExtension,
      TextAlignExtension,
      Image.configure({
        HTMLAttributes: { class: 'max-w-full h-auto rounded-lg' },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline cursor-pointer' },
      }),
      Placeholder.configure({
        placeholder: placeholder || t('coRedaction.editorPlaceholder', 'Commencez à écrire...'),
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-8 py-6',
      },
    },
  });

  // Sync content from outside
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleImageUpload = useCallback(() => {
    if (!onImageUpload || !editor) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const url = await onImageUpload(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch {
        // Error handled by parent
      }
    };
    input.click();
  }, [editor, onImageUpload]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
    tooltip,
    disabled = false,
  }: {
    onClick: () => void;
    isActive?: boolean;
    icon: React.ElementType;
    tooltip: string;
    disabled?: boolean;
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 w-8 p-0',
            isActive && 'bg-primary/10 text-primary'
          )}
          onClick={onClick}
          disabled={disabled}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn('rounded-lg border bg-background', className)}>
        {/* Toolbar */}
        {editable && (
          <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b bg-background/95 backdrop-blur p-2">
            {/* Undo / Redo */}
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              icon={Undo}
              tooltip={t('coRedaction.undo', 'Annuler')}
              disabled={!editor.can().undo()}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              icon={Redo}
              tooltip={t('coRedaction.redo', 'Rétablir')}
              disabled={!editor.can().redo()}
            />

            <div className="mx-1 h-6 w-px bg-border" />

            {/* Headings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-xs">{t('coRedaction.heading', 'Titre')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
                  <span>Paragraphe</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                  <Heading1 className="mr-2 h-4 w-4" /> Titre 1
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                  <Heading2 className="mr-2 h-4 w-4" /> Titre 2
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                  <Heading3 className="mr-2 h-4 w-4" /> Titre 3
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="mx-1 h-6 w-px bg-border" />

            {/* Text formatting */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              icon={Bold}
              tooltip="Gras (Ctrl+B)"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              icon={Italic}
              tooltip="Italique (Ctrl+I)"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline?.()}
              isActive={editor.isActive('underline')}
              icon={Underline}
              tooltip="Souligné (Ctrl+U)"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              icon={Strikethrough}
              tooltip="Barré"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive('code')}
              icon={Code}
              tooltip="Code"
            />

            <div className="mx-1 h-6 w-px bg-border" />

            {/* Lists */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              icon={List}
              tooltip="Liste à puces"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              icon={ListOrdered}
              tooltip="Liste numérotée"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              icon={Quote}
              tooltip="Citation"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              icon={Minus}
              tooltip="Ligne horizontale"
            />

            <div className="mx-1 h-6 w-px bg-border" />

            {/* Table */}
            <ToolbarButton
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              icon={TableIcon}
              tooltip="Insérer un tableau"
            />

            <div className="mx-1 h-6 w-px bg-border" />

            {/* Link & Image */}
            <ToolbarButton
              onClick={addLink}
              isActive={editor.isActive('link')}
              icon={LinkIcon}
              tooltip="Lien"
            />
            {onImageUpload && (
              <ToolbarButton
                onClick={handleImageUpload}
                icon={ImageIcon}
                tooltip="Image"
              />
            )}

            <div className="mx-1 h-6 w-px bg-border" />

            {/* Clear formatting */}
            <ToolbarButton
              onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
              icon={RemoveFormatting}
              tooltip="Effacer la mise en forme"
            />
          </div>
        )}

        {/* Bubble Menu for quick formatting */}
        {editable && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className="flex items-center gap-0.5 rounded-lg border bg-background p-1 shadow-lg">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                icon={Bold}
                tooltip="Gras"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                icon={Italic}
                tooltip="Italique"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline?.()}
                isActive={editor.isActive('underline')}
                icon={Underline}
                tooltip="Souligné"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                icon={Strikethrough}
                tooltip="Barré"
              />
            </div>
          </BubbleMenu>
        )}

        {/* Editor Content */}
        <EditorContent
          editor={editor}
          className="co-redaction-editor"
        />
      </div>
    </TooltipProvider>
  );
}
