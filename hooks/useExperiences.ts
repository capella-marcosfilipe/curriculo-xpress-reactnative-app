import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { Experience } from '../types/api';

// ============ HOOKS DE CONSULTA ============

/**
 * Hook para buscar todas as experiências do usuário (acervo)
 */
export function useExperiences() {
  return useQuery<Experience[]>({
    queryKey: ['experiences'],
    queryFn: async () => {
      console.log('💼 Buscando experiências...');
      const response = await api.get('/experiences');
      console.log('✅ Experiências carregadas:', response.data.length || 0);
      return response.data;
    },
  });
}

/**
 * Hook para buscar uma experiência específica
 */
export function useExperience(id: string | undefined) {
  return useQuery<Experience>({
    queryKey: ['experience', id],
    queryFn: async () => {
      if (!id) throw new Error('ID da experiência não fornecido');
      console.log('📄 Buscando experiência:', id);
      const response = await api.get(`/experiences/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// ============ HOOKS DE MUTAÇÃO ============

/**
 * Hook para criar uma nova experiência
 */
export function useCreateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      company: string;
      title: string;
      description: string;
      startDate: string;
      endDate?: string | null;
    }) => {
      console.log('➕ Criando experiência:', data.company);
      const response = await api.post('/experiences', data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      console.log('✅ Experiência criada:', data.id);
    },
    onError: (error: any) => {
      console.error('❌ Erro ao criar experiência:', error.response?.data || error.message);
    },
  });
}

/**
 * Hook para atualizar uma experiência existente
 */
export function useUpdateExperience(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      company?: string;
      title?: string;
      description?: string;
      startDate?: string;
      endDate?: string | null;
    }) => {
      console.log('✏️ Atualizando experiência:', id);
      const response = await api.put(`/experiences/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      queryClient.invalidateQueries({ queryKey: ['experience', id] });
      console.log('✅ Experiência atualizada:', id);
    },
    onError: (error: any) => {
      console.error('❌ Erro ao atualizar experiência:', error.response?.data || error.message);
    },
  });
}

/**
 * Hook para deletar uma experiência
 */
export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deletando experiência:', id);
      await api.delete(`/experiences/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      console.log('✅ Experiência deletada com sucesso!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao deletar experiência:', error.response?.data || error.message);
    },
  });
}

/**
 * Hook para associar uma experiência a um currículo
 */
export function useAddExperienceToCurriculum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { curriculumId: string; experienceId: string }) => {
      console.log('🔗 Associando experiência ao currículo...');
      await api.post(`/curriculums/${data.curriculumId}/experiences/${data.experienceId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', variables.curriculumId] });
      console.log('✅ Experiência associada ao currículo!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao associar experiência:', error.response?.data || error.message);
    },
  });
}

/**
 * Hook para remover uma experiência de um currículo
 */
export function useRemoveExperienceFromCurriculum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { curriculumId: string; experienceId: string }) => {
      console.log('🔗 Removendo experiência do currículo...');
      await api.delete(`/curriculums/${data.curriculumId}/experiences/${data.experienceId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', variables.curriculumId] });
      console.log('✅ Experiência removida do currículo!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao remover experiência:', error.response?.data || error.message);
    },
  });
}
