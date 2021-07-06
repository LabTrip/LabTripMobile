import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import { createIconSetFromFontello, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetalhesAtividade({ route }) {
    const moment = require('moment');
    const [atividade, setAtividade] = useState(route.params.atividade);
    const [gostei, setGostei] = useState(parseInt(route.params.atividade.votoPositivo) || 0);
    const [naoGostei, setNaoGostei] = useState(parseInt(route.params.atividade.votoNegativo) || 0);
    const [gostou, setGostou] = useState(Boolean);
    const [showLoader, setShowLoader] = React.useState(false);
    let valorFormatado = route.params.atividade.custo.toFixed(2)
    const navigation = useNavigation();
    let token, userId;

    const retornaToken = async () => {
        let localToken = await AsyncStorage.getItem('AUTH');
        if (localToken != null) {
            localToken = JSON.parse(localToken)
        }
        return localToken;
    }

    const votaAtividade = async (gostou) => {
        let localToken = await retornaToken() || '';

        return await fetch('https://labtrip-backend.herokuapp.com/votacoes', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localToken
            },
            body: JSON.stringify({
                roteiroAtividadeId: route.params.atividade.id,
                usuarioId: userId,
                gostou: gostou
            })
        });
    }

    const atualizaAtividade = async (gostou) => {
        return await fetch('https://labtrip-backend.herokuapp.com/votacoes/' + route.params.atividade.id + '/' + userId, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({
                roteiroAtividadeId: route.params.atividade.id,
                usuarioId: userId,
                gostou: gostou
            })
        });
    }

    const votar = async (gostou) => {
        try {
            let value = await AsyncStorage.getItem('AUTH');
            let user = await AsyncStorage.getItem('USER_ID');
            if (value !== null && user !== null) {
                token = JSON.parse(value)
                userId = JSON.parse(user)
                const response = await votaAtividade(gostou);
                if (response.status == 201) {
                    if (gostou == true) {
                        setGostei(gostei + 1);
                    }
                    else {
                        setNaoGostei(naoGostei + 1);
                    }
                } else if (response.status == 204) {
                    if (gostou == true) {
                        setGostei(gostei - 1);
                    }
                    else {
                        setNaoGostei(naoGostei - 1);
                    }
                }
                else {
                    const json = await response.json()
                    alert(json.mensagem)
                }
            }
            else {
                alert('Erro ao ao capturar informações no dispositivo, feche o app e tente novamente.')
            }
        } catch (e) {
            alert(e)
        }
    }

    const excluiAtividade = async () => {
        try{
            setShowLoader(true);
            let localToken = await retornaToken() || '';
            const response = await fetch('https://labtrip-backend.herokuapp.com/roteiroAtividades/' + atividade.id, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': localToken
                }
            });

            const json = await response.json();
            if (response.status == 200) {
                alert('Sucesso ao excluir atividade do roteiro.');
                navigation.goBack()
            }
            else{
                alert('Erro ao excluir atividade do roteiro.');
            }
        }
        catch(e){
            console.log(e)
            alert('Erro ao excluir atividade do roteiro.');
        }
        finally{
            setShowLoader(false);
        }
    }

    const confirmaExcluir = async () => {
        try{
            Alert.alert(
                'Excluir atividade',
                'Deseja mesmo excluir a atividade?',
                [
                    {
                        text: 'sim',
                        onPress: async () => {
                            excluiAtividade();
                        }
                    },
                    {
                        text: 'não',
                        onPress: () => {

                        }
                    }
                ]
            )
        }
        catch(e){
            alert('Erro ao excluir atividade.')
        }
    }

    return (
        <View style={styles.container}>
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
            <View style={styles.containerDetalhes}>
                <Text style={styles.tituloDetalhes}>{route.params.atividade.local}</Text>
                <View style={styles.containerDataStatus}>
                    <Text style={styles.textoDetalhes}>{moment(route.params.atividade.dataInicio).format('DD/MM/yyyy')}</Text>
                    <Text style={styles.textoStatus}>Agendada</Text>
                </View>
                <Text style={styles.textoDetalhes}>{moment(route.params.atividade.dataInicio).format('HH:mm')}</Text>
                <Text style={styles.textoDetalhes}>{route.params.atividade.endereco}</Text>
                <Text style={styles.textoDetalhes}>Ensolarado, 25°</Text>
            </View>
            <View style={styles.containerBotoes}>
                <TouchableOpacity style={styles.botaoEditar} onPress={() => {
                    navigation.navigate('EditarAtividadeRoteiro', {atividade: atividade});
                }}>
                    <Text style={styles.botaoTexto}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoExcluir} onPress={async () => {
                    confirmaExcluir();
                }} >
                    <Text style={styles.botaoTexto}>Excluir</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.tituloDetalhes}>Custo: R$ {valorFormatado}</Text>
            {route.params.planejamento != true ?
                (<View style={[styles.containerDetalhes, { height: '40%', flexDirection: 'row', justifyContent: 'space-between', padding: '3%' }]}>
                    <Text style={styles.tituloDetalhes}>
                        Midias
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('AdicionarMidias')}>
                        <MaterialCommunityIcons name="pencil" color={'black'} size={31} />
                    </TouchableOpacity>
                </View>) :
                (<View style={styles.containerVotos}>
                    <TouchableOpacity style={styles.botaoVoto} onPress={() => {
                        setGostou(true)
                        votar(true);
                    }}>
                        <MaterialCommunityIcons name="heart" color={'#FF2424'} size={31} />
                        <Text>{gostei}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botaoVoto} onPress={() => {
                        setGostou(false)
                        votar(false);
                    }}>
                        <MaterialCommunityIcons name="close-thick" color={'#000000'} size={31} />
                        <Text>{naoGostei}</Text>
                    </TouchableOpacity>
                </View>)}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    containerDetalhes: {
        marginTop: '3%',
        marginBottom: '3%',
        backgroundColor: '#F2F2F2',
        width: '96%',
        borderRadius: 7,
    },
    containerDataStatus: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerVotos: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '96%',
        marginBottom: '3%'
    },
    textoStatus: {
        color: '#0FD06F',
        marginRight: '5%',
        fontSize: 15,
    },
    textoDetalhes: {
        marginLeft: '5%',
        color: '#999999',
        marginBottom: '3%',
        fontSize: 15,
        maxWidth: '90%',
        flexWrap: 'wrap'
    },
    tituloDetalhes: {
        textAlign: 'center',
        color: '#999999',
        fontSize: 24,
    },
    botaoVoto: {
        flexDirection: 'row',
    },
    containerBotoes: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    botaoEditar: {
        backgroundColor: '#3385FF',
        width: '35%',
        padding: 10,
        borderRadius: 40,
        marginTop: '5%',
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: '5%'
    },
    botaoExcluir: {
        backgroundColor: '#FF3333',
        width: '35%',
        padding: 10,
        borderRadius: 40,
        marginTop: '5%',
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: '5%'
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center'
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