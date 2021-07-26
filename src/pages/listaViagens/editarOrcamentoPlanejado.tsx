import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { TextInputMask } from 'react-native-masked-text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../translate/i18n';
import { documentDirectory } from 'expo-file-system';

export default function EditarOrcamentoPlanejado({ route }) {
    const [orcPlanejado, setOrcPlanejado] = useState(route.params.orcamento.toString());
    const [roteiro, setRoteiro] = useState(route.params.roteiro);
    const navigation = useNavigation();
    let valorUnmasked, token;

    const salvaOrcPlanejado = async () => {
        console.log(route.params)
        return await fetch('https://labtrip-backend.herokuapp.com/orcamentos/' + roteiro.id + '/' + roteiro.versao + '?tipoOrcamento=' + route.params.tipoOrcamento, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({
                valorTotal: valorUnmasked.getRawValue(),
            })
        });
    }

    const salvar = async () => {
        const value = await AsyncStorage.getItem('AUTH');
        if (value !== null) {
            token = JSON.parse(value)
            const response = await salvaOrcPlanejado();
            const json = await response.json();
            if (response.status == 200) {
                alert(i18n.t('editarOrcamentoPlanejado.sucesso'));
                route.params.atualizarEstado();
                navigation.goBack();
            } else {
                alert(json.mensagem)
            }
        }
        else {
            alert(i18n.t('editarOrcamentoPlanejado.erro'))
        }
    }


    return (
        <View style={styles.container}>
            <Text style={styles.label}>{i18n.t('editarOrcamentoPlanejado.orcamentoGeral')}</Text>
            <TextInputMask
                type={'money'}
                options={{
                    precision: 2,
                    separator: ',',
                    delimiter: '.',
                    unit: route.params.moeda + ' ',
                    suffixUnit: ''
                }}
                value={orcPlanejado}
                style={styles.input}
                onChangeText={(orcPlanejado) => {
                    setOrcPlanejado(orcPlanejado);
                }}
                placeholder="Valor da despesa"
                ref={(ref) => valorUnmasked = ref}
            />
            <Text style={styles.texto}>{i18n.t('editarOrcamentoPlanejado.orcamentoGeralDesc')}</Text>
            <View style={styles.containerBotoes}>
                <TouchableOpacity style={styles.botaoSalvar} onPress={() => {
                    salvar();
                }}>
                    <Text style={styles.textoBotao}>{i18n.t('botoes.salvar')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoCancelar} onPress={() => navigation.goBack()}>
                    <Text style={styles.textoBotao}>{i18n.t('botoes.cancelar')}</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    containerBotoes: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    label: {
        fontSize: 18,
        color: '#999999',
        textAlign: 'center',
        marginTop: '10%'
    },
    texto: {
        width: '80%',
        flexWrap: 'wrap',
        marginTop: '3%',
        textAlign: 'center'
    },
    input: {
        marginTop: '5%',
        width: '90%',
        padding: 15,
        fontSize: 16,
        borderRadius: 41,
        backgroundColor: '#EBEBEB',
        color: '#333333',
        textAlign: 'center'
    },
    botaoSalvar: {
        backgroundColor: '#3385FF',
        width: '35%',
        padding: 10,
        borderRadius: 40,
        marginTop: '5%',
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: '5%'
    },
    botaoCancelar: {
        backgroundColor: '#FF3333',
        width: '35%',
        padding: 10,
        borderRadius: 40,
        marginTop: '5%',
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: '5%'
    },
    textoBotao: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center'

    }
})