import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

let corDoCard, corBordaDoCard, status, corDoStatus;

interface Mensagem {
    id: string,
    mensagem: string,
    usuarioId: Date,
    enviadoEm: Date,
    chatId: number,
    enviadaPor: string
}

export default function CardViagem(props) {

    const navigation = useNavigation();

    return (
        <TouchableOpacity style={styles.cardMensagem}>
            <View style={styles.containerEviadoPor}>
                <Text style={styles.label}>{props.enviadoPor}</Text>
            </View>
            <View style={styles.containerMensagem}>
                <Text>{props.mensagem}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardMensagem: {
        marginTop: 25,
        marginHorizontal: '5%',
        padding: 10,
        borderRadius: 13,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        backgroundColor: 'white'
    },
    containerEviadoPor:{
        marginTop: 5,
        marginBottom: 5
    },
    containerMensagem:{
        marginTop: 5
    },
    label: {
        fontWeight: 'bold'
    }
});

