import React from 'react';
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
  ScrollView as GluestackScrollView,
} from '@gluestack-ui/themed';
import { ScrollView, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useCurriculum } from '../../hooks/useCurriculums';

export default function CurriculumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: curriculum, isLoading, isError, refetch } = useCurriculum(id);

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

          {/* Botões de Ação */}
          <VStack space="md" mt="$4">
            <Button bg="$secondary" size="lg">
              <HStack space="sm" alignItems="center">
                <MaterialIcons name="edit" size={20} color="white" />
                <ButtonText>Editar Currículo</ButtonText>
              </HStack>
            </Button>
            
            <Button
              variant="outline"
              borderColor="$error600"
              size="lg"
              onPress={() => {
                // TODO: Implementar deletar
                console.log('Deletar currículo');
              }}
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
  );
}
