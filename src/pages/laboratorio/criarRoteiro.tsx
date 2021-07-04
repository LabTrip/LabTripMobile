import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import normalize from '../../components/fontSizeResponsive';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Roteiro {
    id: number,
    viagemId: string,
    descricaoRoteiro: string,
    statusId: number,
    versao: number
}

export default function CriarRoteiro({ route }) {
    let token;
    const navigation = useNavigation();
    const [apelido, onChangeApelido] = useState("");

    const salvaRoteiros = async () => {
        return await fetch('https://labtrip-backend.herokuapp.com/roteiros/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({
                viagemId: route.params.viagem.id.toString(),
                statusId: '1',
                versao: 1,
                descricaoRoteiro: apelido

            })
        });
    }
    const salvar = async () => {
        const value = await AsyncStorage.getItem('AUTH');
        if (value !== null) {
            token = JSON.parse(value)
            const response = await salvaRoteiros();
            const json = await response.json();
            if (response.status == 201) {
                alert('Roteiro criado com sucesso!');
                navigation.goBack();
            } else {
                alert(json.mensagem)
            }
        }
        else {
            alert('Erro ao ao capturar informações no dispositivo, feche o app e tente novamente.')
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerTop}>
                <Text style={styles.tituloTop}>Criação da proposta de roteiro</Text>
            </View>
            <Text style={styles.labelData}>Descrição do roteiro</Text>
            <TextInput placeholder={"Descrição"} value={apelido} style={styles.input} onChangeText={(texto) => onChangeApelido(texto)} />
            <TouchableOpacity style={styles.botaoCriar} onPress={() => {
                if (apelido != "") {
                    salvar();
                } else {
                    alert('O roteiro precisa ter uma descrição!')
                }

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
        fontSize: normalize(18),
        maxWidth: '80%'
    },
    containerData: {
        flexDirection: 'row',
    },
    input: {
        marginTop: '3%',
        width: '90%',
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
