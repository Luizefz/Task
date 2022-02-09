import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, ActivityIndicator, FlatList, Dimensions, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useLayoutEffect, useEffect, cleanup } from 'react';
import Toast from 'react-native-simple-toast';
import { auth, db } from '../firebase';
import * as firebase from 'firebase'
import * as Animatable from 'react-native-animatable';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import uuid from 'react-native-uuid';


const Home = () => {

    const user = firebase.auth().currentUser;
    const navigation = useNavigation();
    const [nome, setNome] = useState();
    const [tasks, setTasks] = useState();
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);

    const SingOut = () => {
        auth.signOut()
            .then(() => {
                console.log("Home.Screen | btn-logOut, logged out and navigating to Initial Screen");
                navigation.replace("Initial");

            })
    }

    const getTasks = async () => {
        const snapshot = await
            db.collection(`${user.uid}`)
                .get()
                .then(querySnapshot => {
                    console.log('Total tasks: ', querySnapshot.size);

                    const docList = []

                    if (querySnapshot.size == 0) {
                        setLoading(false)
                        setTasks([])
                        Toast.show('Nenhuma task adicionada.', Toast.LONG);

                    }

                    querySnapshot.forEach(documentSnapshot => {
                        docList.push(documentSnapshot.data())

                        setTasks(docList)
                        setLoading(false)
                    });
                });
    }

    const saveTask = () => {
        db.collection(`${user.uid}`).add({
        })
            .then((docRef) => {
                db.collection(`${user.uid}`).doc(docRef.id).set({
                    id: docRef.id,
                    nome: 'Jantar o Macarrão',
                    criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
                })
                getTasks()
            })
            .catch((error) => {
                Toast.show('Algo deu errado. ', error);
                console.error("Error adding document: ", error);
            });
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
            id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
            nome: "A - Z",
        },
        {
            id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
            nome: "Z - A",
        },
        {
            id: "58694a0f-3da1-471f-bd96-145571e29d72",
            nome: "Mais Antigos",
        },
        {
            id: "bd7acbea-c1b1-46c2-aed5-3ad53cbb28ba",
            nome: "Mais Recente",
        },
    ]

    const _renderFilterItem = ({ item }) => {
        return (
            <Animatable.View animation="fadeIn" direction="alternate" style={{ paddingRight: 8 }}>
                <TouchableOpacity style={styles.filtros}>
                    <Text style={styles.textFiltros}>{item.nome}</Text>
                </TouchableOpacity>
            </Animatable.View>
        )
    };

    const _renderTaskItem = ({ item }) => {
        return (
            <Animatable.View animation="fadeIn" >
                <View style={styles.tasks}>
                    <BouncyCheckbox
                        size={25}
                        fillColor="#009688"
                        //unfillColor="#FFFFFF"
                        text={item.nome}
                        iconStyle={{ borderColor: "#009688" }}
                        textStyle={styles.textFiltros}
                    //onPress={(isChecked: boolean) => { }}
                    />
                    <Text style={[styles.textFiltros, { fontWeight: 'bold' }]} onPress={() => deleteTask(item)}>@</Text>
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

            <TouchableOpacity style={styles.plusButton} onPress={() => saveTask()}>
                <Image source={require('../assets/plusIcon.png')} style={styles.plusIcon} />
            </TouchableOpacity>

            <FlatList
                style={styles.taskFilter}
                data={filters}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={_renderFilterItem}
            />
            
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
        backgroundColor: '#000',
        marginVertical: 20,
        paddingLeft: 10,
        height: 65,
        elevation: 4
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
    tasks: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});
