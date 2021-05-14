import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import normalize from '../../components/fontSizeResponsive';
import DatePicker from 'react-native-datepicker'

const moment = require('moment');


export default function CriarRoteiro({ route }) {
    const navigation = useNavigation();
    const [apelido, onChangeApelido] = useState(route.params?.roteiro.descricao || "");
    const [dataInicio, onChangeTextDataInicio] = useState(moment(route.params?.roteiro.dataInicio) || moment());
    const [dataFim, onChangeTextDataFim] = useState(moment(route.params?.roteiro.dataFim) || moment());
    const [selectedValue, setSelectedValue] = useState(route.params?.roteiro.statusId);

    let comboBox;

    //Adiciona combobox para status do roteiro se o usuário clicar para editar roteiro.
    if (route.name == 'Roteiro') {
        comboBox =
            <Picker
                prompt="Status do roteiro"
                mode="dropdown"
                selectedValue={selectedValue}
                style={{ height: 50, width: '50%' }}
                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
                <Picker.Item label="Em planejamento" value={1} color="#B7AF0B" />
                <Picker.Item label="Aprovado" value={6} color="#0FD06F" />
                <Picker.Item label="Reprovado" value={7} color="#D12323" />
            </Picker>;
    }


    return (
        <View style={styles.container}>
            <View style={styles.containerTop}>
                <Text style={styles.tituloTop}>Propostas de roteiro</Text>
            </View>
            <TextInput placeholder={"Apelido do roteiro"} value={apelido} style={styles.input} onChangeText={(texto) => onChangeApelido(texto)} />
            <View style={styles.containerData}>
                <Text style={styles.labelData}>Data de Inicio</Text>
                <Text style={styles.labelData}>Data de Fim</Text>
            </View>
            <View style={styles.containerData}>
                <DatePicker
                    style={styles.inputDataCelular}
                    placeholder={"Data início"}
                    date={moment(dataInicio, 'DD/MM/YYYY')}
                    format="DD/MM/yyyy"
                    minDate="01/01/1900"
                    onDateChange={data => onChangeTextDataInicio(data)}
                />
                <DatePicker
                    style={styles.inputDataCelular}
                    placeholder={"Data fim"}
                    date={moment(dataFim, 'DD/MM/YYYY')}
                    format="DD/MM/yyyy"
                    minDate="01/01/1900"
                    onDateChange={data => onChangeTextDataFim(data)}
                />
            </View>
            {comboBox}
            <TouchableOpacity style={styles.botaoCriar} onPress={() => {
                alert(apelido)
                navigation.goBack();
            }}>
                <Text style={styles.botaoCriarTexto}>Salvar</Text>
            </TouchableOpacity>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    containerTop: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '92%',
        backgroundColor: '#F2F2F2',
        borderRadius: 7,
        height: '10%',
        marginTop: '5%',
    },
    tituloTop: {
        fontSize: normalize(18)
    },
    containerData: {
        flexDirection: 'row',
    },
    input: {
        marginTop: '3%',
        width: '95%',
        padding: 15,
        fontSize: 16,
        borderRadius: 41,
        backgroundColor: '#EBEBEB',
        color: '#333333',
    },
    labelData: {
        marginTop: '3%',
        marginHorizontal: '2%',
        textAlign: 'center',
        fontSize: 18,
        color: '#999999',
        width: '45%'
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
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 24
    },
    inputDataCelular: {
        marginTop: '1%',
        marginBottom: '3%',
        width: '45%',
        marginHorizontal: '2%',
        height: 50,
        backgroundColor: '#EBEBEB',
        textAlign: 'center',
        justifyContent: 'space-around',
        borderRadius: 32,
        padding: 15,
        fontSize: 16,
    },
    pickerComponente: {
        marginTop: '3%',
        width: '95%',
        padding: 15,
        fontSize: 16,
        borderRadius: 41,
        backgroundColor: '#EBEBEB',
        color: '#333333'
    }

});
