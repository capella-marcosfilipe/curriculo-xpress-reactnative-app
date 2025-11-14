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
  Alert,
  AlertIcon,
  AlertText,
} from '@gluestack-ui/themed';
import { ScrollView, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSkills, useCreateSkill, useDeleteSkill } from '../../hooks/useSkills';
import type { Skill } from '../../types/api';

export default function HabilidadesScreen() {
  const { data: skills, isLoading, isError, refetch } = useSkills();
  const createSkill = useCreateSkill();
  const deleteSkill = useDeleteSkill();

  // Estados do modal de criar
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [createError, setCreateError] = useState('');

  // Estados do modal de deletar
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);

  const handleCreate = async () => {
    try {
      setCreateError('');

      if (!newSkillName.trim()) {
        setCreateError('Digite o nome da habilidade');
        return;
      }

      await createSkill.mutateAsync({ name: newSkillName.trim() });

      // Sucesso! Limpa e fecha
      setNewSkillName('');
      setShowCreateModal(false);
    } catch (err: any) {
      setCreateError(err.response?.data?.message || 'Erro ao criar habilidade');
    }
  };

  const handleDeleteClick = (skill: Skill) => {
    setSkillToDelete(skill);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!skillToDelete) return;

    try {
      await deleteSkill.mutateAsync(skillToDelete.id);
      setShowDeleteModal(false);
      setSkillToDelete(null);
    } catch (err) {
      console.error('Erro ao deletar:', err);
    }
  };

  // Estado de carregamento
  if (isLoading) {
    return (
      <Box flex={1} bg="$backgroundLight" justifyContent="center" alignItems="center">
        <Spinner size="large" color="$primary" />
        <Text mt="$4" color="$textLight">Carregando habilidades...</Text>
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
            Erro ao carregar habilidades.
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
                Minhas Habilidades
              </Heading>
              <Badge bg="$primary" borderRadius="$full" px="$3" py="$1">
                <BadgeText color="$white" fontSize="$md">
                  {skills?.length || 0}
                </BadgeText>
              </Badge>
            </HStack>

            <Text color="$textLight" fontSize="$sm">
              Gerencie seu acervo de habilidades. Você pode usar essas skills
              em qualquer currículo que criar.
            </Text>

            {/* Botão de Adicionar */}
            <Button
              onPress={() => setShowCreateModal(true)}
              bg="$primary"
              size="lg"
            >
              <HStack space="sm" alignItems="center">
                <MaterialIcons name="add" size={20} color="white" />
                <ButtonText>Adicionar Habilidade</ButtonText>
              </HStack>
            </Button>

            {/* Lista de Skills */}
            {skills && skills.length > 0 ? (
              <VStack space="sm" mt="$2">
                <Text color="$textLight" fontSize="$xs">
                  Toque para editar ou deletar
                </Text>

                <HStack space="sm" flexWrap="wrap">
                  {skills.map((skill) => (
                    <Pressable
                      key={skill.id}
                      onPress={() => handleDeleteClick(skill)}
                      onLongPress={() => handleDeleteClick(skill)}
                    >
                      <Badge
                        bg="$secondary200"
                        borderRadius="$full"
                        px="$4"
                        py="$2"
                        mb="$2"
                      >
                        <HStack space="xs" alignItems="center">
                          <BadgeText color="$secondary900" fontSize="$md">
                            {skill.name}
                          </BadgeText>
                          <MaterialIcons name="close" size={16} color="#577B4A" />
                        </HStack>
                      </Badge>
                    </Pressable>
                  ))}
                </HStack>
              </VStack>
            ) : (
              // Estado vazio
              <VStack space="lg" alignItems="center" mt="$8">
                <MaterialIcons name="star-border" size={80} color="#D5EDF3" />
                <VStack space="sm" alignItems="center">
                  <Text color="$textLight" fontSize="$lg" fontWeight="$bold">
                    Nenhuma habilidade cadastrada
                  </Text>
                  <Text color="$textLight" fontSize="$sm" textAlign="center" px="$4">
                    Crie seu acervo de habilidades para usar em seus currículos
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
          setNewSkillName('');
          setCreateError('');
        }}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg" color="$primary">
              Adicionar Habilidade
            </Heading>
            <ModalCloseButton>
              <MaterialIcons name="close" size={24} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <Text color="$textLight">
                Digite o nome da habilidade técnica ou soft skill.
              </Text>

              <Input>
                <InputField
                  placeholder="Ex: Python, React Native, Liderança..."
                  value={newSkillName}
                  onChangeText={setNewSkillName}
                  autoFocus
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
                isDisabled={createSkill.isPending}
              >
                {createSkill.isPending ? (
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
                  setNewSkillName('');
                  setCreateError('');
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
          setSkillToDelete(null);
        }}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg" color="$error600">
              Deletar Habilidade
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
                    "{skillToDelete?.name}"?
                  </Text>
                </VStack>
              </HStack>
              <Text color="$textLight" fontSize="$sm">
                Esta habilidade será removida do seu acervo e de todos os
                currículos que a utilizam.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <VStack space="sm" width="100%">
              <Button
                onPress={handleDeleteConfirm}
                bg="$error600"
                size="lg"
                isDisabled={deleteSkill.isPending}
              >
                {deleteSkill.isPending ? (
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
                  setSkillToDelete(null);
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
