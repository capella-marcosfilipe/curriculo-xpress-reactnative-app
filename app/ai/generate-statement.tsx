import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
    Alert,
    AlertIcon,
    AlertText,
    Box,
    Button,
    ButtonText,
    Card,
    HStack,
    Heading,
    Input,
    InputField,
    Select,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectIcon,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger,
    Spinner,
    Text,
    Textarea,
    TextareaInput,
    VStack,
} from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useCurriculums } from '../../hooks/useCurriculums';
import { useGenerateStatementWithAI } from '../../hooks/useStatements';

export default function GenerateStatementScreen() {
  const router = useRouter();
  const { data: curriculums } = useCurriculums();
  const generateStatement = useGenerateStatementWithAI();

  const [selectedCurriculumId, setSelectedCurriculumId] = useState('');
  const [title, setTitle] = useState(''); // ✅ NOVO
  const [jobDescription, setJobDescription] = useState('');
  const [generatedStatement, setGeneratedStatement] = useState<any>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    try {
      setError('');
      setGeneratedStatement(null);

      if (!selectedCurriculumId) {
        setError('Por favor, selecione um currículo');
        return;
      }

      if (!title.trim()) {
        setError('Por favor, dê um título para o statement');
        return;
      }

      if (!jobDescription.trim()) {
        setError('Por favor, descreva a vaga de trabalho');
        return;
      }

      const result = await generateStatement.mutateAsync({
        curriculumId: selectedCurriculumId,
        title: title.trim(),
        jobDescription: jobDescription.trim(),
      });

      setGeneratedStatement(result);
      console.log('🎉 Statement gerado:', result);

    } catch (err: any) {
      console.error('Erro:', err);
      setError(
        err.response?.data?.message ||
        'Erro ao gerar statement. Tente novamente.'
      );
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#ECEFF4' }}>
      <Box flex={1} p="$6">
        <VStack space="lg">
          {/* Header */}
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

          <VStack space="sm">
            <HStack space="sm" alignItems="center">
              <MaterialIcons name="auto-awesome" size={32} color="#5A9EAD" />
              <Heading size="2xl" color="$primary">
                Gerar Resumo com IA
              </Heading>
            </HStack>
            <Text color="$textLight" fontSize="$sm">
              Use o poder do Google Gemini para criar um resumo profissional
              personalizado para uma vaga específica.
            </Text>
          </VStack>

          {/* Seletor de Currículo */}
          <VStack space="sm">
            <Text color="$textLight" fontWeight="$bold">
              1. Selecione o currículo base
            </Text>
            <Select
              selectedValue={selectedCurriculumId}
              onValueChange={setSelectedCurriculumId}
            >
              <SelectTrigger>
                <SelectInput placeholder="Escolha um currículo" />
                <SelectIcon mr="$3">
                  <MaterialIcons name="arrow-drop-down" size={24} color="#5A9EAD" />
                </SelectIcon>
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {curriculums && curriculums.map((curriculum) => (
                    <SelectItem
                      key={curriculum.id}
                      label={curriculum.title}
                      value={curriculum.id}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </VStack>

          <VStack space="sm">
            <Text color="$textLight" fontWeight="$bold">
              2. Dê um título para o seu resumo
            </Text>
            <Text color="$textLight" fontSize="$xs">
              Ex: "Backend Developer", "AI Engineer", "Data Scientist"
            </Text>
            <Input>
              <InputField
                placeholder="Ex: AI Development Intern"
                value={title}
                onChangeText={setTitle}
              />
            </Input>
          </VStack>

          {/* Input de Job Description */}
          <VStack space="sm">
            <Text color="$textLight" fontWeight="$bold">
              3. Descreva a vaga de trabalho
            </Text>
            <Text color="$textLight" fontSize="$xs">
              Cole a descrição da vaga para a qual você quer se candidatar.
              Quanto mais detalhes, melhor!
            </Text>
            <Textarea
              size="md"
              isReadOnly={false}
              isInvalid={false}
              isDisabled={false}
              minHeight={150}
            >
              <TextareaInput
                placeholder="Ex: Procuramos um desenvolvedor React Native com experiência em TypeScript, APIs REST, e Firebase..."
                value={jobDescription}
                onChangeText={setJobDescription}
              />
            </Textarea>
          </VStack>

          {/* Erro */}
          {error && (
            <Alert action="error" variant="accent">
              <AlertIcon as={MaterialIcons} name="error" mr="$2" />
              <AlertText>{error}</AlertText>
            </Alert>
          )}

          {/* Botão de Gerar */}
          <Button
            onPress={handleGenerate}
            bg="$primary"
            size="lg"
            isDisabled={generateStatement.isPending}
            mt="$12"
          >
            {generateStatement.isPending ? (
              <HStack space="sm" alignItems="center">
                <Spinner color="$white" />
                <ButtonText>Gerando com IA...</ButtonText>
              </HStack>
            ) : (
              <HStack space="sm" alignItems="center">
                <MaterialIcons name="auto-awesome" size={20} color="white" />
                <ButtonText>Gerar Resumo</ButtonText>
              </HStack>
            )}
          </Button>

          {/* Resultado */}
          {generatedStatement && (
            <Card p="$5" bg="$white" borderRadius="$lg" borderColor="$primary" borderWidth={2}>
              <VStack space="md">
                <HStack space="sm" alignItems="center">
                  <MaterialIcons name="check-circle" size={24} color="#6B8F5A" />
                  <Heading size="lg" color="$secondary">
                    Statement Gerado! ✨
                  </Heading>
                </HStack>

                <VStack space="sm">
                  <Text color="$textLight" fontWeight="$bold" fontSize="$sm">
                    Título:
                  </Text>
                  <Text color="$primary" fontSize="$md" fontWeight="$medium">
                    {generatedStatement.statement?.title || generatedStatement.title}
                  </Text>
                </VStack>

                <VStack space="sm">
                  <Text color="$textLight" fontWeight="$bold" fontSize="$sm">
                    Texto:
                  </Text>
                  <Text color="$textLight" fontSize="$md" lineHeight="$xl">
                    {generatedStatement.statement?.text || generatedStatement.text}
                  </Text>
                </VStack>

                <Alert action="info" variant="solid">
                  <AlertIcon as={MaterialIcons} name="info" mr="$2" />
                  <AlertText>
                    Este statement foi salvo automaticamente e agora está disponível
                    para usar em seus currículos!
                  </AlertText>
                </Alert>

                <Button
                  onPress={() => router.back()}
                  bg="$secondary"
                  size="lg"
                >
                  <ButtonText>Ver Meus Currículos</ButtonText>
                </Button>
              </VStack>
            </Card>
          )}
        </VStack>
      </Box>
    </ScrollView>
  );
}
