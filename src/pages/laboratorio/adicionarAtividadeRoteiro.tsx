import React, { useState, Component, Fragment } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import normalize from '../../components/fontSizeResponsive';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker'
import SearchableDropdown from 'react-native-searchable-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInputMask } from 'react-native-masked-text';
import i18n from '../../translate/i18n';
import BotaoMais from '../../components/botaoMais'
const moment = require('moment');

const atividadesDropdownModel = (atividade, index) => ({
    id: index,
    atividadeId: atividade.id,
    name: atividade.descricao
  });

interface Atividades{
    id: string,
    name: string,
    atividadeId: string
}

export default function AdicionarAtividadeRoteiro({ route }) {
    const navigation = useNavigation();
    const [roteiro, setRoteiro] = useState(route.params.roteiro);
    const [atividade, setAtividade] = useState<Atividades>();
    const [valor, setValor] = useState('0')
    const [descAtividade, setDescAtividade] = useState('');
    const [dataInicio, onChangeTextDataInicio] = useState(new Date());
    const [horaInicio, onChangeTextHoraInicio] = useState(new Date(dataInicio));
    const [dataFim, onChangeTextDataFim] = useState(new Date());
    const [horaFim, onChangeTextHoraFim] = useState(new Date(dataFim));
    const [showDataInicio, setShowDataInicio] = useState(false);
    const [showHoraInicio, setShowHoraInicio] = useState(false);
    const [showDataFim, setShowDataFim] = useState(false);
    const [showHoraFim, setShowHoraFim] = useState(false);
    const [mode, setMode] = useState('datetime');
    const [observacoesAgente, setObservacoesAgente] = useState('');
    let custoRefField;

    var itemsExample = [];

    const [items, setItems] = useState<Atividades[]>(itemsExample);
    
    const retornaToken = async () => {
      let localToken = await AsyncStorage.getItem('AUTH');
      if (localToken != null) {
          localToken = JSON.parse(localToken)
      }
      return localToken;
    }

    const buscaAtividades = async (descricaoAtividade) => {
        let localToken = await retornaToken() || '';

        const response = await fetch('https://labtrip-backend.herokuapp.com/atividades/search?descricaoAtividade=' + descricaoAtividade, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localToken
            }
        });
        const json = await response.json();
        //seta lista de atividades se o status da resposta for 200
        if (response.status == 200 || response.status == 304) {
            if(json.length == 0){
                console.log('aqui')
                const i = [{id: 1, descricao: 'Nenhuma atividade encontrada'}]
                setItems(i.map((a, i) => atividadesDropdownModel(a, i)))
            }
            else{
                setItems(json.map((a, i) => atividadesDropdownModel(a, i)))
            }
            //setAtividades(json);
        }
        else{
            console.log(response)
        }
    }

    const mostrarDataInicio = () => {
        setShowDataInicio(true);
        setMode('date');
    };

    const onChangeDataInicio = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        let date = new Date(currentDate)
        date.setHours(horaInicio.getHours(),horaInicio.getMinutes(),0)
        setShowDataInicio(Platform.OS === 'ios');
        onChangeTextDataInicio(date);
    };

    const mostrarHoraInicio = () => {
        setShowHoraInicio(true);
        setMode('date');
    };

    const mostrarHoraFim = () => {
        setShowHoraFim(true);
        setMode('date');
    };

    const onChangeHoraInicio = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        let date = new Date(currentDate);
        date.setDate(dataInicio.getDate())
        console.log(date)
        setShowHoraInicio(Platform.OS === 'ios');
        onChangeTextHoraInicio(date);
        onChangeTextDataInicio(date);
    };

    const mostrarDataFim = () => {
        setShowDataFim(true);
        setMode('date');
    };

    const onChangeDataFim = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        let date = new Date(currentDate)
        date.setHours(horaFim.getHours(),horaFim.getMinutes(),0)
        setShowDataFim(Platform.OS === 'ios');
        onChangeTextDataFim(date);
    };

    const onChangeHoraFim = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        let date = new Date(currentDate);
        date.setDate(dataFim.getDate())
        setShowHoraFim(Platform.OS === 'ios');
        onChangeTextHoraFim(date);
        onChangeTextDataFim(date);
    };

    const adicionarAtividadeRoteiro = async () => {
        try{
            let localToken = await retornaToken() || '';

            const response = await fetch('https://labtrip-backend.herokuapp.com/roteiroAtividades', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': localToken
                },
                body: JSON.stringify({
                    "atividadeId": atividade?.atividadeId,
                    "roteiroId": roteiro.id,
                    "versaoRoteiro": roteiro.versao,
                    "dataInicio": dataInicio.toString(),
                    "dataFim":  dataFim.toString(),
                    "custo": custoRefField.getRawValue(),
                    "statusId": 1,
                    "observacaoCliente": "",
                    "observacaoAgente": observacoesAgente
                })
            });
            const json = await response.json();
            //seta lista de atividades se o status da resposta for 200
            if (response.status == 201 || response.status == 304) {
                alert('Atividade adicionada com sucesso!')
                setTimeout(() => navigation.goBack(), 1500)
            }
            else{
                alert('Erro ao adicionar atividade: ' + json)
            }
        }
        catch(e){
            console.log(e)
            alert('Erro ao adicionar atividade.')
        }
    }

    return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centeredContainer}>
                    <Text style={styles.labelData}>{i18n.t('adicionarAtividadeRoteiro.atividade')}</Text>
                    <View style={styles.containerRow}>
                        <SearchableDropdown
                            multi={false}
                            onItemSelect={(item) => {
                                setAtividade(item);
                                setDescAtividade(item.name);
                            }}
                            containerStyle={{ padding: 5 , width: '92%', alignItems: 'center', justifyContent: 'center'}}
                            itemStyle={{
                                padding: 10,
                                marginTop: 2,
                                backgroundColor: '#EBEBEB',
                                borderColor: '#bbb',
                                borderWidth: 1,
                                borderRadius: 5,
                                width: '100%',
                                flexGrow: 1
                            }}
                            itemTextStyle={{ color: '#222' }}
                            itemsContainerStyle={{ maxHeight: 140, width: '90%'}}
                            items={items}
                            resetValue={false}
                            textInputProps={
                                {
                                    placeholder: "Pesquisar atividades",
                                    underlineColorAndroid: "transparent",
                                    style: styles.input,
                                    value: descAtividade,
                                    onTextChange: async (text) => {
                                        setDescAtividade(text);
                                        buscaAtividades(text) 
                                    }
                                }
                            }
                            listProps={
                            {
                                nestedScrollEnabled: true,
                            }
                            }
                        />
                        <BotaoMais style={{width: '100%', alignitems: 'center', justifyContent: 'center', marginHorizontal: '1%'}} onPress={() => navigation.navigate('CriarAtividade')}></BotaoMais>
                    </View>
                </View>
                <ScrollView>
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.labelData}>{i18n.t('adicionarAtividadeRoteiro.custo')}</Text>
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
                            placeholder="Valor da atividade"
                            ref={(ref) => {custoRefField = ref}}
                        />
                        <View style={styles.containerData}>
                            <Text style={styles.labelData}>{i18n.t('adicionarAtividadeRoteiro.dataInicio')}</Text>
                        </View>
                        <View style={styles.containerData}>
                            <TouchableOpacity style={styles.containerDataCelular} onPress={mostrarDataInicio}>
                                <TextInput placeholder={"DD/MM/YYYY"} style={styles.inputDate}
                                    keyboardType="default" value={moment(dataInicio).format('DD/MM/yyyy')} autoCapitalize={'none'} editable={false} />
                                {showDataInicio && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={dataFim}
                                        display="default"
                                        onChange={onChangeDataInicio}
                                    />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.containerDataCelular} onPress={mostrarHoraInicio}>
                                <TextInput placeholder={"HH:mm"} style={styles.inputDate}
                                    keyboardType="default" value={moment(horaInicio).format('HH:mm')} autoCapitalize={'none'} editable={false} />
                                {showHoraInicio && (
                                    <DateTimePicker
                                        is24Hour={true}
                                        mode='time'
                                        testID="dateTimePicker"
                                        value={horaInicio}
                                        display="default"
                                        onChange={onChangeHoraInicio}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.containerData}>
                            <Text style={styles.labelData}>{i18n.t('adicionarAtividadeRoteiro.dataFim')}</Text>
                        </View>
                        <View style={styles.containerData}>
                            <TouchableOpacity style={styles.containerDataCelular} onPress={mostrarDataFim}>
                                <TextInput placeholder={"DD/MM/YYYY"} style={styles.inputDate}
                                    keyboardType="default" value={moment(dataFim).format('DD/MM/yyyy')} autoCapitalize={'none'} editable={false} />
                                {showDataFim && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={dataFim}
                                        display="default"
                                        onChange={onChangeDataFim}
                                    />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.containerDataCelular} onPress={mostrarHoraFim}>
                                <TextInput placeholder={"HH:mm"} style={styles.inputDate}
                                    keyboardType="default" value={moment(horaFim).format('HH:mm')} autoCapitalize={'none'} editable={false} />
                                {showHoraFim && (
                                    <DateTimePicker
                                        is24Hour={true}
                                        mode='time'
                                        testID="dateTimePicker"
                                        value={horaFim}
                                        display="default"
                                        onChange={onChangeHoraFim}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.labelData}>{i18n.t('adicionarAtividadeRoteiro.observacoes')}</Text>
                        <TextInput  style={styles.input} multiline={true} numberOfLines={4}
                            value={observacoesAgente} onChangeText={(texto) => setObservacoesAgente(texto)} />
                        <TouchableOpacity style={styles.botaoCriar} onPress={async () => {
                            const res = await adicionarAtividadeRoteiro();
                        }}>
                            <Text style={styles.botaoCriarTexto}>{i18n.t('adicionarAtividadeRoteiro.adicionar')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    containerRow:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    centeredContainer:{
        width: '92%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollcontainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
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
    longInput: {
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
        marginVertical: '5%',
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
    },
    containerDataCelular: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%'
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

});
