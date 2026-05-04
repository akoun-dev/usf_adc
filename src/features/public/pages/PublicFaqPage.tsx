import { useState, useMemo } from 'react';
import { Search, BookOpen, ChevronDown, ChevronRight, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';
import { PublicLayout } from '../components/PublicLayout';
import { Button } from '@/components/ui/button';
import bgHeader from '@/assets/bg-header.jpg';







function usePublicFaq() {
  return useQuery({
    queryKey: ['public-faq'],
    queryFn: async () => {
      const { data, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('faq_articles' as any)
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data as any[];
    },
  });
}

export default function PublicFaqPage() {
  const { data: articles, isLoading } = usePublicFaq();
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { t } = useTranslation();

  const filtered = useMemo(() => {
    if (!articles) return [];
    if (!search.trim()) return articles;
    const q = search.toLowerCase();
    return articles.filter(
      (a) => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
    );
  }, [articles, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const a of filtered) {
      const arr = map.get(a.category) || [];
      arr.push(a);
      map.set(a.category, arr);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const mockArticles = [
    {
      id: 'mock1',
      category: 'Général',
      title: t('public.faq.mock.q1'),
      content: t('public.faq.mock.a1'),
    },
    {
      id: 'mock2',
      category: 'Général',
      title: t('public.faq.mock.q2'),
      content: t('public.faq.mock.a2'),
    },
    {
      id: 'mock3',
      category: 'Inscription',
      title: t('public.faq.mock.q3'),
      content: t('public.faq.mock.a3'),
    },
  ];

  const displayArticles = articles && articles.length > 0 ? filtered : mockArticles;
  const displayGrouped = articles && articles.length > 0 ? grouped : [['Général', mockArticles]];

  return (
    <PublicLayout>

      <div className="space-y-12 relative bg-gray-50">

        {/* Hero */}
        <div
          className="relative bg-cover bg-center bg-no-repeat pb-5 !m-0 border-b"
          style={{ backgroundImage: `url(${bgHeader})` }}
        >
          <div className="absolute inset-0" />
          <div className="relative text-center max-w-4xl mx-auto space-y-6 h-56 flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">
              {t('public.faq.title')}
            </h1>
            <p className="text-xl text-base !mt-2">
              {t('public.faq.description')}
            </p>
          </div>
        </div>

      </div>






      <div className="w-full px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-10">

        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('public.faq.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}</div>
        ) : displayArticles.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              {search ? t('public.faq.noResults') : t('public.faq.empty')}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {displayGrouped.map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="capitalize">{category}</Badge>
                  <span className="text-xs text-muted-foreground">{items.length} article(s)</span>
                </div>
                <div className="space-y-2">
                  {items.map((article) => {
                    const isOpen = expandedId === article.id;
                    return (
                      <Card
                        key={article.id}
                        className="cursor-pointer transition-shadow hover:shadow-md"
                        onClick={() => setExpandedId(isOpen ? null : article.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0 text-muted-foreground">
                              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm text-foreground">{article.title}</h3>
                              {isOpen && (
                                <div className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                  {article.content}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        {search && displayArticles.length === 0 && (
          <Card className="mt-6 bg-muted/30">
            <CardContent className="p-6 text-center">
              <Mail className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{t('public.faq.noMatchTitle')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('public.faq.noMatchDesc')}
              </p>
              <Button asChild>
                <a href="mailto:contact@atuuat.africa">
                  <Mail className="mr-2 h-4 w-4" />
                  {t('public.faq.contactUs')}
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PublicLayout>
  );
}
