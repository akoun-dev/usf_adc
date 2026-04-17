import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminService from '../services/admin-service';

export function useNews() {
  return useQuery({
    queryKey: ['admin-news'],
    queryFn: adminService.getNews,
  });
}

export function useCreateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.createNews,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-news'] }),
  });
}

export function useUpdateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string; title?: string; content?: string; category?: string; image_url?: string; is_public?: boolean }) =>
      adminService.updateNews(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-news'] }),
  });
}

export function useDeleteNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteNews,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-news'] }),
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ['admin-projects'],
    queryFn: adminService.getProjects,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.createProject,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-projects'] }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string; title?: string; description?: string; country_id?: string; status?: string; region?: string }) =>
      adminService.updateProject(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-projects'] }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteProject,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-projects'] }),
  });
}

export function useDocuments() {
  return useQuery({
    queryKey: ['admin-documents'],
    queryFn: adminService.getDocuments,
  });
}

export function useCreateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.createDocument,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-documents'] }),
  });
}

export function useUpdateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { 
      id: string; 
      title?: string; 
      description?: string; 
      category?: string; 
      is_public?: boolean;
      tags?: string[]
    }) => adminService.updateDocument(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-documents'] }),
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteDocument,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-documents'] }),
  });
}

export function useSearchDocuments() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (params: { searchTerm?: string; categories?: string[]; tags?: string[] }) => 
      adminService.searchDocuments(params),
    onSuccess: (data) => {
      // Update the query cache with search results
      queryClient.setQueryData(['search-results'], data);
    }
  });
  
  const { data } = useQuery({
    queryKey: ['search-results'],
    initialData: []
  });
  
  return {
    ...mutation,
    data
  };
}

export function useDocumentTags() {
  return useQuery({
    queryKey: ['document-tags'],
    queryFn: adminService.getDocumentTags,
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ['admin-events'],
    queryFn: adminService.getEvents,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.createEvent,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-events'] }),
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string; title?: string; description?: string; start_date?: string; end_date?: string; location?: string }) =>
      adminService.updateEvent(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-events'] }),
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteEvent,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-events'] }),
  });
}

export function useForumCategories() {
  return useQuery({
    queryKey: ['admin-forum-categories'],
    queryFn: adminService.getForumCategories,
  });
}

export function useCreateForumCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.createForumCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-forum-categories'] }),
  });
}

export function useUpdateForumCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string; name?: string; description?: string; color?: string }) =>
      adminService.updateForumCategory(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-forum-categories'] }),
  });
}

export function useDeleteForumCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteForumCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-forum-categories'] }),
  });
}

// Forum Topics Management
export function useForumTopics() {
  return useQuery({
    queryKey: ['admin-forum-topics'],
    queryFn: adminService.getForumTopics,
  });
}

export function useUpdateForumTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string; status?: string; title?: string }) =>
      adminService.updateForumTopic(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-forum-topics'] }),
  });
}

export function useDeleteForumTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteForumTopic,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-forum-topics'] }),
  });
}

// Associated Members Management
export function useAssociatedMembers() {
  return useQuery({
    queryKey: ['admin-associated-members'],
    queryFn: adminService.getAssociatedMembers,
  });
}

export function useCreateAssociatedMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.createAssociatedMember,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-associated-members'] }),
  });
}

export function useUpdateAssociatedMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string; [key: string]: any }) =>
      adminService.updateAssociatedMember(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-associated-members'] }),
  });
}

export function useDeleteAssociatedMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteAssociatedMember,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-associated-members'] }),
  });
}

// Partners Management
export function usePartners() {
  return useQuery({
    queryKey: ['admin-partners'],
    queryFn: adminService.getPartners,
  });
}

export function useCreatePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.createPartner,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-partners'] }),
  });
}

export function useUpdatePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string; [key: string]: any }) =>
      adminService.updatePartner(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-partners'] }),
  });
}

export function useDeletePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.deletePartner,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-partners'] }),
  });
}
