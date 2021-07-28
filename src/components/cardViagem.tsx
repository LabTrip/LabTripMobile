import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Modal, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../translate/i18n'

let corDoCard, corBordaDoCard, status, corDoStatus;
let token

interface Viagem {
    id: string,
    descricao: string,
    dataInicio: Date,
    dataFim: Date,
    statusId: number,
    dono: string,
    usuarioDonoId: number,
}

export default function CardViagem(props) {

    const [showLoader, setShowLoader] = useState(false);
    const navigation = useNavigation();

    //busca informações da viagem.
    const getViagem = async () => {
        return await fetch('https://labtrip-backend.herokuapp.com/viagens/' + props.viagem.id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        });
    }

    //lista roteiros da viagem.
    const getRoteiros = async () => {
        return await fetch('https://labtrip-backend.herokuapp.com/roteiros/' + props.viagem.id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        });
    }


    useEffect(() => {
        const request = async () => {
            setShowLoader(true);
            const value = await AsyncStorage.getItem('AUTH')

            if (value != null) {
                token = JSON.parse(value)
                const response = await getViagem();
                const json = await response.json();
                const responseRoteiros = await getRoteiros();
                const jsonRoteiros = await responseRoteiros.json();
                if (response.status == 200 && responseRoteiros.status == 200) {
                    props.viagem.alterar = json.alterar;
                    props.viagem.roteiro = jsonRoteiros[0];
                } else {
                    alert(i18n.t('cardViagem.erro') + ": " + json.mensagem + "\n" + i18n.t('cardViagem.verifiqueConexao'));
                }
            }
            setShowLoader(false);
        }

        request();

    }, []);

    switch (props.status) {
        case 1:
            corDoCard = '#FFFDD1';
            corBordaDoCard = '#F8EC12';
            status = i18n.t('status.planejamento');
            corDoStatus = '#B7AF0B'
            break;
        case 2:
            corDoCard = '#FFFDD1';
            corBordaDoCard = '#F8EC12';
            status = i18n.t('status.planejado');
            corDoStatus = '#B7AF0B'
            break;
        case 3:
            corDoCard = '#CCEEFF';
            corBordaDoCard = '#00AEFF';
            status = i18n.t('status.emAndamento');
            corDoStatus = '#00AEFF';
            break;
        case 5:
            corDoCard = '#CEF7E3';
            corBordaDoCard = '#0FD06F';
            status = i18n.t('status.concluido');
            corDoStatus = '#0FD06F';
            break;
        default:
            corDoCard = '#F0F0F0';
            corBordaDoCard = '#787878';
            status = i18n.t('status.cancelado')
            corDoStatus = '#333333';
            break;
    }

    return (
        <TouchableOpacity style={[styles.cardViagens,
        { backgroundColor: corDoCard, borderLeftColor: corBordaDoCard }]}
            onPress={() => navigation.navigate(props.navigate, { viagem: props.viagem })}>
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
                            {i18n.t('modais.aguarde')}
                        </Text>
                    </View>
                </View>

            </Modal>
            <Text style={styles.nome}>{props.nome}</Text>
            <Text>
                <Text style={styles.label}>{i18n.t('cardViagem.inicio')}:</Text> {props.dataInicio}
                <Text style={styles.label}> {i18n.t('cardViagem.fim')}:</Text> {props.dataFim}
            </Text>
            <Text>
                <Text style={styles.label}>Status: </Text>
                <Text style={{ color: corDoStatus }}>{status}</Text>
            </Text>
            <Text>
                <Text style={styles.label}>{i18n.t('cardViagem.dono')}: </Text> {props.dono}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardViagens: {
        marginTop: 25,
        padding: 10,
        borderRadius: 13,
        borderLeftWidth: 6,
        width: '80%',
        minWidth: '80%',
        maxWidth: '80%',
        minHeight: 143,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    label: {
        fontWeight: 'bold'
    },
    nome: {
        textAlign: 'center',
        flexWrap: 'wrap'
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
    },
});

