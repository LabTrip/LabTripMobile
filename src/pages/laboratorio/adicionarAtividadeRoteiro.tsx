import React, { useState, Component, Fragment } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import normalize from '../../components/fontSizeResponsive';
import DateTimePicker from '@react-native-community/datetimepicker';
import SearchableDropdown from 'react-native-searchable-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
const moment = require('moment');

const atividadesViewModel = (atividade) => ({
    id: atividade.id,
    name: atividade.descricao
  });

export default function AdicionarAtividadeRoteiro({ route }) {
    const navigation = useNavigation();
    const [roteiro, setRoteiro] = useState(route.params.roteiro);
    const [atividade, setAtividade] = useState();
    const [apelido, onChangeApelido] = useState("");
    const [selectedValue, setSelectedValue] = useState(1);
    const [dataInicio, serDataInicio] = useState(new Date());
    const [dataFim, setDataFim] = useState(new Date());
    const [custo, setCusto] = useState();
    const [status, setStatus] = useState({id: 1, descricao: "Em planejamento"})
    const [item, setItem] = useState();
    const [descAtividade, setDescAtividade] = useState('');

    var itemsExample = [];

    const [items, setItems] = useState(itemsExample);
    
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
                return i.map((a) => atividadesViewModel(a))
            }
            else{
                return json.map((a) => atividadesViewModel(a))
            }
            //setAtividades(json);
        }
        else{
            console.log(response)
        }
    }

    return (
        <View style={styles.container}>
            <Fragment >
                <SearchableDropdown
                    onItemSelect={(item) => {
                        setDescAtividade(item.descricao);
                        setAtividade(item)
                    }}
                    containerStyle={{ padding: 5 , width: '100%', alignItems: 'center', justifyContent: 'center'}}
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
                        style: styles.input
                        , 
                        value: descAtividade,
                        onTextChange: async (text) => {
                            setDescAtividade(text);
                            const resultados = await buscaAtividades(text)
                            console.log(resultados)
                            setTimeout(() => setItems(resultados), 500)
                        }
                    }
                    }
                    listProps={
                    {
                        nestedScrollEnabled: true,
                    }
                    }
                />
            </Fragment>
            <TextInput placeholder={"Apelido do roteiro"} value={apelido} style={styles.input} onChangeText={(texto) => onChangeApelido(texto)} />
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
