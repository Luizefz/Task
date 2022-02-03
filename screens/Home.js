import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { auth, db } from '../firebase';

const Home = () => {

    const navigation = useNavigation();
    navigation.canGoBack();

    const SingOut = () => {
        auth.signOut()
            .then(() => {
                console.log("Home.Screen | btn-logOut, logged out and navigating to Initial Screen");
                navigation.replace("Initial");

            })
    }

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={SingOut}>
                <Text style={styles.buttonText}>LogOut</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    button: {
        height: 60,
        width: '100%',
        marginTop: '10%',
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
