import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, RefreshControl, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CardAtividadeAgencia from '../../components/cardAtividadeAgencia';
import normalize from '../../components/fontSizeResponsive'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import BotaoMais from '../../components/botaoMais'
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

export default function ListaAtividadesDoRoteiro({ route }) {
    const moment = require('moment');
    const navigation = useNavigation();
    const roteiro = route.params.roteiro;
    const [atividades, setAtividades] = useState<Atividade[]>([]);
    //variavel auxiliar de atividades
    const [atividadesAux, setAtividadesAux] = useState<Atividade[]>([])
    const [refreshing, setRefreshing] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [idPermissao, setIdPermissao] = useState(4);

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

        const response = await fetch('https://labtrip-backend.herokuapp.com/roteiroAtividades/' + roteiro.id + '/' + roteiro.versao, {
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
    atividadesAux.forEach((a) => datas.push(moment(a.dataInicio).local().format('DD/MM/yyyy')));
    //removendo valores de datas repetidas da lista
    filtroDatas = datas.filter((v, i, a) => a.indexOf(v) === i);

    //se o array conter a data do dia atual, deixa ela como primeiro elemento
    mudarPosicao(filtroDatas);

    useEffect(() => {
        request();
        getIdPermissao()
        if (filtroDatas.filter((data) => data == moment().format('DD/MM/yyyy')).length > 0) {
            setSelectedValue(filtroDatas.filter((data) => data == moment().format('DD/MM/yyyy'))[0])
        }
        else {
            setSelectedValue(filtroDatas[0]);
        }

        //mostrando apenas as atividades que tem a mesma data que a data do primeiro item do picker
        //setAtividades(atividadesAux.filter(a => moment(a.dataInicio).local().format('DD/MM/yyyy') == filtroDatas[0]));
        setAtividades(atividadesAux.filter(a => moment(a.dataInicio).local().format('DD/MM/yyyy') == selectedValue));


    }, [refreshing]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false)
        }, 0);
    }, [refreshing]);

    const getUsuario = async (idUsuario, token) => {
        return await fetch('https://labtrip-backend.herokuapp.com/usuarios/' + idUsuario, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        });
    }

    const getIdPermissao = async () => {
        const token = await AsyncStorage.getItem('AUTH') || "";
        const idUsuario = await AsyncStorage.getItem('USER_ID') || "";
        const response = await getUsuario(JSON.parse(idUsuario), JSON.parse(token));
        const json = await response.json();
        setIdPermissao(json.perfilId);
    }

    return (
        <View style={styles.conteudo}>
            <View style={styles.containerTop}>
                {idPermissao != 4 ?
                    <BotaoMais onPress={() => navigation.navigate('AdicionarAtividadeRoteiro', { roteiro: route.params.roteiro, callback: setRefreshing, moeda: route.params.viagem.descricaoMoeda })}></BotaoMais>
                    : null}

                <Picker style={styles.pickerComponente}
                    prompt="Tipo de usuário"
                    mode="dropdown"
                    selectedValue={selectedValue}
                    onValueChange={(itemValue, value) => {
                        setSelectedValue(itemValue);
                        setAtividades(atividadesAux.filter(a => moment(a.dataInicio).local().format('DD/MM/yyyy') == itemValue));
                    }}>
                    {
                        filtroDatas?.map((a) => {
                            return <Picker.Item key={a} label={i18n.locale == 'pt-BR'? a : moment(a, 'DD/MM/yyyy').format('MM/DD/yyyy')} value={a} />
                        })
                    }
                </Picker>
            </View>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>
                {
                    atividades?.map((a) => {
                        return <CardAtividadeAgencia key={a.id} atividade={a} moeda={route.params.viagem.descricaoMoeda} />
                    })
                }
            </ScrollView>
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
        width: '100%',
        borderRadius: 7,

    },
    tituloTop: {
        fontSize: normalize(18)
    },
    pickerComponente: {
        marginTop: '3%',
        width: '96%',
        fontSize: 16,
        borderRadius: 10000,
        color: '#333333',
    },
})