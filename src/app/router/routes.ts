import { lazy } from "react"
import type { AppRole } from "@/core/constants/roles"

export interface AppRouteConfig {
    path: string
    component: React.LazyExoticComponent<React.ComponentType>
    roles?: AppRole[]
}

const DashboardRouter = lazy(
    () => import("@/features/dashboard/pages/DashboardRouter")
)
const PublicExternalDashboard = lazy(
    () => import("@/features/dashboard/pages/PublicExternalDashboard")
)
const PointFocalDashboard = lazy(
    () => import("@/features/dashboard/pages/PointFocalDashboard")
)
const AdminPaysDashboard = lazy(
    () => import("@/features/dashboard/pages/AdminPaysDashboard")
)
const AdminGlobalDashboard = lazy(
    () => import("@/features/dashboard/pages/AdminGlobalDashboard")
)
const ProfilePage = lazy(() => import("@/features/profiles/pages/ProfilePage"))
const ProfilePreferencesPage = lazy(() => import("@/features/profiles/pages/ProfilePreferencesPage"))
const ProfileSecurityPage = lazy(() => import("@/features/profiles/pages/ProfileSecurityPage"))
const FsuSubmissionsPage = lazy(
    () => import("@/features/fsu/pages/FsuSubmissionsPage")
)
const FsuNewSubmissionPage = lazy(
    () => import("@/features/fsu/pages/FsuNewSubmissionPage")
)
const FsuSubmissionDetailPage = lazy(
    () => import("@/features/fsu/pages/FsuSubmissionDetailPage")
)
const ValidationListPage = lazy(
    () => import("@/features/validation/pages/ValidationListPage")
)
const ValidationDetailPage = lazy(
    () => import("@/features/validation/pages/ValidationDetailPage")
)
const ProjectsMapPage = lazy(
    () => import("@/features/projects-map/pages/ProjectsMapPage")
)
const ForumPage = lazy(() => import("@/features/forum/pages/ForumPage"))
const ForumTopicPage = lazy(
    () => import("@/features/forum/pages/ForumTopicPage")
)
const ForumNewTopicPage = lazy(
    () => import("@/features/forum/pages/ForumNewTopicPage")
)
const ForumGroupsPage = lazy(
    () => import("@/features/forum/pages/ForumGroupsPage")
)
const NotificationsPage = lazy(
    () => import("@/features/notifications/pages/NotificationsPage")
)
const AlertSettingsPage = lazy(
    () => import("@/features/notifications/pages/AlertSettingsPage")
)
const UsersPage = lazy(() => import("@/features/users/pages/UsersPage"))
const InvitationsPage = lazy(
    () => import("@/features/invitations/pages/InvitationsPage")
)
const ReportsPage = lazy(() => import("@/features/reports/pages/ReportsPage"))
const ReportBuilderPage = lazy(
    () => import("@/features/reports/pages/ReportBuilderPage")
)
const SupportPage = lazy(() => import("@/features/support/pages/SupportPage"))
const SupportNewTicketPage = lazy(
    () => import("@/features/support/pages/SupportNewTicketPage")
)
const SupportTicketDetailPage = lazy(
    () => import("@/features/support/pages/SupportTicketDetailPage")
)
const AdminPage = lazy(() => import("@/features/admin/pages/AdminPage"))
const AdminDashboard = lazy(
    () => import("@/features/admin/pages/AdminDashboard")
)
const AdminNewsPage = lazy(() => import("@/features/admin/pages/AdminNewsPage"))
const AdminCategoriesPage = lazy(() => import("@/features/admin/pages/AdminCategoriesPage"))
const ArticleFormPage = lazy(() => import("@/features/admin/pages/ArticleFormPage").then(module => ({ default: module.ArticleFormPage })))
const AdminProjectsPage = lazy(
    () => import("@/features/admin/pages/AdminProjectsPage")
)
const CreateProjectPage = lazy(
    () => import("@/features/admin/pages/CreateProjectPage")
)
const ProjectDetailPage = lazy(
    () => import("@/features/admin/pages/ProjectDetailPage")
)
const AdminDocumentsPage = lazy(
    () => import("@/features/admin/pages/AdminDocumentsPage")
)
const AdminEventsPage = lazy(
    () => import("@/features/admin/pages/AdminEventsPage")
)
const AdminForumPage = lazy(
    () => import("@/features/admin/pages/AdminForumPage")
)
const AdminMembersPage = lazy(
    () => import("@/features/admin/pages/AdminMembersPage")
)
const AdminCountriesPage = lazy(
    () => import("@/features/admin/pages/AdminCountriesPage")
)
const AdminSettingsPage = lazy(
    () => import("@/features/admin/pages/AdminSettingsPage")
)
const PlatformSettingsPage = lazy(
    () => import("@/features/admin/pages/settings/PlatformSettingsPage")
)
const ApiKeysSettingsPage = lazy(
    () => import("@/features/admin/pages/settings/ApiKeysSettingsPage")
)
const IpRestrictionsSettingsPage = lazy(
    () => import("@/features/admin/pages/settings/IpRestrictionsSettingsPage")
)
const BackupsSettingsPage = lazy(
    () => import("@/features/admin/pages/settings/BackupsSettingsPage")
)
const AuditLogsSettingsPage = lazy(
    () => import("@/features/admin/pages/settings/AuditLogsSettingsPage")
)
const FaqSettingsPage = lazy(
    () => import("@/features/admin/pages/settings/FaqSettingsPage")
)
const QuarterlyReportsSettingsPage = lazy(
    () => import("@/features/admin/pages/settings/QuarterlyReportsSettingsPage")
)
const AiSettingsPage = lazy(
    () => import("@/features/admin/pages/settings/AiSettingsPage")
)
const FsuSettingsPage = lazy(
    () => import("@/features/admin/pages/settings/FsuSettingsPage")
)
const AdminSetupPage = lazy(
    () => import("@/features/admin/pages/AdminSetupPage")
)
const EventFormPage = lazy(() => import("@/features/admin/pages/EventFormPage").then(module => ({ default: module.EventFormPage })))
const FaqPage = lazy(() => import("@/features/support/pages/FaqPage"))
const NewslettersPage = lazy(
    () => import("@/features/newsletters/pages/NewslettersPage")
)
const NewslettersAdminPage = lazy(
    () => import("@/features/newsletters/pages/NewslettersAdminPage")
)
const TrainingPage = lazy(
    () => import("@/features/training/pages/TrainingPage")
)
const DocumentLibraryPage = lazy(
    () => import("@/features/documents/pages/DocumentLibraryPage")
)
const LiveChatPage = lazy(() => import("@/features/chat/pages/LiveChatPage"))
const RssFeedsPage = lazy(() => import("@/features/feeds/pages/RssFeedsPage"))
const CountryAdminDashboardPage = lazy(() => import("@/features/country-admin/pages/CountryAdminDashboard"))
const CountryAdminProjectsPage = lazy(() => import("@/features/country-admin/pages/CountryAdminProjectsPage"))
const CountryAdminFsuPage = lazy(() => import("@/features/country-admin/pages/CountryAdminFsuPage"))
const CountryAdminUsersPage = lazy(() => import("@/features/country-admin/pages/CountryAdminUsersPage"))
const CountryAdminReportsPage = lazy(() => import("@/features/country-admin/pages/CountryAdminReportsPage"))
const CountryAdminSettingsPage = lazy(() => import("@/features/country-admin/pages/CountryAdminSettingsPage"))
const CountryAdminForumPage = lazy(() => import("@/features/country-admin/pages/CountryAdminForumPage"))
const CountryAdminSupportPage = lazy(() => import("@/features/country-admin/pages/CountryAdminSupportPage"))
const CountryAdminProfilePage = lazy(() => import("@/features/country-admin/pages/CountryAdminProfilePage"))
const PointFocalDashboardPage = lazy(() => import("@/features/pointfocal/pages/PointFocalDashboard"))
const MyProjectsPage = lazy(() => import("@/features/pointfocal/pages/MyProjectsPage"))
const MyTasksPage = lazy(() => import("@/features/pointfocal/pages/MyTasksPage"))
const FsuDataEntryPage = lazy(() => import("@/features/pointfocal/pages/FsuDataEntryPage"))
const PointFocalValidationPage = lazy(() => import("@/features/pointfocal/pages/ValidationPage"))
const PointFocalForumPage = lazy(() => import("@/features/pointfocal/pages/ForumPage"))
const PointFocalTrainingPage = lazy(() => import("@/features/pointfocal/pages/TrainingPage"))
const AccountPage = lazy(() => import("@/features/pointfocal/pages/AccountPage"))
const PointFocalCalendarPage = lazy(() => import("@/features/pointfocal/pages/PointFocalCalendarPage"))
const CmdtContributionsPage = lazy(() => import("@/features/pointfocal/pages/CmdtContributionsPage"))
const AgencyDirectoryPage = lazy(() => import("@/features/pointfocal/pages/AgencyDirectoryPage"))

// Public pages
const PublicHomePage = lazy(
    () => import("@/features/public/pages/PublicHomePage")
)
const PublicMapPage = lazy(
    () => import("@/features/public/pages/PublicMapPage")
)
const PublicDocumentsPage = lazy(
    () => import("@/features/public/pages/PublicDocumentsPage")
)
const NewsPage = lazy(() => import("@/features/public/pages/NewsPage"))
const NewsDetailPage = lazy(
    () => import("@/features/public/pages/NewsDetailPage")
)
const PublicForumPage = lazy(
    () => import("@/features/public/pages/PublicForumPage")
)
const ForumTopicDetailPage = lazy(
    () => import("@/features/public/pages/ForumTopicDetailPage")
)
const CallsForProjectsPage = lazy(
    () => import("@/features/public/pages/CallsForProjectsPage")
)
const AboutPage = lazy(() => import("@/features/public/pages/AboutPage"))
const PublicFaqPage = lazy(
    () => import("@/features/public/pages/PublicFaqPage")
)
const EventsCalendarPage = lazy(
    () => import("@/features/public/pages/EventsCalendarPage")
)
const EventDetailPage = lazy(
    () => import("@/features/public/pages/EventDetailPage")
)
const CountriesDirectoryPage = lazy(
    () => import("@/features/public/pages/CountriesDirectoryPage")
)
const CountryProjectsPage = lazy(
    () => import("@/features/public/pages/CountryProjectsPage")
)
const RegistrationPage = lazy(
    () => import("@/features/public/pages/RegistrationPage")
)
const SUTELPage = lazy(() => import("@/features/public/pages/SUTELPage"))
const AssociatedMembersPage = lazy(
    () => import("@/features/public/pages/AssociatedMembersPage")
)
const OurHistoryPage = lazy(
    () => import("@/features/public/pages/OurHistoryPage")
)
const LeadershipTeamPage = lazy(
    () => import("@/features/public/pages/LeadershipTeamPage")
)

/** Routes rendered inside the authenticated AppLayout shell. */
export const AUTHENTICATED_ROUTES: AppRouteConfig[] = [
    { path: "/dashboard", component: DashboardRouter },
{
        path: "/point-focal/account",
        component: AccountPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/calendar",
        component: PointFocalCalendarPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/dashboard/point-focal",
        component: PointFocalDashboard,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    // Point Focal routes
    {
        path: "/point-focal",
        component: PointFocalDashboardPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/projects",
        component: MyProjectsPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/map",
        component: ProjectsMapPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/projects/new",
        component: CreateProjectPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/projects/in-progress",
        component: MyProjectsPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/projects/drafts",
        component: MyProjectsPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/projects/archived",
        component: MyProjectsPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/projects/submit",
        component: MyProjectsPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/tasks",
        component: MyTasksPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/tasks",
        component: MyTasksPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/fsu",
        component: FsuDataEntryPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/fsu/new",
        component: FsuNewSubmissionPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/fsu/history",
        component: FsuDataEntryPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/fsu/drafts",
        component: FsuDataEntryPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/validation",
        component: PointFocalValidationPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/validation/preview",
        component: PointFocalValidationPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/validation/pending",
        component: PointFocalValidationPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/fsu/preview",
        component: PointFocalValidationPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/fsu/pending",
        component: PointFocalValidationPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/forum",
        component: PointFocalForumPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/cmdt25",
        component: CmdtContributionsPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/forum/topics",
        component: PointFocalForumPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/forum/my-topics",
        component: PointFocalForumPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/forum/groups",
        component: ForumGroupsPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/forum/new",
        component: ForumNewTopicPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
{
        path: "/point-focal/training/elearning",
        component: PointFocalTrainingPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    // Country Admin routes
    {
        path: "/country-admin",
        component: CountryAdminDashboardPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/alerts",
        component: CountryAdminDashboardPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/projects",
        component: CountryAdminProjectsPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/map",
        component: ProjectsMapPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/calendar",
        component: PointFocalCalendarPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/projects/pending",
        component: CountryAdminProjectsPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/projects/reports",
        component: CountryAdminProjectsPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/fsu/pending",
        component: CountryAdminFsuPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/fsu/history",
        component: CountryAdminFsuPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/fsu/export",
        component: CountryAdminFsuPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/users",
        component: CountryAdminUsersPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/users/invite",
        component: CountryAdminUsersPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/users/roles",
        component: CountryAdminUsersPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/users/activity",
        component: CountryAdminUsersPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/reports",
        component: CountryAdminReportsPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/reports/generator",
        component: CountryAdminReportsPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/reports/kpis",
        component: CountryAdminReportsPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/reports/uat",
        component: CountryAdminReportsPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/settings",
        component: CountryAdminSettingsPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/forum/moderation",
        component: CountryAdminForumPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/forum/stats",
        component: CountryAdminForumPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/support",
        component: CountryAdminSupportPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/faq",
        component: CountryAdminSupportPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/profile",
        component: CountryAdminProfilePage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/country-admin/audit",
        component: CountryAdminProfilePage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/point-focal/reports",
        component: ReportsPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/training",
        component: PointFocalTrainingPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/training/webinars",
        component: PointFocalTrainingPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/training/elearning",
        component: PointFocalTrainingPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/feeds",
        component: RssFeedsPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/documents",
        component: DocumentLibraryPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/codraft",
        component: PointFocalForumPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/directory",
        component: AgencyDirectoryPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/account",
        component: AccountPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/profile",
        component: ProfilePage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/profile/preferences",
        component: ProfilePreferencesPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/profile/security",
        component: ProfileSecurityPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/dashboard/admin-pays",
        component: AdminPaysDashboard,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/dashboard/admin-global",
        component: AdminGlobalDashboard,
        roles: ["super_admin"],
    },
    { path: "/profile", component: ProfilePage },
    { path: "/profile/preferences", component: ProfilePreferencesPage },
    { path: "/profile/security", component: ProfileSecurityPage },
    {
        path: "/point-focal/account",
        component: AccountPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/profile",
        component: ProfilePage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/profile/preferences",
        component: ProfilePreferencesPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/point-focal/profile/security",
        component: ProfileSecurityPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/fsu/new",
        component: FsuNewSubmissionPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/fsu/submissions",
        component: FsuSubmissionsPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/fsu/submissions/new",
        component: FsuNewSubmissionPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/fsu/submissions/:id",
        component: FsuSubmissionDetailPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/validation",
        component: ValidationListPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/validation/:id",
        component: ValidationDetailPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/admin/users",
        component: UsersPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/admin/invitations",
        component: InvitationsPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/reports",
        component: ReportsPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/reports/builder",
        component: ReportBuilderPage,
        roles: ["country_admin", "super_admin"],
    },
    { path: "/map", component: ProjectsMapPage },
    { path: "/forum", component: ForumPage },
    {
        path: "/forum/new",
        component: ForumNewTopicPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    { path: "/forum/groups", component: ForumGroupsPage },
    { path: "/forum/:id", component: ForumTopicPage },
    { path: "/notifications", component: NotificationsPage },
    { path: "/notifications/settings", component: AlertSettingsPage },
    {
        path: "/support",
        component: SupportPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/support/new",
        component: SupportNewTicketPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/support/:id",
        component: SupportTicketDetailPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    { path: "/chat", component: LiveChatPage },
    { path: "/faq", component: FaqPage },
    { path: "/documents", component: DocumentLibraryPage },
    { path: "/training", component: TrainingPage },
    { path: "/feeds", component: RssFeedsPage },
    {
        path: "/admin/newsletters",
        component: NewslettersPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/admin/newsletters/create",
        component: NewslettersAdminPage,
        roles: ["super_admin"],
    },
    {
        path: "/admin/newsletters/:id",
        component: NewslettersAdminPage,
        roles: ["super_admin"],
    },
    {
        path: "/admin",
        component: AdminDashboard,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/admin/countries",
        component: AdminCountriesPage,
        roles: ["super_admin"],
    },
    {
        path: "/admin/news",
        component: AdminNewsPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/admin/news/create",
        component: ArticleFormPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/admin/news/edit/:id",
        component: ArticleFormPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/admin/categories",
        component: AdminCategoriesPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/admin/projects",
        component: AdminProjectsPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/admin/project/new",
        component: CreateProjectPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/admin/projects/:id",
        component: ProjectDetailPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/admin/documents",
        component: AdminDocumentsPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/admin/events",
        component: AdminEventsPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/admin/events/new",
        component: EventFormPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/admin/events/:id/edit",
        component: EventFormPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/admin/events/edit/:id",
        component: EventFormPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/admin/forum",
        component: AdminForumPage,
        roles: ["super_admin"],
    },
    {
        path: "/admin/membres-associes",
        component: AdminMembersPage,
        roles: ["super_admin", "country_admin"],
    },
    {
        path: "/admin/settings",
        component: AdminSettingsPage,
        roles: ["super_admin"],
    },
    {
        path: "/admin/settings/platform",
        component: PlatformSettingsPage,
        roles: ["super_admin"],
    },
    {
        path: "/admin/settings/apikeys",
        component: ApiKeysSettingsPage,
        roles: ["super_admin"],
    },
    {
        path: "/admin/settings/ip",
        component: IpRestrictionsSettingsPage,
        roles: ["super_admin"],
    },
    {
        path: "/admin/settings/backups",
        component: BackupsSettingsPage,
        roles: ["super_admin"],
    },
    {
        path: "/admin/settings/audit",
        component: AuditLogsSettingsPage,
        roles: ["super_admin"],
    },
    {
        path: "/admin/settings/faq",
        component: FaqSettingsPage,
        roles: ["super_admin"],
    },
    {
        path: "/admin/settings/quarterly",
        component: QuarterlyReportsSettingsPage,
        roles: ["super_admin"],
    },
    {
        path: "/admin/settings/ai",
        component: AiSettingsPage,
        roles: ["super_admin"],
    },
    {
        path: "/admin/settings/fsu",
        component: FsuSettingsPage,
        roles: ["super_admin"],
    },
    // Admin access to general features
    {
        path: "/admin/reports",
        component: ReportsPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/admin/validation",
        component: ValidationListPage,
        roles: ["country_admin", "super_admin"],
    },
    {
        path: "/admin/fsu",
        component: FsuSubmissionsPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/admin/map",
        component: ProjectsMapPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/admin/documents",
        component: DocumentLibraryPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/admin/forum",
        component: ForumPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/admin/notifications",
        component: NotificationsPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/admin/support",
        component: SupportPage,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
]

/** Public routes accessible without authentication. */
export const PUBLIC_ROUTES: AppRouteConfig[] = [
    { path: "/setup-admin", component: AdminSetupPage },
    { path: "/", component: PublicHomePage },
    { path: "/carte-public", component: PublicMapPage },
    { path: "/documents-publics", component: PublicDocumentsPage },
    { path: "/actualites", component: NewsPage },
    { path: "/actualites/:id", component: NewsDetailPage },
    { path: "/forum-public", component: PublicForumPage },
    { path: "/forum-public/:id", component: ForumTopicDetailPage },
    { path: "/projets", component: CallsForProjectsPage },
    { path: "/appels-a-projets", component: CallsForProjectsPage },
    { path: "/a-propos", component: AboutPage },
    { path: "/faq-public", component: PublicFaqPage },
    { path: "/calendrier", component: EventsCalendarPage },
    { path: "/calendrier/:id", component: EventDetailPage },
    { path: "/annuaire-pays-membres", component: CountriesDirectoryPage },
    { path: "/projets-pays/:countryCode", component: CountryProjectsPage },
    { path: "/inscription", component: RegistrationPage },
    { path: "/sutel", component: SUTELPage },
    { path: "/membres-associes", component: AssociatedMembersPage },
    { path: "/notre-histoire", component: OurHistoryPage },
    { path: "/equipe-direction", component: LeadershipTeamPage },
]
