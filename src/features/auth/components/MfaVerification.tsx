import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Shield, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface MfaVerificationProps {
  onVerified: () => void;
  onCancel: () => void;
}

export function MfaVerification({ onVerified, onCancel }: MfaVerificationProps) {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [emailHint, setEmailHint] = useState('');
  const [method, setMethod] = useState('email');
  const [cooldown, setCooldown] = useState(0);

  const sendCode = useCallback(async () => {
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-mfa-code', {
        method: 'POST',
        body: {},
      });
      if (error) throw error;
      if (data?.email_hint) setEmailHint(data.email_hint);
      if (data?.method) setMethod(data.method);
      setCooldown(60);
      toast.success(t('mfa.codeSent'));
    } catch (err: any) {
      toast.error(err.message || t('mfa.sendError'));
    }
    setSending(false);
  }, [t]);

  useEffect(() => {
    sendCode();
  }, [sendCode]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async () => {
    if (code.length !== 6) return;
    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-mfa-code', {
        method: 'POST',
        body: { code },
      });
      if (error) throw error;
      if (data?.verified) {
        toast.success(t('mfa.verified'));
        onVerified();
      } else {
        toast.error(t('mfa.invalidCode'));
        setCode('');
      }
    } catch (err: any) {
      toast.error(err.message || t('mfa.verifyError'));
    }
    setVerifying(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>{t('mfa.title')}</CardTitle>
          <CardDescription>
            {method === 'email'
              ? t('mfa.emailDesc', { hint: emailHint })
              : method === 'telegram'
                ? t('mfa.telegramDesc')
                : t('mfa.smsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            className="w-full"
            onClick={handleVerify}
            disabled={code.length !== 6 || verifying}
          >
            {verifying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('mfa.verifying')}
              </>
            ) : (
              t('mfa.verify')
            )}
          </Button>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={sendCode}
              disabled={sending || cooldown > 0}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {cooldown > 0
                ? t('mfa.resendIn', { seconds: cooldown })
                : t('mfa.resend')}
            </Button>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              {t('mfa.cancel')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
