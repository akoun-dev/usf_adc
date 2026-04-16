import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <ShieldAlert className="mb-4 h-16 w-16 text-destructive" />
      <h1 className="mb-2 text-2xl font-bold text-foreground">Accès refusé</h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        Contactez votre administrateur si vous pensez qu'il s'agit d'une erreur.
      </p>
      <Link to="/">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Button>
      </Link>
    </div>
  );
}
