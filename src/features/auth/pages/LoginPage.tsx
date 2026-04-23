import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Shield, Wifi, BarChart3 } from 'lucide-react';
import { ROLE_DASHBOARD_PATHS } from '@/core/constants/roles';
import { useTranslation } from 'react-i18next';
import heroLogin from '@/assets/hero-login.jpg';
import atuLogo from '@/assets/atu-uat-logo.png';
import { PublicHeader } from '@/features/public/components/PublicHeader';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, isAuthenticated, isLoading, highestRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const role = highestRole();
      const path = role ? ROLE_DASHBOARD_PATHS[role] : '/dashboard';
      navigate(path, { replace: true });
    }
  }, [isAuthenticated, isLoading, highestRole, navigate]);

  // Hide the login button in the header since we're already on the login page
  const navGroupsWithHiddenLogin = [
    {
      labelKey: "home",
      href: "/",
    },
    {
      labelKey: "usfAdc",
      items: [
        { href: "/annuaire-pays-membres", labelKey: "memberStates" },
        { href: "/membres-associes", labelKey: "associatedMembers" },
      ],
    },
    {
      labelKey: "projects",
      items: [
        { href: "/carte-public", labelKey: "map" },
        { href: "/projets", labelKey: "calls" },
        { href: "/calendrier", labelKey: "calendar" },
      ],
    },
    {
      labelKey: "resources",
      items: [
        { href: "/documents-publics", labelKey: "documents" },
        { href: "/forum-public", labelKey: "forum" },
      ],
    },
    {
      labelKey: "news",
      href: "/actualites",
    },
    {
      labelKey: "about",
      items: [
        { href: "/notre-histoire", labelKey: "ourHistory" },
        { href: "/equipe-direction", labelKey: "leadership" },
        { href: "/faq-public", labelKey: "faq" },
      ],
    },
    {
      labelKey: "sutel",
      href: "/sutel",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast({ title: t('auth.loginSuccess'), description: t('auth.loginSuccessDesc') });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('auth.loginError');
      toast({ title: t('auth.loginError'), description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Public Header */}
      <PublicHeader variant="transparent" />
      
      <div className="flex flex-1">
        {/* Left panel — Hero visual */}
        <div className="relative hidden w-1/2 lg:block xl:w-[55%]">
        <img
          src={heroLogin}
          alt="Connectivité numérique africaine"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(152,100%,14%)/0.88] via-[hsl(152,100%,20%)/0.75] to-[hsl(54,100%,50%)/0.25]" />

        {/* Hero content */}
        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          {/* Logo */}
           <div className="flex items-center gap-3">
              <img src={atuLogo} alt="ATU/UAT" className="h-12 w-12 rounded-xl" />
              <div>
                <span className="text-xl font-bold text-white">USF-ADC</span>
                <span className="ml-2 text-sm text-white/60">ATU/UAT</span>
              </div>
            </div>

          {/* Main hero text */}
          <div className="max-w-lg space-y-6">
            <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
              {t('auth.heroTitle', { defaultValue: 'Connecter l\'Afrique au numérique' })}
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              {t('auth.heroSubtitle', { defaultValue: 'Plateforme de suivi du Fonds de Service Universel — Accès au numérique pour tous les citoyens africains.' })}
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Shield, label: t('auth.heroPill1', { defaultValue: 'Sécurisé 2FA' }) },
                { icon: Wifi, label: t('auth.heroPill2', { defaultValue: '54 pays connectés' }) },
                { icon: BarChart3, label: t('auth.heroPill3', { defaultValue: 'Rapports en temps réel' }) },
              ].map((pill) => (
                <div key={pill.label} className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                  <pill.icon className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-medium text-white/90">{pill.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom attribution */}
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Union Africaine des Télécommunications
          </p>
        </div>
      </div>

      {/* Right panel — Login form */}
      <div className="flex w-full flex-col items-center justify-center bg-background px-6 lg:w-1/2 xl:w-[45%]">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex flex-col items-center gap-3 text-center lg:hidden">
            <img src={atuLogo} alt="ATU/UAT" className="h-16 w-16" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t('auth.platformTitle')}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{t('auth.platformSubtitle')}</p>
            </div>
          </div>

          <Card className="border-0 shadow-lg lg:border lg:shadow-xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl">{t('auth.login')}</CardTitle>
              <CardDescription>{t('auth.loginDesc')}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nom@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                      {t('auth.forgotPassword')}
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-11"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button type="submit" className="h-11 w-full text-base" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      {t('auth.signingIn')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      {t('auth.signIn')}
                    </span>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link to="/inscription" className="font-medium text-primary hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
