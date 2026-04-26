import { Link } from 'react-router-dom';
import { Info, Users, Globe, Target, Handshake, Mail, Phone, MapPin, Award, UserCog } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageHero from '@/components/PageHero';
import atuLogo from '@/assets/atu-uat-logo.png';
import omoPhoto from '@/assets/equipe/Omo.png';
import mwalePhoto from '@/assets/equipe/Mwale.png';
import slimaniPhoto from '@/assets/equipe/Slimani.png';
import boatengPhoto from '@/assets/equipe/Boateng.png';
import balloPhoto from '@/assets/equipe/Ballo.png';

// Directors data with stable IDs
const directors = [
  { id: 'mwale', photo: mwalePhoto },
  { id: 'slimani', photo: slimaniPhoto },
  { id: 'boateng', photo: boatengPhoto },
  { id: 'ballo', photo: balloPhoto },
] as const;

const partners = [
  { name: 'Union Africaine', type: 'Institution' },
  { name: 'UIT', type: 'Institution' },
  { name: 'Smart Africa', type: 'Partenaire' },
  { name: 'Banque Mondiale', type: 'Partenaire' },
  { name: 'BAD', type: 'Partenaire' },
  { name: 'CEDEAO', type: 'Régional' },
  { name: 'EAC', type: 'Régional' },
  { name: 'COMESA', type: 'Régional' },
];

const objectives = [
  {
    icon: Globe,
    titleKey: 'public.about.objectives.universal.title',
    descKey: 'public.about.objectives.universal.desc',
  },
  {
    icon: Users,
    titleKey: 'public.about.objectives.inclusion.title',
    descKey: 'public.about.objectives.inclusion.desc',
  },
  {
    icon: Target,
    titleKey: 'public.about.objectives.monitoring.title',
    descKey: 'public.about.objectives.monitoring.desc',
  },
  {
    icon: Handshake,
    titleKey: 'public.about.objectives.collaboration.title',
    descKey: 'public.about.objectives.collaboration.desc',
  },
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <PageHero
          title={t('public.about.title')}
          description={t('public.about.description')}
        />
        {/* About USF-ADC */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                {t('public.about.whatIs.title')}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t('public.about.whatIs.p1')}
              </p>
              <p className="text-muted-foreground mb-4">
                {t('public.about.whatIs.p2')}
              </p>
              <div className="flex gap-4 mt-6">
                <Button asChild>
                  <Link to="/carte-public">{t('public.about.viewMap')}</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <img src={atuLogo} alt="UAT Logo" className="h-48 w-48 rounded-2xl shadow-lg" />
            </div>
          </div>
        </section>

        {/* Objectives */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('public.about.objectives.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('public.about.objectives.description')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {objectives.map((obj, i) => (
              <Card key={i} className="text-center">
                <CardContent className="p-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                    <obj.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{t(obj.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(obj.descKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Leadership Structure */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">{t('public.about.leadership.title')}</Badge>
            <h2 className="text-3xl font-bold mb-4">
              {t('public.about.leadership.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('public.about.leadership.description')}
            </p>
          </div>

          {/* Secretary General */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={omoPhoto}
                    alt={t('public.about.leadership.secretaryGeneral.name')}
                    className="h-28 w-28 rounded-2xl object-cover shadow-lg border-4 border-white/50"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <Badge className="mb-2">{t('public.about.leadership.secretaryGeneral.title')}</Badge>
                  <h3 className="text-2xl font-bold mb-2">
                    {t('public.about.leadership.secretaryGeneral.name')}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t('public.about.leadership.secretaryGeneral.since')}
                  </p>
                  <p className="text-muted-foreground">
                    {t('public.about.leadership.secretaryGeneral.description')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Directors */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              {t('public.about.leadership.directors.title')}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {directors.map((director) => (
                <Card key={director.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={director.photo}
                          alt={t(`public.about.leadership.directors.${director.id}.name`)}
                          className="h-32 w-32 rounded-xl object-cover shadow-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">
                          {t(`public.about.leadership.directors.${director.id}.name`)}
                        </h4>
                        <Badge variant="outline" className="mb-3 text-xs">
                          {t(`public.about.leadership.directors.${director.id}.role`)}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {t(`public.about.leadership.directors.${director.id}.description`)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('public.about.partners.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('public.about.partners.description')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {partners.map((partner, i) => (
              <Card key={i} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="h-16 w-16 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-2xl font-bold text-muted-foreground">
                      {partner.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm">{partner.name}</h3>
                  <Badge variant="outline" className="mt-2 text-xs">{partner.type}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* History */}
        <section className="mb-16">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">
                {t('public.about.history.title')}
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  </div>
                  <div className="pb-6">
                    <h3 className="font-semibold">{t('public.about.history.phase1')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('public.about.history.phase1Desc')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  </div>
                  <div className="pb-6">
                    <h3 className="font-semibold">{t('public.about.history.phase2')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('public.about.history.phase2Desc')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('public.about.history.phase3')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('public.about.history.phase3Desc')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact */}
        <section>
          <div className="bg-muted/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              {t('public.about.contact.title')}
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <a href="mailto:contact@atuuat.africa" className="flex items-center gap-3 hover:underline">
                <Mail className="h-5 w-5 text-primary" />
                <span>contact@atuuat.africa</span>
              </a>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>+225 XX XX XX XX XX</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Abidjan, Côte d\'Ivoire</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
