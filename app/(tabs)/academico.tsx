import { MaterialIcons } from '@expo/vector-icons';
import {
  Alert,
  AlertIcon,
  AlertText,
  Badge,
  BadgeText,
  Box,
  Button,
  ButtonText,
  Card,
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
  HStack,
  Heading,
  Input,
  InputField,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pressable,
  Spinner,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import React, { useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { useCreateEducation, useDeleteEducation, useEducations } from '../../hooks/useEducations';
import type { Education } from '../../types/api';

export default function AcademicoScreen() {
  const { data: educations, isLoading, isError, refetch } = useEducations();
  const createEducation = useCreateEducation();
  const deleteEducation = useDeleteEducation();

  // Estados do modal de criar
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [createError, setCreateError] = useState('');

  // Estados do modal de deletar
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [educationToDelete, setEducationToDelete] = useState<Education | null>(null);

  const resetForm = () => {
    setInstitution('');
    setDegree('');
    setFieldOfStudy('');
    setStartDate('');
    setEndDate('');
    setIsCurrent(false);
    setCreateError('');
  };

  const handleCreate = async () => {
    try {
      setCreateError('');

      if (!institution.trim()) {
        setCreateError('Digite o nome da instituição');
        return;
      }
      if (!degree.trim()) {
        setCreateError('Digite o grau (ex: Bacharelado)');
        return;
      }
      if (!fieldOfStudy.trim()) {
        setCreateError('Digite a área de estudo');
        return;
      }
      if (!startDate.trim()) {
        setCreateError('Digite a data de início (YYYY-MM-DD)');
        return;
      }

      await createEducation.mutateAsync({
        institution: institution.trim(),
        degree: degree.trim(),
        fieldOfStudy: fieldOfStudy.trim(),
        startDate: startDate.trim(),
        endDate: isCurrent ? null : (endDate.trim() || null),
      });

      // Sucesso! Limpa e fecha
      resetForm();
      setShowCreateModal(false);
    } catch (err: any) {
      setCreateError(err.response?.data?.message || 'Erro ao criar formação');
    }
  };

  const handleDeleteClick = (education: Education) => {
    setEducationToDelete(education);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!educationToDelete) return;

    try {
      await deleteEducation.mutateAsync(educationToDelete.id);
      setShowDeleteModal(false);
      setEducationToDelete(null);
    } catch (err) {
      console.error('Erro ao deletar:', err);
    }
  };

  // Estado de carregamento
  if (isLoading) {
    return (
      <Box flex={1} bg="$backgroundLight" justifyContent="center" alignItems="center">
        <Spinner size="large" color="$primary" />
        <Text mt="$4" color="$textLight">Carregando formações...</Text>
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
            Erro ao carregar formações.
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
                Formação Acadêmica
              </Heading>
              <Badge bg="$primary" borderRadius="$full" px="$3" py="$1">
                <BadgeText color="$white" fontSize="$md">
                  {educations?.length || 0}
                </BadgeText>
              </Badge>
            </HStack>

            <Text color="$textLight" fontSize="$sm">
              Gerencie seu acervo de formações acadêmicas. Você pode usar
              essas educações em qualquer currículo que criar.
            </Text>

            {/* Botão de Adicionar */}
            <Button
              onPress={() => setShowCreateModal(true)}
              bg="$primary"
              size="lg"
            >
              <HStack space="sm" alignItems="center">
                <MaterialIcons name="add" size={20} color="white" />
                <ButtonText>Adicionar Formação</ButtonText>
              </HStack>
            </Button>

            {/* Lista de Educações */}
            {educations && educations.length > 0 ? (
              <VStack space="md" mt="$2">
                {educations.map((edu) => (
                  <Pressable
                    key={edu.id}
                    onLongPress={() => handleDeleteClick(edu)}
                  >
                    <Card p="$4" bg="$white" borderRadius="$lg">
                      <VStack space="sm">
                        <HStack justifyContent="space-between" alignItems="flex-start">
                          <VStack flex={1}>
                            <Heading size="md" color="$primary">
                              {edu.degree} em {edu.fieldOfStudy}
                            </Heading>
                            <Text color="$textLight" fontWeight="$medium">
                              {edu.institution}
                            </Text>
                          </VStack>
                          <Pressable onPress={() => handleDeleteClick(edu)}>
                            <MaterialIcons name="delete" size={20} color="#D32F2F" />
                          </Pressable>
                        </HStack>

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
                  </Pressable>
                ))}
              </VStack>
            ) : (
              // Estado vazio
              <VStack space="lg" alignItems="center" mt="$8">
                <MaterialIcons name="school" size={80} color="#D5EDF3" />
                <VStack space="sm" alignItems="center">
                  <Text color="$textLight" fontSize="$lg" fontWeight="$bold">
                    Nenhuma formação cadastrada
                  </Text>
                  <Text color="$textLight" fontSize="$sm" textAlign="center" px="$4">
                    Adicione suas formações acadêmicas ao seu acervo
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
              Adicionar Formação
            </Heading>
            <ModalCloseButton>
              <MaterialIcons name="close" size={24} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <Input>
                <InputField
                  placeholder="Instituição (ex: Unicap)"
                  value={institution}
                  onChangeText={setInstitution}
                />
              </Input>

              <Input>
                <InputField
                  placeholder="Grau (ex: Bacharelado)"
                  value={degree}
                  onChangeText={setDegree}
                />
              </Input>

              <Input>
                <InputField
                  placeholder="Área (ex: Ciência da Computação)"
                  value={fieldOfStudy}
                  onChangeText={setFieldOfStudy}
                />
              </Input>

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
                <CheckboxLabel>Estou cursando atualmente</CheckboxLabel>
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
                isDisabled={createEducation.isPending}
              >
                {createEducation.isPending ? (
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
          setEducationToDelete(null);
        }}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg" color="$error600">
              Deletar Formação
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
                    {educationToDelete?.degree} em {educationToDelete?.fieldOfStudy}?
                  </Text>
                </VStack>
              </HStack>
              <Text color="$textLight" fontSize="$sm">
                Esta formação será removida do seu acervo e de todos os
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
                isDisabled={deleteEducation.isPending}
              >
                {deleteEducation.isPending ? (
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
                  setEducationToDelete(null);
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
