import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { acceptInvitation } from '../services/invitation-service';
import { useTranslation } from 'react-i18next';

export default function AcceptInvitationPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';

  const [step, setStep] = useState<'signup' | 'accepting' | 'success' | 'error'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setStep('error');
      setErrorMsg(t('invitations.invalidToken'));
    }
  }, [token, t]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Try signup first
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (signUpError) {
      // If user already exists, try login
      if (signUpError.message.includes('already registered')) {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) {
          setErrorMsg(loginError.message);
          setLoading(false);
          return;
        }
      } else {
        setErrorMsg(signUpError.message);
        setLoading(false);
        return;
      }
    }

    // Accept invitation
    setStep('accepting');
    try {
      const result = await acceptInvitation(token);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (result && typeof result === 'object' && (result as any).success) {
        setStep('success');
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setErrorMsg((result as any)?.error || t('invitations.acceptError'));
        setStep('error');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrorMsg(err.message);
      setStep('error');
    }
    setLoading(false);
  };

  if (step === 'accepting') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="py-10 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">{t('invitations.accepting')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="py-10 text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
            <h2 className="text-xl font-bold mt-4">{t('invitations.accepted')}</h2>
            <p className="mt-2 text-muted-foreground">{t('invitations.acceptedDesc')}</p>
            <Button className="mt-6" onClick={() => navigate('/dashboard')}>
              {t('nav.dashboard')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'error' && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="py-10 text-center">
            <XCircle className="h-12 w-12 mx-auto text-destructive" />
            <h2 className="text-xl font-bold mt-4">{t('invitations.invalidToken')}</h2>
            <Button className="mt-6" variant="outline" onClick={() => navigate('/login')}>
              {t('auth.backToLogin')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('invitations.createAccount')}</CardTitle>
        </CardHeader>
        <CardContent>
          {errorMsg && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded text-sm">{errorMsg}</div>
          )}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('profile.fullName')}</Label>
              <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t('auth.email')}</Label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t('auth.password')}</Label>
              <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('common.loading') : t('invitations.createAndAccept')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
