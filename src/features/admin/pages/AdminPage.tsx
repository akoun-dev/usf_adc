import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Settings,
    Globe,
    CalendarClock,
    ScrollText,
    GitBranch,
    BookOpen,
    Shield,
    Key,
    ShieldAlert,
    Database,
    FileText,
    Newspaper,
    Calendar,
    MessageSquare,
    Map,
} from "lucide-react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { PlatformSettingsTab } from "../components/PlatformSettingsTab"
import { CountriesTab } from "../components/CountriesTab"
import { FsuSettingsTab } from "../components/FsuSettingsTab"
import { AuditLogsTab } from "../components/AuditLogsTab"
import { BackupsTab } from "../components/BackupsTab"
import { ApiKeysTab } from "../components/ApiKeysTab"
import { IpRestrictionsTab } from "../components/IpRestrictionsTab"
import { QuarterlyReportsTab } from "../components/QuarterlyReportsTab"
import { WorkflowSettingsPanel } from "@/features/validation/components/WorkflowSettingsPanel"
import { FaqManagementPanel } from "@/features/support/components/FaqManagementPanel"
import { NewsTab } from "../components/NewsTab"
import { ProjectsTab } from "../components/ProjectsTab"
import { DocumentsTab } from "../components/DocumentsTab"
import { EventsTab } from "../components/EventsTab"
import { ForumTab } from "../components/ForumTab"
import { useTranslation } from "react-i18next"
import PageHero from "@/components/PageHero"
import { useLocation } from "react-router-dom"

export default function AdminPage() {
    const { hasRole, profile } = useAuth()
    const isGlobalAdmin = hasRole("super_admin")
    const isCountryAdmin = hasRole("country_admin")
    const { t } = useTranslation()
    const location = useLocation()
    const countryId = profile?.country_id as string | undefined

    const pathTab = location.pathname.split("/").pop()

    let defaultTab = pathTab || "countries"
    if (defaultTab === "admin")
        defaultTab = isGlobalAdmin ? "settings" : "countries"

    const tabTitles: Record<string, string> = {
        settings: "admin.settings",
        countries: "admin.countries",
        fsu: "admin.fsuSubmissions",
        workflow: "admin.workflow",
        audit: "admin.auditLog",
        faq: "admin.faq",
        backups: "admin.backups",
        apikeys: "admin.apiKeys",
        ip: "admin.ipRestrictions",
        quarterly: "admin.quarterlyReports",
    }

    const isMainAdmin = ![
        "news",
        "projects",
        "documents",
        "events",
        "forum",
    ].includes(pathTab || "")
    const currentTitle = isMainAdmin
        ? t("admin.title")
        : t(tabTitles[defaultTab] || "admin.title")

    if (!isMainAdmin) {
        return (
            <div className="space-y-6 animate-fade-in">
                <PageHero
                    title={currentTitle}
                    description={
                        isGlobalAdmin
                            ? t("admin.descAdmin")
                            : t("admin.descView")
                    }
                    icon={<Settings className="h-6 w-6 text-secondary" />}
                />
                {defaultTab === "news" && <NewsTab />}
                {defaultTab === "projects" && <ProjectsTab />}
                {defaultTab === "documents" && <DocumentsTab />}
                {defaultTab === "events" && <EventsTab />}
                {defaultTab === "forum" && <ForumTab />}
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHero
                title={currentTitle}
                description={
                    isGlobalAdmin ? t("admin.descAdmin") : t("admin.descView")
                }
                icon={<Settings className="h-6 w-6 text-secondary" />}
            />

            <Tabs defaultValue={defaultTab}>
                <TabsList className="flex-wrap">
                    {isGlobalAdmin && isMainAdmin && (
                        <TabsTrigger value="settings">
                            <Settings className="mr-2 h-4 w-4" />
                            {t("admin.settings")}
                        </TabsTrigger>
                    )}
                    {isMainAdmin && (
                        <TabsTrigger value="countries">
                            <Globe className="mr-2 h-4 w-4" />
                            {t("admin.countries")}
                        </TabsTrigger>
                    )}
                    {isMainAdmin && (
                        <TabsTrigger value="fsu">
                            <CalendarClock className="mr-2 h-4 w-4" />
                            {t("admin.fsuSubmissions")}
                        </TabsTrigger>
                    )}
                    {isMainAdmin &&
                        (isGlobalAdmin || isCountryAdmin) &&
                        countryId && (
                            <TabsTrigger value="workflow">
                                <GitBranch className="mr-2 h-4 w-4" />
                                Workflow
                            </TabsTrigger>
                        )}
                    {isMainAdmin && (
                        <TabsTrigger value="audit">
                            <ScrollText className="mr-2 h-4 w-4" />
                            {t("admin.auditLog")}
                        </TabsTrigger>
                    )}
                    {isGlobalAdmin && isMainAdmin && (
                        <TabsTrigger value="faq">
                            <BookOpen className="mr-2 h-4 w-4" />
                            FAQ
                        </TabsTrigger>
                    )}
                    {isGlobalAdmin && isMainAdmin && (
                        <TabsTrigger value="backups">
                            <Database className="mr-2 h-4 w-4" />
                            {t("admin.backups", "Sauvegardes")}
                        </TabsTrigger>
                    )}
                    {isGlobalAdmin && isMainAdmin && (
                        <TabsTrigger value="apikeys">
                            <Key className="mr-2 h-4 w-4" />
                            {t("admin.apiKeys", "Clés API")}
                        </TabsTrigger>
                    )}
                    {isGlobalAdmin && isMainAdmin && (
                        <TabsTrigger value="ip">
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            {t("admin.ipRestrictions", "IP")}
                        </TabsTrigger>
                    )}
                    {isGlobalAdmin && isMainAdmin && (
                        <TabsTrigger value="quarterly">
                            <CalendarClock className="mr-2 h-4 w-4" />
                            {t("admin.quarterlyReports", "Rapports auto")}
                        </TabsTrigger>
                    )}
                </TabsList>

                {isGlobalAdmin && isMainAdmin && (
                    <TabsContent value="settings">
                        <PlatformSettingsTab />
                    </TabsContent>
                )}
                {isMainAdmin && (
                    <TabsContent value="countries">
                        <CountriesTab />
                    </TabsContent>
                )}
                {isMainAdmin && (
                    <TabsContent value="fsu">
                        <FsuSettingsTab />
                    </TabsContent>
                )}
                {isMainAdmin &&
                    (isGlobalAdmin || isCountryAdmin) &&
                    countryId && (
                        <TabsContent value="workflow">
                            <WorkflowSettingsPanel countryId={countryId} />
                        </TabsContent>
                    )}
                {isMainAdmin && (
                    <TabsContent value="audit">
                        <AuditLogsTab />
                    </TabsContent>
                )}
                {isGlobalAdmin && isMainAdmin && (
                    <TabsContent value="faq">
                        <FaqManagementPanel />
                    </TabsContent>
                )}
                {isGlobalAdmin && isMainAdmin && (
                    <TabsContent value="backups">
                        <BackupsTab />
                    </TabsContent>
                )}
                {isGlobalAdmin && isMainAdmin && (
                    <TabsContent value="apikeys">
                        <ApiKeysTab />
                    </TabsContent>
                )}
                {isGlobalAdmin && isMainAdmin && (
                    <TabsContent value="ip">
                        <IpRestrictionsTab />
                    </TabsContent>
                )}
                {isGlobalAdmin && isMainAdmin && (
                    <TabsContent value="quarterly">
                        <QuarterlyReportsTab />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}
