import { Settings } from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHero from "@/components/PageHero"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Key,
    Database,
    ShieldAlert,
    ScrollText,
    BookOpen,
    CalendarClock,
} from "lucide-react"
import { PlatformSettingsTab } from "../components/PlatformSettingsTab"
import { ApiKeysTab } from "../components/ApiKeysTab"
import { IpRestrictionsTab } from "../components/IpRestrictionsTab"
import { BackupsTab } from "../components/BackupsTab"
import { AuditLogsTab } from "../components/AuditLogsTab"
import { FaqManagementPanel } from "@/features/support/components/FaqManagementPanel"
import { QuarterlyReportsTab } from "../components/QuarterlyReportsTab"

export default function AdminSettingsPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHero
                title={t("admin.settings", "Settings")}
                description={t(
                    "admin.settingsDesc",
                    "Manage platform settings and configuration"
                )}
                icon={<Settings className="h-6 w-6 text-secondary" />}
            />

            <Tabs defaultValue="platform" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                    <TabsTrigger value="platform">
                        <Settings className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">
                            {t("admin.platform", "Platform")}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="apikeys">
                        <Key className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">
                            {t("admin.apiKeys", "Keys")}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="ip">
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">
                            {t("admin.ipRestrictions", "IP")}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="backups">
                        <Database className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">
                            {t("admin.backups", "Backups")}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="audit">
                        <ScrollText className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">
                            {t("admin.audit", "Audit")}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="faq">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">FAQ</span>
                    </TabsTrigger>
                    <TabsTrigger value="quarterly">
                        <CalendarClock className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">
                            {t("admin.quarterly", "Reports")}
                        </span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="platform">
                    <PlatformSettingsTab />
                </TabsContent>
                <TabsContent value="apikeys">
                    <ApiKeysTab />
                </TabsContent>
                <TabsContent value="ip">
                    <IpRestrictionsTab />
                </TabsContent>
                <TabsContent value="backups">
                    <BackupsTab />
                </TabsContent>
                <TabsContent value="audit">
                    <AuditLogsTab />
                </TabsContent>
                <TabsContent value="faq">
                    <FaqManagementPanel />
                </TabsContent>
                <TabsContent value="quarterly">
                    <QuarterlyReportsTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}
