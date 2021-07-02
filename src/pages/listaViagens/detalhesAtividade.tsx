import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

export default function DetalhesAtividade({ route }) {
    const moment = require('moment');
    const [gostei, setGostei] = useState(parseInt(route.params.atividade.votoPositivo) || 0);
    const [naoGostei, setNaoGostei] = useState(parseInt(route.params.atividade.votoNegativo) || 0);
    let valorFormatado = route.params.atividade.custo.toFixed(2)
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.containerDetalhes}>
                <Text style={styles.tituloDetalhes}>{route.params.atividade.local}</Text>
                <View style={styles.containerDataStatus}>
                    <Text style={styles.textoDetalhes}>{moment(route.params.atividade.dataInicio).format('DD/MM/yyyy')}</Text>
                    <Text style={styles.textoStatus}>Agendada</Text>
                </View>
                <Text style={styles.textoDetalhes}>{moment(route.params.atividade.dataInicio).format('HH:mm')}</Text>
                <Text style={styles.textoDetalhes}>{route.params.atividade.endereco}</Text>
                <Text style={styles.textoDetalhes}>Ensolarado, 25°</Text>
            </View>
            <Text style={styles.tituloDetalhes}>Custo: R$ {valorFormatado}</Text>
            {route.params.planejamento != true ?
                (<View style={[styles.containerDetalhes, { height: '40%', flexDirection: 'row', justifyContent: 'space-between', padding: '3%' }]}>
                    <Text style={styles.tituloDetalhes}>
                        Midias
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('AdicionarMidias')}>
                        <MaterialCommunityIcons name="pencil" color={'black'} size={31} />
                    </TouchableOpacity>
                </View>) :
                (<View style={styles.containerVotos}>
                    <TouchableOpacity style={styles.botaoVoto} onPress={() => setGostei(gostei + 1)}>
                        <MaterialCommunityIcons name="heart" color={'#FF2424'} size={31} />
                        <Text>{gostei}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botaoVoto} onPress={() => setNaoGostei(naoGostei + 1)}>
                        <MaterialCommunityIcons name="close-thick" color={'#000000'} size={31} />
                        <Text>{naoGostei}</Text>
                    </TouchableOpacity>
                </View>)}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    containerDetalhes: {
        marginTop: '3%',
        marginBottom: '3%',
        backgroundColor: '#F2F2F2',
        width: '96%',
        borderRadius: 7,
    },
    containerDataStatus: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerVotos: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '96%',
        marginBottom: '3%'
    },
    textoStatus: {
        color: '#0FD06F',
        marginRight: '5%',
        fontSize: 15,
    },
    textoDetalhes: {
        marginLeft: '5%',
        color: '#999999',
        marginBottom: '3%',
        fontSize: 15,
        maxWidth: '90%',
        flexWrap: 'wrap'
    },
    tituloDetalhes: {
        textAlign: 'center',
        color: '#999999',
        fontSize: 24,
    },
    botaoVoto: {
        flexDirection: 'row',
    }
})