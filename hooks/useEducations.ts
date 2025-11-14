import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export function useCreateEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      curriculumId: string;
      institution: string;
      degree: string;
      fieldOfStudy: string;
      startDate: string;
      endDate?: string;
    }) => {
      // Primeiro cria a educação
      const educationResponse = await api.post('/educations', {
        institution: data.institution,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy,
        startDate: data.startDate,
        endDate: data.endDate || null,
      });

      // Depois associa ao currículo
      await api.post(`/curriculums/${data.curriculumId}/educations/${educationResponse.data.id}`);

      return educationResponse.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', variables.curriculumId] });
    },
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      curriculumId: string;
      name: string;
    }) => {
      const skillResponse = await api.post('/skills', {
        name: data.name,
      });

      await api.post(`/curriculums/${data.curriculumId}/skills/${skillResponse.data.id}`);

      return skillResponse.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', variables.curriculumId] });
    },
  });
}
