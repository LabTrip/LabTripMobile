import React, { useState } from 'react';
import { View, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';


export default function BarraPesquisa(props) {
    const [apelidoViagem, onChangeApelidoViagem] = useState(props.apelido || "");

    const pesquisaViagem = (viagens, callback) => {
        //chama a função callback passando o array com filtro de texto
        callback(viagens.filter(
            viagens => viagens.descricao.toUpperCase().includes(apelidoViagem.toUpperCase())
        )
        );
    }

    return (
        <View style={styles.barra}>
            <TextInput placeholder={props.texto} style={styles.input} value={apelidoViagem} onChangeText={text => onChangeApelidoViagem(text)} />
            <TouchableOpacity onPress={() => pesquisaViagem(props.auxViagens, props.callbackFunction)}>
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