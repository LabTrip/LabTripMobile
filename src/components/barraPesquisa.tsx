import React, { useState } from 'react';
import { View, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';


export default function BarraPesquisa(props) {
    const [apelidoViagem, onChangeApelidoViagem] = useState(props.apelido || "");

    let teste;

    const pesquisaViagem = (viagens, callback) => {
        //transforma a descrição das viagens em letras minusculas
        /*viagens = viagens.map(function (viagem) {
            viagem.descricao = viagem.descricao.toLocaleLowerCase();
            return viagem;
        })*/
        callback(viagens.filter(
            viagens => viagens.descricao.includes(apelidoViagem)
            )
        );
    }

    return (
        <View style={styles.barra}>
            <TextInput placeholder={props.texto} style={styles.input} value={apelidoViagem} onChangeText={text => onChangeApelidoViagem(text)} />
            <TouchableOpacity onPress={() => pesquisaViagem(props.viagens, props.callbackFunction)}>
                <Image source={require('../imgs/search-icon.png')} />
            </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
    barra: {
        width: '100%',
        backgroundColor: '#000000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
    },
    input: {
        marginRight: 25,
        width: 266,
        height: 30,
        backgroundColor: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        borderRadius: 32,
    },
}
);