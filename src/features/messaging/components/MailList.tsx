import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { InternalMessage } from "../types";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Inbox } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getLangValue } from "@/types/i18n";

interface MailListProps {
    messages: InternalMessage[];
    onSelectMessage: (message: InternalMessage) => void;
    selectedMessageId?: string;
    folder: string;
}

export const MailList = ({ messages, onSelectMessage, selectedMessageId, folder }: MailListProps) => {
    const { t, i18n } = useTranslation();
    const dateLocale = i18n.language === 'fr' ? fr : enUS;

    if (messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-2">
                <Inbox className="h-12 w-12 opacity-20" />
                <p>{t(`messaging.empty${folder.charAt(0).toUpperCase() + folder.slice(1)}`)}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col border rounded-lg bg-card overflow-hidden">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    onClick={() => onSelectMessage(msg)}
                    className={cn(
                        "flex items-center gap-4 px-4 py-3 border-b last:border-0 cursor-pointer transition-colors hover:bg-muted/50",
                        !msg.read_at && folder === 'inbox' ? "bg-muted/30 font-semibold" : "",
                        selectedMessageId === msg.id ? "bg-primary/5 border-l-4 border-l-primary" : ""
                    )}
                >
                    <div className="flex items-center gap-2 shrink-0">
                        <Checkbox onClick={(e) => e.stopPropagation()} />
                        <Star className="h-4 w-4 text-muted-foreground hover:text-yellow-400 transition-colors" />
                    </div>

                    <div className="w-48 shrink-0 truncate text-sm">
                        {folder === 'sent' 
                            ? msg.recipient?.full_name || t('messaging.to') + ' ' + (msg.recipient_id || '...')
                            : msg.sender?.full_name || t('messaging.from') + ' ' + (msg.sender_id || '...')
                        }
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="truncate text-sm">{getLangValue(msg.subject, i18n.language) || `(${t('messaging.noSubject')})`}</span>
                            <span className="text-muted-foreground text-sm font-normal truncate">- {getLangValue(msg.content, i18n.language)?.substring(0, 100)}</span>
                        </div>
                    </div>

                    <div className="shrink-0 text-xs text-muted-foreground">
                        {format(new Date(msg.created_at), 'dd MMM', { locale: dateLocale })}
                    </div>
                </div>
            ))}
        </div>
    );
};
