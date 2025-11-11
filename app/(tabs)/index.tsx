import React from 'react';
import { Box, VStack, Heading, Text, Button, ButtonText } from '@gluestack-ui/themed';
import { ScrollView } from 'react-native';
import useAuthStore from '../../store/useAuthStore';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#ECEFF4' }}>
      <Box flex={1} p="$6">
        <VStack space="lg">
          <Heading size="2xl" color="$primary">
            Bem-vindo ao Currículo Xpress! 🎉
          </Heading>
          
          <Text color="$textLight" fontSize="$md">
            Esta é a tela inicial do seu portfólio/currículo digital.
          </Text>

          <Text color="$textLight" fontSize="$sm" mt="$4">
            Navegue pelas abas abaixo para:
          </Text>

          <VStack space="sm" ml="$4">
            <Text color="$textLight">• Ver suas informações pessoais (Sobre)</Text>
            <Text color="$textLight">• Gerenciar experiências acadêmicas</Text>
            <Text color="$textLight">• Gerenciar experiências profissionais</Text>
            <Text color="$textLight">• Exibir seus projetos</Text>
          </VStack>

          <Button onPress={handleLogout} bg="$secondary" mt="$6">
            <ButtonText>Sair</ButtonText>
          </Button>
        </VStack>
      </Box>
    </ScrollView>
  );
}
