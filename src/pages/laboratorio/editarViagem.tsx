import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Platform, Modal, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScrollViewFlat from '../../components/scrollViewFlat';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const moment = require('moment');

interface usuarioDono {
    usuarioDonoId: string,
    dono: string
}

interface Status {
    id: string,
    descricao: string
}

export default function EditarViagem({ route }) {
    let token;
    const navigation = useNavigation();
    const [viagem, setViagem] = useState(route.params.viagem.id);
    const [viagemId, setViagemId] = useState(route.params.viagem.id);
    const [descricao, onChangeDescricao] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [mode, setMode] = useState('date');
    const [showDataInicio, setShowDataInicio] = useState(false);
    const [showDataFim, setShowDataFim] = useState(false);
    const [showLoader, setShowLoader] = React.useState(false);
    const [Token, setToken] = useState('');
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        const request = async () => {
            try {
                setShowLoader(true);
                const value = await AsyncStorage.getItem('AUTH');
                if (value != null) {
                    const valueRead = JSON.parse(value)
                    token = valueRead;
                    setToken(valueRead)
                }
                const json = await buscaViagem();
                setViagem(json);
                setViagemId(json.id)
                onChangeDescricao(json.descricao)
                setDataInicio(json.dataInicio)
                setDataFim(json.dataFim)
                setTimeout(() => {

                }, 1000)
            }
            catch (e) {
                console.log(e)
            }
            finally {
                setShowLoader(false);
            }
        }
        request()

    }, [refreshing]);

    const onChangeDataInicio = (event, selectedDate) => {
        const currentDate = selectedDate || new Date(dataInicio);
        setShowDataInicio(false);
        setDataInicio(currentDate);
        console.log(currentDate)
    };

    const onChangeTextDataFim = (event, selectedDate) => {
        const currentDate = selectedDate || new Date(dataFim);
        setShowDataFim(false);
        setDataFim(currentDate);
        console.log(currentDate)
    };

    const showDatepickerDataInicio = () => {
        setShowDataInicio(true);
        setMode('date');
    };

    const showDatepickerDataFim = () => {
        setShowDataFim(true);
        setMode('date');
    };

    const buscaViagem = async () => {
        const response = await fetch('https://labtrip-backend.herokuapp.com/viagens/' + viagemId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        });

        return response.json();
    }

    const onClickSalvaViagem = async () => {
        try {
            setShowLoader(true);
            const response = await fetch('https://labtrip-backend.herokuapp.com/viagens/' + viagemId, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': Token
                },
                body: JSON.stringify({
                    id: viagem.id,
                    descricao: descricao,
                    dataInicio: dataInicio,
                    dataFim: dataFim,
                    statusId: viagem.statusId,
                    agenciaId: viagem.agenciaId,
                    usuarioDonoId: viagem.usuarioDonoId,
                    criadoPorId: viagem.criadoPorId
                })
            });
            let json = await response.json();
            if (response.status >= 200 && response.status <= 299) {
                alert('Viagem salva com sucesso!')
            } else {
                alert(json.mensagem);
            }
        }
        catch (e) {
            alert('Erro ao salvar usuário.')
        }
        finally {
            setShowLoader(false);
        }
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setRefreshing(false);
    }, []);

    return (
        <ScrollView style={{ backgroundColor: 'white' }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <View style={styles.container}>
                <Modal animationType="fade" transparent={true} visible={showLoader}
                    onRequestClose={() => {
                        setShowLoader(!showLoader)
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <ActivityIndicator style={styles.loader} animating={showLoader} size="large" color="#0FD06F" />
                            <Text style={styles.textStyle}>
                                Aguarde...
                            </Text>
                        </View>
                    </View>

                </Modal>
                <Text style={styles.labelData}>Apelido da viagem</Text>
                <TextInput placeholder={"Nome dado a viagem"} style={styles.input} keyboardType="default"
                    onChangeText={(text) => { onChangeDescricao(text) }} value={descricao} />
                <View style={styles.containerData}>
                    <Text style={styles.labelData}>Data de Inicio</Text>
                    <Text style={styles.labelData}>Data de Fim</Text>
                </View>
                <View style={styles.containerData}>
                    <TouchableOpacity style={styles.containerDataCelular} onPress={showDatepickerDataInicio}>
                        <TextInput placeholder={"DD/MM/YYYY"} style={styles.inputDate}
                            keyboardType="default" value={moment(dataInicio).format('DD/MM/yyyy')} autoCapitalize={'none'} editable={false} />
                        {showDataInicio && (
                            <DateTimePicker
                                testID="dateTimePickerInicio"
                                value={new Date(dataInicio)}
                                display="default"
                                onChange={onChangeDataInicio}
                            />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.containerDataCelular} onPress={showDatepickerDataFim}>
                        <TextInput placeholder={"DD/MM/YYYY"} style={styles.inputDate}
                            keyboardType="default" value={moment(dataFim).format('DD/MM/yyyy')} autoCapitalize={'none'} editable={false} />
                        {showDataFim && (
                            <DateTimePicker
                                testID="dateTimePickerFim"
                                value={new Date(dataFim)}
                                display="default"
                                onChange={onChangeTextDataFim}
                            />
                        )}
                    </TouchableOpacity>
                </View>
                {route.params.viagem.alterar?
                    <TouchableOpacity style={styles.botaoCriar} onPress={onClickSalvaViagem}>
                        <Text style={styles.botaoCriarTexto}>Salvar viagem</Text>
                    </TouchableOpacity>
                    :null
                }
            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    containerData: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
    },
    containerAddFuncionarios: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
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
    inputData: {
        marginTop: '3%',
        marginHorizontal: '2%',
        padding: 15,
        fontSize: 16,
        borderRadius: 41,
        backgroundColor: '#EBEBEB',
        color: '#333333',
        width: '45%'
    },
    inputAddFuncionario: {
        marginTop: '3%',
        width: '85%',
        height: 'auto',
        padding: 15,
        fontSize: 16,
        borderRadius: 41,
        backgroundColor: '#EBEBEB',
        color: '#333333'
    },
    containerParticipantes: {
        borderStyle: 'dotted',
        borderColor: '#333333',
        borderWidth: 1,
        borderRadius: 20,
        marginTop: 10,
        width: '90%',
        alignItems: 'center',
        flexDirection: 'column',
    },
    botaoCriar: {
        backgroundColor: '#3385FF',
        width: 180,
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
        fontSize: 19
    },
    headerCardParticipante: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
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
    labelData: {
        marginTop: '3%',
        marginHorizontal: '2%',
        textAlign: 'center',
        fontSize: 18,
        color: '#999999',
        width: '45%'
    },
    containerDataCelular: {
        flexDirection: 'row',
    },
    inputDate: {
        marginTop: '3%',
        flex: 0,
        paddingHorizontal: 30,
        padding: 15,
        fontSize: 16,
        borderRadius: 41,
        backgroundColor: '#EBEBEB',
        textAlign: 'center',
        color: '#333333'
    },
    pickerComponente: {
        marginTop: '3%',
        width: '95%',
        padding: 15,
        fontSize: 16,
        borderRadius: 41,
        backgroundColor: '#EBEBEB',
        color: '#333333'
    },
    loader: {
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        opacity: 0.9,
        borderRadius: 20,
        padding: '20%',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textStyle: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center"
    }
});