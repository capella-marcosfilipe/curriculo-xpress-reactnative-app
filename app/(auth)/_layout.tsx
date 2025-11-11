import { Stack } from 'expo-router';

/**
 * Este é o layout para o grupo de autenticação.
 * Ele define que as telas de login e registro
 * são parte de uma "pilha" (Stack) de navegação
 * e não devem mostrar o cabeçalho (headerShown: false).
 */
export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}