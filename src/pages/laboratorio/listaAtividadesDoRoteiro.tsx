import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, RefreshControl, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BotaoMais from '../../components/botaoMais';
import CardAtividadeAgencia from '../../components/cardAtividadeAgencia';
import normalize from '../../components/fontSizeResponsive'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

interface Atividade {
    id: string,
    descricao: string,
    local: string,
    data: string,
    horario: string,
    statusId: number
}

export default function ListaAtividadesDoRoteiro() {
    const moment = require('moment');
    const navigation = useNavigation();
    let token;
    const [atividades, setAtividades] = useState<Atividade[]>([])
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

    let listaAtividade = [
        {
            id: '1',
            descricao: 'Parque aquático',
            local: 'Rua eusébio de frança, 320',
            data: '17/02/2021',
            horario: '18:00',
            statusId: 1
        },
        {
            id: '2',
            descricao: 'Trilha no mato ',
            local: 'Rua eusébio de frança, 320',
            data: '17/02/2021',
            horario: '18:00',
            statusId: 1
        },
        {
            id: '3',
            descricao: 'Almoço no Mamma Júlia',
            local: 'Rua eusébio de frança, 320',
            data: '18/02/2021',
            horario: '18:00',
            statusId: 1
        },
        {
            id: '4',
            descricao: 'Apresentação cultural ',
            local: 'Rua eusébio de frança, 320',
            data: '19/02/2021',
            horario: '18:00',
            statusId: 1
        }
    ];

    let datas = new Array();
    //criando lista com as datas de todas atividades
    listaAtividade.forEach((a) => datas.push(a.data))
    //removendo valores repetidos da lista
    var filtroDatas = datas.filter((v, i, a) => a.indexOf(v) === i);

    useEffect(() => {
        setSelectedValue(filtroDatas[0]);
        setAtividades(listaAtividade.filter(a => a.data == filtroDatas[0]));
    }, [refreshing]);




    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false)
        }, 0);
    }, [refreshing]);

    return (
        <View style={styles.conteudo}>
            <View style={styles.containerTop}>
                <Picker style={styles.pickerComponente}
                    prompt="Tipo de usuário"
                    mode="dropdown"
                    selectedValue={selectedValue}
                    onValueChange={(itemValue, value) => {
                        setSelectedValue(itemValue);
                        setAtividades(listaAtividade.filter(a => a.data == itemValue));
                    }}>
                    {
                        filtroDatas?.map((a) => {
                            return <Picker.Item key={a} label={a} value={a} />
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
                    atividades?.map((a) => {
                        return <CardAtividadeAgencia key={a.id} nome={a.descricao} local={a.local} horario={a.horario} />
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
        color: '#333333',
    },
})