import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../translate/i18n';

export default function CardAtividade(props) {
    const navigation = useNavigation();

    const [idUsuario, setIdUsuario] = React.useState('');

    const getUserId = async () => {
        //captura o id do usuário armazenado no dispositivo
        const id = await AsyncStorage.getItem('USER_ID') || "";
        if (id == "") {
            alert(i18n.t('cardAtividade.erroInfoUsuario'))
        }
        else {
            //remove aspas
            setIdUsuario(id.toString().replace(/"/g, ''));
        }
    };

    const retornaToken = async () => {
        let localToken = await AsyncStorage.getItem('AUTH');
        if (localToken != null) {
            localToken = JSON.parse(localToken)
        }
        return localToken;
    }

    const atualizaAtividade = async (statusId) => {
        let localToken = await retornaToken() || '';


        const response = await fetch('https://labtrip-backend.herokuapp.com/roteiroAtividades/' + props.item.id, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localToken
            },
            body: JSON.stringify({
                "id": props.item.id,
                "atividadeId": props.item.atividadeId,
                "roteiroId": props.item.roteiroId,
                "versaoRoteiro": props.item.versaoRoteiro,
                "dataInicio": props.item.dataInicio.toString(),
                "dataFim": props.item.dataFim.toString(),
                "custo": props.item.custo,
                "statusId": statusId,
                "observacaoCliente": props.item.observacaoAgente,
                "observacaoAgente": props.item.observacaoAgente
            })
        });
        const json = await response.json();
        //seta lista de atividades se o status da resposta for 200
        if (response.status == 200) {
            props.callback(true);
            alert(i18n.t('cardAtividade.atividadeAtualizada'));
            setTimeout(() => {
                props.callback(false);
            }, 300);

        }
        else {
            alert(json.mensagem);
        }
    }

    //propriedades do botao confimar e cancelar atividade.
    let corBotaoConfimar = '#0FD06F';
    let corBotaoCancelar = '#FF2424';
    let disabled = false;

    getUserId();

    //muda cor e desativa botões se o usuário não for o dono da viagem.
    if (props.viagem.usuarioDonoId != idUsuario) {
        corBotaoConfimar = '#d3d3d3';
        corBotaoCancelar = '#d3d3d3';
        disabled = true;
    }

    return (
        <TouchableOpacity style={styles.cardRoteiro} onPress={() => navigation.navigate('DetalhesAtividade', { atividade: props.item, data: props.data })}>
            <Text style={styles.textoTitulo}>{props.nome} </Text>
            <View style={styles.detalhes}>
                <Text style={styles.textoDetalhes}>{i18n.t('cardAtividadeAgencia.local')}: {props.local}{"\n"}{i18n.t('cardAtividadeAgencia.horario')}: {props.horario}</Text>
                <TouchableOpacity onPress={() => atualizaAtividade(5)} disabled={disabled}>
                    <MaterialCommunityIcons name="check-bold" color={corBotaoConfimar} size={29} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => atualizaAtividade(4)} disabled={disabled}>
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
