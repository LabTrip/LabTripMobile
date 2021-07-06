import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CardProprietario from '../../components/cardProprietario';
import BotaoLupa from '../../components/botaoLupa';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchableDropdown from 'react-native-searchable-dropdown';
import SearchFromAPI from '../../components/searchFromAPI'
import Routes from '../../routes';

const moment = require('moment');

interface Locais {
    id: string,
    name: string,
    poi: object,
    address: object,
    position: object
}

const localViewModel = (local) => ({
    id: local.id,
    name: local.name,
    poi: local.poi,
    address: local.address,
    position: local.position
  });

export default function CriarAtividade({ route }) {
    const navigation = useNavigation();
    const [descricao, setDescricao] = useState('');
    const [nomeLocal, setNomeLocal] = useState('');
    const [locais, setLocais] = useState<Locais[]>([]);
    const [local, setLocal] = useState<Locais>();

    const retornaToken = async () => {
        let localToken = await AsyncStorage.getItem('AUTH');
        if (localToken != null) {
            localToken = JSON.parse(localToken)
        }
        return localToken;
    }

    const salvaAtividade = async () => {
        let localToken = await retornaToken() || '';

        const response = await fetch('https://labtrip-backend.herokuapp.com/atividades/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localToken
            },
            body: JSON.stringify({
                descricao: descricao,
                local: local
            })
        });

        const json = await response.json();
        if(response.status == 201){
            alert('Atividade criada com sucesso');
            if(route.params.callBackCriaAtividade != undefined){
                route.params.callBackCriaAtividade(json);
                navigation.goBack();
            }       
        }
        else{
            alert('Erro ao salvar atividade: ' + response)
        }
    }

    const buscaLocais = async () => {
        const descLocal = encodeURI(nomeLocal);
        const uri = 'https://api.tomtom.com/search/2/search/'+descLocal+'.json?key=SNN6XwXIPAa7ZUEq6Bexqtza6ii6oVgs&limit=10&language=pt-BR&idxSet=POI,Str'
        const response =  await fetch(uri, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });

        
        if(response.status == 200){
            const json = await response.json();
            const locais = json.results;
            const listaLocais = locais.map((l, index) => {
                //console.log(l.type)
                if(l.type == 'POI'){
                    l.name = l.poi.name + ', ' + l.address.municipality + ' - ' + l.address.country;
                    return localViewModel(l);
                }
            })

            //console.log(listaLocais.filter(local => local))
            setLocais(listaLocais.filter(local => local));
            
        }
        else{
            alert('Erro ao busca locais: ' + response)
            setLocais([]);
        }

    }

    const alteraStateLocal = (item) => {
        setLocal(item);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.labelData}>Descrição da atividade</Text>
            <TextInput placeholder={"Descrição da atividade"} value={descricao} onChangeText={(text) => setDescricao(text)} style={styles.input} />
            <Text style={styles.labelData}>Local</Text>
            <View style={styles.containerRow}>
                <TextInput placeholder={"Descrição do local"} value={nomeLocal} onChangeText={(text) => setNomeLocal(text)} style={styles.input} />
                <TouchableOpacity style={{}} onPress={buscaLocais}>
                    <Image source={require('../../imgs/search-icon.png')} />
                </TouchableOpacity>
            </View>
            <FlatList
                style={{ flexGrow: 1, flex: 1, flexDirection: 'column' }}
                contentContainerStyle={{ alignItems: 'center' }}
                extraData={locais}
                data={locais}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                        <TouchableOpacity style={styles.listItem} onPress={() => {
                            setLocal(item)
                            setNomeLocal(item.name)
                            setLocais([])
                        }} >
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                )}
            />

            <TouchableOpacity style={styles.botaoCriar} onPress={() => {
                if (descricao == "") {
                    alert('A viagem precisa ter um apelido!');
                }
                else {
                    salvaAtividade();
                }
            }}>
                <Text style={styles.botaoCriarTexto}>Criar atividade</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    containerRow:{
        flexDirection: 'row',
        width: '95%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'flex-start'
    },
    containerData: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    containerAddFuncionarios: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
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
        maxWidth: '90%'
    },
    inputAddParticipante: {
        marginTop: '3%',
        width: '90%',
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
        padding: 10,
        borderRadius: 40,
        marginTop: '5%',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
    },
    botaoCriarTexto: {
        textAlign: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontSize: 22,
        flexGrow: 1
    },
    headerCardParticipante: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    containerDataCelular: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexGrow: 1
    },
    inputDataCelular: {
        marginTop: 25,
        width: '100%',
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
        width: 130,
        padding: 15,
        fontSize: 16,
        borderRadius: 41,
        backgroundColor: '#EBEBEB',
        textAlign: 'center',
        color: '#333333',
        marginHorizontal: '3%',
    },
    listItem: {
        marginTop: 1,
        padding: 10,
        borderRadius: 13,
        width: '95%',
        minWidth: '95%',
        maxWidth: '95%',
        minHeight: 50,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#EBEBEB'
    }

});
