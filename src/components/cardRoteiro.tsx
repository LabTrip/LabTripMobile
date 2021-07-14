import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import normalize from './fontSizeResponsive';
import i18n from '../translate/i18n';

let corDoCard, corBordaDoCard, status, corDoStatus;

export default function CardRoteiro(props) {

    const navigation = useNavigation();

    switch (props.status) {
        case 1:
            corDoCard = '#FFFDD1';
            corBordaDoCard = '#F8EC12';
            status = i18n.t('status.planejamento');
            corDoStatus = '#B7AF0B'
            break;
        case 6:
            corDoCard = '#CEF7E3';
            corBordaDoCard = '#0FD06F';
            status = i18n.t('status.aprovado');
            corDoStatus = '#0FD06F';
            break;
        case 7:
            corDoCard = '#FFCCCC';
            corBordaDoCard = '#FF0000';
            status = i18n.t('status.reprovado');
            corDoStatus = '#D12323'
            break;
        default:
            corDoCard = '#F0F0F0';
            corBordaDoCard = '#787878';
            status = "Não definido"
            corDoStatus = '#333333';
            break;
    }

    return (
        <TouchableOpacity style={[styles.cardViagens,
        { backgroundColor: corDoCard, borderLeftColor: corBordaDoCard }]}
            onPress={() => navigation.navigate(props.navigate, { roteiro: props.item , viagem: props.viagem})}>
            <Text style={styles.nome}>{props.nome}</Text>
            <Text>
                <Text style={styles.label}>Status: </Text>
                <Text style={{ color: corDoStatus }}>{status}</Text>
            </Text>
            <Text>
                <Text style={styles.label}>{i18n.t('cardRoteiro.versao')}: </Text>
                <Text style={{ color: corDoStatus }}>{props.versao}</Text>
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardViagens: {
        marginTop: 25,
        padding: 10,
        borderRadius: 13,
        borderLeftWidth: 6,
        minWidth: '100%',
        width: '100%',
        height: 143,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    label: {
        fontWeight: 'bold'
    },
    nome:{
        textAlign: 'center',
        maxWidth: '90%'
    }
});

