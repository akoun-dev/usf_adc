import { Button } from "@/components/ui/button";
import { Inbox, Send, FileText, Trash2, PenBox } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { MailFolder } from "../types";

interface MailSidebarProps {
    activeFolder: MailFolder;
    onFolderChange: (folder: MailFolder) => void;
    onCompose: () => void;
    unreadCount: number;
}

export const MailSidebar = ({ activeFolder, onFolderChange, onCompose, unreadCount }: MailSidebarProps) => {
    const { t } = useTranslation();

    const folders = [
        { id: 'inbox', label: t('messaging.inbox'), icon: Inbox, count: unreadCount },
        { id: 'sent', label: t('messaging.sent'), icon: Send, count: undefined },
        { id: 'drafts', label: t('messaging.drafts'), icon: FileText, count: undefined },
        { id: 'trash', label: t('messaging.trash'), icon: Trash2, count: undefined },
    ];

    return (
        <div className="flex w-64 flex-col gap-4 pr-4">
            <Button 
                onClick={onCompose}
                className="w-full gap-2 rounded-2xl shadow-md transition-all hover:shadow-lg h-12 text-base"
                size="lg"
            >
                <PenBox className="h-5 w-5" />
                {t('messaging.compose')}
            </Button>

            <nav className="flex flex-col gap-1">
                {folders.map((folder) => (
                    <button
                        key={folder.id}
                        onClick={() => onFolderChange(folder.id)}
                        className={cn(
                            "flex items-center justify-between px-4 py-2 rounded-r-full text-sm font-medium transition-colors hover:bg-muted",
                            activeFolder === folder.id 
                                ? "bg-primary/10 text-primary" 
                                : "text-muted-foreground"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <folder.icon className="h-4 w-4" />
                            {folder.label}
                        </div>
                        {folder.count !== undefined && folder.count > 0 ? (
                            <span className={cn(
                                "text-xs font-bold",
                                activeFolder === folder.id ? "text-primary" : "text-muted-foreground"
                            )}>
                                {folder.count}
                            </span>
                        ) : null}
                    </button>
                ))}
            </nav>
        </div>
    );
};
