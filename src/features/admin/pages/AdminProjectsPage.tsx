import { Map } from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHero from "@/components/PageHero"
import { ProjectsTab } from "../components/ProjectsTab"

export default function AdminProjectsPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHero
                title={t("admin.projects", "Projects")}
                description={t(
                    "admin.projectsDesc",
                    "Manage projects and calls for proposals"
                )}
                icon={<Map className="h-6 w-6 text-secondary" />}
            />

            <ProjectsTab />
        </div>
    )
}
