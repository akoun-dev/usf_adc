import { Globe } from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHero from "@/components/PageHero"
import { CountriesTab } from "../components/CountriesTab"

export default function AdminCountriesPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHero
                title={t("admin.countries", "Countries")}
                description={t(
                    "admin.countriesDesc",
                    "Manage countries and member representatives"
                )}
                icon={<Globe className="h-6 w-6 text-secondary" />}
            />

            <CountriesTab />
        </div>
    )
}
