import React, { useState } from 'react';
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

    const styleAlign = () => {
        if(props.usuarioId === props.item.metadata.usuarioId){
            return styles.cardAlignEnd
        }
        else{
            return styles.cardAlignStart
        }
    }

    const exibirNome = () => {
        if(props.usuarioId === props.item.metadata.usuarioId){
            return 'Você'
        }
        else{
            return props.enviadoPor;
        }
    }

    return (
        <TouchableOpacity style={styleAlign()}>
            <View style={styles.cardMensagem}>
                <View style={styles.containerEviadoPor} >
                    <Text style={styles.label}>{exibirNome()}</Text>
                </View>
                <View style={styles.containerMensagem}>
                    <Text>{props.mensagem}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardAlignStart:{
        marginTop: 20,
        marginHorizontal: '5%',
        alignItems: 'flex-start',
    },
    cardAlignEnd:{
        marginTop: 20,
        marginHorizontal: '5%',
        alignItems: 'flex-end',
    },
    cardMensagem: {
        margin: 0,
        padding: 10,
        borderRadius: 13,
        flex: 1,
        maxWidth:'80%',
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