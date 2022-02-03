import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppLoading from 'expo-app-loading';
import { useFonts, Poppins_700Bold, Poppins_600SemiBold, Poppins_500Medium, Poppins_500Medium_Italic, Poppins_300Light } from '@expo-google-fonts/poppins';
import Initial from './screens/Initial';
import Login from './screens/Login';
import Cadastro from './screens/Cadastro';
import Home from './screens/Home';


export default function App() {

  let [fontsLoaded] = useFonts({
    Poppins_700Bold, 
    Poppins_600SemiBold, 
    Poppins_500Medium, 
    Poppins_500Medium_Italic, 
    Poppins_300Light
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const Stack = createNativeStackNavigator();

  const Dark = {
    dark: false,
    colors: {
      primary: 'rgb(0, 0, 0)',
      background: 'rgb(0, 0, 0)',
      card: 'rgb(0, 0, 0)',
      text: 'rgb(242, 248, 238)',
      border: 'rgb(0, 0, 0)',
      notification: 'rgb(255, 69, 58)',
    },
  };

  return (

    <NavigationContainer theme={Dark}>

      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Initial" component={Initial} />
        <Stack.Screen options={{ headerBackVisible: true, headerTitle: ''}} name="Login" component={Login} />
        <Stack.Screen options={{ headerBackVisible: true, headerTitle: ''}} name="Cadastro" component={Cadastro} />
        <Stack.Screen options={{ headerBackVisible: false, }} name="Home" component={Home} />
      </Stack.Navigator>

      <StatusBar style="light" />
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
