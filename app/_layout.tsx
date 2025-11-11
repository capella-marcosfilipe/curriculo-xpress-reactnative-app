import FontAwesome from '@expo/vector-icons/FontAwesome';
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import useAuthStore from "../store/useAuthStore";
import { config } from "../theme/config";

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

const DEBUG_MODE = false; // Caso precise visualizar sem proteger a rota.

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const token = useAuthStore((state) => state.token);
  const isLoading = useAuthStore((state) => state.isLoading);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // 🔧 Se DEBUG_MODE está ativo, não redireciona
    if (DEBUG_MODE) return;

    // Aguarda o checkAuth terminar antes de redirecionar
    if (isLoading) return;

    // Detecta se o usuário está no grupo de autenticação
    const inAuthGroup = segments[0] === '(auth)';

    if (!token && !inAuthGroup) {
      // Usuário não autenticado tentando acessar rotas protegidas
      // Redireciona para login
      router.replace('/(auth)/login');
    } else if (token && inAuthGroup) {
      // Usuário autenticado na tela de login/register
      // Redireciona para o app principal
      router.replace('/(tabs)');
    }
  }, [token, segments, isLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider config={config}>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
