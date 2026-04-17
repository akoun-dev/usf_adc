import { Newspaper } from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHero from "@/components/PageHero"
import { NewsTab } from "../components/NewsTab"

export default function AdminNewsPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHero
                title={t("admin.news", "News")}
                description={t(
                    "admin.newsDesc",
                    "Manage news articles and publications"
                )}
                icon={<Newspaper className="h-6 w-6 text-secondary" />}
            />

            <NewsTab />
        </div>
    )
}
