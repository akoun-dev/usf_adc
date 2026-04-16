import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Globe, ArrowLeft, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast({ title: t('auth.emailSent'), description: t('auth.emailSentDesc') });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('common.error');
      toast({ title: t('common.error'), description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Globe className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-foreground">{t('auth.resetPassword')}</h1>
        </div>

        <Card>
          {sent ? (
            <>
              <CardHeader>
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green-light">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-center">{t('auth.emailSent')}</CardTitle>
                <CardDescription className="text-center" dangerouslySetInnerHTML={{ __html: t('auth.emailSentMessage', { email }) }} />
              </CardHeader>
              <CardFooter>
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('auth.backToLogin')}
                  </Button>
                </Link>
              </CardFooter>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>{t('auth.forgotPasswordTitle')}</CardTitle>
                <CardDescription>{t('auth.forgotPasswordDesc')}</CardDescription>
              </CardHeader>
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
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('auth.sending') : t('auth.sendLink')}
                </Button>
                <Link to="/login" className="text-sm text-primary hover:underline">
                  <ArrowLeft className="mr-1 inline h-3 w-3" />
                  {t('auth.backToLogin')}
                </Link>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
