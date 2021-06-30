import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Balloon from "react-native-balloon";

let orientacaoBalao, corBordaDoCard, status, corDoStatus;

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
            orientacaoBalao = 'right'
            return 'Você'
        }
        else{
            orientacaoBalao = 'left'
            return props.enviadoPor;
        }
    }

    const orientacao = () => {
        if(props.usuarioId === props.item.metadata.usuarioId){
            return 'right'
        }
        else{
            return 'left'
        }
    }

    return (
        <View style={styleAlign()}>
            <Balloon
            borderColor="#F2F2F2"
            backgroundColor="#FFFFFF"
            borderWidth={1}
            borderRadius={20}
            triangleSize={10}
            triangleDirection={orientacao()}
            triangleOffset={'30%'}
            containerStyle={styles.cardMensagem}
            onPress={() => console.log("press")}
            >
                <View style={styles.containerEviadoPor} >
                    <Text style={styles.label}>{exibirNome()}</Text>
                </View>
                <View style={styles.containerMensagem}>
                    <Text>{props.mensagem}</Text>
                </View>
            </Balloon>
            
        </View>
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
        maxWidth:'80%',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'flex-start'
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
    },
    leftArrow: {
        position: "absolute",
        backgroundColor: "#dedede",
        //backgroundColor:"red",
        width: 20,
        height: 25,
        bottom: 0,
        borderBottomRightRadius: 25,
        left: -10
    },
    leftArrowOverlap: {
        position: "absolute",
        backgroundColor: "#eeeeee",
        //backgroundColor:"green",
        width: 20,
        height: 35,
        bottom: -6,
        borderBottomRightRadius: 18,
        left: -20
    
    }
});