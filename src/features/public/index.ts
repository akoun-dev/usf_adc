// Public Pages
export { default as PublicHomePage } from './pages/PublicHomePage';
export { default as PublicMapPage } from './pages/PublicMapPage';
export { default as PublicDocumentsPage } from './pages/PublicDocumentsPage';
export { default as NewsPage } from './pages/NewsPage';
export { default as PublicForumPage } from './pages/PublicForumPage';
export { default as CallsForProjectsPage } from './pages/CallsForProjectsPage';
export { default as AboutPage } from './pages/AboutPage';
export { default as PublicFaqPage } from './pages/PublicFaqPage';
export { default as RegistrationPage } from './pages/RegistrationPage';
export { default as EventsCalendarPage } from './pages/EventsCalendarPage';

// Public Components
export { PublicHeader } from './components/PublicHeader';
export { PublicFooter } from './components/PublicFooter';
export { PublicLayout } from './components/PublicLayout';

// Public Hooks
export { usePublicNews, useNewsByCategory, useNewsByLanguage, useLatestNews, type NewsArticle } from './hooks/usePublicNews';
export { usePublicEvents, usePastEvents, useEvent, useEventsByType, useEventsByCountry, type PublicEvent } from './hooks/usePublicEvents';
export { usePublicProjects, usePublicProjectsByCountry, usePublicProjectsByThematic, usePublicProjectStats, useProjectsForMap, type PublicProject, type ProjectStats } from './hooks/usePublicProjects';
export { usePublicDocuments, usePublicDocumentsByCategory, usePublicDocumentsByLanguage, usePublicDocumentsByType, useFeaturedDocuments, usePublicDocumentStats, useDocumentSearch, getDocumentUrl, type PublicDocument, type DocumentStats } from './hooks/usePublicDocuments';
export { useCountries, useCountriesByRegion, useCountryByISO, useCountryById, useRegions, useCountriesWithProjectCount, useCountrySearch, REGIONS } from './hooks/useCountries';
export { useProjectCalls, type ProjectCall } from './hooks/useProjectCalls';

// Public Services (direct access if needed)
export * from './services';
