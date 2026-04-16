import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCategories } from '../hooks/useTopics';
import { useCreateTopic } from '../hooks/useCreateTopic';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export function NewTopicForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const { data: categories } = useCategories();
  const { mutate, isPending } = useCreateTopic();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId || !user) return;

    mutate(
      { title: title.trim(), content: content.trim(), category_id: categoryId, created_by: user.id },
      {
        onSuccess: (topic) => {
          toast({ title: 'Sujet créé avec succès' });
          navigate(`/forum/${topic.id}`);
        },
        onError: () => {
          toast({ title: 'Erreur', description: 'Impossible de créer le sujet.', variant: 'destructive' });
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouveau sujet de discussion</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du sujet"
              required
              maxLength={200}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {(categories || []).map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Contenu</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Décrivez votre sujet…"
              className="min-h-[150px]"
              required
              maxLength={5000}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate('/forum')}>Annuler</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Publication…' : 'Publier le sujet'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
