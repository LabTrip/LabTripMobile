import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CardProprietario from '../../components/cardProprietario';
import BotaoLupa from '../../components/botaoLupa';
import DatePicker from 'react-native-datepicker'
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const moment = require('moment');

interface Participante {
    id: string,
    nome: string,
    viagemId: string,
    permissaoViagemId: string,
    descricao: string
}

export default function CriarViagem() {
    let token, userId;
    const navigation = useNavigation();
    const [apelido, setApelido] = useState('');
    const [dataInicio, onChangeTextDataInicio] = useState(moment());
    const [dataFim, onChangeTextDataFim] = useState(moment());
    const [email, onChangeTextEmail] = useState('');
    const [participantes, setParticipantes] = useState<Participante[]>([]);
    const [agente, setAgente] = useState<Participante[]>([]);

    const buscaUsuario = async (email) => {
        return await fetch('https://labtrip-backend.herokuapp.com/usuarios/email/' + email, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        });
    }

    const salvaViagens = async () => {
        return await fetch('https://labtrip-backend.herokuapp.com/viagens/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({
                descricao: apelido,
                dataInicio: moment(dataInicio),
                dataFim: moment(dataFim),
                usuarioDonoId: participantes[0].id,
                criadoPorId: userId,
                statusId: 1,
                agenciaId: "98f54c2d-9522-4e25-93cb-815a30ab2ae4",
                participantes: [
                    {
                        usuarioId: participantes[0].id,
                        permissaoViagemId: 1
                    },
                    {
                        usuarioId: userId,
                        permissaoViagemId: 3
                    }
                ]
            })
        });
    }
    const salvar = async () => {
        if (participantes.length == 1) {
            const value = await AsyncStorage.getItem('AUTH');
            const user = await AsyncStorage.getItem('USER_ID');
            if (value !== null && user !== null) {
                token = JSON.parse(value)
                userId = JSON.parse(user)
                const response = await salvaViagens();
                const json = await response.json();
                if (response.status == 201) {
                    alert('Viagem salva com sucesso!');
                    navigation.goBack();
                } else {
                    alert(json.mensagem)
                }
            }
            else {
                alert('Erro ao ao capturar informações no dispositivo, feche o app e tente novamente.')
            }
        } else {
            alert('Adicione o proprietário da viagem!')
        }
    }

    const removeProprietario = () => {
        setParticipantes([]);
    }

    const adicionaUsuarioParticipante = async () => {
        const value = await AsyncStorage.getItem('AUTH');
        if (value !== null) {
            token = JSON.parse(value)
            const response = await buscaUsuario(email);
            const json = await response.json();
            if (response.status == 200) {
                if (json.length == 1) {
                    setParticipantes(json);
                }
                else if (json.length > 1) {
                    alert('Digite o e-mail completo!')
                }
                else {
                    alert('Nenhum usuário encontrado');
                }
            }
            else {
                alert(json.mensagem);
            }
        }
        else {
            alert('Erro ao ao capturar informações no dispositivo, feche o app e tente novamente.')
        }
    }


    return (
        <View style={styles.container}>
            <TextInput placeholder={"Apelido da viagem"} value={apelido} onChangeText={(text) => setApelido(text)} style={styles.input} />
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
            <View style={styles.containerAddFuncionarios}>
                <TextInput placeholder={"Email do proprietário"} value={email} onChangeText={texto => onChangeTextEmail(texto)}
                    style={styles.inputAddParticipante} />
                <BotaoLupa onPress={() => adicionaUsuarioParticipante()} />
            </View>
            <View style={styles.containerParticipantes}>
                <FlatList
                    data={participantes}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <CardProprietario usuario={item} nome={item.nome} dono={true} proprietario={true} excluir={removeProprietario} />
                    )}

                />
            </View>

            <TouchableOpacity style={styles.botaoCriar} onPress={() => {
                salvar();
            }}>
                <Text style={styles.botaoCriarTexto}>Criar viagem</Text>
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
    containerData: {
        flexDirection: 'row',
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
    labelData: {
        marginTop: '3%',
        marginHorizontal: '2%',
        textAlign: 'center',
        fontSize: 18,
        color: '#999999',
        width: '45%'
    },
    inputAddParticipante: {
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
        fontSize: 24
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
    }

});
