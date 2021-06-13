import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-datepicker'
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const moment = require('moment');

export default function EditarDespesaAdicional({ route }) {
    const [despesa, setDespesa] = useState(route.params.despesasExtras)
    const [data, setData] = useState(new Date(route.params.despesasExtras.data));
    const [descricao, setDescricao] = useState(route.params.despesasExtras.descricao)
    const [valor, setValor] = useState(route.params.despesasExtras.custo.toString())
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const retornaToken = async () => {
        let localToken = await AsyncStorage.getItem('AUTH');
        if (localToken != null) {
          localToken = JSON.parse(localToken)
        }
        return localToken;
    }

    const atualizaDespesaExtra = async () => {
        let localToken = await retornaToken() || '';

        const response = await fetch('https://labtrip-backend.herokuapp.com/orcamentos/despesaExtra/' + despesa.id, {
            method: 'PUT',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': localToken
            },
            body: JSON.stringify(
                {
                    descricao: descricao,
                    custo: valor,
                    data: data
                }
            )
        });
        console.log()
        const json = await response.json();
        if (response.status == 200) {
            alert('Despesa extra atualizada com sucesso!')
            navigation.goBack()
        }
        else{
            alert('Erro ao atualizar despesa extra: ' + json.toString());
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
            <TextInput placeholder='Descrição' style={styles.input}
                value={descricao} onChangeText={(texto) => setDescricao(texto)} />
            <TextInput placeholder='Valor da despesa' style={styles.input}
                keyboardType={'decimal-pad'} value={valor} onChangeText={(valor) => setValor(valor)} />
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
                    atualizaDespesaExtra();
                }}>
                    <Text style={styles.textoBotao}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoCancelar} onPress={() => navigation.goBack()}>
                    <Text style={styles.textoBotao}>Cancelar</Text>
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