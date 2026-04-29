import { Building2, Gavel, Globe, Server, Shield, BookOpen, Mail, Phone, MapPin } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { useTranslation } from 'react-i18next';
import bgHeader from '@/assets/bg-header.jpg';

const sections = [
  { icon: Building2, titleKey: 'public.legal.publisher.title', descKey: 'public.legal.publisher.desc' },
  { icon: Gavel, titleKey: 'public.legal.director.title', descKey: 'public.legal.director.desc' },
  { icon: Globe, titleKey: 'public.legal.hosting.title', descKey: 'public.legal.hosting.desc' },
  { icon: Server, titleKey: 'public.legal.intellectual.title', descKey: 'public.legal.intellectual.desc' },
  { icon: Shield, titleKey: 'public.legal.liability.title', descKey: 'public.legal.liability.desc' },
  { icon: BookOpen, titleKey: 'public.legal.applicableLaw.title', descKey: 'public.legal.applicableLaw.desc' },
];

export default function LegalNoticePage() {
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
              {t('public.legal.title')}
            </h1>
            <p className="text-xl text-base !mt-2">
              {t('public.legal.description')}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="w-full py-10 sm:py-12 px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-10 space-y-10">
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
                {t('public.legal.contact.title')}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('public.legal.contact.desc')}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4 text-primary" />
                <span>{t('public.legal.contact.org')}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{t('public.legal.contact.address')}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:contact@atuuat.africa" className="text-primary hover:underline">
                  contact@atuuat.africa
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>{t('public.legal.contact.phone')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
