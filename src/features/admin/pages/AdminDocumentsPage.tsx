import { FileText } from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHero from "@/components/PageHero"
import { DocumentsTab } from "../components/DocumentsTab"

export default function AdminDocumentsPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHero
                title={t("admin.documents", "Documents")}
                description={t(
                    "admin.documentsDesc",
                    "Manage document library and resources"
                )}
                icon={<FileText className="h-6 w-6 text-secondary" />}
            />

            <DocumentsTab />
        </div>
    )
}
