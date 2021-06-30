import React from 'react';
import { ThemeProvider } from 'styled-components'
import AppLoading from 'expo-app-loading';

import { Register } from './src/screens/Register';
import Theme from './src/global/styles/theme';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={Theme}>
      <Register />
    </ThemeProvider>
  );
}
