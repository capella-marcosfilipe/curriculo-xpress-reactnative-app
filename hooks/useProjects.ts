import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { Project } from '../types/api';

// ============ HOOKS DE CONSULTA ============

/**
 * Hook para buscar todos os projetos do usuário (acervo)
 */
export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      console.log('💻 Buscando projetos...');
      const response = await api.get('/projects');
      console.log('✅ Projetos carregados:', response.data.length || 0);
      return response.data;
    },
  });
}

/**
 * Hook para buscar um projeto específico
 */
export function useProject(id: string | undefined) {
  return useQuery<Project>({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) throw new Error('ID do projeto não fornecido');
      console.log('📄 Buscando projeto:', id);
      const response = await api.get(`/projects/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// ============ HOOKS DE MUTAÇÃO ============

/**
 * Hook para criar um novo projeto
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      url?: string | null;
    }) => {
      console.log('➕ Criando projeto:', data.name);
      const response = await api.post('/projects', data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      console.log('✅ Projeto criado:', data.id);
    },
    onError: (error: any) => {
      console.error('❌ Erro ao criar projeto:', error.response?.data || error.message);
    },
  });
}

/**
 * Hook para atualizar um projeto existente
 */
export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name?: string;
      description?: string;
      url?: string | null;
    }) => {
      console.log('✏️ Atualizando projeto:', id);
      const response = await api.put(`/projects/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      console.log('✅ Projeto atualizado:', id);
    },
    onError: (error: any) => {
      console.error('❌ Erro ao atualizar projeto:', error.response?.data || error.message);
    },
  });
}

/**
 * Hook para deletar um projeto
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deletando projeto:', id);
      await api.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      console.log('✅ Projeto deletado com sucesso!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao deletar projeto:', error.response?.data || error.message);
    },
  });
}

/**
 * Hook para associar um projeto a um currículo
 */
export function useAddProjectToCurriculum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { curriculumId: string; projectId: string }) => {
      console.log('🔗 Associando projeto ao currículo...');
      await api.post(`/curriculums/${data.curriculumId}/projects/${data.projectId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', variables.curriculumId] });
      console.log('✅ Projeto associado ao currículo!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao associar projeto:', error.response?.data || error.message);
    },
  });
}

/**
 * Hook para remover um projeto de um currículo
 */
export function useRemoveProjectFromCurriculum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { curriculumId: string; projectId: string }) => {
      console.log('🔗 Removendo projeto do currículo...');
      await api.delete(`/curriculums/${data.curriculumId}/projects/${data.projectId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', variables.curriculumId] });
      console.log('✅ Projeto removido do currículo!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao remover projeto:', error.response?.data || error.message);
    },
  });
}
