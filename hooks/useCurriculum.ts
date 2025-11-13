import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type {
    CreateCurriculumPayload,
    Curriculum,
    CurriculumListItem
} from '../types/api';

/**
 * Hook para buscar todos os currículos do usuário
 * Retorna uma lista simplificada
 */
export function useCurriculums() {
  return useQuery<CurriculumListItem[]>({
    queryKey: ['curriculums'],
    queryFn: async () => {
      console.log('📋 Buscando currículos...');
      const response = await api.get('/curriculums');
      console.log('✅ Currículos carregados:', response.data.length);
      return response.data;
    },
  });
}

/**
 * Hook para buscar um currículo específico com todos os detalhes
 */
export function useCurriculum(id: string | undefined) {
  return useQuery<Curriculum>({
    queryKey: ['curriculum', id],
    queryFn: async () => {
      if (!id) throw new Error('ID do currículo não fornecido');
      console.log('📄 Buscando currículo:', id);
      const response = await api.get(`/curriculums/${id}`);
      console.log('✅ Currículo carregado:', response.data.title);
      return response.data;
    },
    enabled: !!id, // Só executa se houver ID
  });
}

// ============ HOOKS DE MUTAÇÃO ============

/**
 * Hook para criar um novo currículo
 */
export function useCreateCurriculum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCurriculumPayload) => {
      console.log('➕ Criando currículo:', data);
      const response = await api.post('/curriculums', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalida a query para recarregar a lista
      queryClient.invalidateQueries({ queryKey: ['curriculums'] });
      console.log('✅ Currículo criado:', data.id);
    },
    onError: (error: any) => {
      console.error('❌ Erro ao criar currículo:', error.response?.data || error.message);
    },
  });
}

/**
 * Hook para deletar um currículo
 */
export function useDeleteCurriculum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deletando currículo:', id);
      await api.delete(`/curriculums/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculums'] });
      console.log('✅ Currículo deletado com sucesso!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao deletar currículo:', error.response?.data || error.message);
    },
  });
}