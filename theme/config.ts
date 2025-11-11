import { createConfig } from '@gluestack-ui/themed';
import { config as defaultConfig } from '@gluestack-ui/config';

const peacockPalette = {
  primary50: '#EAF6F9',
  primary100: '#D5EDF3',
  primary200: '#ADDDEB',
  primary300: '#88C0D0', // Verde-oliva Pastel (Seu Accent)
  primary400: '#64A4B6',
  primary500: '#5A9EAD', // Azul-petróleo Pastel (Sua Primary)
  primary600: '#4B8897',
  primary700: '#3C7181',
  primary800: '#2D5B6A',
  primary900: '#1E4454',
  primary950: '#142D38',

  secondary50: '#EBF3E8',
  secondary100: '#D7E7D1',
  secondary200: '#B0D0A4',
  secondary300: '#A3BE8C', // Azul-céu Pastel (Sua Secondary)
  secondary400: '#7FA26B',
  secondary500: '#6B8F5A',
  secondary600: '#577B4A',
  secondary700: '#43683A',
  secondary800: '#30542A',
  secondary900: '#1D411A',
  secondary950: '##132D11',

  // Cores de fundo e texto
  backgroundLight: '#ECEFF4', // Branco-neve
  textLight: '#2E3440',      // Cinza-escuro
};

export const config = createConfig({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    colors: {
      ...defaultConfig.tokens.colors,
      
      // Mapeando sua paleta
      primaryLight50: peacockPalette.primary50,
      primaryLight100: peacockPalette.primary100,
      primaryLight200: peacockPalette.primary200,
      primaryLight300: peacockPalette.primary300,
      primaryLight400: peacockPalette.primary400,
      primaryLight500: peacockPalette.primary500,
      primaryLight600: peacockPalette.primary600,
      primaryLight700: peacockPalette.primary700,
      primaryLight800: peacockPalette.primary800,
      primaryLight900: peacockPalette.primary900,
      primaryLight950: peacockPalette.primary950,

      secondaryLight50: peacockPalette.secondary50,
      secondaryLight100: peacockPalette.secondary100,
      secondaryLight200: peacockPalette.secondary200,
      secondaryLight300: peacockPalette.secondary300,
      secondaryLight400: peacockPalette.secondary400,
      secondaryLight500: peacockPalette.secondary500,
      secondaryLight600: peacockPalette.secondary600,
      secondaryLight700: peacockPalette.secondary700,
      secondaryLight800: peacockPalette.secondary800,
      secondaryLight900: peacockPalette.secondary900,
      secondaryLight950: peacockPalette.secondary950,

      // Mapeando cores globais
      background: peacockPalette.backgroundLight,
      text: peacockPalette.textLight,
      
      // Mapeando cores semânticas
      primary: peacockPalette.primary500,
      secondary: peacockPalette.secondary500,
      accent: peacockPalette.primary300,
    },
  },
});