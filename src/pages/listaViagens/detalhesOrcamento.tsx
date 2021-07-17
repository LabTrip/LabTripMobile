import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import BotaoMais from '../../components/botaoMais';
import CardOrcamento from '../../components/cardOrcamento';
import CardDespesasAdicionais from '../../components/cardDespesaAdicional';
import { useLinkProps, useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import i18n from '../../translate/i18n';

interface Orcamento {
    despesasExtras: [{
        id: string,
        orcamentoId: number,
        custo: number,
        descricao: string,
        usuarioId: string,
        data: string,
        nomeUsuario: string
    }],
    id: number,
    roteiroId: number,
    tipoOrcamentoId: number,
    valorConsumido: number,
    valorMinimo: number,
    valorTotal: number,
    versaoRoteiro: number,
}

export default function DetalhesOrcamento({ route }) {
    const moment = require('moment');
    const navigation = useNavigation();
    const [viagem, setViagem] = useState(route.params.viagem);
    //capturando roteiro da viagem pelas duas possiveis variaveis que podem chegar
    const [roteiro, setRoteiro] = useState(route.params.roteiro || route.params.viagem.roteiro);
    const [orcamento, setOrcamento] = useState<Orcamento>();
    const [orcamentoExiste, setOrcamentoExiste] = useState<Boolean>(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [showLoader, setShowLoader] = React.useState(false);

    const rota = route.name;
    let botaoChat;
    let alterar = true
    let tipoOrcamento = "Individual"
    //adicionando icone de chat quando usuario vier pelas rotas de orçamento geral.
    if (rota == 'Geral' || rota == 'Orçamento' || rota == 'General') {
        botaoChat = <TouchableOpacity style={{ marginTop: '2%' }} onPress={() => navigation.navigate('Chat', { viagem: viagem , topico: {id: 0, descricao: 'Orçamento'}})}>
                        <MaterialCommunityIcons name={'chat-processing'} color={'#575757'} size={42} />
                    </TouchableOpacity>;
        //mostrando botão de criar despesa adicional caso o usuário tenha permissão de membro na viagem
        alterar = route.params.viagem.alterar;
        tipoOrcamento = "Geral"
    }

    useEffect(() => {
        buscaOrcamento();
        buscaViagem();
    }, []);

    const retornaToken = async () => {
        let localToken = await AsyncStorage.getItem('AUTH');
        if (localToken != null) {
            localToken = JSON.parse(localToken)
        }
        return localToken;
    }

    const buscaViagem = async () => {
        let localToken = await retornaToken() || '';

        const response = await fetch('https://labtrip-backend.herokuapp.com/viagens/' + viagem.id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localToken
            }
        });

        const json = await response.json();
        if (response.status == 200) {
            setViagem(json);
        }
        else {
            alert(i18n.t('detalhesOrcamento.erroBuscarDetalhes') + json.mensagem);
        }
    }

    const buscaOrcamento = async () => {
        let localToken = await retornaToken() || '';
        const url = roteiro.id + '/' + roteiro.versao + '?tipoOrcamento=' + tipoOrcamento;

        const response = await fetch('https://labtrip-backend.herokuapp.com/orcamentos/' + url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localToken
            }
        });

        const json = await response.json();
        if (response.status == 200) {
            setOrcamento(json);
            setOrcamentoExiste(true);
        }
        else {
            setOrcamentoExiste(false);
        }
    }

    const criaOrcamento = async () => {
        let localToken = await retornaToken() || '';
        const url = roteiro.id + '/' + roteiro.versao + '?tipoOrcamento=' + tipoOrcamento;

        const response = await fetch('https://labtrip-backend.herokuapp.com/orcamentos', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localToken
            },
            body: JSON.stringify(
                {
                    roteiroId: roteiro.id,
                    versaoRoteiro: roteiro.versao,
                    tipo: tipoOrcamento
                }
            )
        });

        const json = await response.json();
        if (response.status == 201) {
            buscaOrcamento();
        }
        else {
            alert(i18n.t('detalhesOrcamento.erroCriarOrcamento') + json.mensagem);
        }
    }

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        const response = await buscaOrcamento();
        setTimeout(() => {
            setRefreshing(false)
        }, 2000);
    }, [refreshing]);


    return (
        <ScrollView style={styles.containerRoot}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            {(orcamentoExiste) && (
                <View style={styles.container}>
                    <View style={styles.containerTop}>
                        {alterar
                            ? < BotaoMais onPress={() =>
                                navigation.navigate('AdicionarDespesa', { orcamento: orcamento })} />
                            : null}
                        {botaoChat}
                    </View>
                    <CardOrcamento roteiro={roteiro} atualizarEstado={onRefresh} tipoOrcamento={tipoOrcamento} planejado={orcamento?.valorTotal || 0} saldoAtual={orcamento?.valorConsumido || 0} />
                    <Text style={styles.label}>{i18n.t('detalhesOrcamento.despesasAdicionais')}</Text>
                    {
                        orcamento?.despesasExtras.map((d, index) => {
                            let modificadoPor = "";
                            if(tipoOrcamento == 'Geral'){
                                modificadoPor = d.nomeUsuario
                             }
                            return (
                                <CardDespesasAdicionais key={d.id} id={d.id} data={moment(d.data).format('DD/MM/YYYY')} editar={viagem.alterar} descricao={d.descricao} valor={d.custo} item={d} modificadoPor={modificadoPor}/>
                            )
                        })
                        
                    }
                </View>
            )}
            {(!orcamentoExiste) && (
                <View style={styles.container}  >
                    <TouchableOpacity style={styles.botaoCriar} onPress={() => {
                        criaOrcamento();
                    }}>
                        <Text style={styles.botaoCriarTexto}>{i18n.t('detalhesOrcamento.ativarOrcamento')}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        textAlign: 'left',
    },
    containerRoot: {
        flex: 1,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 18,
        color: '#999999',
        marginTop: '5%',
        marginBottom: '1%',
    },
    cardOrcamento: {
        height: 100,
        width: '90%',
        backgroundColor: '#F2F2F2',
        borderRadius: 7,
    },
    containerTop: {
        flexDirection: 'row',

    },
    botaoCriar: {
        backgroundColor: '#3385FF',
        width: 150,
        height: 50,
        padding: 10,
        borderRadius: 40,
        marginTop: '5%',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center'
    },
    botaoCriarTexto: {
        fontSize: 16,
        textAlign: 'center',
        color: '#FFFFFF',
    }
})
