import { MaterialIcons } from '@expo/vector-icons';
import {
    Alert,
    AlertIcon,
    AlertText,
    Box,
    Button,
    ButtonText,
    Center,
    Heading,
    Input,
    InputField,
    Link,
    LinkText,
    ScrollView,
    Spinner,
    Text,
    VStack
} from '@gluestack-ui/themed';
import { Link as ExpoLink, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

import api from '../../services/api';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
      });

      setSuccess('Conta criada com sucesso! Redirecionando para o login...');
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.status === 409) {
        setError('Este email já está em uso.');
      } else {
        setError('Erro ao tentar registrar. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Center flex={1} p="$5">
          <VStack space="md" w="$full" maxWidth="$96">
            <Heading size="2xl" textAlign="center" mb="$4">
              Crie sua conta
            </Heading>
            <Text textAlign="center" mb="$8">É rápido e fácil.</Text>

            <Input variant="outline" size="lg">
              <InputField
                placeholder="Nome"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </Input>

            <Input variant="outline" size="lg">
              <InputField
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Input>

            <Input variant="outline" size="lg">
              <InputField
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </Input>

            {error && (
              <Alert action="error" variant="accent">
                <AlertIcon as={MaterialIcons} mr="$2" />
                <AlertText>{error}</AlertText>
              </Alert>
            )}

            {success && (
              <Alert action="success" variant="accent">
                <AlertIcon as={MaterialIcons} mr="$2" />
                <AlertText>{success}</AlertText>
              </Alert>
            )}

            <Button
              size="lg"
              action="primary"
              onPress={handleRegister}
              isDisabled={isLoading}
            >
              {isLoading ? <Spinner /> : <ButtonText>Registrar</ButtonText>}
            </Button>

            <Box flexDirection="row" justifyContent="center" mt="$4">
              <Text>Já tem uma conta? </Text>
              <ExpoLink href="/login" asChild>
                <Link>
                  <LinkText color="$primary">Faça login</LinkText>
                </Link>
              </ExpoLink>
            </Box>
          </VStack>
        </Center>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
