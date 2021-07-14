import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import normalize from '../../components/fontSizeResponsive';
import DatePicker from 'react-native-datepicker'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { stringify } from 'uuid';
import i18n from '../../translate/i18n';

const moment = require('moment');

interface Roteiro {
    id: number,
    viagemId: string,
    descricaoRoteiro: string,
    statusId: number,
    versao: number

}


export default function EditarRoteiro({ route }) {
    const navigation = useNavigation();
    const [roteiro, setRoteiro] = useState(route.params.roteiro);
    const [apelido, onChangeApelido] = useState(route.params.roteiro.descricaoRoteiro);
    const [selectedValue, setSelectedValue] = useState(route.params.roteiro.statusId);

    let comboBox;


    useEffect(() => {
        buscaRoteiro();
    }, [])

    const retornaToken = async () => {
        let localToken = await AsyncStorage.getItem('AUTH');
        if (localToken != null) {
            localToken = JSON.parse(localToken)
        }
        return localToken;
    }

    const buscaRoteiro = async () => {
        let localToken = await retornaToken() || '';

        const response = await fetch('https://labtrip-backend.herokuapp.com/roteiros/' + roteiro.id + '/' + roteiro.versao, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localToken
            }
        });

        const json = await response.json();
        if (response.status == 200) {
            setRoteiro(json);
            onChangeApelido(json.descricaoRoteiro);
            setSelectedValue(json.statusId)
        }

    }

    const salvaRoteiro = async () => {
        let localToken = await retornaToken() || '';

        const response = await fetch('https://labtrip-backend.herokuapp.com/roteiros/' + roteiro.id + '/' + roteiro.versao, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localToken
            },
            body: JSON.stringify({
                id: roteiro.id,
                viagemId: roteiro.viagemId,
                descricaoRoteiro: apelido,
                statusId: selectedValue,
                versao: roteiro.versao
            })
        });

        if (response.status == 200) {
            alert(i18n.t('editarRoteiro.sucessoAlterar'))
            navigation.goBack();
        }
        else {
            alert(i18n.t('editarRoteiro.erroAlterar'))
        }
    }

    const versionaRoteiro = async () => {
        let localToken = await retornaToken() || '';

        const response = await fetch('https://labtrip-backend.herokuapp.com/roteiros/versionar/' + roteiro.id + '/' + roteiro.versao, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localToken
            }
        });

        console.log('https://labtrip-backend.herokuapp.com/roteiros/versionar/' + roteiro.id + '/' + roteiro.versao)

        const json = await response.json()
        if (response.status == 201) {
            alert(i18n.t('editarRoteiro.sucessoVersionar'))
            navigation.goBack();
        }
        else {
            alert(i18n.t('editarRoteiro.erroVersionar') + json.mensagem)
        }
    }

    const deletaRoteiro = async () => {
        let localToken = await retornaToken() || '';

        const response = await fetch('https://labtrip-backend.herokuapp.com/roteiros/' + roteiro.id + '/' + roteiro.versao, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localToken
            }
        });

        if (response.status >= 200 && response.status <= 299) {
            alert(i18n.t('editarRoteiro.sucessoExcluir'))
            navigation.goBack();
        }
        else {
            alert(i18n.t('editarRoteiro.erroExcluir'))
        }
    }

    //Adiciona combobox para status do roteiro se o usuário clicar para editar roteiro.
    if (route.name == 'Roteiro') {
        comboBox =
            <Picker
                prompt="Status do roteiro"
                mode="dropdown"
                selectedValue={selectedValue}
                style={{ height: 50, width: '95%' }}
                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
                <Picker.Item label={i18n.t('status.planejamento')} value={1} color="#B7AF0B" />
                <Picker.Item label={i18n.t('status.aprovado')} value={6} color="#0FD06F" />
                <Picker.Item label={i18n.t('status.reprovado')} value={7} color="#D12323" />
            </Picker>;
    }


    return (
        <View style={styles.container}>
            <View style={styles.containerTop}>
                <Text style={styles.tituloTop}>{i18n.t('detalhesRoteiro.titulo')}</Text>
            </View>
            <TextInput placeholder={i18n.t('detalhesRoteiro.apelidoPlaceholder')} value={apelido} style={styles.input} onChangeText={(texto) => onChangeApelido(texto)} />
            <Picker
                prompt="Status do roteiro"
                mode="dropdown"
                selectedValue={selectedValue}
                style={{ height: 50, width: '95%' }}
                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
                <Picker.Item label={i18n.t('status.planejamento')} value={1} color="#B7AF0B" />
                <Picker.Item label={i18n.t('status.aprovado')} value={6} color="#0FD06F" />
                <Picker.Item label={i18n.t('status.reprovado')} value={7} color="#D12323" />
            </Picker>
            {route.params.viagem.alterar
                ? <TouchableOpacity style={styles.botaoCriar} onPress={() => {

                    salvaRoteiro();
                }}>
                    <Text style={styles.botaoCriarTexto}>{i18n.t('botoes.salvar')}</Text>
                </TouchableOpacity>
                : null}
            {route.params.viagem.alterar
                ? <TouchableOpacity style={styles.botaoVersionar} onPress={() => {

                    versionaRoteiro();
                }}>
                    <Text style={styles.botaoCriarTexto}>{i18n.t('botoes.versionar')}</Text>
                </TouchableOpacity>
                : null}

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
        width: 130,
        height: 50,
        padding: 10,
        borderRadius: 40,
        marginTop: '5%',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center'
    },
    botaoVersionar: {
        backgroundColor: '#F6E500',
        width: 130,
        height: 50,
        padding: 10,
        borderRadius: 40,
        marginTop: '5%',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center'
    }
    ,
    botaoDeletar: {
        backgroundColor: '#FD0000',
        width: 130,
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
        fontSize: 18
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
