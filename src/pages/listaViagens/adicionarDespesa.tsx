import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInputMask } from 'react-native-masked-text';
import i18n from '../../translate/i18n';

const moment = require('moment');

export default function AdicionarDespesa({ route }) {
    const moment = require('moment');
    const [orcamento, setOrcamento] = useState(route.params.orcamento)
    const [data, setData] = useState(new Date());
    const [descricao, setDescricao] = useState('')
    const [valor, setValor] = useState('')
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    let valorUnmasked;

    const retornaToken = async () => {
        let localToken = await AsyncStorage.getItem('AUTH');
        if (localToken != null) {
            localToken = JSON.parse(localToken)
        }
        return localToken;
    }

    const salvaDespesaExtra = async () => {
        let localToken = await retornaToken() || '';

        const response = await fetch('https://labtrip-backend.herokuapp.com/orcamentos/despesaExtra', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localToken
            },
            body: JSON.stringify(
                {
                    orcamentoId: orcamento.id,
                    custo: valorUnmasked.getRawValue(),
                    descricao: descricao,
                    data: data
                }
            )
        });
        console.log()
        const json = await response.json();
        if (response.status == 200) {
            alert(i18n.t('adicionarDespesa.sucessoAdicionar'))
            navigation.goBack()
        }
        else {
            alert(i18n.t('adicionarDespesa.erroAdicionar') + json.mensagem.toString());
        }
    }


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setData(currentDate);
        console.log(currentDate)
    };


    const showDatepicker = () => {
        setShow(true);
        setMode('date');
    };

    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <TextInput placeholder={i18n.t('adicionarDespesa.descricao')} style={styles.input}
                value={descricao} onChangeText={(texto) => setDescricao(texto)} />
            <TextInputMask
                type={'money'}
                options={{
                    maskType: 'INTERNATIONAL',

                }}
                value={valor}
                style={styles.input}
                onChangeText={(valor) => {
                    setValor(valor);
                }}
                placeholder={i18n.t('adicionarDespesa.valorDespesa')}
                ref={(ref) => valorUnmasked = ref}
            />
            <TouchableOpacity style={styles.containerDataCelular} onPress={showDatepicker}>
                <TextInput placeholder={"DD/MM/YYYY"} style={styles.inputDate}
                    keyboardType="default" value={moment(data).format('DD/MM/yyyy')} editable={false} />
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={data}
                        display="default"
                        onChange={onChange}
                    />
                )}
            </TouchableOpacity>

            <View style={styles.containerBotoes}>
                <TouchableOpacity style={styles.botaoSalvar} onPress={() => {
                    salvaDespesaExtra();
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

    },
    containerDataCelular: {
        flexDirection: 'row',
    },
    inputDataCelular: {
        marginTop: 25,
        width: 266,
        height: 50,
        backgroundColor: '#fff',
        textAlign: 'center',
        justifyContent: 'space-around',
        fontWeight: 'bold',
        borderRadius: 32,
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        fontSize: 16,
    },
    inputDate: {
        marginTop: '3%',
        width: '90%',
        padding: 15,
        fontSize: 16,
        borderRadius: 41,
        backgroundColor: '#EBEBEB',
        textAlign: 'center',
        color: '#333333'
    },
})