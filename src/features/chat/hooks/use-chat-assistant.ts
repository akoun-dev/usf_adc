import { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"

interface Message {
    id: string
    content: string
    sender: "user" | "assistant"
    timestamp: Date
}

export function useChatAssistant() {
    const { t } = useTranslation()
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            content: t(
                "chat.assistant.welcome",
                "Bonjour ! Je suis l'Assistant FSU. Comment puis-je vous aider dans la gestion de vos actualités aujourd'hui ?"
            ),
            sender: "assistant",
            timestamp: new Date(),
        },
    ])
    const [isLoading, setIsLoading] = useState(false)

    const sendMessage = useCallback(
        async (text: string, context?: any) => {
            if (!text.trim()) return

            const userMsg: Message = {
                id: Date.now().toString(),
                content: text,
                sender: "user",
                timestamp: new Date(),
            }

            setMessages(prev => [...prev, userMsg])
            setIsLoading(true)

            try {
                // Gestion des commandes slash
                if (text.startsWith("/")) {
                    const [command, ...args] = text.split(" ")
                    const content = args.join(" ")

                    await new Promise(resolve => setTimeout(resolve, 800))

                    let response = ""
                    switch (command) {
                        case "/aide":
                            response = t(
                                "chat.assistant.help",
                                "Voici les commandes disponibles :\n- /corriger [texte] : Correction orthographique\n- /traduire [texte] : Traduction multilingue\n- /résumer [texte] : Résumé concis\n- /idées : Suggestions de sujets\n- /aide : Afficher ce menu"
                            )
                            break
                        case "/corriger":
                            response = content
                                ? t(
                                      "chat.assistant.correct_sim",
                                      `[Correction] : ${content} (Ceci est une simulation de correction IA)`
                                  )
                                : t(
                                      "chat.assistant.correct_error",
                                      "Veuillez fournir le texte à corriger après la commande /corriger"
                                  )
                            break
                        case "/traduire":
                            response = content
                                ? t(
                                      "chat.assistant.translate_sim",
                                      `[Traduction] : ${content} (Ceci est une simulation de traduction IA)`
                                  )
                                : t(
                                      "chat.assistant.translate_error",
                                      "Veuillez fournir le texte à traduire après la commande /traduire"
                                  )
                            break
                        case "/résumer":
                            response = content
                                ? t(
                                      "chat.assistant.summarize_sim",
                                      `[Résumé] : ${content.substring(0, 50)}... (Ceci est une simulation de résumé IA)`
                                  )
                                : t(
                                      "chat.assistant.summarize_error",
                                      "Veuillez fournir le texte à résumer après la commande /résumer"
                                  )
                            break
                        case "/idées":
                            response = t(
                                "chat.assistant.ideas_sim",
                                "Voici quelques idées de sujets :\n1. Impact des nouvelles régulations télécoms\n2. Rapport sur la connectivité rurale\n3. Interview avec un expert en infrastructure numérique"
                            )
                            break
                        default:
                            response = t(
                                "chat.assistant.unknown_cmd",
                                `La commande ${command} n'est pas reconnue. Tapez /aide pour voir la liste.`
                            )
                    }

                    setMessages(prev => [
                        ...prev,
                        {
                            id: (Date.now() + 1).toString(),
                            content: response,
                            sender: "assistant",
                            timestamp: new Date(),
                        },
                    ])
                    setIsLoading(false)
                    return
                }

                // Simulation d'un appel API vers Supabase Edge Function
                await new Promise(resolve => setTimeout(resolve, 1500))

                const assistantMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    content: t(
                        "chat.assistant.simulated_reply",
                        `J'ai bien reçu votre demande : "${text}". En tant qu'Assistant FSU, je peux vous aider à rédiger, traduire ou optimiser ce contenu. (Ceci est une réponse simulée, l'intégration LLM arrive à l'étape suivante)`
                    ),
                    sender: "assistant",
                    timestamp: new Date(),
                }

                setMessages(prev => [...prev, assistantMsg])
            } catch (error) {
                console.error("Error sending message:", error)
                setMessages(prev => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        content: t(
                            "chat.assistant.error",
                            "Désolé, j'ai rencontré une erreur. Veuillez réessayer."
                        ),
                        sender: "assistant",
                        timestamp: new Date(),
                    },
                ])
            } finally {
                setIsLoading(false)
            }
        },
        [t]
    )

    return {
        messages,
        sendMessage,
        isLoading,
    }
}
