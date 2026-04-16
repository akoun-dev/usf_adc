import { useState, useMemo } from 'react';
import { Search, BookOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useFaqArticles } from '../hooks/useFaqArticles';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';

export default function FaqPage() {
  const { data: articles, isLoading } = useFaqArticles();
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

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero
        title={t('faq.title', 'Base de connaissances')}
        description={t('faq.description', 'Trouvez rapidement des réponses à vos questions')}
        icon={<BookOpen className="h-6 w-6 text-secondary" />}
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('faq.searchPlaceholder', 'Rechercher dans la FAQ…')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {search ? t('faq.noResults', 'Aucun résultat pour cette recherche') : t('faq.empty', 'Aucun article disponible')}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {grouped.map(([category, items]) => (
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
    </div>
  );
}
