
ALTER TABLE public.forum_topics
ADD CONSTRAINT forum_topics_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);

ALTER TABLE public.forum_posts
ADD CONSTRAINT forum_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id);
