import { ReactNode } from 'react';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';

interface PublicLayoutProps {
  children: ReactNode;
  headerVariant?: 'default' | 'transparent';
  footerVariant?: 'default' | 'minimal';
}

export function PublicLayout({ children, headerVariant, footerVariant }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader variant={headerVariant} />
      <main className="flex-1 pt-20">{children}</main>
      <PublicFooter variant={footerVariant} />
    </div>
  );
}
