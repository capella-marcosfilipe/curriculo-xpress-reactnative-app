import React from 'react';
import { Box, VStack, Heading, Text } from '@gluestack-ui/themed';
import { ScrollView } from 'react-native';

export default function ProfissionalScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#ECEFF4' }}>
      <Box flex={1} p="$6">
        <VStack space="lg">
          <Heading size="xl" color="$primary">
            Experiência Profissional
          </Heading>
          
          <Text color="$textLight">
            Aqui você poderá listar suas experiências de trabalho: 
            empresa, cargo, período, descrição, etc.
          </Text>

          <Text color="$secondary" fontWeight="$bold" mt="$4">
            🚧 Em construção
          </Text>
        </VStack>
      </Box>
    </ScrollView>
  );
}
