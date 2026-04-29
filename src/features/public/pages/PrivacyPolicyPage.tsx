import { Shield, Lock, Eye, Server, Users, Bell, Cookie, Mail } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { useTranslation } from 'react-i18next';
import bgHeader from '@/assets/bg-header.jpg';

const sections = [
  { icon: Eye, titleKey: 'public.privacy.collection.title', descKey: 'public.privacy.collection.desc' },
  { icon: Server, titleKey: 'public.privacy.usage.title', descKey: 'public.privacy.usage.desc' },
  { icon: Lock, titleKey: 'public.privacy.security.title', descKey: 'public.privacy.security.desc' },
  { icon: Users, titleKey: 'public.privacy.sharing.title', descKey: 'public.privacy.sharing.desc' },
  { icon: Bell, titleKey: 'public.privacy.rights.title', descKey: 'public.privacy.rights.desc' },
  { icon: Cookie, titleKey: 'public.privacy.cookies.title', descKey: 'public.privacy.cookies.desc' },
];

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <div className="space-y-0 relative bg-gray-50">
        {/* Hero */}
        <div
          className="relative bg-cover bg-center bg-no-repeat pb-5 !m-0 border-b"
          style={{ backgroundImage: `url(${bgHeader})` }}
        >
          <div className="absolute inset-0" />
          <div className="relative text-center max-w-4xl mx-auto space-y-6 h-56 flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">
              {t('public.privacy.title')}
            </h1>
            <p className="text-xl text-base !mt-2">
              {t('public.privacy.description')}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="w-full py-10 sm:py-12 px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-10 space-y-10">
          {/* Intro */}
          <div className="bg-white rounded-xl border p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {t('public.privacy.intro.title')}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('public.privacy.intro.desc')}
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              {t('public.privacy.intro.lastUpdate')}
            </p>
          </div>

          {/* Sections */}
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-xl border p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {t(section.titleKey)}
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {t(section.descKey)}
              </p>
            </div>
          ))}

          {/* Contact */}
          <div className="bg-primary/5 rounded-xl border border-primary/20 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {t('public.privacy.contact.title')}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('public.privacy.contact.desc')}
            </p>
            <a
              href="mailto:contact@atuuat.africa"
              className="inline-flex items-center gap-2 mt-4 text-primary font-medium hover:underline"
            >
              <Mail className="h-4 w-4" />
              contact@atuuat.africa
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
