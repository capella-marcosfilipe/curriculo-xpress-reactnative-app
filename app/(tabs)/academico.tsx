import React from 'react';
import { Box, VStack, Heading, Text } from '@gluestack-ui/themed';
import { ScrollView } from 'react-native';

export default function AcademicoScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#ECEFF4' }}>
      <Box flex={1} p="$6">
        <VStack space="lg">
          <Heading size="xl" color="$primary">
            Formação Acadêmica
          </Heading>
          
          <Text color="$textLight">
            Aqui você poderá listar suas formações acadêmicas: 
            universidade, curso, período, etc.
          </Text>

          <Text color="$secondary" fontWeight="$bold" mt="$4">
            🚧 Em construção
          </Text>
        </VStack>
      </Box>
    </ScrollView>
  );
}
