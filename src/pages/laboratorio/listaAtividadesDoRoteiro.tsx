import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, RefreshControl, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BotaoMais from '../../components/botaoMais';
import CardAtividadeAgencia from '../../components/cardAtividadeAgencia';
import normalize from '../../components/fontSizeResponsive'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

interface Roteiro {
    id: string,
    nome: string,
    local: string,
    horario: string,
    statusId: number
}

export default function ListaAtividadesDoRoteiro() {
    const moment = require('moment');
    const navigation = useNavigation();
    let token;
    const [roteiros, setRoteiros] = useState<Roteiro[]>([])
    const [refreshing, setRefreshing] = React.useState(false);
    const [selectedValue, setSelectedValue] = useState('');

    const getViagens = async () => {
        return await fetch('https://labtrip-backend.herokuapp.com/viagens', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        });
    }

    let listaRoteiros = [
        {
            id: '1',
            nome: 'Roteiro 1 ',
            local: 'Rua wagner de souza ferreira, 38b - Osasco - Brasil',
            horario: '11/01/2020',
            statusId: 1
        },
        {
            id: '2',
            nome: 'Roteiro 2',
            local: 'rua wagner de souza ferreira, 38b - Osasco - Brasil',
            horario: '12/01/2020',
            statusId: 6
        },
        {
            id: '3',
            nome: 'Roteiro 3',
            local: 'rua wagner de souza ferreira, 38b - Osasco - Brasil',
            horario: '11/01/2020',
            statusId: 7
        },
        {
            id: '4',
            nome: 'Roteiro 4',
            local: 'rua wagner de souza ferreira, 38b - Osasco - Brasil',
            horario: '11/01/2020',
            statusId: 2
        }
    ];

    useEffect(() => {
        const request = async () => {
            try {
                const value = await AsyncStorage.getItem('AUTH');
                if (value != null) {
                    token = JSON.parse(value)
                    const response = await getViagens();
                    const json = await response.json();
                    if (response.status == 200) {
                        setRoteiros(json);
                    }
                }
            }
            catch (e) {
                alert(e)
            }
        }
        request()
    }, [refreshing]);

    let datas = new Array();
    listaRoteiros.forEach((a) => datas.push(a.horario))
    var filtroDatas = datas.filter((v, i, a) => a.indexOf(v) === i);



    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false)
        }, 0);
    }, [refreshing]);

    return (
        <View style={styles.conteudo}>
            <BotaoMais onPress={() => navigation.navigate('CriarRoteiro')} />
            <View style={styles.containerTop}>
                <Picker style={styles.pickerComponente}
                    prompt="Tipo de usuário"
                    mode="dropdown"

                    selectedValue={selectedValue}
                    onValueChange={(itemValue, value) => {
                        setSelectedValue(itemValue)
                        setRoteiros(listaRoteiros.filter(a => a.horario == itemValue));
                        
                    }}>
                    {
                        filtroDatas?.map((a) => {
                            return <Picker.Item label={a} value={a} />
                        })
                    }
                </Picker>
            </View>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>
                {
                    roteiros?.map((a) => {
                        return <CardAtividadeAgencia key={a.id} nome={a.nome} local={a.local} horario={a.horario} />
                    })
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    conteudo: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    containerTop: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        borderRadius: 7,

    },
    tituloTop: {
        fontSize: normalize(18)
    },
    pickerComponente: {
        marginTop: '3%',
        width: '96%',
        fontSize: 16,
        borderRadius: 10000,
        backgroundColor: '#EBEBEB',
        color: '#333333',
    },
})