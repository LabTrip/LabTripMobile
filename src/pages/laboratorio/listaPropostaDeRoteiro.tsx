import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, RefreshControl, ScrollView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BotaoMais from '../../components/botaoMais';
import CardRoteiro from '../../components/cardRoteiro';
import normalize from '../../components/fontSizeResponsive'
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Roteiro {
    id: string,
    descricao: string,
    dataInicio: Date,
    dataFim: Date,
    statusId: number
}

export default function ListaPropostaDeRoteiro() {
    const moment = require('moment');
    const navigation = useNavigation();
    let token;
    const [roteiros, setRoteiros] = useState<Roteiro[]>([])
    const [refreshing, setRefreshing] = React.useState(false);

    let listaRoteiros = [
        {
            id: '1',
            descricao: 'Roteiro 1 ',
            dataInicio: new Date,
            dataFim: new Date,
            statusId: 1
        },
        {
            id: '2',
            descricao: 'Roteiro 2',
            dataInicio: new Date(1995, 5, 26),
            dataFim: new Date(1995, 10, 26),
            statusId: 6
        },
        {
            id: '3',
            descricao: 'Roteiro 3',
            dataInicio: new Date,
            dataFim: new Date,
            statusId: 7
        },
        {
            id: '4',
            descricao: 'Roteiro 4',
            dataInicio: new Date,
            dataFim: new Date,
            statusId: 10
        }
    ];



    useEffect(() => {
        setRoteiros(listaRoteiros);
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
                <Text style={styles.tituloTop}>Propostas de roteiro</Text>
            </View>
            <FlatList
                //style={{ flexGrow: 1, flex: 1, flexDirection: 'column' }}
                contentContainerStyle={{ alignItems: 'center' }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                data={listaRoteiros}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <CardRoteiro key={item.id} nome={item.descricao} dataInicio={moment(item.dataInicio).format('DD/MM/yyyy')} dataFim={moment(item.dataFim).format('DD/MM/yyyy')}
                        status={item.statusId} item={item} navigate={'EditarRoteiro'} />
                )}
            />
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
        marginTop: '3%',
        width: '92%',
        backgroundColor: '#F2F2F2',
        borderRadius: 7,
        height: '10%'
    },
    tituloTop: {
        fontSize: normalize(18)
    }
})