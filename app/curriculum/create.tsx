import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  InputField,
  Textarea,
  TextareaInput,
  Button,
  ButtonText,
  Alert,
  AlertIcon,
  AlertText,
  Spinner,
  Card,
  Pressable,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ScrollView as GluestackScrollView,
} from '@gluestack-ui/themed';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useCreateCurriculum } from '../../hooks/useCurriculums';
import { useStatements, useCreateStatement } from '../../hooks/useStatements';

export default function CreateCurriculumScreen() {
  const router = useRouter();
  const createCurriculum = useCreateCurriculum();
  const { data: statements, isLoading: loadingStatements } = useStatements();

  const [selectedStatementId, setSelectedStatementId] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  // ✅ FALTAVA ESTE ESTADO!
  const [showStatementModal, setShowStatementModal] = useState(false);

  // Estados para criar statement manual
  const [showCreateStatementModal, setShowCreateStatementModal] = useState(false);
  const [newStatementTitle, setNewStatementTitle] = useState('');
  const [newStatementText, setNewStatementText] = useState('');
  const [createStatementError, setCreateStatementError] = useState('');

  const createStatementMutation = useCreateStatement();

  const handleCreateManualStatement = async () => {
    try {
      setCreateStatementError('');

      if (!newStatementTitle.trim()) {
        setCreateStatementError('Digite um título');
        return;
      }
      if (!newStatementText.trim()) {
        setCreateStatementError('Digite o texto do statement');
        return;
      }

      const newStatement = await createStatementMutation.mutateAsync({
        title: newStatementTitle.trim(),
        text: newStatementText.trim(),
      });

      // Fecha modal e seleciona automaticamente o statement criado
      setShowCreateStatementModal(false);
      setSelectedStatementId(newStatement.id);
      setNewStatementTitle('');
      setNewStatementText('');
    } catch (err: any) {
      setCreateStatementError(err.response?.data?.message || 'Erro ao criar statement');
    }
  };

  const handleCreate = async () => {
    try {
      setError('');

      if (!selectedStatementId) {
        setError('Por favor, selecione um Statement (resumo pessoal)');
        return;
      }

      const newCurriculum = await createCurriculum.mutateAsync({
        statementId: selectedStatementId,
        title: title.trim() || undefined,
      });

      router.replace(`/curriculum/${newCurriculum.id}`);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar currículo. Tente novamente.');
    }
  };

  const selectedStatement = statements?.find(s => s.id === selectedStatementId);

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: '#ECEFF4' }}>
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
              <HStack space="sm" alignItems="center">
                <MaterialIcons name="add-circle" size={32} color="#5A9EAD" />
                <Heading size="2xl" color="$primary">
                  Criar Novo Currículo
                </Heading>
              </HStack>
              <Text color="$textLight" fontSize="$sm">
                Um currículo precisa de um Statement (resumo pessoal). 
                Selecione um existente ou crie um novo!
              </Text>
            </VStack>

            {/* Loading States */}
            {loadingStatements && (
              <Card p="$4" bg="$white" borderRadius="$lg">
                <HStack space="sm" alignItems="center">
                  <Spinner color="$primary" />
                  <Text color="$textLight">Carregando statements...</Text>
                </HStack>
              </Card>
            )}

            {/* Verificar se há statements */}
            {!loadingStatements && statements && statements.length === 0 && (
              <Card p="$5" bg="$white" borderRadius="$lg" borderColor="$warning" borderWidth={2}>
                <VStack space="md">
                  <HStack space="sm" alignItems="center">
                    <MaterialIcons name="info" size={24} color="#F59E0B" />
                    <Heading size="md" color="$warning">
                      Nenhum Statement Encontrado
                    </Heading>
                  </HStack>
                  <Text color="$textLight">
                    Você precisa criar pelo menos um Statement antes de criar um currículo.
                  </Text>
                  
                  {/* Botão para criar statement manual */}
                  <Button
                    onPress={() => setShowCreateStatementModal(true)}
                    bg="$primary"
                    size="lg"
                  >
                    <HStack space="sm" alignItems="center">
                      <MaterialIcons name="edit" size={20} color="white" />
                      <ButtonText>Criar Statement Manual</ButtonText>
                    </HStack>
                  </Button>

                  {/* Botão para gerar com IA */}
                  <Button
                    onPress={() => router.push('/ai/generate-statement')}
                    bg="$secondary"
                    size="lg"
                  >
                    <HStack space="sm" alignItems="center">
                      <MaterialIcons name="auto-awesome" size={20} color="white" />
                      <ButtonText>Gerar Statement com IA</ButtonText>
                    </HStack>
                  </Button>
                </VStack>
              </Card>
            )}

            {/* Formulário (só mostra se tiver statements) */}
            {!loadingStatements && statements && statements.length > 0 && (
              <>
                {/* Botão para abrir modal de seleção */}
                <VStack space="sm">
                  <Text color="$textLight" fontWeight="$bold">
                    1. Selecione o Statement (Resumo Pessoal)
                  </Text>
                  <Text color="$textLight" fontSize="$xs">
                    Este será o resumo principal do seu currículo
                  </Text>
                  
                  <Pressable onPress={() => setShowStatementModal(true)}>
                    <Card p="$4" bg="$white" borderRadius="$lg" borderColor="$primary" borderWidth={1}>
                      <HStack justifyContent="space-between" alignItems="center">
                        <Text color={selectedStatement ? "$primary" : "$textLight"}>
                          {selectedStatement ? selectedStatement.title : "Escolha um statement"}
                        </Text>
                        <MaterialIcons name="arrow-drop-down" size={24} color="#5A9EAD" />
                      </HStack>
                    </Card>
                  </Pressable>

                  {/* Preview do Statement Selecionado */}
                  {selectedStatement && (
                    <Card p="$4" bg="$white" borderRadius="$lg" mt="$2">
                      <VStack space="sm">
                        <Text color="$textLight" fontSize="$xs" fontWeight="$bold">
                          Preview:
                        </Text>
                        <Text color="$primary" fontSize="$sm" fontWeight="$medium">
                          {selectedStatement.title}
                        </Text>
                        <Text color="$textLight" fontSize="$xs" numberOfLines={3}>
                          {selectedStatement.text}
                        </Text>
                      </VStack>
                    </Card>
                  )}
                </VStack>

                {/* Campo de Título */}
                <VStack space="sm">
                  <Text color="$textLight" fontWeight="$bold">
                    2. Dê um título para o currículo (Opcional)
                  </Text>
                  <Text color="$textLight" fontSize="$xs">
                    Ex: "Currículo para Desenvolvedor Backend", "Currículo de Estagiário"
                  </Text>
                  <Input>
                    <InputField
                      placeholder="Ex: Currículo para Desenvolvedor Full Stack"
                      value={title}
                      onChangeText={setTitle}
                    />
                  </Input>
                </VStack>

                {/* Erro */}
                {error && (
                  <Alert action="error" variant="accent">
                    <AlertIcon as={MaterialIcons} name="error" mr="$2" />
                    <AlertText>{error}</AlertText>
                  </Alert>
                )}

                {/* Botão de Criar */}
                <Button
                  onPress={handleCreate}
                  bg="$primary"
                  size="lg"
                  isDisabled={createCurriculum.isPending}
                  mt="$4"
                >
                  {createCurriculum.isPending ? (
                    <HStack space="sm" alignItems="center">
                      <Spinner color="$white" />
                      <ButtonText>Criando...</ButtonText>
                    </HStack>
                  ) : (
                    <HStack space="sm" alignItems="center">
                      <MaterialIcons name="add-circle" size={20} color="white" />
                      <ButtonText>Criar Currículo</ButtonText>
                    </HStack>
                  )}
                </Button>

                {/* Link para criar Statement manual */}
                <Card p="$4" bg="$white" borderRadius="$lg">
                  <VStack space="sm">
                    <Text color="$textLight" fontSize="$sm">
                      Ou crie um novo statement manualmente:
                    </Text>
                    <Button
                      onPress={() => setShowCreateStatementModal(true)}
                      variant="outline"
                      borderColor="$primary"
                      size="md"
                    >
                      <HStack space="sm" alignItems="center">
                        <MaterialIcons name="edit" size={18} color="#5A9EAD" />
                        <ButtonText color="$primary">Criar Statement Manual</ButtonText>
                      </HStack>
                    </Button>
                  </VStack>
                </Card>

                {/* Link para criar Statement com IA */}
                <Card p="$4" bg="$white" borderRadius="$lg">
                  <VStack space="sm">
                    <Text color="$textLight" fontSize="$sm">
                      Ou gere um statement personalizado com IA:
                    </Text>
                    <Button
                      onPress={() => router.push('/ai/generate-statement')}
                      variant="outline"
                      borderColor="$secondary"
                      size="md"
                    >
                      <HStack space="sm" alignItems="center">
                        <MaterialIcons name="auto-awesome" size={18} color="#6B8F5A" />
                        <ButtonText color="$secondary">Gerar com IA</ButtonText>
                      </HStack>
                    </Button>
                  </VStack>
                </Card>
              </>
            )}
          </VStack>
        </Box>
      </ScrollView>

      {/* Modal de Seleção de Statement */}
      <Modal
        isOpen={showStatementModal}
        onClose={() => setShowStatementModal(false)}
      >
        <ModalBackdrop />
        <ModalContent maxHeight="80%">
          <ModalHeader>
            <Heading size="lg" color="$primary">
              Selecione um Statement
            </Heading>
            <ModalCloseButton>
              <MaterialIcons name="close" size={24} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <GluestackScrollView>
              <VStack space="sm">
                {statements?.map((statement) => (
                  <Pressable
                    key={statement.id}
                    onPress={() => {
                      setSelectedStatementId(statement.id);
                      setShowStatementModal(false);
                    }}
                  >
                    <Card
                      p="$4"
                      bg={selectedStatementId === statement.id ? "$primary100" : "$white"}
                      borderRadius="$lg"
                      borderColor={selectedStatementId === statement.id ? "$primary" : "$backgroundLight"}
                      borderWidth={selectedStatementId === statement.id ? 2 : 1}
                    >
                      <VStack space="sm">
                        <HStack justifyContent="space-between" alignItems="center">
                          <Heading size="sm" color="$primary" flex={1}>
                            {statement.title}
                          </Heading>
                          {selectedStatementId === statement.id && (
                            <MaterialIcons name="check-circle" size={20} color="#5A9EAD" />
                          )}
                        </HStack>
                        <Text color="$textLight" fontSize="$xs" numberOfLines={2}>
                          {statement.text}
                        </Text>
                      </VStack>
                    </Card>
                  </Pressable>
                ))}
              </VStack>
            </GluestackScrollView>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              borderColor="$primary"
              size="lg"
              width="100%"
              onPress={() => setShowStatementModal(false)}
            >
              <ButtonText color="$primary">Fechar</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Criar Statement Manual */}
      <Modal
        isOpen={showCreateStatementModal}
        onClose={() => {
          setShowCreateStatementModal(false);
          setNewStatementTitle('');
          setNewStatementText('');
          setCreateStatementError('');
        }}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg" color="$primary">
              Criar Statement Manual
            </Heading>
            <ModalCloseButton>
              <MaterialIcons name="close" size={24} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <Text color="$textLight" fontSize="$sm">
                Crie um resumo profissional manualmente. Você pode gerar com IA depois.
              </Text>

              <Input>
                <InputField
                  placeholder="Título (ex: Desenvolvedor Full Stack)"
                  value={newStatementTitle}
                  onChangeText={setNewStatementTitle}
                />
              </Input>

              <Textarea size="md" minHeight={150}>
                <TextareaInput
                  placeholder="Escreva seu resumo profissional aqui..."
                  value={newStatementText}
                  onChangeText={setNewStatementText}
                />
              </Textarea>

              {createStatementError && (
                <Alert action="error" variant="accent">
                  <AlertIcon as={MaterialIcons} name="error" mr="$2" />
                  <AlertText>{createStatementError}</AlertText>
                </Alert>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <VStack space="sm" width="100%">
              <Button
                onPress={handleCreateManualStatement}
                bg="$primary"
                size="lg"
                isDisabled={createStatementMutation.isPending}
              >
                {createStatementMutation.isPending ? (
                  <HStack space="sm" alignItems="center">
                    <Spinner color="$white" />
                    <ButtonText>Criando...</ButtonText>
                  </HStack>
                ) : (
                  <ButtonText>Criar Statement</ButtonText>
                )}
              </Button>
              <Button
                variant="outline"
                borderColor="$primary"
                size="lg"
                onPress={() => {
                  setShowCreateStatementModal(false);
                  setNewStatementTitle('');
                  setNewStatementText('');
                  setCreateStatementError('');
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
