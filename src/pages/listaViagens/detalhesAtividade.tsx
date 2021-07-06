import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createIconSetFromFontello, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetalhesAtividade({ route }) {
    const moment = require('moment');
    const [gostei, setGostei] = useState(parseInt(route.params.atividade.votoPositivo) || 0);
    const [naoGostei, setNaoGostei] = useState(parseInt(route.params.atividade.votoNegativo) || 0);
    const [gostou, setGostou] = useState(Boolean);
    let valorFormatado = route.params.atividade.custo.toFixed(2)
    const navigation = useNavigation();
    let token, userId;


    const votaAtividade = async (gostou) => {
        return await fetch('https://labtrip-backend.herokuapp.com/votacoes', {
            method: 'POST',
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

    return (
        <View style={styles.container}>
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
    }
})