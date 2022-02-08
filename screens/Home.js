import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, cleanup, useState, useLayoutEffect } from 'react';
import Toast from 'react-native-simple-toast';
import { auth, db } from '../firebase';
import * as firebase from 'firebase'

const Home = () => {

    const user = firebase.auth().currentUser;
    const navigation = useNavigation();
    const [tasks, setTasks] = useState();
    const [loading, setLoading] = useState(true)

    const SingOut = () => {
        auth.signOut()
            .then(() => {
                console.log("Home.Screen | btn-logOut, logged out and navigating to Initial Screen");
                navigation.replace("Initial");

            })
    }

    const getTasks = async () => {
        const snapshot = await
            db.collection(/*`${user.uid}`*/'filtros')
                .get()
                .then(querySnapshot => {
                    console.log('Total tasks: ', querySnapshot.size);

                    const docList = []

                    if (querySnapshot.size == 0) {
                        setLoading(false)
                        Toast.show('Nenhum task adicionada.', Toast.LONG);

                    }

                    querySnapshot.forEach(documentSnapshot => {
                        docList.push(documentSnapshot.data())

                        setTasks(docList)
                        setLoading(false)
                    });
                });
    }

    const _renderItem = ({ item, index }) => {
        return (
            <View style={{flexDirection: 'row', paddingRight: 8}}>
                <TouchableOpacity style={styles.filtros}>
                    <Text style={styles.textFiltros}>{item.nome}</Text>
                </TouchableOpacity>
            </View>
        )
    };

    useEffect(() => {
        const refresh = navigation.addListener('focus', () => {
            getTasks();
        });
        return refresh;
    }, [cleanup]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: `Olá, ${user.displayName}!`,
            headerRight: () => (
                <View>
                    <TouchableOpacity style={styles.logOutButton} onPress={() => SingOut()}>
                        <Image style={styles.logOutIcon} source={require('../assets/logout.png')} />
                    </TouchableOpacity>

                </View>
            )
        });
    }, []);

    return (
        <View style={ styles.container }>
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

            <FlatList
            style={styles.taskFilter}
            data={tasks}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={_renderItem}
            />

            <FlatList
            style={ styles.taskList }

            />
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        color: '#f5f5f5',
    },
    logOutButton: {
        width: 35,
        height: 35,
        top: -3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        backgroundColor: '#009688'
    },
    logOutIcon: {
        width: 25,
        height: 25,
        right: -1.5,
        resizeMode: 'cover',
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
    taskFilter: {
        marginVertical: 20,
        paddingLeft: 10,
        height: 65
    },
    textFiltros: {
        color: '#F2F8EE',
        paddingHorizontal: 10,
    },
    filtros: {
        backgroundColor: '#252525',
        borderRadius: 20,
        height: '100%',
        justifyContent: 'center'
        
    },  
    taskList: {
        backgroundColor: '#252525',
        borderRadius: 30,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        height: Dimensions.get('window').height
    },
});
