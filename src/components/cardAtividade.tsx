import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CardAtividade(props) {
    const navigation = useNavigation();

    const [idUsuario, setIdUsuario] = React.useState('');

    const getUserId = async () => {
        //captura o id do usuário armazenado no dispositivo
        const id = await AsyncStorage.getItem('USER_ID') || "";
        if (id == "") {
            alert("Erro ao capturar informações do usuário. Por favor reinicie a aplicação.")
        }
        else {
            //remove aspas
            setIdUsuario(id.toString().replace(/"/g, ''));
        }
    };

    //propriedades do botao confimar e cancelar atividade.
    let corBotaoConfimar = '#0FD06F';
    let corBotaoCancelar = '#FF2424';
    let disabled = false;


    getUserId();


    //muda cor e desativa botões se o usuário não for o dono da viagem.
    if (props.viagem.usuarioDonoId != idUsuario) {
        corBotaoConfimar = '#000';
        corBotaoCancelar = '#000';
        disabled = true;
    }


    return (
        <TouchableOpacity style={styles.cardRoteiro} onPress={() => navigation.navigate('DetalhesAtividade', { atividade: props.item, data: props.data })}>
            <Text style={styles.textoTitulo}>{props.nome} </Text>
            <View style={styles.detalhes}>
                <Text style={styles.textoDetalhes}>Local: {props.local}{"\n"}Horário: {props.horario}</Text>
                <TouchableOpacity disabled={disabled}>
                    <MaterialCommunityIcons name="check-bold" color={corBotaoConfimar} size={29} />
                </TouchableOpacity>
                <TouchableOpacity disabled={disabled}>
                    <MaterialCommunityIcons name="close-thick" color={corBotaoCancelar} size={29} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardRoteiro: {
        backgroundColor: '#F2F2F2',
        justifyContent: 'center',
        marginTop: '3%',
    },
    textoTitulo: {
        fontSize: 18,
        color: '#999999',
        marginLeft: 15,
    },
    textoDetalhes: {
        fontSize: 16,
        color: '#999999',
        marginLeft: 15,
        width: '65%',
        flexWrap: 'wrap',
    },
    detalhes: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    }
});

function usetState(): { idUsuario: any; setIdUsuario: any; } {
    throw new Error('Function not implemented.');
}
