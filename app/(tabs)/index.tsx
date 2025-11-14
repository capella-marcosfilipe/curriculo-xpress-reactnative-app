import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  Box,
  Button,
  ButtonText,
  Card,
  HStack,
  Heading,
  Pressable,
  Spinner,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { useCurriculums } from '../../hooks/useCurriculums';
import useAuthStore from '../../store/useAuthStore';

export default function HomeScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { data: curriculums, isLoading, isError, refetch } = useCurriculums();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const handleCreateCurriculum = () => {
    // Navega para a tela de criação (criaremos depois)
    router.push('/curriculum/create');
  };

  const handleViewCurriculum = (id: string) => {
    // Navega para a tela de visualização do currículo
    router.push(`/curriculum/${id}`);
  };

  // Estado de carregamento
  if (isLoading) {
    return (
      <Box flex={1} bg="$backgroundLight" justifyContent="center" alignItems="center">
        <Spinner size="large" color="$primary" />
        <Text mt="$4" color="$textLight">Carregando currículos...</Text>
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
            Erro ao carregar currículos. Verifique sua conexão.
          </Text>
          <Button onPress={() => refetch()} bg="$primary">
            <ButtonText>Tentar novamente</ButtonText>
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#ECEFF4' }}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <Box flex={1} p="$6">
        <VStack space="lg">
          {/* Header */}
          <HStack justifyContent="space-between" alignItems="center">
            <Heading size="2xl" color="$primary">
              Meus Currículos
            </Heading>
            <Pressable onPress={handleLogout}>
              <MaterialIcons name="logout" size={28} color="#5A9EAD" />
            </Pressable>
          </HStack>

          {/* Botão de criar novo currículo */}
          <Button onPress={handleCreateCurriculum} bg="$primary" size="lg">
            <HStack space="sm" alignItems="center">
              <Ionicons name="add-circle-outline" size={20} color="white" />
              <ButtonText>Criar Novo Currículo</ButtonText>
            </HStack>
          </Button>

          {/* Botão de Gerar Resumo com IA */}
          <Button
            onPress={() => router.push('/ai/generate-statement')}
            bg="$secondary"
            size="lg"
          >
            <HStack space="sm" alignItems="center">
              <MaterialIcons name="auto-awesome" size={20} color="white" />
              <ButtonText>Gerar Resumo com IA</ButtonText>
            </HStack>
          </Button>

          {/* Lista de currículos */}
          {curriculums && curriculums.length > 0 ? (
            <VStack space="md" mt="$2">
              <Text color="$textLight" fontSize="$sm">
                {curriculums.length} {curriculums.length === 1 ? 'currículo' : 'currículos'} encontrado(s)
              </Text>

              {curriculums.map((curriculum) => (
                <Pressable
                  key={curriculum.id}
                  onPress={() => handleViewCurriculum(curriculum.id)}
                >
                  <Card
                    p="$4"
                    bg="$white"
                    borderRadius="$lg"
                    shadowColor="$black"
                    shadowOffset={{ width: 0, height: 2 }}
                    shadowOpacity={0.1}
                    shadowRadius={4}
                  >
                    <VStack space="sm">
                      <HStack justifyContent="space-between" alignItems="center">
                        <Heading size="md" color="$primary">
                          {curriculum.title || `Currículo #${curriculum.id.substring(0, 8)}`}
                        </Heading>
                        <Ionicons name="chevron-forward" size={20} color="#5A9EAD" />
                      </HStack>

                      {curriculum.statement && (
                        <Text
                          color="$textLight"
                          fontSize="$sm"
                          numberOfLines={2}
                        >
                          {curriculum.statement.text}
                        </Text>
                      )}

                      <HStack space="md" mt="$2" flexWrap="wrap">
                        {curriculum.educations && curriculum.educations.length > 0 && (
                          <HStack space="xs" alignItems="center">
                            <MaterialIcons name="school" size={16} color="#88C0D0" />
                            <Text color="$textLight" fontSize="$xs">
                              {curriculum.educations.length} formação
                            </Text>
                          </HStack>
                        )}
                        {curriculum.experiences && curriculum.experiences.length > 0 && (
                          <HStack space="xs" alignItems="center">
                            <MaterialIcons name="work" size={16} color="#88C0D0" />
                            <Text color="$textLight" fontSize="$xs">
                              {curriculum.experiences.length} experiência
                            </Text>
                          </HStack>
                        )}
                        {curriculum.skills && curriculum.skills.length > 0 && (
                          <HStack space="xs" alignItems="center">
                            <MaterialIcons name="star" size={16} color="#88C0D0" />
                            <Text color="$textLight" fontSize="$xs">
                              {curriculum.skills.length} skill
                            </Text>
                          </HStack>
                        )}
                        {curriculum.projects && curriculum.projects.length > 0 && (
                          <HStack space="xs" alignItems="center">
                            <MaterialIcons name="code" size={16} color="#88C0D0" />
                            <Text color="$textLight" fontSize="$xs">
                              {curriculum.projects.length} projeto
                            </Text>
                          </HStack>
                        )}
                      </HStack>

                      <Text color="$textLight" fontSize="$xs" mt="$2">
                        Atualizado: {new Date(curriculum.updatedAt).toLocaleDateString('pt-BR')}
                      </Text>
                    </VStack>
                  </Card>
                </Pressable>
              ))}
            </VStack>
          ) : (
            // Estado vazio
            <VStack space="lg" alignItems="center" mt="$8">
              <MaterialIcons name="description" size={80} color="#D5EDF3" />
              <VStack space="sm" alignItems="center">
                <Text color="$textLight" fontSize="$lg" fontWeight="$bold">
                  Nenhum currículo criado ainda
                </Text>
                <Text color="$textLight" fontSize="$sm" textAlign="center" px="$4">
                  Crie seu primeiro currículo para começar a organizar suas experiências
                </Text>
              </VStack>
              <Button onPress={handleCreateCurriculum} bg="$secondary" mt="$4">
                <ButtonText>Criar Primeiro Currículo</ButtonText>
              </Button>
            </VStack>
          )}
        </VStack>
      </Box>
    </ScrollView>
  );
}
