import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

/**
 * Componente helper para ícones das tabs
 * Vamos usar os ícones do FontAwesome que já vem com o Expo
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // Cores personalizadas da paleta Pavão
        tabBarActiveTintColor: '#5A9EAD', // primary500
        tabBarInactiveTintColor: '#88C0D0', // primary300
        tabBarStyle: {
          backgroundColor: '#ECEFF4', // backgroundLight
          borderTopColor: '#D5EDF3', // primary100
        },
        headerStyle: {
          backgroundColor: '#5A9EAD', // primary500
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="sobre"
        options={{
          title: 'Sobre',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="academico"
        options={{
          title: 'Acadêmico',
          tabBarIcon: ({ color }) => <TabBarIcon name="graduation-cap" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profissional"
        options={{
          title: 'Profissional',
          tabBarIcon: ({ color }) => <TabBarIcon name="briefcase" color={color} />,
        }}
      />
      <Tabs.Screen
        name="projetos"
        options={{
          title: 'Projetos',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}
