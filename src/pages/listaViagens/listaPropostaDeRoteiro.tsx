import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, RefreshControl, ScrollView, Modal, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BotaoMais from '../../components/botaoMais';
import CardRoteiro from '../../components/cardRoteiro';
import normalize from '../../components/fontSizeResponsive'
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Viagem {
    id: string,
    descricao: string,
    dataInicio: Date,
    dataFim: Date,
    statusId: number,
    alterar: Boolean,
    participantes : [
        usuarioId: string,
        permissaoViagemId: string
    ]
  }

interface Roteiro {
    id: string,
    versao: number,
    descricaoRoteiro: string,
    statusId: number,
    status: string,
}

export default function ListaPropostaDeRoteiro({ route }) {
    const moment = require('moment');
    const navigation = useNavigation();
    const [roteiros, setRoteiros] = useState<Roteiro[]>([])
    const [refreshing, setRefreshing] = React.useState(false);
    const [viagem, setViagem] = useState(route.params.viagem);
    const [showLoader, setShowLoader] = React.useState(false);


    useEffect(() => {
        const request = async () => {
            try {
              const response = await buscaRoteiros();
            }
            catch (e) {
              console.log(e)
            }
          }
          request()
    }, []);

    const retornaToken = async () => {
        let localToken = await AsyncStorage.getItem('AUTH');
        if (localToken != null) {
          localToken = JSON.parse(localToken)
        }
  
        return localToken;
    }

    const buscaRoteiros = async () => {
        let localToken = await retornaToken() || '';
      
      const response = await fetch('https://labtrip-backend.herokuapp.com/viagens/roteiros/' + viagem.id, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': localToken
        }
      });

      const json = await response.json();
      if (response.status == 200) {
        setRoteiros([]);
        setRoteiros(json.participantes);
      }
    }

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        const response = await buscaRoteiros();
        console.log('refresh')
        setTimeout(() => {
            setRefreshing(false)
        }, 2000);
    }, [refreshing]);

    return (
        <View style={styles.conteudo}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={showLoader}
                onRequestClose={() => {
                    setShowLoader(!showLoader)
                }}
            >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <ActivityIndicator style={styles.loader} animating={showLoader} size="large" color="#0FD06F" />
                    <Text style={styles.textStyle}>
                        Aguarde...
                </Text>
                </View>
            </View>
            </Modal>
            <BotaoMais onPress={() => navigation.navigate('CriarRoteiro')} />
            <View style={styles.containerTop}>
                <Text style={styles.tituloTop}>Propostas de roteiro</Text>
            </View>
            <FlatList
                contentContainerStyle={{flexGrow: 1}}
                data={roteiros}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                keyExtractor={(item) => (item.id + '-' + item.versao)}
                renderItem={({ item, index }) => {
                    return (
                        <CardRoteiro key={item.id} nome={item.descricaoRoteiro} 
                        status={item.statusId} item={item} statusDesc={item.status} navigate={'EditarRoteiro'} />
                    )
                }
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    conteudo: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'

    },
    containerTop: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '92%',
        backgroundColor: '#F2F2F2',
        borderRadius: 7,
        height: '10%'
    },
    tituloTop: {
        fontSize: normalize(18)
    },
    loader: {
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        opacity: 0.9,
        borderRadius: 20,
        padding: '20%',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textStyle: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center"
    }
})