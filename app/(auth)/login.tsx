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

      console.log('🔐 === INICIANDO LOGIN ===');
      console.log('📧 Email:', email);
      console.log('🌐 URL Base:', api.defaults.baseURL);
      
      const response = await api.post('/auth/login', { 
        email, 
        password 
      });

      console.log('✅ === LOGIN BEM-SUCEDIDO ===');
      console.log('📦 Response completo:', JSON.stringify(response.data, null, 2));
      console.log('🎟️ Token recebido:', response.data.token?.substring(0, 30) + '...');
      
      await login(response.data.token);

      console.log('💾 Token salvo no Zustand/SecureStore');
      console.log('🚀 Redirecionando para /(tabs)/...');

      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('❌ === ERRO NO LOGIN ===');
      console.error('Tipo do erro:', err.constructor.name);
      
      if (err.response) {
        // Erro da API (4xx, 5xx)
        console.error('Status HTTP:', err.response.status);
        console.error('Response data:', JSON.stringify(err.response.data, null, 2));
        console.error('Headers:', JSON.stringify(err.response.headers, null, 2));
        
        setError(
          err.response.data?.message || 
          `Erro ${err.response.status}: ${err.response.statusText}`
        );
      } else if (err.request) {
        // Request foi feito mas sem resposta (timeout, sem internet, etc)
        console.error('❌ Request feito mas sem resposta');
        console.error('Request:', err.request);
        setError('Erro de conexão. Verifique se o backend está acessível.');
      } else {
        // Erro antes de fazer o request
        console.error('❌ Erro ao configurar request:', err.message);
        setError(`Erro: ${err.message}`);
      }
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
              <LinkText>
                <Text color="$textLight">Não tem uma conta?{' '}</Text>
                <Text color="$primary">Cadastre-se</Text>
              </LinkText>
            </Link>
          </ExpoLink>
        </VStack>
      </VStack>
    </Box>
  );
}
