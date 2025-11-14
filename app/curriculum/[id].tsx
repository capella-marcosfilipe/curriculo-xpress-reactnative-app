import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Spinner,
  Card,
  Badge,
  BadgeText,
  Divider,
  Button,
  ButtonText,
  Alert,        
  AlertIcon,    
  AlertText,  
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@gluestack-ui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { useCurriculum, useDeleteCurriculum } from '../../hooks/useCurriculums';

export default function CurriculumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: curriculum, isLoading, isError, refetch } = useCurriculum(id);
  const deleteCurriculum = useDeleteCurriculum();
  
  // Estado do modal de confirmação
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!curriculum) return;
    
    try {
      setIsDeleting(true);
      await deleteCurriculum.mutateAsync(curriculum.id);
      
      // Sucesso! Fecha o modal e volta para Home
      setShowDeleteModal(false);
      router.replace('/(tabs)/');
    } catch (error) {
      console.error('Erro ao deletar:', error);
      setIsDeleting(false);
      // O erro já é logado pelo hook
    }
  };

  // Estado de carregamento
  if (isLoading) {
    return (
      <Box flex={1} bg="$backgroundLight" justifyContent="center" alignItems="center">
        <Spinner size="large" color="$primary" />
        <Text mt="$4" color="$textLight">Carregando currículo...</Text>
      </Box>
    );
  }

  // Estado de erro
  if (isError || !curriculum) {
    return (
      <Box flex={1} bg="$backgroundLight" p="$6" justifyContent="center">
        <VStack space="lg" alignItems="center">
          <MaterialIcons name="error-outline" size={64} color="#D32F2F" />
          <Text color="$textLight" textAlign="center">
            Erro ao carregar currículo. Verifique sua conexão.
          </Text>
          <Button onPress={() => refetch()} bg="$primary">
            <ButtonText>Tentar novamente</ButtonText>
          </Button>
          <Button onPress={() => router.back()} variant="outline" borderColor="$primary">
            <ButtonText color="$primary">Voltar</ButtonText>
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: '#ECEFF4' }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        <Box flex={1} p="$6">
          <VStack space="lg">
            {/* Header com botão voltar */}
            <HStack space="md" alignItems="center">
              <Button
                onPress={() => router.back()}
                variant="link"
                size="sm"
                p="$0"
              >
                <HStack space="xs" alignItems="center">
                  <Ionicons name="arrow-back" size={20} color="#5A9EAD" />
                  <ButtonText color="$primary">Voltar</ButtonText>
                </HStack>
              </Button>
            </HStack>

            {/* Título do Currículo */}
            <VStack space="sm">
              <Heading size="2xl" color="$primary">
                {curriculum.title}
              </Heading>
              <HStack space="sm" alignItems="center">
                <MaterialIcons name="event" size={16} color="#88C0D0" />
                <Text color="$textLight" fontSize="$xs">
                  Criado em {new Date(curriculum.createdAt).toLocaleDateString('pt-BR')}
                </Text>
              </HStack>
              <HStack space="sm" alignItems="center">
                <MaterialIcons name="update" size={16} color="#88C0D0" />
                <Text color="$textLight" fontSize="$xs">
                  Atualizado em {new Date(curriculum.updatedAt).toLocaleDateString('pt-BR')}
                </Text>
              </HStack>
            </VStack>

            <Divider bg="$primary200" />

            {/* Statement (Resumo Pessoal) */}
            <Card p="$5" bg="$white" borderRadius="$lg">
              <VStack space="md">
                <HStack space="sm" alignItems="center">
                  <MaterialIcons name="person" size={24} color="#5A9EAD" />
                  <Heading size="lg" color="$primary">
                    {curriculum.statement.title}
                  </Heading>
                </HStack>
                <Text color="$textLight" fontSize="$md" lineHeight="$xl">
                  {curriculum.statement.text}
                </Text>
              </VStack>
            </Card>

            {/* Formação Acadêmica */}
            {curriculum.educations && curriculum.educations.length > 0 && (
              <VStack space="md">
                <HStack space="sm" alignItems="center">
                  <MaterialIcons name="school" size={24} color="#5A9EAD" />
                  <Heading size="lg" color="$primary">
                    Formação Acadêmica
                  </Heading>
                  <Badge bg="$primary" borderRadius="$full" px="$2">
                    <BadgeText color="$white" fontSize="$xs">
                      {curriculum.educations.length}
                    </BadgeText>
                  </Badge>
                </HStack>

                {curriculum.educations.map((edu) => (
                  <Card key={edu.id} p="$4" bg="$white" borderRadius="$lg">
                    <VStack space="sm">
                      <Heading size="md" color="$primary">
                        {edu.degree} em {edu.fieldOfStudy}
                      </Heading>
                      <Text color="$textLight" fontWeight="$medium">
                        {edu.institution}
                      </Text>
                      <HStack space="sm" alignItems="center">
                        <MaterialIcons name="calendar-today" size={14} color="#88C0D0" />
                        <Text color="$textLight" fontSize="$xs">
                          {new Date(edu.startDate).toLocaleDateString('pt-BR')} -{' '}
                          {edu.endDate
                            ? new Date(edu.endDate).toLocaleDateString('pt-BR')
                            : 'Presente'}
                        </Text>
                      </HStack>
                    </VStack>
                  </Card>
                ))}
              </VStack>
            )}

            {/* Experiência Profissional */}
            {curriculum.experiences && curriculum.experiences.length > 0 && (
              <VStack space="md">
                <HStack space="sm" alignItems="center">
                  <MaterialIcons name="work" size={24} color="#5A9EAD" />
                  <Heading size="lg" color="$primary">
                    Experiência Profissional
                  </Heading>
                  <Badge bg="$primary" borderRadius="$full" px="$2">
                    <BadgeText color="$white" fontSize="$xs">
                      {curriculum.experiences.length}
                    </BadgeText>
                  </Badge>
                </HStack>

                {curriculum.experiences.map((exp) => (
                  <Card key={exp.id} p="$4" bg="$white" borderRadius="$lg">
                    <VStack space="sm">
                      <Heading size="md" color="$primary">
                        {exp.title}
                      </Heading>
                      <Text color="$textLight" fontWeight="$medium">
                        {exp.company}
                      </Text>
                      <Text color="$textLight" fontSize="$sm">
                        {exp.description}
                      </Text>
                      <HStack space="sm" alignItems="center">
                        <MaterialIcons name="calendar-today" size={14} color="#88C0D0" />
                        <Text color="$textLight" fontSize="$xs">
                          {exp.startDate} -{' '}
                          {exp.endDate ? exp.endDate : 'Presente'}
                        </Text>
                      </HStack>
                    </VStack>
                  </Card>
                ))}
              </VStack>
            )}

            {/* Skills */}
            {curriculum.skills && curriculum.skills.length > 0 && (
              <VStack space="md">
                <HStack space="sm" alignItems="center">
                  <MaterialIcons name="star" size={24} color="#5A9EAD" />
                  <Heading size="lg" color="$primary">
                    Habilidades
                  </Heading>
                  <Badge bg="$primary" borderRadius="$full" px="$2">
                    <BadgeText color="$white" fontSize="$xs">
                      {curriculum.skills.length}
                    </BadgeText>
                  </Badge>
                </HStack>

                <Card p="$4" bg="$white" borderRadius="$lg">
                  <HStack space="sm" flexWrap="wrap">
                    {curriculum.skills.map((skill) => (
                      <Badge
                        key={skill.id}
                        bg="$secondary200"
                        borderRadius="$full"
                        px="$3"
                        py="$1"
                        mb="$2"
                      >
                        <BadgeText color="$secondary900" fontSize="$sm">
                          {skill.name}
                        </BadgeText>
                      </Badge>
                    ))}
                  </HStack>
                </Card>
              </VStack>
            )}

            {/* Projetos */}
            {curriculum.projects && curriculum.projects.length > 0 && (
              <VStack space="md">
                <HStack space="sm" alignItems="center">
                  <MaterialIcons name="code" size={24} color="#5A9EAD" />
                  <Heading size="lg" color="$primary">
                    Projetos
                  </Heading>
                  <Badge bg="$primary" borderRadius="$full" px="$2">
                    <BadgeText color="$white" fontSize="$xs">
                      {curriculum.projects.length}
                    </BadgeText>
                  </Badge>
                </HStack>

                {curriculum.projects.map((project) => (
                  <Card key={project.id} p="$4" bg="$white" borderRadius="$lg">
                    <VStack space="sm">
                      <Heading size="md" color="$primary">
                        {project.name}
                      </Heading>
                      <Text color="$textLight" fontSize="$sm">
                        {project.description}
                      </Text>
                      {project.url && (
                        <HStack space="sm" alignItems="center">
                          <MaterialIcons name="link" size={14} color="#88C0D0" />
                          <Text color="$secondary" fontSize="$xs">
                            {project.url}
                          </Text>
                        </HStack>
                      )}
                    </VStack>
                  </Card>
                ))}
              </VStack>
            )}

            {/* Gerenciar Blocos do Currículo */}
            <Card p="$5" bg="$white" borderRadius="$lg" borderWidth={2} borderColor="$secondary">
              <VStack space="md">
                <HStack space="sm" alignItems="center">
                  <MaterialIcons name="view-module" size={28} color="#6B8F5A" />
                  <Heading size="md" color="$secondary">
                    Gerenciar Blocos
                  </Heading>
                </HStack>
                
                <Text color="$textLight" fontSize="$sm">
                  Selecione quais formações, experiências, habilidades e projetos 
                  incluir neste currículo do seu acervo pessoal.
                </Text>

                <Button
                  onPress={() => router.push(`/curriculum/${curriculum.id}/edit-blocks`)}
                  bg="$secondary"
                  size="lg"
                >
                  <HStack space="sm" alignItems="center">
                    <MaterialIcons name="edit" size={20} color="white" />
                    <ButtonText>Gerenciar Blocos</ButtonText>
                  </HStack>
                </Button>

                <Alert action="info" variant="solid">
                  <AlertIcon as={MaterialIcons} name="info" mr="$2" />
                  <AlertText fontSize="$xs">
                    Você pode criar novos blocos nas abas correspondentes e depois 
                    adicioná-los aqui.
                  </AlertText>
                </Alert>
              </VStack>
            </Card>

            {/* Botões de Ação */}
            <VStack space="md" mt="$4">
              {/* Botão de Deletar */}
              <Button
                variant="outline"
                borderColor="$error600"
                size="lg"
                onPress={() => setShowDeleteModal(true)}
              >
                <HStack space="sm" alignItems="center">
                  <MaterialIcons name="delete" size={20} color="#D32F2F" />
                  <ButtonText color="$error600">Deletar Currículo</ButtonText>
                </HStack>
              </Button>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>

      {/* Modal de Confirmação de Delete */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg" color="$error600">
              Confirmar Exclusão
            </Heading>
            <ModalCloseButton>
              <MaterialIcons name="close" size={24} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <HStack space="sm" alignItems="center">
                <MaterialIcons name="warning" size={48} color="#D32F2F" />
                <VStack flex={1}>
                  <Text color="$textLight" fontSize="$md">
                    Tem certeza que deseja deletar o currículo
                  </Text>
                  <Text color="$primary" fontSize="$md" fontWeight="$bold">
                    "{curriculum.title}"?
                  </Text>
                </VStack>
              </HStack>
              <Text color="$textLight" fontSize="$sm">
                Esta ação não pode ser desfeita. Todos os dados deste currículo
                serão permanentemente removidos.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <VStack space="sm" width="100%">
              <Button
                onPress={handleDeleteConfirm}
                bg="$error600"
                size="lg"
                isDisabled={isDeleting}
              >
                {isDeleting ? (
                  <HStack space="sm" alignItems="center">
                    <Spinner color="$white" />
                    <ButtonText>Deletando...</ButtonText>
                  </HStack>
                ) : (
                  <ButtonText>Sim, Deletar</ButtonText>
                )}
              </Button>
              <Button
                variant="outline"
                borderColor="$primary"
                size="lg"
                onPress={() => setShowDeleteModal(false)}
                isDisabled={isDeleting}
              >
                <ButtonText color="$primary">Cancelar</ButtonText>
              </Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
