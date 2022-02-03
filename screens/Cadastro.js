import { StyleSheet, Text, View, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import { auth } from '../firebase';

const Cadastro = () => {

    const navigation = useNavigation();

    const [nome, setNome] = useState('')
    const [email, SetEmail] = useState('')
    const [password, SetPassword] = useState('')
    const [loading, setLoading] = useState(false);

    const verifica = () => {
        if ((nome, email, password) !== '') {
            handleSingUp()
        } else {
            Toast.show('Por favor, verifique se todos os campos foram preenchidos.');
        }
    }

    const handleSingUp = () => {
        setLoading(true)
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                user.updateProfile({
                    displayName: nome //photoURL: imageURL? : "https://cdn.dribbble.com/users/225451/screenshots/3841820/media/5e2f1fcec4a8f13aa47f828b4cf81234.png?compress=1&resize=800x600&vertical=top"
                }).then(() => {
                    Toast.show('Cadastro realizado com sucesso!');
                    console.log("Register.Screen | Cadastro-success, navigating to Initial Screen");
                    auth.signOut()
                    navigation.replace('Login');
                    // Profile updated!
                }).catch((error) => {
                    // An error occurred
                    // ...
                });

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setLoading(false)
                Alert.alert(
                    "Algo deu errado",
                    errorMessage,
                )
            });
    }


    return (

        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <Text style={styles.headerText}>Preencha os campos abaixo para realizar o Cadastro.</Text>
                    </View>

                    <View>

                        <TextInput
                            placeholder="Nome"
                            selectionColor={'grey'}
                            style={styles.input}
                            value={nome}
                            onChangeText={text => setNome(text)}>
                        </TextInput>

                        <TextInput
                            placeholder="Email"
                            selectionColor={"grey"}
                            style={styles.input}
                            value={email}
                            onChangeText={text => SetEmail(text)}>
                        </TextInput>

                        <TextInput
                            placeholder="Senha"
                            selectionColor={"grey"}
                            style={styles.input}
                            value={password}
                            onChangeText={text => SetPassword(text)}
                            secureTextEntry>
                        </TextInput>

                        <TouchableOpacity style={styles.button} onPress={verifica}>
                            <Text style={styles.buttonText}>Cadastrar</Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Cadastro;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        color: '#f5f5f5',
        paddingVertical: '10%',
        paddingHorizontal: '5%'
    },
    header: {
        marginBottom: '20%'
    },
    headerText: {
        fontSize: 25,
        paddingTop: 7,
        color: '#F2F8EE',
        fontFamily: 'Poppins_500Medium',
    },
    input: {
        height: 70,
        padding: 10,
        fontSize: 18,
        borderRadius: 10,
        marginTop: '5%',
        backgroundColor: '#F2F8EE',
        color: '#000'
    },
    button: {
        height: 60,
        width: '100%',
        marginTop: '15%',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#009688',
        borderRadius: 9
    },
    buttonText: {
        fontSize: 20,
        paddingTop: 7,
        color: '#F2F8EE',
        textAlign: 'center',
        fontFamily: 'Poppins_500Medium',
    },
});
