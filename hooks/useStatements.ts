import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { Statement, CreateStatementPayload } from '../types/api';

// ============ HOOKS DE CONSULTA ============

/**
 * Hook para buscar todos os statements do usuário
 */
export function useStatements() {
  return useQuery<Statement[]>({
    queryKey: ['statements'],
    queryFn: async () => {
      console.log('📝 Buscando statements...');
      const response = await api.get('/statements');
      console.log('✅ Statements carregados:', response.data.length || 0);
      return response.data;
    },
  });
}

/**
 * Hook para buscar um statement específico
 */
export function useStatement(id: string | undefined) {
  return useQuery<Statement>({
    queryKey: ['statement', id],
    queryFn: async () => {
      if (!id) throw new Error('ID do statement não fornecido');
      console.log('📄 Buscando statement:', id);
      const response = await api.get(`/statements/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// ============ HOOKS DE MUTAÇÃO ============

/**
 * Hook para criar um statement manualmente
 */
export function useCreateStatement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStatementPayload) => {
      console.log('➕ Criando statement:', data);
      const response = await api.post('/statements', data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['statements'] });
      console.log('✅ Statement criado:', data.id);
    },
    onError: (error: any) => {
      console.error('❌ Erro ao criar statement:', error.response?.data || error.message);
    },
  });
}

/**
 * Hook para gerar statement com IA (Google Gemini)
 */
export function useGenerateStatementWithAI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { curriculumId: string; jobDescription: string }) => {
      console.log('🤖 Gerando statement com IA...');
      console.log('📋 Currículo:', data.curriculumId);
      console.log('💼 Job Description:', data.jobDescription.substring(0, 100) + '...');
      
      const response = await api.post('/ai/generate-statement', data);
      
      console.log('✅ Statement gerado com sucesso!');
      return response.data;
    },
    onSuccess: () => {
      // Invalida queries para recarregar listas
      queryClient.invalidateQueries({ queryKey: ['statements'] });
      queryClient.invalidateQueries({ queryKey: ['curriculums'] });
      console.log('✅ Statement gerado e salvo!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao gerar statement:', error.response?.data || error.message);
    },
  });
}

/**
 * Hook para deletar um statement
 */
export function useDeleteStatement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deletando statement:', id);
      await api.delete(`/statements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statements'] });
      console.log('✅ Statement deletado com sucesso!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao deletar statement:', error.response?.data || error.message);
    },
  });
}
