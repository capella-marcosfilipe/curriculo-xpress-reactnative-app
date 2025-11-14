import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { Skill } from '../types/api';

// ============ HOOKS DE CONSULTA ============

/**
 * Hook para buscar todas as skills do usuário (acervo)
 */
export function useSkills() {
  return useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: async () => {
      console.log('⭐ Buscando skills...');
      const response = await api.get('/skills');
      console.log('✅ Skills carregadas:', response.data.length || 0);
      return response.data;
    },
  });
}

/**
 * Hook para buscar uma skill específica
 */
export function useSkill(id: string | undefined) {
  return useQuery<Skill>({
    queryKey: ['skill', id],
    queryFn: async () => {
      if (!id) throw new Error('ID da skill não fornecido');
      console.log('📄 Buscando skill:', id);
      const response = await api.get(`/skills/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// ============ HOOKS DE MUTAÇÃO ============

/**
 * Hook para criar uma nova skill
 */
export function useCreateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; level?: string | null }) => {
      console.log('➕ Criando skill:', data.name);
      const response = await api.post('/skills', data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      console.log('✅ Skill criada:', data.id);
    },
    onError: (error: any) => {
      console.error('❌ Erro ao criar skill:', error.response?.data || error.message);
    },
  });
}

/**
 * Hook para atualizar uma skill existente
 */
export function useUpdateSkill(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name?: string; level?: string | null }) => {
      console.log('✏️ Atualizando skill:', id);
      const response = await api.put(`/skills/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['skill', id] });
      console.log('✅ Skill atualizada:', id);
    },
    onError: (error: any) => {
      console.error('❌ Erro ao atualizar skill:', error.response?.data || error.message);
    },
  });
}

/**
 * Hook para deletar uma skill
 */
export function useDeleteSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deletando skill:', id);
      await api.delete(`/skills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      console.log('✅ Skill deletada com sucesso!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao deletar skill:', error.response?.data || error.message);
    },
  });
}

/**
 * Hook para associar uma skill a um currículo
 */
export function useAddSkillToCurriculum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { curriculumId: string; skillId: string }) => {
      console.log('🔗 Associando skill ao currículo...');
      await api.post(`/curriculums/${data.curriculumId}/skills/${data.skillId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', variables.curriculumId] });
      console.log('✅ Skill associada ao currículo!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao associar skill:', error.response?.data || error.message);
    },
  });
}

/**
 * Hook para remover uma skill de um currículo
 */
export function useRemoveSkillFromCurriculum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { curriculumId: string; skillId: string }) => {
      console.log('🔗 Removendo skill do currículo...');
      await api.delete(`/curriculums/${data.curriculumId}/skills/${data.skillId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', variables.curriculumId] });
      console.log('✅ Skill removida do currículo!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao remover skill:', error.response?.data || error.message);
    },
  });
}
