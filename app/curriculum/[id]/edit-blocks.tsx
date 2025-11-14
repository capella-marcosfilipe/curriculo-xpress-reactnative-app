import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  ButtonText,
  Spinner,
  Card,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
  Divider,
  Badge,
  BadgeText,
  Alert,
  AlertIcon,
  AlertText,
} from '@gluestack-ui/themed';
import { ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

// Imports dos hooks
import { useCurriculum } from '../../../hooks/useCurriculums';
import { 
  useEducations, 
  useAddEducationToCurriculum, 
  useRemoveEducationFromCurriculum 
} from '../../../hooks/useEducations';
import { 
  useExperiences, 
  useAddExperienceToCurriculum, 
  useRemoveExperienceFromCurriculum 
} from '../../../hooks/useExperiences';
import { 
  useSkills, 
  useAddSkillToCurriculum, 
  useRemoveSkillFromCurriculum 
} from '../../../hooks/useSkills';
import { 
  useProjects, 
  useAddProjectToCurriculum, 
  useRemoveProjectFromCurriculum 
} from '../../../hooks/useProjects';

export default function EditBlocksScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Buscar currículo atual
  const { data: curriculum, isLoading: loadingCurriculum, refetch } = useCurriculum(id);

  // Buscar todos os blocos do usuário (acervo)
  const { data: allEducations, isLoading: loadingEducations } = useEducations();
  const { data: allExperiences, isLoading: loadingExperiences } = useExperiences();
  const { data: allSkills, isLoading: loadingSkills } = useSkills();
  const { data: allProjects, isLoading: loadingProjects } = useProjects();

  // Hooks de associação/desassociação
  const addEducation = useAddEducationToCurriculum();
  const removeEducation = useRemoveEducationFromCurriculum();
  const addExperience = useAddExperienceToCurriculum();
  const removeExperience = useRemoveExperienceFromCurriculum();
  const addSkill = useAddSkillToCurriculum();
  const removeSkill = useRemoveSkillFromCurriculum();
  const addProject = useAddProjectToCurriculum();
  const removeProject = useRemoveProjectFromCurriculum();

  // Estados locais para checkboxes
  const [selectedEducations, setSelectedEducations] = useState<Set<string>>(new Set());
  const [selectedExperiences, setSelectedExperiences] = useState<Set<string>>(new Set());
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Inicializar seleções baseado no currículo atual
  useEffect(() => {
    if (curriculum) {
      setSelectedEducations(new Set(curriculum.educations?.map(e => e.id) || []));
      setSelectedExperiences(new Set(curriculum.experiences?.map(e => e.id) || []));
      setSelectedSkills(new Set(curriculum.skills?.map(s => s.id) || []));
      setSelectedProjects(new Set(curriculum.projects?.map(p => p.id) || []));
    }
  }, [curriculum]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    
    try {
      console.log('💾 Salvando alterações...');

      // IDs atuais no currículo
      const currentEducationIds = new Set(curriculum?.educations?.map(e => e.id) || []);
      const currentExperienceIds = new Set(curriculum?.experiences?.map(e => e.id) || []);
      const currentSkillIds = new Set(curriculum?.skills?.map(s => s.id) || []);
      const currentProjectIds = new Set(curriculum?.projects?.map(p => p.id) || []);

      // ========== EDUCAÇÕES ==========
      // Adicionar novas educações
      for (const eduId of selectedEducations) {
        if (!currentEducationIds.has(eduId)) {
          console.log('➕ Adicionando educação:', eduId);
          await addEducation.mutateAsync({ curriculumId: id!, educationId: eduId });
        }
      }
      // Remover educações desmarcadas
      for (const eduId of currentEducationIds) {
        if (!selectedEducations.has(eduId)) {
          console.log('➖ Removendo educação:', eduId);
          await removeEducation.mutateAsync({ curriculumId: id!, educationId: eduId });
        }
      }

      // ========== EXPERIÊNCIAS ==========
      // Adicionar novas experiências
      for (const expId of selectedExperiences) {
        if (!currentExperienceIds.has(expId)) {
          console.log('➕ Adicionando experiência:', expId);
          await addExperience.mutateAsync({ curriculumId: id!, experienceId: expId });
        }
      }
      // Remover experiências desmarcadas
      for (const expId of currentExperienceIds) {
        if (!selectedExperiences.has(expId)) {
          console.log('➖ Removendo experiência:', expId);
          await removeExperience.mutateAsync({ curriculumId: id!, experienceId: expId });
        }
      }

      // ========== SKILLS ==========
      // Adicionar novas skills
      for (const skillId of selectedSkills) {
        if (!currentSkillIds.has(skillId)) {
          console.log('➕ Adicionando skill:', skillId);
          await addSkill.mutateAsync({ curriculumId: id!, skillId: skillId });
        }
      }
      // Remover skills desmarcadas
      for (const skillId of currentSkillIds) {
        if (!selectedSkills.has(skillId)) {
          console.log('➖ Removendo skill:', skillId);
          await removeSkill.mutateAsync({ curriculumId: id!, skillId: skillId });
        }
      }

      // ========== PROJETOS ==========
      // Adicionar novos projetos
      for (const projId of selectedProjects) {
        if (!currentProjectIds.has(projId)) {
          console.log('➕ Adicionando projeto:', projId);
          await addProject.mutateAsync({ curriculumId: id!, projectId: projId });
        }
      }
      // Remover projetos desmarcados
      for (const projId of currentProjectIds) {
        if (!selectedProjects.has(projId)) {
          console.log('➖ Removendo projeto:', projId);
          await removeProject.mutateAsync({ curriculumId: id!, projectId: projId });
        }
      }

      console.log('✅ Alterações salvas com sucesso!');
      
      // Atualiza o currículo
      await refetch();
      
      // Volta para detalhes
      router.back();
    } catch (err: any) {
      console.error('❌ Erro ao salvar:', err);
      setError(err.response?.data?.message || 'Erro ao salvar alterações');
    } finally {
      setSaving(false);
    }
  };

  // Estado de carregamento
  if (loadingCurriculum || loadingEducations || loadingExperiences || loadingSkills || loadingProjects) {
    return (
      <Box flex={1} bg="$backgroundLight" justifyContent="center" alignItems="center">
        <Spinner size="large" color="$primary" />
        <Text mt="$4" color="$textLight">Carregando...</Text>
      </Box>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#ECEFF4' }} contentContainerStyle={{ paddingBottom: 100 }} >
      <Box flex={1} p="$6">
        <VStack space="lg">
          {/* Header */}
          <HStack space="md" alignItems="center">
            <Button onPress={() => router.back()} variant="link" size="sm" p="$0">
              <HStack space="xs" alignItems="center">
                <Ionicons name="arrow-back" size={20} color="#5A9EAD" />
                <ButtonText color="$primary">Voltar</ButtonText>
              </HStack>
            </Button>
          </HStack>

          <VStack space="sm">
            <Heading size="2xl" color="$primary">
              Gerenciar Blocos
            </Heading>
            <Text color="$textLight">
              Selecione quais blocos do seu acervo incluir neste currículo.
            </Text>
          </VStack>

          {error && (
            <Alert action="error" variant="accent">
              <AlertIcon as={MaterialIcons} name="error" mr="$2" />
              <AlertText>{error}</AlertText>
            </Alert>
          )}

          {/* ========== SEÇÃO: EDUCAÇÕES ========== */}
          <Card p="$5" bg="$white" borderRadius="$lg">
            <VStack space="md">
              <HStack justifyContent="space-between" alignItems="center">
                <HStack space="sm" alignItems="center">
                  <MaterialIcons name="school" size={24} color="#5A9EAD" />
                  <Heading size="lg" color="$primary">Formações</Heading>
                  <Badge bg="$primary" borderRadius="$full" px="$2">
                    <BadgeText color="$white" fontSize="$xs">
                      {selectedEducations.size}/{allEducations?.length || 0}
                    </BadgeText>
                  </Badge>
                </HStack>
                <Button
                  onPress={() => router.push('/(tabs)/academico')}
                  size="sm"
                  variant="link"
                  p="$0"
                >
                  <ButtonText fontSize="$xs" color="$secondary">+ Criar Nova</ButtonText>
                </Button>
              </HStack>

              <Divider bg="$backgroundLight" />

              {allEducations && allEducations.length > 0 ? (
                <VStack space="sm">
                  {allEducations.map((edu) => (
                    <Checkbox
                      key={edu.id}
                      value={edu.id}
                      isChecked={selectedEducations.has(edu.id)}
                      onChange={(isChecked) => {
                        const newSet = new Set(selectedEducations);
                        if (isChecked) {
                          newSet.add(edu.id);
                        } else {
                          newSet.delete(edu.id);
                        }
                        setSelectedEducations(newSet);
                      }}
                    >
                      <CheckboxIndicator mr="$2">
                        <CheckboxIcon as={MaterialIcons} name="check" />
                      </CheckboxIndicator>
                      <CheckboxLabel flex={1}>
                        <VStack>
                          <Text color="$primary" fontSize="$sm" fontWeight="$medium">
                            {edu.degree} em {edu.fieldOfStudy}
                          </Text>
                          <Text color="$textLight" fontSize="$xs">
                            {edu.institution}
                          </Text>
                        </VStack>
                      </CheckboxLabel>
                    </Checkbox>
                  ))}
                </VStack>
              ) : (
                <VStack space="sm" alignItems="center" py="$4">
                  <MaterialIcons name="school" size={48} color="#D5EDF3" />
                  <Text color="$textLight" fontSize="$sm" textAlign="center">
                    Nenhuma formação cadastrada.
                  </Text>
                  <Button
                    onPress={() => router.push('/(tabs)/academico')}
                    size="sm"
                    bg="$secondary"
                  >
                    <ButtonText fontSize="$xs">Criar Primeira Formação</ButtonText>
                  </Button>
                </VStack>
              )}
            </VStack>
          </Card>

          {/* ========== SEÇÃO: EXPERIÊNCIAS ========== */}
          <Card p="$5" bg="$white" borderRadius="$lg">
            <VStack space="md">
              <HStack justifyContent="space-between" alignItems="center">
                <HStack space="sm" alignItems="center">
                  <MaterialIcons name="work" size={24} color="#5A9EAD" />
                  <Heading size="lg" color="$primary">Experiências</Heading>
                  <Badge bg="$primary" borderRadius="$full" px="$2">
                    <BadgeText color="$white" fontSize="$xs">
                      {selectedExperiences.size}/{allExperiences?.length || 0}
                    </BadgeText>
                  </Badge>
                </HStack>
                <Button
                  onPress={() => router.push('/(tabs)/profissional')}
                  size="sm"
                  variant="link"
                  p="$0"
                >
                  <ButtonText fontSize="$xs" color="$secondary">+ Criar Nova</ButtonText>
                </Button>
              </HStack>

              <Divider bg="$backgroundLight" />

              {allExperiences && allExperiences.length > 0 ? (
                <VStack space="sm">
                  {allExperiences.map((exp) => (
                    <Checkbox
                      key={exp.id}
                      value={exp.id}
                      isChecked={selectedExperiences.has(exp.id)}
                      onChange={(isChecked) => {
                        const newSet = new Set(selectedExperiences);
                        if (isChecked) {
                          newSet.add(exp.id);
                        } else {
                          newSet.delete(exp.id);
                        }
                        setSelectedExperiences(newSet);
                      }}
                    >
                      <CheckboxIndicator mr="$2">
                        <CheckboxIcon as={MaterialIcons} name="check" />
                      </CheckboxIndicator>
                      <CheckboxLabel flex={1}>
                        <VStack>
                          <Text color="$primary" fontSize="$sm" fontWeight="$medium">
                            {exp.title}
                          </Text>
                          <Text color="$textLight" fontSize="$xs">
                            {exp.company}
                          </Text>
                        </VStack>
                      </CheckboxLabel>
                    </Checkbox>
                  ))}
                </VStack>
              ) : (
                <VStack space="sm" alignItems="center" py="$4">
                  <MaterialIcons name="work-outline" size={48} color="#D5EDF3" />
                  <Text color="$textLight" fontSize="$sm" textAlign="center">
                    Nenhuma experiência cadastrada.
                  </Text>
                  <Button
                    onPress={() => router.push('/(tabs)/profissional')}
                    size="sm"
                    bg="$secondary"
                  >
                    <ButtonText fontSize="$xs">Criar Primeira Experiência</ButtonText>
                  </Button>
                </VStack>
              )}
            </VStack>
          </Card>

          {/* ========== SEÇÃO: SKILLS ========== */}
          <Card p="$5" bg="$white" borderRadius="$lg">
            <VStack space="md">
              <HStack justifyContent="space-between" alignItems="center">
                <HStack space="sm" alignItems="center">
                  <MaterialIcons name="star" size={24} color="#5A9EAD" />
                  <Heading size="lg" color="$primary">Habilidades</Heading>
                  <Badge bg="$primary" borderRadius="$full" px="$2">
                    <BadgeText color="$white" fontSize="$xs">
                      {selectedSkills.size}/{allSkills?.length || 0}
                    </BadgeText>
                  </Badge>
                </HStack>
                <Button
                  onPress={() => router.push('/(tabs)/habilidades')}
                  size="sm"
                  variant="link"
                  p="$0"
                >
                  <ButtonText fontSize="$xs" color="$secondary">+ Criar Nova</ButtonText>
                </Button>
              </HStack>

              <Divider bg="$backgroundLight" />

              {allSkills && allSkills.length > 0 ? (
                <VStack space="sm">
                  {allSkills.map((skill) => (
                    <Checkbox
                      key={skill.id}
                      value={skill.id}
                      isChecked={selectedSkills.has(skill.id)}
                      onChange={(isChecked) => {
                        const newSet = new Set(selectedSkills);
                        if (isChecked) {
                          newSet.add(skill.id);
                        } else {
                          newSet.delete(skill.id);
                        }
                        setSelectedSkills(newSet);
                      }}
                    >
                      <CheckboxIndicator mr="$2">
                        <CheckboxIcon as={MaterialIcons} name="check" />
                      </CheckboxIndicator>
                      <CheckboxLabel flex={1}>
                        <Text color="$primary" fontSize="$sm">
                          {skill.name}
                        </Text>
                      </CheckboxLabel>
                    </Checkbox>
                  ))}
                </VStack>
              ) : (
                <VStack space="sm" alignItems="center" py="$4">
                  <MaterialIcons name="star-border" size={48} color="#D5EDF3" />
                  <Text color="$textLight" fontSize="$sm" textAlign="center">
                    Nenhuma habilidade cadastrada.
                  </Text>
                  <Button
                    onPress={() => router.push('/(tabs)/habilidades')}
                    size="sm"
                    bg="$secondary"
                  >
                    <ButtonText fontSize="$xs">Criar Primeira Habilidade</ButtonText>
                  </Button>
                </VStack>
              )}
            </VStack>
          </Card>

          {/* ========== SEÇÃO: PROJETOS ========== */}
          <Card p="$5" bg="$white" borderRadius="$lg">
            <VStack space="md">
              <HStack justifyContent="space-between" alignItems="center">
                <HStack space="sm" alignItems="center">
                  <MaterialIcons name="code" size={24} color="#5A9EAD" />
                  <Heading size="lg" color="$primary">Projetos</Heading>
                  <Badge bg="$primary" borderRadius="$full" px="$2">
                    <BadgeText color="$white" fontSize="$xs">
                      {selectedProjects.size}/{allProjects?.length || 0}
                    </BadgeText>
                  </Badge>
                </HStack>
                <Button
                  onPress={() => router.push('/(tabs)/projetos')}
                  size="sm"
                  variant="link"
                  p="$0"
                >
                  <ButtonText fontSize="$xs" color="$secondary">+ Criar Novo</ButtonText>
                </Button>
              </HStack>

              <Divider bg="$backgroundLight" />

              {allProjects && allProjects.length > 0 ? (
                <VStack space="sm">
                  {allProjects.map((proj) => (
                    <Checkbox
                      key={proj.id}
                      value={proj.id}
                      isChecked={selectedProjects.has(proj.id)}
                      onChange={(isChecked) => {
                        const newSet = new Set(selectedProjects);
                        if (isChecked) {
                          newSet.add(proj.id);
                        } else {
                          newSet.delete(proj.id);
                        }
                        setSelectedProjects(newSet);
                      }}
                    >
                      <CheckboxIndicator mr="$2">
                        <CheckboxIcon as={MaterialIcons} name="check" />
                      </CheckboxIndicator>
                      <CheckboxLabel flex={1}>
                        <Text color="$primary" fontSize="$sm">
                          {proj.name}
                        </Text>
                      </CheckboxLabel>
                    </Checkbox>
                  ))}
                </VStack>
              ) : (
                <VStack space="sm" alignItems="center" py="$4">
                  <MaterialIcons name="code" size={48} color="#D5EDF3" />
                  <Text color="$textLight" fontSize="$sm" textAlign="center">
                    Nenhum projeto cadastrado.
                  </Text>
                  <Button
                    onPress={() => router.push('/(tabs)/projetos')}
                    size="sm"
                    bg="$secondary"
                  >
                    <ButtonText fontSize="$xs">Criar Primeiro Projeto</ButtonText>
                  </Button>
                </VStack>
              )}
            </VStack>
          </Card>

          {/* Botão de Salvar */}
          <Button
            onPress={handleSave}
            bg="$primary"
            size="lg"
            isDisabled={saving}
            mt="$4"
          >
            {saving ? (
              <HStack space="sm" alignItems="center">
                <Spinner color="$white" />
                <ButtonText>Salvando...</ButtonText>
              </HStack>
            ) : (
              <HStack space="sm" alignItems="center">
                <MaterialIcons name="save" size={20} color="white" />
                <ButtonText>Salvar Alterações</ButtonText>
              </HStack>
            )}
          </Button>
        </VStack>
      </Box>
    </ScrollView>
  );
}
