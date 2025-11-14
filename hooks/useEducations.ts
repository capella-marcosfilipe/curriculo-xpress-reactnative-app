import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { Education } from '../types/api';

// ============ HOOKS DE CONSULTA ============

/**
 * Hook para buscar todas as educações do usuário (acervo)
 */
export function useEducations() {
  return useQuery<Education[]>({
    queryKey: ['educations'],
    queryFn: async () => {
      console.log('🎓 Buscando educações...');
      const response = await api.get('/educations');
      console.log('✅ Educações carregadas:', response.data.length || 0);
      return response.data;
    },
  });
}

/**
 * Hook para buscar uma educação específica
 */
export function useEducation(id: string | undefined) {
  return useQuery<Education>({
    queryKey: ['education', id],
    queryFn: async () => {
      if (!id) throw new Error('ID da educação não fornecido');
      console.log('📄 Buscando educação:', id);
      const response = await api.get(`/educations/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// ============ HOOKS DE MUTAÇÃO ============

/**
 * Hook para criar uma nova educação
 */
export function useCreateEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      institution: string;
      degree: string;
      fieldOfStudy: string;
      startDate: string;
      endDate?: string | null;
    }) => {
      console.log('➕ Criando educação:', data.institution);
      const response = await api.post('/educations', data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['educations'] });
      console.log('✅ Educação criada:', data.id);
    },
    onError: (error: any) => {
      console.error('❌ Erro ao criar educação:', error.response?.data || error.message);
    },
  });
}

/**
 * Hook para atualizar uma educação existente
 */
export function useUpdateEducation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      institution?: string;
      degree?: string;
      fieldOfStudy?: string;
      startDate?: string;
      endDate?: string | null;
    }) => {
      console.log('✏️ Atualizando educação:', id);
      const response = await api.put(`/educations/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educations'] });
      queryClient.invalidateQueries({ queryKey: ['education', id] });
      console.log('✅ Educação atualizada:', id);
    },
    onError: (error: any) => {
      console.error('❌ Erro ao atualizar educação:', error.response?.data || error.message);
    },
  });
}

/**
 * Hook para deletar uma educação
 */
export function useDeleteEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deletando educação:', id);
      await api.delete(`/educations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educations'] });
      console.log('✅ Educação deletada com sucesso!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao deletar educação:', error.response?.data || error.message);
    },
  });
}

/**
 * Hook para associar uma educação a um currículo
 */
export function useAddEducationToCurriculum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { curriculumId: string; educationId: string }) => {
      console.log('🔗 Associando educação ao currículo...');
      await api.post(`/curriculums/${data.curriculumId}/educations/${data.educationId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', variables.curriculumId] });
      console.log('✅ Educação associada ao currículo!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao associar educação:', error.response?.data || error.message);
    },
  });
}

/**
 * Hook para remover uma educação de um currículo
 */
export function useRemoveEducationFromCurriculum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { curriculumId: string; educationId: string }) => {
      console.log('🔗 Removendo educação do currículo...');
      await api.delete(`/curriculums/${data.curriculumId}/educations/${data.educationId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', variables.curriculumId] });
      console.log('✅ Educação removida do currículo!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao remover educação:', error.response?.data || error.message);
    },
  });
}
