import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Maximize2, Minimize2, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface MailComposeProps {
    onClose: () => void;
    onSend: (data: { recipient_id: string; subject: string; content: string }) => void;
    onSaveDraft: (data: { id?: string; recipient_id?: string; subject?: string; content?: string }) => void;
    initialData?: { id?: string; recipient_id?: string; subject?: string; content?: string };
}

export const MailCompose = ({ onClose, onSend, onSaveDraft, initialData }: MailComposeProps) => {
    const { t } = useTranslation();
    const { data: users = [] } = useUsers();
    const { user: currentUser } = useAuth();
    
    const [recipientId, setRecipientId] = useState(initialData?.recipient_id || "");
    const [subject, setSubject] = useState(initialData?.subject || "");
    const [content, setContent] = useState(initialData?.content || "");

    const handleSend = () => {
        if (!recipientId) return;
        onSend({ recipient_id: recipientId, subject, content });
        onClose();
    };

    return (
        <div className="fixed bottom-0 right-8 w-[500px] bg-card border rounded-t-xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-t-xl">
                <span className="text-sm font-medium">{t('messaging.compose')}</span>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Minimize2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col p-4 gap-2">
                <div className="flex items-center gap-2 border-b py-1">
                    <span className="text-sm text-muted-foreground w-12">{t('messaging.to')}</span>
                    <Select value={recipientId} onValueChange={setRecipientId}>
                        <SelectTrigger className="border-0 shadow-none focus:ring-0 p-0 h-8">
                            <SelectValue placeholder={t('messaging.searchRecipient')} />
                        </SelectTrigger>
                        <SelectContent>
                            {users.filter(u => u.id !== currentUser?.id).map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                    {user.full_name || user.id}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2 border-b py-1">
                    <span className="text-sm text-muted-foreground w-12">{t('messaging.subject')}</span>
                    <Input 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="border-0 shadow-none focus-visible:ring-0 p-0 h-8"
                    />
                </div>

                <Textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[300px] border-0 shadow-none focus-visible:ring-0 p-0 resize-none"
                    placeholder={t('messaging.message')}
                />
            </div>

            <div className="flex items-center justify-between p-4 border-t">
                <div className="flex items-center gap-2">
                    <Button onClick={handleSend} disabled={!recipientId} className="rounded-full px-6">
                        {t('messaging.send')}
                        <Send className="ml-2 h-4 w-4" />
                    </Button>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <Trash2 className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};
