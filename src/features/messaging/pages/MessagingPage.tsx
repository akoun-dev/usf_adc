import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MailSidebar } from "../components/MailSidebar";
import { MailList } from "../components/MailList";
import { MailDetail } from "../components/MailDetail";
import { MailCompose } from "../components/MailCompose";
import { useMessages, useSendMessage, useSaveDraft, useUnreadMessages, useMarkAsRead, useDeleteMessage } from "../hooks/useMessaging";
import type { MailFolder, InternalMessage } from "../types";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { getLangValue } from "@/types/i18n";

export default function MessagingPage() {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const [activeFolder, setActiveFolder] = useState<MailFolder>('inbox');
    const [selectedMessage, setSelectedMessage] = useState<InternalMessage | null>(null);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [composeInitialData, setComposeInitialData] = useState<any>(null);

    const { data: messages = [], isLoading } = useMessages(activeFolder);
    const { data: unreadCount = 0 } = useUnreadMessages();

    const sendMessage = useSendMessage();
    const saveDraft = useSaveDraft();
    const markAsRead = useMarkAsRead();
    const deleteMessage = useDeleteMessage();

    const filteredMessages = messages.filter(m =>
        getLangValue(m.subject, i18n.language).toLowerCase().includes(searchQuery.toLowerCase()) ||
        getLangValue(m.content, i18n.language).toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.sender?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.recipient?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectMessage = (message: InternalMessage) => {
        if (message.status === 'draft') {
            setComposeInitialData({
                id: message.id,
                recipient_id: message.recipient_id || "",
                subject: getLangValue(message.subject, i18n.language),
                content: getLangValue(message.content, i18n.language)
            });
            setIsComposeOpen(true);
            return;
        }

        setSelectedMessage(message);
        if (!message.read_at && activeFolder === 'inbox') {
            markAsRead.mutate(message.id);
        }
    };

    const handleReply = (message: InternalMessage) => {
        const translatedSubject = getLangValue(message.subject, i18n.language);
        const translatedContent = getLangValue(message.content, i18n.language);

        setComposeInitialData({
            recipient_id: message.sender_id,
            subject: `Re: ${translatedSubject}`,
            content: `\n\n--- ${t('messaging.from')} ${message.sender?.full_name} ---\n${translatedContent}`
        });
        setIsComposeOpen(true);
    };

    const handleDelete = (id: string) => {
        const msg = messages.find(m => m.id === id);
        if (!msg) return;

        deleteMessage.mutate({
            id,
            asSender: msg.sender_id === user?.id
        });
        setSelectedMessage(null);
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-2">
            <div className="bg-gray-100 p-5 rounded-xl">
                <MailSidebar
                    activeFolder={activeFolder}
                    onFolderChange={(f) => {
                        setActiveFolder(f);
                        setSelectedMessage(null);
                    }}
                    onCompose={() => {
                        setComposeInitialData(null);
                        setIsComposeOpen(true);
                    }}
                    unreadCount={unreadCount}
                />
            </div>

            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                {!selectedMessage && (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t('messaging.search')}
                            className="pl-10 h-10 bg-muted/50 border-none shadow-none focus-visible:ring-1"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                )}

                <div className="flex-1 overflow-y-auto min-h-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : selectedMessage ? (
                        <MailDetail
                            message={selectedMessage}
                            onBack={() => setSelectedMessage(null)}
                            onDelete={handleDelete}
                            onReply={handleReply}
                        />
                    ) : (
                        <MailList
                            messages={filteredMessages}
                            onSelectMessage={handleSelectMessage}
                            selectedMessageId={selectedMessage?.id}
                            folder={activeFolder}
                        />
                    )}
                </div>
            </div>

            {isComposeOpen && (
                <MailCompose
                    onClose={() => setIsComposeOpen(false)}
                    onSend={(data) => sendMessage.mutate({ 
                        ...data, 
                        subject: { [i18n.language]: data.subject },
                        content: { [i18n.language]: data.content },
                        sender_id: user?.id 
                    })}
                    onSaveDraft={(data) => saveDraft.mutate({ 
                        ...data, 
                        subject: { [i18n.language]: data.subject },
                        content: { [i18n.language]: data.content },
                        sender_id: user?.id 
                    })}
                    initialData={composeInitialData}
                />
            )}
        </div>
    );
}
