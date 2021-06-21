import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import BotaoMais from '../../components/botaoMais';
import CardOrcamento from '../../components/cardOrcamento';
import CardDespesasAdicionais from '../../components/cardDespesaAdicional';
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function DetalhesOrcamentoIndividual({ route }) {
    const navigation = useNavigation();
    const [roteiro, setRoteiro] = useState(route.params.roteiro);
    const [orcamento, setOrcamento] = useState();
    const [orcamentoExiste, setOrcamentoExiste] = useState<Boolean>(false);
    const rota = route.name;
    let botaoChat;
    if (rota == 'Geral' || rota == 'Orçamento') {
        botaoChat = <TouchableOpacity style={{ marginTop: '4%' }} onPress={() => alert('clicou na messagem')}>
            <MaterialCommunityIcons name={'chat-processing'} color={'#575757'} size={42} />
        </TouchableOpacity>;
    }

    useEffect(() => {
        buscaOrcamento();
        console.log('buscou do use effect')
    });

    const retornaToken = async () => {
        let localToken = await AsyncStorage.getItem('AUTH');
        if (localToken != null) {
          localToken = JSON.parse(localToken)
        }
        return localToken;
    }


    const buscaOrcamento = async () => {
      let localToken = await retornaToken() || '';
      const url = roteiro.id + '/' + roteiro.versao + '?tipoOrcamento=' + route.name;

      const response = await fetch('https://labtrip-backend.herokuapp.com/orcamentos/' + url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': localToken
        }
      });
      console.log('buscou')
      const json = await response.json();
      if (response.status == 200) {
        setOrcamento(json);
        setOrcamentoExiste(true);
      }
      else{
        setOrcamentoExiste(false);
      }
    }

    const criaOrcamento = async () => {
        let localToken = await retornaToken() || '';
        const url = roteiro.id + '/' + roteiro.versao + '?tipoOrcamento=' + route.name;

        const response = await fetch('https://labtrip-backend.herokuapp.com/orcamentos', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': localToken
            },
            body: JSON.stringify(
                {
                    roteiroId:roteiro.id,
                    versaoRoteiro:roteiro.versao,
                    tipo: route.name
                }
            )
        });
        
        const json = await response.json();
        if (response.status == 201) {
            buscaOrcamento();
        }
        else{
            alert('Erro ao criar orçamento: ' + json.mensagem);
        }
    }

    return (
        <ScrollView style={{backgroundColor: '#FFFFFF'}}>
            {(orcamentoExiste) && (
                <View style={styles.container}>
                    <View style={styles.containerTop}>
                        <BotaoMais onPress={() =>
                            navigation.navigate('AdicionarDespesa')} />
                        {botaoChat}
                    </View>
                    <CardOrcamento planejado={30000} saldoAtual={10000} />
                    <Text style={styles.label}>Despesas adicionais: </Text>
                    <CardDespesasAdicionais data={'12/03/2021'} descricao={'Dogão na praça'} valor={458} />
                </View>
            )}            
            {(!orcamentoExiste) && (
                <View style={styles.container}  >
                    <TouchableOpacity style={styles.botaoCriar} onPress={() => {
                        criaOrcamento();
                    }}>
                        <Text style={styles.botaoCriarTexto}>Ativar orçamento</Text>
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
        fontSize: 20,
        textAlign: 'center',
        color: '#FFFFFF',
    }
})
