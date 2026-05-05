import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import type { InternalMessage } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, Reply, ArrowLeft, MoreVertical } from "lucide-react";
import { getLangValue } from "@/types/i18n";

interface MailDetailProps {
    message: InternalMessage;
    onBack: () => void;
    onDelete: (id: string) => void;
    onReply: (message: InternalMessage) => void;
}

export const MailDetail = ({ message, onBack, onDelete, onReply }: MailDetailProps) => {
    const { t, i18n } = useTranslation();
    const dateLocale = i18n.language === 'fr' ? fr : enUS;

    return (
        <div className="flex flex-col h-full bg-card rounded-lg border shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => onDelete(message.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onReply(message)}>
                            <Reply className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <h2 className="text-2xl font-semibold mb-6">{getLangValue(message.subject, i18n.language) || `(${t('messaging.noSubject')})`}</h2>

                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={message.sender?.avatar_url || ''} />
                            <AvatarFallback>{message.sender?.full_name?.charAt(0) || '?'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{message.sender?.full_name}</span>
                                <span className="text-xs text-muted-foreground">&lt;{message.sender_id}&gt;</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {t('messaging.to')}: {message.recipient?.full_name || message.recipient_id}
                            </div>
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {format(new Date(message.created_at), 'PPPp', { locale: dateLocale })}
                    </div>
                </div>

                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {getLangValue(message.content, i18n.language)}
                </div>
            </div>

            <div className="p-4 border-t bg-muted/20">
                <Button 
                    variant="outline" 
                    className="rounded-full gap-2"
                    onClick={() => onReply(message)}
                >
                    <Reply className="h-4 w-4" />
                    {t('messaging.reply')}
                </Button>
            </div>
        </div>
    );
};
