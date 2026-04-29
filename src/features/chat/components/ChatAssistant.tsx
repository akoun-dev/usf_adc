import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
    MessageCircle,
    Send,
    X,
    Minimize2,
    Maximize2,
    Bot,
    User,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useChatAssistant } from "../hooks/use-chat-assistant"
import { cn } from "@/lib/utils"

export function ChatAssistant() {
    const { t } = useTranslation()
    const { messages, sendMessage, isLoading } = useChatAssistant()
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return
        sendMessage(input)
        setInput("")
    }

    return (
        <div className="fixed bottom-6 right-6 xs:right-4 z-50 flex flex-col items-end">
            {isOpen && (
                <Card className="mb-4 w-[350px] h-[500px] flex flex-col shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
                    <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5" />
                            <CardTitle className="text-sm font-medium">
                                {t("chat.assistant.name", "Assistant FSU")}
                            </CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex gap-3",
                                            msg.sender === "user"
                                                ? "flex-row-reverse"
                                                : "flex-row"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                                                msg.sender === "user"
                                                    ? "bg-secondary"
                                                    : "bg-primary text-primary-foreground"
                                            )}
                                        >
                                            {msg.sender === "user" ? (
                                                <User className="h-4 w-4" />
                                            ) : (
                                                <Bot className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div
                                            className={cn(
                                                "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                                                msg.sender === "user"
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-muted text-foreground rounded-tl-none"
                                            )}
                                        >
                                            {msg.content}
                                            <div
                                                className={cn(
                                                    "text-[10px] mt-1 opacity-60",
                                                    msg.sender === "user"
                                                        ? "text-right"
                                                        : "text-left"
                                                )}
                                            >
                                                {msg.timestamp.toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-3 flex-row">
                                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                                            <Bot className="h-4 w-4 animate-pulse" />
                                        </div>
                                        <div className="bg-muted rounded-2xl rounded-tl-none px-3 py-2 text-sm italic text-muted-foreground">
                                            {t(
                                                "chat.assistant.typing",
                                                "L'assistant réfléchit..."
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        <form
                            onSubmit={handleSend}
                            className="p-4 flex gap-2 bg-background"
                        >
                            <Input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder={t(
                                    "chat.assistant.placeholder",
                                    "Posez votre question..."
                                )}
                                className="flex-1"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isLoading || !input.trim()}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110"
                size="icon"
            >
                {isOpen ? (
                    <Minimize2 className="h-6 w-6" />
                ) : (
                    <MessageCircle className="h-6 w-6" />
                )}
            </Button>
        </div>
    )
}
