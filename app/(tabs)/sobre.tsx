import React from 'react';
import { Box, VStack, Heading, Text } from '@gluestack-ui/themed';
import { ScrollView } from 'react-native';

export default function SobreScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#ECEFF4' }}>
      <Box flex={1} p="$6">
        <VStack space="lg">
          <Heading size="xl" color="$primary">
            Sobre Mim
          </Heading>
          
          <Text color="$textLight">
            Esta tela exibirá suas informações pessoais, como nome, email, 
            bio, foto de perfil, etc.
          </Text>

          <Text color="$secondary" fontWeight="$bold" mt="$4">
            🚧 Em construção
          </Text>
        </VStack>
      </Box>
    </ScrollView>
  );
}
