import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';


const Initial = () => {

  const navigation = useNavigation();

  const gologin = () => {
    console.log("Initial.Screen | navigating to Login Screen");
    navigation.navigate("Login");
}

  return (

    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>

          <View style={styles.header}>
            <Image source={require('../assets/icon-black.png')} style={styles.headerLogo} />
          </View>

          <View style={styles.body}>
            <Image source={require('../assets/To-do-list.png')} style={styles.centerImage} />
          </View>

          <View>
            <TouchableOpacity style={styles.button} onPress={gologin}>
              <Text style={styles.buttonText}>Vamos lá!</Text>
            </TouchableOpacity>

          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Initial;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: '20%',
    paddingHorizontal: '5%'
  },
  headerLogo: {
    width: 70,
    height: 70
  },
  headerLogin: {
    color: '#f5f5f5',
    fontSize: 25,
    textAlignVertical: 'center'
  },
  body: {
    height: 400
  },
  centerImage: {
    width: '100%',
    height: '100%',
  },
  button: {
    height: 60,
    width: '90%',
    marginTop: '15%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#009688',
    borderRadius: 9
  },
  buttonText: {
    fontSize: 25,
    paddingTop: 7,
    color: '#F2F8EE',
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium',
  },
});
