import { Calendar } from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHero from "@/components/PageHero"
import { EventsTab } from "../components/EventsTab"

export default function AdminEventsPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHero
                title={t("admin.events", "Events")}
                description={t(
                    "admin.eventsDesc",
                    "Manage calendar events and conferences"
                )}
                icon={<Calendar className="h-6 w-6 text-secondary" />}
            />

            <EventsTab />
        </div>
    )
}
