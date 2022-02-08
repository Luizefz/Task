import { StyleSheet, Text, View, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Modal, ActivityIndicator} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import React, { useState } from 'react';
import { auth } from '../firebase';

const Login = () => {

    const navigation = useNavigation();

    const [email, SetEmail] = useState('')
    const [password, SetPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const goCadastro = () => {
        console.log("Login.Screen | btn-cadastrar, navigating to Register Screen");
        navigation.navigate("Cadastro");
    }

    const verifica = () => {
        if ((email, password) !== '') {
            setLoading(true)
            SingIn()
        } else {
            setLoading(false)
            Toast.show('Por favor, verifique se todos os campos foram preenchidos.');
        }
    }

    const SingIn = () => {
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log("Login.Screen | Login-success, navigating to Home Screen");
                console.log("Login.Screen | ", user.displayName);
                navigation.replace('Home');
                setLoading(false)
            })
            .catch((error) => {
                const errorMessage = error.message;
                setLoading(false)
                Toast.show('Email/Senha incorretos. Verifique os campos preenchidos.', Toast.LONG);
                //"Por favor, verifique as informações digitadas.",
            });
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={loading}
                        onRequestClose={() => {
                            console.log("Modal has been closed.");
                            setLoading(false);
                        }}
                    >
                        <View style={styles.modalView}>
                            <ActivityIndicator color={'#F2F8EE'} size={'large'} />
                        </View>

                    </Modal>

                    <View style={styles.header}>
                        <Text style={styles.headerText}>Preencha os campos abaixo para realizar o Login.</Text>
                    </View>

                    <View>
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

                        <View style={{ flexDirection: 'row', marginTop: 8 }}>
                            <Text style={styles.cadastroText}>Ainda não possue login?</Text>

                            <TouchableOpacity onPress={goCadastro}>
                                <Text style={[styles.cadastroText, { paddingLeft: 5, color: '#009688' }]}>Cadastre-se!</Text>
                            </TouchableOpacity>

                        </View>

                        <TouchableOpacity style={styles.button} onPress={verifica}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        color: '#f5f5f5',
        paddingVertical: '10%',
        paddingHorizontal: '5%'
    },
    modalView: {
        top: '40%',
        padding: 30,
        alignSelf: 'center',
        alignItems: "center",
        backgroundColor: "#000",
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5
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
    cadastroText: {
        fontSize: 15,
        paddingTop: 7,
        color: '#F2F8EE',
        fontFamily: 'Poppins_500Medium',
    },
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
        fontSize: 20,
        paddingTop: 7,
        color: '#F2F8EE',
        textAlign: 'center',
        fontFamily: 'Poppins_500Medium',
    },
});
