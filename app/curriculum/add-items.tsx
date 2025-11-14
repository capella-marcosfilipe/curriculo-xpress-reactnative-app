import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
    Alert,
    AlertIcon,
    AlertText,
    Box,
    Button,
    ButtonText,
    HStack,
    Heading,
    Input,
    InputField,
    VStack
} from '@gluestack-ui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useCreateEducation, useCreateSkill } from '../../hooks/useEducations';

export default function AddItemsScreen() {
  const { curriculumId } = useLocalSearchParams<{ curriculumId: string }>();
  const router = useRouter();
  const createEducation = useCreateEducation();
  const createSkill = useCreateSkill();

  // Education
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [field, setField] = useState('');
  const [startDate, setStartDate] = useState('');

  // Skill
  const [skillName, setSkillName] = useState('');

  const [error, setError] = useState('');

  const handleAddEducation = async () => {
    try {
      setError('');
      if (!institution || !degree || !field || !startDate) {
        setError('Preencha instituição, grau, área e data de início');
        return;
      }

      await createEducation.mutateAsync({
        curriculumId: curriculumId!,
        institution,
        degree,
        fieldOfStudy: field,
        startDate,
      });

      alert('Educação adicionada!');
      router.back();
    } catch (err) {
      setError('Erro ao adicionar educação');
    }
  };

  const handleAddSkill = async () => {
    try {
      setError('');
      if (!skillName) {
        setError('Digite o nome da habilidade');
        return;
      }

      await createSkill.mutateAsync({
        curriculumId: curriculumId!,
        name: skillName,
      });

      setSkillName('');
      alert('Habilidade adicionada!');
    } catch (err) {
      setError('Erro ao adicionar habilidade');
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#ECEFF4' }}>
      <Box flex={1} p="$6">
        <VStack space="lg">
          <HStack space="md" alignItems="center">
            <Button onPress={() => router.back()} variant="link" size="sm" p="$0">
              <HStack space="xs" alignItems="center">
                <Ionicons name="arrow-back" size={20} color="#5A9EAD" />
                <ButtonText color="$primary">Voltar</ButtonText>
              </HStack>
            </Button>
          </HStack>

          <Heading size="2xl" color="$primary">
            Adicionar ao Currículo
          </Heading>

          {error && (
            <Alert action="error" variant="accent">
              <AlertIcon as={MaterialIcons} name="error" mr="$2" />
              <AlertText>{error}</AlertText>
            </Alert>
          )}

          {/* Educação */}
          <VStack space="md">
            <Heading size="lg" color="$primary">Adicionar Formação</Heading>
            <Input><InputField placeholder="Instituição" value={institution} onChangeText={setInstitution} /></Input>
            <Input><InputField placeholder="Grau (Ex: Bacharelado)" value={degree} onChangeText={setDegree} /></Input>
            <Input><InputField placeholder="Área (Ex: Ciência da Computação)" value={field} onChangeText={setField} /></Input>
            <Input><InputField placeholder="Data Início (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate} /></Input>
            <Button onPress={handleAddEducation} bg="$primary" isDisabled={createEducation.isPending}>
              <ButtonText>{createEducation.isPending ? 'Adicionando...' : 'Adicionar Formação'}</ButtonText>
            </Button>
          </VStack>

          {/* Skill */}
          <VStack space="md">
            <Heading size="lg" color="$primary">Adicionar Habilidade</Heading>
            <Input><InputField placeholder="Nome da habilidade" value={skillName} onChangeText={setSkillName} /></Input>
            <Button onPress={handleAddSkill} bg="$secondary" isDisabled={createSkill.isPending}>
              <ButtonText>{createSkill.isPending ? 'Adicionando...' : 'Adicionar Habilidade'}</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
}
