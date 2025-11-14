import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  ButtonText,
  Spinner,
  Badge,
  BadgeText,
  Card,
  Pressable,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  InputField,
  Textarea,
  TextareaInput,
  Alert,
  AlertIcon,
  AlertText,
} from '@gluestack-ui/themed';
import { ScrollView, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useProjects, useCreateProject, useDeleteProject } from '../../hooks/useProjects';
import type { Project } from '../../types/api';

export default function ProjetosScreen() {
  const { data: projects, isLoading, isError, refetch } = useProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  // Estados do modal de criar
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [createError, setCreateError] = useState('');

  // Estados do modal de deletar
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const resetForm = () => {
    setName('');
    setDescription('');
    setUrl('');
    setCreateError('');
  };

  const handleCreate = async () => {
    try {
      setCreateError('');

      if (!name.trim()) {
        setCreateError('Digite o nome do projeto');
        return;
      }
      if (!description.trim()) {
        setCreateError('Digite uma descrição do projeto');
        return;
      }

      await createProject.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        url: url.trim() || null,
      });

      // Sucesso! Limpa e fecha
      resetForm();
      setShowCreateModal(false);
    } catch (err: any) {
      setCreateError(err.response?.data?.message || 'Erro ao criar projeto');
    }
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject.mutateAsync(projectToDelete.id);
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (err) {
      console.error('Erro ao deletar:', err);
    }
  };

  // Estado de carregamento
  if (isLoading) {
    return (
      <Box flex={1} bg="$backgroundLight" justifyContent="center" alignItems="center">
        <Spinner size="large" color="$primary" />
        <Text mt="$4" color="$textLight">Carregando projetos...</Text>
      </Box>
    );
  }

  // Estado de erro
  if (isError) {
    return (
      <Box flex={1} bg="$backgroundLight" p="$6" justifyContent="center">
        <VStack space="lg" alignItems="center">
          <MaterialIcons name="error-outline" size={64} color="#D32F2F" />
          <Text color="$textLight" textAlign="center">
            Erro ao carregar projetos.
          </Text>
          <Button onPress={() => refetch()} bg="$primary">
            <ButtonText>Tentar novamente</ButtonText>
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: '#ECEFF4' }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        <Box flex={1} p="$6">
          <VStack space="lg">
            {/* Header */}
            <HStack justifyContent="space-between" alignItems="center">
              <Heading size="2xl" color="$primary">
                Meus Projetos
              </Heading>
              <Badge bg="$primary" borderRadius="$full" px="$3" py="$1">
                <BadgeText color="$white" fontSize="$md">
                  {projects?.length || 0}
                </BadgeText>
              </Badge>
            </HStack>

            <Text color="$textLight" fontSize="$sm">
              Gerencie seu portfólio de projetos. Você pode usar
              esses projetos em qualquer currículo que criar.
            </Text>

            {/* Botão de Adicionar */}
            <Button
              onPress={() => setShowCreateModal(true)}
              bg="$primary"
              size="lg"
            >
              <HStack space="sm" alignItems="center">
                <MaterialIcons name="add" size={20} color="white" />
                <ButtonText>Adicionar Projeto</ButtonText>
              </HStack>
            </Button>

            {/* Lista de Projetos */}
            {projects && projects.length > 0 ? (
              <VStack space="md" mt="$2">
                {projects.map((project) => (
                  <Pressable
                    key={project.id}
                    onLongPress={() => handleDeleteClick(project)}
                  >
                    <Card p="$4" bg="$white" borderRadius="$lg">
                      <VStack space="sm">
                        <HStack justifyContent="space-between" alignItems="flex-start">
                          <VStack flex={1}>
                            <Heading size="md" color="$primary">
                              {project.name}
                            </Heading>
                          </VStack>
                          <Pressable onPress={() => handleDeleteClick(project)}>
                            <MaterialIcons name="delete" size={20} color="#D32F2F" />
                          </Pressable>
                        </HStack>

                        <Text color="$textLight" fontSize="$sm">
                          {project.description}
                        </Text>

                        {project.url && (
                          <HStack space="sm" alignItems="center">
                            <MaterialIcons name="link" size={14} color="#88C0D0" />
                            <Text color="$secondary" fontSize="$xs" numberOfLines={1}>
                              {project.url}
                            </Text>
                          </HStack>
                        )}
                      </VStack>
                    </Card>
                  </Pressable>
                ))}
              </VStack>
            ) : (
              // Estado vazio
              <VStack space="lg" alignItems="center" mt="$8">
                <MaterialIcons name="code" size={80} color="#D5EDF3" />
                <VStack space="sm" alignItems="center">
                  <Text color="$textLight" fontSize="$lg" fontWeight="$bold">
                    Nenhum projeto cadastrado
                  </Text>
                  <Text color="$textLight" fontSize="$sm" textAlign="center" px="$4">
                    Adicione seus projetos pessoais e profissionais ao seu portfólio
                  </Text>
                </VStack>
              </VStack>
            )}
          </VStack>
        </Box>
      </ScrollView>

      {/* Modal de Criar */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg" color="$primary">
              Adicionar Projeto
            </Heading>
            <ModalCloseButton>
              <MaterialIcons name="close" size={24} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <Input>
                <InputField
                  placeholder="Nome do Projeto"
                  value={name}
                  onChangeText={setName}
                />
              </Input>

              <Textarea size="md" minHeight={100}>
                <TextareaInput
                  placeholder="Descrição do projeto..."
                  value={description}
                  onChangeText={setDescription}
                />
              </Textarea>

              <Input>
                <InputField
                  placeholder="URL (opcional - ex: github.com/user/repo)"
                  value={url}
                  onChangeText={setUrl}
                  autoCapitalize="none"
                />
              </Input>

              {createError && (
                <Alert action="error" variant="accent">
                  <AlertIcon as={MaterialIcons} name="error" mr="$2" />
                  <AlertText>{createError}</AlertText>
                </Alert>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <VStack space="sm" width="100%">
              <Button
                onPress={handleCreate}
                bg="$primary"
                size="lg"
                isDisabled={createProject.isPending}
              >
                {createProject.isPending ? (
                  <HStack space="sm" alignItems="center">
                    <Spinner color="$white" />
                    <ButtonText>Adicionando...</ButtonText>
                  </HStack>
                ) : (
                  <ButtonText>Adicionar</ButtonText>
                )}
              </Button>
              <Button
                variant="outline"
                borderColor="$primary"
                size="lg"
                onPress={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
              >
                <ButtonText color="$primary">Cancelar</ButtonText>
              </Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Deletar */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setProjectToDelete(null);
        }}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg" color="$error600">
              Deletar Projeto
            </Heading>
            <ModalCloseButton>
              <MaterialIcons name="close" size={24} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <HStack space="sm" alignItems="center">
                <MaterialIcons name="warning" size={32} color="#D32F2F" />
                <VStack flex={1}>
                  <Text color="$textLight">
                    Tem certeza que deseja deletar
                  </Text>
                  <Text color="$primary" fontWeight="$bold">
                    {projectToDelete?.name}?
                  </Text>
                </VStack>
              </HStack>
              <Text color="$textLight" fontSize="$sm">
                Este projeto será removido do seu portfólio e de todos os
                currículos que o utilizam.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <VStack space="sm" width="100%">
              <Button
                onPress={handleDeleteConfirm}
                bg="$error600"
                size="lg"
                isDisabled={deleteProject.isPending}
              >
                {deleteProject.isPending ? (
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
                onPress={() => {
                  setShowDeleteModal(false);
                  setProjectToDelete(null);
                }}
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
