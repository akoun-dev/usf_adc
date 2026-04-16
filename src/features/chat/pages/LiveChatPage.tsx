import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Clock, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

export default function LiveChatPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', content: t('chat.welcome', 'Bienvenue ! Comment pouvons-nous vous aider ?'), sender: 'support', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const isOnline = new Date().getHours() >= 8 && new Date().getHours() < 18;

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), content: input, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: t('chat.autoReply', 'Merci pour votre message. Un agent vous répondra dans les plus brefs délais. En attendant, consultez notre FAQ pour des réponses rapides.'),
        sender: 'support', timestamp: new Date(),
      }]);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <PageHero
        title={t('chat.title', 'Chat en direct')}
        description={t('chat.description', 'Support en temps réel pendant les heures ouvrables (8h-18h UTC)')}
        icon={<MessageCircle className="h-6 w-6 text-secondary" />}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">{t('chat.supportTeam', 'Équipe Support USF-ADC')}</CardTitle>
          <Badge variant={isOnline ? 'default' : 'secondary'} className="gap-1">
            {isOnline ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
            {isOnline ? t('chat.online', 'En ligne') : t('chat.offline', 'Hors ligne')}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="h-80 overflow-y-auto space-y-3 mb-4 p-3 rounded-lg bg-muted/30">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                  msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {msg.content}
                  <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
            <Input value={input} onChange={e => setInput(e.target.value)} placeholder={t('chat.placeholder', 'Tapez votre message...')} />
            <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
