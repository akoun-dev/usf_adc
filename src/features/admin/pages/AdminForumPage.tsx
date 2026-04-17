import { MessageSquare } from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHero from "@/components/PageHero"
import { ForumTab } from "../components/ForumTab"

export default function AdminForumPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHero
                title={t("admin.forum", "Forum")}
                description={t(
                    "admin.forumDesc",
                    "Manage forum discussions and content"
                )}
                icon={<MessageSquare className="h-6 w-6 text-secondary" />}
            />

            <ForumTab />
        </div>
    )
}
