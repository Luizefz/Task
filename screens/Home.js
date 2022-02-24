import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, ActivityIndicator, FlatList, Dimensions, RefreshControl, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useLayoutEffect, useEffect, cleanup } from 'react';
import Toast from 'react-native-simple-toast';
import { auth, db } from '../firebase';
import * as firebase from 'firebase'
import * as Animatable from 'react-native-animatable';
import BouncyCheckbox from "react-native-bouncy-checkbox";


const Home = () => {

    const user = firebase.auth().currentUser;
    const navigation = useNavigation();
    const [nome, setNome] = useState();
    const [tasks, setTasks] = useState();
    const [addTaskVisible, setAddTaskVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const SingOut = () => {
        auth.signOut()
            .then(() => {
                console.log("Home.Screen | btn-logOut, logged out and navigating to Initial Screen");
                navigation.replace("Initial");

            })
    }

    const getTasks = async () => {
        setLoading(false)
        setRefreshing(true)
        const snapshot = await
            db.collection(`${user.uid}`)
                .get()
                .then(querySnapshot => {
                    console.log('Total tasks: ', querySnapshot.size);

                    const docList = []

                    if (querySnapshot.size == 0) {
                        setLoading(false)
                        setRefreshing(false)
                        setTasks(null)
                        Toast.show('Nenhuma task adicionada.');

                    }

                    querySnapshot.forEach(documentSnapshot => {
                        docList.push(documentSnapshot.data())

                        setTasks(docList)
                        setLoading(false)
                        setRefreshing(false)
                    });
                });
    }

    const saveTask = () => {
        if (nome == null) {
            Toast.show('Por favor, preencha o campo abaixo');
        } else {
            setAddTaskVisible(false)
            db.collection(`${user.uid}`).add({
            })
                .then((docRef) => {
                    db.collection(`${user.uid}`).doc(docRef.id).set({
                        id: docRef.id,
                        nome: nome,
                        criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
                    })
                    setTimeout(getTasks, 500)
                    setNome()
                })
                .catch((error) => {
                    Toast.show('Algo deu errado. ', error);
                    console.error("Error adding document: ", error);
                });
        }
    }

    const deleteTask = (item) => {
        db.collection(`${user.uid}`).doc(item.id).delete()
            .then(() => {
                Toast.show('Task Removida!');
                console.log("Document successfully deleted!");
                getTasks();
            }).catch((error) => {
                Toast.show('Algo deu errado. ', error, Toast.LONG);
                console.error("Error removing document: ", error);
            });
    }

    const filters = [
        {
            id: "1",
            nome: "A - Z",
        },
        {
            id: "2",
            nome: "Z - A",
        },
        {
            id: "3",
            nome: "Mais Antigos",
        },
        {
            id: "4",
            nome: "Mais Recentes",
        },
        {
            id: "5",
            nome: "Concluídas"
        },
    ]

    const _renderFilterItem = ({ item }) => {
        return (
            <Animatable.View animation="fadeIn" style={{ paddingRight: 8 }}>
                <TouchableOpacity style={styles.filtros}>
                    <Text style={styles.textFiltros}>{item.nome}</Text>
                </TouchableOpacity>
            </Animatable.View>
        )
    };

    const _renderTaskItem = ({ item, index }) => {
        return (
            <Animatable.View animation="fadeIn" delay={index * 100}>
                <View style={styles.tasks}>
                    <BouncyCheckbox
                        size={25}
                        fillColor="#009688"
                        text={item.nome}
                        iconStyle={{ borderColor: "#009688" }}
                        textStyle={[styles.textFiltros, { width: Dimensions.get('window').width - 120, flex: 1 }]}
                    />
                    <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => deleteTask(item)}>
                        <Image style={styles.removeIcon} source={require('../assets/removeIcon.png')} />
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        )
    };

    const ItemSeparatorView = () => {
        return (
            // Flat List Item Separator
            <View
                style={{
                    height: 0.5,
                    width: '90%',
                    alignSelf: 'center',
                    backgroundColor: '#3a3a3a',
                }}
            />
        );
    };

    useEffect(() => {
        const refresh = navigation.addListener('focus', () => {
            getTasks();
        });
        return refresh;
    }, []);

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


            <Modal
                animationType='slide'
                transparent={true}
                visible={addTaskVisible}
                onRequestClose={() => {
                    setAddTaskVisible(false);
                }}
            >
                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(), setAddTaskVisible(false) }}>
                    <View style={styles.fullModal}>
                        <View style={styles.addTaskModal}>
                            <TextInput
                                selectionColor={"#F2F8EE"}
                                style={styles.input}
                                value={nome}
                                onChangeText={text => setNome(text)}
                                onSubmitEditing={() => saveTask()}

                                autoFocus
                            />

                            <TouchableOpacity style={styles.sendButton} onPress={() => saveTask()}>
                                <Image style={styles.sendIcon} source={require('../assets/sendIcon.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <KeyboardAvoidingView behaviour="padding" enabled={false}>

                <FlatList
                    style={styles.taskFilter}
                    data={filters}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={_renderFilterItem}
                />

            </KeyboardAvoidingView>

            <FlatList
                style={styles.taskList}
                data={tasks}
                renderItem={_renderTaskItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={getTasks} />
                }
                keyExtractor={item => item.id}
                extraData={tasks}
                ItemSeparatorComponent={ItemSeparatorView}
                contentContainerStyle={{
                    flexGrow: 1,
                }}
            />

            {!addTaskVisible && (
                <TouchableOpacity style={styles.plusButton} onPress={() => setAddTaskVisible(true)}>
                    <Image source={require('../assets/plusIcon.png')} style={styles.plusIcon} />
                </TouchableOpacity>
            )}
        </View >

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
    plusButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#009688',
        borderRadius: 18,
        zIndex: 3
    },
    plusIcon: {
        width: 40,
        height: 40,
    },
    removeIcon: {
        width: 25,
        height: 25,
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
    fullModal: {
        height: '100%'
    },
    addTaskModal: {
        paddingHorizontal: 10,
        marginTop: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 60,
        backgroundColor: '#000',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },
    input: {
        height: '70%',
        width: '78%',
        paddingHorizontal: 25,
        fontSize: 18,
        borderRadius: 30,
        backgroundColor: 'grey',
        color: '#F2F8EE'
    },
    sendIcon: {
        height: 30,
        width: 30,
    },
    sendButton: {
        height: '75%',
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#009688',
        borderRadius: 18,
    },
    taskFilter: {
        backgroundColor: '#000',
        paddingLeft: 10,
        height: 65,
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
        marginTop: 10,
        backgroundColor: '#252525',
        borderRadius: 30,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        height: Dimensions.get('window').height
    },
    tasks: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});
