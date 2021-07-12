import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, View, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CardAtividade from '../../components/cardAtividade';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../translate/i18n';

interface Atividade {
    id: number,
    atividadeId: string,
    local: string,
    endereco: string,
    cidade: string,
    pais: string,
    latitude: string,
    longitude: string,
    roteiroId: number,
    versaoRoteiro: number,
    dataInicio: Date,
    dataFim: Date,
    custo: number,
    statusId: number,
    votoPositivo: string,
    votoNegativo: string,
    observacaoCliente: string,
    observacaoAgente: string
}

export default function DetalhesRoteiro({ route }) {
    const moment = require('moment');
    const navigation = useNavigation();
    const [selectedValue, setSelectedValue] = useState(moment().format('DD/MM/yyyy'));
    const viagem = route.params.viagem;
    const [atividades, setAtividades] = useState<Atividade[]>([]);
    //variavel auxiliar de atividades
    const [atividadesAux, setAtividadesAux] = useState<Atividade[]>([]);
    //variavel do refresh
    const [refreshing, setRefreshing] = React.useState(false);
    const abortController = new AbortController();

    //captura o token local do usuário.
    const retornaToken = async () => {
        let localToken = await AsyncStorage.getItem('AUTH');
        if (localToken != null) {
            localToken = JSON.parse(localToken)
        }
        return localToken;
    }

    //faz a request para listar as atividade do roteiro
    const buscaAtividades = async () => {
        let localToken = await retornaToken() || '';

        const response = await fetch('https://labtrip-backend.herokuapp.com/roteiroAtividades/' + viagem.roteiro.id + '/' + viagem.roteiro.versao, {
            signal: abortController.signal,
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localToken
            }
        });
        const json = await response.json();
        //seta lista de atividades se o status da resposta for 200
        if (response.status == 200) {
            console.log(viagem.roteiro.id);
            console.log(viagem.roteiro.versao)

            console.log(json)
            setAtividadesAux(json);
            //setAtividades(json);
        }
    }

    const request = async () => {
        try {
            await buscaAtividades();

        }
        catch (e) {
            console.log(e)
        }

        /*return () => {
            abortController.abort();
        }*/
    }

    function mudarPosicao(array) {
        let valorAux;
        if (array != null && array.length > 0) {
            
            array.map(
                (valor, index) => {
                     valor == moment().format('DD/MM/yyyy')
                        ? (valorAux = array[0], array[0] = valor, array[index] = valorAux)
                        : null
                }
            )
        }
    }

    let datas = new Array();
    let filtroDatas = new Array();
    //criando lista com as datas de todas atividades
    atividadesAux.forEach((a) => datas.push(moment(a.dataInicio).format('DD/MM/yyyy')));
    datas.sort();
    //removendo valores de datas repetidas da lista
    filtroDatas = datas.filter((v, i, a) => a.indexOf(v) === i);

    //se o array conter a data do dia atual, deixa ela como primeiro elemento
    mudarPosicao(filtroDatas)



    useEffect(() => {
        request();
        if (filtroDatas.filter((data) => data == moment().format('DD/MM/yyyy')).length > 0) {
            setSelectedValue(filtroDatas.filter((data) => data == moment().format('DD/MM/yyyy'))[0]);
        }
        else {
            setSelectedValue(filtroDatas[0]);
        }
        //mostrando apenas as atividades que tem a mesma data que a data do primeiro item do picker
        //setAtividades(atividadesAux.filter(a => moment(a.dataInicio).format('DD/MM/yyyy') == filtroDatas[0]));
        setAtividades(atividadesAux.filter(a => moment(a.dataInicio).format('DD/MM/yyyy') == selectedValue));
    }, [refreshing]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false)
        }, 0);
    }, [refreshing]);


    return (
        <View style={styles.conteudo}>
            <View style={styles.containerTop}>
                <Text style={styles.texto}>Data</Text>
                <Picker
                    prompt="Data"
                    selectedValue={selectedValue}
                    style={{ height: 48, width: 150 }}
                    onValueChange={(itemValue) => {
                        setSelectedValue(itemValue);
                        setAtividades(atividadesAux.filter(a => moment(a.dataInicio).local().format('DD/MM/yyyy') == itemValue));
                    }}
                >
                    {
                        filtroDatas?.map((a) => {
                            return <Picker.Item key={a} label={a} value={a} />
                        })
                    }
                </Picker>
                <TouchableOpacity style={styles.botaoIconeTop} onPress={() => navigation.navigate('Chat', { viagem: viagem, topico: { id: 0, descricao: 'Roteiro' } })}>
                    <MaterialCommunityIcons name={'chat-processing'} color={'#575757'} size={30} />
                </TouchableOpacity>
            </View>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {
                    atividades?.map((a) => {
                        return <CardAtividade callback={setRefreshing} key={a.id} nome={a.local} local={a.endereco} horario={'18h'} item={a} viagem={viagem} data={selectedValue} />
                    })
                }
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    conteudo: {
        flex: 1,
        backgroundColor: '#fff'
    },
    containerTop: {
        marginTop: '3%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    texto: {
        color: '#999999',
        fontSize: 18,
    },
    botaoIconeTop: {
        marginLeft: '5%'
    }
});
