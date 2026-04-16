import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { useTranslation } from 'react-i18next';

export default function RegistrationPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const passwordChecks = [
    { label: 'Au moins 8 caractères', valid: password.length >= 8 },
    { label: 'Une lettre majuscule', valid: /[A-Z]/.test(password) },
    { label: 'Une lettre minuscule', valid: /[a-z]/.test(password) },
    { label: 'Un chiffre', valid: /\d/.test(password) },
  ];

  const isPasswordValid = passwordChecks.every((c) => c.valid);
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast({ title: 'Mot de passe invalide', description: 'Veuillez respecter les critères de sécurité.', variant: 'destructive' });
      return;
    }
    if (!doPasswordsMatch) {
      toast({ title: 'Erreur', description: 'Les mots de passe ne correspondent pas.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin + '/login',
        },
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue.';
      toast({ title: 'Erreur d\'inscription', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PublicLayout>
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Inscription réussie !</CardTitle>
              <CardDescription className="text-base">
                Un e-mail de confirmation a été envoyé à <strong>{email}</strong>. Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation pour activer votre compte.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex-col gap-3">
              <Button onClick={() => navigate('/login')} className="w-full">
                Aller à la page de connexion
              </Button>
              <p className="text-xs text-muted-foreground">
                Vous n'avez pas reçu l'e-mail ? Vérifiez votre dossier spam.
              </p>
            </CardFooter>
          </Card>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Créer un compte</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Inscrivez-vous pour accéder à la plateforme USF-ADC
            </p>
          </div>

          <Card className="shadow-lg">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom complet</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Jean Dupont"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    autoComplete="name"
                    className="h-11"
                    maxLength={100}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse e-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nom@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-11"
                    maxLength={255}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* Password strength indicators */}
                  {password.length > 0 && (
                    <div className="space-y-1 pt-1">
                      {passwordChecks.map((check) => (
                        <div key={check.label} className="flex items-center gap-2 text-xs">
                          <div className={`h-1.5 w-1.5 rounded-full ${check.valid ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                          <span className={check.valid ? 'text-primary' : 'text-muted-foreground'}>{check.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="h-11"
                  />
                  {confirmPassword.length > 0 && !doPasswordsMatch && (
                    <p className="text-xs text-destructive">Les mots de passe ne correspondent pas</p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex-col gap-4 pb-6">
                <Button
                  type="submit"
                  className="h-11 w-full text-base"
                  disabled={loading || !isPasswordValid || !doPasswordsMatch}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Inscription en cours…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      S'inscrire
                    </span>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Vous avez déjà un compte ?{' '}
                  <Link to="/login" className="font-medium text-primary hover:underline">
                    Se connecter
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            En vous inscrivant, vous acceptez les conditions d'utilisation de la plateforme USF-ADC.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
