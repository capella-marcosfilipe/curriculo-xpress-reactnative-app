import {
    Alert,
    AlertIcon,
    AlertText,
    Box,
    Button,
    ButtonText,
    Heading,
    Input,
    InputField,
    Link,
    LinkText,
    Text,
    VStack
} from '@gluestack-ui/themed';
import { Link as ExpoLink, useRouter } from 'expo-router';
import React, { useState } from 'react';

import { MaterialIcons } from '@expo/vector-icons';

import api from '../../services/api';
import useAuthStore from '../../store/useAuthStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    try {
      setError('');
      setIsLoading(true);
      
      const response = await api.post('/auth/login', { 
        email, 
        password 
      });
      
      await login(response.data.token);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Erro ao fazer login. Verifique suas credenciais.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box flex={1} bg="$backgroundLight" p="$6" justifyContent="center">
      <VStack space="lg" maxWidth={400} width="100%" alignSelf="center">
        <Heading size="2xl" color="$primary">
          Login
        </Heading>
        <Text color="$textLight">
          Entre com suas credenciais para continuar
        </Text>

        {error && (
          <Alert action="error" variant="accent">
            <AlertIcon as={MaterialIcons} mr="$2" />
            <AlertText>{error}</AlertText>
          </Alert>
        )}

        <VStack space="md">
          <Input>
            <InputField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Input>

          <Input>
            <InputField
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </Input>

          <Button
            onPress={handleLogin}
            isDisabled={isLoading}
            bg="$primary"
          >
            <ButtonText>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </ButtonText>
          </Button>

          <ExpoLink href="/(auth)/register" asChild>
            <Link>
              <Text color="$textLight">
                Não tem uma conta?{' '}
                <LinkText color="$primary">Cadastre-se</LinkText>
              </Text>
            </Link>
          </ExpoLink>
        </VStack>
      </VStack>
    </Box>
  );
}
