interface PageHeroProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export default function PageHero({ title, description, icon, children }: PageHeroProps) {
  return (
    <div className="mb-8 border-b">
      <div className="py-6 lg:py-8">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">{title}</h1>
            {description && (
              <p className="mt-1.5 text-sm text-muted-foreground lg:text-base">{description}</p>
            )}
          </div>
        </div>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}
