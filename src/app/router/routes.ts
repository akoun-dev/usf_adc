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
const AdminProjectsPage = lazy(
    () => import("@/features/admin/pages/AdminProjectsPage")
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
const AdminCountriesPage = lazy(
    () => import("@/features/admin/pages/AdminCountriesPage")
)
const AdminSettingsPage = lazy(
    () => import("@/features/admin/pages/AdminSettingsPage")
)
const AdminSetupPage = lazy(
    () => import("@/features/admin/pages/AdminSetupPage")
)
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
        path: "/dashboard/public",
        component: PublicExternalDashboard,
        roles: ["point_focal", "country_admin", "super_admin"],
    },
    {
        path: "/dashboard/point-focal",
        component: PointFocalDashboard,
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
        path: "/admin/projects",
        component: AdminProjectsPage,
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
        path: "/admin/forum",
        component: AdminForumPage,
        roles: ["super_admin"],
    },
    {
        path: "/admin/settings",
        component: AdminSettingsPage,
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
