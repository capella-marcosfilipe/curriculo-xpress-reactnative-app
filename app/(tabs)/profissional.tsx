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
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from '@gluestack-ui/themed';
import { ScrollView, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useExperiences, useCreateExperience, useDeleteExperience } from '../../hooks/useExperiences';
import type { Experience } from '../../types/api';

export default function ProfissionalScreen() {
  const { data: experiences, isLoading, isError, refetch } = useExperiences();
  const createExperience = useCreateExperience();
  const deleteExperience = useDeleteExperience();

  // Estados do modal de criar
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [createError, setCreateError] = useState('');

  // Estados do modal de deletar
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<Experience | null>(null);

  const resetForm = () => {
    setCompany('');
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setIsCurrent(false);
    setCreateError('');
  };

  const handleCreate = async () => {
    try {
      setCreateError('');

      if (!company.trim()) {
        setCreateError('Digite o nome da empresa');
        return;
      }
      if (!title.trim()) {
        setCreateError('Digite o cargo');
        return;
      }
      if (!description.trim()) {
        setCreateError('Digite uma descrição das suas atividades');
        return;
      }
      if (!startDate.trim()) {
        setCreateError('Digite a data de início (YYYY-MM-DD)');
        return;
      }

      await createExperience.mutateAsync({
        company: company.trim(),
        title: title.trim(),
        description: description.trim(),
        startDate: startDate.trim(),
        endDate: isCurrent ? null : (endDate.trim() || null),
      });

      // Sucesso! Limpa e fecha
      resetForm();
      setShowCreateModal(false);
    } catch (err: any) {
      setCreateError(err.response?.data?.message || 'Erro ao criar experiência');
    }
  };

  const handleDeleteClick = (experience: Experience) => {
    setExperienceToDelete(experience);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!experienceToDelete) return;

    try {
      await deleteExperience.mutateAsync(experienceToDelete.id);
      setShowDeleteModal(false);
      setExperienceToDelete(null);
    } catch (err) {
      console.error('Erro ao deletar:', err);
    }
  };

  // Estado de carregamento
  if (isLoading) {
    return (
      <Box flex={1} bg="$backgroundLight" justifyContent="center" alignItems="center">
        <Spinner size="large" color="$primary" />
        <Text mt="$4" color="$textLight">Carregando experiências...</Text>
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
            Erro ao carregar experiências.
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
                Experiência Profissional
              </Heading>
              <Badge bg="$primary" borderRadius="$full" px="$3" py="$1">
                <BadgeText color="$white" fontSize="$md">
                  {experiences?.length || 0}
                </BadgeText>
              </Badge>
            </HStack>

            <Text color="$textLight" fontSize="$sm">
              Gerencie seu acervo de experiências profissionais. Você pode usar
              essas experiências em qualquer currículo que criar.
            </Text>

            {/* Botão de Adicionar */}
            <Button
              onPress={() => setShowCreateModal(true)}
              bg="$primary"
              size="lg"
            >
              <HStack space="sm" alignItems="center">
                <MaterialIcons name="add" size={20} color="white" />
                <ButtonText>Adicionar Experiência</ButtonText>
              </HStack>
            </Button>

            {/* Lista de Experiências */}
            {experiences && experiences.length > 0 ? (
              <VStack space="md" mt="$2">
                {experiences.map((exp) => (
                  <Pressable
                    key={exp.id}
                    onLongPress={() => handleDeleteClick(exp)}
                  >
                    <Card p="$4" bg="$white" borderRadius="$lg">
                      <VStack space="sm">
                        <HStack justifyContent="space-between" alignItems="flex-start">
                          <VStack flex={1}>
                            <Heading size="md" color="$primary">
                              {exp.title}
                            </Heading>
                            <Text color="$textLight" fontWeight="$medium">
                              {exp.company}
                            </Text>
                          </VStack>
                          <Pressable onPress={() => handleDeleteClick(exp)}>
                            <MaterialIcons name="delete" size={20} color="#D32F2F" />
                          </Pressable>
                        </HStack>

                        <Text color="$textLight" fontSize="$sm">
                          {exp.description}
                        </Text>

                        <HStack space="sm" alignItems="center">
                          <MaterialIcons name="calendar-today" size={14} color="#88C0D0" />
                          <Text color="$textLight" fontSize="$xs">
                            {exp.startDate} - {exp.endDate || 'Presente'}
                          </Text>
                        </HStack>
                      </VStack>
                    </Card>
                  </Pressable>
                ))}
              </VStack>
            ) : (
              // Estado vazio
              <VStack space="lg" alignItems="center" mt="$8">
                <MaterialIcons name="work-outline" size={80} color="#D5EDF3" />
                <VStack space="sm" alignItems="center">
                  <Text color="$textLight" fontSize="$lg" fontWeight="$bold">
                    Nenhuma experiência cadastrada
                  </Text>
                  <Text color="$textLight" fontSize="$sm" textAlign="center" px="$4">
                    Adicione suas experiências profissionais ao seu acervo
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
              Adicionar Experiência
            </Heading>
            <ModalCloseButton>
              <MaterialIcons name="close" size={24} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <Input>
                <InputField
                  placeholder="Empresa (ex: FASA)"
                  value={company}
                  onChangeText={setCompany}
                />
              </Input>

              <Input>
                <InputField
                  placeholder="Cargo (ex: Estagiário de IA)"
                  value={title}
                  onChangeText={setTitle}
                />
              </Input>

              <Textarea size="md" minHeight={100}>
                <TextareaInput
                  placeholder="Descrição das atividades..."
                  value={description}
                  onChangeText={setDescription}
                />
              </Textarea>

              <Input>
                <InputField
                  placeholder="Data de Início (YYYY-MM-DD)"
                  value={startDate}
                  onChangeText={setStartDate}
                />
              </Input>

              <Checkbox value="current" isChecked={isCurrent} onChange={setIsCurrent}>
                <CheckboxIndicator mr="$2">
                  <CheckboxIcon as={MaterialIcons} name="check" />
                </CheckboxIndicator>
                <CheckboxLabel>Trabalho aqui atualmente</CheckboxLabel>
              </Checkbox>

              {!isCurrent && (
                <Input>
                  <InputField
                    placeholder="Data de Término (YYYY-MM-DD)"
                    value={endDate}
                    onChangeText={setEndDate}
                  />
                </Input>
              )}

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
                isDisabled={createExperience.isPending}
              >
                {createExperience.isPending ? (
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
          setExperienceToDelete(null);
        }}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg" color="$error600">
              Deletar Experiência
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
                    {experienceToDelete?.title} - {experienceToDelete?.company}?
                  </Text>
                </VStack>
              </HStack>
              <Text color="$textLight" fontSize="$sm">
                Esta experiência será removida do seu acervo e de todos os
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
                isDisabled={deleteExperience.isPending}
              >
                {deleteExperience.isPending ? (
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
                  setExperienceToDelete(null);
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
