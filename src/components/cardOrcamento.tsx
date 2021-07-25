import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import i18n from '../translate/i18n';


export default function CardOrcamento(props) {
    const navigation = useNavigation();

    return (
        <View style={styles.cardOrcamento}>
            <View style={styles.containerRow}>
                <Text style={styles.texto}>{i18n.t('cardOrcamento.orcamentoPlanejado')}: R$ {props.planejado.toFixed(2)}</Text>
                <TouchableOpacity disabled={props.editar == false && props.tipoOrcamento == 'Geral' ? true : false} onPress={() => navigation.navigate('EditarOrcamentoPlanejado', {orcamento:props.planejado.toFixed(2), roteiro: props.roteiro, tipoOrcamento: props.tipoOrcamento, atualizarEstado: props.atualizarEstado})} >
                    <MaterialCommunityIcons name={'pencil'} color={'black'} size={25} />
                </TouchableOpacity>
            </View>
            <View>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.texto}>{i18n.t('cardOrcamento.saldoAtual')}: R$ {props.saldoAtual.toFixed(2)}</Text>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 18,
        color: '#999999',
    },
    cardOrcamento: {
        width: '90%',
        backgroundColor: '#F2F2F2',
        borderRadius: 7,
        flexDirection: 'column',
        padding: '2%'
    },
    containerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: '2%',
        marginRight: '2%',
    },
    texto: {
        fontSize: 18,
        color: '#999999',
        flexWrap: 'wrap',
        width: '90%'
    },
})
